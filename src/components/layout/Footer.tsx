import React from 'react';
import { ArrowUp, Lock, Globe, Instagram, Twitter, Mail, Award, Sun, Moon } from 'lucide-react';
import { playerProfile } from '../../data/player';
import { useTheme } from '../../context/ThemeContext';

interface FooterProps {
  onOpenVault: () => void;
  onNavigate: (view: 'home' | 'career' | 'memories' | 'stats' | 'about') => void;
  onSelectSeason: (seasonId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenVault, onNavigate, onSelectSeason }) => {
  const { theme, toggleTheme } = useTheme();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-theme-panel border-t border-theme-subtle text-theme-main transition-colors duration-300">
      {/* Top Banner with Big Statement */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 border-b border-theme-subtle pb-16">
          {/* Big Editorial Callout */}
          <div className="lg:col-span-6 space-y-4">
            <span className="text-[10px] font-mono-code text-[#FF5D22] tracking-[0.3em] uppercase block">
              Official Basketball Career Archive
            </span>
            <h2 className="text-4xl sm:text-5xl font-black font-display tracking-tight uppercase text-theme-main">
              {playerProfile.name}
            </h2>
            <p className="font-serif-editorial text-xl italic text-theme-muted max-w-md leading-relaxed">
              "{playerProfile.tagline}"
            </p>
            <div className="pt-4 flex items-center gap-3">
              <button
                onClick={onOpenVault}
                className="flex items-center gap-2 px-4 py-2 bg-theme-subtle hover:bg-[#FF5D22] text-theme-main hover:text-black border border-theme-subtle text-xs font-mono-code font-bold uppercase tracking-wider transition-colors cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Admin Vault & Audit</span>
              </button>

              <button
                onClick={toggleTheme}
                className="flex items-center gap-2 px-4 py-2 bg-theme-subtle hover:bg-theme-main text-theme-main hover:text-theme-canvas border border-theme-subtle text-xs font-mono-code uppercase tracking-wider transition-colors cursor-pointer"
                title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
              >
                {theme === 'dark' ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-indigo-500" />}
                <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
              </button>
            </div>
          </div>

          {/* Quick Navigation Links */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-[10px] font-mono-code text-theme-faint uppercase tracking-widest block">
              Sections
            </span>
            <ul className="space-y-2 text-xs font-mono-code uppercase tracking-wider">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="text-theme-muted hover:text-[#FF5D22] transition-colors cursor-pointer"
                >
                  00 // Home Index
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('career')}
                  className="text-theme-muted hover:text-[#FF5D22] transition-colors cursor-pointer"
                >
                  01 // Career Timeline
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('memories')}
                  className="text-theme-muted hover:text-[#FF5D22] transition-colors cursor-pointer"
                >
                  02 // Curated Memories
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('stats')}
                  className="text-theme-muted hover:text-[#FF5D22] transition-colors cursor-pointer"
                >
                  03 // Analytics Matrix
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('about')}
                  className="text-theme-muted hover:text-[#FF5D22] transition-colors cursor-pointer"
                >
                  04 // Profile & Philosophy
                </button>
              </li>
            </ul>
          </div>

          {/* Six Seasons Jump */}
          <div className="lg:col-span-3 space-y-3">
            <span className="text-[10px] font-mono-code text-theme-faint uppercase tracking-widest block">
              Six Seasons Directory
            </span>
            <ul className="space-y-1.5 text-xs font-mono-code">
              {['06', '05', '04', '03', '02', '01'].map((num) => (
                <li key={num}>
                  <button
                    onClick={() => onSelectSeason(num)}
                    className="text-theme-muted hover:text-[#FF5D22] transition-colors cursor-pointer flex items-center justify-between w-full"
                  >
                    <span>Season {num}</span>
                    <span className="text-[10px] text-theme-faint">
                      {num === '06' ? 'Tokyo Alvark' : num === '05' ? 'Sydney Kings' : num === '04' ? 'Real Madrid' : num === '03' ? 'Panathinaikos' : num === '02' ? 'ASVEL Villeurbanne' : 'Gonzaga / Rookie'}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono-code text-theme-faint">
          <div>
            © {new Date().getFullYear()} {playerProfile.name} Career Portfolio. All rights reserved.
          </div>

          <div className="flex items-center gap-6">
            <span>FIBA / EuroLeague / B.League Certified</span>
            <button
              onClick={scrollToTop}
              className="flex items-center gap-1.5 text-theme-main hover:text-[#FF5D22] transition-colors cursor-pointer"
            >
              <span>Back to top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
