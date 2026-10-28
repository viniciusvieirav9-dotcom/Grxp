import React, { useMemo } from 'react';
import { useAuth } from './AuthContext.tsx';
import { Transaction, Goal } from './types.ts';
import { formatCurrency, formatDate, getLevelData, CATEGORY_LABELS } from './formatters.ts';
import {
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Plus,
  Flame,
  Target,
  Trophy,
  Share2,
  Calendar,
  Sparkles,
  TrendingUp,
  BarChart3,
} from 'lucide-react';

interface DashboardOverviewProps {
  transactions: Transaction[];
  goals: Goal[];
  onOpenAddTransaction: () => void;
  onOpenAddGoal: () => void;
  onOpenShareModal: () => void;
  onOpenWeeklyReport: () => void;
  onNavigateToTab: (tab: 'transactions' | 'goals' | 'challenges' | 'investments') => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  transactions,
  goals,
  onOpenAddTransaction,
  onOpenAddGoal,
  onOpenShareModal,
  onOpenWeeklyReport,
  onNavigateToTab,
}) => {
  const { user } = useAuth();

  // Financial calculations
  const stats = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;

    const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM
    let monthIncome = 0;
    let monthExpense = 0;

    const categoryTotals: Record<string, number> = {};

    transactions.forEach((t) => {
      if (t.type === 'income') {
        totalIncome += t.amount;
        if (t.date.startsWith(currentMonth)) monthIncome += t.amount;
      } else {
        totalExpense += t.amount;
        if (t.date.startsWith(currentMonth)) monthExpense += t.amount;

        categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
      }
    });

    const balance = totalIncome - totalExpense;

    // Sort categories by expenditure
    const topCategories = Object.entries(categoryTotals)
      .map(([cat, amount]) => ({
        category: cat,
        amount,
        percent: monthExpense > 0 ? Math.round((amount / monthExpense) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    return {
      balance,
      totalIncome,
      totalExpense,
      monthIncome,
      monthExpense,
      topCategories,
    };
  }, [transactions]);

  const levelData = user ? getLevelData(user.xp) : getLevelData(0);

  // Motivational message generator
  const motivationalMessage = useMemo(() => {
    if (stats.balance > 0 && stats.monthExpense < stats.monthIncome * 0.7) {
      return '🚀 Incrível! Você está gastando menos do que ganha e construindo patrimônio de verdade.';
    } else if (stats.balance > 0) {
      return '⭐ Saldo no azul! Que tal direcionar uma fatia do que sobrou para uma meta?';
    } else if (transactions.length === 0) {
      return '👋 Bem-vindo ao jogo! Cadastre sua primeira movimentação financeira para subir de nível.';
    } else {
      return '🎯 Atenção aos gastos supérfluos essa semana. Revise suas despesas para voltar a subir de nível!';
    }
  }, [stats, transactions]);

  return (
    <div className="space-y-6">
      {/* Top Banner: Welcome & Level & Streak Strip */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-neutral-900 via-neutral-900 to-neutral-950 border border-neutral-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-2xl">
            {levelData.badge}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-black text-xl text-white">
                Olá, {user?.displayName || user?.username}!
              </h2>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-400/10 text-emerald-400 border border-emerald-400/20">
                Nível {levelData.level} · {levelData.title}
              </span>
            </div>
            <p className="text-xs text-neutral-400 mt-0.5">{motivationalMessage}</p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 w-full md:w-auto">
          {/* Share achievement badge */}
          <button
            onClick={onOpenShareModal}
            className="flex-1 md:flex-initial px-3.5 py-2 text-xs font-semibold rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <Share2 className="w-3.5 h-3.5 text-emerald-400" />
            <span>Compartilhar Conquista</span>
          </button>

          {/* Weekly Report Button */}
          <button
            onClick={onOpenWeeklyReport}
            className="flex-1 md:flex-initial px-3.5 py-2 text-xs font-semibold rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 transition-colors flex items-center justify-center gap-1.5 whitespace-nowrap"
          >
            <BarChart3 className="w-3.5 h-3.5 text-sky-400" />
            <span>Resumo Semanal</span>
          </button>
        </div>
      </div>

      {/* Main KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Saldo Real */}
        <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="font-medium">Saldo Atual Disponível</span>
            <Wallet className="w-4 h-4 text-emerald-400" />
          </div>
          <div
            className={`font-display text-2xl sm:text-3xl font-black tabular-nums ${
              stats.balance >= 0 ? 'text-white' : 'text-rose-400'
            }`}
          >
            {formatCurrency(stats.balance)}
          </div>
          <div className="text-[11px] text-neutral-500 pt-1 border-t border-neutral-800/80 flex justify-between">
            <span>Calculado em tempo real</span>
            <span className="text-emerald-400 font-mono">{transactions.length} registros</span>
          </div>
        </div>

        {/* Card 2: Entradas do Mês */}
        <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="font-medium">Entradas do Mês</span>
            <ArrowUpRight className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-display text-2xl font-black text-emerald-400 tabular-nums">
            +{formatCurrency(stats.monthIncome)}
          </div>
          <div className="text-[11px] text-neutral-500 pt-1 border-t border-neutral-800/80">
            Salário, mesadas e recebimentos
          </div>
        </div>

        {/* Card 3: Saídas do Mês */}
        <div className="p-5 rounded-2xl bg-neutral-900/70 border border-neutral-800 space-y-2">
          <div className="flex items-center justify-between text-xs text-neutral-400">
            <span className="font-medium">Saídas do Mês</span>
            <ArrowDownRight className="w-4 h-4 text-rose-400" />
          </div>
          <div className="font-display text-2xl font-black text-rose-400 tabular-nums">
            -{formatCurrency(stats.monthExpense)}
          </div>
          <div className="text-[11px] text-neutral-500 pt-1 border-t border-neutral-800/80">
            Despesas e contas pagas
          </div>
        </div>

        {/* Card 4: Gamificação XP & Streak */}
        <div className="p-5 rounded-2xl bg-neutral-900/70 border border-emerald-500/30 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400 font-medium">XP do Jogador</span>
            <div className="flex items-center gap-1 text-amber-400 font-bold font-mono">
              <Flame className="w-3.5 h-3.5 fill-amber-400" />
              <span>{user?.streak || 1}d Streak</span>
            </div>
          </div>
          <div className="flex items-baseline gap-1">
            <span className="font-display text-2xl font-black text-emerald-400 tabular-nums">
              {user?.xp || 0}
            </span>
            <span className="text-xs text-neutral-500 font-mono">/ {levelData.nextLevelXp} XP</span>
          </div>

          <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden mt-1">
            <div
              className="bg-gradient-to-r from-emerald-400 to-lime-400 h-full transition-all duration-300"
              style={{ width: `${levelData.progressPercent}%` }}
            />
          </div>
          <div className="text-[10px] text-neutral-400 flex justify-between">
            <span>Nv.{levelData.level} {levelData.title}</span>
            <span className="text-emerald-400 font-mono">{levelData.progressPercent}%</span>
          </div>
        </div>
      </div>

      {/* Action Buttons Row */}
      <div className="flex flex-wrap items-center gap-3">
        <button
          onClick={onOpenAddTransaction}
          className="px-4 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold text-xs shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>Nova Movimentação (+20 XP)</span>
        </button>

        <button
          onClick={onOpenAddGoal}
          className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs border border-neutral-700 transition-colors flex items-center gap-2"
        >
          <Target className="w-4 h-4 text-emerald-400" />
          <span>Criar Nova Meta (+40 XP)</span>
        </button>
      </div>

      {/* Two Column Section: Despesas por Categoria & Metas em Andamento */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Despesas por Categoria */}
        <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
              <span>Para Onde Está Indo Sua Grana</span>
            </h3>
            <span className="text-xs text-neutral-400">Total do Mês</span>
          </div>

          {stats.topCategories.length === 0 ? (
            <div className="text-center py-8 text-neutral-500 text-xs">
              Nenhuma despesa registrada ainda. Cadastre gastos para ver o raio-x financeiro!
            </div>
          ) : (
            <div className="space-y-3">
              {stats.topCategories.slice(0, 5).map((item) => {
                const meta = CATEGORY_LABELS[item.category] || CATEGORY_LABELS.outros;
                return (
                  <div key={item.category} className="space-y-1">
                    <div className="flex justify-between text-xs">
                      <span className="text-neutral-300 flex items-center gap-2">
                        <span className={`px-1.5 py-0.5 rounded text-[10px] ${meta.color}`}>
                          {meta.label}
                        </span>
                      </span>
                      <span className="font-mono text-white tabular-nums">
                        {formatCurrency(item.amount)} ({item.percent}%)
                      </span>
                    </div>
                    <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-emerald-400 h-full rounded-full"
                        style={{ width: `${Math.min(100, item.percent)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Metas em Andamento */}
        <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display font-bold text-base text-white flex items-center gap-2">
                <Target className="w-4 h-4 text-emerald-400" />
                <span>Metas em Andamento</span>
              </h3>
              <button
                onClick={() => onNavigateToTab('goals')}
                className="text-xs text-emerald-400 hover:underline font-semibold"
              >
                Ver Todas ({goals.length})
              </button>
            </div>

            {goals.length === 0 ? (
              <div className="text-center py-8 text-neutral-500 text-xs space-y-2">
                <p>Nenhuma meta ativa. Quem não tem meta gasta sem perceber!</p>
                <button
                  onClick={onOpenAddGoal}
                  className="px-3 py-1.5 rounded-lg bg-emerald-400/10 text-emerald-400 font-semibold text-xs hover:bg-emerald-400/20 transition-colors"
                >
                  Definir Minha 1ª Meta
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {goals.slice(0, 3).map((goal) => {
                  const percent = Math.min(
                    100,
                    Math.round(((goal.currentAmount || 0) / goal.targetAmount) * 100)
                  );
                  return (
                    <div
                      key={goal.id}
                      className="p-3.5 rounded-xl bg-neutral-950/70 border border-neutral-800/80 space-y-2"
                    >
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-white truncate max-w-[200px]">
                          {goal.name}
                        </span>
                        <span className="font-mono text-emerald-400 font-bold">{percent}%</span>
                      </div>
                      <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                        <div
                          className="bg-gradient-to-r from-emerald-400 to-lime-300 h-full rounded-full transition-all"
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[11px] text-neutral-400 tabular-nums">
                        <span>{formatCurrency(goal.currentAmount || 0)}</span>
                        <span>Alvo: {formatCurrency(goal.targetAmount)}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Transactions Table */}
      <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-base text-white">
            Últimas Movimentações
          </h3>
          <button
            onClick={() => onNavigateToTab('transactions')}
            className="text-xs text-emerald-400 hover:underline font-semibold"
          >
            Ver Extrato Completo
          </button>
        </div>

        {transactions.length === 0 ? (
          <div className="text-center py-8 text-neutral-500 text-xs">
            Nenhuma movimentação cadastrada. Comece adicionando seus ganhos e despesas!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-neutral-800 text-neutral-500">
                <tr>
                  <th className="pb-3 font-medium">Data</th>
                  <th className="pb-3 font-medium">Descrição</th>
                  <th className="pb-3 font-medium">Categoria</th>
                  <th className="pb-3 font-medium text-right">Valor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/50">
                {transactions.slice(0, 5).map((t) => {
                  const cat = CATEGORY_LABELS[t.category] || CATEGORY_LABELS.outros;
                  return (
                    <tr key={t.id} className="hover:bg-neutral-800/30 transition-colors">
                      <td className="py-3 text-neutral-400 font-mono whitespace-nowrap">
                        {formatDate(t.date)}
                      </td>
                      <td className="py-3 font-medium text-white truncate max-w-[220px]">
                        {t.description}
                        {t.notes && (
                          <span className="block text-[10px] text-neutral-500 truncate">{t.notes}</span>
                        )}
                      </td>
                      <td className="py-3 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${cat.color}`}>
                          {cat.label}
                        </span>
                      </td>
                      <td
                        className={`py-3 text-right font-mono font-bold whitespace-nowrap ${
                          t.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {t.type === 'income' ? '+' : '-'}
                        {formatCurrency(t.amount)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
