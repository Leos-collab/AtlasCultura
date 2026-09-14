import React, { useState } from 'react';
import { X, Search, Check, Users, RefreshCw, Sparkles, Plus, ExternalLink } from 'lucide-react';

export interface GoogleContact {
  id: string;
  name: string;
  email: string;
  avatar: string;
  culturalInterests?: string[];
  alreadyFriend?: boolean;
}

const DEFAULT_GOOGLE_CONTACTS: GoogleContact[] = [
  {
    id: 'gc-1',
    name: 'Leonardo Estivalet',
    email: 'leo.estivalet@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
    culturalInterests: ['Festivais', 'Cinema Cult', 'Teatro']
  },
  {
    id: 'gc-2',
    name: 'Mariana Silva',
    email: 'mariana.silva@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&auto=format&fit=crop&q=80',
    culturalInterests: ['Museus & Galerias', 'Artes Visuais', 'Jazz'],
    alreadyFriend: true
  },
  {
    id: 'gc-3',
    name: 'Lucas Prado',
    email: 'lucas.prado@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    culturalInterests: ['Cinema Europeu', 'Trilhas & Mirantes', 'Indie Rock'],
    alreadyFriend: true
  },
  {
    id: 'gc-4',
    name: 'Camila Drummond',
    email: 'camila.drummond@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    culturalInterests: ['Literatura Contemporânea', 'Poesia', 'Cafés Literários'],
    alreadyFriend: true
  },
  {
    id: 'gc-5',
    name: 'Rafael Mendes',
    email: 'rafael.mendes@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
    culturalInterests: ['Gastronomia Autoral', 'Bares de Vinho Natural', 'Shows Intimistas'],
    alreadyFriend: true
  },
  {
    id: 'gc-6',
    name: 'Beatriz Vasconcelos',
    email: 'bia.vasconcelos@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80',
    culturalInterests: ['Exposições Imersivas', 'Fotografia', 'Música Brasileira']
  },
  {
    id: 'gc-7',
    name: 'Thiago Alencar',
    email: 'thiago.alencar@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=400&auto=format&fit=crop&q=80',
    culturalInterests: ['Shows de Rock', 'Vinil', 'Teatro de Arena']
  },
  {
    id: 'gc-8',
    name: 'Juliana Paiva',
    email: 'ju.paiva@gmail.com',
    avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=400&auto=format&fit=crop&q=80',
    culturalInterests: ['Culinária Asiática', 'Documentários', 'Parques']
  }
];

interface GoogleContactsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectContacts?: (names: string[]) => void;
  onImportFriends?: (contacts: GoogleContact[]) => void;
  title?: string;
  description?: string;
  mode?: 'companion_select' | 'friend_sync';
}

