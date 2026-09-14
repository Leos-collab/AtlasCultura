import { CategoryMeta, ExperienceCategory } from '../types';

export const CATEGORIES_CONFIG: Record<ExperienceCategory, CategoryMeta> = {
  show: {
    id: 'show',
    label: 'Show & Música',
    pluralLabel: 'Shows',
    iconName: 'Music',
    color: '#8b5cf6', // Violet
    bgLight: 'bg-violet-50 text-violet-700 border-violet-200',
    borderColor: 'border-violet-500',
    tagColor: 'bg-violet-100 text-violet-800',
  },
  filme: {
    id: 'filme',
    label: 'Filme & Cinema',
    pluralLabel: 'Filmes',
    iconName: 'Film',
    color: '#0284c7', // Sky
    bgLight: 'bg-sky-50 text-sky-700 border-sky-200',
    borderColor: 'border-sky-500',
    tagColor: 'bg-sky-100 text-sky-800',
  },
  livro: {
    id: 'livro',
    label: 'Livro & Leitura',
    pluralLabel: 'Livros',
    iconName: 'BookOpen',
    color: '#b45309', // Amber
    bgLight: 'bg-amber-50 text-amber-800 border-amber-200',
    borderColor: 'border-amber-500',
    tagColor: 'bg-amber-100 text-amber-900',
  },
  museu: {
    id: 'museu',
    label: 'Museu & Exposição',
    pluralLabel: 'Exposições',
    iconName: 'Landmark',
    color: '#0d9488', // Teal
    bgLight: 'bg-teal-50 text-teal-800 border-teal-200',
    borderColor: 'border-teal-500',
    tagColor: 'bg-teal-100 text-teal-900',
  },
  peça: {
    id: 'peça',
    label: 'Teatro & Peça',
    pluralLabel: 'Teatro',
    iconName: 'Drama',
    color: '#e11d48', // Rose
    bgLight: 'bg-rose-50 text-rose-700 border-rose-200',
    borderColor: 'border-rose-500',
    tagColor: 'bg-rose-100 text-rose-900',
  },
  viagem: {
    id: 'viagem',
    label: 'Viagem & Roteiro',
    pluralLabel: 'Viagens',
    iconName: 'Plane',
    color: '#059669', // Emerald
    bgLight: 'bg-emerald-50 text-emerald-800 border-emerald-200',
    borderColor: 'border-emerald-500',
    tagColor: 'bg-emerald-100 text-emerald-900',
  },
  festival: {
    id: 'festival',
    label: 'Festival & Grande Evento',
    pluralLabel: 'Festivais',
    iconName: 'Sparkles',
    color: '#ea580c', // Orange
    bgLight: 'bg-orange-50 text-orange-800 border-orange-200',
    borderColor: 'border-orange-500',
    tagColor: 'bg-orange-100 text-orange-900',
  },
  restaurante: {
    id: 'restaurante',
    label: 'Restaurante & Gastronomia',
    pluralLabel: 'Restaurantes',
    iconName: 'Utensils',
    color: '#d97706', // Warm Ochre
    bgLight: 'bg-stone-100 text-stone-800 border-stone-300',
    borderColor: 'border-amber-600',
    tagColor: 'bg-stone-200 text-stone-900',
  },
  trilha: {
    id: 'trilha',
    label: 'Trilha & Natureza',
    pluralLabel: 'Trilhas',
    iconName: 'Compass',
    color: '#16a34a',
    bgLight: 'bg-green-50 text-green-800 border-green-200',
    borderColor: 'border-green-500',
    tagColor: 'bg-green-100 text-green-900',
  },
  outro: {
    id: 'outro',
    label: 'Outras Experiências',
    pluralLabel: 'Outros',
    iconName: 'Ticket',
    color: '#64748b', // Slate
    bgLight: 'bg-slate-50 text-slate-700 border-slate-200',
    borderColor: 'border-slate-400',
    tagColor: 'bg-slate-100 text-slate-800',
  }
};

export const VIBE_TAGS = [
  'Inesquecível',
  'Obra-Prima',
  'Emocionante',
  'Surpreendente',
  'Acolhedor',
  'Impactante',
  'Divertido',
  'Transformador',
  'Nostálgico',
  'Visualmente Deslumbrante',
  'Reflexivo',
  'Energia Única',
  'Delicioso',
  'Valeu a Pena'
];

export const COMPANIONS_PRESETS = [
  'Sozinho(a)',
  'Família',
  'Amigos',
  'Parceiro(a)'
];

