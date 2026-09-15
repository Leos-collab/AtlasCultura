import React, { useState } from 'react';
import {
  Compass,
  Sparkles,
  ArrowRight,
  User,
  Mail,
  Lock,
  Check,
  Sun,
  Moon,
  Music,
  BookOpen,
  Film,
  Landmark,
  Flame,
  ShieldCheck
} from 'lucide-react';
import { UserProfile, ExperienceCategory } from '../types';
import { CATEGORIES_CONFIG } from '../data/categories';
import { CategoryIcon } from './CategoryIcon';

interface AuthScreenProps {
  onLogin: (user: UserProfile, isNewRegistration?: boolean) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

const AUTH_FEATURED_CATEGORIES: ExperienceCategory[] = ['show', 'filme', 'livro', 'museu', 'peça', 'viagem'];

// Cultural creation cards with rich visuals and atmospheric gifs/images
const CULTURAL_VIBES = [
  {
    title: 'Shows & Festivais',
    subtitle: 'A vibração inesquecível do palco',
    image: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop&q=80',
    tag: 'Música & Energia',
    icon: Music
  },
  {
    title: 'Cinema & Cineclubes',
    subtitle: 'O fascínio da tela grande e narrativas',
    image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&auto=format&fit=crop&q=80',
    tag: 'Sétima Arte',
    icon: Film
  },
  {
    title: 'Museus & Galerias',
    subtitle: 'Esculturas, pinturas e arte contemporânea',
    image: 'https://images.unsplash.com/photo-1565008447742-97f6f38c985c?w=800&auto=format&fit=crop&q=80',
    tag: 'Artes Visuais',
    icon: Landmark
  },
  {
    title: 'Teatro & Literatura',
    subtitle: 'Palcos históricos e páginas que transformam',
    image: 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=800&auto=format&fit=crop&q=80',
    tag: 'Cultura & Letras',
    icon: BookOpen
  }
];

export const AuthScreen: React.FC<AuthScreenProps> = ({
  onLogin,
  theme,
  onToggleTheme
}) => {
  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<ExperienceCategory[]>([
    'show',
    'museu',
    'livro',
    'filme'
  ]);
  const [bio, setBio] = useState('Apaixonado por música ao vivo, cinema autoral e boas leituras.');
  const [activeVibeIndex, setActiveVibeIndex] = useState(0);
  const glowRef = React.useRef<HTMLDivElement>(null);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (glowRef.current) {
      // 200px offset to center the 400x400 glow on the cursor
      glowRef.current.style.transform = `translate(${e.clientX - 200}px, ${e.clientY - 200}px)`;
    }
  };

