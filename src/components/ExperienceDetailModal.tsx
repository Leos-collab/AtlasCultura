import React, { useState } from 'react';
import { 
  X, 
  Calendar, 
  MapPin, 
  Users, 
  Star, 
  Edit3, 
  Trash2, 
  Heart, 
  Share2, 
  Sparkles,
  Crop,
  AlertTriangle
} from 'lucide-react';
import { CulturalExperience } from '../types';
import { CATEGORIES_CONFIG } from '../data/categories';
import { CategoryIcon } from './CategoryIcon';
import { SafeImage } from './SafeImage';

interface ExperienceDetailModalProps {
  experience: CulturalExperience | null;
  onClose: () => void;
  onEdit: (experience: CulturalExperience) => void;
  onDelete: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

export const ExperienceDetailModal: React.FC<ExperienceDetailModalProps> = ({
  experience,
  onClose,
  onEdit,
  onDelete,
  onToggleFavorite
}) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  if (!experience) return null;

  const config = CATEGORIES_CONFIG[experience.category] || CATEGORIES_CONFIG.outro;

  const formattedDate = new Date(experience.date + 'T12:00:00').toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: experience.title,
        text: `Minha experiência cultural no Atlas Cultural: ${experience.title} (${config.label})`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(
        `[Atlas Cultural] Vivi "${experience.title}" em ${experience.venue || 'local especial'} com nota ${experience.rating}/5! #${experience.vibeTag}`
      );
      alert('Texto da memória copiado para a área de transferência!');
    }
  };

  const getAspectRatioClass = () => {
    switch (experience.imageAspectRatio) {
      case '16:9': return 'h-64 sm:h-72';
      case '4:3': return 'h-72 sm:h-80';
      case '1:1': return 'h-72 sm:h-80 max-w-sm mx-auto';
      case '3:4': return 'h-80 sm:h-96 max-w-xs mx-auto';
      default: return 'h-60 sm:h-68';
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/80 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="bg-[#faf8f5] dark:bg-stone-900 border border-stone-300 dark:border-stone-800 text-stone-900 dark:text-stone-100 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden my-6 transition-colors">
        
        {/* Top Floating Actions */}
        <div className="p-4 flex items-center justify-between border-b border-stone-200 dark:border-stone-800 bg-stone-100/60 dark:bg-stone-950/50">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-stone-900 dark:bg-stone-800 text-amber-300 border border-amber-400/30">
            <CategoryIcon category={experience.category} className="w-3.5 h-3.5 text-amber-400" />
            {config.label}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onToggleFavorite(experience.id)}
              className={`p-2 rounded-full transition-all cursor-pointer ${
                experience.favorite
                  ? 'bg-rose-500 text-white'
                  : 'bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:bg-stone-300 dark:hover:bg-stone-700'
              }`}
              title="Favoritar"
            >
              <Heart className={`w-4 h-4 ${experience.favorite ? 'fill-white' : ''}`} />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white hover:bg-stone-300 dark:hover:bg-stone-700 transition-all cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Visual Cover Banner with chosen aspect ratio, fit and frame style */}
        <div className="p-4 bg-stone-100 dark:bg-stone-950">
          <div 
            className={`relative w-full rounded-2xl overflow-hidden shadow-md ${getAspectRatioClass()} ${
              experience.imageFrameStyle === 'polaroid'
                ? 'shadow-xl'
                : experience.imageFrameStyle === 'poster'
                  ? 'border-4 border-amber-500/50 shadow-2xl'
                  : 'bg-stone-900'
            }`}
            style={{
              backgroundColor: experience.imageFrameStyle === 'polaroid' 
                ? (experience.imageFrameColor || '#ffffff') 
                : experience.imageFrameStyle === 'poster' 
                  ? (experience.imageFrameColor || '#0c0a09') 
                  : undefined,
              padding: experience.imageFrameStyle === 'polaroid' ? '12px 12px 28px 12px' : experience.imageFrameStyle === 'poster' ? '8px' : '0px'
            }}
          >
            {experience.imageUrl ? (
              <SafeImage
                src={experience.imageUrl}
                alt={experience.title}
                category={experience.category}
                fallbackTitle={experience.title}
                style={{
                  transform: experience.imageZoom ? `scale(${experience.imageZoom})` : undefined,
                  transformOrigin: `${experience.imageFocalX ?? 50}% ${experience.imageFocalY ?? 50}%`
                }}
                className={`w-full h-full ${
                  experience.imageFit === 'contain' ? 'object-contain bg-black' : 'object-cover'
                }`}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-stone-800 text-stone-600">
                <CategoryIcon category={experience.category} className="w-16 h-16 opacity-30" />
              </div>
            )}
            {experience.imageFrameStyle === 'polaroid' && (
              <p 
                className="mt-3 text-center text-xs italic font-serif truncate w-full px-2"
                style={{
                  color: ['#1c1917', '#000000', '#262626', '#0c0a09'].includes((experience.imageFrameColor || '').toLowerCase()) ? '#f5f5f5' : '#292524'
                }}
              >
                {experience.imagePolaroidText || experience.title}
              </p>
            )}
          </div>
        </div>

        {/* Title Header */}
        <div className="px-6 pt-4">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2 py-0.5 rounded bg-amber-400/20 text-amber-700 dark:text-amber-300 text-xs font-semibold border border-amber-400/30">
              {experience.vibeTag}
            </span>
            {experience.ticketOrCost && (
              <span className="text-xs text-stone-500 dark:text-stone-400">
                • {experience.ticketOrCost}
              </span>
            )}
            {experience.imageAspectRatio && (
              <span className="ml-auto text-[10px] text-stone-500 flex items-center gap-1">
                <Crop className="w-3 h-3" /> {experience.imageAspectRatio}
              </span>
            )}
          </div>
          <h1 className="font-serif-title text-xl sm:text-2xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
            {experience.title}
          </h1>
          {experience.creatorOrArtist && (
            <p className="text-sm text-stone-600 dark:text-stone-400 font-medium mt-0.5">
              por {experience.creatorOrArtist}
            </p>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6">
          {/* Metadata chips */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-4 border-b border-stone-200 dark:border-stone-800 text-sm">
            <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
              <Calendar className="w-4 h-4 text-stone-400 shrink-0" />
              <span>{formattedDate}</span>
            </div>
            <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300">
              <MapPin className="w-4 h-4 text-stone-400 shrink-0" />
              <span className="truncate">
                {experience.venue} {experience.city ? `• ${experience.city}` : ''}
              </span>
            </div>
            <div className="flex items-center gap-2 text-stone-700 dark:text-stone-300 sm:col-span-2">
              <Users className="w-4 h-4 text-stone-400 shrink-0" />
              <span className="text-stone-500 dark:text-stone-400">Companhias:</span>
              <div className="flex flex-wrap gap-1">
                {experience.companions.map((comp) => (
                  <span key={comp} className="px-2 py-0.5 rounded-full bg-stone-200 dark:bg-stone-800 text-stone-800 dark:text-stone-200 text-xs font-medium">
                    {comp}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Rating */}
          {experience.rating > 0 && (
            <div className="flex items-center justify-between bg-stone-100 dark:bg-stone-950 p-3 rounded-2xl">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">
                Sua Avaliação
              </span>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    className={`w-4 h-4 ${
                      s <= experience.rating ? 'fill-amber-400 text-amber-400' : 'text-stone-300 dark:text-stone-700'
                    }`}
                  />
                ))}
                <span className="ml-1 text-xs font-bold text-stone-800 dark:text-stone-200">
                  {experience.rating}.0 / 5.0
                </span>
              </div>
            </div>
          )}

          {/* Notes & Memories */}
          {experience.notes ? (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Memórias & Impressões
              </h4>
              <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-900/40 text-stone-800 dark:text-stone-200 text-sm leading-relaxed italic font-serif">
                "{experience.notes}"
              </div>
            </div>
          ) : (
            <div className="text-xs text-stone-400 italic">
              Nenhuma nota adicional registrada para esta memória.
            </div>
          )}

          {/* Inline Delete Confirmation */}
          {isConfirmingDelete && (
            <div className="p-3.5 rounded-2xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900/60 flex flex-col sm:flex-row items-center justify-between gap-3 animate-fadeIn">
              <div className="flex items-center gap-2 text-rose-800 dark:text-rose-300 text-xs">
                <AlertTriangle className="w-4 h-4 text-rose-500 shrink-0" />
                <span>
                  Tem certeza que deseja excluir <strong>"{experience.title}"</strong>?
                </span>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <button
                  type="button"
                  id="btn-confirm-delete-yes"
                  onClick={() => {
                    onDelete(experience.id);
                    onClose();
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
                >
                  Sim, Excluir
                </button>
                <button
                  type="button"
                  id="btn-confirm-delete-cancel"
                  onClick={() => setIsConfirmingDelete(false)}
                  className="px-3 py-1.5 rounded-xl bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-700 dark:text-stone-300 text-xs font-medium cursor-pointer transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          {/* Actions footer */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => {
                  onEdit(experience);
                  onClose();
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-semibold cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5 text-stone-500" />
                Editar
              </button>
              {!isConfirmingDelete && (
                <button
                  type="button"
                  id="btn-open-confirm-delete"
                  onClick={() => setIsConfirmingDelete(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-rose-300 dark:border-rose-900/80 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 text-xs font-semibold cursor-pointer transition-colors"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  Excluir
                </button>
              )}
            </div>

            <button
              type="button"
              onClick={handleShare}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-900 dark:bg-amber-400 hover:bg-stone-800 dark:hover:bg-amber-300 text-amber-300 dark:text-stone-950 text-xs font-bold shadow-xs cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              Compartilhar Memória
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