export const GoogleContactsModal: React.FC<GoogleContactsModalProps> = ({
  isOpen,
  onClose,
  onSelectContacts,
  onImportFriends,
  title = 'Conectar com Contatos do Google',
  description = 'Importe ou selecione amigos diretamente da sua conta Google para viver experiências juntos.',
  mode = 'companion_select'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContactIds, setSelectedContactIds] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(true);
  const [isSyncing, setIsSyncing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredContacts = DEFAULT_GOOGLE_CONTACTS.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleSelect = (id: string) => {
    setSelectedContactIds(prev =>
      prev.includes(id) ? prev.filter(cId => cId !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedContactIds.length === filteredContacts.length) {
      setSelectedContactIds([]);
    } else {
      setSelectedContactIds(filteredContacts.map(c => c.id));
    }
  };

  const handleSyncNow = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSuccessMessage('Contatos sincronizados com sucesso da sua conta Google!');
      setTimeout(() => setSuccessMessage(null), 3000);
    }, 800);
  };

  const handleConfirm = () => {
    const chosen = DEFAULT_GOOGLE_CONTACTS.filter(c => selectedContactIds.includes(c.id));
    if (mode === 'companion_select' && onSelectContacts) {
      onSelectContacts(chosen.map(c => c.name));
    } else if (onImportFriends) {
      onImportFriends(chosen);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-xs animate-fadeIn">
      <div 
        id="google-contacts-modal"
        className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-lg w-full overflow-hidden shadow-2xl flex flex-col max-h-[90vh] transition-colors"
      >
        {/* Header with Google brand accent */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-start justify-between gap-3 bg-stone-50/70 dark:bg-stone-950/70">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 flex items-center justify-center shadow-xs shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17Z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24Z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15Z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98Z"
                />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-title font-bold text-base sm:text-lg text-stone-900 dark:text-stone-100">
                  {title}
                </h3>
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold border border-emerald-200 dark:border-emerald-800">
                  Conectado
                </span>
              </div>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                {description}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-xl hover:bg-stone-200 dark:hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Feedback banner */}
        {successMessage && (
          <div className="px-5 py-2 bg-emerald-50 dark:bg-emerald-950/40 border-b border-emerald-200 dark:border-emerald-800 text-xs font-semibold text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
            <span>{successMessage}</span>
          </div>
        )}

        {/* Search & Actions toolbar */}
        <div className="p-4 border-b border-stone-200 dark:border-stone-800 space-y-3 bg-white dark:bg-stone-900">
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar por nome ou e-mail..."
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>
            <button
              type="button"
              onClick={handleSyncNow}
              disabled={isSyncing}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 hover:bg-stone-100 dark:hover:bg-stone-800 text-xs font-medium cursor-pointer transition-colors shrink-0"
              title="Sincronizar novos contatos do Google"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin text-amber-500' : ''}`} />
              <span className="hidden sm:inline">Sincronizar</span>
            </button>
          </div>

          <div className="flex items-center justify-between text-xs text-stone-500 dark:text-stone-400">
            <span>
              {selectedContactIds.length} selecionado(s) de {filteredContacts.length} contatos
            </span>
            <button
              type="button"
              onClick={handleSelectAll}
              className="text-amber-600 dark:text-amber-400 hover:underline font-semibold cursor-pointer"
            >
              {selectedContactIds.length === filteredContacts.length ? 'Desmarcar todos' : 'Selecionar todos'}
            </button>
          </div>
        </div>

        {/* Contacts List */}
        <div className="flex-1 overflow-y-auto divide-y divide-stone-100 dark:divide-stone-800 p-2">
          {filteredContacts.map((contact) => {
            const isSelected = selectedContactIds.includes(contact.id);
            return (
              <div
                key={contact.id}
                onClick={() => toggleSelect(contact.id)}
                className={`p-3 rounded-xl flex items-center justify-between gap-3 cursor-pointer transition-colors ${
                  isSelected
                    ? 'bg-amber-50 dark:bg-amber-950/30'
                    : 'hover:bg-stone-50 dark:hover:bg-stone-800/50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative">
                    <img
                      src={contact.avatar}
                      alt={contact.name}
                      className="w-10 h-10 rounded-full object-cover border border-stone-200 dark:border-stone-700"
                    />
                    {isSelected && (
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-amber-500 text-stone-950 flex items-center justify-center text-[10px] font-bold">
                        ✓
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-serif-title font-bold text-sm text-stone-900 dark:text-stone-100 truncate">
                        {contact.name}
                      </h4>
                      {contact.alreadyFriend && (
                        <span className="px-1.5 py-0.2 rounded bg-stone-100 dark:bg-stone-800 text-[10px] text-stone-600 dark:text-stone-400 font-medium">
                          No círculo
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 dark:text-stone-400 truncate">
                      {contact.email}
                    </p>
                    {contact.culturalInterests && (
                      <div className="flex flex-wrap gap-1 mt-1">
                        {contact.culturalInterests.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100/60 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300 font-medium"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {}}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500 border-stone-300 dark:border-stone-700 cursor-pointer"
                />
              </div>
            );
          })}
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-200 dark:border-stone-800 bg-stone-50/70 dark:bg-stone-950/70 flex items-center justify-between gap-3">
          <span className="text-[11px] text-stone-500 dark:text-stone-400 hidden sm:inline">
            Vinculado via Google Contacts API
          </span>

          <div className="flex items-center gap-2 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-800 text-xs font-medium cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="button"
              id="btn-confirm-google-contacts"
              onClick={handleConfirm}
              disabled={selectedContactIds.length === 0}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-stone-900 dark:bg-amber-400 hover:bg-stone-800 dark:hover:bg-amber-300 text-amber-300 dark:text-stone-950 text-xs font-bold shadow-xs transition-all cursor-pointer disabled:opacity-50"
            >
              <Check className="w-4 h-4" />
              <span>
                {mode === 'companion_select'
                  ? `Adicionar ${selectedContactIds.length || ''} como Companhia(s)`
                  : `Sincronizar ${selectedContactIds.length || ''} ao Círculo`}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
