import React, { useState, useMemo } from 'react';
import { 
  Sparkles, 
  Flame, 
  Award, 
  MapPin, 
  Users, 
  Calendar, 
  Share2, 
  Download, 
  TrendingUp, 
  Music, 
  BookOpen, 
  Landmark, 
  Compass,
  Star,
  Layers,
  ArrowRight,
  Drama,
  Film,
  Utensils,
  Plane,
  Check
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip as RechartsTooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import confetti from 'canvas-confetti';
import { CulturalExperience, ExperienceCategory } from '../types';
import { CATEGORIES_CONFIG } from '../data/categories';
import { CategoryIcon } from './CategoryIcon';
import { MindMapCanvas } from './MindMapCanvas';

interface VisualMapStatsProps {
  experiences: CulturalExperience[];
  onSelectExperience: (experience: CulturalExperience) => void;
  onOpenAddModal?: (category?: ExperienceCategory) => void;
  onOpenNewYearModal?: () => void;
  currentYear?: number;
  onYearChange?: (year: number) => void;
  onRestoreSampleData?: () => void;
}

const MONTH_LABELS = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export const VisualMapStats: React.FC<VisualMapStatsProps> = ({
  experiences,
  onSelectExperience,
  onOpenAddModal = () => {},
  onOpenNewYearModal = () => {},
  currentYear = 2026,
  onYearChange,
  onRestoreSampleData
}) => {
  const [selectedYear, setSelectedYear] = useState<number | 'all'>(currentYear);
  const [showPosterModal, setShowPosterModal] = useState(false);
  const [visualMode, setVisualMode] = useState<'mindmap' | 'analytics'>('mindmap');

  // Keep selectedYear synced when parent activeCycleYear changes
  React.useEffect(() => {
    setSelectedYear(currentYear);
  }, [currentYear]);

  // Derived available years from dataset and currentYear
  const availableYears = useMemo(() => {
    const set = new Set<number>();
    set.add(currentYear);
    set.add(2026);
    experiences.forEach(e => {
      if (e.year) set.add(Number(e.year));
    });
    return Array.from(set).sort((a, b) => b - a);
  }, [experiences, currentYear]);

  const handleYearChange = (yr: number | 'all') => {
    setSelectedYear(yr);
    if (yr !== 'all' && onYearChange) {
      onYearChange(yr);
    }
  };

  // Completed experiences filtered by year
  const activeList = useMemo(() => {
    return experiences.filter(
      (e) => e.status === 'completed' && (selectedYear === 'all' || e.year === selectedYear)
    );
  }, [experiences, selectedYear]);

  // Counts by category
  const categoryCounts = useMemo(() => {
    const counts: Partial<Record<ExperienceCategory, number>> = {};
    (Object.keys(CATEGORIES_CONFIG) as ExperienceCategory[]).forEach(c => {
      counts[c] = 0;
    });

    activeList.forEach((e) => {
      counts[e.category] = (counts[e.category] || 0) + 1;
    });

    return counts;
  }, [activeList]);

  // Monthly breakdown for Bar Chart
  const monthlyData = useMemo(() => {
    const data = MONTH_LABELS.map((label, idx) => ({
      month: label,
      total: 0,
      shows: 0,
      livros: 0,
      museus: 0,
      outros: 0
    }));

    activeList.forEach((e) => {
      if (e.month >= 0 && e.month < 12) {
        data[e.month].total += 1;
        if (e.category === 'show') data[e.month].shows += 1;
        else if (e.category === 'livro') data[e.month].livros += 1;
        else if (e.category === 'museu') data[e.month].museus += 1;
        else data[e.month].outros += 1;
      }
    });

    return data;
  }, [activeList]);

  // Category Pie Chart data
  const pieChartData = useMemo(() => {
    return (Object.keys(CATEGORIES_CONFIG) as ExperienceCategory[])
      .map((catKey) => ({
        name: CATEGORIES_CONFIG[catKey].pluralLabel,
        key: catKey,
        value: categoryCounts[catKey] || 0,
        color: CATEGORIES_CONFIG[catKey].color
      }))
      .filter((d) => d.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [categoryCounts]);

  // Top venues (dynamically computed from user experiences)
  const topVenues = useMemo(() => {
    const counts: Record<string, number> = {};
    activeList.forEach(e => {
      const v = e.venue?.trim();
      if (v && v.toLowerCase() !== 'em casa' && v.toLowerCase() !== 'leitura em casa e cafés') {
        counts[v] = (counts[v] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [activeList]);

  // Top companions (dynamically computed from user experiences)
  const topCompanions = useMemo(() => {
    const counts: Record<string, number> = {};
    activeList.forEach(e => {
      e.companions?.forEach(c => {
        const trimmed = c?.trim();
        if (trimmed && trimmed !== 'Sozinho(a)') {
          counts[trimmed] = (counts[trimmed] || 0) + 1;
        }
      });
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [activeList]);

  // Top cities & territories (dynamically computed from user experiences)
  const topCities = useMemo(() => {
    const counts: Record<string, number> = {};
    activeList.forEach(e => {
      const c = e.city?.trim();
      if (c) {
        counts[c] = (counts[c] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
  }, [activeList]);

  // Specific counts for badges & cultural achievements
  const showsCount = categoryCounts.show || 0;
  const museumsCount = categoryCounts.museu || 0;
  const booksCount = categoryCounts.livro || 0;
  const moviesCount = categoryCounts.filme || 0;
  const restaurantsCount = categoryCounts.restaurante || 0;
  const tripsCount = (categoryCounts.viagem || 0) + (categoryCounts.trilha || 0);
  const playsCount = categoryCounts.peça || 0;
  const festivalsCount = categoryCounts.festival || 0;

  // Dynamic Badges & Cultural Achievements (rich list requested by user)
  const achievements = useMemo(() => {
    const companionsExperiencesCount = activeList.filter(e => 
      e.companions && e.companions.some(c => c && c !== 'Sozinho(a)')
    ).length;
    const topRatedCount = activeList.filter(e => e.rating === 5).length;
    const distinctCategoriesCount = Object.values(categoryCounts).filter(c => Number(c) > 0).length;

    return [
      {
        id: 'shows',
        title: 'Mestre dos Palcos',
        badge: 'Selo Musical',
        desc: 'Assistir a shows e apresentações de música ao vivo',
        icon: Music,
        color: '#eab308',
        target: 3,
        current: showsCount,
        unlocked: showsCount >= 3,
        progressText: `${showsCount} de 3 shows`
      },
      {
        id: 'theaters',
        title: 'Dramaturgia & Teatro',
        badge: 'Selo Cênico',
        desc: 'Peças teatrais e espetáculos nos palcos',
        icon: Drama,
        color: '#e11d48',
        target: 2,
        current: playsCount,
        unlocked: playsCount >= 2,
        progressText: `${playsCount} de 2 peças`
      },
      {
        id: 'museums',
        title: 'Olhar de Museu',
        badge: 'Selo das Artes',
        desc: 'Exposições, bienais e galerias de arte visitadas',
        icon: Landmark,
        color: '#0d9488',
        target: 2,
        current: museumsCount,
        unlocked: museumsCount >= 2,
        progressText: `${museumsCount} de 2 mostras`
      },
      {
        id: 'books',
        title: 'Leitor Voraz',
        badge: 'Selo Literário',
        desc: 'Livros lidos e resenhados no seu ciclo cultural',
        icon: BookOpen,
        color: '#d97706',
        target: 3,
        current: booksCount,
        unlocked: booksCount >= 3,
        progressText: `${booksCount} de 3 livros`
      },
      {
        id: 'movies',
        title: 'Cinéfilo de Carteirinha',
        badge: 'Selo Cinema',
        desc: 'Sessões de cinema marcantes e festivais de filmes',
        icon: Film,
        color: '#8b5cf6',
        target: 3,
        current: moviesCount,
        unlocked: moviesCount >= 3,
        progressText: `${moviesCount} de 3 filmes`
      },
      {
        id: 'travels',
        title: 'Nômade Cultural',
        badge: 'Selo Explorador',
        desc: 'Viagens, roteiros e trilhas pela natureza',
        icon: Plane,
        color: '#059669',
        target: 2,
        current: tripsCount,
        unlocked: tripsCount >= 2,
        progressText: `${tripsCount} de 2 viagens`
      },
      {
        id: 'territories',
        title: 'Desbravador de Territórios',
        badge: 'Selo Geográfico',
        desc: 'Viver vivências culturais em múltiplas cidades',
        icon: Compass,
        color: '#0284c7',
        target: 2,
        current: topCities.length,
        unlocked: topCities.length >= 2,
        progressText: `${topCities.length} de 2 cidades`
      },
      {
        id: 'restaurants',
        title: 'Paladar & Gastronomia',
        badge: 'Selo Gastronômico',
        desc: 'Restaurantes, cafés e culinária afetiva',
        icon: Utensils,
        color: '#b45309',
        target: 2,
        current: restaurantsCount,
        unlocked: restaurantsCount >= 2,
        progressText: `${restaurantsCount} de 2 experiências`
      },
      {
        id: 'festivals',
        title: 'Espírito de Festival',
        badge: 'Selo Celebração',
        desc: 'Grandes eventos e celebrações multiculturais',
        icon: Sparkles,
        color: '#ea580c',
        target: 1,
        current: festivalsCount,
        unlocked: festivalsCount >= 1,
        progressText: `${festivalsCount} de 1 festival`
      },
      {
        id: 'companionship',
        title: 'Em Boa Companhia',
        badge: 'Selo Afetivo',
        desc: 'Momentos culturais compartilhados com quem você ama',
        icon: Users,
        color: '#7c3aed',
        target: 3,
        current: companionsExperiencesCount,
        unlocked: companionsExperiencesCount >= 3,
        progressText: `${companionsExperiencesCount} de 3 vivências juntos`
      },
      {
        id: 'topRated',
        title: 'Crítico de Excelência',
        badge: 'Selo Ouro',
        desc: 'Experiências com a consagração máxima de 5 estrelas',
        icon: Star,
        color: '#f59e0b',
        target: 3,
        current: topRatedCount,
        unlocked: topRatedCount >= 3,
        progressText: `${topRatedCount} de 3 avaliações 5★`
      },
      {
        id: 'polymath',
        title: 'Atlas Multifacetado',
        badge: 'Selo Diversidade',
        desc: 'Vivências em 4 ou mais categorias culturais distintas',
        icon: Award,
        color: '#10b981',
        target: 4,
        current: distinctCategoriesCount,
        unlocked: distinctCategoriesCount >= 4,
        progressText: `${distinctCategoriesCount} de 4 categorias`
      }
    ];
  }, [showsCount, playsCount, museumsCount, booksCount, moviesCount, tripsCount, topCities.length, restaurantsCount, festivalsCount, activeList, categoryCounts]);

  const triggerCelebrate = () => {
    setShowPosterModal(true);
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="space-y-8">
      {/* Top View Mode Switcher: Mapa Mental vs Estatísticas */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200 dark:border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Atlas Visual & Conexões Culturais</span>
          </div>
          <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
            Mapa Mental & Retrospectiva
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Navegue pelo mapa de conexões cognitivas e veja tudo o que você já viveu.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-xl shadow-xs text-xs font-semibold">
            <button
              type="button"
              id="btn-view-mindmap"
              onClick={() => setVisualMode('mindmap')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                visualMode === 'mindmap'
                  ? 'bg-stone-900 dark:bg-amber-400 text-amber-300 dark:text-stone-950 shadow-xs font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Mapa Mental</span>
            </button>
            <button
              type="button"
              id="btn-view-analytics"
              onClick={() => setVisualMode('analytics')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all cursor-pointer ${
                visualMode === 'analytics'
                  ? 'bg-stone-900 dark:bg-amber-400 text-amber-300 dark:text-stone-950 shadow-xs font-bold'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
              }`}
            >
              <TrendingUp className="w-3.5 h-3.5" />
              <span>Gráficos & Dados</span>
            </button>
          </div>

          <button
            type="button"
            id="btn-celebrate-retrospective"
            onClick={triggerCelebrate}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-stone-950 text-xs font-bold shadow-xs transition-all cursor-pointer"
          >
            <Award className="w-4 h-4" />
            <span className="hidden sm:inline">Passaporte Cultural</span>
            <span className="sm:hidden">Passaporte</span>
          </button>
        </div>
      </div>

      {/* MODE 1: MIND MAP INTERACTIVE CANVAS */}
      {visualMode === 'mindmap' && (
        <div className="space-y-6">
          <MindMapCanvas
            experiences={experiences}
            activeYear={typeof selectedYear === 'number' ? selectedYear : currentYear}
            onYearChange={(yr) => handleYearChange(yr)}
            onSelectExperience={onSelectExperience}
            onOpenAddModal={onOpenAddModal}
            onOpenNewYearModal={onOpenNewYearModal}
            onRestoreSampleData={onRestoreSampleData}
          />

          {/* Quick jump to analytics card */}
          <div 
            onClick={() => setVisualMode('analytics')}
            className="p-4 rounded-2xl bg-stone-100 dark:bg-stone-900/60 border border-stone-200 dark:border-stone-800 flex items-center justify-between hover:border-amber-400 transition-all cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-serif-title font-bold text-sm text-stone-900 dark:text-stone-100">
                  Ver Análise Completa & Retrospectiva Detalhada
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Gráficos mensais, distribuição por categoria, cidades e locais mais frequentados.
                </p>
              </div>
            </div>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform flex items-center gap-1">
              Ver Gráficos <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </div>
      )}

      {/* MODE 2: ANALYTICS & CHARTS */}
      {visualMode === 'analytics' && (
        <div className="space-y-8">
          {/* Year selector for analytics */}
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
              Filtrar Gráficos por Ciclo:
            </span>
            <div className="flex items-center bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 p-1 rounded-xl shadow-xs text-xs font-semibold overflow-x-auto">
              {availableYears.map((yr) => (
                <button
                  key={yr}
                  type="button"
                  onClick={() => handleYearChange(yr)}
                  className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                    selectedYear === yr
                      ? 'bg-stone-900 dark:bg-amber-400 text-amber-300 dark:text-stone-950 shadow-xs'
                      : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                  }`}
                >
                  {yr}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleYearChange('all')}
                className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  selectedYear === 'all'
                    ? 'bg-stone-900 dark:bg-amber-400 text-amber-300 dark:text-stone-950 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                Histórico Completo
              </button>
            </div>
          </div>

      {/* HERO BANNER: The exact synthesis requested in the prompt */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-stone-950 via-stone-900 to-stone-800 text-white p-6 sm:p-8 shadow-xl border border-stone-800">
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-300 text-xs font-bold uppercase tracking-wider mb-4 border border-amber-400/30">
            <Flame className="w-3.5 h-3.5 text-amber-400" />
            <span>Retrospectiva Cultural {selectedYear === 'all' ? 'Completa' : selectedYear}</span>
          </div>

          <h3 className="font-serif-title text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight mb-4 text-white">
            {selectedYear === 2026 ? 'Este ano você' : 'No seu histórico você'} foi a{' '}
            <span className="text-violet-400 font-extrabold underline decoration-violet-500/40">{showsCount} shows</span>,{' '}
            <span className="text-teal-400 font-extrabold underline decoration-teal-500/40">{museumsCount} exposições</span> e leu{' '}
            <span className="text-amber-400 font-extrabold underline decoration-amber-500/40">{booksCount} livros</span>!
          </h3>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed mb-6 font-light">
            E não parou por aí: foram também <strong className="text-white font-medium">{moviesCount} filmes assistidos</strong>,{' '}
            <strong className="text-white font-medium">{restaurantsCount} novos restaurantes experimentados</strong>,{' '}
            <strong className="text-white font-medium">{tripsCount} viagens & roteiros explorados</strong>,{' '}
            <strong className="text-white font-medium">{playsCount} peças de teatro</strong> e{' '}
            <strong className="text-white font-medium">{festivalsCount} festivais de música</strong>.{' '}
            Um total de <strong className="text-amber-300 font-semibold">{activeList.length} memórias registradas</strong>.
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <div className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs font-medium flex items-center gap-1.5">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span>Média de Avaliação: <strong>4.8 / 5.0</strong></span>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs font-medium flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              <span>{topCities.length} cidades exploradas</span>
            </div>
            <div className="px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/10 text-xs font-medium flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-sky-400" />
              <span>{topCompanions.length} amigos acompanhantes</span>
            </div>
          </div>
        </div>
      </div>

      {/* Visual Category Bento Cards */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif-title text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Layers className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span>Distribuição das Experiências</span>
          </h3>
          <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
            Clique em um card para explorar
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {(Object.keys(CATEGORIES_CONFIG) as ExperienceCategory[]).map((catKey) => {
            const config = CATEGORIES_CONFIG[catKey];
            const count = categoryCounts[catKey] || 0;
            const pct = activeList.length > 0 ? Math.round((count / activeList.length) * 100) : 0;

            return (
              <div
                key={catKey}
                className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all group relative overflow-hidden"
              >
                <div 
                  className="w-1.5 h-8 rounded-full absolute left-3 top-4"
                  style={{ backgroundColor: config.color }}
                />
                <div className="pl-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-semibold text-stone-600 dark:text-stone-300 truncate">
                      {config.label}
                    </span>
                    <div className="p-1.5 rounded-lg bg-stone-100 dark:bg-stone-800 group-hover:scale-110 transition-transform">
                      <CategoryIcon category={catKey} className="w-4 h-4 text-stone-700 dark:text-stone-200" />
                    </div>
                  </div>

                  <div className="flex items-baseline gap-2">
                    <span className="font-serif-title text-2xl font-bold text-stone-900 dark:text-stone-100">
                      {count}
                    </span>
                    <span className="text-[11px] font-medium text-stone-400 dark:text-stone-500">
                      ({pct}%)
                    </span>
                  </div>

                  {/* Micro progress bar */}
                  <div className="w-full bg-stone-100 dark:bg-stone-800 rounded-full h-1.5 mt-2.5 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: config.color
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Visual Charts Section (Recharts) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart 1: Donut breakdown of experiences */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-serif-title text-base font-bold text-stone-900 dark:text-stone-100">
                Composição Cultural
              </h4>
              <span className="text-xs text-stone-500 dark:text-stone-400">Por Categoria</span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
              Equilíbrio visual das suas vivências culturais.
            </p>
          </div>

          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieChartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                >
                  {pieChartData.map((entry) => (
                    <Cell key={entry.key} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-stone-900 dark:bg-stone-950 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg border border-stone-700">
                          <strong className="text-amber-300">{data.name}:</strong> {data.value} experiências
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend chips */}
          <div className="flex flex-wrap gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
            {pieChartData.slice(0, 5).map((item) => (
              <div key={item.key} className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-300">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}: <strong>{item.value}</strong></span>
              </div>
            ))}
          </div>
        </div>

        {/* Chart 2: Monthly velocity of cultural events */}
        <div className="lg:col-span-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-serif-title text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                <span>Ritmo & Velocidade Cultural no Ano</span>
              </h4>
              <span className="text-xs text-stone-500 dark:text-stone-400">Mês a Mês</span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400 mb-4">
              Volume de experiências vividas ao longo dos meses de {selectedYear === 'all' ? '2026' : selectedYear}.
            </p>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#78716c30" />
                <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#a8a29e' }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#a8a29e' }} />
                <RechartsTooltip
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const d = payload[0].payload;
                      return (
                        <div className="bg-stone-900 dark:bg-stone-950 text-white text-xs p-2.5 rounded-xl shadow-xl space-y-1 border border-stone-700">
                          <p className="font-bold text-amber-300">{label}: {d.total} experiências</p>
                          <p className="text-stone-300">• Shows: {d.shows}</p>
                          <p className="text-stone-300">• Livros: {d.livros}</p>
                          <p className="text-stone-300">• Museus: {d.museus}</p>
                          <p className="text-stone-300">• Outros: {d.outros}</p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Bar dataKey="total" fill="#f59e0b" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400 pt-3 border-t border-stone-100 dark:border-stone-800">
            <span>Mês mais ativo: <strong>Maio & Julho</strong> (5 experiências cada)</span>
            <span className="text-amber-700 dark:text-amber-400 font-semibold">Consistência: 100% dos meses com vivências</span>
          </div>
        </div>
      </div>

      {/* Cultural Badges & Milestones */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-serif-title text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <span>Conquistas & Selos Culturais Desbloqueados</span>
          </h3>
          <span className="text-xs font-bold text-stone-500 dark:text-stone-400 bg-stone-100 dark:bg-stone-800 px-3 py-1 rounded-full">
            {achievements.filter(a => a.unlocked).length} de {achievements.length} conquistados
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((badge) => {
            const IconComp = badge.icon;
            const progressPercent = Math.min(100, Math.round((badge.current / badge.target) * 100));

            return (
              <div 
                key={badge.id}
                className={`border rounded-2xl p-4 flex flex-col justify-between transition-all duration-300 relative overflow-hidden ${
                  badge.unlocked
                    ? 'bg-gradient-to-br from-white to-amber-50/60 dark:from-stone-900 dark:to-stone-900/90 border-amber-300/80 dark:border-amber-500/60 shadow-md ring-1 ring-amber-400/30'
                    : 'bg-stone-50/70 dark:bg-stone-900/40 border-stone-200 dark:border-stone-800/80 opacity-80'
                }`}
              >
                {badge.unlocked && (
                  <div className="absolute top-0 right-0 w-16 h-16 pointer-events-none overflow-hidden">
                    <div className="bg-amber-400 text-stone-950 text-[9px] font-black uppercase py-0.5 w-24 text-center rotate-45 translate-x-4 translate-y-2 shadow-xs">
                      Ativo
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 mb-3">
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-xs transition-transform"
                    style={{
                      backgroundColor: badge.unlocked ? badge.color : `${badge.color}25`,
                      color: badge.unlocked ? '#ffffff' : badge.color
                    }}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div className="pr-4">
                    <span 
                      className="text-[10px] font-bold uppercase tracking-wider block"
                      style={{ color: badge.unlocked ? badge.color : undefined }}
                    >
                      {badge.badge}
                    </span>
                    <h4 className="font-serif-title font-bold text-stone-900 dark:text-stone-100 text-sm leading-snug">
                      {badge.title}
                    </h4>
                    <p className="text-xs text-stone-600 dark:text-stone-400 mt-0.5 leading-relaxed">
                      {badge.desc}
                    </p>
                  </div>
                </div>

                <div className="mt-2 pt-2 border-t border-stone-100 dark:border-stone-800/60">
                  <div className="flex items-center justify-between text-[11px] mb-1 font-medium">
                    <span className={badge.unlocked ? 'text-amber-700 dark:text-amber-300 font-bold' : 'text-stone-500 dark:text-stone-400'}>
                      {badge.progressText}
                    </span>
                    <span className="text-[10px] font-bold text-stone-400 dark:text-stone-500">
                      {progressPercent}%
                    </span>
                  </div>
                  <div className="w-full bg-stone-200/80 dark:bg-stone-800 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="h-full transition-all duration-500 rounded-full"
                      style={{
                        width: `${progressPercent}%`,
                        backgroundColor: badge.unlocked ? badge.color : '#a8a29e'
                      }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Geographic & Social Cultural Connections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Top Venues */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="font-serif-title text-sm font-bold text-stone-900 dark:text-stone-100 mb-3 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Espaços Mais Frequentes</span>
            </h4>
            {topVenues.length > 0 ? (
              <div className="space-y-2.5">
                {topVenues.map(([venue, count], idx) => (
                  <div key={venue} className="flex items-center justify-between text-xs">
                    <span className="text-stone-700 dark:text-stone-300 truncate pr-2">
                      <strong className="text-stone-400 dark:text-stone-500 mr-1.5">{idx + 1}.</strong> {venue}
                    </span>
                    <span className="font-bold text-stone-900 dark:text-stone-100 bg-stone-100 dark:bg-stone-800 px-2 py-0.5 rounded-full shrink-0">
                      {count} {count === 1 ? 'vez' : 'vezes'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center">
                <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">
                  Nenhum espaço cultural registrado ainda {selectedYear !== 'all' ? `em ${selectedYear}` : ''}.
                </p>
                <p className="text-[11px] text-stone-400 dark:text-stone-500">
                  Ao registrar shows, teatros, museus ou restaurantes, preencha o Local para atualizar este ranking.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Top Companions */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="font-serif-title text-sm font-bold text-stone-900 dark:text-stone-100 mb-3 flex items-center gap-1.5">
              <Users className="w-4 h-4 text-violet-600 dark:text-violet-400" />
              <span>Com Quem Você Mais Viveu</span>
            </h4>
            {topCompanions.length > 0 ? (
              <div className="space-y-2.5">
                {topCompanions.map(([comp, count], idx) => (
                  <div key={comp} className="flex items-center justify-between text-xs">
                    <span className="text-stone-700 dark:text-stone-300 truncate pr-2">
                      <strong className="text-stone-400 dark:text-stone-500 mr-1.5">{idx + 1}.</strong> {comp}
                    </span>
                    <span className="font-bold text-violet-700 dark:text-violet-300 bg-violet-50 dark:bg-violet-950/50 px-2 py-0.5 rounded-full shrink-0">
                      {count} vivências
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center">
                <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">
                  Nenhuma companhia registrada ainda.
                </p>
                <p className="text-[11px] text-stone-400 dark:text-stone-500">
                  Adicione quem esteve com você (Amigos, Família, Parceiro(a)) para registrar suas memórias compartilhadas.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Top Cities */}
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div>
            <h4 className="font-serif-title text-sm font-bold text-stone-900 dark:text-stone-100 mb-3 flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-teal-600 dark:text-teal-400" />
              <span>Cidades & Territórios</span>
            </h4>
            {topCities.length > 0 ? (
              <div className="space-y-2.5">
                {topCities.map(([city, count], idx) => (
                  <div key={city} className="flex items-center justify-between text-xs">
                    <span className="text-stone-700 dark:text-stone-300 truncate pr-2">
                      <strong className="text-stone-400 dark:text-stone-500 mr-1.5">{idx + 1}.</strong> {city}
                    </span>
                    <span className="font-bold text-teal-800 dark:text-teal-300 bg-teal-50 dark:bg-teal-950/50 px-2 py-0.5 rounded-full shrink-0">
                      {count} {count === 1 ? 'visita' : 'visitas'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-6 text-center">
                <p className="text-xs text-stone-500 dark:text-stone-400 mb-1">
                  Nenhuma cidade registrada ainda {selectedYear !== 'all' ? `em ${selectedYear}` : ''}.
                </p>
                <p className="text-[11px] text-stone-400 dark:text-stone-500">
                  Preencha o campo Cidade ao registrar vivências para ver o mapa das suas conexões geográficas.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    )}

      {/* POPUP / MODAL: The Aesthetic "Passaporte Cultural / Ticket do Ano" */}
      {showPosterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
          <div className="bg-stone-950 text-stone-100 border border-amber-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />
            
            {/* Header */}
            <div className="flex items-center justify-between border-b border-stone-800 pb-4 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-400 text-stone-950 flex items-center justify-center font-bold">
                  ✦
                </div>
                <div>
                  <h4 className="font-serif-title font-bold text-white text-base tracking-wider">
                    PASSAPORTE CULTURAL
                  </h4>
                  <p className="text-[10px] text-amber-300 uppercase tracking-widest">
                    Edição Oficial 2026
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowPosterModal(false)}
                className="text-stone-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {/* Passport Body */}
            <div className="space-y-4 py-2">
              <div className="text-center py-3 bg-stone-900/80 rounded-2xl border border-stone-800">
                <p className="text-xs text-stone-400 uppercase tracking-wider mb-1">
                  Seu Balanço Anual
                </p>
                <h3 className="font-serif-title text-2xl font-bold text-amber-300">
                  {showsCount} Shows • {museumsCount} Museus • {booksCount} Livros
                </h3>
                <p className="text-xs text-stone-300 mt-1 font-light">
                  {activeList.length} experiências culturais vividas ao todo
                </p>
              </div>

              {/* Highlights grid */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800">
                  <span className="text-stone-400 text-[10px] block">Filmes & Cinema</span>
                  <strong className="text-white text-base">{moviesCount} sessões</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800">
                  <span className="text-stone-400 text-[10px] block">Restaurantes Novos</span>
                  <strong className="text-white text-base">{restaurantsCount} descobertas</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800">
                  <span className="text-stone-400 text-[10px] block">Viagens & Roteiros</span>
                  <strong className="text-white text-base">{tripsCount} viagens</strong>
                </div>
                <div className="p-2.5 rounded-xl bg-stone-900 border border-stone-800">
                  <span className="text-stone-400 text-[10px] block">Teatro & Peças</span>
                  <strong className="text-white text-base">{playsCount} espetáculos</strong>
                </div>
              </div>

              {/* Archetype */}
              <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-center">
                <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">
                  Arquétipo Cultural 2026
                </span>
                <p className="font-serif-title font-bold text-white text-sm mt-0.5">
                  "Explorador Eclético de Palcos & Letras"
                </p>
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="pt-4 border-t border-stone-800 flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(
                    `Em 2026 no meu Atlas Cultural já vivi: ${showsCount} shows, ${museumsCount} exposições, ${booksCount} livros e ${activeList.length} memórias ao todo!`
                  );
                  alert('Resumo do passaporte copiado com sucesso!');
                }}
                className="flex-1 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-bold transition-colors cursor-pointer text-center"
              >
                Copiar Resumo
              </button>
              <button
                type="button"
                onClick={() => setShowPosterModal(false)}
                className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium cursor-pointer"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
