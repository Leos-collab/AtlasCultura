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
  Heart,
  CheckCircle2
} from 'lucide-react';
import { InteractiveParticleCanvas } from './InteractiveParticleCanvas';

interface WelcomeBackSplashProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  theme: 'light' | 'dark';
  onToggleTheme?: () => void;
  experienceCount?: number;
}

const WELCOME_MESSAGES = [
  'Sincronizando suas memórias e retrospectivas...',
  'Organizando seus shows, cinemas e leituras...',
  'Recuperando seus ingressos e momentos inesquecíveis...',
  'Tudo pronto para viver novas experiências culturais!'
];

export const WelcomeBackSplash: React.FC<WelcomeBackSplashProps> = ({
  isOpen,
  onClose,
  userName,
  theme,
  onToggleTheme,
  experienceCount = 0
}) => {
  const [msgIndex, setMsgIndex] = useState(0);
  const [progress, setProgress] = useState(15);
  const [isLeaving, setIsLeaving] = useState(false);

  // Message rotation and progress fill
  useEffect(() => {
    if (!isOpen) {
      setProgress(15);
      setIsLeaving(false);
      return;
    }

    const msgInterval = setInterval(() => {
      setMsgIndex(prev => (prev + 1) % WELCOME_MESSAGES.length);
    }, 1100);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 5;
      });
    }, 120);

    // Auto-proceed after ~3.5 seconds
    const autoTimer = setTimeout(() => {
      handleEnterSite();
    }, 3600);

    return () => {
      clearInterval(msgInterval);
      clearInterval(progressInterval);
      clearTimeout(autoTimer);
    };
  }, [isOpen]);

  const handleEnterSite = () => {
    if (isLeaving) return;
    setIsLeaving(true);
    setTimeout(() => {
      onClose();
      setIsLeaving(false);
    }, 600);
  };

  if (!isOpen) return null;

  const isDark = theme === 'dark';

  return (
    <div 
      className={`fixed inset-0 z-50 flex flex-col justify-between overflow-hidden transition-all duration-700 select-none ${
        isLeaving ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      } ${
        isDark 
          ? 'bg-gradient-to-br from-[#0c0b0a] via-[#161412] to-[#12101a] text-stone-100' 
          : 'bg-gradient-to-br from-[#e8e4f2] via-[#e2daef] to-[#d6cde4] text-stone-900'
      }`}
    >
      {/* Background Interactive Particle Canvas */}
      <InteractiveParticleCanvas theme={theme} />

      {/* Ambient glowing orbs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-amber-500/15 dark:bg-amber-400/10 blur-[140px] pointer-events-none mix-blend-multiply dark:mix-blend-screen" />
      <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] rounded-full bg-sky-500/10 dark:bg-indigo-500/10 blur-[130px] pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-30 w-full border-b border-stone-200/60 dark:border-stone-800/60 bg-white/40 dark:bg-stone-950/40 backdrop-blur-md sticky top-0">
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
                Acesso Autorizado
              </span>
            </div>
          </div>

          {onToggleTheme && (
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
          )}
        </div>
        <div className="w-full h-[1px] bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />
      </header>

      {/* Center Grand Welcome Stage */}
      <main className="relative z-20 flex-1 flex flex-col items-center justify-center px-4 py-8 text-center max-w-3xl mx-auto w-full">
        {/* Animated Celebration Pill */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-400/20 text-amber-700 dark:text-amber-300 text-xs font-extrabold uppercase tracking-widest border border-amber-400/35 mb-5 shadow-sm backdrop-blur-xs animate-in fade-in zoom-in duration-500">
          <Sparkles className="w-4 h-4 text-amber-500 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Que bom ter você de volta!</span>
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse ml-0.5" />
        </div>

        {/* Big Greeting Title */}
        <h1 className="font-serif-title text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight mb-4 text-stone-900 dark:text-stone-50">
          Bem-vindo de volta,{' '}
          <span className="bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 bg-clip-text text-transparent drop-shadow-sm">
            {userName}
          </span>
          !
        </h1>

        {/* Subtitle Description */}
        <p className="text-base sm:text-lg text-stone-600 dark:text-stone-300 font-normal max-w-xl mb-6 leading-relaxed">
          Seu passaporte cultural foi desbloqueado com sucesso. Suas memórias, ingressos, resenhas e descobertas estão prontos para você.
        </p>

        {/* Category Icons Showcase Banner */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-xl mb-8">
          {[
            { label: 'Shows & Festivais', icon: Music, color: '#a855f7' },
            { label: 'Cinema & Filmes', icon: Film, color: '#06b6d4' },
            { label: 'Livros & Leituras', icon: BookOpen, color: '#f59e0b' },
            { label: 'Museus & Arte', icon: Landmark, color: '#10b981' },
            { label: 'Viagens & Rotas', icon: MapPin, color: '#ec4899' },
          ].map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <div 
                key={idx}
                className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-white/70 dark:bg-stone-900/70 backdrop-blur-md border border-stone-200/70 dark:border-stone-800 shadow-sm"
              >
                <div 
                  className="w-5 h-5 rounded-md flex items-center justify-center"
                  style={{ backgroundColor: `${cat.color}25`, color: cat.color }}
                >
                  <Icon className="w-3 h-3" />
                </div>
                <span className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                  {cat.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Dynamic Loading Status & Progress Bar */}
        <div className="w-full max-w-md bg-white/80 dark:bg-stone-900/80 backdrop-blur-md border border-stone-200 dark:border-stone-800 rounded-2xl p-4 shadow-xl mb-8">
          <div className="flex items-center justify-between text-xs font-medium mb-2">
            <span className="text-stone-600 dark:text-stone-300 flex items-center gap-2 truncate">
              <span className="inline-block w-2 h-2 rounded-full bg-amber-500 animate-ping" />
              {WELCOME_MESSAGES[msgIndex]}
            </span>
            <span className="text-amber-600 dark:text-amber-400 font-bold ml-2">
              {progress}%
            </span>
          </div>

          <div className="w-full h-2 bg-stone-100 dark:bg-stone-950 rounded-full overflow-hidden p-0.5 border border-stone-200/50 dark:border-stone-800">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 rounded-full transition-all duration-200 ease-out shadow-xs"
              style={{ width: `${progress}%` }}
            />
          </div>

          {experienceCount > 0 && (
            <div className="flex items-center justify-center gap-1.5 text-[11px] text-stone-500 dark:text-stone-400 mt-2.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              <span><strong>{experienceCount}</strong> memórias arquivadas e disponíveis</span>
            </div>
          )}
        </div>

        {/* Main CTA Button: Enter Official Site */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <button
            type="button"
            id="btn-welcome-enter-site"
            onClick={handleEnterSite}
            className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-stone-950 font-serif-title font-extrabold text-base tracking-wide shadow-xl shadow-amber-500/25 hover:shadow-2xl hover:shadow-amber-500/40 hover:scale-103 active:scale-98 transition-all cursor-pointer overflow-hidden"
          >
            {/* Ambient Shine overlay */}
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-out" />
            
            <span>Acessar Atlas Cultural</span>
            <div className="w-8 h-8 rounded-xl bg-stone-950 text-amber-400 flex items-center justify-center group-hover:translate-x-1 transition-transform">
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </div>
          </button>
        </div>
      </main>

      {/* Footer banner */}
      <footer className="relative z-20 py-4 px-6 text-center text-xs text-stone-500 dark:text-stone-400 border-t border-stone-200/60 dark:border-stone-800/60 bg-white/30 dark:bg-stone-950/30 backdrop-blur-xs">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>Atlas Cultural • Linha do tempo de memórias, shows, livros, arte e descobertas</span>
          <span className="font-semibold text-amber-600 dark:text-amber-400">Sessão Oficial Iniciada</span>
        </div>
      </footer>
    </div>
  );
};
