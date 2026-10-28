import React, { useState } from 'react';
import { Goal } from './types.ts';
import { formatCurrency, formatDate } from './formatters.ts';
import {
  Target,
  Plus,
  Coins,
  CheckCircle,
  Pause,
  Play,
  Trash2,
  Edit2,
  Calendar,
  Sparkles,
} from 'lucide-react';

interface GoalsSectionProps {
  goals: Goal[];
  onOpenCreateGoal: () => void;
  onEditGoal: (goal: Goal) => void;
  onDepositGoal: (goalId: string, amount: number) => Promise<void>;
  onToggleGoalStatus: (goalId: string, status: 'active' | 'paused' | 'completed') => Promise<void>;
  onDeleteGoal: (goalId: string) => Promise<void>;
}

export const GoalsSection: React.FC<GoalsSectionProps> = ({
  goals,
  onOpenCreateGoal,
  onEditGoal,
  onDepositGoal,
  onToggleGoalStatus,
  onDeleteGoal,
}) => {
  const [depositModalGoal, setDepositModalGoal] = useState<Goal | null>(null);
  const [depositAmount, setDepositAmount] = useState('');
  const [isDepositing, setIsDepositing] = useState(false);

  const handleDepositSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!depositModalGoal) return;

    const parsed = parseFloat(depositAmount.replace(',', '.'));
    if (isNaN(parsed) || parsed <= 0) return;

    setIsDepositing(true);
    try {
      await onDepositGoal(depositModalGoal.id, parsed);
      setDepositModalGoal(null);
      setDepositAmount('');
    } finally {
      setIsDepositing(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-black text-2xl text-white">Metas Financeiras</h2>
          <p className="text-xs text-neutral-400">
            Defina alvos concretos, guarde dinheiro e comemore cada conquista com XP!
          </p>
        </div>

        <button
          onClick={onOpenCreateGoal}
          className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 shadow-md shadow-emerald-500/20 transition-all flex items-center gap-1.5"
        >
          <Plus className="w-4 h-4" />
          <span>Criar Nova Meta</span>
        </button>
      </div>

      {/* Goals Grid */}
      {goals.length === 0 ? (
        <div className="p-12 text-center rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Target className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-white">Você ainda não tem metas</h3>
            <p className="text-xs text-neutral-400 max-w-sm mx-auto mt-1">
              Quem guarda dinheiro sem objetivo acaba gastando em besteira. Crie uma meta para um celular, viagem ou sua reserva de emergência!
            </p>
          </div>
          <button
            onClick={onOpenCreateGoal}
            className="px-5 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold text-xs transition-colors"
          >
            Criar Minha Primeira Meta (+40 XP)
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {goals.map((goal) => {
            const current = goal.currentAmount || 0;
            const percent = Math.min(100, Math.round((current / goal.targetAmount) * 100));
            const isCompleted = goal.status === 'completed' || current >= goal.targetAmount;
            const isPaused = goal.status === 'paused';

            return (
              <div
                key={goal.id}
                className={`p-5 rounded-2xl border flex flex-col justify-between transition-all ${
                  isCompleted
                    ? 'bg-emerald-500/10 border-emerald-500/40'
                    : isPaused
                    ? 'bg-neutral-950/50 border-neutral-800 opacity-75'
                    : 'bg-neutral-900/70 border-neutral-800'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-neutral-800 text-neutral-300">
                      {goal.category}
                    </span>
                    <div className="flex items-center gap-1">
                      {isCompleted ? (
                        <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-400 font-mono">
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>Concluída!</span>
                        </span>
                      ) : (
                        <span className="text-xs font-mono font-bold text-emerald-400 tabular-nums">
                          {percent}%
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-lg text-white truncate">
                    {goal.name}
                  </h3>

                  {goal.notes && (
                    <p className="text-xs text-neutral-400 mt-1 line-clamp-2">{goal.notes}</p>
                  )}

                  {/* Progress Bar */}
                  <div className="mt-4 space-y-1.5">
                    <div className="w-full bg-neutral-800 h-2.5 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isCompleted
                            ? 'bg-emerald-400'
                            : 'bg-gradient-to-r from-emerald-400 via-lime-400 to-teal-400'
                        }`}
                        style={{ width: `${percent}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-xs font-mono tabular-nums text-neutral-400">
                      <span className="text-white font-bold">{formatCurrency(current)}</span>
                      <span>Alvo: {formatCurrency(goal.targetAmount)}</span>
                    </div>
                  </div>

                  {goal.deadline && (
                    <div className="flex items-center gap-1 text-[11px] text-neutral-500 mt-3 font-mono">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Prazo: {formatDate(goal.deadline)}</span>
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div className="pt-4 mt-4 border-t border-neutral-800/80 flex items-center justify-between gap-2">
                  <button
                    onClick={() => setDepositModalGoal(goal)}
                    disabled={isCompleted}
                    className="flex-1 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 disabled:opacity-40"
                  >
                    <Coins className="w-3.5 h-3.5" />
                    <span>Aportar Grana</span>
                  </button>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() =>
                        onToggleGoalStatus(
                          goal.id,
                          goal.status === 'paused' ? 'active' : 'paused'
                        )
                      }
                      title={goal.status === 'paused' ? 'Retomar Meta' : 'Pausar Meta'}
                      className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                    >
                      {goal.status === 'paused' ? (
                        <Play className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Pause className="w-3.5 h-3.5" />
                      )}
                    </button>

                    <button
                      onClick={() => onEditGoal(goal)}
                      title="Editar Meta"
                      className="p-2 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(`Excluir a meta "${goal.name}"?`)) {
                          onDeleteGoal(goal.id);
                        }
                      }}
                      title="Excluir Meta"
                      className="p-2 text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Deposit Quick Modal */}
      {depositModalGoal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-sm w-full p-6 relative shadow-2xl">
            <h3 className="font-display font-black text-lg text-white mb-1">
              Fazer Aporte na Meta
            </h3>
            <p className="text-xs text-neutral-400 mb-4 truncate">
              Meta: <strong className="text-white">{depositModalGoal.name}</strong>
            </p>

            <form onSubmit={handleDepositSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-300 mb-1.5">
                  Valor a Depositar (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  autoFocus
                  required
                  value={depositAmount}
                  onChange={(e) => setDepositAmount(e.target.value)}
                  placeholder="0,00"
                  className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white font-mono placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[20, 50, 100].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => setDepositAmount(v.toString())}
                    className="py-1.5 rounded-lg bg-neutral-950 border border-neutral-800 text-xs text-neutral-300 hover:text-emerald-400 transition-colors font-mono"
                  >
                    +R$ {v}
                  </button>
                ))}
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setDepositModalGoal(null)}
                  className="w-1/2 py-2.5 rounded-xl border border-neutral-800 text-xs font-semibold text-neutral-400 hover:text-white"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isDepositing}
                  className="w-1/2 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold text-xs flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Aportar (+30 XP)</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
