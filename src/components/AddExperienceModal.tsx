import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Upload, 
  Camera, 
  MapPin, 
  Calendar, 
  Star, 
  Heart, 
  Sparkles, 
  Check, 
  DollarSign, 
  Users, 
  Maximize2, 
  Crop, 
  Image as ImageIcon, 
  Sliders, 
  Trash2, 
  RotateCw,
  Hand,
  Crown
} from 'lucide-react';
import { 
  CulturalExperience, 
  ExperienceCategory, 
  ImageAspectRatio, 
  ImageFit, 
  ImageFrameStyle 
} from '../types';
import { CATEGORIES_CONFIG, VIBE_TAGS, COMPANIONS_PRESETS } from '../data/categories';
import { CategoryIcon } from './CategoryIcon';
import { GoogleContactsModal } from './GoogleContactsModal';

interface AddExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (experience: Partial<CulturalExperience>) => void;
  initialData?: CulturalExperience | null;
  initialMode?: 'experience' | 'wishlist';
  theme?: 'light' | 'dark';
  currentYear?: number;
  isPremium?: boolean;
  totalExperienceCount?: number;
  onGoToPlans?: () => void;
}

const SAMPLE_CATEGORY_IMAGES: Record<ExperienceCategory, string[]> = {
  show: [
    'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=800&auto=format&fit=crop&q=80'
  ],
  filme: [
    'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&auto=format&fit=crop&q=80'
  ],
  livro: [
    'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=800&auto=format&fit=crop&q=80'
  ],
  museu: [
    'https://images.unsplash.com/photo-1566127444979-b3d2b654e3d7?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1582555172866-f73bb12a2ab3?w=800&auto=format&fit=crop&q=80'
  ],
  viagem: [
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80'
  ],
  trilha: [
    'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=800&auto=format&fit=crop&q=80'
  ],
  peça: [
    'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1503095396549-807759245b35?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1469488865564-c2de10f69f96?w=800&auto=format&fit=crop&q=80'
  ],
  festival: [
    'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80'
  ],
  restaurante: [
    'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800&auto=format&fit=crop&q=80'
  ],
  outro: [
    'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1495640388908-05fa85288e61?w=800&auto=format&fit=crop&q=80'
  ]
};

