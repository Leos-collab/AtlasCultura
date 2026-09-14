import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Lazy-initialized Gemini AI client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({ apiKey });
  }
  return aiClient;
}

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// AI Cultural Curator endpoint
app.post("/api/ai-curator", async (req, res) => {
  try {
    const { userLogs, friendsActivity, preferences } = req.body;
    const ai = getGeminiClient();

    if (!ai) {
      // Deterministic recommendations if API key is not provided
      const queryLower = (preferences || "").toLowerCase();
      let selectedRecs = [
        {
          title: "Exposição 'Mundos Ocultos: Arte & Percepção'",
          category: "museu",
          matchReason: "Inspirado no interesse mútuo por artes visuais e pela alta recomendação de Mariana Silva (94% afinidade)",
          suggestedAction: "Visita no final de semana ao Museu de Arte Contemporânea",
          highlight: "Obra imersiva imperdível",
          venue: "Museu de Arte Contemporânea",
          imageUrl: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=800&q=80",
          tags: ["Exposição", "Arte Contemporânea", "Fim de Semana"]
        },
        {
          title: "Viagem Cultural: Roteiro Histórico em Minas Gerais",
          category: "viagem",
          matchReason: "Combina arquitetura colonial, montanhas e gastronomia típica recomendada pelo seu círculo",
          suggestedAction: "Roteiro de 3 a 4 dias entre Ouro Preto e Tiradentes",
          highlight: "Casarios barrocos e ateliers artesanais",
          venue: "Ouro Preto & Tiradentes",
          imageUrl: "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=800&q=80",
          tags: ["Viagem", "História Colonial", "Natureza"]
        },
        {
          title: "Livro 'O Avesso da Pele' - Jeferson Tenório",
          category: "livro",
          matchReason: "Recomendado por Lucas Prado com nota máxima; encaixa na sua meta de leitura e reflexões profundas",
          suggestedAction: "Disponível nas principais livrarias e bibliotecas",
          highlight: "Vencedor do Prêmio Jabuti",
          venue: "Livraria da Travessa",
          imageUrl: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
          tags: ["Literatura", "Prêmio Jabuti", "Reflexão"]
        }
      ];

      if (queryLower.includes("filme") || queryLower.includes("cinema")) {
        selectedRecs = [
          {
            title: "Sessão Especial Cineclube & Clássicos Restaurados",
            category: "filme",
            matchReason: "Alinhado ao seu apreço por narrativas cinematográficas de impacto e debates artísticos",
            suggestedAction: "Sessão noturna com pipoca artesanal e debate",
            highlight: "Projeção 35mm em sala histórica",
            venue: "Cineclube Reserva Cultural",
            imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
            tags: ["Cinema", "Cineclube", "Filme Clássico"]
          },
          {
            title: "Mostra 'Vidas Cruzadas' no Cinema de Rua",
            category: "filme",
            matchReason: "3 amigos avaliaram com 5 estrelas pela fotografia e trilha sonora marcante",
            suggestedAction: "Chegar 15 minutos antes para garantir bons assentos centrais",
            highlight: "Direção premiada internacionalmente",
            venue: "Cine Belas Artes",
            imageUrl: "https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?auto=format&fit=crop&w=800&q=80",
            tags: ["Cinema", "Mostra Autoral", "Arte"]
          }
        ];
      } else if (queryLower.includes("viagem") || queryLower.includes("roteiro") || queryLower.includes("estrada")) {
        selectedRecs = [
          {
            title: "Rota dos Cafés Especiais & Mirantes da Serra",
            category: "viagem",
            matchReason: "Experiência completa unindo natureza, tranquilidade e café de pequenos produtores",
            suggestedAction: "Subir a serra pela manhã e assistir ao pôr do sol no mirante",
            highlight: "Degustação guiada de grãos premiados",
            venue: "Serra da Mantiqueira",
            imageUrl: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
            tags: ["Viagem", "Serra & Café", "Mirante"]
          },
          {
            title: "Escapada Cultural em Paraty",
            category: "viagem",
            matchReason: "Centro histórico tombado, livrarias charmosas e passeios de barco com águas calmas",
            suggestedAction: "Caminhar pelo calçamento de pedra pé-de-moleque ao entardecer",
            highlight: "Encontro de literatura, mar e casario colonial",
            venue: "Centro Histórico de Paraty",
            imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
            tags: ["Viagem", "Patrimônio Histórico", "Litoral"]
          }
        ];
      } else if (queryLower.includes("show") || queryLower.includes("música") || queryLower.includes("musica")) {
        selectedRecs = [
          {
            title: "Concerto Acústico & Vozes da MPB",
            category: "show",
            matchReason: "Recomendado com entusiasmo pelos seus amigos amantes de música ao vivo intimista",
            suggestedAction: "Ingressos antecipados para mesas próximas ao palco",
            highlight: "Harmonias e arranjos exclusivos ao vivo",
            venue: "Casa de Shows Blue Note",
            imageUrl: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
            tags: ["Show", "Música Ao Vivo", "MPB"]
          }
        ];
      } else if (queryLower.includes("teatro") || queryLower.includes("peça") || queryLower.includes("drama")) {
        selectedRecs = [
          {
            title: "Espetáculo Dramático 'O Silêncio dos Espelhos'",
            category: "peça",
            matchReason: "Encenação aclamada pela crítica teatral e indicada pelo seu círculo",
            suggestedAction: "Chegar com antecedência para apreciar o foyer histórico",
            highlight: "Atuação visceral do elenco principal",
            venue: "Teatro Municipal",
            imageUrl: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80",
            tags: ["Teatro", "Drama", "Espetáculo"]
          }
        ];
      }

      return res.json({
        source: "curated_engine",
        replyText: `Analisei suas preferências para "${preferences || 'descobertas culturais'}" cruzando com os gostos em comum da sua rede cultural:`,
        recommendations: selectedRecs
      });
    }

    const prompt = `Você é o Curador Cultural do Atlas Cultural, um assistente refinado, caloroso e apaixonado por arte, literatura, cinema, música, teatro, viagens e gastronomia.
Histórico recente do usuário:
${JSON.stringify(userLogs?.slice(0, 8) || [])}

Atividades recentes dos amigos com afinidade:
${JSON.stringify(friendsActivity?.slice(0, 6) || [])}

Pergunta ou preferência do usuário: "${preferences || 'Sugira algo especial para o fim de semana'}"

Gere uma resposta JSON estruturada com:
- "replyText": uma mensagem acolhedora e direta (2 a 3 frases) respondendo à dúvida ou solicitação do usuário.
- "recommendations": array de 2 a 3 recomendações personalizadas com os campos:
  * "title": nome da atração, livro, restaurante, peça, filme ou viagem
  * "category": exatamente uma dentre ["show", "filme", "livro", "museu", "peça", "festival", "restaurante", "viagem", "outro"]
  * "matchReason": por que isso combina com o gosto do usuário e conexão com os amigos (em português)
  * "suggestedAction": dica prática para viver essa experiência
  * "highlight": destaque curto e poético do ponto alto
  * "venue": nome do local, sala, teatro, restaurante ou espaço cultural correspondente
  * "tags": array de 2 a 3 strings com as etiquetas temáticas do que o usuário pediu (ex: ["Cinema", "Romance", "Fim de Semana"], ["Teatro", "Drama"], etc)
  * "imageUrl": URL de imagem não-vazia ou deixe para o sistema complementar

Responda APENAS com JSON válido.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    let data: any = {};
    try {
      const text = (response.text || "{}").trim().replace(/^```json\s*|\s*```$/g, '');
      data = JSON.parse(text);
    } catch (e) {
      console.error("JSON parse error:", e);
    }

    const fallbackImages: Record<string, string> = {
      museu: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=800&q=80",
      show: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=800&q=80",
      filme: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
      livro: "https://images.unsplash.com/photo-1512820790803-83ca734da794?auto=format&fit=crop&w=800&q=80",
      peça: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?auto=format&fit=crop&w=800&q=80",
      viagem: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
      trilha: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80",
      restaurante: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
      festival: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=800&q=80",
      outro: "https://images.unsplash.com/photo-1499781350541-7783f6c6a0c8?auto=format&fit=crop&w=800&q=80"
    };

    const formattedRecommendations = (data.recommendations || []).map((r: any) => {
      const cat = r.category || 'outro';
      const img = r.imageUrl && r.imageUrl.startsWith('http') ? r.imageUrl : (fallbackImages[cat] || fallbackImages.outro);
      const tags = Array.isArray(r.tags) && r.tags.length > 0 ? r.tags : [preferences || 'Cultura', 'Descoberta'];
      return {
        ...r,
        imageUrl: img,
        tags,
        venue: r.venue || 'Local Cultural'
      };
    });

    return res.json({
      source: "gemini",
      replyText: data.replyText || `Com base no seu perfil cultural e nos seus amigos, preparei estas recomendações para "${preferences}":`,
      recommendations: formattedRecommendations
    });
  } catch (error) {
    console.error("Error in /api/ai-curator:", error);
    return res.json({
      source: "fallback",
      replyText: "Tive um breve contratempo de conexão, mas aqui estão ótimas sugestões alinhadas ao seu círculo cultural:",
      recommendations: [
        {
          title: "Sessão Especial no Cineclube & Debate",
          category: "filme",
          matchReason: "Baseado nos filmes autorais que você e seu círculo mais apreciaram este ano",
          suggestedAction: "Sessão às quintas com debate aberto",
          highlight: "Experiência cinematográfica intimista"
        },
        {
          title: "Viagem Curta: Rota das Cidades Históricas",
          category: "viagem",
          matchReason: "Ideal para desacelerar e renovar energias após uma semana intensa",
          suggestedAction: "Pegar a estrada logo pela manhã e explorar museus e cafés locais",
          highlight: "Paisagens montanhosas e arquitetura secular"
        },
        {
          title: "Bistrô Esquina da Memória",
          category: "restaurante",
          matchReason: "3 amigos com alta afinidade gastronômica deram 5 estrelas para as massas artesanais",
          suggestedAction: "Reserve mesa na varanda arborizada",
          highlight: "Sobremesas autorais inesquecíveis"
        }
      ]
    });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
