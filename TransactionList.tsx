import React, { useState, useMemo } from 'react';
import { Transaction } from './types.ts';
import { formatCurrency, formatDate, CATEGORY_LABELS } from './formatters.ts';
import {
  Search,
  Filter,
  Plus,
  Trash2,
  Edit2,
  Download,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';

interface TransactionListProps {
  transactions: Transaction[];
  onOpenAddModal: () => void;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteTransaction: (id: string) => Promise<void>;
}

export const TransactionList: React.FC<TransactionListProps> = ({
  transactions,
  onOpenAddModal,
  onEditTransaction,
  onDeleteTransaction,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [periodFilter, setPeriodFilter] = useState<'month' | '7days' | 'all'>('month');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredTransactions = useMemo(() => {
    const today = new Date();
    const currentMonth = today.toISOString().slice(0, 7);

    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const sevenDaysStr = sevenDaysAgo.toISOString().split('T')[0];

    return transactions.filter((t) => {
      // Search term
      if (
        searchTerm &&
        !t.description.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !t.notes?.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false;
      }

      // Type filter
      if (typeFilter !== 'all' && t.type !== typeFilter) {
        return false;
      }

      // Category filter
      if (categoryFilter !== 'all' && t.category !== categoryFilter) {
        return false;
      }

      // Period filter
      if (periodFilter === 'month' && !t.date.startsWith(currentMonth)) {
        return false;
      }
      if (periodFilter === '7days' && t.date < sevenDaysStr) {
        return false;
      }

      return true;
    });
  }, [transactions, searchTerm, typeFilter, categoryFilter, periodFilter]);

  const exportCSV = () => {
    if (filteredTransactions.length === 0) return;

    const headers = ['Data', 'Tipo', 'Categoria', 'Descrição', 'Valor (R$)', 'Observações'];
    const rows = filteredTransactions.map((t) => [
      t.date,
      t.type === 'income' ? 'Entrada' : 'Saída',
      CATEGORY_LABELS[t.category]?.label || t.category,
      `"${t.description.replace(/"/g, '""')}"`,
      t.amount.toFixed(2),
      `"${(t.notes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `granaxp_movimentacoes_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta movimentação?')) {
      setDeletingId(id);
      try {
        await onDeleteTransaction(id);
      } finally {
        setDeletingId(null);
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display font-black text-2xl text-white">Extrato de Movimentações</h2>
          <p className="text-xs text-neutral-400">
            Histórico completo de entradas, despesas e investimentos cadastrados.
          </p>
        </div>

        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            onClick={exportCSV}
            title="Exportar dados em formato CSV para Excel/Google Planilhas"
            className="flex-1 sm:flex-initial px-3.5 py-2 text-xs font-semibold rounded-xl bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 transition-colors flex items-center justify-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={onOpenAddModal}
            className="flex-1 sm:flex-initial px-4 py-2 text-xs font-bold rounded-xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 shadow-md shadow-emerald-500/20 transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Adicionar</span>
          </button>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="p-4 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Search */}
          <div className="relative">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Buscar por descrição..."
              className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Type Filter */}
          <div className="flex bg-neutral-950 border border-neutral-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setTypeFilter('all')}
              className={`flex-1 py-1 rounded-lg font-medium transition-colors ${
                typeFilter === 'all'
                  ? 'bg-neutral-800 text-white font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setTypeFilter('income')}
              className={`flex-1 py-1 rounded-lg font-medium transition-colors ${
                typeFilter === 'income'
                  ? 'bg-emerald-500 text-neutral-950 font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Entradas
            </button>
            <button
              onClick={() => setTypeFilter('expense')}
              className={`flex-1 py-1 rounded-lg font-medium transition-colors ${
                typeFilter === 'expense'
                  ? 'bg-rose-500 text-white font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Saídas
            </button>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
            >
              <option value="all">Todas as Categorias</option>
              {Object.entries(CATEGORY_LABELS).map(([k, v]) => (
                <option key={k} value={k}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          {/* Period Filter */}
          <div className="flex bg-neutral-950 border border-neutral-800 rounded-xl p-1 text-xs">
            <button
              onClick={() => setPeriodFilter('month')}
              className={`flex-1 py-1 rounded-lg font-medium transition-colors ${
                periodFilter === 'month'
                  ? 'bg-neutral-800 text-white font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Este Mês
            </button>
            <button
              onClick={() => setPeriodFilter('7days')}
              className={`flex-1 py-1 rounded-lg font-medium transition-colors ${
                periodFilter === '7days'
                  ? 'bg-neutral-800 text-white font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              7 Dias
            </button>
            <button
              onClick={() => setPeriodFilter('all')}
              className={`flex-1 py-1 rounded-lg font-medium transition-colors ${
                periodFilter === 'all'
                  ? 'bg-neutral-800 text-white font-bold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Tudo
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Table */}
      <div className="rounded-2xl bg-neutral-900/60 border border-neutral-800 overflow-hidden">
        {filteredTransactions.length === 0 ? (
          <div className="text-center py-16 text-neutral-500 text-xs space-y-2">
            <p>Nenhuma movimentação encontrada para os filtros selecionados.</p>
            <button
              onClick={onOpenAddModal}
              className="px-4 py-2 rounded-xl bg-emerald-400/10 text-emerald-400 font-bold hover:bg-emerald-400/20 transition-colors"
            >
              Cadastrar Movimentação
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950/60 border-b border-neutral-800 text-neutral-400 font-semibold">
                <tr>
                  <th className="py-3 px-4">Tipo</th>
                  <th className="py-3 px-4">Descrição</th>
                  <th className="py-3 px-4">Categoria</th>
                  <th className="py-3 px-4">Data</th>
                  <th className="py-3 px-4 text-right">Valor</th>
                  <th className="py-3 px-4 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {filteredTransactions.map((tx) => {
                  const cat = CATEGORY_LABELS[tx.category] || CATEGORY_LABELS.outros;
                  return (
                    <tr key={tx.id} className="hover:bg-neutral-800/30 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap">
                        {tx.type === 'income' ? (
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-bold">
                            <ArrowUpRight className="w-3.5 h-3.5" />
                            <span>Entrada</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-rose-400 font-bold">
                            <ArrowDownRight className="w-3.5 h-3.5" />
                            <span>Saída</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-medium text-white max-w-[250px] truncate">
                        {tx.description}
                        {tx.notes && (
                          <span className="block text-[10px] text-neutral-500 truncate">{tx.notes}</span>
                        )}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-medium ${cat.color}`}>
                          {cat.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-neutral-400 font-mono whitespace-nowrap">
                        {formatDate(tx.date)}
                      </td>
                      <td
                        className={`py-3 px-4 text-right font-mono font-bold whitespace-nowrap ${
                          tx.type === 'income' ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {tx.type === 'income' ? '+' : '-'}
                        {formatCurrency(tx.amount)}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap space-x-1">
                        <button
                          onClick={() => onEditTransaction(tx)}
                          title="Editar"
                          className="p-1.5 text-neutral-400 hover:text-white hover:bg-neutral-800 rounded-lg transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(tx.id)}
                          disabled={deletingId === tx.id}
                          title="Excluir"
                          className="p-1.5 text-neutral-400 hover:text-rose-400 hover:bg-neutral-800 rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
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
