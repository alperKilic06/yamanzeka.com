export type ModelCategory = "text" | "code" | "image" | "audio" | "analysis";

export interface AIModel {
  id: string;
  name: string;
  category: ModelCategory;
  description: string;
  color: string;
  logo: string;
  isNew?: boolean;
}

export const AI_MODELS: AIModel[] = [
  // Text / General LLMs
  {
    id: "gemini-3-pro",
    name: "Gemini 3.0 Pro",
    category: "text",
    description: "Google'ın en gelişmiş genel amaçlı modeli. Akıl yürütme ve çok modlu yeteneklerde lider.",
    color: "text-blue-500",
    logo: "/logos/gemini.png",
    isNew: true,
  },
  {
    id: "gpt-5-2",
    name: "GPT 5.2 Pro",
    category: "text",
    description: "OpenAI'ın en son amiral gemisi. Karmaşık görevler ve yaratıcı yazarlık için ideal.",
    color: "text-sky-500",
    logo: "/logos/gpt.png",
    isNew: true,
  },
  {
    id: "deepseek-v3-2",
    name: "DeepSeek V3.2",
    category: "text",
    description: "Açık kaynak dünyasının yeni kralı. GPT-5 seviyesinde performans sunar.",
    color: "text-indigo-500",
    logo: "/logos/deepseek.png",
    isNew: true,
  },
  {
    id: "claude-4-5",
    name: "Claude 4.5 Opus",
    category: "text",
    description: "Doğal dil işleme ve nüanslı yazımda rakipsiz. İnsan benzeri etkileşim.",
    color: "text-orange-500",
    logo: "/logos/claude.png",
  },
  {
    id: "llama-4",
    name: "Llama 4 Maverick",
    category: "text",
    description: "Meta'nın en güçlü açık kaynak modeli. Hız ve verimlilik odaklı.",
    color: "text-purple-500",
    logo: "/logos/llama.png",
  },
  {
    id: "command-r-plus",
    name: "Command R+",
    category: "text",
    description: "Cohere'in iş dünyası odaklı, RAG (Retrieval Augmented Generation) uzmanı modeli.",
    color: "text-teal-500",
    logo: "/logos/cohere.png",
    isNew: true,
  },
  {
    id: "qwen-2-5",
    name: "Qwen 2.5 Max",
    category: "text",
    description: "Alibaba'nın matematik ve mantık alanında üstün performans gösteren modeli.",
    color: "text-blue-600",
    logo: "/logos/qwen.png",
  },
  {
    id: "grok-4-1",
    name: "Grok 4.1",
    category: "text",
    description: "Gerçek zamanlı X (Twitter) verisine erişimi olan, esprili ve güncel model.",
    color: "text-zinc-500",
    logo: "/logos/grok.png",
  },

  // Coding Models
  {
    id: "codestral-mamba",
    name: "Codestral Mamba",
    category: "code",
    description: "Mistral'in kodlama için optimize edilmiş, ultra hızlı ve düşük gecikmeli modeli.",
    color: "text-yellow-500",
    logo: "/logos/mistral.png",
    isNew: true,
  },

  // Image Generation
  {
    id: "flux-1-pro",
    name: "Flux 1.0 Pro",
    category: "image",
    description: "Black Forest Labs'in hiper-gerçekçi görsel oluşturma modeli.",
    color: "text-cyan-500",
    logo: "/logos/flux.png",
    isNew: true,
  },
  {
    id: "midjourney-v6",
    name: "Midjourney v6",
    category: "image",
    description: "Sanatsal ve estetik görseller için endüstri standardı.",
    color: "text-zinc-500",
    logo: "/logos/midjourney.png",
  },
  {
    id: "dalle-3",
    name: "DALL-E 3",
    category: "image",
    description: "Prompt'lara sadık, yüksek detaylı görsel oluşturucu.",
    color: "text-sky-400",
    logo: "/logos/openai.png",
  },
  {
    id: "stable-diffusion-3",
    name: "Stable Diffusion 3",
    category: "image",
    description: "Metin-görsel uyumu yüksek, güçlü açık kaynak görsel motoru.",
    color: "text-purple-400",
    logo: "/logos/stability.png",
  },
];
