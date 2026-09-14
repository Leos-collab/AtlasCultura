import React, { useState } from 'react';
import { Sparkles, Calendar, RotateCcw, X, Check, ArrowRight, AlertTriangle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface NewYearModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentYear: number;
  onConfirmNewYear: (targetYear: number, wipeAllExperiences: boolean) => void;
  onRestoreSampleData?: () => void;
}

export const NewYearModal: React.FC<NewYearModalProps> = ({
  isOpen,
  onClose,
  currentYear,
  onConfirmNewYear,
  onRestoreSampleData
}) => {
  const [targetYear, setTargetYear] = useState<number>(currentYear + 1);
  const [customYearInput, setCustomYearInput] = useState<string>('');
  const [isCustomMode, setIsCustomMode] = useState<boolean>(false);
  const [wipeMode, setWipeMode] = useState<'switch_clean' | 'wipe_all'>('switch_clean');

  if (!isOpen) return null;

  const handleConfirm = () => {
    const finalYear = isCustomMode && parseInt(customYearInput) 
      ? parseInt(customYearInput) 
      : targetYear;

    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 }
    });
    onConfirmNewYear(finalYear, wipeMode === 'wipe_all');
    onClose();
  };

  const handleSetCustomYear = (val: string) => {
    setCustomYearInput(val);
    const parsed = parseInt(val);
    if (!isNaN(parsed) && parsed > 1900 && parsed < 2100) {
      setTargetYear(parsed);
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div 
        className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 w-full max-w-lg shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Banner */}
        <div className="relative bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 text-stone-950 p-6 overflow-hidden">
          <div className="absolute -right-8 -top-8 w-32 h-32 bg-white/15 rounded-full blur-xl pointer-events-none" />
          
          <div className="flex items-center justify-between mb-3 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-stone-950/20 text-stone-950 text-xs font-extrabold uppercase tracking-wider backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Novo Ciclo Cultural</span>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-full text-stone-950 hover:bg-black/10 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h3 className="font-serif-title text-2xl font-bold tracking-tight text-stone-950 mb-1">
            Iniciar Novo Ano / New Year
          </h3>
          <p className="text-xs text-stone-900/80 font-medium">
            Comece um novo Atlas Cultural zerado de experiências para registrar memórias conforme o tempo passa.
          </p>
        </div>

        {/* Modal Form */}
        <div className="p-6 space-y-5">
          {/* Year selector */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
                Selecione o Ano do Novo Ciclo
              </label>
              <button
                type="button"
                id="btn-custom-year-toggle"
                onClick={() => setIsCustomMode(!isCustomMode)}
                className="text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:underline cursor-pointer flex items-center gap-1"
              >
                <span>{isCustomMode ? 'Usar anos sugeridos' : '+ Digitar outro ano'}</span>
              </button>
            </div>

            {!isCustomMode ? (
              <div className="grid grid-cols-3 gap-2">
                {[currentYear + 1, currentYear + 2, currentYear].map((yr) => (
                  <button
                    key={yr}
                    type="button"
                    onClick={() => {
                      setTargetYear(yr);
                      setCustomYearInput(yr.toString());
                    }}
                    className={`py-2.5 px-3 rounded-xl text-center font-serif-title text-base font-bold transition-all cursor-pointer border ${
                      targetYear === yr
                        ? 'bg-stone-900 dark:bg-amber-400 text-amber-300 dark:text-stone-950 border-stone-900 dark:border-amber-400 shadow-xs'
                        : 'bg-stone-50 dark:bg-stone-800 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-700 hover:border-amber-400'
                    }`}
                  >
                    {yr}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-2 p-3 bg-stone-50 dark:bg-stone-800/80 rounded-2xl border border-amber-500/40">
                <Calendar className="w-5 h-5 text-amber-500 shrink-0" />
                <div className="flex-1">
                  <label htmlFor="custom-year-input" className="block text-[10px] uppercase font-bold text-stone-500 dark:text-stone-400 mb-0.5">
                    Digite o ano que desejar (ex: 2027, 2028, 2030):
                  </label>
                  <input
                    id="custom-year-input"
                    type="number"
                    min="1990"
                    max="2099"
                    value={customYearInput || targetYear}
                    onChange={(e) => handleSetCustomYear(e.target.value)}
                    placeholder="Ex: 2027"
                    className="w-full px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-900 dark:text-stone-100 font-bold text-base focus:ring-2 focus:ring-amber-400 outline-none"
                    autoFocus
                  />
                </div>
              </div>
            )}
          </div>

          {/* Wipe options */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300">
              Como deseja inicializar as experiências?
            </label>

            {/* Option 1: Clean year with history retained */}
            <div
              onClick={() => setWipeMode('switch_clean')}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                wipeMode === 'switch_clean'
                  ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/30'
                  : 'border-stone-200 dark:border-stone-800 hover:border-stone-300'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                wipeMode === 'switch_clean'
                  ? 'border-amber-500 bg-amber-500 text-white'
                  : 'border-stone-400'
              }`}>
                {wipeMode === 'switch_clean' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <div className="text-left">
                <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100 mb-0.5">
                  Começar {targetYear} Zerado (Manter histórico anterior acessível)
                </h4>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  O ano {targetYear} começará com 0 experiências para você registrar do zero. Seus anos anteriores continuarão salvos no histórico.
                </p>
              </div>
            </div>

            {/* Option 2: Full reset */}
            <div
              onClick={() => setWipeMode('wipe_all')}
              className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                wipeMode === 'wipe_all'
                  ? 'border-amber-500 bg-amber-50/60 dark:bg-amber-950/30'
                  : 'border-stone-200 dark:border-stone-800 hover:border-stone-300'
              }`}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                wipeMode === 'wipe_all'
                  ? 'border-amber-500 bg-amber-500 text-white'
                  : 'border-stone-400'
              }`}>
                {wipeMode === 'wipe_all' && <Check className="w-3 h-3 stroke-[3]" />}
              </div>
              <div className="text-left">
                <h4 className="font-bold text-xs text-stone-900 dark:text-stone-100 mb-0.5 flex items-center gap-1.5">
                  <span>Zerar Tudo e Começar Atlas Novo</span>
                  <span className="text-[9px] px-1.5 py-0.2 rounded bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 font-bold uppercase">
                    Reset Total
                  </span>
                </h4>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Limpa todas as experiências atuais, deixando o Atlas completamente virgem para o novo ano como se acabasse de instalar o app.
                </p>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-stone-200 dark:border-stone-800">
            {onRestoreSampleData ? (
              <button
                type="button"
                id="btn-modal-restore-samples"
                onClick={() => {
                  if (confirm('Deseja recarregar o Atlas com os dados originais completos de exemplo?')) {
                    onRestoreSampleData();
                    onClose();
                  }
                }}
                className="text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 text-xs font-semibold underline decoration-dotted flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-stone-400" />
                <span>Restaurar / Recarregar Modelo</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-stone-600 dark:text-stone-400 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                id="btn-confirm-new-year"
                onClick={handleConfirm}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-stone-900 dark:bg-amber-400 hover:bg-stone-800 dark:hover:bg-amber-300 text-amber-300 dark:text-stone-950 text-xs font-bold shadow-md transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Confirmar e Iniciar {isCustomMode && parseInt(customYearInput) ? customYearInput : targetYear}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
