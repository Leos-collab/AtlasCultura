import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { TimelineView } from './components/TimelineView';
import { VisualMapStats } from './components/VisualMapStats';
import { FriendsDiscoveryView } from './components/FriendsDiscoveryView';
import { WishlistView } from './components/WishlistView';
import { AddExperienceModal } from './components/AddExperienceModal';
import { ExperienceDetailModal } from './components/ExperienceDetailModal';
import { ProfileModal } from './components/ProfileModal';
import { AuthScreen } from './components/AuthScreen';
import { NewYearModal } from './components/NewYearModal';
import { WelcomeOnboardingModal } from './components/WelcomeOnboardingModal';
import { WelcomeBackSplash } from './components/WelcomeBackSplash';
import { 
  CulturalExperience, 
  FriendProfile, 
  FriendActivity, 
  ActiveTab,
  UserProfile,
  ExperienceCategory 
} from './types';
import { 
  INITIAL_EXPERIENCES, 
  INITIAL_FRIENDS, 
  INITIAL_FRIEND_ACTIVITIES, 
  INITIAL_WISHLIST 
} from './data/initialData';

const STORAGE_KEYS = {
  EXPERIENCES: 'atlas_cultural_experiences_v1',
  FRIEND_ACTIVITIES: 'atlas_cultural_activities_v1',
  WISHLIST: 'atlas_cultural_wishlist_v1',
  THEME: 'atlas_cultural_theme_v1',
  USER: 'atlas_cultural_user_v1'
};

