import React, { useState } from 'react';
import {
  Crown,
  Zap,
  Infinity,
  Bot,
  Image,
  BarChart3,
  Map,
  Bookmark,
  Check,
  X,
  Star,
  Sparkles
} from 'lucide-react';
import { UserProfile } from '../types';
import { CheckoutModal } from './CheckoutModal';

interface SubscriptionViewProps {
  currentUser: UserProfile;
  onUpgrade: (updatedUser: UserProfile) => void;
  theme: 'light' | 'dark';
}

const FEATURES = [
  { icon: Infinity, label: 'Experiências Ilimitadas', free: '5 experiências', premium: 'Ilimitado' },
  { icon: Bot, label: 'Bot Curador Atlas (IA)', free: '2 consultas', premium: 'Ilimitado' },
  { icon: Image, label: 'Upload de Imagens & Capas', free: true, premium: true },
  { icon: BarChart3, label: 'Mapa Visual & Retrospectiva', free: true, premium: true },
  { icon: Map, label: 'Mapa Mental Interativo', free: true, premium: true },
  { icon: Bookmark, label: 'Lista de Desejos (Wishlist)', free: true, premium: true },
  { icon: Zap, label: 'Galeria Visual & Linha do Tempo', free: false, premium: true },
  { icon: Star, label: 'Badge de Membro Premium', free: false, premium: true },
  { icon: Sparkles, label: 'Acesso a novos recursos em beta', free: false, premium: true },
];

