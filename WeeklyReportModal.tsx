import React, { useMemo } from 'react';
import { useAuth } from './AuthContext.tsx';
import { Transaction, Goal } from './types.ts';
import { formatCurrency, CATEGORY_LABELS } from './formatters.ts';
import { X, TrendingUp, TrendingDown, Calendar, Award, Target, Sparkles } from 'lucide-react';

interface WeeklyReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: Transaction[];
  goals: Goal[];
}

export const WeeklyReportModal: React.FC<WeeklyReportModalProps> = ({
  isOpen,
  onClose,
  transactions,
  goals,
}) => {
  const { user } = useAuth();

  const report = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(now.getDate() - 7);
    const sevenDaysStr = sevenDaysAgo.toISOString().split('T')[0];

    let weekIncome = 0;
    let weekExpense = 0;
    const catMap: Record<string, number> = {};

    const weekTxs = transactions.filter((t) => t.date >= sevenDaysStr);

    weekTxs.forEach((t) => {
      if (t.type === 'income') {
        weekIncome += t.amount;
      } else {
        weekExpense += t.amount;
        catMap[t.category] = (catMap[t.category] || 0) + t.amount;
      }
    });

    const netWeekly = weekIncome - weekExpense;
    const avgDailyExpense = weekExpense / 7;

    const topCategories = Object.entries(catMap)
      .map(([cat, amount]) => ({
        category: cat,
        amount,
        percent: weekExpense > 0 ? Math.round((amount / weekExpense) * 100) : 0,
      }))
      .sort((a, b) => b.amount - a.amount);

    return {
      txCount: weekTxs.length,
      weekIncome,
      weekExpense,
      netWeekly,
      avgDailyExpense,
      topCategories,
    };
  }, [transactions]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 relative shadow-2xl space-y-5 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-mono font-bold mb-2">
            <Calendar className="w-3.5 h-3.5" />
            <span>Últimos 7 Dias</span>
          </div>
          <h3 className="font-display font-black text-2xl text-white">Resumo Semanal da Grana</h3>
          <p className="text-xs text-neutral-400">
            Acompanhe seu desempenho recente e mantenha seu orçamento nos trilhos.
          </p>
        </div>

        {/* 3 Metric Cards */}
        <div className="grid grid-cols-3 gap-3">
          <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800">
            <span className="text-[10px] text-neutral-400 uppercase font-semibold">Entradas</span>
            <div className="font-display text-base font-bold text-emerald-400 tabular-nums mt-1">
              +{formatCurrency(report.weekIncome)}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800">
            <span className="text-[10px] text-neutral-400 uppercase font-semibold">Saídas</span>
            <div className="font-display text-base font-bold text-rose-400 tabular-nums mt-1">
              -{formatCurrency(report.weekExpense)}
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800">
            <span className="text-[10px] text-neutral-400 uppercase font-semibold">Saldo Semanal</span>
            <div
              className={`font-display text-base font-bold tabular-nums mt-1 ${
                report.netWeekly >= 0 ? 'text-emerald-400' : 'text-rose-400'
              }`}
            >
              {formatCurrency(report.netWeekly)}
            </div>
          </div>
        </div>

        {/* Insights & Metrics */}
        <div className="p-4 rounded-xl bg-neutral-950/60 border border-neutral-800 space-y-2 text-xs">
          <div className="flex justify-between text-neutral-300">
            <span>Média de Gasto Diário:</span>
            <strong className="text-white font-mono">{formatCurrency(report.avgDailyExpense)}/dia</strong>
          </div>
          <div className="flex justify-between text-neutral-300">
            <span>Movimentações Registradas:</span>
            <strong className="text-emerald-400 font-mono">{report.txCount} transações</strong>
          </div>
          <div className="flex justify-between text-neutral-300">
            <span>Streak Ativo:</span>
            <strong className="text-amber-400 font-mono">🔥 {user?.streak || 1} dias seguidos</strong>
          </div>
        </div>

        {/* Top Gastos da Semana */}
        <div>
          <h4 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
            Maiores Despesas desta Semana
          </h4>

          {report.topCategories.length === 0 ? (
            <div className="text-center py-4 text-neutral-500 text-xs">
              Nenhum gasto registrado nos últimos 7 dias. Excelente economia!
            </div>
          ) : (
            <div className="space-y-2">
              {report.topCategories.slice(0, 4).map((c) => {
                const label = CATEGORY_LABELS[c.category] || CATEGORY_LABELS.outros;
                return (
                  <div
                    key={c.category}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-neutral-950/80 border border-neutral-800/80 text-xs"
                  >
                    <span className="text-neutral-200 font-medium">{label.label}</span>
                    <span className="font-mono text-white tabular-nums font-bold">
                      {formatCurrency(c.amount)} ({c.percent}%)
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs transition-colors"
        >
          Fechar Resumo
        </button>
      </div>
    </div>
  );
};
