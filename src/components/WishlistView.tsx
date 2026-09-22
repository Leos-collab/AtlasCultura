import React, { useState } from 'react';
import { 
  Bookmark, 
  Sparkles, 
  CheckCircle2, 
  Trash2, 
  MapPin, 
  Plus, 
  Calendar, 
  ExternalLink 
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CulturalExperience, ExperienceCategory } from '../types';
import { CATEGORIES_CONFIG } from '../data/categories';
import { CategoryIcon } from './CategoryIcon';
import { SafeImage } from './SafeImage';

interface WishlistViewProps {
  wishlist: CulturalExperience[];
  onMarkAsCompleted: (experience: CulturalExperience) => void;
  onRemoveWishlistItem: (id: string) => void;
  onOpenAddModal: () => void;
  isPremium?: boolean;
  totalCompletedCount?: number;
  onGoToPlans?: () => void;
}

export const WishlistView: React.FC<WishlistViewProps> = ({
  wishlist,
  onMarkAsCompleted,
  onRemoveWishlistItem,
  onOpenAddModal,
  isPremium = false,
  totalCompletedCount = 0,
  onGoToPlans
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ExperienceCategory | 'all'>('all');

  const filtered = wishlist.filter((item) => {
    if (selectedCategory !== 'all' && item.category !== selectedCategory) return false;
    return true;
  });

  const handleCompleteWithCelebration = (item: CulturalExperience) => {
    if (!isPremium && totalCompletedCount >= 5) {
      onMarkAsCompleted(item); // Will trigger paywall modal in App.tsx / AddExperienceModal
      return;
    }
    confetti({
      particleCount: 70,
      spread: 60,
      origin: { y: 0.7 }
    });
    onMarkAsCompleted(item);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-1">
            <Bookmark className="w-4 h-4 text-amber-500" />
            <span>Lista de Desejos & Próximas Vivências</span>
          </div>
          <h2 className="font-serif-title text-2xl sm:text-3xl font-bold text-stone-900 dark:text-stone-100 tracking-tight">
            O que você ainda quer viver
          </h2>
          <p className="text-sm text-stone-600 dark:text-stone-400">
            Salvos a partir das indicações de amigos ou das suas vontades futuras.
          </p>
        </div>

        <button
          type="button"
          id="btn-add-to-wishlist"
          onClick={onOpenAddModal}
          className="inline-flex items-center gap-2 bg-stone-900 dark:bg-amber-400 text-amber-300 dark:text-stone-950 px-4 py-2 rounded-xl text-sm font-semibold shadow-xs hover:bg-stone-800 dark:hover:bg-amber-300 transition-all cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 text-amber-400 dark:text-stone-950" />
          <span>Adicionar Desejo</span>
        </button>
      </div>

      {/* Category filter pills */}
      <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
        <button
          type="button"
          onClick={() => setSelectedCategory('all')}
          className={`px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
            selectedCategory === 'all'
              ? 'bg-stone-900 dark:bg-amber-400 text-amber-300 dark:text-stone-950 shadow-xs'
              : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
          }`}
        >
          Todos ({wishlist.length})
        </button>
        {(Object.keys(CATEGORIES_CONFIG) as ExperienceCategory[]).map((catKey) => {
          const count = wishlist.filter(e => e.category === catKey).length;
          if (count === 0 && selectedCategory !== catKey) return null;
          const isSelected = selectedCategory === catKey;
          const config = CATEGORIES_CONFIG[catKey];
          return (
            <button
              key={catKey}
              type="button"
              onClick={() => setSelectedCategory(catKey)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                isSelected
                  ? 'bg-stone-900 dark:bg-amber-400 text-amber-300 dark:text-stone-950 shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
              }`}
            >
              <CategoryIcon category={catKey} className="w-3.5 h-3.5" />
              <span>{config.pluralLabel}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-stone-800 dark:bg-amber-500 text-amber-300 dark:text-stone-950 font-bold' : 'bg-stone-200 dark:bg-stone-700 text-stone-600 dark:text-stone-400'}`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-12 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/50 text-amber-600 dark:text-amber-400 flex items-center justify-center mx-auto mb-3">
            <Bookmark className="w-6 h-6" />
          </div>
          <h3 className="font-serif-title text-lg font-bold text-stone-900 dark:text-stone-100 mb-1">
            Sua lista de desejos está vazia
          </h3>
          <p className="text-sm text-stone-500 dark:text-stone-400 mb-5">
            Navegue pela aba "Descobertas dos Amigos" ou adicione ideias que você quer realizar em breve!
          </p>
          <button
            type="button"
            onClick={onOpenAddModal}
            className="inline-flex items-center gap-2 bg-stone-900 dark:bg-amber-400 text-amber-300 dark:text-stone-950 px-4 py-2 rounded-xl text-sm font-semibold shadow-xs hover:bg-stone-800 dark:hover:bg-amber-300 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar Novo Desejo</span>
          </button>
        </div>
      )}

      {/* Wishlist Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((item) => {
          const catConfig = CATEGORIES_CONFIG[item.category] || CATEGORIES_CONFIG.outro;

          return (
            <div
              key={item.id}
              className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
            >
              <div>
                {/* Visual Image */}
                {item.imageUrl && (
                  <div className="h-44 w-full bg-stone-900 relative overflow-hidden">
                    <SafeImage
                      src={item.imageUrl}
                      alt={item.title}
                      category={item.category}
                      fallbackTitle={item.title}
                      className="w-full h-full object-cover"
                    />
                    <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full bg-stone-900/80 backdrop-blur-xs text-amber-300 text-xs font-bold border border-amber-400/20">
                      {catConfig.label.split('&')[0]}
                    </span>
                  </div>
                )}

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-serif-title font-bold text-base text-stone-900 dark:text-stone-100 line-clamp-1">
                      {item.title}
                    </h3>
                  </div>

                  {item.creatorOrArtist && (
                    <p className="text-xs text-stone-600 dark:text-stone-400 font-medium mb-2">
                      por {item.creatorOrArtist}
                    </p>
                  )}

                  {item.venue && (
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 mb-2 truncate">
                      <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                      <span>{item.venue}</span>
                    </div>
                  )}

                  {item.notes && (
                    <p className="text-xs text-stone-600 dark:text-stone-300 line-clamp-3 italic p-2.5 rounded-xl bg-stone-50 dark:bg-stone-950/70 border border-stone-200/70 dark:border-stone-800 font-serif">
                      "{item.notes}"
                    </p>
                  )}
                </div>
              </div>

              {/* Action buttons */}
              <div className="p-4 pt-2 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between gap-2">
                <button
                  type="button"
                  id={`btn-complete-wish-${item.id}`}
                  onClick={() => handleCompleteWithCelebration(item)}
                  className="flex-1 py-2 rounded-xl bg-stone-900 dark:bg-amber-400 hover:bg-stone-800 dark:hover:bg-amber-300 text-amber-300 dark:text-stone-950 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 dark:text-emerald-950" />
                  <span>Já Vivi! (Mover para Timeline)</span>
                </button>

                <button
                  type="button"
                  id={`btn-remove-wish-${item.id}`}
                  onClick={() => onRemoveWishlistItem(item.id)}
                  className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors cursor-pointer"
                  title="Remover da lista"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
