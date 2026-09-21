import React, { useState, useEffect } from 'react';
import { 
  Compass, 
  Sparkles, 
  ArrowRight, 
  Sun, 
  Moon, 
  Music, 
  Film, 
  BookOpen, 
  Landmark, 
  MapPin, 
  Ticket,
  ChevronDown
} from 'lucide-react';
import { InteractiveParticleCanvas } from './InteractiveParticleCanvas';

interface IntroSplashScreenProps {
  onEnter: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const HERO_TAGLINES = [
  'Shows & Festivais Inesquecíveis',
  'Sétima Arte & Cineclubes',
  'Exposições & Galerias de Arte',
  'Páginas que Transformam & Teatros',
  'Viagens & Memórias Vivas'
];

export const IntroSplashScreen: React.FC<IntroSplashScreenProps> = ({
  onEnter,
  theme,
  onToggleTheme
}) => {
  const [taglineIndex, setTaglineIndex] = useState(0);
  const [isLeaving, setIsLeaving] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex(prev => (prev + 1) % HERO_TAGLINES.length);
    }, 3200);
    return () => clearInterval(interval);
  }, []);

  const handleStart = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onEnter();
    }, 600);
  };

  const isDark = theme === 'dark';

  return (
    <div 
      className={`min-h-screen w-full flex flex-col justify-between relative overflow-hidden transition-all duration-700 select-none ${
        isLeaving ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      } ${
        isDark 
          ? 'bg-gradient-to-br from-[#0c0b0a] via-[#151311] to-[#121018] text-stone-100' 
          : 'bg-gradient-to-br from-[#faf8f5] via-[#fff7ed] to-[#f0f4ff] text-stone-900'
      }`}
    >
      {/* Background Interactive Canvas */}
      <InteractiveParticleCanvas theme={theme} />

      {/* Top Header Bar */}
      <header className="w-full border-b border-stone-200/60 dark:border-stone-800/60 bg-white/40 dark:bg-stone-950/40 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-stone-950 dark:bg-amber-400 dark:text-stone-950 flex items-center justify-center shadow-lg shadow-amber-500/25 animate-pulse">
              <Compass className="w-6 h-6 stroke-[2.5]" />
            </div>
            <div>
              <span className="font-serif-title font-bold text-xl tracking-tight bg-gradient-to-r from-stone-900 via-stone-800 to-amber-600 dark:from-stone-100 dark:via-stone-200 dark:to-amber-400 bg-clip-text text-transparent">
                Atlas Cultural
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-amber-600 dark:text-amber-400">
                Life & Arts Passport
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={onToggleTheme}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer shadow-xs ${
              isDark
                ? 'bg-stone-900/90 border-stone-800 text-amber-300 hover:bg-stone-800 hover:border-amber-500/40'
                : 'bg-white/90 border-stone-200 text-stone-700 hover:bg-stone-100 hover:border-amber-500/40'
            }`}
          >
            {isDark ? (
              <>
                <Moon className="w-4 h-4 text-amber-300" />
                <span>Modo Escuro</span>
              </>
            ) : (
              <>
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Modo Claro</span>
              </>
            )}
          </button>
        </div>
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
      </header>

      {/* Main Hero Content Stage */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 py-12 text-center max-w-5xl mx-auto w-full">
        {/* Animated Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/15 text-amber-700 dark:text-amber-300 text-xs font-extrabold uppercase tracking-widest border border-amber-400/30 mb-6 shadow-sm backdrop-blur-xs animate-in fade-in zoom-in duration-500">
          <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '8s' }} />
          <span>Onde a Arte se Torna Memória Viva</span>
        </div>

        {/* Hero Title */}
        <h1 className="font-serif-title text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight leading-[1.1] mb-6 text-stone-900 dark:text-stone-50 max-w-4xl">
          Seu Mapa Vivo de{' '}
          <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 bg-clip-text text-transparent drop-shadow-sm">
            Shows, Livros, Filmes
          </span>{' '}
          & Exposições.
        </h1>

        {/* Dynamic Rotating Subtitle */}
        <div className="h-8 mb-8 flex items-center justify-center">
          <p className="text-base sm:text-xl text-stone-600 dark:text-stone-300 font-medium tracking-wide transition-all duration-500 animate-in fade-in slide-in-from-bottom-2">
            ✨ <span className="font-bold text-amber-600 dark:text-amber-400">{HERO_TAGLINES[taglineIndex]}</span>
          </p>
        </div>

        {/* Orbiting Category Spheres Visual Feature */}
        <div className="flex flex-wrap items-center justify-center gap-3 max-w-2xl mb-10">
          {[
            { label: 'Shows & Música', icon: Music, color: '#a855f7' },
            { label: 'Cinema & Filmes', icon: Film, color: '#06b6d4' },
            { label: 'Livros & Letras', icon: BookOpen, color: '#f59e0b' },
            { label: 'Museus & Arte', icon: Landmark, color: '#10b981' },
            { label: 'Viagens & Rotas', icon: MapPin, color: '#ec4899' },
          ].map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div 
                key={idx}
                className="flex items-center gap-2 px-3.5 py-1.5 rounded-2xl bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border border-stone-200/80 dark:border-stone-800 shadow-sm hover:scale-105 transition-transform"
              >
                <div 
                  className="w-6 h-6 rounded-lg flex items-center justify-center"
                  style={{ backgroundColor: `${cat.color}25`, color: cat.color }}
                >
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="text-xs font-bold text-stone-800 dark:text-stone-200">
                  {cat.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Main Interactive CTA Button */}
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <button
            type="button"
            onClick={handleStart}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-stone-950 font-serif-title font-extrabold text-base tracking-wide shadow-xl shadow-amber-500/25 hover:shadow-2xl hover:shadow-amber-500/40 hover:scale-103 active:scale-98 transition-all cursor-pointer overflow-hidden"
          >
            {/* Ambient Shine overlay on hover */}
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
            
            <span>Acessar Passaporte Cultural</span>
            <div className="w-8 h-8 rounded-xl bg-stone-950 text-amber-400 flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </div>
          </button>
        </div>
      </main>

      {/* Footer Banner */}
      <footer className="relative z-20 py-4 px-6 text-center text-xs text-stone-500 dark:text-stone-400 border-t border-stone-200/60 dark:border-stone-800/60 bg-white/30 dark:bg-stone-950/30 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Atlas Cultural • Linha do tempo de memórias, shows, livros, arte e descobertas</span>
          <span className="font-semibold text-amber-600 dark:text-amber-400">Edição 2026</span>
        </div>
      </footer>
    </div>
  );
};
