import React from 'react';

interface MarqueeBannerProps {
  variant?: 'light' | 'accent' | 'dark';
}

export const MarqueeBanner: React.FC<MarqueeBannerProps> = ({ variant = 'light' }) => {
  const bgClass =
    variant === 'light'
      ? 'bg-white text-black border-t border-white/10'
      : variant === 'accent'
      ? 'bg-[#FF5D22] text-black border-t border-black/20'
      : 'bg-[#141414] text-white/90 border-t border-white/10';

  const items = [
    'ALL-EUROPEAN FIRST TEAM 2021',
    'LIGA ACB CHAMPION',
    '32.0 PLAYER EFFICIENCY RATING',
    'JAPAN B.LEAGUE ALL-STAR',
    'NBL GRAND FINAL MVP',
    'EMPEROR CUP CHAMPION',
    '4,192 CAREER POINTS',
    '6 SEASONS GLOBAL JOURNEY',
    'LEADERS CUP MVP FRANCE',
    'GREEK CUP MVP',
  ];

  return (
    <div className={`h-12 ${bgClass} flex items-center overflow-hidden z-20 select-none`}>
      <div className="animate-marquee whitespace-nowrap font-black uppercase text-xs tracking-tighter items-center gap-12 font-display">
        {items.concat(items).map((text, idx) => (
          <React.Fragment key={idx}>
            <span className="hover:opacity-75 transition-opacity cursor-default">{text}</span>
            <span className="opacity-40">•</span>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};