export const AddExperienceModal: React.FC<AddExperienceModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  initialMode,
  theme = 'light',
  currentYear,
  isPremium = false,
  totalExperienceCount = 0,
  onGoToPlans
}) => {
  const isWishlistMode = initialMode === 'wishlist';
  const [isGoogleContactsOpen, setIsGoogleContactsOpen] = useState(false);

  const getComputedDefaultDate = () => {
    const today = new Date();
    const yr = currentYear || today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yr}-${mm}-${dd}`;
  };

  const [title, setTitle] = useState('');
  const [creatorOrArtist, setCreatorOrArtist] = useState('');
  const [category, setCategory] = useState<ExperienceCategory>('show');
  const [date, setDate] = useState(getComputedDefaultDate);
  const [venue, setVenue] = useState('');
  const [city, setCity] = useState('');
  const [companionsInput, setCompanionsInput] = useState('');
  const [companionsList, setCompanionsList] = useState<string[]>([]);
  const [rating, setRating] = useState<number>(5);
  const [vibeTag, setVibeTag] = useState<string>('Inesquecível');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [ticketOrCost, setTicketOrCost] = useState('$$');
  const [status, setStatus] = useState<'completed' | 'wishlist'>('completed');

  // Image framing and format adjustment states
  const [imageAspectRatio, setImageAspectRatio] = useState<ImageAspectRatio>('16:9');
  const [imageFit, setImageFit] = useState<ImageFit>('cover');
  const [imageFrameStyle, setImageFrameStyle] = useState<ImageFrameStyle>('clean');
  const [imageZoom, setImageZoom] = useState<number>(1.0);
  const [imageFocalX, setImageFocalX] = useState<number>(50);
  const [imageFocalY, setImageFocalY] = useState<number>(50);
  const [imageFrameColor, setImageFrameColor] = useState<string>('#ffffff');
  const [imagePolaroidText, setImagePolaroidText] = useState<string>('');
  const [showImageAdvanced, setShowImageAdvanced] = useState(false);
  const [isDraggingFile, setIsDraggingFile] = useState(false);
  const [isDraggingFocal, setIsDraggingFocal] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const imagePreviewRef = useRef<HTMLDivElement | null>(null);

  const updateFocalFromEvent = (clientX: number, clientY: number) => {
    if (!imagePreviewRef.current) return;
    const rect = imagePreviewRef.current.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) return;
    const clickX = Math.max(0, Math.min(100, Math.round(((clientX - rect.left) / rect.width) * 100)));
    const clickY = Math.max(0, Math.min(100, Math.round(((clientY - rect.top) / rect.height) * 100)));
    setImageFocalX(clickX);
    setImageFocalY(clickY);
  };

  useEffect(() => {
    if (!isDraggingFocal) return;

    const handleMouseMove = (e: MouseEvent) => {
      updateFocalFromEvent(e.clientX, e.clientY);
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        updateFocalFromEvent(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleMouseUp = () => {
      setIsDraggingFocal(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDraggingFocal]);

  useEffect(() => {
    const el = imagePreviewRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const delta = e.deltaY < 0 ? 0.08 : -0.08;
      setImageZoom(prev => Math.max(1.0, Math.min(3.0, parseFloat((prev + delta).toFixed(2)))));
    };

    el.addEventListener('wheel', handleWheel, { passive: false });
    return () => el.removeEventListener('wheel', handleWheel);
  }, [imageUrl, showImageAdvanced]);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setCreatorOrArtist(initialData.creatorOrArtist || '');
      setCategory(initialData.category || 'show');
      setDate(initialData.date || getComputedDefaultDate());
      setVenue(initialData.venue || '');
      setCity(initialData.city || '');
      setCompanionsList(initialData.companions || []);
      setRating(initialData.rating || 5);
      setVibeTag(initialData.vibeTag || 'Inesquecível');
      setNotes(initialData.notes || '');
      setImageUrl(initialData.imageUrl || '');
      setImageAspectRatio(initialData.imageAspectRatio || '16:9');
      setImageFit(initialData.imageFit || 'cover');
      setImageFrameStyle(initialData.imageFrameStyle || 'clean');
      setImageZoom(initialData.imageZoom || 1.0);
      setImageFocalX(initialData.imageFocalX ?? 50);
      setImageFocalY(initialData.imageFocalY ?? 50);
      setImageFrameColor(initialData.imageFrameColor || '#ffffff');
      setImagePolaroidText(initialData.imagePolaroidText || '');
      setTicketOrCost(initialData.ticketOrCost || '$$');
      setStatus(initialData.status || (isWishlistMode ? 'wishlist' : 'completed'));
    } else {
      // Reset defaults
      setTitle('');
      setCreatorOrArtist('');
      setCategory('show');
      setDate(getComputedDefaultDate());
      setVenue('');
      setCity('');
      setCompanionsList([]);
      setRating(5);
      setVibeTag('Inesquecível');
      setNotes('');
      setImageUrl(SAMPLE_CATEGORY_IMAGES.show[0]);
      setImageAspectRatio('16:9');
      setImageFit('cover');
      setImageFrameStyle('clean');
      setImageZoom(1.0);
      setImageFocalX(50);
      setImageFocalY(50);
      setImageFrameColor('#ffffff');
      setImagePolaroidText('');
      setTicketOrCost('$$');
      setStatus(isWishlistMode ? 'wishlist' : 'completed');
    }
  }, [initialData, isOpen, isWishlistMode, currentYear]);

  if (!isOpen) return null;

  // File Upload Handlers
  const handleFileUpload = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecione um arquivo de imagem válido.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setImageUrl(e.target.result as string);
        setShowImageAdvanced(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(true);
  };

  const handleDragLeave = () => {
    setIsDraggingFile(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingFile(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  // Update default image when category changes if user hasn't uploaded/chosen a custom one
  const handleCategoryChange = (newCat: ExperienceCategory) => {
    setCategory(newCat);
    if (!imageUrl || Object.values(SAMPLE_CATEGORY_IMAGES).flat().includes(imageUrl)) {
      setImageUrl(SAMPLE_CATEGORY_IMAGES[newCat][0]);
    }
  };

  const handleAddCompanion = () => {
    const trimmed = companionsInput.trim();
    if (trimmed && !companionsList.includes(trimmed)) {
      setCompanionsList([...companionsList, trimmed]);
      setCompanionsInput('');
    }
  };

  const handleRemoveCompanion = (nameToRemove: string) => {
    setCompanionsList(companionsList.filter(c => c !== nameToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const parsedDate = new Date(date + 'T12:00:00');
    const year = isNaN(parsedDate.getFullYear()) ? new Date().getFullYear() : parsedDate.getFullYear();
    const month = isNaN(parsedDate.getMonth()) ? new Date().getMonth() : parsedDate.getMonth();

    const experienceData: Partial<CulturalExperience> = {
      id: initialData?.id,
      title: title.trim(),
      creatorOrArtist: creatorOrArtist.trim(),
      category,
      date,
      year,
      month,
      venue: venue.trim(),
      city: city.trim(),
      companions: companionsList.length > 0 ? companionsList : ['Sozinho(a)'],
      rating,
      vibeTag,
      notes: notes.trim(),
      imageUrl: imageUrl.trim() || undefined,
      imageAspectRatio,
      imageFit,
      imageFrameStyle,
      imageZoom,
      imageFocalX,
      imageFocalY,
      imageFrameColor,
      imagePolaroidText,
      ticketOrCost,
      status
    };

    onSave(experienceData);
    onClose();
  };

  // Helper for aspect ratio styling in preview
  const getAspectRatioClass = (ratio: ImageAspectRatio) => {
    switch (ratio) {
      case '16:9': return 'aspect-video';
      case '4:3': return 'aspect-4/3';
      case '1:1': return 'aspect-square max-w-[280px] mx-auto';
      case '3:4': return 'aspect-3/4 max-w-[260px] mx-auto';
      default: return 'aspect-video';
    }
  };

  const FREE_LIMIT = 5;
  // Editing an existing completed memory is allowed; creating a new one or converting a wishlist item to completed respects the 5 limit
  const isEditingExistingCompleted = Boolean(initialData?.id && initialData?.status === 'completed' && initialMode !== 'wishlist');
  const isAtFreeLimit = !isPremium && status === 'completed' && !isEditingExistingCompleted && totalExperienceCount >= FREE_LIMIT;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/70 backdrop-blur-xs overflow-y-auto">
      {isAtFreeLimit ? (
        /* Free plan paywall gate */
        <div
          className={`relative w-full max-w-md rounded-3xl shadow-2xl border overflow-hidden p-8 text-center ${
            theme === 'dark'
              ? 'bg-stone-900 border-stone-800 text-stone-100'
              : 'bg-[#efece6] border-stone-200 text-stone-900'
          }`}
          onClick={e => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
          <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center mx-auto mb-4">
            <Crown className="w-7 h-7 text-amber-600 dark:text-amber-400" />
          </div>
          <h3 className="font-serif-title text-xl font-bold mb-2">Limite do Plano Gratuito</h3>
          <p className="text-stone-500 dark:text-stone-400 text-sm mb-6">
            Você atingiu o limite de <strong>{FREE_LIMIT} experiências</strong> do plano gratuito.
            Faça upgrade para o <strong className="text-amber-600 dark:text-amber-400">Premium</strong> e registre sua vida cultural sem limites!
          </p>
          <button
            onClick={() => { onClose(); onGoToPlans?.(); }}
            className="w-full py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-md hover:shadow-lg"
          >
            <Crown className="w-4 h-4" />
            Ver Planos Premium
          </button>
          <button
            onClick={onClose}
            className="mt-3 w-full py-2.5 rounded-xl text-stone-500 dark:text-stone-400 text-sm hover:text-stone-700 dark:hover:text-stone-200 transition-colors"
          >
            Voltar
          </button>
        </div>
      ) : (
      <div 
        className="relative w-full max-w-2xl bg-white dark:bg-stone-900 dark:text-stone-100 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden my-auto max-h-[92vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-950/60 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-stone-900 dark:bg-amber-400 text-amber-400 dark:text-stone-950 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-serif-title text-lg font-bold text-stone-900 dark:text-stone-100">
                {isWishlistMode 
                  ? 'Adicionar à Lista de Desejos' 
                  : (initialData ? 'Editar Vivência Cultural' : 'Registrar Nova Experiência')}
              </h2>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                {isWishlistMode
                  ? 'Guarde o que você quer conhecer, assistir ou vivenciar em breve'
                  : 'Grave na sua linha do tempo com data, impressões e imagem'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 hover:bg-stone-200/50 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-6 flex-1 text-sm">
          
          {/* Status Switcher: Only shown if NOT in explicit wishlist mode */}
          {!isWishlistMode && (
            <div className="flex items-center p-1 rounded-xl bg-stone-100 dark:bg-stone-950 border border-stone-200 dark:border-stone-800">
              <button
                type="button"
                onClick={() => setStatus('completed')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  status === 'completed'
                    ? 'bg-stone-900 dark:bg-stone-800 text-amber-300 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                ✓ Já Vivi (Linha do Tempo)
              </button>
              <button
                type="button"
                onClick={() => setStatus('wishlist')}
                className={`flex-1 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  status === 'wishlist'
                    ? 'bg-stone-900 dark:bg-stone-800 text-amber-300 shadow-xs'
                    : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200'
                }`}
              >
                ★ Quero Viver (Lista de Desejos)
              </button>
            </div>
          )}

          {/* Category Picker */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-2">
              Categoria da Experiência
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {(Object.keys(CATEGORIES_CONFIG) as ExperienceCategory[]).map((catKey) => {
                const isSelected = category === catKey;
                const config = CATEGORIES_CONFIG[catKey];
                return (
                  <button
                    key={catKey}
                    type="button"
                    onClick={() => handleCategoryChange(catKey)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-stone-900 dark:bg-stone-800 text-amber-300 border-stone-900 dark:border-amber-400 shadow-xs scale-102'
                        : 'bg-white dark:bg-stone-950 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:border-stone-400'
                    }`}
                  >
                    <CategoryIcon category={catKey} className="w-4 h-4 mb-1" />
                    <span className="text-xs font-medium truncate w-full">{config.label.split('&')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary Info: Title & Creator */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1">
                Nome da Vivência *
              </label>
              <input
                id="input-exp-title"
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ex: Show Caetano & Bethânia, Oppenheimer..."
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1">
                Artista, Autor, Diretor ou Chef
              </label>
              <input
                id="input-exp-creator"
                type="text"
                value={creatorOrArtist}
                onChange={(e) => setCreatorOrArtist(e.target.value)}
                placeholder="Ex: Christopher Nolan, Machado de Assis..."
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Location & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1">
                Data {status === 'completed' ? 'vivida' : 'prevista'}
              </label>
              <input
                id="input-exp-date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1">
                Local / Espaço
              </label>
              <input
                id="input-exp-venue"
                type="text"
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                placeholder="Ex: Allianz Parque, MASP, Em casa..."
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1">
                Cidade
              </label>
              <input
                id="input-exp-city"
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder="Ex: São Paulo, Rio, Curitiba..."
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* ========================================================================= */}
          {/* USER REQUEST: "faça um outro botão 'carregar imagem' da forma que a pessoa */}
          {/* possa subir alguma imagem para a experiencia. Na hora de colocar a imagem */}
          {/* deixe que a pessoa ajuste se quer a imagem em tal forma e outra forma"     */}
          {/* ========================================================================= */}
          <div className="p-4 rounded-2xl border border-amber-300/80 dark:border-amber-500/40 bg-amber-50/50 dark:bg-stone-950/80 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                  <span>Foto / Imagem da Experiência</span>
                </label>
                <p className="text-[11px] text-stone-500 dark:text-stone-400">
                  Carregue uma foto sua e ajuste a forma, proporção e moldura.
                </p>
              </div>

              {/* Prominent "Carregar Imagem" Button */}
              <div className="flex items-center gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                  id="file-upload-input"
                />
                <button
                  type="button"
                  id="btn-carregar-imagem"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-stone-900 dark:bg-amber-400 hover:bg-stone-800 dark:hover:bg-amber-300 text-amber-300 dark:text-stone-950 text-xs font-bold shadow-sm transition-all cursor-pointer active:scale-98"
                >
                  <Upload className="w-4 h-4" />
                  <span>Carregar Imagem</span>
                </button>

                {imageUrl && (
                  <button
                    type="button"
                    onClick={() => setShowImageAdvanced(!showImageAdvanced)}
                    className="p-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-medium cursor-pointer"
                    title="Ajustar formato e forma da imagem"
                  >
                    <Sliders className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Drag & Drop Dropzone if no custom image or user wants to drop */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`p-4 rounded-xl border-2 border-dashed transition-all text-center cursor-pointer ${
                isDraggingFile
                  ? 'border-amber-500 bg-amber-100/60 dark:bg-amber-950/30'
                  : 'border-stone-300 dark:border-stone-800 hover:border-amber-400 bg-white/70 dark:bg-stone-900/60'
              }`}
            >
              <Upload className="w-5 h-5 mx-auto text-amber-600 dark:text-amber-400 mb-1" />
              <p className="text-xs font-semibold text-stone-800 dark:text-stone-200">
                Arraste uma foto aqui ou clique em "Carregar Imagem"
              </p>
              <p className="text-[11px] text-stone-500 dark:text-stone-400">
                PNG, JPG, WebP ou foto tirada na hora
              </p>
            </div>

            {/* Image Customization Controls: "ajuste se quer a imagem em tal forma e outra forma" */}
            {imageUrl && (
              <div className="space-y-4 pt-2 border-t border-amber-200/80 dark:border-stone-800">
                {/* Format / Aspect Ratio Selector */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5 flex items-center gap-1.5">
                    <Crop className="w-3.5 h-3.5 text-amber-600" />
                    <span>Forma / Proporção da Imagem:</span>
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { id: '16:9' as ImageAspectRatio, label: 'Panorâmico (16:9)', desc: 'Shows / Cinema' },
                      { id: '4:3' as ImageAspectRatio, label: 'Foto Clássica (4:3)', desc: 'Exposições' },
                      { id: '1:1' as ImageAspectRatio, label: 'Quadrado (1:1)', desc: 'Capa de Disco' },
                      { id: '3:4' as ImageAspectRatio, label: 'Pôster (3:4)', desc: 'Livro / Peça' },
                    ].map(fmt => (
                      <button
                        key={fmt.id}
                        type="button"
                        id={`btn-aspect-${fmt.id.replace(':', '-')}`}
                        onClick={() => setImageAspectRatio(fmt.id)}
                        className={`p-2 rounded-xl border text-left transition-all cursor-pointer ${
                          imageAspectRatio === fmt.id
                            ? 'bg-stone-900 dark:bg-stone-800 text-amber-300 border-stone-900 dark:border-amber-400 ring-2 ring-amber-400/20 shadow-xs'
                            : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border-stone-200 dark:border-stone-800 hover:border-stone-300'
                        }`}
                      >
                        <span className="block text-xs font-bold">{fmt.label}</span>
                        <span className="block text-[10px] opacity-70">{fmt.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Framing / Fit and Frame Style */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Object Fit */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      Enquadramento do Corte:
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setImageFit('cover')}
                        className={`flex-1 py-1.5 px-3 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                          imageFit === 'cover'
                            ? 'bg-stone-900 dark:bg-stone-800 text-amber-300 border-stone-900 dark:border-amber-400'
                            : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800'
                        }`}
                      >
                        Preencher (Cortar)
                      </button>
                      <button
                        type="button"
                        onClick={() => setImageFit('contain')}
                        className={`flex-1 py-1.5 px-3 rounded-lg border text-xs font-semibold cursor-pointer transition-all ${
                          imageFit === 'contain'
                            ? 'bg-stone-900 dark:bg-stone-800 text-amber-300 border-stone-900 dark:border-amber-400'
                            : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800'
                        }`}
                      >
                        Conter (Inteira)
                      </button>
                    </div>
                  </div>

                  {/* Frame Style & Color */}
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      Estilo da Moldura:
                    </label>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'clean' as ImageFrameStyle, label: 'Limpa' },
                        { id: 'polaroid' as ImageFrameStyle, label: 'Polaroid' },
                        { id: 'poster' as ImageFrameStyle, label: 'Pôster' },
                      ].map(style => (
                        <button
                          key={style.id}
                          type="button"
                          onClick={() => setImageFrameStyle(style.id)}
                          className={`py-1.5 px-2 rounded-lg border text-xs font-semibold text-center cursor-pointer transition-all ${
                            imageFrameStyle === style.id
                              ? 'bg-stone-900 dark:bg-stone-800 text-amber-300 border-stone-900 dark:border-amber-400'
                              : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800'
                          }`}
                        >
                          {style.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Frame Color Picker (when Polaroid or Poster is selected) */}
                {imageFrameStyle !== 'clean' && (
                  <div className="p-2.5 rounded-xl bg-stone-100 dark:bg-stone-900/90 border border-stone-200 dark:border-stone-800 space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-stone-700 dark:text-stone-300">
                      <span>Cor da Moldura:</span>
                      <span className="text-[11px] font-mono opacity-70">{imageFrameColor}</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      {[
                        { label: 'Branco', hex: '#ffffff' },
                        { label: 'Creme Retrô', hex: '#fef3c7' },
                        { label: 'Grafite', hex: '#1c1917' },
                        { label: 'Âmbar Dourado', hex: '#f59e0b' },
                        { label: 'Terracota', hex: '#ea580c' },
                        { label: 'Verde Sálvia', hex: '#d1fae5' },
                        { label: 'Rosa Suave', hex: '#fce7f3' },
                      ].map(c => (
                        <button
                          key={c.hex}
                          type="button"
                          onClick={() => setImageFrameColor(c.hex)}
                          className={`w-6 h-6 rounded-full border-2 transition-transform cursor-pointer ${
                            imageFrameColor.toLowerCase() === c.hex.toLowerCase()
                              ? 'ring-2 ring-amber-500 scale-115 border-white'
                              : 'border-stone-300 hover:scale-105'
                          }`}
                          style={{ backgroundColor: c.hex }}
                          title={c.label}
                        />
                      ))}
                      <input
                        type="color"
                        value={imageFrameColor}
                        onChange={(e) => setImageFrameColor(e.target.value)}
                        className="w-7 h-7 rounded-lg border border-stone-300 cursor-pointer p-0 bg-transparent"
                        title="Escolher cor personalizada"
                      />
                    </div>
                  </div>
                )}

                {/* Polaroid Custom Text */}
                {imageFrameStyle === 'polaroid' && (
                  <div>
                    <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                      Texto da Polaroid (Legenda personalizada ao lado/abaixo):
                    </label>
                    <input
                      type="text"
                      value={imagePolaroidText}
                      onChange={(e) => setImagePolaroidText(e.target.value)}
                      placeholder={title || 'Escreva algo marcante sobre a foto...'}
                      className="w-full px-3 py-1.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                )}

                {/* Zoom & Interactive Focal Point (Focalizar na parte que quiser) */}
                <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-400/40 space-y-2.5">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-800 dark:text-stone-200">
                    <span className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <span>Zoom Livre & Ponto Focal (Focalize onde quiser):</span>
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-400 text-stone-950 font-bold text-xs">
                      {Math.round(imageZoom * 100)}%
                    </span>
                  </div>

                  {/* Zoom Slider + Presets */}
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold text-stone-500">1x</span>
                      <input
                        type="range"
                        min="1.0"
                        max="3.0"
                        step="0.05"
                        value={imageZoom}
                        onChange={(e) => setImageZoom(parseFloat(e.target.value))}
                        onInput={(e) => setImageZoom(parseFloat((e.target as HTMLInputElement).value))}
                        onWheel={(e) => {
                          const delta = e.deltaY < 0 ? 0.05 : -0.05;
                          setImageZoom(prev => Math.max(1.0, Math.min(3.0, parseFloat((prev + delta).toFixed(2)))));
                        }}
                        className="flex-1 accent-amber-500 cursor-pointer h-2 bg-stone-200 dark:bg-stone-800 rounded-lg touch-none"
                      />
                      <span className="text-[11px] font-semibold text-stone-500">3x</span>
                    </div>

                    <div className="flex items-center gap-1.5 justify-between pt-0.5">
                      {[1.0, 1.3, 1.6, 2.0, 2.5, 3.0].map(val => (
                        <button
                          key={val}
                          type="button"
                          onClick={() => setImageZoom(val)}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold transition-all cursor-pointer ${
                            imageZoom === val
                              ? 'bg-stone-900 dark:bg-amber-400 text-amber-300 dark:text-stone-950 shadow-xs'
                              : 'bg-white dark:bg-stone-900 text-stone-600 dark:text-stone-400 border border-stone-200 dark:border-stone-800'
                          }`}
                        >
                          {val}x
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Interactive Hand Tool & Scroll Zoom Info */}
                  <div className="pt-2 border-t border-amber-300/40 dark:border-stone-800 flex items-center justify-between gap-2 text-xs">
                    <div className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300 text-[11px]">
                      <Hand className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>Arraste a foto para posicionar ou use a <strong>rodinha do mouse</strong> para dar zoom!</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setImageFocalX(50);
                        setImageFocalY(50);
                        setImageZoom(1.0);
                      }}
                      className="text-[10px] text-stone-500 hover:text-stone-800 dark:hover:text-stone-200 underline cursor-pointer shrink-0"
                    >
                      Centralizar (50%)
                    </button>
                  </div>
                </div>

                {/* Live Preview of Framed Image with Interactive Hand Drag */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="block text-[11px] font-bold uppercase tracking-wider text-stone-500 dark:text-stone-400">
                      Pré-visualização da Forma Selecionada:
                    </span>
                    <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">
                      {imageZoom > 1.0 ? `Zoom ${imageZoom}x (${imageFocalX}%, ${imageFocalY}%)` : 'Zoom 1.0x (Original)'}
                    </span>
                  </div>

                  <div 
                    className="overflow-hidden transition-all shadow-xl rounded-2xl flex items-center justify-center border"
                    style={{
                      backgroundColor: imageFrameStyle === 'clean' ? 'transparent' : imageFrameColor,
                      borderColor: imageFrameStyle === 'poster' ? '#f59e0b' : '#e5e5e5',
                      padding: imageFrameStyle === 'polaroid' ? '12px 12px 28px 12px' : imageFrameStyle === 'poster' ? '8px' : '0px',
                      boxShadow: imageFrameStyle === 'polaroid' ? '0 10px 25px -5px rgba(0, 0, 0, 0.2)' : undefined
                    }}
                  >
                    <div className="w-full flex flex-col items-center">
                      <div 
                        ref={imagePreviewRef}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setIsDraggingFocal(true);
                          updateFocalFromEvent(e.clientX, e.clientY);
                        }}
                        onTouchStart={(e) => {
                          if (e.touches.length > 0) {
                            setIsDraggingFocal(true);
                            updateFocalFromEvent(e.touches[0].clientX, e.touches[0].clientY);
                          }
                        }}
                        className={`w-full overflow-hidden relative group select-none ${
                          isDraggingFocal ? 'cursor-grabbing' : 'cursor-grab'
                        } ${getAspectRatioClass(imageAspectRatio)}`}
                        title="Clique e arraste com a mãozinha para mover o zoom!"
                      >
                        <img
                          src={imageUrl}
                          alt="Preview format"
                          style={{
                            transform: `scale(${imageZoom})`,
                            transformOrigin: `${imageFocalX}% ${imageFocalY}%`
                          }}
                          className={`w-full h-full select-none ${
                            isDraggingFocal ? 'transition-none' : 'transition-transform duration-150'
                          } ${imageFit === 'contain' ? 'object-contain bg-black' : 'object-cover'}`}
                        />

                        {/* Drag indicator floating badge */}
                        <div className={`absolute top-2 right-2 pointer-events-none px-2 py-1 rounded-md bg-stone-950/80 backdrop-blur-xs text-[10px] text-amber-300 font-medium flex items-center gap-1 transition-opacity shadow-md ${
                          isDraggingFocal ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
                        }`}>
                          <Hand className="w-3 h-3 text-amber-400" />
                          <span>{isDraggingFocal ? 'Movendo foco...' : 'Arraste para mover'}</span>
                        </div>
                      </div>

                      {/* Polaroid Custom Text under photo */}
                      {imageFrameStyle === 'polaroid' && (
                        <p 
                          className="mt-3 text-xs font-serif italic text-center w-full px-2 truncate"
                          style={{
                            color: ['#1c1917', '#000000', '#262626'].includes(imageFrameColor.toLowerCase()) ? '#f5f5f5' : '#292524'
                          }}
                        >
                          {imagePolaroidText || title || 'Sua vivência cultural'}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* URL paste or remove */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <button
                    type="button"
                    onClick={() => setImageUrl('')}
                    className="text-rose-600 hover:text-rose-700 flex items-center gap-1 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remover foto</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <span className="text-[11px] text-stone-500">Ou use uma sugestão:</span>
                    {SAMPLE_CATEGORY_IMAGES[category].map((img, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setImageUrl(img)}
                        className="w-6 h-6 rounded-md overflow-hidden border border-stone-300 hover:scale-110 transition-transform cursor-pointer"
                        title="Usar foto sugerida"
                      >
                        <img src={img} alt="Preset" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Companions */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400">
                {status === 'completed' ? 'Companhia(s) - Fui com quem?' : 'Companhia(s) - Com quem quer ir?'}
              </label>
              <button
                type="button"
                id="btn-google-contacts-sync"
                onClick={() => setIsGoogleContactsOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-amber-300 dark:border-amber-700/60 bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/60 text-xs font-semibold cursor-pointer transition-all shadow-2xs self-start sm:self-auto"
              >
                <svg className="w-3.5 h-3.5 shrink-0" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z" />
                  <path fill="#FBBC05" d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15Z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z" />
                </svg>
                <span>Conectar-se com os contatos via Google</span>
              </button>
            </div>
            <div className="flex items-center gap-2 mb-2">
              <input
                id="input-exp-companions"
                type="text"
                value={companionsInput}
                onChange={(e) => setCompanionsInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddCompanion();
                  }
                }}
                placeholder="Digite o nome e pressione Adicionar..."
                className="flex-1 px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <button
                type="button"
                onClick={handleAddCompanion}
                className="px-4 py-2 bg-stone-200 dark:bg-stone-800 hover:bg-stone-300 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Adicionar
              </button>
            </div>

            {/* Quick chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              {COMPANIONS_PRESETS.map((suggestion) => (
                <button
                  key={suggestion}
                  type="button"
                  onClick={() => {
                    if (!companionsList.includes(suggestion)) {
                      setCompanionsList([...companionsList, suggestion]);
                    }
                  }}
                  className="px-2 py-0.5 rounded-full border border-dashed border-stone-300 dark:border-stone-700 text-stone-600 dark:text-stone-400 text-xs hover:bg-stone-100 dark:hover:bg-stone-800 cursor-pointer"
                >
                  + {suggestion}
                </button>
              ))}
              {companionsList.map((comp) => (
                <span
                  key={comp}
                  className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-stone-900 dark:bg-amber-400 text-white dark:text-stone-950 text-xs font-medium"
                >
                  {comp}
                  <button
                    type="button"
                    onClick={() => handleRemoveCompanion(comp)}
                    className="hover:text-amber-400 dark:hover:text-stone-900 ml-1 cursor-pointer"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Rating, Vibe Tag, Cost (only if completed) */}
          {status === 'completed' && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 border-t border-stone-200 dark:border-stone-800">
              {/* Rating */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
                  Avaliação
                </label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className="p-1 text-amber-400 hover:scale-110 transition-transform cursor-pointer"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= rating
                            ? 'fill-amber-400 text-amber-400'
                            : 'text-stone-300 dark:text-stone-700'
                        }`}
                      />
                    </button>
                  ))}
                  <span className="text-xs font-semibold text-stone-600 dark:text-stone-400 ml-1">
                    {rating}/5
                  </span>
                </div>
              </div>

              {/* Vibe Tag */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
                  Vibe / Sensação
                </label>
                <select
                  id="select-exp-vibe"
                  value={vibeTag}
                  onChange={(e) => setVibeTag(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {VIBE_TAGS.map((tag) => (
                    <option key={tag} value={tag}>
                      {tag}
                    </option>
                  ))}
                </select>
              </div>

              {/* Ticket / Cost */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1.5">
                  Faixa de Custo
                </label>
                <div className="flex items-center gap-1">
                  {['Gratuito', '$', '$$', '$$$'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setTicketOrCost(c)}
                      className={`flex-1 py-1.5 text-xs font-medium rounded-lg border cursor-pointer transition-colors ${
                        ticketOrCost === c
                          ? 'bg-stone-900 dark:bg-amber-400 text-white dark:text-stone-950 border-stone-900 dark:border-amber-400'
                          : 'bg-white dark:bg-stone-950 text-stone-600 dark:text-stone-400 border-stone-200 dark:border-stone-800 hover:bg-stone-50'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Notes or Anotações depending on wishlist mode */}
          {status === 'wishlist' || isWishlistMode ? (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1">
                Anotações (Descreva alguma coisa sobre o lugar)
              </label>
              <textarea
                id="textarea-exp-anotacoes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Descreva alguma coisa sobre o lugar, recomendações que ouviu, dicas, pratos para provar ou o que você quer ver..."
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-1">
                Notas & Memórias (O que mais marcou você?)
              </label>
              <textarea
                id="textarea-exp-notes"
                rows={3}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="O que você sentiu? Qual momento ficou gravado? Citações, sensações ou recomendações..."
                className="w-full px-3.5 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-950 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          )}

          {/* Form Actions */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-sm font-medium transition-colors cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              id="btn-save-experience-submit"
              className="px-6 py-2 rounded-xl bg-stone-900 dark:bg-amber-400 hover:bg-stone-800 dark:hover:bg-amber-300 text-amber-300 dark:text-stone-950 text-sm font-semibold shadow-sm transition-all cursor-pointer"
            >
              {isWishlistMode || status === 'wishlist' ? 'Salvar Desejo' : (initialData ? 'Atualizar Memória' : 'Salvar Experiência')}
            </button>
          </div>
        </form>
      </div>
      )}

      {/* Google Contacts Picker Modal */}
      <GoogleContactsModal
        isOpen={isGoogleContactsOpen}
        onClose={() => setIsGoogleContactsOpen(false)}
        onSelectContacts={(names) => {
          const updated = [...companionsList];
          names.forEach((name) => {
            if (!updated.includes(name)) {
              updated.push(name);
            }
          });
          setCompanionsList(updated);
        }}
        title="Conectar Contatos via Google"
        description="Selecione contatos da sua conta Google para adicionar nesta vivência ou plano cultural."
        mode="companion_select"
      />
    </div>
  );
};
