export type ExperienceCategory = 
  | 'show'
  | 'filme'
  | 'livro'
  | 'museu'
  | 'viagem'
  | 'trilha' // alias para retrocompatibilidade
  | 'peça'
  | 'festival'
  | 'restaurante'
  | 'outro';

export interface CategoryMeta {
  id: ExperienceCategory;
  label: string;
  pluralLabel: string;
  iconName: string;
  color: string;
  bgLight: string;
  borderColor: string;
  tagColor: string;
}

export type ImageAspectRatio = '16:9' | '4:3' | '1:1' | '3:4';
export type ImageFit = 'cover' | 'contain';
export type ImageFrameStyle = 'clean' | 'polaroid' | 'poster' | 'rounded';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  bio?: string;
  favoriteCategories?: ExperienceCategory[];
  createdAt: number;
  isPremium?: boolean;
}

export interface CulturalExperience {
  id: string;
  title: string;
  creatorOrArtist?: string; // e.g., Author, Director, Band, Chef
  category: ExperienceCategory;
  date: string; // YYYY-MM-DD
  year: number;
  month: number; // 0-11
  venue: string; // e.g. "Allianz Parque", "Cinema São Luiz", "Livro Físico"
  city?: string;
  companions: string[]; // e.g. ["Mariana", "Lucas"]
  rating: number; // 1 to 5
  vibeTag: string; // e.g. "Inesquecível", "Impactante", "Acolhedor", "Obra-Prima"
  notes: string;
  imageUrl?: string;
  imageAspectRatio?: ImageAspectRatio;
  imageFit?: ImageFit;
  imageFrameStyle?: ImageFrameStyle;
  imageZoom?: number;
  imageFocalX?: number; // 0 to 100 percentage
  imageFocalY?: number; // 0 to 100 percentage
  imageFrameColor?: string; // hex or rgb color for frame
  imagePolaroidText?: string; // custom text on polaroid
  imagePolaroidTextPosition?: 'bottom' | 'side'; // text placement
  ticketOrCost?: string; // "Gratuito", "$", "$$", "$$$"
  status: 'completed' | 'wishlist';
  createdAt: number;
  favorite?: boolean;
}

export interface FriendProfile {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  bio: string;
  tasteAffinity: number; // 0 - 100%
  commonInterests: string[];
  favoriteCategories: ExperienceCategory[];
}

export interface FriendActivity {
  id: string;
  friendId: string;
  friendName: string;
  friendAvatar: string;
  friendHandle: string;
  tasteAffinity: number;
  title: string;
  creatorOrArtist?: string;
  category: ExperienceCategory;
  date: string;
  venue: string;
  rating: number;
  review: string;
  vibeTag: string;
  imageUrl?: string;
  likesCount: number;
  likedByMe?: boolean;
  savedByMe?: boolean;
}

export interface SmartRecommendation {
  title: string;
  category: ExperienceCategory;
  matchReason: string;
  suggestedAction: string;
  highlight: string;
  imageUrl?: string;
  tags?: string[];
  venue?: string;
}

export type ActiveTab = 'timeline' | 'visual_map' | 'friends_discovery' | 'wishlist' | 'subscription';
