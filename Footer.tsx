import React from 'react';
import { Settings, Shield, Heart } from 'lucide-react';

interface FooterProps {
  onOpenAdmin: () => void;
  onOpenPrivacy: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenAdmin,
  onOpenPrivacy,
}) => {
  return (
    <footer className="mt-20 border-t border-neutral-900 bg-neutral-950 text-neutral-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & Slogan */}
          <div className="text-center md:text-left space-y-1">
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="font-display font-black text-white text-base">
                Grana<span className="text-emerald-400">XP</span>
              </span>
              <span className="text-neutral-600">·</span>
              <span className="text-neutral-400 font-medium">
                “Sua grana. Seu jogo. Seu próximo nível.”
              </span>
            </div>
            <p className="text-[11px] text-neutral-500">
              Plataforma 100% gratuita de organização financeira com gamificação e educação descomplicada.
            </p>
          </div>

          {/* Links & LGPD info */}
          <div className="flex flex-wrap items-center justify-center gap-5 text-xs text-neutral-400">
            <button
              onClick={onOpenPrivacy}
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Privacidade & LGPD</span>
            </button>
          </div>

          {/* Discreet Admin Gear Icon */}
          <div className="flex items-center gap-3">
            <span className="text-[11px] text-neutral-600">
              © {new Date().getFullYear()} GranaXP
            </span>
            <button
              onClick={onOpenAdmin}
              title="Acesso Administrativo"
              aria-label="Acesso Administrativo"
              className="p-1.5 text-neutral-700 hover:text-neutral-400 rounded-lg transition-colors focus:outline-none"
            >
              <Settings className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
