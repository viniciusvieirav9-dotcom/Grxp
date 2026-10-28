import React, { useState } from 'react';
import { AdminStats } from './types.ts';
import {
  X,
  Lock,
  Loader2,
  AlertCircle,
  Users,
  ArrowLeftRight,
  Target,
  Trophy,
  Activity,
  CheckCircle,
  Save,
} from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminModal: React.FC<AdminModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [password, setPassword] = useState('');
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Admin stats & settings state
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [announcement, setAnnouncement] = useState('');
  const [xpMultiplier, setXpMultiplier] = useState(1);
  const [savingSettings, setSavingSettings] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: password.trim() }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || 'Senha administrativa incorreta.');
        return;
      }

      setAdminToken(data.adminToken);

      // Fetch stats
      const statsRes = await fetch('/api/admin/stats', {
        headers: { 'x-admin-token': data.adminToken },
      });
      if (statsRes.ok) {
        const statsData = await statsRes.json();
        setStats(statsData.stats);
        if (statsData.settings) {
          setAnnouncement(statsData.settings.announcements?.[0] || '');
          setXpMultiplier(statsData.settings.xpMultiplier || 1);
        }
      }
    } catch {
      setError('Erro de conexão ao validar credenciais administrativas.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminToken) return;

    setSavingSettings(true);
    setSaveSuccess(false);

    try {
      const res = await fetch('/api/admin/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-admin-token': adminToken,
        },
        body: JSON.stringify({
          announcements: announcement ? [announcement] : [],
          xpMultiplier: Number(xpMultiplier),
        }),
      });

      if (res.ok) {
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      }
    } catch {
      alert('Falha ao salvar configurações.');
    } finally {
      setSavingSettings(false);
    }
  };

  const handleClose = () => {
    setPassword('');
    setAdminToken(null);
    setStats(null);
    setError(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-2xl w-full p-6 relative shadow-2xl space-y-5 my-8">
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!adminToken ? (
          /* Authentication Screen */
          <div className="max-w-md mx-auto py-4 space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-neutral-800 text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-neutral-700">
                <Lock className="w-6 h-6" />
              </div>
              <h3 className="font-display font-black text-xl text-white">
                Autenticação Administrativa
              </h3>
              <p className="text-xs text-neutral-400">
                Acesso restrito para monitoramento agregado e controle da plataforma.
              </p>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Senha de Administrador
                </label>
                <input
                  type="password"
                  required
                  autoFocus
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Digite a senha administrativa..."
                  className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500 font-mono"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Verificando no Servidor...</span>
                  </>
                ) : (
                  <span>Acessar Painel de Controle</span>
                )}
              </button>
            </form>

            <div className="text-[11px] text-neutral-500 text-center pt-2">
              🔒 Verificado de forma segura no backend via <code>ADMIN_PASSWORD</code>.
            </div>
          </div>
        ) : (
          /* Admin Dashboard */
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-display font-black text-2xl text-white">
                    Painel do Administrador
                  </h3>
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Sessão Autenticada
                  </span>
                </div>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Estatísticas globais e configurações de sistema do GranaXP.
                </p>
              </div>
            </div>

            {/* Aggregated Anonymized Stats */}
            {stats && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800">
                  <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
                    <span>Usuários</span>
                    <Users className="w-3.5 h-3.5 text-sky-400" />
                  </div>
                  <div className="font-display text-xl font-bold text-white tabular-nums">
                    {stats.totalUsers}
                  </div>
                  <div className="text-[10px] text-neutral-500">
                    {stats.activeUsersLast7Days} ativos nesta semana
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800">
                  <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
                    <span>Movimentações</span>
                    <ArrowLeftRight className="w-3.5 h-3.5 text-emerald-400" />
                  </div>
                  <div className="font-display text-xl font-bold text-white tabular-nums">
                    {stats.totalTransactions}
                  </div>
                  <div className="text-[10px] text-neutral-500">Registros no sistema</div>
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800">
                  <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
                    <span>Metas Criadas</span>
                    <Target className="w-3.5 h-3.5 text-amber-400" />
                  </div>
                  <div className="font-display text-xl font-bold text-white tabular-nums">
                    {stats.totalGoals}
                  </div>
                  <div className="text-[10px] text-emerald-400">
                    {stats.totalCompletedGoals} concluídas
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800">
                  <div className="flex items-center justify-between text-neutral-400 text-xs mb-1">
                    <span>XP Circulando</span>
                    <Trophy className="w-3.5 h-3.5 text-purple-400" />
                  </div>
                  <div className="font-display text-xl font-bold text-white tabular-nums">
                    {stats.totalXP}
                  </div>
                  <div className="text-[10px] text-neutral-500">XP acumulado</div>
                </div>
              </div>
            )}

            {/* Admin Settings Form */}
            <form
              onSubmit={handleSaveSettings}
              className="p-5 rounded-2xl bg-neutral-950/60 border border-neutral-800 space-y-4"
            >
              <h4 className="font-display font-bold text-sm text-white">Configurações Gerais</h4>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Aviso Global da Plataforma (Banner de Novidades)
                </label>
                <input
                  type="text"
                  value={announcement}
                  onChange={(e) => setAnnouncement(e.target.value)}
                  placeholder="Ex: Semana de XP em dobro no GranaXP!"
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Multiplicador de XP da Comunidade
                </label>
                <select
                  value={xpMultiplier}
                  onChange={(e) => setXpMultiplier(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-neutral-900 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value={1}>1.0x (Padrão Normal)</option>
                  <option value={1.5}>1.5x (Evento de Fim de Semana)</option>
                  <option value={2}>2.0x (XP em Dobro)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={savingSettings}
                className="py-2 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                {savingSettings ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : saveSuccess ? (
                  <>
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Salvo!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5" />
                    <span>Salvar Configurações</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};
