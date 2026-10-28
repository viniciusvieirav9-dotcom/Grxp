import React, { useState } from 'react';
import { useAuth } from './AuthContext.tsx';
import { Sparkles, X, Check, ArrowRight, Shield, TrendingUp, Award } from 'lucide-react';

interface QuizProps {
  isOpen: boolean;
  onClose: () => void;
}

const QUESTIONS = [
  {
    id: 1,
    question: 'Se você recebesse R$ 1.000 extras hoje, qual seria sua prioridade?',
    options: [
      { text: 'Guardar 100% em algo que não corra nenhum risco de diminuir', points: 1 },
      { text: 'Guardar a maior parte em renda fixa e uma fatia menor para render mais', points: 2 },
      { text: 'Investir tudo em ativos de maior retorno futuro, mesmo que oscilem hoje', points: 3 },
    ],
  },
  {
    id: 2,
    question: 'Como você se sente se ver seus investimentos caírem 5% em uma semana?',
    options: [
      { text: 'Perco o sono e sinto vontade de sacar tudo imediatamente', points: 1 },
      { text: 'Fico um pouco desconfortável, mas sei que oscilações fazem parte do jogo', points: 2 },
      { text: 'Vejo como oportunidade de comprar mais cotas com desconto', points: 3 },
    ],
  },
  {
    id: 3,
    question: 'Qual é o seu principal horizonte e meta financeira?',
    options: [
      { text: 'Ter segurança para imprevistos e emergências a qualquer instante', points: 1 },
      { text: 'Comprar um eletrônico, viagem ou meta nos próximos 1 a 3 anos', points: 2 },
      { text: 'Construir liberdade financeira e renda passiva para o longo prazo (5+ anos)', points: 3 },
    ],
  },
  {
    id: 4,
    question: 'Quanto você entende de investimentos hoje?',
    options: [
      { text: 'Estou aprendendo o básico agora (prefiro o caminho mais seguro)', points: 1 },
      { text: 'Já entendi o que é CDI e Selic e quero dar o próximo passo', points: 2 },
      { text: 'Gosto de estudar sobre empresas, dividendos e fundos imobiliários', points: 3 },
    ],
  },
];

