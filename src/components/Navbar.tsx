import React from 'react';
import { 
  Sparkles, 
  Calendar, 
  Compass, 
  Users, 
  Bookmark, 
  Plus, 
  Search, 
  BookOpen, 
  Music, 
  Film, 
  Flame, 
  Sun, 
  Moon, 
  LogOut, 
  User,
  Crown
} from 'lucide-react';
import { ActiveTab, UserProfile } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenAddModal: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  totalExperiencesCount: number;
  yearShowsCount: number;
  yearMuseumsCount: number;
  yearBooksCount: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  currentUser: UserProfile | null;
  onLogout: () => void;
  onOpenProfileModal: () => void;
  activeCycleYear?: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenAddModal,
  searchQuery,
  setSearchQuery,
  totalExperiencesCount,
  yearShowsCount,
  yearMuseumsCount,
  yearBooksCount,
  theme,
  onToggleTheme,
  currentUser,
  onLogout,
  onOpenProfileModal,
  activeCycleYear = 2026
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#e8e4f2]/95 dark:bg-[#0f0e0d]/95 backdrop-blur-md border-b border-stone-200 dark:border-stone-800 transition-colors">
      {/* Top micro banner with cultural pulse */}
      <div className="bg-stone-900 dark:bg-stone-950 text-stone-200 text-xs px-4 py-1.5 flex items-center justify-between font-medium border-b border-stone-800">
        <div className="flex items-center gap-2 max-w-7xl mx-auto w-full">
          <div className="flex items-center gap-1.5 text-amber-400">
            <Flame className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <span className="font-semibold tracking-wide uppercase text-[11px]">Seu Ano Cultural:</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-stone-300">
            <span className="flex items-center gap-1 hover:text-white transition-colors">
              <Music className="w-3 h-3 text-violet-400" /> <strong className="text-white">{yearShowsCount}</strong> shows
            </span>
            <span className="text-stone-600">•</span>
            <span className="flex items-center gap-1 hover:text-white transition-colors">
              <Compass className="w-3 h-3 text-teal-400" /> <strong className="text-white">{yearMuseumsCount}</strong> exposições
            </span>
            <span className="text-stone-600">•</span>
            <span className="flex items-center gap-1 hover:text-white transition-colors">
              <BookOpen className="w-3 h-3 text-amber-400" /> <strong className="text-white">{yearBooksCount}</strong> livros
            </span>
            <span className="text-stone-600">•</span>
            <span className="text-stone-400">Total de <strong className="text-white">{totalExperiencesCount}</strong> memórias</span>
          </div>
          <div className="sm:hidden text-stone-300 truncate">
            {totalExperiencesCount} memórias culturais
          </div>

          <div className="ml-auto flex items-center gap-4">
            <button 
              id="nav-quick-retrospective-btn"
              onClick={() => setActiveTab('visual_map')}
              className="text-amber-300 hover:text-amber-200 hover:underline flex items-center gap-1 text-[11px] cursor-pointer"
            >
              <span>Ver Retrospectiva</span>
              <Sparkles className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Header navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-3 sm:gap-4">
          {/* Brand Identity */}
          <div 
            onClick={() => setActiveTab('timeline')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer select-none group shrink-0"
            id="app-brand-logo"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-stone-900 dark:bg-amber-400 text-amber-400 dark:text-stone-950 flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform duration-200">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif-title font-bold text-lg sm:text-2xl text-stone-900 dark:text-stone-100 tracking-tight">
                  Atlas Cultural
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                  {activeCycleYear}
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 hidden md:block">
                Sua vida cultural em linha do tempo & descobertas
              </p>
            </div>
          </div>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button (USER REQUEST: quando claro = icone de sol, quando escuro = icone de lua) */}
            <button
              type="button"
              id="theme-toggle-button"
              onClick={onToggleTheme}
              aria-label={theme === 'light' ? 'Modo claro ativado (clique para alternar para modo escuro)' : 'Modo escuro ativado (clique para alternar para modo claro)'}
              className={`p-2.5 sm:px-3 sm:py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs ${
                theme === 'light'
                  ? 'bg-white hover:bg-stone-100 text-stone-800 border-stone-200'
                  : 'bg-stone-900 hover:bg-stone-800 text-amber-300 border-stone-800'
              }`}
              title={theme === 'light' ? 'Modo Claro ativo (clique para modo escuro)' : 'Modo Escuro ativo (clique para modo claro)'}
            >
              {theme === 'light' ? (
                <>
                  <Sun className="w-4 h-4 text-amber-500" />
                  <span className="hidden lg:inline text-stone-700">Claro</span>
                </>
              ) : (
                <>
                  <Moon className="w-4 h-4 text-sky-300" />
                  <span className="hidden lg:inline text-amber-300">Escuro</span>
                </>
              )}
            </button>

            {/* Action button: Log experience */}
            <button
              id="btn-open-add-experience"
              onClick={onOpenAddModal}
              className="inline-flex items-center gap-2 bg-stone-900 dark:bg-amber-400 hover:bg-stone-800 dark:hover:bg-amber-300 active:scale-98 text-white dark:text-stone-950 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-sm transition-all hover:shadow-md cursor-pointer"
            >
              <Plus className="w-4 h-4 text-amber-400 dark:text-stone-950" />
              <span className="hidden sm:inline">Registrar Experiência</span>
              <span className="sm:hidden">Registrar</span>
            </button>

            {/* User Profile & Logout */}
            {currentUser && (
              <div className="flex items-center pl-1 sm:pl-2 border-l border-stone-200 dark:border-stone-800 gap-2">
                {!currentUser.isPremium && (
                  <button
                    onClick={() => setActiveTab('subscription')}
                    className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs font-bold hover:bg-amber-200 dark:hover:bg-amber-800/60 transition-colors shadow-xs"
                    title="Fazer upgrade para Premium"
                  >
                    <Crown className="w-3.5 h-3.5" />
                    <span>Free</span>
                  </button>
                )}
                {currentUser.isPremium && (
                  <div 
                    className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-stone-900 dark:bg-stone-800 text-amber-400 text-xs font-bold shadow-xs cursor-default"
                    title="Usuário Premium"
                  >
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>PRO</span>
                  </div>
                )}
                <button
                  type="button"
                  id="btn-user-profile"
                  onClick={onOpenProfileModal}
                  className="w-8 h-8 rounded-full overflow-hidden border-2 border-amber-400 hover:border-amber-300 ring-2 ring-transparent hover:ring-amber-400/50 transition-all bg-amber-100 shrink-0 cursor-pointer shadow-xs"
                  title={`Meu Perfil: ${currentUser.name} (clique para ver e editar perfil)`}
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-full h-full object-cover"
                  />
                </button>
                <button
                  type="button"
                  id="btn-logout-user"
                  onClick={onLogout}
                  className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                  title="Sair / Trocar de conta"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Tabs Bar - Centered */}
        <div className="flex items-center justify-center border-t border-stone-200 dark:border-stone-800 overflow-x-auto no-scrollbar py-2 -mx-4 px-4 sm:mx-0 sm:px-0">
          <nav className="flex items-center justify-center space-x-1 sm:space-x-2 mx-auto">
            <button
              id="nav-tab-timeline"
              onClick={() => setActiveTab('timeline')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'timeline'
                  ? 'bg-stone-900 dark:bg-stone-800 text-amber-400 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800/50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              <span>Linha do Tempo</span>
            </button>

            <button
              id="nav-tab-visual-map"
              onClick={() => setActiveTab('visual_map')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'visual_map'
                  ? 'bg-stone-900 dark:bg-stone-800 text-amber-400 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800/50'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Mapa Visual & Retrospectiva</span>
            </button>

            <button
              id="nav-tab-friends-discovery"
              onClick={() => setActiveTab('friends_discovery')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'friends_discovery'
                  ? 'bg-stone-900 dark:bg-stone-800 text-amber-400 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800/50'
              }`}
            >
              <Compass className="w-4 h-4" />
              <span>Descoberta de Lugares</span>
            </button>

            <button
              id="nav-tab-wishlist"
              onClick={() => setActiveTab('wishlist')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'wishlist'
                  ? 'bg-stone-900 dark:bg-stone-800 text-amber-400 shadow-xs'
                  : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800/50'
              }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Quero Viver / Desejos</span>
            </button>

            <button
              id="nav-tab-subscription"
              onClick={() => setActiveTab('subscription')}
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium whitespace-nowrap transition-all cursor-pointer ${
                activeTab === 'subscription'
                  ? 'bg-amber-500 text-stone-950 shadow-xs'
                  : 'text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-900/30'
              }`}
            >
              <Crown className="w-4 h-4" />
              <span>Planos Premium</span>
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
};
