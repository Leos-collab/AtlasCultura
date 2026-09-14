import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Bookmark, 
  Check, 
  MapPin, 
  RefreshCw, 
  Bot, 
  Send, 
  Compass, 
  TrendingUp,
  Award,
  Layers
} from 'lucide-react';
import { SmartRecommendation, CulturalExperience, ExperienceCategory } from '../types';
import { CATEGORIES_CONFIG } from '../data/categories';
import { CategoryIcon } from './CategoryIcon';
import { SafeImage } from './SafeImage';

interface FriendsDiscoveryViewProps {
  userLogs: CulturalExperience[];
  onAddToWishlist: (item: Partial<CulturalExperience>) => void;
}

interface BotChatMessage {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  recommendations?: SmartRecommendation[];
  timestamp: string;
}

const BOT_PRESET_PROMPTS = [
  'Lugares culturais imperdíveis para o fim de semana',
  'Melhores museus e galerias de arte contemporânea',
  'Restaurantes com alma cultural e drinques autorais',
  'Espaços de música ao vivo e shows intimistas'
];

export const FriendsDiscoveryView: React.FC<FriendsDiscoveryViewProps> = ({
  userLogs,
  onAddToWishlist
}) => {
  const [botPrompt, setBotPrompt] = useState('');
  const [isBotThinking, setIsBotThinking] = useState(false);
  const [savedBotRecKeys, setSavedBotRecKeys] = useState<Record<string, boolean>>({});

  const [botMessages, setBotMessages] = useState<BotChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'bot',
      text: 'Olá! Sou seu Bot Curador de Lugares. Analiso seus interesses culturais e cruzamentos de referências para mapear os melhores espaços, galerias, teatros e palcos para você vivenciar.',
      timestamp: 'Agora',
      recommendations: [
        {
          title: "Exposição 'Mundos Flutuantes' de Ernesto Neto",
          category: "museu",
          matchReason: "Espaço com 96% de compatibilidade com seu apreço por instalações sensoriais e arte contemporânea.",
          suggestedAction: "Ingressos disponíveis para visitação nos fins de semana na Pinacoteca.",
          highlight: "Esculturas têxteis imersivas e arquitetura centenária",
          venue: "Pinacoteca de São Paulo - Luz",
          imageUrl: "https://images.unsplash.com/photo-1565008447742-97f6f38c985c?auto=format&fit=crop&w=800&q=80",
          tags: ["Exposição", "Instalação", "Pinacoteca"]
        },
        {
          title: "Cineclube Autoral & Debate Aberto",
          category: "filme",
          matchReason: "Cinema de rua independente com programação premiada internacionalmente e debates após a sessão.",
          suggestedAction: "Sessões especiais às quintas-feiras com direito a café do foyer.",
          highlight: "Projeção 35mm e debate com críticos convidados",
          venue: "Cineclube Reserva Cultural - Av. Paulista",
          imageUrl: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=800&q=80",
          tags: ["Cinema", "Cineclube", "Paulista"]
        },
        {
          title: "Cozinha & Brasa 212",
          category: "restaurante",
          matchReason: "Gastronomia autoral em pátio a céu aberto com coquetelaria premiada e ambientação botânica.",
          suggestedAction: "Reservar mesa no jardim interno para desfrutar da lareira e drinques de autor.",
          highlight: "Polvo na brasa e drinques autorais botânicos",
          venue: "Cozinha 212 - Pinheiros",
          imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
          tags: ["Gastronomia", "Coquetelaria", "Jardim"]
        },
        {
          title: "Noite Instrumental na Sala São Paulo",
          category: "show",
          matchReason: "Acústica considerada uma das melhores do mundo, com concertos sinfônicos e jazz orquestrado.",
          suggestedAction: "Chegar 30 minutos antes para apreciar o teto móvel arquitetônico.",
          highlight: "Apresentação da Orquestra Sinfônica com solistas convidados",
          venue: "Sala São Paulo - Estação Júlio Prestes",
          imageUrl: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&w=800&q=80",
          tags: ["Música", "Acústica", "Patrimônio"]
        }
      ]
    }
  ]);

  // Visual Chart Metric Data for the Bot
  const placeAffinities = useMemo(() => {
    const categories: { label: string; cat: ExperienceCategory; count: number; score: number; color: string }[] = [
      { label: 'Museus & Galerias', cat: 'museu', count: 14, score: 96, color: '#0d9488' },
      { label: 'Shows & Música ao Vivo', cat: 'show', count: 12, score: 93, color: '#7c3aed' },
      { label: 'Cinemas Independentes', cat: 'filme', count: 8, score: 88, color: '#2563eb' },
      { label: 'Gastronomia Cultural', cat: 'restaurante', count: 10, score: 91, color: '#ea580c' },
      { label: 'Teatros & Espetáculos', cat: 'peça', count: 6, score: 85, color: '#db2777' },
      { label: 'Roteiros de Viagem', cat: 'viagem', count: 5, score: 89, color: '#16a34a' },
    ];
    return categories;
  }, []);

  // Bot Ask Handler
  const handleAskBot = async (customText?: string) => {
    const query = (customText || botPrompt).trim();
    if (!query || isBotThinking) return;

    const userMsg: BotChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Agora'
    };

    setBotMessages(prev => [...prev, userMsg]);
    setBotPrompt('');
    setIsBotThinking(true);

    try {
      const res = await fetch('/api/ai-curator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userLogs: userLogs.map(l => ({
            title: l.title,
            category: l.category,
            vibeTag: l.vibeTag,
            rating: l.rating
          })),
          preferences: query
        })
      });

      let recs: SmartRecommendation[] = [];
      let replyMsg = `Com base na curadoria de espaços para "${query}", selecionei estes lugares especiais:`;
      if (res.ok) {
        const data = await res.json();
        if (data.replyText) replyMsg = data.replyText;
        if (data.recommendations && Array.isArray(data.recommendations)) recs = data.recommendations;
      }

      if (!recs || recs.length === 0) {
        recs = [
          {
            title: "Galeria Luisa Strina & Jardins Modernistas",
            category: "museu",
            matchReason: `Alinhado perfeitamente com sua pesquisa por "${query}". Espaço pioneiro de arte contemporânea latino-americana.`,
            suggestedAction: "Visitar durante a tarde para desfrutar da iluminação zenital natural.",
            highlight: "Acervo de grandes mestres contemporâneos",
            venue: "Jardins - São Paulo",
            imageUrl: "https://images.unsplash.com/photo-1545989253-02cc26577f88?auto=format&fit=crop&w=800&q=80",
            tags: ["Galeria", "Arte Contemporânea", "Jardins"]
          },
          {
            title: "Bistrô do Teatro & Terraço",
            category: "restaurante",
            matchReason: "Cenário ideal para encerrar uma noite cultural com gastronomia de produto e carta de vinhos selecionada.",
            suggestedAction: "Provar o menu confiança após os espetáculos da noite.",
            highlight: "Vista panorâmica para a praça histórica",
            venue: "Centro Histórico",
            imageUrl: "https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&w=800&q=80",
            tags: ["Gastronomia", "Vinho", "Teatro"]
          }
        ];
      }

      const botReply: BotChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: replyMsg,
        recommendations: recs,
        timestamp: 'Agora'
      };

      setBotMessages(prev => [...prev, botReply]);
    } catch (err) {
      console.error('Erro no Bot Curador:', err);
      const fallbackReply: BotChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: `Mapeei estes espaços culturais que combinam com seu interesse por "${query}":`,
        recommendations: [
          {
            title: "Bar dos Arcos - Subsolo do Teatro Municipal",
            category: "restaurante",
            matchReason: "Localizado sob os arcos de pedra originais de 1911, um dos pontos mais fascinantes da cidade.",
            suggestedAction: "Sentar nos balcões iluminados de vidro e pedir drinques autorais inspirados em óperas.",
            highlight: "Arquitetura monumental de pedra e ambiente intimista",
            venue: "Theatro Municipal de São Paulo",
            imageUrl: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80",
            tags: ["História", "Coquetelaria", "Patrimônio"]
          }
        ],
        timestamp: 'Agora'
      };
      setBotMessages(prev => [...prev, fallbackReply]);
    } finally {
      setIsBotThinking(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-1">
            <Compass className="w-4 h-4 text-amber-500" />
            <span>Curadoria de Lugares & Espaços Culturais</span>
          </div>
          <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
            Descoberta de Lugares
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Gráficos de afinidade cultural e curadoria do bot para descobrir seus próximos destinos.
          </p>
        </div>
      </div>

      {/* GRÁFICO DO BOT: Radar & Distribuição de Afinidade de Lugares */}
      <div className="bg-white dark:bg-stone-900 border border-amber-300/80 dark:border-stone-800 rounded-3xl p-5 sm:p-6 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 mb-4 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
              <TrendingUp className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif-title font-bold text-base text-stone-900 dark:text-stone-100">
                Gráfico do Bot: Mapeamento de Afinidade de Lugares
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Índice algorítmico de compatibilidade entre seus registros e os espaços culturais mapeados
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100/70 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 text-xs font-bold self-start sm:self-auto border border-amber-300/50">
            <Award className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
            <span>94% Sintonia Média</span>
          </div>
        </div>

        {/* Visual Bar Distribution Chart */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {placeAffinities.map((item, idx) => (
            <div 
              key={idx}
              className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-950/60 border border-stone-200/80 dark:border-stone-800 hover:border-amber-400/50 transition-colors"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200 flex items-center gap-1.5">
                  <CategoryIcon category={item.cat} className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </span>
                <span className="text-xs font-extrabold text-amber-700 dark:text-amber-400">
                  {item.score}% match
                </span>
              </div>

              {/* Progress visual bar */}
              <div className="w-full h-2.5 bg-stone-200 dark:bg-stone-800 rounded-full overflow-hidden mb-1.5">
                <div 
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${item.score}%`,
                    backgroundColor: item.color
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                <span>{item.count} lugares mapeados</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-400">Alta recomendação</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* BOT CURADOR DE LUGARES & CARDS COM IMAGEM REGISTRÁVEL EM DESEJOS */}
      <div 
        id="bot-curador-section"
        className="rounded-3xl border border-amber-300/80 dark:border-amber-500/30 bg-gradient-to-br from-amber-50/90 via-stone-50 to-amber-100/40 dark:from-stone-900 dark:via-stone-900 dark:to-amber-950/30 p-5 sm:p-6 shadow-sm relative overflow-hidden transition-colors"
      >
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-stone-900 dark:bg-amber-400 text-amber-400 dark:text-stone-950 flex items-center justify-center shadow-md shrink-0">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-title font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100">
                  Bot Curador de Lugares
                </h3>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Pronto para Recomendar
                </span>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-400">
                Peça indicações com fotos que você pode salvar diretamente na sua lista de desejos
              </p>
            </div>
          </div>
        </div>

        {/* Preset Prompt Buttons */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {BOT_PRESET_PROMPTS.map((promptText, i) => (
            <button
              key={i}
              type="button"
              onClick={() => handleAskBot(promptText)}
              disabled={isBotThinking}
              className="text-[11px] font-medium px-3 py-1.5 rounded-xl bg-white dark:bg-stone-800/80 border border-amber-200 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:border-amber-400 dark:hover:border-amber-500 hover:text-stone-900 dark:hover:text-amber-300 shadow-2xs transition-all cursor-pointer disabled:opacity-50"
            >
              ✦ {promptText}
            </button>
          ))}
        </div>

        {/* Bot Conversation Stream */}
        <div className="space-y-4 max-h-[560px] overflow-y-auto pr-1">
          {botMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-3xl rounded-2xl p-4 text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-stone-900 dark:bg-amber-400 text-amber-200 dark:text-stone-950 font-medium rounded-tr-xs shadow-xs'
                    : 'bg-white dark:bg-stone-950/90 text-stone-800 dark:text-stone-200 border border-stone-200/80 dark:border-stone-800 rounded-tl-xs shadow-xs w-full'
                }`}
              >
                <div className="flex items-center gap-1.5 mb-1.5 text-[10px] opacity-70 font-semibold uppercase tracking-wider">
                  {msg.sender === 'user' ? (
                    <span>Você</span>
                  ) : (
                    <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                      <Sparkles className="w-3 h-3" />
                      <span>Bot Curador Atlas</span>
                    </span>
                  )}
                </div>
                <p>{msg.text}</p>

                {/* Recommendations Cards Grid with Pictures */}
                {msg.recommendations && msg.recommendations.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-3.5 mt-3 pt-3 border-t border-stone-100 dark:border-stone-800">
                    {msg.recommendations.map((rec, rIdx) => {
                      const catConfig = CATEGORIES_CONFIG[rec.category] || CATEGORIES_CONFIG.outro;
                      const recKey = `${rec.title}-${rec.category}`;
                      const isSaved = !!savedBotRecKeys[recKey];

                      return (
                        <div
                          key={rIdx}
                          className="bg-stone-50 dark:bg-stone-900 border border-amber-200/80 dark:border-stone-700/80 rounded-2xl p-3.5 flex flex-col justify-between overflow-hidden shadow-xs hover:shadow-md transition-shadow"
                        >
                          <div>
                            {/* Photo matching place/experience - USER REQUEST */}
                            {rec.imageUrl && (
                              <div className="h-40 w-full mb-3 rounded-xl overflow-hidden relative shadow-2xs bg-stone-900">
                                <SafeImage
                                  src={rec.imageUrl}
                                  alt={rec.title}
                                  category={rec.category}
                                  fallbackTitle={rec.title}
                                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute top-2 left-2 flex items-center gap-1">
                                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold shadow-xs bg-stone-900/85 backdrop-blur-xs text-amber-300 border border-amber-400/20">
                                    <CategoryIcon category={rec.category} className="w-3 h-3" />
                                    {catConfig.label.split('&')[0]}
                                  </span>
                                </div>
                                <span className="absolute top-2 right-2 text-[10px] font-bold text-amber-950 bg-amber-400 shadow-xs px-2.5 py-0.5 rounded-full">
                                  Match Cultural
                                </span>
                              </div>
                            )}

                            <h5 className="font-serif-title font-bold text-stone-900 dark:text-stone-100 text-sm mb-1">
                              {rec.title}
                            </h5>

                            {/* Place / Venue */}
                            {rec.venue && (
                              <div className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400 mb-2 font-medium">
                                <MapPin className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
                                <span className="truncate">{rec.venue}</span>
                              </div>
                            )}

                            {/* Tags */}
                            {rec.tags && rec.tags.length > 0 && (
                              <div className="flex flex-wrap gap-1 mb-2.5">
                                {rec.tags.map((tag, tIdx) => (
                                  <span 
                                    key={tIdx} 
                                    className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-amber-50 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300 border border-amber-200/70 dark:border-amber-900/50"
                                  >
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}

                            <p className="text-xs text-stone-600 dark:text-stone-300 leading-snug mb-2.5">
                              {rec.matchReason}
                            </p>

                            {rec.suggestedAction && (
                              <p className="text-[11px] text-stone-500 dark:text-stone-400 italic mb-3">
                                💡 {rec.suggestedAction}
                              </p>
                            )}
                          </div>

                          {/* Action Button: Saves with Image directly to Wishlist/Desejos */}
                          <button
                            type="button"
                            disabled={isSaved}
                            onClick={() => {
                              onAddToWishlist({
                                title: rec.title,
                                category: rec.category,
                                venue: rec.venue || rec.title,
                                imageUrl: rec.imageUrl,
                                notes: `${rec.matchReason} • Dica: ${rec.suggestedAction || rec.highlight || ''}`,
                                vibeTag: (rec.tags && rec.tags[0]) || 'Recomendado por Bot',
                                status: 'wishlist'
                              });
                              setSavedBotRecKeys(prev => ({ ...prev, [recKey]: true }));
                            }}
                            className={`w-full py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                              isSaved
                                ? 'bg-emerald-700 dark:bg-emerald-600 text-white cursor-default shadow-xs'
                                : 'bg-stone-900 dark:bg-amber-400 hover:bg-stone-800 dark:hover:bg-amber-300 text-amber-300 dark:text-stone-950 shadow-xs active:scale-98'
                            }`}
                          >
                            {isSaved ? (
                              <>
                                <Check className="w-4 h-4 text-emerald-200" />
                                <span>Salvo na sua Lista de Desejos!</span>
                              </>
                            ) : (
                              <>
                                <Bookmark className="w-4 h-4" />
                                <span>Adicionar aos Desejos com Foto</span>
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isBotThinking && (
            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 italic py-2">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-500" />
              <span>O Bot Curador está mapeando os melhores lugares para você...</span>
            </div>
          )}
        </div>

        {/* Ask input form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAskBot();
          }}
          className="mt-4 flex items-center gap-2"
        >
          <input
            type="text"
            id="input-bot-prompt"
            value={botPrompt}
            onChange={(e) => setBotPrompt(e.target.value)}
            placeholder="Peça uma recomendação de lugar ao bot (ex: jazz intimista, galeria de fotografia, bistrô de cinema)..."
            className="flex-1 px-4 py-2.5 bg-white dark:bg-stone-950 border border-stone-300 dark:border-stone-700 rounded-xl text-xs text-stone-900 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
          <button
            type="submit"
            id="btn-send-bot-prompt"
            disabled={!botPrompt.trim() || isBotThinking}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-stone-900 dark:bg-amber-400 hover:bg-stone-800 dark:hover:bg-amber-300 text-amber-300 dark:text-stone-950 text-xs font-bold transition-colors cursor-pointer disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Perguntar</span>
          </button>
        </form>
      </div>
    </div>
  );
};
