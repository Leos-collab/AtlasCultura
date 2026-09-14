import React, { useState, useRef } from 'react';
import { 
  X, 
  Camera, 
  Upload, 
  Check, 
  LogOut, 
  Sparkles, 
  Award, 
  MapPin, 
  Calendar, 
  User, 
  Mail, 
  FileText,
  Heart
} from 'lucide-react';
import { UserProfile } from '../types';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile;
  onSaveUser: (updated: Partial<UserProfile>) => void;
  onLogout: () => void;
  totalExperiencesCount: number;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80'
];

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onSaveUser,
  onLogout,
  totalExperiencesCount
}) => {
  const [name, setName] = useState(currentUser.name);
  const [email, setEmail] = useState(currentUser.email);
  const [avatar, setAvatar] = useState(currentUser.avatar);
  const [bio, setBio] = useState(currentUser.bio || '');
  const [favoriteCategory, setFavoriteCategory] = useState(currentUser.favoriteCategory || 'show');
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  if (!isOpen) return null;

  const handleAvatarFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setAvatar(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveUser({
      name: name.trim() || currentUser.name,
      email: email.trim() || currentUser.email,
      avatar,
      bio,
      favoriteCategory
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
      <div 
        id="user-profile-modal"
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[92vh] transition-colors"
      >
        {/* Modal Header */}
        <div className="p-6 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/80 dark:bg-stone-950/80">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-stone-900 dark:bg-amber-400 text-amber-400 dark:text-stone-950 flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif-title font-bold text-lg text-stone-900 dark:text-stone-100">
                Meu Perfil Cultural
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Personalize seu nome, foto e preferências culturais
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {savedSuccess && (
          <div className="px-6 py-2.5 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-200 dark:border-emerald-800 text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-1.5">
            <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>Perfil atualizado com sucesso!</span>
          </div>
        )}

        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Avatar Section: Profile Photo Change */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-2xl bg-amber-50/60 dark:bg-stone-950/60 border border-amber-200/70 dark:border-stone-800">
            {/* Avatar Preview */}
            <div className="relative group shrink-0">
              <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-stone-800 shadow-md ring-2 ring-amber-400">
                <img
                  src={avatar || currentUser.avatar}
                  alt={name}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Quick Camera Overlay */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 rounded-full bg-black/40 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                title="Trocar Foto de Perfil"
              >
                <Camera className="w-6 h-6" />
              </button>
            </div>

            <div className="text-center sm:text-left space-y-2 flex-1">
              <div>
                <h4 className="font-serif-title font-bold text-base text-stone-900 dark:text-stone-100">
                  Foto de Perfil
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  Suba uma foto do seu dispositivo ou escolha um avatar.
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleAvatarFileChange}
                  accept="image/*"
                  className="hidden"
                  id="profile-photo-upload"
                />
                <button
                  type="button"
                  id="btn-upload-profile-photo"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-stone-900 dark:bg-amber-400 text-amber-300 dark:text-stone-950 text-xs font-bold shadow-xs hover:bg-stone-800 dark:hover:bg-amber-300 transition-all cursor-pointer"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>Carregar Foto</span>
                </button>
              </div>

              {/* Quick presets */}
              <div className="pt-2">
                <span className="text-[10px] text-stone-400 block mb-1">Ou escolha um avatar:</span>
                <div className="flex items-center gap-1.5">
                  {PRESET_AVATARS.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setAvatar(preset)}
                      className={`w-7 h-7 rounded-full overflow-hidden border-2 transition-transform cursor-pointer ${
                        avatar === preset ? 'border-amber-500 scale-110' : 'border-transparent hover:scale-105'
                      }`}
                    >
                      <img src={preset} alt="Preset" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
              Seu Nome Completo *
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="input-profile-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: Leonardo Estivalet"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Email Field */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
              E-mail de Acesso
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                id="input-profile-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seu.email@exemplo.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>

          {/* Cultural Bio */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-700 dark:text-stone-300 mb-1.5">
              Bio / Olhar Cultural
            </label>
            <textarea
              id="textarea-profile-bio"
              rows={2}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Ex: Apaixonado por festivais de música independente, cinema autoral e boa gastronomia."
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
          </div>

          {/* User Cultural Stats Card */}
          <div className="p-4 rounded-2xl bg-stone-100/70 dark:bg-stone-950/60 border border-stone-200 dark:border-stone-800">
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-600 dark:text-stone-400 mb-2.5 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-amber-500" />
              <span>Suas Estatísticas no Atlas</span>
            </h4>

            <div className="grid grid-cols-2 gap-3 text-center">
              <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                <span className="text-[11px] text-stone-500 dark:text-stone-400 block">
                  Vivências Registradas
                </span>
                <strong className="font-serif-title text-xl text-stone-900 dark:text-stone-100 font-bold">
                  {totalExperiencesCount}
                </strong>
              </div>

              <div className="p-2.5 rounded-xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800">
                <span className="text-[11px] text-stone-500 dark:text-stone-400 block">
                  Ano de Início
                </span>
                <strong className="font-serif-title text-xl text-amber-600 dark:text-amber-400 font-bold">
                  2026
                </strong>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex items-center justify-between gap-3">
            <button
              type="button"
              id="btn-profile-logout"
              onClick={() => {
                onLogout();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl text-xs font-semibold transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sair da Conta</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-medium cursor-pointer"
              >
                Cancelar
              </button>

              <button
                type="submit"
                id="btn-save-profile-submit"
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-stone-900 dark:bg-amber-400 hover:bg-stone-800 dark:hover:bg-amber-300 text-amber-300 dark:text-stone-950 text-xs font-bold shadow-xs transition-all cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Salvar Perfil</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
