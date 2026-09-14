import React, { useEffect } from 'react';
import { Sparkles, Compass, ArrowRight, Heart } from 'lucide-react';

interface WelcomeBackSplashProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  theme: 'light' | 'dark';
}

export const WelcomeBackSplash: React.FC<WelcomeBackSplashProps> = ({
  isOpen,
  onClose,
  userName,
  theme
}) => {
  // Auto-dismiss after 2.8 seconds if not clicked
  useEffect(() => {
    if (!isOpen) return;
    const timer = setTimeout(() => {
      onClose();
    }, 2800);
    return () => clearTimeout(timer);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in zoom-in-95 duration-200">
      <div 
        className={`w-full max-w-md rounded-3xl border shadow-2xl p-6 sm:p-8 text-center relative overflow-hidden transition-all ${
          theme === 'dark'
            ? 'bg-stone-900 border-stone-800 text-stone-100'
            : 'bg-white border-stone-200 text-stone-900'
        }`}
      >
        {/* Glow effect */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Icon */}
        <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-400/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-4 border border-amber-400/30 shadow-sm animate-bounce">
          <Compass className="w-7 h-7" />
        </div>

        {/* Title */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/10 text-amber-600 dark:text-amber-400 text-[11px] font-bold uppercase tracking-wider mb-2 border border-amber-400/20">
          <Heart className="w-3 h-3 fill-amber-500 text-amber-500" />
          <span>Sessão Restaurada</span>
        </div>

        <h3 className="font-serif-title text-2xl font-bold tracking-tight mb-2">
          Obrigado por ter você de volta!
        </h3>

        <p className={`text-xs sm:text-sm mb-6 ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`}>
          Que bom ver você novamente, <strong className="text-amber-500 dark:text-amber-400">{userName}</strong>. Suas memórias e retrospectivas culturais estão prontinhas para novas vivências.
        </p>

        <button
          type="button"
          id="btn-welcome-back-continue"
          onClick={onClose}
          className="w-full py-2.5 bg-stone-900 dark:bg-amber-400 hover:bg-stone-800 dark:hover:bg-amber-300 text-amber-300 dark:text-stone-950 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
        >
          <span>Continuar para o Atlas</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
