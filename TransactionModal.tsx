import React, { useState, useEffect } from 'react';
import { Transaction, TransactionCategory, TransactionType } from './types.ts';
import { CATEGORY_LABELS } from './formatters.ts';
import { X, Loader2, Sparkles } from 'lucide-react';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (tx: {
    description: string;
    amount: number;
    type: TransactionType;
    category: TransactionCategory;
    date: string;
    notes?: string;
  }) => Promise<void>;
  transactionToEdit?: Transaction | null;
}

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  onSave,
  transactionToEdit,
}) => {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [type, setType] = useState<TransactionType>('expense');
  const [category, setCategory] = useState<TransactionCategory>('alimentacao');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (transactionToEdit) {
      setDescription(transactionToEdit.description);
      setAmount(transactionToEdit.amount.toString());
      setType(transactionToEdit.type);
      setCategory(transactionToEdit.category);
      setDate(transactionToEdit.date);
      setNotes(transactionToEdit.notes || '');
    } else {
      setDescription('');
      setAmount('');
      setType('expense');
      setCategory('alimentacao');
      setDate(new Date().toISOString().split('T')[0]);
      setNotes('');
    }
    setError(null);
  }, [transactionToEdit, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const parsedAmount = parseFloat(amount.replace(',', '.'));
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Informe um valor monetário válido maior que zero.');
      return;
    }

    setLoading(true);
    try {
      await onSave({
        description: description.trim(),
        amount: parsedAmount,
        type,
        category,
        date,
        notes: notes.trim() || undefined,
      });
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Falha ao salvar movimentação.');
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
          {transactionToEdit ? 'Editar Movimentação' : 'Nova Movimentação'}
        </h3>
        <p className="text-xs text-neutral-400 mb-5">
          {transactionToEdit
            ? 'Atualize os dados da sua entrada ou saída.'
            : 'Cada movimentação cadastrada ajuda a subir de nível e dá +20 XP!'}
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Tipo (Entrada ou Saída) */}
          <div className="grid grid-cols-2 gap-2 p-1 bg-neutral-950 border border-neutral-800 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setType('expense');
                if (category === 'salario') setCategory('alimentacao');
              }}
              className={`py-2 rounded-lg text-xs font-bold transition-all ${
                type === 'expense'
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              💸 Saída (Gasto)
            </button>
            <button
              type="button"
              onClick={() => {
                setType('income');
                setCategory('salario');
              }}
              className={`py-2 rounded-lg text-xs font-bold transition-all ${
                type === 'income'
                  ? 'bg-emerald-500 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              💰 Entrada (Ganho)
            </button>
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">Descrição</label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Almoço com amigos, Mesada, Salário..."
              className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Valor */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">Valor (R$)</label>
            <input
              type="number"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
              className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white font-mono placeholder-neutral-600 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Categoria */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">Categoria</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TransactionCategory)}
              className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500"
            >
              {Object.entries(CATEGORY_LABELS).map(([catKey, val]) => (
                <option key={catKey} value={catKey} className="bg-neutral-900 text-white">
                  {val.label}
                </option>
              ))}
            </select>
          </div>

          {/* Data */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">Data</label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3 py-2.5 bg-neutral-950 border border-neutral-800 rounded-xl text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Observação opcional */}
          <div>
            <label className="block text-xs font-medium text-neutral-300 mb-1.5">
              Observação (Opcional)
            </label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Pago no Pix, dividido com a galera"
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
                <span>{transactionToEdit ? 'Salvar Alterações' : 'Salvar Movimentação (+20 XP)'}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