export const InvestmentQuizModal: React.FC<QuizProps> = ({ isOpen, onClose }) => {
  const { user, token, refreshUser, celebrate } = useAuth();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [result, setResult] = useState<'conservador' | 'moderado' | 'arrojado' | null>(null);

  if (!isOpen) return null;

  const handleSelectOption = (points: number) => {
    const nextAnswers = [...answers, points];
    setAnswers(nextAnswers);

    if (currentStep + 1 < QUESTIONS.length) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate final score
      const totalPoints = nextAnswers.reduce((a, b) => a + b, 0);
      let calculatedProfile: 'conservador' | 'moderado' | 'arrojado' = 'conservador';

      if (totalPoints <= 6) {
        calculatedProfile = 'conservador';
      } else if (totalPoints <= 9) {
        calculatedProfile = 'moderado';
      } else {
        calculatedProfile = 'arrojado';
      }

      setResult(calculatedProfile);
      celebrate();

      // Submit to server if logged in
      if (token) {
        setIsSubmitting(true);
        fetch('/api/investments/quiz', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ profile: calculatedProfile }),
        })
          .then(() => refreshUser())
          .finally(() => setIsSubmitting(false));
      }
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers([]);
    setResult(null);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 relative shadow-2xl overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {!result ? (
          <div>
            {/* Header */}
            <div className="mb-6 space-y-1">
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Pergunta {currentStep + 1} de {QUESTIONS.length}</span>
              </div>
              <h3 className="font-display font-bold text-xl text-white">
                Quiz: Descubra Seu Perfil de Investidor
              </h3>
              <div className="w-full bg-neutral-800 h-1.5 rounded-full overflow-hidden mt-3">
                <div
                  className="bg-emerald-400 h-full transition-all duration-300"
                  style={{ width: `${((currentStep + 1) / QUESTIONS.length) * 100}%` }}
                />
              </div>
            </div>

            {/* Question */}
            <div className="mb-6">
              <p className="text-base text-white font-medium mb-4">
                {QUESTIONS[currentStep].question}
              </p>

              <div className="space-y-3">
                {QUESTIONS[currentStep].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(opt.points)}
                    className="w-full text-left p-4 rounded-xl bg-neutral-950/80 hover:bg-neutral-800/90 border border-neutral-800 hover:border-emerald-500/50 text-neutral-200 hover:text-white text-xs sm:text-sm font-medium transition-all flex items-center justify-between group"
                  >
                    <span>{opt.text}</span>
                    <ArrowRight className="w-4 h-4 text-neutral-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
                  </button>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-5 py-2">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-3xl">
              {result === 'conservador' && '🛡️'}
              {result === 'moderado' && '⚖️'}
              {result === 'arrojado' && '🚀'}
            </div>

            <div>
              <div className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400 mb-1">
                Seu Perfil Identificado
              </div>
              <h3 className="font-display font-black text-2xl text-white">
                {result === 'conservador' && 'Escudo de Ferro (Conservador)'}
                {result === 'moderado' && 'Equilibrista Ágil (Moderado)'}
                {result === 'arrojado' && 'Desbravador do Futuro (Arrojado)'}
              </h3>
              <p className="text-xs text-neutral-300 mt-2 max-w-sm mx-auto leading-relaxed">
                {result === 'conservador' &&
                  'Você valoriza estabilidade e paz de espírito. Seu foco deve ser blindar sua reserva de emergência no Tesouro Selic e CDBs 100% CDI antes de qualquer aventura.'}
                {result === 'moderado' &&
                  'Você equilibra proteção e crescimento. Pode dividir seu dinheiro entre renda fixa segura e começar a receber aluguéis mensais com Fundos Imobiliários.'}
                {result === 'arrojado' &&
                  'Você tem estômago forte e foco no longo prazo! Busca valorização acelerada através de ações de boas empresas e fundos imobiliários com horizonte de anos.'}
              </p>
            </div>

            {/* Suggested Allocation */}
            <div className="p-4 rounded-xl bg-neutral-950/80 border border-neutral-800 text-left space-y-3">
              <div className="text-xs font-bold text-neutral-400 uppercase tracking-wide">
                Sugestão Didática de Divisão da Grana
              </div>

              {result === 'conservador' && (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-white font-medium">85% Reserva & Renda Fixa (Selic/CDB)</span>
                    <span className="text-emerald-400 font-mono font-bold">85%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white font-medium">15% Tesouro IPCA (Proteção Inflação)</span>
                    <span className="text-sky-400 font-mono font-bold">15%</span>
                  </div>
                </div>
              )}

              {result === 'moderado' && (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-white font-medium">55% Renda Fixa & Reserva</span>
                    <span className="text-emerald-400 font-mono font-bold">55%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white font-medium">30% Fundos Imobiliários (FIIs)</span>
                    <span className="text-amber-400 font-mono font-bold">30%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white font-medium">15% Ações de Boas Empresas</span>
                    <span className="text-purple-400 font-mono font-bold">15%</span>
                  </div>
                </div>
              )}

              {result === 'arrojado' && (
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-white font-medium">25% Reserva de Segurança</span>
                    <span className="text-emerald-400 font-mono font-bold">25%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white font-medium">40% Ações & Fundos de Índice (ETFs)</span>
                    <span className="text-purple-400 font-mono font-bold">40%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white font-medium">35% Fundos Imobiliários (Renda Mensal)</span>
                    <span className="text-amber-400 font-mono font-bold">35%</span>
                  </div>
                </div>
              )}
            </div>

            {user && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-semibold">
                <Award className="w-4 h-4" />
                <span>+50 XP concedidos na sua conta!</span>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                onClick={handleReset}
                className="w-1/2 py-2.5 rounded-xl border border-neutral-800 text-xs font-semibold text-neutral-400 hover:text-white hover:bg-neutral-800 transition-colors"
              >
                Refazer Quiz
              </button>
              <button
                onClick={onClose}
                className="w-1/2 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold text-xs transition-colors"
              >
                Concluir
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
