import React, { useState, useMemo } from 'react';
import { 
  Calendar, 
  MapPin, 
  Star, 
  Heart,
  Columns2,
  Grid2x2,
  Clock, 
  Sparkles,
  Plus,
  ArrowUpDown
} from 'lucide-react';
import { CulturalExperience, ExperienceCategory } from '../types';
import { CATEGORIES_CONFIG } from '../data/categories';
import { CategoryIcon } from './CategoryIcon';
import { SafeImage } from './SafeImage';

interface TimelineViewProps {
  experiences: CulturalExperience[];
  onSelectExperience: (experience: CulturalExperience) => void;
  onOpenAddModal: () => void;
  onToggleFavorite: (id: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  activeCycleYear?: number;
  onYearChange?: (year: number) => void;
  onOpenNewYearModal?: () => void;
  onRestoreSampleData?: () => void;
}

type ViewMode = 'timeline' | 'category' | 'gallery';
type SortOption = 'date_desc' | 'date_asc' | 'rating_desc';

const MONTH_NAMES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
];

export const TimelineView: React.FC<TimelineViewProps> = ({
  experiences,
  onSelectExperience,
  onOpenAddModal,
  onToggleFavorite,
  searchQuery,
  setSearchQuery,
  activeCycleYear,
  onYearChange,
  onOpenNewYearModal,
  onRestoreSampleData
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ExperienceCategory | 'all'>('all');
  const [selectedYear, setSelectedYear] = useState<number | 'all'>(activeCycleYear || 'all');
  const [viewMode, setViewMode] = useState<ViewMode>('timeline');
  const [sortOption, setSortOption] = useState<SortOption>('date_desc');
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [activeCategoryTab, setActiveCategoryTab] = useState<ExperienceCategory | null>(null);

  // Keep selectedYear synchronized if activeCycleYear changes
  React.useEffect(() => {
    if (activeCycleYear) {
      setSelectedYear(activeCycleYear);
    }
  }, [activeCycleYear]);

  const handleYearSelect = (yr: number | 'all') => {
    setSelectedYear(yr);
    if (yr !== 'all' && onYearChange) {
      onYearChange(yr);
    }
  };

  // Available years from dataset and activeCycleYear
  const availableYears = useMemo(() => {
    const yearSet = new Set<number>();
    if (activeCycleYear) yearSet.add(activeCycleYear);
    yearSet.add(2026);
    experiences.forEach(e => yearSet.add(Number(e.year) || 2026));
    const years = Array.from(yearSet).sort((a, b) => b - a);
    return years.length > 0 ? years : [2026];
  }, [experiences, activeCycleYear]);

  // Filter and sort experiences
  const filteredExperiences = useMemo(() => {
    return experiences
      .filter((item) => item.status === 'completed')
      .filter((item) => {
        if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
        if (selectedYear !== 'all' && item.year !== selectedYear) return false;
        if (onlyFavorites && !item.favorite) return false;
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = item.title.toLowerCase().includes(q);
          const matchCreator = item.creatorOrArtist?.toLowerCase().includes(q);
          const matchVenue = item.venue?.toLowerCase().includes(q);
          const matchCity = item.city?.toLowerCase().includes(q);
          const matchNotes = item.notes?.toLowerCase().includes(q);
          const matchTag = item.vibeTag?.toLowerCase().includes(q);
          return matchTitle || matchCreator || matchVenue || matchCity || matchNotes || matchTag;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortOption === 'date_desc') {
          const da = new Date((a.date || '1900-01-01') + 'T12:00:00').getTime();
          const db = new Date((b.date || '1900-01-01') + 'T12:00:00').getTime();
          return db !== da ? db - da : (b.createdAt || 0) - (a.createdAt || 0);
        }
        if (sortOption === 'date_asc') {
          const da = new Date((a.date || '9999-12-31') + 'T12:00:00').getTime();
          const db = new Date((b.date || '9999-12-31') + 'T12:00:00').getTime();
          return da !== db ? da - db : (a.createdAt || 0) - (b.createdAt || 0);
        }
        if (sortOption === 'rating_desc') {
          return b.rating !== a.rating ? b.rating - a.rating : (b.createdAt || 0) - (a.createdAt || 0);
        }
        return 0;
      });
  }, [experiences, selectedCategory, selectedYear, onlyFavorites, searchQuery, sortOption]);

  // Group by Year and Month for chronological timeline
  const groupedExperiences = useMemo(() => {
    const groups: { key: string; label: string; year: number; items: CulturalExperience[] }[] = [];
    
    filteredExperiences.forEach((exp) => {
      const groupKey = `${exp.year}-${exp.month}`;
      const existing = groups.find(g => g.key === groupKey);
      if (existing) {
        existing.items.push(exp);
      } else {
        groups.push({
          key: groupKey,
          label: `${MONTH_NAMES[exp.month]} de ${exp.year}`,
          year: exp.year,
          items: [exp]
        });
      }
    });

    return groups;
  }, [filteredExperiences]);

  return (
    <div className="space-y-6">
      {/* Filter and View Mode Controls */}
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5 shadow-xs space-y-4 transition-colors">
        {/* Category Pills Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            id="filter-cat-all"
            onClick={() => setSelectedCategory('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === 'all'
                ? 'bg-stone-900 dark:bg-amber-400 text-amber-300 dark:text-stone-950 shadow-xs'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
            }`}
          >
            Todas ({experiences.filter(e => e.status === 'completed').length})
          </button>

          {(Object.keys(CATEGORIES_CONFIG) as ExperienceCategory[]).map((catKey) => {
            const count = experiences.filter(e => e.category === catKey && e.status === 'completed').length;
            if (count === 0 && selectedCategory !== catKey) return null;
            const isSelected = selectedCategory === catKey;
            const config = CATEGORIES_CONFIG[catKey];

            return (
              <button
                key={catKey}
                type="button"
                id={`filter-cat-${catKey}`}
                onClick={() => setSelectedCategory(catKey)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-stone-900 dark:bg-amber-400 text-amber-300 dark:text-stone-950 shadow-xs'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                <CategoryIcon category={catKey} className="w-3.5 h-3.5" />
                <span>{config.pluralLabel}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-stone-800 dark:bg-amber-500 text-amber-300 dark:text-stone-950' : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-300'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Secondary controls row: Year Grouping with + Novo Ano, Sort & Layout */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-100 dark:border-stone-800">
          <div className="flex flex-wrap items-center gap-2">
            {/* Grouped Years Pill Container */}
            <div className="inline-flex items-center gap-1 bg-stone-100 dark:bg-stone-800/90 p-1 rounded-2xl border border-stone-200/70 dark:border-stone-700/70 text-xs font-semibold overflow-x-auto max-w-full shadow-xs">
              <button
                type="button"
                id="filter-year-all"
                onClick={() => handleYearSelect('all')}
                className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                  selectedYear === 'all' 
                    ? 'bg-stone-900 dark:bg-amber-400 text-amber-300 dark:text-stone-950 font-bold shadow-xs' 
                    : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-700/60'
                }`}
              >
                Todos os Anos
              </button>
              {availableYears.map(yr => (
                <button
                  key={yr}
                  type="button"
                  id={`filter-year-${yr}`}
                  onClick={() => handleYearSelect(yr)}
                  className={`px-3 py-1.5 rounded-xl transition-all cursor-pointer whitespace-nowrap ${
                    selectedYear === yr 
                      ? 'bg-stone-900 dark:bg-amber-400 text-amber-300 dark:text-stone-950 font-bold shadow-xs' 
                      : 'text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-stone-100 hover:bg-stone-200/60 dark:hover:bg-stone-700/60'
                  }`}
                >
                  {yr}
                </button>
              ))}

              {/* Synchronized "+ Novo Ano" button */}
              {onOpenNewYearModal && (
                <button
                  type="button"
                  id="btn-timeline-novo-ano"
                  onClick={onOpenNewYearModal}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-amber-400/20 hover:bg-amber-400/30 text-amber-800 dark:text-amber-300 border border-amber-400/30 font-bold transition-all cursor-pointer whitespace-nowrap ml-1"
                  title="Abrir novo ciclo anual e sincronizar com o Mapa Visual"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Novo Ano</span>
                </button>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 text-xs text-stone-600 dark:text-stone-400">
              <ArrowUpDown className="w-3.5 h-3.5 text-stone-400" />
              <select
                id="select-sort-timeline"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value as SortOption)}
                className="bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-lg px-2.5 py-1 text-xs text-stone-800 dark:text-stone-200 focus:outline-none"
              >
                <option value="date_desc">Mais Recentes</option>
                <option value="date_asc">Mais Antigos</option>
                <option value="rating_desc">Melhor Avaliados</option>
              </select>
            </div>

            {/* Visualizações — 3-mode labeled tab bar */}
            <div className="flex items-center bg-stone-100 dark:bg-stone-800/90 p-1 rounded-2xl border border-stone-200/60 dark:border-stone-700/60 gap-0.5">
              <button
                type="button"
                id="view-mode-timeline"
                onClick={() => setViewMode('timeline')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  viewMode === 'timeline'
                    ? 'bg-white dark:bg-stone-700 shadow-sm text-stone-900 dark:text-stone-100'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
                title="Linha do Tempo"
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Linha do Tempo</span>
              </button>
              <button
                type="button"
                id="view-mode-category"
                onClick={() => {
                  setViewMode('category');
                  setActiveCategoryTab(null);
                }}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  viewMode === 'category'
                    ? 'bg-white dark:bg-stone-700 shadow-sm text-stone-900 dark:text-stone-100'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
                title="Por Categoria"
              >
                <Columns2 className="w-3.5 h-3.5" />
                <span>Por Categoria</span>
              </button>
              <button
                type="button"
                id="view-mode-gallery"
                onClick={() => setViewMode('gallery')}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                  viewMode === 'gallery'
                    ? 'bg-white dark:bg-stone-700 shadow-sm text-stone-900 dark:text-stone-100'
                    : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
                }`}
                title="Galeria Visual"
              >
                <Grid2x2 className="w-3.5 h-3.5" />
                <span>Galeria Visual</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Empty State */}
      {filteredExperiences.length === 0 && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-12 text-center max-w-lg mx-auto transition-colors">
          <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-serif-title text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
            {selectedYear !== 'all' ? `Nenhuma experiência em ${selectedYear}` : 'Nenhuma experiência encontrada'}
          </h3>
          <p className="text-sm text-stone-500 dark:text-stone-400 mb-5">
            {searchQuery
              ? `Nenhum resultado para "${searchQuery}". Tente outros termos ou limpe a busca.`
              : selectedYear !== 'all'
                ? `O ano ${selectedYear} está limpo e pronto para você registrar suas novas memórias.`
                : 'Você ainda não registrou experiências com esses filtros.'}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              id="btn-timeline-empty-add"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 bg-stone-900 dark:bg-amber-400 text-amber-300 dark:text-stone-950 px-4 py-2 rounded-xl text-sm font-semibold shadow-xs hover:bg-stone-800 dark:hover:bg-amber-300 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Registrar em {selectedYear !== 'all' ? selectedYear : 'Experiência'}</span>
            </button>

            {selectedYear !== 'all' && (
              <button
                type="button"
                id="btn-timeline-see-all-years"
                onClick={() => handleYearSelect('all')}
                className="px-4 py-2 rounded-xl text-sm font-semibold border border-stone-200 dark:border-stone-700 hover:bg-stone-50 dark:hover:bg-stone-800 text-stone-700 dark:text-stone-300 transition-colors cursor-pointer"
              >
                Ver Todos os Anos
              </button>
            )}

            {onRestoreSampleData && (
              <button
                type="button"
                id="btn-timeline-restore-samples"
                onClick={() => {
                  if (confirm('Deseja recarregar o Atlas Cultural com todos os dados originais de exemplo?')) {
                    onRestoreSampleData();
                  }
                }}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-stone-500 dark:text-stone-400 hover:underline transition-all cursor-pointer"
              >
                Recarregar Dados
              </button>
            )}
          </div>
        </div>
      )}

      {/* VIEW 1: Chronological Stream (Linha do Tempo) */}
      {viewMode === 'timeline' && filteredExperiences.length > 0 && (
        <div className="space-y-10 relative">
          {groupedExperiences.map((group) => (
            <div key={group.key} className="space-y-4">
              {/* Group header pill */}
              <div className="sticky top-28 z-20 flex items-center gap-3">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-900 dark:bg-stone-800 text-amber-300 text-xs font-bold uppercase tracking-wider shadow-sm border border-stone-800 dark:border-stone-700">
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>{group.label}</span>
                  <span className="text-stone-400 font-normal">({group.items.length})</span>
                </div>
                <div className="flex-1 h-px bg-stone-300 dark:bg-stone-800"></div>
              </div>

              {/* Items in this month */}
              <div className="relative pl-4 sm:pl-6 border-l-2 border-stone-300 dark:border-stone-800 ml-3 sm:ml-4 space-y-6">
                {group.items.map((item) => {
                  const catConfig = CATEGORIES_CONFIG[item.category] || CATEGORIES_CONFIG.outro;
                  const itemDay = new Date(item.date + 'T12:00:00').toLocaleDateString('pt-BR', {
                    day: 'numeric',
                    weekday: 'short'
                  });

                  return (
                    <div
                      key={item.id}
                      onClick={() => onSelectExperience(item)}
                      className="group relative bg-white dark:bg-stone-900 rounded-2xl border border-stone-200/90 dark:border-stone-800 hover:border-amber-400 dark:hover:border-amber-500/50 p-4 sm:p-5 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer overflow-hidden"
                    >
                      {/* Timeline dot anchor */}
                      <div 
                        className="absolute -left-[23px] sm:-left-[31px] top-6 w-3.5 h-3.5 rounded-full border-2 border-white dark:border-stone-900 group-hover:scale-125 transition-transform"
                        style={{ backgroundColor: catConfig.color }}
                      />

                      <div className="flex flex-col sm:flex-row gap-4">
                        {/* Thumbnail / Visual banner */}
                        {item.imageUrl && (
                          <div className={`w-full sm:w-44 h-36 sm:h-32 rounded-xl overflow-hidden shrink-0 relative ${
                            item.imageFrameStyle === 'polaroid'
                              ? 'bg-white p-1.5 pb-5 border-2 border-stone-200 shadow-sm'
                              : item.imageFrameStyle === 'poster'
                                ? 'bg-stone-950 p-1 border-2 border-amber-500/40'
                                : 'bg-stone-100 dark:bg-stone-800'
                          }`}>
                            <SafeImage
                              src={item.imageUrl}
                              alt={item.title}
                              category={item.category}
                              fallbackTitle={item.title}
                              style={{
                                transform: item.imageZoom ? `scale(${item.imageZoom})` : undefined,
                                transformOrigin: `${item.imageFocalX ?? 50}% ${item.imageFocalY ?? 50}%`
                              }}
                              className={`w-full h-full ${
                                item.imageFit === 'contain' ? 'object-contain bg-black' : 'object-cover'
                              } group-hover:scale-105 transition-transform duration-300`}
                            />
                            <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-white text-[10px] font-medium">
                              {catConfig.label.split('&')[0]}
                            </span>
                          </div>
                        )}

                        {/* Card Info */}
                        <div className="flex-1 flex flex-col justify-between">
                          <div>
                            {/* Top metadata tags */}
                            <div className="flex items-center justify-between gap-2 mb-1.5">
                              <div className="flex items-center gap-2">
                                <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${catConfig.bgLight}`}>
                                  <CategoryIcon category={item.category} className="w-3 h-3" />
                                  {catConfig.label}
                                </span>
                                <span className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                                  {itemDay}
                                </span>
                              </div>

                              <div className="flex items-center gap-1.5">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    onToggleFavorite(item.id);
                                  }}
                                  className="p-1 hover:scale-110 transition-transform cursor-pointer"
                                >
                                  <Heart
                                    className={`w-4 h-4 ${
                                      item.favorite
                                        ? 'fill-rose-500 text-rose-500'
                                        : 'text-stone-300 dark:text-stone-600 hover:text-stone-500 dark:hover:text-stone-400'
                                    }`}
                                  />
                                </button>
                                <div className="flex items-center text-amber-500">
                                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                                  <span className="text-xs font-bold ml-1 text-stone-800 dark:text-stone-200">
                                    {item.rating}.0
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Title & Creator */}
                            <h3 className="font-serif-title font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                              {item.title}
                            </h3>
                            {item.creatorOrArtist && (
                              <p className="text-xs text-stone-600 dark:text-stone-400 font-medium mb-2">
                                {item.creatorOrArtist}
                              </p>
                            )}

                            {/* Memory excerpt */}
                            {item.notes && (
                              <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 italic mb-3 font-serif">
                                "{item.notes}"
                              </p>
                            )}
                          </div>

                          {/* Footer details: Venue, City, Companions & Vibe */}
                          <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-stone-100 dark:border-stone-800 text-xs text-stone-500 dark:text-stone-400">
                            <div className="flex items-center gap-3">
                              {item.venue && (
                                <span className="flex items-center gap-1 truncate max-w-xs">
                                  <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                                  <span>{item.venue}</span>
                                </span>
                              )}
                              {item.companions && item.companions.length > 0 && (
                                <span className="hidden sm:inline-block text-stone-400">
                                  com {item.companions.join(', ')}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-2">
                              {item.vibeTag && (
                                <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 text-[10px] font-semibold">
                                  {item.vibeTag}
                                </span>
                              )}
                              {item.ticketOrCost && (
                                <span className="text-[10px] font-medium text-stone-400">
                                  {item.ticketOrCost}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: Visual Poster Gallery Grid */}
      {viewMode === 'gallery' && filteredExperiences.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredExperiences.map((item) => {
            const catConfig = CATEGORIES_CONFIG[item.category] || CATEGORIES_CONFIG.outro;
            return (
              <div
                key={item.id}
                onClick={() => onSelectExperience(item)}
                className="group bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-200 cursor-pointer flex flex-col"
              >
                <div className={`relative h-52 w-full bg-stone-900 overflow-hidden ${
                  item.imageFrameStyle === 'polaroid' ? 'p-2 pb-6 bg-white border-b-2 border-stone-200' : ''
                }`}>
                  <SafeImage
                    src={item.imageUrl}
                    alt={item.title}
                    category={item.category}
                    fallbackTitle={item.title}
                    style={{
                      transform: item.imageZoom ? `scale(${item.imageZoom})` : undefined,
                      transformOrigin: `${item.imageFocalX ?? 50}% ${item.imageFocalY ?? 50}%`
                    }}
                    className={`w-full h-full ${
                      item.imageFit === 'contain' ? 'object-contain bg-black' : 'object-cover'
                    } group-hover:scale-105 transition-transform duration-300`}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
                  
                  {/* Category Pill Top */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-900/80 backdrop-blur-xs text-amber-300 text-[11px] font-bold border border-amber-400/20">
                      <CategoryIcon category={item.category} className="w-3 h-3 text-amber-400" />
                      {catConfig.label.split('&')[0]}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onToggleFavorite(item.id);
                      }}
                      className="p-1.5 rounded-full bg-stone-900/60 backdrop-blur-xs hover:bg-stone-900 text-white cursor-pointer"
                    >
                      <Heart className={`w-3.5 h-3.5 ${item.favorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>
                  </div>

                  {/* Title on Image */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h4 className="font-serif-title font-bold text-base line-clamp-1">
                      {item.title}
                    </h4>
                    <p className="text-xs text-stone-300 truncate">
                      {item.creatorOrArtist || item.venue}
                    </p>
                  </div>
                </div>

                <div className="p-4 flex-1 flex flex-col justify-between">
                  <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-2 italic mb-3 font-serif">
                    {item.notes ? `"${item.notes}"` : 'Sem anotações adicionais.'}
                  </p>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100 dark:border-stone-800 text-stone-500 dark:text-stone-400">
                    <span>{new Date(item.date + 'T12:00:00').toLocaleDateString('pt-BR')}</span>
                    <div className="flex items-center gap-1 text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <span>{item.rating}.0</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* VIEW 3: Por Categoria — horizontal category tabs + cards grid */}
      {viewMode === 'category' && filteredExperiences.length > 0 && (() => {
        // Build list of categories that actually have items (in order)
        const catsWithItems = (Object.keys(CATEGORIES_CONFIG) as ExperienceCategory[]).filter(
          cat => filteredExperiences.some(e => e.category === cat)
        );
        const currentTab: ExperienceCategory = activeCategoryTab && catsWithItems.includes(activeCategoryTab)
          ? activeCategoryTab
          : catsWithItems[0];
        const tabItems = filteredExperiences.filter(e => e.category === currentTab);

        return (
          <div className="space-y-0">
            {/* Horizontal category tab strip */}
            <div className="flex items-stretch overflow-x-auto no-scrollbar bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-t-2xl">
              {catsWithItems.map((cat, idx) => {
                const cfg = CATEGORIES_CONFIG[cat];
                const isActive = cat === currentTab;
                const count = filteredExperiences.filter(e => e.category === cat).length;
                return (
                  <button
                    key={cat}
                    type="button"
                    id={`category-tab-${cat}`}
                    onClick={() => setActiveCategoryTab(cat)}
                    className={`relative flex-1 min-w-[100px] flex flex-col items-center gap-1 px-4 py-3.5 text-xs font-bold whitespace-nowrap transition-all cursor-pointer border-b-2 ${
                      isActive
                        ? 'border-amber-400 text-stone-900 dark:text-stone-100 bg-amber-50/60 dark:bg-amber-950/20'
                        : 'border-transparent text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:bg-stone-50 dark:hover:bg-stone-800/50'
                    } ${
                      idx > 0 ? 'border-l border-stone-100 dark:border-stone-800' : ''
                    }`}
                  >
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${
                      isActive ? 'bg-amber-400/20 text-amber-600 dark:text-amber-400' : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400'
                    }`}>
                      <CategoryIcon category={cat} className="w-4 h-4" />
                    </div>
                    <span>{cfg.pluralLabel}</span>
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-semibold ${
                      isActive
                        ? 'bg-amber-400/30 text-amber-700 dark:text-amber-300'
                        : 'bg-stone-100 dark:bg-stone-800 text-stone-500 dark:text-stone-400'
                    }`}>{count}</span>
                    {isActive && (
                      <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-amber-400 rounded-full" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Cards grid for active category */}
            <div className="bg-white/60 dark:bg-stone-900/60 border border-t-0 border-stone-200 dark:border-stone-800 rounded-b-2xl p-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {tabItems.map((item) => {
                  const catConfig = CATEGORIES_CONFIG[item.category] || CATEGORIES_CONFIG.outro;
                  return (
                    <div
                      key={item.id}
                      onClick={() => onSelectExperience(item)}
                      className="group bg-white dark:bg-stone-900 rounded-2xl border border-stone-200 dark:border-stone-800 hover:border-amber-400 dark:hover:border-amber-500/50 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col"
                    >
                      {/* Image / Poster */}
                      <div className="relative h-44 w-full bg-stone-900 overflow-hidden">
                        <SafeImage
                          src={item.imageUrl}
                          alt={item.title}
                          category={item.category}
                          fallbackTitle={item.title}
                          style={{
                            transform: item.imageZoom ? `scale(${item.imageZoom})` : undefined,
                            transformOrigin: `${item.imageFocalX ?? 50}% ${item.imageFocalY ?? 50}%`
                          }}
                          className={`w-full h-full ${
                            item.imageFit === 'contain' ? 'object-contain bg-black' : 'object-cover'
                          } group-hover:scale-105 transition-transform duration-300`}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent pointer-events-none" />
                        {/* Fav button */}
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); onToggleFavorite(item.id); }}
                          className="absolute top-2.5 right-2.5 p-1.5 rounded-full bg-stone-900/60 backdrop-blur-xs hover:bg-stone-900 text-white cursor-pointer"
                        >
                          <Heart className={`w-3.5 h-3.5 ${item.favorite ? 'fill-rose-500 text-rose-500' : ''}`} />
                        </button>
                        {/* Title overlay */}
                        <div className="absolute bottom-3 left-3 right-3 text-white">
                          <h4 className="font-serif-title font-bold text-sm line-clamp-2 leading-snug">{item.title}</h4>
                          {item.creatorOrArtist && (
                            <p className="text-[11px] text-stone-300 truncate mt-0.5">{item.creatorOrArtist}</p>
                          )}
                        </div>
                      </div>

                      {/* Footer info */}
                      <div className="px-4 py-3 flex items-center justify-between gap-2 text-xs text-stone-500 dark:text-stone-400">
                        <span>{new Date(item.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        <div className="flex items-center gap-2">
                          {item.vibeTag && (
                            <span className="px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-200/50 dark:border-amber-800/50 text-[10px] font-semibold">
                              {item.vibeTag}
                            </span>
                          )}
                          <div className="flex items-center gap-1 text-amber-500 font-bold">
                            <Star className="w-3 h-3 fill-amber-400" />
                            <span>{item.rating}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
};
