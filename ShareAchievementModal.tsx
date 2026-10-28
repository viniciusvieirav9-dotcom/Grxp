import React, { useRef, useEffect, useState } from 'react';
import { useAuth } from './AuthContext.tsx';
import { getLevelData } from './formatters.ts';
import { X, Download, Share2, ShieldCheck, Sparkles, Check } from 'lucide-react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShareAchievementModal: React.FC<ShareModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [copied, setCopied] = useState(false);

  const levelData = user ? getLevelData(user.xp) : getLevelData(0);

  useEffect(() => {
    if (!isOpen || !canvasRef.current || !user) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Canvas size (Instagram Story 1080x1920 or Card 1080x1350)
    canvas.width = 800;
    canvas.height = 1000;

    // Background Dark Slate Gradient
    const bgGrad = ctx.createLinearGradient(0, 0, 0, 1000);
    bgGrad.addColorStop(0, '#09090b');
    bgGrad.addColorStop(0.5, '#121217');
    bgGrad.addColorStop(1, '#09090b');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, 800, 1000);

    // Glowing circle behind level
    const glowGrad = ctx.createRadialGradient(400, 420, 50, 400, 420, 320);
    glowGrad.addColorStop(0, 'rgba(16, 185, 129, 0.25)');
    glowGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
    ctx.fillStyle = glowGrad;
    ctx.fillRect(0, 0, 800, 1000);

    // Outer subtle border
    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 4;
    ctx.strokeRect(30, 30, 740, 940);

    // Header Logo
    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 36px Outfit, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('GranaXP', 400, 110);

    ctx.fillStyle = '#a1a1aa';
    ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Sua grana. Seu jogo. Seu próximo nível.', 400, 145);

    // Badge circle
    ctx.beginPath();
    ctx.arc(400, 380, 120, 0, Math.PI * 2);
    ctx.fillStyle = '#18181b';
    ctx.fill();
    ctx.strokeStyle = '#10b981';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Emoji in badge
    ctx.font = '90px sans-serif';
    ctx.fillText(levelData.badge, 400, 415);

    // Level Title
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 44px Outfit, sans-serif';
    ctx.fillText(`Nível ${levelData.level} · ${levelData.title}`, 400, 570);

    // User Name
    ctx.fillStyle = '#34d399';
    ctx.font = '600 26px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(user.displayName || user.username, 400, 620);

    // Stats Grid Box
    ctx.fillStyle = '#18181b';
    ctx.strokeStyle = '#27272a';
    ctx.lineWidth = 2;
    ctx.roundRect(100, 680, 600, 150, 20);
    ctx.fill();
    ctx.stroke();

    // Stat 1: Total XP
    ctx.fillStyle = '#a1a1aa';
    ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('TOTAL DE XP', 250, 735);

    ctx.fillStyle = '#10b981';
    ctx.font = 'bold 36px "JetBrains Mono", monospace';
    ctx.fillText(`${user.xp} XP`, 250, 785);

    // Stat 2: Streak
    ctx.fillStyle = '#a1a1aa';
    ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('CONSTÂNCIA', 550, 735);

    ctx.fillStyle = '#fbbf24';
    ctx.font = 'bold 36px "JetBrains Mono", monospace';
    ctx.fillText(`🔥 ${user.streak} DIAS`, 550, 785);

    // Footer info
    ctx.fillStyle = '#71717a';
    ctx.font = '500 16px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('Junte-se à nova geração cuidando das finanças no granaxp.app', 400, 890);

    ctx.fillStyle = '#52525b';
    ctx.font = '13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('🔒 Card seguro: saldos e valores confidenciais nunca são exibidos.', 400, 920);
  }, [isOpen, user, levelData]);

  if (!isOpen || !user) return null;

  const handleDownload = () => {
    if (!canvasRef.current) return;
    const link = document.createElement('a');
    link.download = `granaxp_conquista_${user.username}.png`;
    link.href = canvasRef.current.toDataURL('image/png');
    link.click();
  };

  const handleShare = async () => {
    if (!canvasRef.current) return;
    try {
      if (navigator.share && navigator.canShare) {
        canvasRef.current.toBlob(async (blob) => {
          if (!blob) return;
          const file = new File([blob], 'granaxp_conquista.png', { type: 'image/png' });
          if (navigator.canShare({ files: [file] })) {
            await navigator.share({
              title: 'Minha Conquista no GranaXP!',
              text: `Subi para o Nível ${levelData.level} (${levelData.title}) no GranaXP! Sua grana. Seu jogo. Seu próximo nível.`,
              files: [file],
            });
            return;
          }
        });
      }
    } catch {
      // Fallback to copy link
    }

    navigator.clipboard.writeText(
      `Conquistei o Nível ${levelData.level} (${levelData.title}) no GranaXP com ${user.xp} XP e ${user.streak} dias de constância! 🚀`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-md w-full p-6 relative shadow-2xl space-y-4 my-8">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-white p-1 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div>
          <h3 className="font-display font-black text-xl text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-emerald-400" />
            <span>Card de Conquista Oficial</span>
          </h3>
          <p className="text-xs text-neutral-400 mt-1">
            Gere uma imagem para postar no Instagram Stories, status do WhatsApp ou Twitter!
          </p>
        </div>

        {/* Canvas Preview Container */}
        <div className="rounded-xl overflow-hidden border border-neutral-800 bg-neutral-950 flex items-center justify-center">
          <canvas
            ref={canvasRef}
            className="w-full max-h-[360px] object-contain rounded-lg"
          />
        </div>

        {/* Privacy Note */}
        <div className="flex items-center gap-2 text-[11px] text-neutral-400 bg-neutral-950/60 p-2.5 rounded-xl border border-neutral-800">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>Garantia de Privacidade:</strong> Seus saldos, extratos ou despesas pessoais nunca aparecem nos cards compartilháveis.
          </span>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3 pt-2">
          <button
            onClick={handleDownload}
            className="py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs border border-neutral-700 transition-colors flex items-center justify-center gap-2"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Baixar Imagem</span>
          </button>

          <button
            onClick={handleShare}
            className="py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-neutral-950 font-bold text-xs transition-colors flex items-center justify-center gap-2"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Texto Copiado!</span>
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4" />
                <span>Compartilhar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
