import React from 'react';
import { useCareer } from '../../context/CareerContext';

export const MarqueeBanner: React.FC = () => {
  const { seasons, totalCareerPoints, totalCareerAssists, totalCareerGames } = useCareer();

  const getNumberWord = (n: number) => {
    const words = ['', 'ONE', 'TWO', 'THREE', 'FOUR', 'FIVE', 'SIX', 'SEVEN', 'EIGHT', 'NINE', 'TEN', 'ELEVEN', 'TWELVE', 'THIRTEEN', 'FOURTEEN', 'FIFTEEN'];
    return words[n] || `${n}`;
  };

  const trophiesCount = seasons.reduce((acc, s) => {
    return acc + s.results.filter((r) => r.isTrophy || r.stage === 'Champion').length;
  }, 0);

  const uniqueCountriesCount = new Set(seasons.map((s) => s.country.split('/')[0].trim())).size;
  const uniqueCities = Array.from(new Set(seasons.map((s) => s.city.toUpperCase()))).join(' • ');

  const ppgAvg = totalCareerGames > 0 ? (totalCareerPoints / totalCareerGames).toFixed(1) : '15.2';
  const apgAvg = totalCareerGames > 0 ? (totalCareerAssists / totalCareerGames).toFixed(1) : '6.8';

  const words = [
    `${getNumberWord(seasons.length)} PROFESSIONAL SEASONS`,
    `${trophiesCount}× CHAMPIONSHIP TITLES`,
    `${uniqueCountriesCount} COUNTRIES REPRESENTED`,
    'POINT GUARD / FLOOR GENERAL',
    `${ppgAvg} PPG • ${apgAvg} APG CAREER`,
    uniqueCities || 'TOKYO • SYDNEY • MADRID • ATHENS • LYON • SPOKANE',
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