  // Auto rotate cultural vibes
  React.useEffect(() => {
    const timer = setInterval(() => {
      setActiveVibeIndex(prev => (prev + 1) % CULTURAL_VIBES.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const toggleInterest = (cat: ExperienceCategory) => {
    setSelectedInterests(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    const finalName = name.trim() || email.split('@')[0] || 'Viajante Cultural';
    const isNew = authMode === 'register';
    const user: UserProfile = {
      id: `user-${Date.now()}`,
      name: finalName,
      email: email.trim(),
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80`,
      bio: bio.trim(),
      favoriteCategories: selectedInterests,
      createdAt: Date.now()
    };
    onLogin(user, isNew);
  };

  // Quick Login as Administrator Leonardo Estivalet
  const handleAdminLogin = () => {
    const adminUser: UserProfile = {
      id: 'user-admin-leonardo',
      name: 'Leonardo Estivalet',
      email: 'leo.estivalet@gmail.com',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
      bio: 'Criador e Administrador do Atlas Cultural.',
      favoriteCategories: ['show', 'museu', 'livro', 'filme'],
      createdAt: 1700000000000
    };
    onLogin(adminUser, false);
  };

  const handleQuickLogin = (userName: string, userEmail: string) => {
    const user: UserProfile = {
      id: `user-${Date.now()}`,
      name: userName,
      email: userEmail,
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80`,
      bio: 'Apaixonado por música ao vivo, cinema autoral e boas leituras.',
      favoriteCategories: ['show', 'museu', 'livro', 'filme'],
      createdAt: Date.now()
    };
    onLogin(user, false);
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className={`min-h-screen flex flex-col justify-between transition-colors duration-500 relative overflow-hidden animate-gradient ${theme === 'dark'
          ? 'bg-gradient-to-br from-[#0f0e0d] via-[#1a1714] to-[#14121a] text-stone-100'
          : 'bg-gradient-to-br from-[#faf8f5] via-[#fff5e6] to-[#f0f4ff] text-stone-900'
        }`}
    >

      {/* Interactive Mouse Glow Trail */}
      <div
        ref={glowRef}
        className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full bg-amber-500/20 dark:bg-amber-400/15 blur-[120px] pointer-events-none mix-blend-multiply dark:mix-blend-screen"
        style={{ transform: 'translate(-999px, -999px)' }} // start offscreen
      />

      {/* Subtle ambient corner glow to enhance gradient */}
      <div className="absolute -bottom-40 -right-20 w-[600px] h-[600px] rounded-full bg-sky-500/10 dark:bg-indigo-500/5 blur-[130px] pointer-events-none mix-blend-multiply dark:mix-blend-screen" />
      <div className="absolute top-0 left-1/2 w-[500px] h-[500px] rounded-full bg-rose-500/5 dark:bg-rose-500/5 blur-[130px] pointer-events-none mix-blend-multiply dark:mix-blend-screen" />

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col min-h-screen w-full">
        {/* Top micro bar with theme toggle */}
        <header className="w-full max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5 select-none">
            <div className="w-9 h-9 rounded-xl bg-stone-900 text-amber-400 flex items-center justify-center shadow-sm">
              <Compass className="w-5 h-5" />
            </div>
            <span className="font-serif-title font-bold text-xl tracking-tight">
              Atlas Cultural
            </span>
          </div>

          {/* Theme Toggle Button */}
          <button
            type="button"
            id="auth-theme-toggle-btn"
            onClick={onToggleTheme}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${theme === 'dark'
              ? 'bg-stone-900 border-stone-800 text-amber-300 hover:bg-stone-800'
              : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100'
              }`}
            title={theme === 'light' ? 'Modo Claro ativo (clique para escuro)' : 'Modo Escuro ativo (clique para claro)'}
          >
            {theme === 'light' ? (
              <>
                <Sun className="w-4 h-4 text-amber-500" />
                <span>Modo Claro</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-sky-300" />
                <span>Modo Escuro</span>
              </>
            )}
          </button>
        </header>

        {/* Main Container */}
        <main className="flex-1 flex items-center justify-center px-4 py-8 sm:py-12">
          <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            {/* Left Visual Column: Cultural Themes, Images & Animated Energy */}
            <div className="lg:col-span-6 space-y-5 hidden lg:block">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider border border-amber-400/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Onde a Arte se Torna Memória</span>
                </div>
                <h2 className="font-serif-title text-3xl xl:text-4xl font-bold tracking-tight text-stone-900 dark:text-stone-100">
                  Seu mapa vivo de shows, livros, cinemas e exposições.
                </h2>
                <p className="text-sm text-stone-600 dark:text-stone-400 leading-relaxed">
                  Guarde cada ingresso, sinta a nostalgia daquele concerto lendário e organize seus ciclos culturais ano após ano.
                </p>
              </div>

              {/* Featured Cultural Card with Active Image and Category Tabs */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-stone-200 dark:border-stone-800 bg-stone-900 group">
                <div className="h-64 sm:h-72 w-full relative overflow-hidden">
                  <img
                    src={CULTURAL_VIBES[activeVibeIndex].image}
                    alt={CULTURAL_VIBES[activeVibeIndex].title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                  {/* Floating cultural badge */}
                  <div className="absolute top-4 left-4 flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-900/85 backdrop-blur-md text-amber-300 border border-amber-400/30 text-xs font-bold shadow-lg">
                      {React.createElement(CULTURAL_VIBES[activeVibeIndex].icon, { className: 'w-3.5 h-3.5' })}
                      <span>{CULTURAL_VIBES[activeVibeIndex].tag}</span>
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-stone-950 text-[10px] font-extrabold uppercase tracking-wider animate-pulse">
                      Cultura
                    </span>
                  </div>

                  {/* Bottom caption on image */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-serif-title text-xl font-bold mb-1 drop-shadow-md">
                      {CULTURAL_VIBES[activeVibeIndex].title}
                    </h3>
                    <p className="text-xs text-stone-300 drop-shadow-sm">
                      {CULTURAL_VIBES[activeVibeIndex].subtitle}
                    </p>
                  </div>
                </div>

                {/* Quick Cultural Switcher Selector */}
                <div className="grid grid-cols-4 p-2 bg-stone-950/80 backdrop-blur-md border-t border-stone-800 text-[11px] font-semibold text-center">
                  {CULTURAL_VIBES.map((vibe, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setActiveVibeIndex(idx)}
                      className={`py-1.5 px-2 rounded-xl transition-all cursor-pointer truncate ${activeVibeIndex === idx
                        ? 'bg-amber-400 text-stone-950 font-bold shadow-xs'
                        : 'text-stone-400 hover:text-stone-200'
                        }`}
                    >
                      {vibe.title.split(' ')[0]}
                    </button>
                  ))}
                </div>
              </div>

              {/* Cultural highlights quote */}
              <div className="p-4 rounded-2xl border border-amber-500/20 bg-amber-500/5 text-xs text-stone-600 dark:text-stone-400 flex items-center gap-3">
                <Compass className="w-5 h-5 text-amber-500 shrink-0" />
                <span>
                  Reúna em um só lugar suas impressões, fotos com zoom personalizado, companhias e retrospectivas anuais.
                </span>
              </div>
            </div>

            {/* Right Form Column: Passport Creation / Login */}
            <div className="lg:col-span-6 w-full max-w-lg mx-auto">
              {/* Card Container */}
              <div className={`rounded-3xl border shadow-2xl p-6 sm:p-8 transition-colors ${theme === 'dark'
                ? 'bg-stone-900/95 border-stone-800'
                : 'bg-white/95 border-stone-200/80 backdrop-blur-md'
                }`}>
                {/* Header / Intro */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-400/20 text-amber-700 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-3 border border-amber-400/30">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Linha do Tempo da Vida Cultural</span>
                  </div>
                  <h1 className="font-serif-title text-2xl sm:text-3xl font-bold tracking-tight mb-2">
                    {authMode === 'register' ? 'Criar Passaporte Cultural' : 'Bem-vindo de Volta'}
                  </h1>
                  <p className={`text-xs sm:text-sm ${theme === 'dark' ? 'text-stone-400' : 'text-stone-600'}`}>
                    {authMode === 'register'
                      ? 'Comece a registrar seus shows, livros, filmes e museus num mapa visual único.'
                      : 'Acesse suas memórias culturais e as descobertas dos seus lugares favoritos.'}
                  </p>
                </div>

                {/* Administrator Master Access Pill */}

                {/* Mode Switcher: Primeiro Acesso vs Entrar */}
                <div className={`flex items-center p-1 rounded-2xl mb-6 ${theme === 'dark' ? 'bg-stone-950' : 'bg-stone-100'
                  }`}>
                  <button
                    type="button"
                    id="tab-primeiro-acesso"
                    onClick={() => {
                      setAuthMode('register');
                      setName('');
                      setEmail('');
                      setPassword('');
                    }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${authMode === 'register'
                      ? theme === 'dark'
                        ? 'bg-stone-800 text-amber-300 shadow-xs'
                        : 'bg-white text-stone-900 shadow-xs'
                      : theme === 'dark' ? 'text-stone-400 hover:text-stone-200' : 'text-stone-600 hover:text-stone-900'
                      }`}
                  >
                    Primeiro Acesso
                  </button>
                  <button
                    type="button"
                    id="tab-entrar"
                    onClick={() => {
                      setAuthMode('login');
                      //setName('Leonardo Estivalet');
                      //setEmail('leo.estivalet@gmail.com');
                      //setPassword('Leo1406');
                    }}
                    className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer text-center ${authMode === 'login'
                      ? theme === 'dark'
                        ? 'bg-stone-800 text-amber-300 shadow-xs'
                        : 'bg-white text-stone-900 shadow-xs'
                      : theme === 'dark' ? 'text-stone-400 hover:text-stone-200' : 'text-stone-600 hover:text-stone-900'
                      }`}
                  >
                    Já Tenho Conta
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-4">
                  {authMode === 'register' && (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-80">
                        Seu Nome / Como quer ser chamado
                      </label>
                      <div className="relative">
                        <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                        <input
                          id="input-auth-name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Ex: João da Silva"
                          className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${theme === 'dark'
                            ? 'bg-stone-950 border-stone-800 text-white focus:border-amber-400'
                            : 'bg-white border-stone-300 text-stone-900 focus:border-stone-900'
                            }`}
                        />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-80">
                      E-mail
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        id="input-auth-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Ex: João@gmail.com"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${theme === 'dark'
                          ? 'bg-stone-950 border-stone-800 text-white focus:border-amber-400'
                          : 'bg-white border-stone-300 text-stone-900 focus:border-stone-900'
                          }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider mb-1.5 opacity-80">
                      Senha
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                      <input
                        id="input-auth-password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Digite sua senha"
                        className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm focus:outline-none transition-all ${theme === 'dark'
                          ? 'bg-stone-950 border-stone-800 text-white focus:border-amber-400'
                          : 'bg-white border-stone-300 text-stone-900 focus:border-stone-900'
                          }`}
                      />
                    </div>
                  </div>

                  {/* Cultural Interests Selection (on Primeiro Acesso) */}
                  {authMode === 'register' && (
                    <div>
                      <label className="block text-xs font-bold uppercase tracking-wider mb-2 opacity-80">
                        O que mais atrai você? (Selecione seus interesses)
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        {AUTH_FEATURED_CATEGORIES.map((catKey) => {
                          const isSelected = selectedInterests.includes(catKey);
                          const config = CATEGORIES_CONFIG[catKey];
                          return (
                            <button
                              key={catKey}
                              type="button"
                              onClick={() => toggleInterest(catKey)}
                              className={`flex items-center gap-2 p-2 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${isSelected
                                ? theme === 'dark'
                                  ? 'bg-amber-400/20 border-amber-400 text-amber-300'
                                  : 'bg-stone-900 text-amber-300 border-stone-900'
                                : theme === 'dark'
                                  ? 'bg-stone-950 border-stone-800 text-stone-400 hover:text-stone-200'
                                  : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                                }`}
                            >
                              <CategoryIcon category={catKey} className="w-3.5 h-3.5 shrink-0" />
                              <span className="truncate">{config.pluralLabel}</span>
                              {isSelected && <Check className="w-3 h-3 ml-auto text-amber-400 shrink-0" />}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Submit Button */}
                  <button
                    type="submit"
                    id="btn-submit-auth"
                    className="w-full py-3 rounded-2xl bg-stone-900 dark:bg-amber-400 hover:bg-stone-800 dark:hover:bg-amber-300 text-amber-300 dark:text-stone-950 text-sm font-bold shadow-md transition-all cursor-pointer flex items-center justify-center gap-2 mt-2"
                  >
                    <span>{authMode === 'register' ? 'Criar Passaporte e Entrar' : 'Acessar Atlas Cultural'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>


                </form>
              </div>
            </div>
          </div>
        </main>

        {/* Footer copyright */}
        <footer className="w-full max-w-7xl mx-auto px-6 py-4 text-center text-xs opacity-60">
          Atlas Cultural • Linha do tempo de memórias, shows, livros, arte e descobertas
        </footer>
      </div>
    </div>
  );
};
