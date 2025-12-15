import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Clients (Lazy initialization in handler is safer usually, but top level is fine if keys exist)
// We will check keys inside the handler to provide better error messages.

export async function POST(req: NextRequest) {
    try {
        const { messages, model } = await req.json();
        const lastMessage = messages[messages.length - 1];
        const userPrompt = lastMessage.content;

        // --- GOOGLE GEMINI MODELS ---
        if (model.startsWith("gemini")) {
            const apiKey = process.env.GOOGLE_API_KEY;
            if (!apiKey) {
                return NextResponse.json(
                    { error: "GOOGLE_API_KEY eksik. Lütfen .env.local dosyasını yapılandırın." },
                    { status: 500 }
                );
            }

            const genAI = new GoogleGenerativeAI(apiKey);
            // Map frontend model ID to Gemini model name
            // gemini-3-pro -> gemini-pro (using pro as standard for now, or 1.5-pro)
            const geminiModel = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });

            const result = await geminiModel.generateContent(userPrompt);
            const response = await result.response;
            const text = response.text();

            return NextResponse.json({ content: text });
        }

        // --- OPENAI MODELS (GPT, DALL-E) ---
        if (model.startsWith("gpt") || model.startsWith("dalle")) {
            const apiKey = process.env.OPENAI_API_KEY;
            if (!apiKey) {
                return NextResponse.json(
                    { error: "OPENAI_API_KEY eksik. Lütfen .env.local dosyasını yapılandırın." },
                    { status: 500 }
                );
            }

            const openai = new OpenAI({ apiKey });

            if (model.startsWith("dalle") || model.includes("image")) {
                // Image Generation
                const response = await openai.images.generate({
                    model: "dall-e-3",
                    prompt: userPrompt,
                    n: 1,
                    size: "1024x1024",
                });
                const imageUrl = response.data[0].url;
                // Return as markdown image
                return NextResponse.json({ content: `![Generated Image](${imageUrl})` });

            } else {
                // Chat Completion
                const completion = await openai.chat.completions.create({
                    messages: [
                        { role: "system", content: "Sen yardımcı bir yapay zeka asistanısın." },
                        ...messages.map((m: any) => ({ role: m.role, content: m.content }))
                    ],
                    model: model === "gpt-5-2" ? "gpt-4o" : "gpt-3.5-turbo", // Fallback mapping
                });

                return NextResponse.json({ content: completion.choices[0].message.content });
            }
        }

        // --- CLAUDE / OTHER (Mock or Fallback) ---
        // Since we don't have Anthropic SDK installed yet, we can simulate or ask user to add key.
        // For now, let's return a simulated response for others to avoid crashing.
        return NextResponse.json({
            content: `**${model}** için backend entegrasyonu henüz tamamlanmadı (API Anahtarı veya SDK eksik). \n\nLütfen Gemini veya GPT modellerini deneyin.`
        });

    } catch (error: any) {
        console.error("API Error:", error);
        return NextResponse.json(
            { error: "Bir hata oluştu: " + (error.message || "Bilinmeyen hata") },
            { status: 500 }
        );
    }
}
