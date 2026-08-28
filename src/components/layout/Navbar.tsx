import React, { useState } from 'react';
import { Shield, Sparkles, Menu, X, Lock } from 'lucide-react';
import { playerProfile } from '../../data/player';

interface NavbarProps {
  currentView: string;
  onNavigate: (view: string, seasonId?: string) => void;
  isAdminOpen: boolean;
  onToggleAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  onNavigate,
  isAdminOpen,
  onToggleAdmin,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Portfolio' },
    { id: 'career', label: 'Career' },
    { id: 'memories', label: 'Archives' },
    { id: 'stats', label: 'Statistics' },
    { id: 'about', label: 'About' },
  ];

  return (
    <nav className="sticky top-0 z-50 h-20 flex items-center justify-between px-6 md:px-12 border-b border-white/10 bg-[#0F0F0F]/95 backdrop-blur-md">
      {/* Brand / Name */}
      <button
        onClick={() => onNavigate('home')}
        className="flex flex-col text-left group cursor-pointer focus:outline-none"
      >
        <span className="font-display font-black text-2xl tracking-tighter uppercase leading-none text-white group-hover:text-[#FF5D22] transition-colors">
          {playerProfile.lastName}
        </span>
        <span className="text-[10px] tracking-[0.4em] uppercase text-white/40 mt-1 font-mono-code">
          Professional Athlete
        </span>
      </button>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-8 lg:gap-12 text-[11px] uppercase tracking-[0.2em] font-semibold text-white/60">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`transition-all pb-1 cursor-pointer hover:text-white relative focus:outline-none ${
                isActive ? 'text-white border-b-2 border-[#FF5D22]' : ''
              }`}
            >
              {item.label}
              {isActive && (
                <span className="absolute -top-1 right-[-6px] w-1 h-1 rounded-full bg-[#FF5D22]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Action Area: Private Vault & Mobile Menu Trigger */}
      <div className="flex items-center gap-3">
        {/* Private Vault / Admin Toggle */}
        <button
          onClick={onToggleAdmin}
          title={isAdminOpen ? 'Close Private Vault' : 'Open Private Career Vault'}
          className={`h-9 px-3.5 rounded-full flex items-center gap-2 text-xs font-mono-code tracking-wider uppercase transition-all cursor-pointer border ${
            isAdminOpen
              ? 'bg-[#FF5D22] text-black border-[#FF5D22] font-bold shadow-[0_0_20px_rgba(255,93,34,0.4)]'
              : 'bg-white/5 hover:bg-white/10 text-white/80 border-white/10 hover:border-white/20'
          }`}
        >
          <Lock className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">{isAdminOpen ? 'Vault Active' : 'Vault'}</span>
        </button>

        {/* Geometric Menu Icon from Stitch */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden h-9 w-9 bg-white rounded-full flex items-center justify-center cursor-pointer relative hover:scale-105 active:scale-95 transition-transform"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? (
            <X className="w-5 h-5 text-black" />
          ) : (
            <div className="relative w-4 h-4 flex items-center justify-center">
              <div className="w-4 h-[2px] bg-black rotate-45 absolute"></div>
              <div className="w-4 h-[2px] bg-black -rotate-45 absolute"></div>
            </div>
          )}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-[#0F0F0F] border-b border-white/10 p-6 flex flex-col gap-4 md:hidden shadow-2xl z-50">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMobileMenuOpen(false);
              }}
              className={`text-left py-2.5 px-3 text-sm font-semibold tracking-[0.2em] uppercase transition-colors ${
                currentView === item.id
                  ? 'bg-white/5 text-[#FF5D22] border-l-2 border-[#FF5D22]'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              {item.label}
            </button>
          ))}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-white/40 font-mono-code">
            <span>6 PRO SEASONS</span>
            <span>4,192 CAREER PTS</span>
          </div>
        </div>
      )}
    </nav>
  );
};
