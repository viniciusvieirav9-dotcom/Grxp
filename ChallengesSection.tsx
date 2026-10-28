import React from 'react';
import { useAuth } from './AuthContext.tsx';
import { Challenge } from './types.ts';
import { getLevelData } from './formatters.ts';
import {
  Trophy,
  Sparkles,
  CheckCircle,
  Flame,
  Target,
  Compass,
  Map,
  TrendingUp,
  Award,
} from 'lucide-react';

interface ChallengesSectionProps {
  challenges: Challenge[];
  onClaimReward: (id: string) => Promise<void>;
  onNavigateToTab: (tab: 'transactions' | 'goals' | 'investments') => void;
}

const ICON_MAP: Record<string, any> = {
  compass: Compass,
  map: Map,
  target: Target,
  'piggy-bank': Award,
  'trending-up': TrendingUp,
  flame: Flame,
};

export const ChallengesSection: React.FC<ChallengesSectionProps> = ({
  challenges,
  onClaimReward,
  onNavigateToTab,
}) => {
  const { user } = useAuth();
  const levelData = user ? getLevelData(user.xp) : getLevelData(0);

  const completedCount = challenges.filter((c) => c.completed).length;

  return (
    <div className="space-y-6">
      {/* Level Status Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-br from-neutral-900 via-neutral-900 to-neutral-950 border border-emerald-500/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-3xl shrink-0">
            {levelData.badge}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-display font-black text-2xl text-white">
                Nível {levelData.level} · {levelData.title}
              </h2>
            </div>
            <p className="text-xs text-neutral-400 mt-1 max-w-md">{levelData.description}</p>
          </div>
        </div>

        <div className="w-full md:w-64 space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-neutral-400 font-medium">Progresso de XP</span>
            <span className="font-mono text-emerald-400 font-bold">
              {user?.xp || 0} / {levelData.nextLevelXp} XP
            </span>
          </div>
          <div className="w-full bg-neutral-800 h-2.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-emerald-400 to-lime-400 h-full rounded-full transition-all duration-300"
              style={{ width: `${levelData.progressPercent}%` }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-neutral-500">
            <span>{completedCount} de {challenges.length} desafios feitos</span>
            <span className="text-emerald-400 font-mono">{levelData.progressPercent}%</span>
          </div>
        </div>
      </div>

      {/* Challenges List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-lg text-white flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-400" />
            <span>Missões & Desafios Disponíveis</span>
          </h3>
          <span className="text-xs text-neutral-400 font-mono">
            {completedCount}/{challenges.length} Concluídos
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {challenges.map((ch) => {
            const IconComponent = ICON_MAP[ch.icon] || Trophy;
            const isCompleted = ch.completed;

            return (
              <div
                key={ch.id}
                className={`p-5 rounded-2xl border transition-all flex items-start justify-between gap-4 ${
                  isCompleted
                    ? 'bg-neutral-900/40 border-neutral-800/80'
                    : 'bg-neutral-900/80 border-neutral-800 hover:border-emerald-500/40'
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      isCompleted
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : 'bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                        {ch.category}
                      </span>
                      {isCompleted && (
                        <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-400 font-mono">
                          <CheckCircle className="w-3 h-3" />
                          <span>Concluído</span>
                        </span>
                      )}
                    </div>
                    <h4 className="font-display font-bold text-base text-white">{ch.title}</h4>
                    <p className="text-xs text-neutral-400 mt-1 leading-snug">{ch.description}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="inline-block px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-mono font-bold whitespace-nowrap">
                    +{ch.xpReward} XP
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
