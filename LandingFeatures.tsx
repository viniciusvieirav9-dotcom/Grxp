import React, { useState } from 'react';
import {
  ChevronDown,
  Sparkles,
  Gamepad2,
  TrendingUp,
  ShieldCheck,
  PiggyBank,
  Smartphone,
  Zap,
} from 'lucide-react';

export const LandingFeatures: React.FC = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'O GranaXP é realmente 100% gratuito?',
      a: 'Sim! Não existem planos "Premium", não há assinatura escondida e nunca pediremos cartão de crédito. Criamos o GranaXP como uma ferramenta comunitária e acessível para qualquer pessoa organizar sua grana.',
    },
    {
      q: 'Eu coloco dinheiro de verdade no GranaXP?',
      a: 'Não. O GranaXP é a sua central de inteligência, organização e gamificação financeira. Ele calcula seu saldo e rendimentos, mas você investe diretamente em corretoras e bancos autorizados pelo Banco Central (como NuInvest, Inter, Rico ou Tesouro Direto).',
    },
    {
      q: 'Preciso fornecer meu e-mail ou dados bancários?',
      a: 'De jeito nenhum! Respeitamos sua privacidade ao máximo. O cadastro exige apenas um nome de usuário e uma senha (que é salva criptografada com salt seguro no servidor).',
    },
    {
      q: 'Como funciona o sistema de XP e Níveis?',
      a: 'Cada boa atitude financeira gera experiência (XP): cadastrar entradas e saídas (+20 XP), criar metas (+40 XP), fazer aportes (+30 XP) e manter constância de dias seguidos. Você avança do nível Iniciante até o prestigiado título de Mestre da Grana.',
    },
    {
      q: 'Como colocar esse projeto no meu GitHub e publicar na Vercel?',
      a: 'Clique no botão "Baixar ZIP" no topo da página. Você receberá a pasta completa chamada "granaxp" com package.json, código-fonte e README explicativo para celular Android e computador. Em seguida, basta subir no GitHub e conectar na Vercel gratuitamente!',
    },
  ];

  return (
    <div id="como-funciona" className="py-16 border-t border-neutral-900 bg-neutral-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20">
        {/* Features Grid */}
        <div>
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="font-display text-3xl font-black text-white">
              Tudo o que Você Precisa para Jogar no Modo Pro
            </h2>
            <p className="text-sm text-neutral-400">
              Funcionalidades pensadas para quem quer controle sem perder a paciência.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <Gamepad2 className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-white">Gamificação com Níveis Reais</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Transforme o tédio de anotar gastos em um RPG financeiro. Níveis de Iniciante a Mestre da Grana, streaks diários e recompensas sem trapaças.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-sky-500/10 text-sky-400 flex items-center justify-center">
                <PiggyBank className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-white">Metas & Cofrinhos Visuais</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Notebook novo, viagem ou reserva de emergência? Crie metas com prazo, acompanhe a barra de progresso e comemore cada marco com chuva de confetes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-neutral-900/60 border border-neutral-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
                <TrendingUp className="w-5 h-5" />
              </div>
              <h3 className="font-display font-bold text-lg text-white">Guia de Investimentos Jovem</h3>
              <p className="text-xs text-neutral-300 leading-relaxed">
                Aprenda a diferença entre Tesouro Selic, CDB, FIIs e Ações de forma simples e descontraída. Descubra seu perfil com o quiz e saiba por onde começar.
              </p>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div id="faq" className="max-w-3xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h2 className="font-display text-2xl sm:text-3xl font-black text-white">
              Perguntas Frequentes (FAQ)
            </h2>
            <p className="text-xs text-neutral-400">
              Tire suas dúvidas sobre o GranaXP e a sua jornada financeira.
            </p>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div
                  key={idx}
                  className="rounded-2xl border border-neutral-800 bg-neutral-900/50 overflow-hidden transition-colors"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 text-left flex items-center justify-between gap-4 text-sm font-bold text-white hover:text-emerald-400 transition-colors"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      className={`w-4 h-4 text-neutral-400 transition-transform ${
                        isOpen ? 'rotate-180 text-emerald-400' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-4 pt-1 text-xs text-neutral-300 leading-relaxed border-t border-neutral-800/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
