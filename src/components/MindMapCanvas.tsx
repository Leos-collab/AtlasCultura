import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  Sparkles, 
  ChevronRight, 
  X, 
  Calendar, 
  MapPin, 
  Star, 
  Maximize2, 
  Minimize2, 
  Plus, 
  RotateCcw,
  ArrowRight,
  MousePointer,
  Compass
} from 'lucide-react';
import { CulturalExperience, ExperienceCategory } from '../types';
import { CATEGORIES_CONFIG } from '../data/categories';
import { CategoryIcon } from './CategoryIcon';
import { SafeImage } from './SafeImage';

interface MindMapCanvasProps {
  experiences: CulturalExperience[];
  activeYear: number;
  onYearChange: (year: number) => void;
  onSelectExperience: (experience: CulturalExperience) => void;
  onOpenAddModal: (category?: ExperienceCategory) => void;
  onOpenNewYearModal: () => void;
  onRestoreSampleData?: () => void;
}

// Satellite node definition with relative angle and distance
const CATEGORY_LAYOUT: { category: ExperienceCategory; angleDeg: number; distFactor: number }[] = [
  { category: 'livro', angleDeg: 270, distFactor: 0.95 },      // Top
  { category: 'filme', angleDeg: 315, distFactor: 1.05 },      // Top Right
  { category: 'festival', angleDeg: 355, distFactor: 1.1 },    // Right
  { category: 'viagem', angleDeg: 40, distFactor: 1.05 },      // Bottom Right
  { category: 'restaurante', angleDeg: 90, distFactor: 0.95 }, // Bottom
  { category: 'peça', angleDeg: 140, distFactor: 1.05 },       // Bottom Left
  { category: 'outro', angleDeg: 180, distFactor: 1.1 },       // Left
  { category: 'show', angleDeg: 215, distFactor: 1.05 },       // Top Left
  { category: 'museu', angleDeg: 245, distFactor: 0.95 },      // Upper Left
];

