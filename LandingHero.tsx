import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Zap,
  TrendingUp,
  Award,
  CheckCircle2,
  Gamepad2,
  Lock,
} from 'lucide-react';

interface LandingHeroProps {
  onOpenAuth: (mode: 'login' | 'register') => void;
  onScrollToSimulator: () => void;
  onScrollToInvestments: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({
  onOpenAuth,
  onScrollToSimulator,
  onScrollToInvestments,
}) => {
  return (
    <div className="relative overflow-hidden pt-8 pb-16 lg:pt-16 lg:pb-24">
      {/* Subtle neon gradient ambient background */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-emerald-500/10 blur-[130px] rounded-full pointer-events-none"
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Hero Header */}
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-semibold tracking-wide">
            <Zap className="w-3.5 h-3.5 fill-emerald-400" />
            <span>Plataforma 100% Gratuita · Feita para a Nova Geração</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1] text-balance">
            Sua grana. Seu jogo.{' '}
            <span className="bg-gradient-to-r from-emerald-400 via-lime-300 to-teal-300 bg-clip-text text-transparent">
              Seu próximo nível.
            </span>
          </h1>

          <p className="text-base sm:text-lg text-neutral-300 text-balance leading-relaxed">
            Abandone as planilhas chatas e apps complicados. No <strong className="text-white">GranaXP</strong>,
            cada real economizado vira experiência (XP), missões cumpridas, metas desbloqueadas e o início
            da sua jornada rumo aos investimentos de verdade.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onOpenAuth('register')}
              className="w-full sm:w-auto px-7 py-3.5 text-sm font-bold text-neutral-950 bg-emerald-400 hover:bg-emerald-300 rounded-xl shadow-lg shadow-emerald-500/25 transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Começar Agora (É Grátis)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onScrollToSimulator}
              className="w-full sm:w-auto px-6 py-3.5 text-sm font-semibold text-neutral-300 hover:text-white bg-neutral-900/80 hover:bg-neutral-800 border border-neutral-800 rounded-xl transition-all flex items-center justify-center gap-2"
            >
              <span>Testar Simulador sem Cadastro</span>
            </button>
          </div>

          {/* Trust badges */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Sem cartão de crédito</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-emerald-400" />
              <span>Privacidade Total & LGPD</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Gamepad2 className="w-4 h-4 text-emerald-400" />
              <span>Gamificação com Níveis Reais</span>
            </div>
          </div>
        </div>

        {/* Visual Interactive Dashboard Preview Showcase */}
        <div className="mt-12 lg:mt-16 relative mx-auto max-w-5xl rounded-2xl border border-neutral-800 bg-neutral-900/60 backdrop-blur-xl p-4 sm:p-6 shadow-2xl shadow-black/80">
          <div className="flex items-center justify-between pb-4 border-b border-neutral-800 text-xs text-neutral-400">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 font-mono text-[11px] text-neutral-500">granaxp.app/dashboard</span>
            </div>
            <div className="hidden sm:flex items-center gap-3">
              <span className="text-emerald-400 font-semibold flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Painel Ativo
              </span>
              <span>·</span>
              <span>Nível 3: Estrategista</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5">
            {/* Mock Stat Card 1: Saldo */}
            <div className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800/80 space-y-2">
              <div className="text-xs text-neutral-400 font-medium">Saldo Atual Disponível</div>
              <div className="font-display text-2xl sm:text-3xl font-extrabold text-white tabular-nums">
                R$ 1.840,50
              </div>
              <div className="flex items-center justify-between text-[11px] pt-1 border-t border-neutral-900">
                <span className="text-emerald-400 font-medium">+R$ 2.450,00 entradas</span>
                <span className="text-rose-400 font-medium">-R$ 609,50 saídas</span>
              </div>
            </div>

            {/* Mock Stat Card 2: XP & Level */}
            <div className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400 font-medium">Progresso de XP</span>
                <span className="text-emerald-400 font-bold font-mono">680 / 1.000 XP</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl">⚔️</span>
                <div>
                  <div className="font-display font-bold text-white text-base leading-none">
                    Nível 3 · Estrategista
                  </div>
                  <div className="text-[11px] text-neutral-400 mt-1">Faltam 320 XP para o Nível 4</div>
                </div>
              </div>
              <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-400 to-lime-400 h-full w-[68%]" />
              </div>
            </div>

            {/* Mock Stat Card 3: Meta em Andamento */}
            <div className="p-4 rounded-xl bg-neutral-950/70 border border-neutral-800/80 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-400 font-medium">Meta: Notebook Novo</span>
                <span className="text-amber-400 font-bold font-mono">75% Concluído</span>
              </div>
              <div className="font-display text-xl font-bold text-white tabular-nums">
                R$ 2.250 <span className="text-xs text-neutral-400 font-normal">/ R$ 3.000</span>
              </div>
              <div className="w-full bg-neutral-800 h-2 rounded-full overflow-hidden">
                <div className="bg-gradient-to-r from-amber-400 to-emerald-400 h-full w-[75%]" />
              </div>
              <div className="text-[11px] text-emerald-400 font-medium">+50 XP ao concluir esta meta!</div>
            </div>
          </div>
        </div>

        {/* Section: Gamification Level Roadmap */}
        <div id="niveis" className="mt-20 pt-10 border-t border-neutral-900">
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
            <h2 className="font-display text-2xl sm:text-3xl font-extrabold text-white">
              Sua Trilha de Evolução Financeira
            </h2>
            <p className="text-sm text-neutral-400">
              Cada hábito saudável que você cultiva rende XP. Não é sorte, é disciplina e conquista.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              {
                lvl: 1,
                name: 'Iniciante',
                xp: '0 - 199 XP',
                badge: '🌱',
                desc: 'Organiza as primeiras entradas e saídas do mês.',
                color: 'border-emerald-500/40 bg-emerald-500/5',
              },
              {
                lvl: 2,
                name: 'Explorador',
                xp: '200 - 499 XP',
                badge: '🧭',
                desc: 'Identifica para onde vai cada centavo e cria metas.',
                color: 'border-sky-500/40 bg-sky-500/5',
              },
              {
                lvl: 3,
                name: 'Estrategista',
                xp: '500 - 999 XP',
                badge: '⚔️',
                desc: 'Corta desperdícios e planeja o orçamento semanal.',
                color: 'border-purple-500/40 bg-purple-500/5',
              },
              {
                lvl: 4,
                name: 'Planejador',
                xp: '1000 - 1999 XP',
                badge: '🛡️',
                desc: 'Constrói reserva de emergência e entende renda fixa.',
                color: 'border-amber-500/40 bg-amber-500/5',
              },
              {
                lvl: 5,
                name: 'Mestre da Grana',
                xp: '2000+ XP',
                badge: '👑',
                desc: 'Domínio do dinheiro, investimentos e independência.',
                color: 'border-emerald-400 bg-emerald-400/10',
              },
            ].map((step) => (
              <div
                key={step.lvl}
                className={`p-4 rounded-xl border ${step.color} flex flex-col justify-between transition-transform hover:-translate-y-1`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{step.badge}</span>
                    <span className="text-[11px] font-mono font-bold text-neutral-400">Nível {step.lvl}</span>
                  </div>
                  <h3 className="font-display font-bold text-white text-base">{step.name}</h3>
                  <div className="text-[11px] font-mono text-emerald-400 mb-2">{step.xp}</div>
                  <p className="text-xs text-neutral-300 leading-snug">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
