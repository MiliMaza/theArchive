import React from 'react';

export const MarqueeBanner: React.FC = () => {
  const words = [
    'SIX PROFESSIONAL SEASONS',
    '3× CONTINENTAL CHAMPION',
    '5 COUNTRIES REPRESENTED',
    'POINT GUARD / FLOOR GENERAL',
    '15.2 PPG • 6.8 APG CAREER',
    'TOKYO • SYDNEY • MADRID • ATHENS • LYON • SPOKANE',
    'MAYA VANCE #7',
  ];

  return (
    <div className="w-full bg-[#FF5D22] text-black py-2.5 overflow-hidden border-y border-black/20 select-none">
      <div className="flex whitespace-nowrap animate-marquee">
        {[...words, ...words, ...words].map((item, idx) => (
          <div key={idx} className="flex items-center mx-4 font-mono-code text-xs uppercase font-black tracking-widest">
            <span>{item}</span>
            <span className="ml-8 text-black/50">•</span>
          </div>
        ))}
      </div>
    </div>
  );
};
