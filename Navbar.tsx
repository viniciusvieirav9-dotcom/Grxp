import React from 'react';
import { useAuth } from './AuthContext.tsx';
import { useTheme } from './ThemeContext.tsx';
import { getLevelData, AVATAR_OPTIONS } from './formatters.ts';
import {
  Flame,
  Sun,
  Moon,
  LogOut,
  User as UserIcon,
  Sparkles,
  LayoutDashboard,
  ArrowLeftRight,
  Target,
  Trophy,
  TrendingUp,
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'overview' | 'transactions' | 'goals' | 'challenges' | 'investments';
  setCurrentTab: (tab: 'overview' | 'transactions' | 'goals' | 'challenges' | 'investments') => void;
  onOpenAuth: (mode: 'login' | 'register') => void;
  onOpenProfile: () => void;
  onOpenSimulator: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  onOpenAuth,
  onOpenProfile,
}) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const levelData = user ? getLevelData(user.xp) : null;
  const userAvatarObj = user ? AVATAR_OPTIONS.find((a) => a.id === user.avatar) : null;

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-neutral-950/85 dark:bg-neutral-950/85 border-b border-neutral-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => {
              if (user) setCurrentTab('overview');
              else window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="flex items-center gap-2 text-left group focus:outline-none"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-lime-400 p-0.5 shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform flex items-center justify-center">
              <span className="font-display font-black text-neutral-950 text-xl tracking-tighter">XP</span>
            </div>
            <div>
              <span className="font-display font-extrabold text-xl tracking-tight text-white flex items-center gap-1">
                Grana<span className="text-emerald-400">XP</span>
              </span>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links (Single-line controls) */}
        {user ? (
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <button
              onClick={() => setCurrentTab('overview')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                currentTab === 'overview'
                  ? 'bg-neutral-800/90 text-emerald-400 font-semibold'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <LayoutDashboard className="w-4 h-4" />
              <span>Painel</span>
            </button>
            <button
              onClick={() => setCurrentTab('transactions')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                currentTab === 'transactions'
                  ? 'bg-neutral-800/90 text-emerald-400 font-semibold'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <ArrowLeftRight className="w-4 h-4" />
              <span>Movimentações</span>
            </button>
            <button
              onClick={() => setCurrentTab('goals')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                currentTab === 'goals'
                  ? 'bg-neutral-800/90 text-emerald-400 font-semibold'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Target className="w-4 h-4" />
              <span>Metas</span>
            </button>
            <button
              onClick={() => setCurrentTab('challenges')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                currentTab === 'challenges'
                  ? 'bg-neutral-800/90 text-emerald-400 font-semibold'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <Trophy className="w-4 h-4" />
              <span>Desafios</span>
            </button>
            <button
              onClick={() => setCurrentTab('investments')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
                currentTab === 'investments'
                  ? 'bg-neutral-800/90 text-emerald-400 font-semibold'
                  : 'text-neutral-400 hover:text-white hover:bg-neutral-900'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Investimentos</span>
            </button>
          </nav>
        ) : (
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-neutral-400">
            <a href="#como-funciona" className="hover:text-emerald-400 transition-colors whitespace-nowrap">
              Como Funciona
            </a>
            <a href="#simulador" className="hover:text-emerald-400 transition-colors whitespace-nowrap">
              Simulador Público
            </a>
            <a href="#investimentos" className="hover:text-emerald-400 transition-colors whitespace-nowrap">
              Investimentos para Jovens
            </a>
            <a href="#niveis" className="hover:text-emerald-400 transition-colors whitespace-nowrap">
              Níveis & Gamificação
            </a>
            <a href="#faq" className="hover:text-emerald-400 transition-colors whitespace-nowrap">
              Dúvidas
            </a>
          </nav>
        )}

        {/* Zone 3: Actions & Profile */}
        <div className="flex items-center gap-2.5 shrink-0">

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Alternar tema claro/escuro"
            className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {user ? (
            <div className="flex items-center gap-2">
              {/* Streak badge */}
              <div
                title={`${user.streak} dias seguidos cuidando da sua grana!`}
                className="hidden sm:flex items-center gap-1 px-2 py-1 rounded-md bg-neutral-900 border border-neutral-800 text-xs font-medium text-amber-400 tabular-nums"
              >
                <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{user.streak}d</span>
              </div>

              {/* Level & XP */}
              <div
                onClick={onOpenProfile}
                className="cursor-pointer flex items-center gap-2 px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 transition-all"
              >
                <div className="w-7 h-7 rounded-md bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-sm">
                  {userAvatarObj?.emoji || '🎮'}
                </div>
                <div className="text-left hidden lg:block">
                  <div className="text-xs font-bold text-white leading-none truncate max-w-[100px]">
                    {user.displayName || user.username}
                  </div>
                  <div className="text-[10px] text-emerald-400 font-mono leading-tight tabular-nums flex items-center gap-1">
                    <span>Nv.{levelData?.level}</span>
                    <span>·</span>
                    <span>{user.xp} XP</span>
                  </div>
                </div>
              </div>

              {/* Logout button */}
              <button
                onClick={logout}
                title="Sair da conta"
                className="p-2 text-neutral-400 hover:text-rose-400 hover:bg-neutral-900 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-3 py-1.5 text-xs font-medium text-neutral-300 hover:text-white hover:bg-neutral-900 rounded-lg transition-colors whitespace-nowrap"
              >
                Entrar
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="px-3.5 py-1.5 text-xs font-semibold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg shadow-sm shadow-emerald-400/20 transition-all whitespace-nowrap flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Criar Conta</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Submenu for logged users */}
      {user && (
        <div className="md:hidden flex items-center justify-around px-2 py-2 border-t border-neutral-800/60 bg-neutral-950/90 text-xs">
          <button
            onClick={() => setCurrentTab('overview')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded ${
              currentTab === 'overview' ? 'text-emerald-400 font-bold' : 'text-neutral-400'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Painel</span>
          </button>
          <button
            onClick={() => setCurrentTab('transactions')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded ${
              currentTab === 'transactions' ? 'text-emerald-400 font-bold' : 'text-neutral-400'
            }`}
          >
            <ArrowLeftRight className="w-4 h-4" />
            <span>Extrato</span>
          </button>
          <button
            onClick={() => setCurrentTab('goals')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded ${
              currentTab === 'goals' ? 'text-emerald-400 font-bold' : 'text-neutral-400'
            }`}
          >
            <Target className="w-4 h-4" />
            <span>Metas</span>
          </button>
          <button
            onClick={() => setCurrentTab('challenges')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded ${
              currentTab === 'challenges' ? 'text-emerald-400 font-bold' : 'text-neutral-400'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>Missões</span>
          </button>
          <button
            onClick={() => setCurrentTab('investments')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded ${
              currentTab === 'investments' ? 'text-emerald-400 font-bold' : 'text-neutral-400'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>Aprender</span>
          </button>
        </div>
      )}
    </header>
  );
};
