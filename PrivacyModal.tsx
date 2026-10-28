import React from 'react';
import { X, ShieldCheck, Lock, EyeOff, UserCheck, Trash2 } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 relative shadow-2xl space-y-4 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-black text-xl text-white">Privacidade & LGPD</h3>
            <p className="text-xs text-neutral-400">
              Compromisso com a Lei Geral de Proteção de Dados (Lei nº 13.709/2018).
            </p>
          </div>
        </div>

        <div className="space-y-3 text-xs text-neutral-300 leading-relaxed max-h-[60vh] overflow-y-auto pr-1">
          <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>1. Seus Dados Financeiros São Estritamente Seus</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              O GranaXP não vende, não compartilha e não expõe seus saldos, despesas ou histórico com bancos, instituições financeiras ou anunciantes.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <EyeOff className="w-4 h-4 text-emerald-400" />
              <span>2. Sem Exigência de E-mail ou Dados Pessoais Sensíveis</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Para usar o GranaXP, você não precisa informar seu e-mail, CPF, telefone ou contas bancárias. Criamos um sistema por apelido e senha criptografada via bcrypt.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <Trash2 className="w-4 h-4 text-emerald-400" />
              <span>3. Direito de Exclusão Total e Permanente (Art. 18 LGPD)</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              A qualquer momento você pode acessar as configurações do seu perfil e clicar no botão "Excluir Minha Conta". Todos os registros, metas e sessões são apagados do banco de dados na mesma hora.
            </p>
          </div>

          <div className="p-3.5 rounded-xl bg-neutral-950/80 border border-neutral-800 space-y-1">
            <div className="font-bold text-white flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-emerald-400" />
              <span>4. Proteção nos Compartilhamentos</span>
            </div>
            <p className="text-[11px] text-neutral-400">
              Os cards gerados para Instagram e WhatsApp mostram apenas seu nível de jogo, sua constância de dias e seu XP. Valores de saldo e dinheiro NUNCA são mostrados.
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold text-xs transition-colors"
        >
          Entendido
        </button>
      </div>
    </div>
  );
};