export const MindMapCanvas: React.FC<MindMapCanvasProps> = ({
  experiences,
  activeYear,
  onYearChange,
  onSelectExperience,
  onOpenAddModal,
  onOpenNewYearModal,
  onRestoreSampleData
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<ExperienceCategory | null>(null);
  const [clickRipples, setClickRipples] = useState<{ id: number; x: number; y: number; color: string }[]>([]);
  const [containerDimensions, setContainerDimensions] = useState({ width: 900, height: 600 });
  const [hoveredCategory, setHoveredCategory] = useState<ExperienceCategory | null>(null);

  // Available years from dataset and active year
  const availableYears = useMemo(() => {
    const set = new Set<number>();
    set.add(activeYear);
    set.add(2026);
    experiences.forEach(e => {
      if (e.year) set.add(Number(e.year));
    });
    return Array.from(set).sort((a, b) => b - a);
  }, [experiences, activeYear]);

  // Filter only completed experiences for the active year (strictly completed, no wishlist)
  const completedForYear = useMemo(() => {
    return experiences.filter(e => e.status === 'completed' && e.year === activeYear);
  }, [experiences, activeYear]);

  // Counts by category
  const categoryCounts = useMemo(() => {
    const counts: Record<ExperienceCategory, number> = {
      show: 0,
      filme: 0,
      livro: 0,
      museu: 0,
      viagem: 0,
      trilha: 0,
      peça: 0,
      festival: 0,
      restaurante: 0,
      outro: 0
    };
    completedForYear.forEach(e => {
      const cat = e.category === 'trilha' ? 'viagem' : e.category;
      if (counts[cat] !== undefined) {
        counts[cat] += 1;
      }
    });
    return counts;
  }, [completedForYear]);

  // Resize observer to keep the canvas responsive
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setContainerDimensions({
          width: Math.max(width, 340),
          height: Math.max(height, 560)
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Keyboard shortcut: pressing "Enter" toggles or expands the mind map
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        setIsExpanded(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Mouse wheel scroll to expand/collapse if interacting inside the canvas
  const handleWheel = (e: React.WheelEvent) => {
    if (Math.abs(e.deltaY) > 35) {
      if (e.deltaY > 0 && !isExpanded) {
        setIsExpanded(true);
      }
    }
  };

  // Node click ripple effect
  const triggerNodeEffect = (e: React.MouseEvent, category: ExperienceCategory, color: string) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const id = Date.now() + Math.random();
      setClickRipples(prev => [...prev.slice(-4), { id, x, y, color }]);
      setTimeout(() => {
        setClickRipples(prev => prev.filter(r => r.id !== id));
      }, 900);
    }
    setSelectedCategory(category);
  };

  // Center coordinates
  const centerX = containerDimensions.width / 2;
  const centerY = containerDimensions.height / 2;

  // Responsive radius
  const isMobile = containerDimensions.width < 640;
  const radiusX = isMobile ? Math.min(centerX - 55, 145) : Math.min(centerX - 110, 270);
  const radiusY = isMobile ? Math.min(centerY - 75, 190) : Math.min(centerY - 85, 215);

  // Selected category items
  const activeCategoryItems = useMemo(() => {
    if (!selectedCategory) return [];
    return completedForYear.filter(e => {
      const cat = e.category === 'trilha' ? 'viagem' : e.category;
      return cat === selectedCategory;
    });
  }, [completedForYear, selectedCategory]);

  return (
    <div className="space-y-4">
      {/* Top Action Bar: Header, Year Switcher & "Novo Ano" Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 dark:bg-amber-400/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-serif-title font-bold text-lg border border-amber-500/20">
            {activeYear.toString().slice(-2)}'
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-serif-title text-base sm:text-lg font-bold text-stone-900 dark:text-stone-100">
                Mapa Mental Cultural
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/40">
                {activeYear}
              </span>
            </div>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Role com o mouse ou clique nas esferas para explorar as memórias vivenciadas.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Year selector tabs dynamically rendered */}
          <div className="flex items-center bg-stone-100 dark:bg-stone-800 p-1 rounded-xl text-xs font-semibold overflow-x-auto max-w-full">
            {availableYears.map((yr) => (
              <button
                key={yr}
                type="button"
                id={`mindmap-year-${yr}`}
                onClick={() => {
                  onYearChange(yr);
                  setSelectedCategory(null);
                }}
                className={`px-2.5 py-1 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
                  activeYear === yr
                    ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-stone-100 shadow-xs font-bold'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-100'
                }`}
              >
                {yr}
              </button>
            ))}
          </div>

          {/* New Year / Novo Ano Button */}
          <button
            type="button"
            id="btn-new-year"
            onClick={onOpenNewYearModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-stone-950 text-xs font-bold shadow-xs transition-all cursor-pointer"
            title="Iniciar novo ciclo ou zerar para novo ano cultural"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Novo Ano</span>
          </button>

          {/* Reload / Restore Samples Button */}
          {onRestoreSampleData && (
            <button
              type="button"
              id="btn-mindmap-restore-samples"
              onClick={() => {
                if (confirm('Deseja recarregar o Atlas Cultural com os dados de exemplo originais?')) {
                  onRestoreSampleData();
                }
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 text-xs font-semibold transition-colors cursor-pointer"
              title="Recarregar dados originais do Atlas"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">Recarregar Dados</span>
            </button>
          )}

          {/* Expand/Collapse Toggle */}
          <button
            type="button"
            id="btn-toggle-mindmap-expand"
            onClick={() => setIsExpanded(prev => !prev)}
            className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-600 dark:text-stone-300 text-xs transition-colors cursor-pointer"
            title={isExpanded ? 'Recolher esferas' : 'Expandir esferas'}
          >
            {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Main Interactive Canvas Stage */}
      <div 
        ref={containerRef}
        onWheel={handleWheel}
        className="relative w-full h-[540px] sm:h-[620px] rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden select-none bg-stone-50 dark:bg-stone-950 transition-colors shadow-inner"
        style={{
          backgroundImage: `radial-gradient(circle, currentColor 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
          color: 'rgba(150, 150, 150, 0.12)'
        }}
      >
        {/* Dynamic Ripple Shockwaves on Click */}
        {clickRipples.map(ripple => (
          <div
            key={ripple.id}
            className="absolute rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2 animate-ping"
            style={{
              left: ripple.x,
              top: ripple.y,
              width: 140,
              height: 140,
              backgroundColor: `${ripple.color}25`,
              border: `2px solid ${ripple.color}`
            }}
          />
        ))}

        {/* SVG Bezier Branch Connections */}
        <svg 
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="year-glow-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#d97706" stopOpacity="0.4" />
            </linearGradient>
          </defs>

          {CATEGORY_LAYOUT.map((item, index) => {
            const rad = (item.angleDeg * Math.PI) / 180;
            const targetX = isExpanded
              ? centerX + Math.cos(rad) * radiusX * item.distFactor
              : centerX;
            const targetY = isExpanded
              ? centerY + Math.sin(rad) * radiusY * item.distFactor
              : centerY;

            // Curved S-shape control points for organic synapse/branch look
            const cp1X = centerX + (targetX - centerX) * 0.45;
            const cp1Y = centerY;
            const cp2X = centerX + (targetX - centerX) * 0.55;
            const cp2Y = targetY;

            const isHovered = hoveredCategory === item.category;
            const isSelected = selectedCategory === item.category;
            const catConfig = CATEGORIES_CONFIG[item.category] || CATEGORIES_CONFIG.outro;
            const count = categoryCounts[item.category] || 0;

            const strokeColor = isSelected 
              ? catConfig.color 
              : isHovered 
                ? catConfig.color 
                : 'currentColor';

            return (
              <g key={`branch-${item.category}`}>
                <path
                  d={`M ${centerX} ${centerY} C ${cp1X} ${cp1Y}, ${cp2X} ${cp2Y}, ${targetX} ${targetY}`}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={isSelected ? 3.5 : isHovered ? 2.5 : 1.5}
                  strokeDasharray={count === 0 ? '4 4' : undefined}
                  className={`text-stone-300 dark:text-stone-700 transition-all duration-500 ${
                    isExpanded ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{
                    filter: isSelected ? `drop-shadow(0 0 6px ${catConfig.color})` : undefined
                  }}
                />
              </g>
            );
          })}
        </svg>

        {/* CENTER BALL: Active Year with elegant styling */}
        <div
          onClick={() => setIsExpanded(prev => !prev)}
          id="mindmap-center-node"
          className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer transition-all duration-500 flex flex-col items-center justify-center text-center group ${
            isExpanded
              ? 'w-32 h-32 sm:w-40 sm:h-40 bg-white dark:bg-stone-900 border-4 border-amber-400/90 dark:border-amber-400/70 shadow-2xl hover:scale-105'
              : 'w-36 h-36 sm:w-44 sm:h-44 bg-amber-500 text-stone-950 border-4 border-amber-300 shadow-2xl scale-110 animate-pulse'
          }`}
          style={{
            left: centerX,
            top: centerY,
            boxShadow: '0 20px 50px -10px rgba(245, 158, 11, 0.25)'
          }}
          title={isExpanded ? 'Clique para recolher' : 'Clique ou use o scroll para expandir'}
        >
          {/* Subtle Year Ring Effect */}
          <div className="absolute inset-0 rounded-full border border-amber-400/30 scale-110 pointer-events-none group-hover:scale-115 transition-transform" />
          
          <span className="text-[10px] sm:text-[11px] font-bold tracking-widest uppercase text-amber-700 dark:text-amber-400">
            Atlas Cultural
          </span>
          <h2 className="font-serif-title text-3xl sm:text-4xl font-extrabold text-stone-950 dark:text-stone-50 tracking-tight my-0.5">
            {activeYear}
          </h2>
          <span className="text-[10px] font-medium text-stone-500 dark:text-stone-400">
            {completedForYear.length} {completedForYear.length === 1 ? 'experiência' : 'experiências'}
          </span>

          {!isExpanded && (
            <span className="mt-1 px-2 py-0.5 rounded-full bg-stone-950 text-amber-300 text-[9px] font-bold uppercase tracking-wider">
              Expandir Mapa
            </span>
          )}
        </div>

        {/* SATELLITE NODES: Surrounding categories matching Image 2 */}
        {CATEGORY_LAYOUT.map((item) => {
          const rad = (item.angleDeg * Math.PI) / 180;
          const targetX = isExpanded
            ? centerX + Math.cos(rad) * radiusX * item.distFactor
            : centerX;
          const targetY = isExpanded
            ? centerY + Math.sin(rad) * radiusY * item.distFactor
            : centerY;

          const catConfig = CATEGORIES_CONFIG[item.category] || CATEGORIES_CONFIG.outro;
          const count = categoryCounts[item.category] || 0;
          const isSelected = selectedCategory === item.category;
          const isHovered = hoveredCategory === item.category;

          return (
            <div
              key={item.category}
              id={`mindmap-node-${item.category}`}
              onClick={(e) => triggerNodeEffect(e, item.category, catConfig.color)}
              onMouseEnter={() => setHoveredCategory(item.category)}
              onMouseLeave={() => setHoveredCategory(null)}
              className={`absolute z-10 -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer transition-all duration-300 flex flex-col items-center justify-center p-1.5 sm:p-2 group select-none ${
                isExpanded ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none scale-50'
              } ${
                isSelected
                  ? 'scale-115 ring-4 ring-amber-400/80 shadow-2xl z-30'
                  : isHovered
                    ? 'scale-110 shadow-xl z-20'
                    : 'hover:scale-105 shadow-lg'
              } bg-white dark:bg-stone-900 border-[3px]`}
              style={{
                left: targetX,
                top: targetY,
                width: isMobile ? 84 : 100,
                height: isMobile ? 84 : 100,
                borderColor: catConfig.color,
                boxShadow: isSelected 
                  ? `0 0 24px ${catConfig.color}80, 0 10px 25px -5px rgba(0,0,0,0.5)` 
                  : `0 4px 14px 0 rgba(0,0,0,0.15), 0 0 8px ${catConfig.color}30`
              }}
            >
              {/* Category Icon */}
              <div 
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-transform group-hover:scale-110 mb-0.5 shadow-xs shrink-0 ${
                  isSelected ? 'scale-110' : ''
                }`}
                style={{ 
                  backgroundColor: `${catConfig.color}25`,
                  color: catConfig.color
                }}
              >
                <CategoryIcon category={item.category} className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              </div>

              {/* Category Name - Ultra High Contrast in both light and dark mode */}
              <span 
                className="text-[10px] sm:text-[11px] font-extrabold text-center max-w-[95%] leading-tight text-stone-900 dark:text-amber-300 tracking-tight px-1.5 py-0.5 rounded bg-stone-100/80 dark:bg-stone-950/85 border border-transparent dark:border-stone-800"
                title={catConfig.pluralLabel}
              >
                {catConfig.pluralLabel}
              </span>

              {/* Count Badge */}
              <span 
                className={`text-[9px] sm:text-[10px] px-2 py-0.2 rounded-full font-black mt-0.5 shadow-2xs ${
                  isSelected
                    ? 'bg-amber-400 text-stone-950 ring-1 ring-amber-300'
                    : count > 0
                      ? 'bg-amber-500 dark:bg-amber-400 text-stone-950 font-extrabold'
                      : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300'
                }`}
              >
                {count}
              </span>
            </div>
          );
        })}

        {/* Empty state banner when active year has 0 experiences */}
        {completedForYear.length === 0 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-20 max-w-md w-[92%] p-3 rounded-2xl bg-white/95 dark:bg-stone-900/95 backdrop-blur-md border border-amber-500/40 shadow-xl flex items-center justify-between gap-3 text-left animate-in fade-in duration-300">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/15 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-stone-900 dark:text-stone-100">
                  Ano {activeYear} iniciado zerado!
                </h4>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Clique nas esferas para registrar suas primeiras memórias.
                </p>
              </div>
            </div>
            <button
              type="button"
              id="btn-mindmap-empty-register"
              onClick={() => onOpenAddModal()}
              className="shrink-0 px-3 py-1.5 rounded-xl bg-stone-900 dark:bg-amber-400 text-amber-300 dark:text-stone-950 text-xs font-bold shadow-xs hover:scale-102 transition-transform cursor-pointer"
            >
              + Registrar
            </button>
          </div>
        )}

        {/* Bottom Hint / Instructions */}
        <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between pointer-events-none">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 dark:bg-stone-900/80 backdrop-blur-md text-[11px] font-medium text-stone-600 dark:text-stone-300 border border-stone-200 dark:border-stone-800 shadow-xs">
            <MousePointer className="w-3.5 h-3.5 text-amber-500" />
            <span>Role o mouse ou clique nas bolinhas para ver as experiências registradas</span>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[11px] text-stone-400 dark:text-stone-500 font-mono">
              [Enter] expandir/recolher
            </span>
          </div>
        </div>
      </div>

      {/* MODAL / DRAWER: Open list of registered experiences when a category circle is clicked */}
      {selectedCategory && (
        <div 
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedCategory(null)}
        >
          <div 
            className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/70 dark:bg-stone-950/70">
              <div className="flex items-center gap-3">
                <div 
                  className="w-11 h-11 rounded-2xl flex items-center justify-center shadow-xs"
                  style={{
                    backgroundColor: `${CATEGORIES_CONFIG[selectedCategory].color}25`,
                    color: CATEGORIES_CONFIG[selectedCategory].color
                  }}
                >
                  <CategoryIcon category={selectedCategory} className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-serif-title text-xl font-bold text-stone-900 dark:text-stone-100">
                      {CATEGORIES_CONFIG[selectedCategory].label}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300 border border-amber-300/40">
                      {activeYear}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 dark:text-stone-400">
                    {activeCategoryItems.length} {activeCategoryItems.length === 1 ? 'experiência registrada' : 'experiências registradas'} (somente o que você viveu)
                  </p>
                </div>
              </div>

              <button
                type="button"
                id="btn-close-category-drawer"
                onClick={() => setSelectedCategory(null)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Experiences Content List */}
            <div className="p-5 overflow-y-auto space-y-3.5 flex-1">
              {activeCategoryItems.length === 0 ? (
                <div className="text-center py-12 px-4 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-stone-100 dark:bg-stone-800 flex items-center justify-center mx-auto text-stone-400">
                    <CategoryIcon category={selectedCategory} className="w-7 h-7" />
                  </div>
                  <div>
                    <h4 className="font-serif-title text-base font-bold text-stone-900 dark:text-stone-100">
                      Nenhuma experiência de {CATEGORIES_CONFIG[selectedCategory].pluralLabel.toLowerCase()} em {activeYear}
                    </h4>
                    <p className="text-xs text-stone-500 dark:text-stone-400 mt-1 max-w-md mx-auto">
                      Você ainda não registrou vivências nesta categoria neste ano. Que tal adicionar sua primeira memória?
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const cat = selectedCategory;
                      setSelectedCategory(null);
                      onOpenAddModal(cat);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 dark:bg-amber-400 text-amber-300 dark:text-stone-950 text-xs font-bold shadow-xs hover:bg-stone-800 dark:hover:bg-amber-300 transition-all cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Registrar {CATEGORIES_CONFIG[selectedCategory].label.split('&')[0]}</span>
                  </button>
                </div>
              ) : (
                activeCategoryItems.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedCategory(null);
                      onSelectExperience(item);
                    }}
                    className="group flex flex-col sm:flex-row items-start sm:items-center gap-3.5 p-3.5 rounded-2xl border border-stone-200 dark:border-stone-800 hover:border-amber-400 dark:hover:border-amber-500 bg-white dark:bg-stone-950 shadow-xs hover:shadow-md transition-all cursor-pointer"
                  >
                    {/* Thumbnail */}
                    <div className="w-full sm:w-24 h-20 sm:h-20 rounded-xl overflow-hidden shrink-0 bg-stone-100 dark:bg-stone-800">
                      <SafeImage
                        src={item.imageUrl}
                        alt={item.title}
                        category={item.category}
                        fallbackTitle={item.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                    </div>

                    {/* Meta info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-mono text-stone-400">
                          {new Date(item.date + 'T12:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}
                        </span>
                        {item.vibeTag && (
                          <span className="text-[10px] font-semibold px-2 py-0.2 rounded-full bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-300/40">
                            {item.vibeTag}
                          </span>
                        )}
                        <div className="flex items-center gap-0.5 ml-auto text-amber-500">
                          {Array.from({ length: item.rating }).map((_, i) => (
                            <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                      </div>

                      <h4 className="font-serif-title font-bold text-sm text-stone-900 dark:text-stone-100 line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {item.title}
                      </h4>

                      {item.creatorOrArtist && (
                        <p className="text-xs text-stone-600 dark:text-stone-400 font-medium">
                          por {item.creatorOrArtist}
                        </p>
                      )}

                      <div className="flex items-center gap-3 text-[11px] text-stone-500 dark:text-stone-400 mt-1.5">
                        {item.venue && (
                          <span className="flex items-center gap-1 line-clamp-1">
                            <MapPin className="w-3 h-3 text-stone-400" />
                            {item.venue}
                          </span>
                        )}
                        {item.companions && item.companions.length > 0 && (
                          <span className="line-clamp-1 text-stone-400">
                            com {item.companions.join(', ')}
                          </span>
                        )}
                      </div>
                    </div>

                    <ChevronRight className="w-5 h-5 text-stone-300 dark:text-stone-700 group-hover:text-amber-500 group-hover:translate-x-0.5 transition-all shrink-0 hidden sm:block" />
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950 flex items-center justify-between">
              <span className="text-xs text-stone-500 dark:text-stone-400">
                Total nesta categoria: <strong>{activeCategoryItems.length}</strong>
              </span>
              <button
                type="button"
                onClick={() => {
                  const cat = selectedCategory;
                  setSelectedCategory(null);
                  onOpenAddModal(cat);
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-900 dark:bg-amber-400 text-amber-300 dark:text-stone-950 text-xs font-bold hover:bg-stone-800 dark:hover:bg-amber-300 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Adicionar Nova</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
