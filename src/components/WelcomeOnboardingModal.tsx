import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  PlusCircle, 
  Calendar, 
  Compass, 
  MapPin, 
  Bookmark, 
  ArrowRight,
  Camera,
  Layers,
  Award,
  BookOpen,
  Film,
  Music
} from 'lucide-react';

interface WelcomeOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  userName: string;
  theme: 'light' | 'dark';
}

export const WelcomeOnboardingModal: React.FC<WelcomeOnboardingModalProps> = ({
  isOpen,
  onClose,
  userName,
  theme
}) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const steps = [
    {
      icon: PlusCircle,
      badge: 'Passo 1',
      title: 'Registrar Suas Vivências Culturais',
      desc: 'Clique em "+ Registrar Experiência" no topo. Selecione a categoria (Show, Filme, Livro, Museu, Peça, Viagem...) e anote tudo o que sentiu.',
      detail: 'Você pode subir fotos reais, escolher formatos (Polaroid, Pôster, Panorâmico), ajustar o zoom em qualquer parte da foto e indicar quem esteve com você (Sozinho, Família, Amigos, Parceiro).'
    },
    {
      icon: Calendar,
      badge: 'Passo 2',
      title: 'Linha do Tempo & Ciclos por Ano',
      desc: 'Suas memórias são organizadas cronologicamente. Você pode filtrar por categoria e navegar entre diferentes anos.',
      detail: 'Use o botão "+ Novo Ano" para iniciar um novo ciclo cultural (ex: 2027, 2028) ou planejar temporadas futuras com a retrospectiva renovada.'
    },
    {
      icon: Layers,
      badge: 'Passo 3',
      title: 'Mapa Visual & Selos Culturais',
      desc: 'Explore seus hábitos culturais com nós visuais interativos que mostram seus artistas, cidades e categorias mais vivenciadas.',
      detail: 'Desbloqueie conquistas dinâmicas como "Mestre dos Palcos", "Leitor Voraz" e "Olhar de Museu" conforme seu acervo cresce.'
    },
    {
      icon: MapPin,
      badge: 'Passo 4',
      title: 'Descoberta de Lugares com IA',
      desc: 'Na aba "Descoberta de Lugares", converse com o nosso Curador inteligente para receber dicas de museus, cinemas de rua, shows e restaurantes.',
      detail: 'Com 1 clique no botão "Adicionar aos Desejos", qualquer lugar recomendado é salvo na sua lista de desejos com foto e detalhes.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-300">
      <div 
        className={`w-full max-w-2xl rounded-3xl border shadow-2xl p-6 sm:p-8 relative overflow-hidden transition-all ${
          theme === 'dark'
            ? 'bg-stone-900 border-stone-800 text-stone-100'
            : 'bg-white border-stone-200 text-stone-900'
        }`}
      >
        {/* Ambient glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-2 border border-amber-400/30">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Passaporte Criado</span>
          </div>
          <h2 className="font-serif-title text-2xl sm:text-3xl font-bold tracking-tight mb-2">
            Seja bem-vindo(a) ao Atlas Cultural!
          </h2>
          <p className={`text-xs sm:text-sm max-w-md mx-auto ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`}>
            Olá, <strong className="text-amber-500 dark:text-amber-400">{userName}</strong>! Seu espaço pessoal para catalogar e reviver sua vida cultural está pronto. Veja como começar:
          </p>
        </div>

        {/* 4 Steps Carousel / List */}
        <div className="space-y-3 mb-6">
          {steps.map((step, idx) => {
            const IconComp = step.icon;
            const isActive = currentStep === idx;

            return (
              <div
                key={idx}
                onClick={() => setCurrentStep(idx)}
                className={`p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer ${
                  isActive
                    ? 'bg-amber-500/10 border-amber-400/60 dark:border-amber-500/60 ring-1 ring-amber-400/30 shadow-xs'
                    : 'bg-stone-50/70 dark:bg-stone-950/40 border-stone-200 dark:border-stone-800/80 hover:border-stone-300 dark:hover:border-stone-700'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                    isActive
                      ? 'bg-stone-900 dark:bg-amber-400 text-amber-400 dark:text-stone-950'
                      : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-400'
                  }`}>
                    <IconComp className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <h4 className="font-serif-title font-bold text-sm text-stone-900 dark:text-stone-100">
                        {step.title}
                      </h4>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 bg-amber-100/70 dark:bg-amber-950/70 px-2 py-0.5 rounded-full">
                        {step.badge}
                      </span>
                    </div>
                    <p className="text-xs text-stone-600 dark:text-stone-300 leading-relaxed">
                      {step.desc}
                    </p>
                    {isActive && (
                      <p className="text-[11px] text-amber-800 dark:text-amber-300/90 mt-1.5 pt-1.5 border-t border-amber-200/50 dark:border-amber-900/50 italic">
                        💡 {step.detail}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Step dots & CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="flex items-center gap-2" style={{ height: '8px' }}>
            {steps.map((_, dotIdx) => (
              <button
                key={dotIdx}
                type="button"
                onClick={() => setCurrentStep(dotIdx)}
                style={{
                  width: currentStep === dotIdx ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '9999px',
                  backgroundColor: currentStep === dotIdx ? '#f59e0b' : undefined,
                  flexShrink: 0,
                  transition: 'all 0.25s ease',
                  cursor: 'pointer',
                  border: 'none',
                  padding: 0,
                  verticalAlign: 'middle',
                  display: 'inline-block',
                }}
                className={currentStep === dotIdx ? '' : 'bg-stone-300 dark:bg-stone-700'}
                title={`Passo ${dotIdx + 1}`}
              />
            ))}
          </div>

          <button
            type="button"
            id="btn-onboarding-finish"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-stone-900 dark:bg-amber-400 hover:bg-stone-800 dark:hover:bg-amber-300 text-amber-300 dark:text-stone-950 rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Começar minha jornada cultural</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
