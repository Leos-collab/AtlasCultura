import React, { useState } from 'react';
import { CategoryIcon } from './CategoryIcon';
import { CATEGORIES_CONFIG } from '../data/categories';
import { ExperienceCategory } from '../types';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  category?: ExperienceCategory;
  fallbackTitle?: string;
  containerClassName?: string;
}

export const SafeImage: React.FC<SafeImageProps> = ({
  src,
  alt = 'Imagem da experiência',
  category = 'outro',
  fallbackTitle,
  className = '',
  containerClassName = '',
  ...props
}) => {
  const [hasError, setHasError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const catConfig = CATEGORIES_CONFIG[category] || CATEGORIES_CONFIG.outro;

  // If no src is provided or error occurred, show the elegant fallback artwork
  if (!src || hasError) {
    return (
      <div 
        className={`w-full h-full flex flex-col items-center justify-center p-3 text-center select-none relative overflow-hidden transition-colors ${
          catConfig.bgLight
        } ${containerClassName}`}
        style={{
          background: `linear-gradient(135deg, ${catConfig.color}15 0%, ${catConfig.color}28 100%)`
        }}
      >
        {/* Subtle decorative circles */}
        <div 
          className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full opacity-20 pointer-events-none"
          style={{ backgroundColor: catConfig.color }}
        />
        <div 
          className="absolute -left-6 -top-6 w-16 h-16 rounded-full opacity-15 pointer-events-none"
          style={{ backgroundColor: catConfig.color }}
        />

        <div 
          className="w-10 h-10 rounded-2xl flex items-center justify-center mb-1.5 shadow-xs border border-white/40 dark:border-white/10"
          style={{ backgroundColor: `${catConfig.color}25`, color: catConfig.color }}
        >
          <CategoryIcon category={category} className="w-5 h-5" />
        </div>

        <span className="text-[11px] font-bold text-stone-800 dark:text-stone-200 line-clamp-1 max-w-[90%]">
          {fallbackTitle || alt || catConfig.label}
        </span>
        <span className="text-[9px] uppercase tracking-wider font-semibold opacity-70 mt-0.5" style={{ color: catConfig.color }}>
          {catConfig.pluralLabel}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${containerClassName}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-stone-200 dark:bg-stone-800 animate-pulse flex items-center justify-center">
          <CategoryIcon category={category} className="w-6 h-6 text-stone-400 animate-bounce" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        referrerPolicy="no-referrer"
        crossOrigin="anonymous"
        onLoad={() => setIsLoading(false)}
        onError={() => {
          setHasError(true);
          setIsLoading(false);
        }}
        className={`${className} ${isLoading ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        {...props}
      />
    </div>
  );
};
