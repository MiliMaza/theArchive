import React from 'react';
import { ArrowUp, Trophy, Globe, Lock, Shield } from 'lucide-react';
import { playerProfile } from '../../data/player';
import { seasonsData } from '../../data/seasons';

interface FooterProps {
  onNavigate: (view: string, seasonId?: string) => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenAdmin }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#0a0a0a] border-t border-white/10 text-white pt-16 pb-12 px-6 sm:px-12 z-20">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 pb-16 border-b border-white/10">
          {/* Brand Col */}
          <div className="md:col-span-5 space-y-4">
            <div className="flex flex-col">
              <span className="font-display font-black text-3xl uppercase tracking-tighter text-white">
                {playerProfile.lastName}
              </span>
              <span className="text-[10px] tracking-[0.4em] uppercase text-white/40 mt-1 font-mono-code">
                Professional Basketball Career Archive
              </span>
            </div>

            <p className="font-serif-editorial text-lg italic text-white/70 max-w-sm leading-relaxed">
              "{playerProfile.tagline}"
            </p>

            <div className="flex items-center gap-2 pt-2 text-xs font-mono-code text-white/40">
              <span>{playerProfile.careerSpan}</span>
              <span>•</span>
              <span>6 Seasons</span>
              <span>•</span>
              <span>4,192 Points</span>
            </div>
          </div>

          {/* Chapters Col */}
          <div className="md:col-span-4 space-y-3">
            <div className="text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-widest mb-2">
              Career Chapters
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-mono-code">
              {seasonsData.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onNavigate('career', s.id)}
                  className="text-left text-white/60 hover:text-[#FF5D22] transition-colors truncate cursor-pointer"
                >
                  <span className="text-white/40 mr-1.5">{s.id}</span>
                  <span>{s.teamShort}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Col */}
          <div className="md:col-span-3 space-y-3">
            <div className="text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-widest mb-2">
              Navigation
            </div>
            <div className="flex flex-col gap-2 text-xs font-mono-code text-white/70">
              <button
                onClick={() => onNavigate('home')}
                className="text-left hover:text-white transition-colors cursor-pointer"
              >
                Portfolio Home
              </button>
              <button
                onClick={() => onNavigate('career')}
                className="text-left hover:text-white transition-colors cursor-pointer"
              >
                Full Career & Timeline
              </button>
              <button
                onClick={() => onNavigate('memories')}
                className="text-left hover:text-white transition-colors cursor-pointer"
              >
                Personal Archives
              </button>
              <button
                onClick={() => onNavigate('stats')}
                className="text-left hover:text-white transition-colors cursor-pointer"
              >
                Analytics & Records
              </button>
              <button
                onClick={() => onNavigate('about')}
                className="text-left hover:text-white transition-colors cursor-pointer"
              >
                Athlete Identity & Bio
              </button>
              <button
                onClick={onOpenAdmin}
                className="text-left text-[#FF5D22] hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer pt-2"
              >
                <Lock className="w-3 h-3" />
                <span>Private Vault</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Sub-footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-code text-white/40">
          <div>
            © {new Date().getFullYear()} Maya Vance. All Career Data & Archival Media Protected.
          </div>

          <button
            onClick={scrollToTop}
            className="flex items-center gap-2 text-white/70 hover:text-[#FF5D22] transition-colors cursor-pointer"
          >
            <span>Back to Top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};
