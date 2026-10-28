import React, { useState } from 'react';
import { useAuth } from './AuthContext.tsx';
import { useTheme } from './ThemeContext.tsx';
import { AVATAR_OPTIONS, getLevelData } from './formatters.ts';
import {
  X,
  User,
  ShieldAlert,
  Loader2,
  Check,
  Palette,
  Sun,
  Moon,
  Trash2,
  Lock,
} from 'lucide-react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { user, updateProfile, deleteAccount } = useAuth();
  const { theme, setTheme } = useTheme();

  const [displayName, setDisplayName] = useState(user?.displayName || '');
  const [selectedAvatar, setSelectedAvatar] = useState(user?.avatar || 'gamer');
  const [selectedAccent, setSelectedAccent] = useState<'emerald' | 'cyan' | 'amber' | 'violet'>(
    user?.accentColor || 'emerald'
  );
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!isOpen || !user) return null;

  const levelData = getLevelData(user.xp);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);

    try {
      const ok = await updateProfile({
        displayName: displayName.trim(),
        avatar: selectedAvatar,
        accentColor: selectedAccent,
        theme,
      });
      if (ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      await deleteAccount();
      onClose();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 relative shadow-2xl space-y-5 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-2xl">
            {AVATAR_OPTIONS.find((a) => a.id === selectedAvatar)?.emoji || '🎮'}
          </div>
          <div>
            <h3 className="font-display font-black text-xl text-white">Perfil & Customização</h3>
            <p className="text-xs text-neutral-400">
              Usuário: <span className="font-mono text-emerald-400">@{user.username}</span> · Nível {levelData.level}
            </p>
          </div>
        </div>

        <form onSubmit={handleSave} className="space-y-4">
          {/* Display Name */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Nome de Exibição
            </label>
            <input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Como quer ser chamado"
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Avatar Selection */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-2">
              Escolha seu Avatar no Jogo
            </label>
            <div className="grid grid-cols-6 gap-2">
              {AVATAR_OPTIONS.map((av) => (
                <button
                  key={av.id}
                  type="button"
                  onClick={() => setSelectedAvatar(av.id)}
                  className={`p-2 rounded-xl text-xl flex items-center justify-center border transition-all ${
                    selectedAvatar === av.id
                      ? 'bg-emerald-500/20 border-emerald-400 scale-105'
                      : 'bg-neutral-950 border-neutral-800 hover:border-neutral-700'
                  }`}
                >
                  {av.emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Theme preference */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">Tema</label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTheme('dark')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                  theme === 'dark'
                    ? 'bg-neutral-800 text-white border-emerald-400'
                    : 'bg-neutral-950 text-neutral-400 border-neutral-800'
                }`}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>Modo Escuro (Padrão)</span>
              </button>
              <button
                type="button"
                onClick={() => setTheme('light')}
                className={`py-2 px-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition-colors ${
                  theme === 'light'
                    ? 'bg-neutral-800 text-white border-emerald-400'
                    : 'bg-neutral-950 text-neutral-400 border-neutral-800'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Modo Claro</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSaving}
            className="w-full py-2.5 bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold text-xs rounded-xl transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : saveSuccess ? (
              <>
                <Check className="w-4 h-4" />
                <span>Salvo com Sucesso!</span>
              </>
            ) : (
              <span>Salvar Preferências</span>
            )}
          </button>
        </form>

        {/* Privacy & LGPD / Delete Account */}
        <div className="pt-4 border-t border-neutral-800 space-y-3">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span>Privacidade & LGPD</span>
            <span className="text-[11px] text-emerald-400 font-mono">Dados 100% Seus</span>
          </div>

          {!showDeleteConfirm ? (
            <button
              type="button"
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full py-2 text-xs font-medium text-rose-400/80 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors flex items-center justify-center gap-1.5 border border-dashed border-rose-500/20"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Excluir Minha Conta e Todos os Dados</span>
            </button>
          ) : (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 space-y-2">
              <div className="text-xs text-rose-400 font-semibold flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 shrink-0" />
                <span>Atenção: Ação Irreversível!</span>
              </div>
              <p className="text-[11px] text-neutral-300">
                Conforme a LGPD, todas as suas movimentações, metas, XP e registros serão apagados permanentemente do servidor.
              </p>
              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 py-1.5 rounded-lg bg-neutral-800 text-neutral-300 text-xs font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={handleDeleteAccount}
                  className="flex-1 py-1.5 rounded-lg bg-rose-500 hover:bg-rose-600 text-white text-xs font-bold transition-colors disabled:opacity-50"
                >
                  {isDeleting ? 'Excluindo...' : 'Sim, Excluir Tudo'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
