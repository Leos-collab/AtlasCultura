import React from 'react';
import { 
  Music, 
  Film, 
  BookOpen, 
  Landmark, 
  Plane, 
  Drama, 
  Sparkles, 
  Utensils, 
  Ticket,
  LucideProps
} from 'lucide-react';
import { ExperienceCategory } from '../types';

interface CategoryIconProps extends LucideProps {
  category: ExperienceCategory;
}

export const CategoryIcon: React.FC<CategoryIconProps> = ({ category, ...props }) => {
  switch (category) {
    case 'show':
      return <Music {...props} />;
    case 'filme':
      return <Film {...props} />;
    case 'livro':
      return <BookOpen {...props} />;
    case 'museu':
      return <Landmark {...props} />;
    case 'viagem':
    case 'trilha':
      return <Plane {...props} />;
    case 'peça':
      return <Drama {...props} />;
    case 'festival':
      return <Sparkles {...props} />;
    case 'restaurante':
      return <Utensils {...props} />;
    case 'outro':
    default:
      return <Ticket {...props} />;
  }
};
