import React, { useState, useEffect } from 'react';
import { Goal } from './types.ts';
import { X, Loader2, Target, Sparkles } from 'lucide-react';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: {
    name: string;
    targetAmount: number;
    deadline?: string;
    category: string;
    notes?: string;
  }) => Promise<void>;
  goalToEdit?: Goal | null;
}

export const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  onClose,
  onSave,
  goalToEdit,
}) => {
  const [name, setName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');
  const [deadline, setDeadline] = useState('');
  const [category, setCategory] = useState('Reserva');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (goalToEdit) {
      setName(goalToEdit.name);
      setTargetAmount(goalToEdit.targetAmount.toString());
      setDeadline(goalToEdit.deadline || '');
      setCategory(goalToEdit.category || 'Geral');
      setNotes(goalToEdit.notes || '');
    } else {
      setName('');
      setTargetAmount('');
      setDeadline('');
      setCategory('Reserva');
      setNotes('');
    }
    setError(null);
  }, [goalToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedTarget = parseFloat(targetAmount.replace(',', '.'));
    if (isNaN(parsedTarget) || parsedTarget <= 0) {
      setError('Informe um valor de meta maior que zero.');
      return;
    }

    setLoading(true);
    try {
      await onSave({
        name: name.trim(),
        targetAmount: parsedTarget,
        deadline: deadline || undefined,
        category,
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Erro ao salvar meta.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 relative shadow-2xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-display font-black text-xl text-white mb-1">
          {goalToEdit ? 'Editar Meta Financeira' : 'Criar Nova Meta'}
        </h3>
        <p className="text-xs text-neutral-400 mb-5">
          {goalToEdit
            ? 'Ajuste os alvos da sua meta.'
            : 'Defina seu objetivo e ganhe +40 XP para subir no GranaXP!'}
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nome da Meta */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Nome da Meta
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ex: Reserva de Emergência, PC Gamer, Viagem..."
              className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Valor Desejado */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Valor Desejado (R$)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={targetAmount}
              onChange={(e) => setTargetAmount(e.target.value)}
              placeholder="Ex: 3000,00"
              className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white font-mono placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Categoria da Meta */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Categoria / Finalidade
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="Reserva">🛡️ Reserva de Emergência</option>
              <option value="Eletrônicos">📱 Celular / Eletrônicos</option>
              <option value="Viagem">✈️ Viagem ou Lazer</option>
              <option value="Estudos">📚 Cursos & Faculdade</option>
              <option value="Veículo">🚗 Moto ou Carro</option>
              <option value="Outros">🎯 Outro Sonho</option>
            </select>
          </div>

          {/* Prazo opcional */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Prazo Estimado (Opcional)
            </label>
            <input
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Observações / Motivação */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Motivação / Observação (Opcional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Não vou mexer nesse dinheiro até atingir 100%!"
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-3 bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold text-sm rounded-xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>{goalToEdit ? 'Atualizar Meta' : 'Salvar Meta (+40 XP)'}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