export default function App() {
  // Theme state: light or dark (persisted)
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME);
      if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
      }
    } catch (e) {
      console.error('Failed to parse saved theme:', e);
    }
    return 'light';
  });

  // User / Authentication state: Login / Primeiro Acesso (persisted)
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const savedUser = localStorage.getItem(STORAGE_KEYS.USER);
      if (savedUser) {
        return JSON.parse(savedUser);
      }
    } catch (e) {
      console.error('Failed to parse saved user:', e);
    }
    return null;
  });

  // Primary experiences state initialized from localStorage if available
  const [experiences, setExperiences] = useState<CulturalExperience[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.EXPERIENCES);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved experiences:', e);
    }
    return INITIAL_EXPERIENCES;
  });

  const [friends] = useState<FriendProfile[]>(INITIAL_FRIENDS);

  const [activities, setActivities] = useState<FriendActivity[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FRIEND_ACTIVITIES);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved activities:', e);
    }
    return INITIAL_FRIEND_ACTIVITIES;
  });

  const [wishlist, setWishlist] = useState<CulturalExperience[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved wishlist:', e);
    }
    return INITIAL_WISHLIST;
  });

  // UI Navigation states
  const [activeTab, setActiveTab] = useState<ActiveTab>('timeline');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addModalInitialMode, setAddModalInitialMode] = useState<'experience' | 'wishlist'>('experience');
  const [editingExperience, setEditingExperience] = useState<CulturalExperience | null>(null);
  const [detailExperience, setDetailExperience] = useState<CulturalExperience | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isNewYearModalOpen, setIsNewYearModalOpen] = useState(false);
  const [activeCycleYear, setActiveCycleYear] = useState<number>(2026);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showWelcomeBack, setShowWelcomeBack] = useState(false);

  // Sync Theme to documentElement class
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, theme);
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (err) {
      console.error('Failed to sync theme:', err);
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  // Sync Current User & Handle New vs Returning User
  const handleLogin = (user: UserProfile, isNewRegistration?: boolean) => {
    setCurrentUser(user);
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    } catch (err) {
      console.error('Failed to save user profile:', err);
    }

    if (isNewRegistration) {
      // USER REQUEST: Quando criar nova conta, resetar dados do sistema, salvando apenas o administrador
      const isAdmin = user.email.toLowerCase() === 'leo.estivalet@gmail.com';
      if (!isAdmin) {
        setExperiences([]);
        setActivities([]);
        setWishlist([]);
        try {
          localStorage.removeItem(STORAGE_KEYS.EXPERIENCES);
          localStorage.removeItem(STORAGE_KEYS.FRIEND_ACTIVITIES);
          localStorage.removeItem(STORAGE_KEYS.WISHLIST);
        } catch (err) {
          console.error('Failed to reset storage:', err);
        }
      }
      setShowOnboarding(true);
    } else {
      setShowWelcomeBack(true);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.USER);
    } catch (err) {
      console.error('Failed to clear user profile:', err);
    }
  };

  const handleSaveUserProfile = (updated: Partial<UserProfile>) => {
    if (!currentUser) return;
    const newUser = { ...currentUser, ...updated };
    setCurrentUser(newUser);
    try {
      localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(newUser));
    } catch (err) {
      console.error('Failed to save user profile:', err);
    }
  };

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.EXPERIENCES, JSON.stringify(experiences));
    } catch (err) {
      console.error('Failed to save experiences:', err);
    }
  }, [experiences]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FRIEND_ACTIVITIES, JSON.stringify(activities));
    } catch (err) {
      console.error('Failed to save activities:', err);
    }
  }, [activities]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(wishlist));
    } catch (err) {
      console.error('Failed to save wishlist:', err);
    }
  }, [wishlist]);

  // Compute stats for navbar header
  const yearStats = useMemo(() => {
    const listActiveYear = experiences.filter(e => e.status === 'completed' && e.year === activeCycleYear);
    return {
      shows: listActiveYear.filter(e => e.category === 'show').length,
      museums: listActiveYear.filter(e => e.category === 'museu').length,
      books: listActiveYear.filter(e => e.category === 'livro').length,
      total: experiences.filter(e => e.status === 'completed').length
    };
  }, [experiences, activeCycleYear]);

  // Add / Edit handler
  const handleSaveExperience = (expData: Partial<CulturalExperience>) => {
    if (expData.id) {
      // Edit existing or move between lists
      if (expData.status === 'wishlist') {
        setWishlist(prev => {
          const exists = prev.some(w => w.id === expData.id);
          if (exists) return prev.map(w => (w.id === expData.id ? ({ ...w, ...expData } as CulturalExperience) : w));
          return [{ ...expData } as CulturalExperience, ...prev];
        });
        setExperiences(prev => prev.filter(e => e.id !== expData.id));
      } else {
        setExperiences(prev => {
          const exists = prev.some(e => e.id === expData.id);
          if (exists) return prev.map(e => (e.id === expData.id ? ({ ...e, ...expData } as CulturalExperience) : e));
          return [{ ...expData } as CulturalExperience, ...prev];
        });
        setWishlist(prev => prev.filter(w => w.id !== expData.id));
      }

      if (detailExperience && detailExperience.id === expData.id) {
        setDetailExperience({ ...detailExperience, ...expData } as CulturalExperience);
      }
    } else {
      // Create new
      const targetExpYear = expData.year || activeCycleYear || new Date().getFullYear();
      const newExp: CulturalExperience = {
        id: `exp-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
        title: expData.title || 'Nova Experiência',
        creatorOrArtist: expData.creatorOrArtist || '',
        category: expData.category || 'show',
        date: expData.date || `${targetExpYear}-01-15`,
        year: targetExpYear,
        month: expData.month ?? new Date().getMonth(),
        venue: expData.venue || '',
        city: expData.city || '',
        companions: expData.companions || ['Sozinho(a)'],
        rating: expData.rating || 5,
        vibeTag: expData.vibeTag || 'Inesquecível',
        notes: expData.notes || '',
        imageUrl: expData.imageUrl,
        imageAspectRatio: expData.imageAspectRatio || '16:9',
        imageFit: expData.imageFit || 'cover',
        imageFrameStyle: expData.imageFrameStyle || 'clean',
        imageZoom: expData.imageZoom || 1.0,
        ticketOrCost: expData.ticketOrCost || '$$',
        status: expData.status || 'completed',
        createdAt: Date.now(),
        favorite: false
      };

      if (newExp.status === 'wishlist') {
        setWishlist(prev => [newExp, ...prev]);
        setActiveTab('wishlist');
      } else {
        setExperiences(prev => [newExp, ...prev]);
        // Keep user on the relevant tab or timeline
        if (activeTab !== 'visual_map') {
          setActiveTab('timeline');
        }
      }
    }
    setEditingExperience(null);
  };

  // Delete handler
  const handleDeleteExperience = (id: string) => {
    setExperiences(prev => prev.filter(e => e.id !== id));
    setDetailExperience(null);
  };

  // Toggle favorite
  const handleToggleFavorite = (id: string) => {
    setExperiences(prev =>
      prev.map(item => (item.id === id ? { ...item, favorite: !item.favorite } : item))
    );
    if (detailExperience && detailExperience.id === id) {
      setDetailExperience(prev => (prev ? { ...prev, favorite: !prev.favorite } : null));
    }
  };

  // Like activity from friends
  const handleLikeActivity = (actId: string) => {
    setActivities(prev =>
      prev.map(act => {
        if (act.id === actId) {
          const liked = !act.likedByMe;
          return {
            ...act,
            likedByMe: liked,
            likesCount: liked ? act.likesCount + 1 : act.likesCount - 1
          };
        }
        return act;
      })
    );
  };

  // Add friend activity or AI recommendation to wishlist
  const handleAddToWishlist = (itemData: Partial<CulturalExperience>) => {
    const newItem: CulturalExperience = {
      id: `wish-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      title: itemData.title || 'Novo Desejo',
      creatorOrArtist: itemData.creatorOrArtist || '',
      category: itemData.category || 'show',
      date: itemData.date || new Date().toISOString().slice(0, 10),
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      venue: itemData.venue || '',
      companions: [],
      rating: 0,
      vibeTag: itemData.vibeTag || 'Desejo',
      notes: itemData.notes || '',
      imageUrl: itemData.imageUrl,
      imageAspectRatio: itemData.imageAspectRatio || '16:9',
      imageFit: itemData.imageFit || 'cover',
      imageFrameStyle: itemData.imageFrameStyle || 'clean',
      imageZoom: itemData.imageZoom || 1.0,
      status: 'wishlist',
      createdAt: Date.now()
    };
    setWishlist(prev => [newItem, ...prev]);
  };

  // Mark wishlist item as completed
  const handleMarkAsCompleted = (wishItem: CulturalExperience) => {
    setEditingExperience({
      ...wishItem,
      status: 'completed',
      date: new Date().toISOString().slice(0, 10),
      rating: 5
    });
    setIsAddModalOpen(true);
  };

  // Remove item from wishlist
  const handleRemoveWishlistItem = (id: string) => {
    setWishlist(prev => prev.filter(w => w.id !== id));
  };

  // Reset to default sample data
  const handleResetData = () => {
    if (confirm('Deseja restaurar as experiências e atividades culturais padrão do Atlas?')) {
      localStorage.removeItem(STORAGE_KEYS.EXPERIENCES);
      localStorage.removeItem(STORAGE_KEYS.FRIEND_ACTIVITIES);
      localStorage.removeItem(STORAGE_KEYS.WISHLIST);
      setExperiences(INITIAL_EXPERIENCES);
      setActivities(INITIAL_FRIEND_ACTIVITIES);
      setWishlist(INITIAL_WISHLIST);
    }
  };

  // Start New Year / Reset Cycle
  const handleConfirmNewYear = (targetYear: number, wipeAllExperiences: boolean) => {
    setActiveCycleYear(targetYear);
    if (wipeAllExperiences) {
      setExperiences([]);
      try {
        localStorage.setItem(STORAGE_KEYS.EXPERIENCES, JSON.stringify([]));
      } catch (e) {
        console.error('Failed to clear experiences:', e);
      }
    } else {
      // Ensure targetYear starts completely fresh and empty so user begins new cycle
      setExperiences(prev => {
        const cleaned = prev.filter(e => e.year !== targetYear);
        try {
          localStorage.setItem(STORAGE_KEYS.EXPERIENCES, JSON.stringify(cleaned));
        } catch (e) {
          console.error('Failed to save cleaned experiences:', e);
        }
        return cleaned;
      });
    }
    setActiveTab('visual_map');
  };

  // USER REQUEST: "Antes de abir esta interface faça uma outra de login/pimeiro acesso"
  if (!currentUser) {
    return (
      <AuthScreen
        onLogin={handleLogin}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 flex flex-col selection:bg-amber-200 selection:text-amber-900 ${
      theme === 'dark' ? 'bg-[#0f0e0d] text-stone-100' : 'bg-[#faf8f5] text-stone-900'
    }`}>
      {/* Top sticky Navbar with Sun / Moon Theme Toggle */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAddModal={() => {
          setEditingExperience(null);
          setAddModalInitialMode(activeTab === 'wishlist' ? 'wishlist' : 'experience');
          setIsAddModalOpen(true);
        }}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        totalExperiencesCount={yearStats.total}
        yearShowsCount={yearStats.shows}
        yearMuseumsCount={yearStats.museums}
        yearBooksCount={yearStats.books}
        theme={theme}
        onToggleTheme={toggleTheme}
        currentUser={currentUser}
        onLogout={handleLogout}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        activeCycleYear={activeCycleYear}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeTab === 'timeline' && (
          <TimelineView
            key={`timeline-${activeCycleYear}`}
            experiences={experiences}
            onSelectExperience={(exp) => setDetailExperience(exp)}
            onOpenAddModal={() => {
              setEditingExperience(null);
              setAddModalInitialMode('experience');
              setIsAddModalOpen(true);
            }}
            onToggleFavorite={handleToggleFavorite}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeCycleYear={activeCycleYear}
            onYearChange={(yr) => setActiveCycleYear(yr)}
            onOpenNewYearModal={() => setIsNewYearModalOpen(true)}
            onRestoreSampleData={handleResetData}
          />
        )}

        {activeTab === 'visual_map' && (
          <VisualMapStats
            key={`visual-map-${activeCycleYear}`}
            experiences={experiences}
            onSelectExperience={(exp) => setDetailExperience(exp)}
            onOpenAddModal={(category) => {
              const today = new Date();
              const mm = String(today.getMonth() + 1).padStart(2, '0');
              const dd = String(today.getDate()).padStart(2, '0');
              setEditingExperience(category ? {
                id: '',
                title: '',
                category,
                date: `${activeCycleYear}-${mm}-${dd}`,
                year: activeCycleYear,
                month: today.getMonth(),
                venue: '',
                companions: [],
                rating: 5,
                vibeTag: '',
                notes: '',
                status: 'completed',
                createdAt: Date.now()
              } as CulturalExperience : null);
              setAddModalInitialMode('experience');
              setIsAddModalOpen(true);
            }}
            onOpenNewYearModal={() => setIsNewYearModalOpen(true)}
            currentYear={activeCycleYear}
            onYearChange={(yr) => setActiveCycleYear(yr)}
            onRestoreSampleData={handleResetData}
          />
        )}

        {activeTab === 'friends_discovery' && (
          <FriendsDiscoveryView
            userLogs={experiences}
            onAddToWishlist={handleAddToWishlist}
          />
        )}

        {activeTab === 'wishlist' && (
          <WishlistView
            wishlist={wishlist}
            onMarkAsCompleted={handleMarkAsCompleted}
            onRemoveWishlistItem={handleRemoveWishlistItem}
            onOpenAddModal={() => {
              setEditingExperience(null);
              setAddModalInitialMode('wishlist');
              setIsAddModalOpen(true);
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-200 dark:border-stone-800 bg-stone-100/70 dark:bg-stone-950/70 py-8 px-4 sm:px-6 text-center text-xs text-stone-500 dark:text-stone-400">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-serif-title font-bold text-stone-800 dark:text-stone-200 text-sm">
              Atlas Cultural
            </span>
            <span>•</span>
            <span>A linha do tempo da sua vida cultural</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleResetData}
              className="text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-200 hover:underline cursor-pointer"
            >
              Restaurar Dados de Exemplo
            </button>
            <span>•</span>
            <span>{experiences.filter(e => e.status === 'completed').length} vivências arquivadas</span>
          </div>
        </div>
      </footer>

      {/* Add / Edit Modal with Image Upload & Shape adjustment */}
      <AddExperienceModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setEditingExperience(null);
        }}
        onSave={handleSaveExperience}
        initialData={editingExperience}
        initialMode={addModalInitialMode}
        theme={theme}
        currentYear={activeCycleYear}
      />

      {/* Detail Memory Modal */}
      <ExperienceDetailModal
        experience={detailExperience}
        onClose={() => setDetailExperience(null)}
        onEdit={(exp) => {
          setDetailExperience(null);
          setEditingExperience(exp);
          setIsAddModalOpen(true);
        }}
        onDelete={handleDeleteExperience}
        onToggleFavorite={handleToggleFavorite}
      />

      {/* Profile Modal */}
      {currentUser && (
        <ProfileModal
          isOpen={isProfileModalOpen}
          onClose={() => setIsProfileModalOpen(false)}
          currentUser={currentUser}
          onSaveUser={handleSaveUserProfile}
          onLogout={handleLogout}
          totalExperiencesCount={experiences.length}
        />
      )}

      {/* New Year / Novo Ano Modal */}
      <NewYearModal
        isOpen={isNewYearModalOpen}
        onClose={() => setIsNewYearModalOpen(false)}
        currentYear={activeCycleYear}
        onConfirmNewYear={handleConfirmNewYear}
        onRestoreSampleData={handleResetData}
      />

      {/* Onboarding Tutorial Modal for New Registrations */}
      <WelcomeOnboardingModal
        isOpen={showOnboarding}
        onClose={() => setShowOnboarding(false)}
        userName={currentUser?.name || 'Viajante Cultural'}
        theme={theme}
      />

      {/* Welcome Back Splash Screen for Returning Users */}
      <WelcomeBackSplash
        isOpen={showWelcomeBack}
        onClose={() => setShowWelcomeBack(false)}
        userName={currentUser?.name || 'Viajante Cultural'}
        theme={theme}
      />
    </div>
  );
}
