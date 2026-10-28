import React, { useState, useMemo } from 'react';
import { formatCurrency } from './formatters.ts';
import { Calculator, Sparkles, TrendingUp, HelpCircle, ArrowRight } from 'lucide-react';

interface SimulatorProps {
  onOpenAuth?: () => void;
}

export const PublicSimulator: React.FC<SimulatorProps> = ({ onOpenAuth }) => {
  const [initialAmount, setInitialAmount] = useState<number>(500);
  const [monthlyDeposit, setMonthlyDeposit] = useState<number>(200);
  const [years, setYears] = useState<number>(3);
  const [annualRate, setAnnualRate] = useState<number>(10.5); // 10.5% a.a. taxa CDI média
  const [monthlyExpense, setMonthlyExpense] = useState<number>(150);

  // Compound interest calculation
  const simulation = useMemo(() => {
    const totalMonths = years * 12;
    const monthlyRate = Math.pow(1 + annualRate / 100, 1 / 12) - 1;

    let balance = initialAmount;
    let totalDeposited = initialAmount;
    const points: { month: number; year: number; balance: number; deposited: number }[] = [];

    for (let m = 1; m <= totalMonths; m++) {
      balance = balance * (1 + monthlyRate) + monthlyDeposit;
      totalDeposited += monthlyDeposit;

      if (m % 6 === 0 || m === totalMonths) {
        points.push({
          month: m,
          year: Math.round((m / 12) * 10) / 10,
          balance: Math.round(balance),
          deposited: Math.round(totalDeposited),
        });
      }
    }

    const interestEarned = Math.max(0, balance - totalDeposited);

    return {
      totalMonths,
      finalBalance: balance,
      totalDeposited,
      interestEarned,
      points,
    };
  }, [initialAmount, monthlyDeposit, years, annualRate]);

  return (
    <section id="simulador" className="py-16 bg-neutral-900/40 border-y border-neutral-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
            <Calculator className="w-3.5 h-3.5" />
            <span>Simulador Financeiro Aberto ao Público</span>
          </div>
          <h2 className="font-display text-3xl font-black text-white">
            Descubra o Poder do Tempo na Sua Grana
          </h2>
          <p className="text-sm text-neutral-400">
            Veja como aportes consistentes, mesmo pequenos, se multiplicam com juros compostos.
            Funciona 100% no seu navegador, sem precisar de login.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Controls Form */}
          <div className="lg:col-span-5 bg-neutral-950/80 border border-neutral-800 rounded-2xl p-6 space-y-5">
            <h3 className="font-display font-bold text-lg text-white flex items-center justify-between">
              <span>Parâmetros da Simulação</span>
              <span className="text-xs font-mono text-emerald-400 font-normal">Calculadora Ao Vivo</span>
            </h3>

            {/* Valor Inicial */}
            <div>
              <div className="flex justify-between text-xs font-medium text-neutral-300 mb-1.5">
                <span>Valor Inicial que você tem hoje</span>
                <span className="font-mono text-emerald-400 font-bold">{formatCurrency(initialAmount)}</span>
              </div>
              <input
                type="range"
                min="0"
                max="10000"
                step="100"
                value={initialAmount}
                onChange={(e) => setInitialAmount(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
                <span>R$ 0</span>
                <span>R$ 5.000</span>
                <span>R$ 10.000</span>
              </div>
            </div>

            {/* Aporte Mensal */}
            <div>
              <div className="flex justify-between text-xs font-medium text-neutral-300 mb-1.5">
                <span>Quanto você consegue guardar todo mês</span>
                <span className="font-mono text-emerald-400 font-bold">{formatCurrency(monthlyDeposit)}</span>
              </div>
              <input
                type="range"
                min="20"
                max="3000"
                step="20"
                value={monthlyDeposit}
                onChange={(e) => setMonthlyDeposit(Number(e.target.value))}
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-neutral-500 mt-1">
                <span>R$ 20/mês</span>
                <span>R$ 1.500/mês</span>
                <span>R$ 3.000/mês</span>
              </div>
            </div>

            {/* Prazo em Anos */}
            <div>
              <div className="flex justify-between text-xs font-medium text-neutral-300 mb-1.5">
                <span>Tempo de Acumulação</span>
                <span className="font-mono text-emerald-400 font-bold">{years} {years === 1 ? 'ano' : 'anos'} ({years * 12} meses)</span>
              </div>
              <div className="grid grid-cols-4 gap-2">
                {[1, 2, 3, 5].map((y) => (
                  <button
                    key={y}
                    type="button"
                    onClick={() => setYears(y)}
                    className={`py-2 text-xs font-bold rounded-lg border transition-all ${
                      years === y
                        ? 'bg-emerald-400 text-neutral-950 border-emerald-400'
                        : 'bg-neutral-900 text-neutral-400 border-neutral-800 hover:text-white'
                    }`}
                  >
                    {y} {y === 1 ? 'Ano' : 'Anos'}
                  </button>
                ))}
              </div>
            </div>

            {/* Taxa Estimada Presets */}
            <div>
              <div className="flex justify-between text-xs font-medium text-neutral-300 mb-1.5">
                <span>Rentabilidade Anual Estimada</span>
                <span className="font-mono text-emerald-400 font-bold">{annualRate}% a.a.</span>
              </div>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setAnnualRate(6.17)}
                  className={`p-2 text-left rounded-lg border text-xs transition-all ${
                    annualRate === 6.17
                      ? 'bg-neutral-800 border-emerald-400 text-emerald-400'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <div className="font-bold">Poupança</div>
                  <div className="text-[10px] opacity-75">~6.17% a.a.</div>
                </button>
                <button
                  type="button"
                  onClick={() => setAnnualRate(10.5)}
                  className={`p-2 text-left rounded-lg border text-xs transition-all ${
                    annualRate === 10.5
                      ? 'bg-neutral-800 border-emerald-400 text-emerald-400'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <div className="font-bold">CDB / Selic</div>
                  <div className="text-[10px] opacity-75">~10.5% a.a.</div>
                </button>
                <button
                  type="button"
                  onClick={() => setAnnualRate(13.0)}
                  className={`p-2 text-left rounded-lg border text-xs transition-all ${
                    annualRate === 13.0
                      ? 'bg-neutral-800 border-emerald-400 text-emerald-400'
                      : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:text-neutral-200'
                  }`}
                >
                  <div className="font-bold">Carteira FIIs</div>
                  <div className="text-[10px] opacity-75">~13.0% a.a.</div>
                </button>
              </div>
            </div>
          </div>

          {/* Results Display */}
          <div className="lg:col-span-7 bg-neutral-950/80 border border-neutral-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider text-neutral-400">
                  Resultado Projetado ao Final de {years} {years === 1 ? 'Ano' : 'Anos'}
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-400/10 text-amber-400 border border-amber-400/20">
                  Simulação Teórica
                </span>
              </div>

              {/* Big final number */}
              <div className="mt-3">
                <div className="font-display text-4xl sm:text-5xl font-black text-white tabular-nums tracking-tight">
                  {formatCurrency(simulation.finalBalance)}
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  Se você guardar e investir disciplinadamente todos os meses.
                </p>
              </div>

              {/* Breakdown cards */}
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800/80">
                  <div className="text-xs text-neutral-400 mb-1">Total do Seu Bolso</div>
                  <div className="font-display text-xl font-bold text-neutral-200 tabular-nums">
                    {formatCurrency(simulation.totalDeposited)}
                  </div>
                  <div className="text-[11px] text-neutral-500 mt-1">Aportes acumulados</div>
                </div>

                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                  <div className="text-xs text-emerald-400 font-semibold mb-1 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Juros / Lucro Gerado</span>
                  </div>
                  <div className="font-display text-xl font-bold text-emerald-400 tabular-nums">
                    +{formatCurrency(simulation.interestEarned)}
                  </div>
                  <div className="text-[11px] text-emerald-300/80 mt-1">
                    Grana que trabalhou para você
                  </div>
                </div>
              </div>

              {/* Progress visual comparison */}
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-xs text-neutral-300">
                  <span>Composição do Saldo Final</span>
                  <span className="font-mono text-emerald-400">
                    {Math.round((simulation.interestEarned / simulation.finalBalance) * 100)}% gerado por juros!
                  </span>
                </div>
                <div className="h-3 w-full bg-neutral-900 rounded-full overflow-hidden flex">
                  <div
                    style={{
                      width: `${(simulation.totalDeposited / simulation.finalBalance) * 100}%`,
                    }}
                    className="bg-neutral-600 transition-all duration-300"
                    title="Total Depositado"
                  />
                  <div
                    style={{
                      width: `${(simulation.interestEarned / simulation.finalBalance) * 100}%`,
                    }}
                    className="bg-emerald-400 transition-all duration-300"
                    title="Rendimento de Juros"
                  />
                </div>
                <div className="flex items-center gap-4 text-[11px] text-neutral-400 pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-neutral-600" />
                    <span>Seu Dinheiro Guardado</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    <span>Rendimentos Obtidos</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA to start in GranaXP */}
            <div className="pt-4 border-t border-neutral-900 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs text-neutral-400 text-balance">
                Quer transformar esse valor em uma meta real no GranaXP e acompanhar o progresso ganhando XP?
              </p>
              {onOpenAuth && (
                <button
                  onClick={onOpenAuth}
                  className="w-full sm:w-auto px-4 py-2 text-xs font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-lg whitespace-nowrap transition-colors flex items-center justify-center gap-1.5"
                >
                  <span>Criar Meta no Jogo</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Legal / Disclaimer Notice */}
            <div className="text-[10px] text-neutral-500 leading-normal bg-neutral-900/40 p-2.5 rounded-lg border border-neutral-900">
              ⚠️ <strong>Aviso legal importante:</strong> Os valores exibidos neste simulador são meramente
              ilustrativos e têm objetivo exclusivamente educativo, considerando capitalização composta com taxas nominais.
              Não representam garantia de rentabilidade futura nem recomendação de investimento.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
