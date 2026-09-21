import React, { useState } from 'react';
import { X, CreditCard, Lock, CheckCircle, Sparkles, Crown, Loader2 } from 'lucide-react';
import { UserProfile } from '../types';

interface CheckoutModalProps {
  plan: 'monthly' | 'yearly';
  onClose: () => void;
  onSuccess: (updatedUser: UserProfile) => void;
  currentUser: UserProfile;
  theme: 'light' | 'dark';
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  plan,
  onClose,
  onSuccess,
  currentUser,
  theme
}) => {
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const price = plan === 'monthly' ? 'R$ 24,99/mês' : 'R$ 199,90/ano';
  const savings = plan === 'yearly' ? 'Economize R$ 99,98 vs mensal' : null;

  const formatCardNumber = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiry = (val: string) => {
    const digits = val.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsDone(true);
      setTimeout(() => {
        const upgraded: UserProfile = { ...currentUser, isPremium: true };
        onSuccess(upgraded);
      }, 2200);
    }, 2500);
  };

  const inputClass = `w-full px-3 py-2.5 rounded-xl border text-sm transition-colors outline-none focus:ring-2 focus:ring-amber-400 ${
    theme === 'dark'
      ? 'bg-stone-800 border-stone-700 text-stone-100 placeholder-stone-500'
      : 'bg-white border-stone-300 text-stone-900 placeholder-stone-400'
  }`;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className={`w-full max-w-md rounded-3xl shadow-2xl overflow-hidden transition-colors ${
        theme === 'dark' ? 'bg-stone-900 text-stone-100' : 'bg-[#efece6] text-stone-900'
      }`}>
        
        {/* Header */}
        <div className="relative bg-gradient-to-br from-amber-500 to-amber-600 p-6">
          <div className="absolute inset-0 bg-stone-900/20" />
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors z-10"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-1">
              <Crown className="w-5 h-5 text-white" />
              <span className="text-white/90 text-sm font-bold uppercase tracking-widest">Atlas Cultural Premium</span>
            </div>
            <p className="text-white text-2xl font-bold">{price}</p>
            {savings && (
              <span className="inline-block mt-1 text-xs bg-white/25 text-white px-2 py-0.5 rounded-full font-medium">
                🎉 {savings}
              </span>
            )}
          </div>
        </div>

        <div className="p-6">
          {isDone ? (
            /* Success State */
            <div className="py-6 text-center flex flex-col items-center gap-4 animate-fadeIn">
              <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                <CheckCircle className="w-9 h-9 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-1">Pagamento Confirmado!</h3>
                <p className="text-stone-500 dark:text-stone-400 text-sm">
                  Bem-vindo ao <strong>Atlas Premium</strong>! Todos os recursos foram desbloqueados.
                </p>
              </div>
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 text-sm font-medium animate-pulse">
                <Sparkles className="w-4 h-4" />
                <span>Redirecionando...</span>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <Lock className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-xs text-stone-500 dark:text-stone-400">Pagamento seguro e criptografado</span>
              </div>

              {/* Card Number */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1.5">
                  Número do Cartão
                </label>
                <div className="relative">
                  <input
                    className={inputClass}
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={e => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                    required
                  />
                  <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
                </div>
              </div>

              {/* Card Name */}
              <div>
                <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1.5">
                  Nome no Cartão
                </label>
                <input
                  className={inputClass}
                  placeholder="NOME COMPLETO"
                  value={cardName}
                  onChange={e => setCardName(e.target.value.toUpperCase())}
                  required
                />
              </div>

              {/* Expiry + CVV */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1.5">
                    Validade
                  </label>
                  <input
                    className={inputClass}
                    placeholder="MM/AA"
                    value={expiry}
                    onChange={e => setExpiry(formatExpiry(e.target.value))}
                    maxLength={5}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-600 dark:text-stone-400 mb-1.5">
                    CVV
                  </label>
                  <input
                    className={inputClass}
                    placeholder="123"
                    value={cvv}
                    onChange={e => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    maxLength={4}
                    required
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processando...</span>
                  </>
                ) : (
                  <>
                    <Crown className="w-4 h-4" />
                    <span>Finalizar Assinatura Premium</span>
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-stone-400 dark:text-stone-500">
                Ao assinar, você concorda com os Termos de Serviço. Cancele a qualquer momento.
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
