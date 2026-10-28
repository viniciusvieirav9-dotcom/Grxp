import React, { useState } from 'react';
import { useAuth } from './AuthContext.tsx';
import {
  TrendingUp,
  Shield,
  Building2,
  PieChart,
  HelpCircle,
  Sparkles,
  CheckCircle,
  ExternalLink,
  Coins,
  ChevronRight,
} from 'lucide-react';

interface InvestmentGuideProps {
  onOpenQuiz: () => void;
}

export const InvestmentGuide: React.FC<InvestmentGuideProps> = ({ onOpenQuiz }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'pilares' | 'comparador' | 'passo-a-passo'>('pilares');

  return (
    <section id="investimentos" className="py-16 bg-neutral-950 border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Educação Financeira Sem Economês</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-black text-white">
            Investimentos Descomplicados para Jovens
          </h2>
          <p className="text-sm sm:text-base text-neutral-300">
            Você <strong>não</strong> investe dinheiro por aqui (o GranaXP não custodia seu dinheiro nem cobra taxas).
            Nosso papel é te ensinar de verdade como o dinheiro se multiplica, o que vale a pena e onde começar com segurança.
          </p>

          <div className="pt-2 flex justify-center">
            <button
              onClick={onOpenQuiz}
              className="px-5 py-2.5 text-xs font-bold rounded-xl bg-gradient-to-r from-emerald-400 to-lime-300 text-neutral-950 hover:brightness-110 shadow-lg shadow-emerald-500/20 transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>{user?.investorProfile ? 'Refazer Quiz do Investidor' : 'Descobrir Meu Perfil de Investidor (+50 XP)'}</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab switcher */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex p-1 bg-neutral-900 border border-neutral-800 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setActiveTab('pilares')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'pilares'
                  ? 'bg-emerald-400 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Os 4 Tipos Principais
            </button>
            <button
              onClick={() => setActiveTab('comparador')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'comparador'
                  ? 'bg-emerald-400 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Poupança vs Tesouro / CDB
            </button>
            <button
              onClick={() => setActiveTab('passo-a-passo')}
              className={`px-4 py-2 rounded-lg transition-colors ${
                activeTab === 'passo-a-passo'
                  ? 'bg-emerald-400 text-neutral-950 shadow-sm'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Como Começar na Prática
            </button>
          </div>
        </div>

        {/* Tab 1: Pilares */}
        {activeTab === 'pilares' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* 1. Reserva de Emergência */}
            <div className="p-5 rounded-2xl bg-neutral-900/60 border border-emerald-500/30 flex flex-col justify-between space-y-4 relative overflow-hidden">
              <div className="absolute top-0 right-0 px-2.5 py-1 bg-emerald-400/20 text-emerald-400 text-[10px] font-bold rounded-bl-xl font-mono">
                1º PASSO OBRIGATÓRIO
              </div>
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Shield className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-lg text-white">Reserva de Emergência</h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  O escudo contra imprevistos (celular quebrar, emergência de saúde ou perda de renda).
                  Deve somar de <strong>3 a 6 meses</strong> do seu custo de vida.
                </p>
                <div className="text-xs space-y-1.5 pt-2 border-t border-neutral-800">
                  <div className="flex justify-between text-neutral-400">
                    <span>Onde guardar:</span>
                    <strong className="text-white">Tesouro Selic ou CDB 100% CDI</strong>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Liquidez:</span>
                    <strong className="text-emerald-400">Diária (saca na hora)</strong>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Risco:</span>
                    <strong className="text-emerald-400">Baixíssimo (Garantia FGC)</strong>
                  </div>
                </div>
              </div>
              <div className="text-[11px] font-medium text-emerald-400 bg-emerald-500/10 p-2 rounded-lg">
                💡 Regra de ouro: nunca invista em ações antes de ter sua reserva pronta!
              </div>
            </div>

            {/* 2. Renda Fixa */}
            <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-sky-500/20 text-sky-400 flex items-center justify-center">
                  <Coins className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-lg text-white">Renda Fixa Tradicional</h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Você empresta dinheiro a um banco ou ao governo federal e recebe de volta com juros combinados.
                  Previsível, seguro e rende muito mais que a poupança.
                </p>
                <div className="text-xs space-y-1.5 pt-2 border-t border-neutral-800">
                  <div className="flex justify-between text-neutral-400">
                    <span>Exemplos:</span>
                    <strong className="text-white">Tesouro IPCA+, LCIs e LCAs</strong>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Ideal para:</span>
                    <strong className="text-sky-400">Metas de 1 a 5 anos</strong>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Risco:</span>
                    <strong className="text-sky-400">Baixo</strong>
                  </div>
                </div>
              </div>
              <div className="text-[11px] font-medium text-neutral-400 bg-neutral-800/40 p-2 rounded-lg">
                LCIs e LCAs são 100% isentas de imposto de renda para pessoas físicas.
              </div>
            </div>

            {/* 3. FIIs - Fundos Imobiliários */}
            <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Building2 className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-lg text-white">Fundos Imobiliários (FIIs)</h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Você vira dono de pedacinhos de shoppings, galpões logísticos e hospitais.
                  O fundo aluga esses imóveis e repassa os aluguéis todo mês na sua conta bancária.
                </p>
                <div className="text-xs space-y-1.5 pt-2 border-t border-neutral-800">
                  <div className="flex justify-between text-neutral-400">
                    <span>Rendimento:</span>
                    <strong className="text-amber-400">Pingando todo mês (sem IR)</strong>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Valor mínimo:</span>
                    <strong className="text-white">A partir de R$ 10 por cota</strong>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Risco:</span>
                    <strong className="text-amber-400">Médio (preço oscila)</strong>
                  </div>
                </div>
              </div>
              <div className="text-[11px] font-medium text-amber-400/90 bg-amber-400/10 p-2 rounded-lg">
                É a forma mais acessível de ter renda passiva com imóveis sem comprar uma casa.
              </div>
            </div>

            {/* 4. Ações */}
            <div className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex flex-col justify-between space-y-4">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
                  <PieChart className="w-5 h-5" />
                </div>
                <h3 className="font-display font-bold text-lg text-white">Ações de Empresas</h3>
                <p className="text-xs text-neutral-300 leading-relaxed">
                  Torne-se sócio de gigantes como Vale, Nubank, Petrobras, Apple ou Google.
                  Quando a empresa cresce e lucra, você ganha dividendos e valorização.
                </p>
                <div className="text-xs space-y-1.5 pt-2 border-t border-neutral-800">
                  <div className="flex justify-between text-neutral-400">
                    <span>Horizonte:</span>
                    <strong className="text-purple-400">Longo Prazo (5+ anos)</strong>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Potencial:</span>
                    <strong className="text-white">Mais alto do mercado</strong>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Risco:</span>
                    <strong className="text-rose-400">Alto no curto prazo</strong>
                  </div>
                </div>
              </div>
              <div className="text-[11px] font-medium text-neutral-400 bg-neutral-800/40 p-2 rounded-lg">
                Não tente adivinhar o amanhã. Compre boas empresas e segure com paciência.
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Comparador Poupança vs CDB */}
        {activeTab === 'comparador' && (
          <div className="max-w-4xl mx-auto bg-neutral-900/60 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6">
            <h3 className="font-display font-bold text-xl text-white text-center">
              Por que deixar dinheiro na Poupança é perder poder de compra?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-300 text-center max-w-2xl mx-auto">
              A caderneta de poupança rende em média 6,17% ao ano e só paga juros no 'aniversário' do depósito (a cada 30 dias).
              Já um simples CDB 100% CDI rende cerca de 10,5% a.a. com liquidez diária e a mesma segurança!
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              {/* Poupança */}
              <div className="p-5 rounded-xl border border-rose-500/30 bg-rose-500/5 space-y-3">
                <div className="text-sm font-bold text-rose-400 uppercase tracking-wide">
                  ❌ Poupança Tradicional
                </div>
                <div className="font-display text-2xl font-black text-white">~6,17% ao ano</div>
                <ul className="text-xs text-neutral-300 space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="text-rose-400 font-bold">✕</span>
                    <span>Rendimento abaixo da maioria dos investimentos seguros.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-rose-400 font-bold">✕</span>
                    <span>Se sacar antes do dia 30, perde todo o rendimento do mês.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-rose-400 font-bold">✕</span>
                    <span>Muitas vezes empata com a inflação (você não enriquece).</span>
                  </li>
                </ul>
              </div>

              {/* CDB / Tesouro Selic */}
              <div className="p-5 rounded-xl border border-emerald-500/40 bg-emerald-500/10 space-y-3">
                <div className="text-sm font-bold text-emerald-400 uppercase tracking-wide">
                  ✅ Tesouro Selic / CDB 100% CDI
                </div>
                <div className="font-display text-2xl font-black text-white">~10,50% ao ano</div>
                <ul className="text-xs text-neutral-200 space-y-2">
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Rende quase <strong>70% a mais</strong> que a poupança todo ano.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Rendimento cai todo dia útil (sem pegadinha de dia de aniversário).</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-400" />
                    <span>Mesma proteção de até R$ 250 mil pelo FGC (Fundo Garantidor).</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: Passo a Passo */}
        {activeTab === 'passo-a-passo' && (
          <div className="max-w-4xl mx-auto space-y-4">
            {[
              {
                step: '01',
                title: 'Abra uma conta gratuita em uma corretora ou banco digital taxa zero',
                desc: 'Bancos e corretoras como Nubank, Banco Inter, Rico, Clear ou XP permitem abrir conta pelo celular em 5 minutos, sem taxa de manutenção e sem cobrar por investimentos.',
              },
              {
                step: '02',
                title: 'Defina suas primeiras metas financeiras no GranaXP',
                desc: 'Cadastre sua Meta de Reserva de Emergência no GranaXP. Ter um número exato para buscar traz foco e te ajuda a acompanhar seu progresso ganhando XP.',
              },
              {
                step: '03',
                title: 'Comece com pouco dinheiro (o hábito vale mais que o valor)',
                desc: 'Você não precisa de R$ 5.000 para começar. Com R$ 35 você já consegue comprar uma fração de Tesouro Selic. O mais importante é a disciplina mensal.',
              },
              {
                step: '04',
                title: 'Evite promessas milagrosas e esquemas de enriquecimento rápido',
                desc: 'Se alguém te prometer 10% ao mês garantido, é golpe. Investir de verdade é tijolo por tijolo com paciência, conhecimento e diversificação.',
              },
            ].map((s) => (
              <div
                key={s.step}
                className="p-5 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex items-start gap-4"
              >
                <div className="font-display font-black text-2xl text-emerald-400 font-mono shrink-0">
                  {s.step}
                </div>
                <div>
                  <h4 className="font-display font-bold text-base text-white mb-1">{s.title}</h4>
                  <p className="text-xs text-neutral-300 leading-relaxed">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