export const SubscriptionView: React.FC<SubscriptionViewProps> = ({
  currentUser,
  onUpgrade,
  theme
}) => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');
  const [checkoutPlan, setCheckoutPlan] = useState<'monthly' | 'yearly' | null>(null);

  const isPremium = currentUser.isPremium;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">

      {/* Header */}
      <div className="text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-widest border border-amber-200 dark:border-amber-800">
          <Crown className="w-3.5 h-3.5" />
          Planos & Assinaturas
        </div>
        <h1 className="font-serif-title text-4xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
          Expanda Sua Jornada Cultural
        </h1>
        <p className="text-stone-500 dark:text-stone-400 text-base max-w-lg mx-auto">
          Desbloqueie todo o potencial do Atlas Cultural com o plano Premium e registre sua vida cultural sem limites.
        </p>

        {isPremium && (
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 font-bold text-sm border border-emerald-200 dark:border-emerald-800 mt-2">
            <Check className="w-4 h-4" />
            Você já é um assinante Premium! Aproveite o acesso completo.
          </div>
        )}
      </div>

      {/* Billing Toggle */}
      {!isPremium && (
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => setSelectedPlan('monthly')}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all ${
              selectedPlan === 'monthly'
                ? 'bg-stone-900 dark:bg-stone-700 text-amber-400 shadow-sm'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            Mensal
          </button>
          <button
            onClick={() => setSelectedPlan('yearly')}
            className={`px-5 py-2 rounded-xl text-sm font-semibold transition-all flex items-center gap-2 ${
              selectedPlan === 'yearly'
                ? 'bg-stone-900 dark:bg-stone-700 text-amber-400 shadow-sm'
                : 'text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200'
            }`}
          >
            Anual
            <span className="text-[10px] bg-emerald-500 text-white px-1.5 py-0.5 rounded-full font-bold">
              -33%
            </span>
          </button>
        </div>
      )}

      {/* Plan Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        
        {/* FREE PLAN */}
        <div className={`rounded-3xl border p-6 flex flex-col gap-5 transition-colors ${
          theme === 'dark'
            ? 'bg-stone-900 border-stone-800'
            : 'bg-white border-stone-200'
        }`}>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-center">
                <Zap className="w-4 h-4 text-stone-500" />
              </div>
              <span className="font-bold text-stone-700 dark:text-stone-300">Plano Gratuito</span>
            </div>
            <div className="mt-3">
              <span className="text-4xl font-bold text-stone-900 dark:text-stone-100">R$ 0</span>
              <span className="text-stone-400 text-sm">/sempre</span>
            </div>
            <p className="text-stone-500 dark:text-stone-400 text-xs mt-1.5">Para quem está começando sua jornada cultural.</p>
          </div>

          <ul className="space-y-2.5 flex-1">
            {FEATURES.map((f, i) => {
              const val = f.free;
              const Icon = f.icon;
              const available = val !== false;
              return (
                <li key={i} className={`flex items-center gap-2.5 text-sm ${available ? 'text-stone-700 dark:text-stone-300' : 'text-stone-400 dark:text-stone-600 line-through'}`}>
                  {available
                    ? <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                    : <X className="w-4 h-4 text-stone-300 dark:text-stone-700 shrink-0" />
                  }
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{f.label}</span>
                  {typeof val === 'string' && (
                    <span className="ml-auto text-xs text-stone-400 font-medium">{val}</span>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-auto pt-2">
            <div className="w-full py-2.5 rounded-xl border border-stone-200 dark:border-stone-700 text-stone-400 dark:text-stone-600 text-sm font-semibold text-center cursor-default">
              Plano Atual
            </div>
          </div>
        </div>

        {/* PREMIUM PLAN */}
        <div className={`rounded-3xl border-2 border-amber-400 p-6 flex flex-col gap-5 relative overflow-hidden ${
          theme === 'dark' ? 'bg-stone-900' : 'bg-white'
        }`}>
          {/* Glow corner */}
          <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-400/20 rounded-full blur-3xl pointer-events-none" />

          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-400 text-stone-950 text-[10px] font-extrabold uppercase tracking-wider">
              <Crown className="w-3 h-3" />
              Popular
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-8 h-8 rounded-xl bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center">
                <Crown className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <span className="font-bold text-amber-700 dark:text-amber-400">Plano Premium</span>
            </div>
            <div className="mt-3 flex items-end gap-2">
              {selectedPlan === 'monthly' ? (
                <>
                  <span className="text-4xl font-bold text-stone-900 dark:text-stone-100">R$ 24,99</span>
                  <span className="text-stone-400 text-sm mb-1">/mês</span>
                </>
              ) : (
                <>
                  <span className="text-4xl font-bold text-stone-900 dark:text-stone-100">R$ 199,90</span>
                  <span className="text-stone-400 text-sm mb-1">/ano</span>
                </>
              )}
            </div>
            {selectedPlan === 'yearly' && (
              <p className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold mt-1">
                Equivale a R$ 16,66/mês · Economize R$ 99,98
              </p>
            )}
            {selectedPlan === 'monthly' && (
              <p className="text-stone-500 dark:text-stone-400 text-xs mt-1.5">Acesso completo, cancele quando quiser.</p>
            )}
          </div>

          <ul className="space-y-2.5 flex-1">
            {FEATURES.map((f, i) => {
              const val = f.premium;
              const Icon = f.icon;
              return (
                <li key={i} className="flex items-center gap-2.5 text-sm text-stone-700 dark:text-stone-300">
                  <Check className="w-4 h-4 text-amber-500 shrink-0" />
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span>{f.label}</span>
                  {typeof val === 'string' && (
                    <span className="ml-auto text-xs text-amber-600 dark:text-amber-400 font-bold">{val}</span>
                  )}
                </li>
              );
            })}
          </ul>

          <div className="mt-auto pt-2">
            {isPremium ? (
              <div className="w-full py-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 text-sm font-bold text-center flex items-center justify-center gap-2">
                <Check className="w-4 h-4" />
                Assinante Ativo
              </div>
            ) : (
              <button
                onClick={() => setCheckoutPlan(selectedPlan)}
                className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-sm transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 group"
              >
                <Crown className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>Assine já · {selectedPlan === 'monthly' ? 'R$ 24,99/mês' : 'R$ 199,90/ano'}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Feature Comparison Footer Note */}
      <div className={`rounded-2xl p-5 text-sm text-stone-500 dark:text-stone-400 text-center border ${
        theme === 'dark' ? 'border-stone-800 bg-stone-900/50' : 'border-stone-200 bg-white/50'
      }`}>
        <p>💳 Pagamento seguro · Cancele a qualquer momento · Suporte por e-mail incluso</p>
      </div>

      {/* Checkout Modal */}
      {checkoutPlan && (
        <CheckoutModal
          plan={checkoutPlan}
          onClose={() => setCheckoutPlan(null)}
          onSuccess={onUpgrade}
          currentUser={currentUser}
          theme={theme}
        />
      )}
    </div>
  );
};
