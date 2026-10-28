import React, { useState } from 'react';
import { useAuth } from './AuthContext.tsx';
import { X, Lock, User, UserCheck, AlertCircle, Sparkles, Loader2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  initialMode: 'login' | 'register';
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, initialMode, onClose }) => {
  const { login, register } = useAuth();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [username, setUsername] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await login(username, password);
        if (!res.success) {
          setError(res.error || 'Falha ao autenticar.');
        } else {
          onClose();
        }
      } else {
        if (password !== confirmPassword) {
          setError('A confirmação de senha não confere.');
          setLoading(false);
          return;
        }

        const res = await register(username, password, confirmPassword, displayName);
        if (!res.success) {
          setError(res.error || 'Falha ao registrar conta.');
        } else {
          onClose();
        }
      }
    } catch {
      setError('Erro inesperado de comunicação com o servidor.');
    } finally {
      setLoading(false);
    }
  };

  const switchMode = (newMode: 'login' | 'register') => {
    setMode(newMode);
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 relative shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Tab switcher */}
        <div className="flex border-b border-neutral-800 mb-6">
          <button
            type="button"
            onClick={() => switchMode('login')}
            className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors ${
              mode === 'login'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Entrar no Jogo
          </button>
          <button
            type="button"
            onClick={() => switchMode('register')}
            className={`flex-1 pb-3 text-sm font-bold border-b-2 transition-colors ${
              mode === 'register'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            Criar Nova Conta
          </button>
        </div>

        {/* Header Title */}
        <div className="mb-5">
          <h3 className="font-display font-black text-xl text-white">
            {mode === 'login' ? 'Bem-vindo de volta, estrategista!' : 'Inicie sua jornada no GranaXP'}
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            {mode === 'login'
              ? 'Digite suas credenciais salvas no servidor seguro.'
              : 'Sem e-mail, sem spam. Apenas usuário e senha com hash seguro no servidor.'}
          </p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Nome de Usuário (Exclusivo)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
                placeholder="ex: vinicius99"
                className="w-full pl-9 pr-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 font-mono"
              />
            </div>
            <span className="text-[10px] text-neutral-500 mt-1 block">
              Apenas letras minúsculas, números e traços.
            </span>
          </div>

          {/* Display Name (Only in Register) */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Nome de Exibição (Opcional)
              </label>
              <div className="relative">
                <UserCheck className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Como quer ser chamado (ex: Vini)"
                  className="w-full pl-9 pr-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">Senha</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full pl-9 pr-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
              />
            </div>
          </div>

          {/* Confirm Password (Only in Register) */}
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                Confirmação de Senha
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repita sua senha"
                  className="w-full pl-9 pr-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Processando...</span>
              </>
            ) : mode === 'login' ? (
              <span>Entrar no GranaXP</span>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Criar Conta (+50 XP de Boas-Vindas)</span>
              </>
            )}
          </button>
        </form>

        <div className="mt-5 pt-4 border-t border-neutral-800/80 text-center text-xs text-neutral-400">
          {mode === 'login' ? (
            <span>
              Ainda não tem conta?{' '}
              <button
                type="button"
                onClick={() => switchMode('register')}
                className="text-emerald-400 font-bold hover:underline"
              >
                Cadastre-se grátis
              </button>
            </span>
          ) : (
            <span>
              Já tem conta cadastrada?{' '}
              <button
                type="button"
                onClick={() => switchMode('login')}
                className="text-emerald-400 font-bold hover:underline"
              >
                Faça login
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
