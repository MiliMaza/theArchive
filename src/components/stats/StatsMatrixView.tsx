import React, { useState } from 'react';
import { Trophy, Flame, Activity, Zap, TrendingUp, Filter, ArrowUpRight } from 'lucide-react';
import { seasonsData } from '../../data/seasons';
import { playerProfile } from '../../data/player';

interface StatsMatrixViewProps {
  onSelectSeason: (seasonId: string) => void;
}

export const StatsMatrixView: React.FC<StatsMatrixViewProps> = ({ onSelectSeason }) => {
  const [activeMetric, setActiveMetric] = useState<'ppg' | 'apg' | 'rpg' | 'per'>('ppg');

  const maxValues = {
    ppg: 22,
    apg: 10,
    rpg: 6,
    per: 35,
  };

  return (
    <div className="w-full bg-[#0F0F0F] min-h-screen py-12 px-6 sm:px-12 text-white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 border-b border-white/10 pb-8">
          <div className="flex items-center gap-2 text-[10px] font-mono-code text-[#FF5D22] tracking-[0.3em] uppercase mb-2">
            <span>Career Analytics</span>
            <span>•</span>
            <span>Historical Breakdown</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight text-white uppercase mb-4">
            Statistics & Production
          </h1>
          <p className="font-serif-editorial text-xl italic text-white/60 max-w-2xl">
            A comprehensive look at six seasons of high-efficiency basketball across three continents.
          </p>
        </div>

        {/* High-Level Career Totals Banner */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12">
          <div className="p-6 bg-[#141414] border border-white/10 text-center">
            <div className="text-[10px] font-mono-code text-white/40 uppercase mb-1">Total Points</div>
            <div className="text-3xl sm:text-4xl font-black font-display text-white">
              {playerProfile.careerPoints.toLocaleString()}
            </div>
            <div className="text-[10px] text-[#FF5D22] font-mono-code mt-1">18.5 PPG Career</div>
          </div>

          <div className="p-6 bg-[#141414] border border-white/10 text-center">
            <div className="text-[10px] font-mono-code text-white/40 uppercase mb-1">Total Assists</div>
            <div className="text-3xl sm:text-4xl font-black font-display text-[#FF5D22]">
              {playerProfile.careerAssists.toLocaleString()}
            </div>
            <div className="text-[10px] text-white/60 font-mono-code mt-1">6.6 APG Career</div>
          </div>

          <div className="p-6 bg-[#141414] border border-white/10 text-center">
            <div className="text-[10px] font-mono-code text-white/40 uppercase mb-1">Games Played</div>
            <div className="text-3xl sm:text-4xl font-black font-display text-white">
              {playerProfile.careerGames}
            </div>
            <div className="text-[10px] text-white/60 font-mono-code mt-1">220 Started</div>
          </div>

          <div className="p-6 bg-[#141414] border border-white/10 text-center">
            <div className="text-[10px] font-mono-code text-white/40 uppercase mb-1">Total Rebounds</div>
            <div className="text-3xl sm:text-4xl font-black font-display text-white">
              {playerProfile.careerRebounds.toLocaleString()}
            </div>
            <div className="text-[10px] text-white/60 font-mono-code mt-1">4.9 RPG Career</div>
          </div>

          <div className="p-6 bg-[#141414] border border-white/10 text-center">
            <div className="text-[10px] font-mono-code text-white/40 uppercase mb-1">Championships</div>
            <div className="text-3xl sm:text-4xl font-black font-display text-white flex items-center justify-center gap-1.5">
              <span>{playerProfile.totalChampionships}</span>
              <Trophy className="w-5 h-5 text-[#FF5D22]" />
            </div>
            <div className="text-[10px] text-amber-400 font-mono-code mt-1">3 Gold Medals</div>
          </div>

          <div className="p-6 bg-[#141414] border border-white/10 text-center">
            <div className="text-[10px] font-mono-code text-white/40 uppercase mb-1">Clubs / Countries</div>
            <div className="text-3xl sm:text-4xl font-black font-display text-white">
              {playerProfile.totalClubs} / {playerProfile.totalCountries}
            </div>
            <div className="text-[10px] text-white/60 font-mono-code mt-1">USA, EU, Asia, AUS</div>
          </div>
        </div>

        {/* Interactive Metric Progression Graph */}
        <section className="bg-[#141414] border border-white/10 p-8 mb-12">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-white/10">
            <div>
              <span className="text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-[0.25em] block mb-1">
                Progression Engine
              </span>
              <h2 className="text-2xl font-black font-display uppercase tracking-tight text-white">
                Year-Over-Year Evolution
              </h2>
            </div>

            <div className="flex items-center gap-1 bg-black/40 p-1 border border-white/10">
              <button
                onClick={() => setActiveMetric('ppg')}
                className={`px-3 py-1.5 text-xs font-mono-code uppercase tracking-wider transition-colors cursor-pointer ${
                  activeMetric === 'ppg'
                    ? 'bg-[#FF5D22] text-black font-bold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Points (PPG)
              </button>
              <button
                onClick={() => setActiveMetric('apg')}
                className={`px-3 py-1.5 text-xs font-mono-code uppercase tracking-wider transition-colors cursor-pointer ${
                  activeMetric === 'apg'
                    ? 'bg-[#FF5D22] text-black font-bold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Assists (APG)
              </button>
              <button
                onClick={() => setActiveMetric('rpg')}
                className={`px-3 py-1.5 text-xs font-mono-code uppercase tracking-wider transition-colors cursor-pointer ${
                  activeMetric === 'rpg'
                    ? 'bg-[#FF5D22] text-black font-bold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Rebounds (RPG)
              </button>
              <button
                onClick={() => setActiveMetric('per')}
                className={`px-3 py-1.5 text-xs font-mono-code uppercase tracking-wider transition-colors cursor-pointer ${
                  activeMetric === 'per'
                    ? 'bg-[#FF5D22] text-black font-bold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                Efficiency (PER)
              </button>
            </div>
          </div>

          {/* Graphical Bar Progression */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 pt-4">
            {seasonsData.map((s) => {
              let value = 0;
              if (activeMetric === 'ppg') value = s.stats.pointsPerGame;
              if (activeMetric === 'apg') value = s.stats.assistsPerGame;
              if (activeMetric === 'rpg') value = s.stats.reboundsPerGame;
              if (activeMetric === 'per') value = s.stats.playerEfficiencyRating || 25;

              const max = maxValues[activeMetric];
              const pct = Math.min(100, Math.round((value / max) * 100));

              return (
                <div
                  key={s.id}
                  onClick={() => onSelectSeason(s.id)}
                  className="bg-black/40 border border-white/5 hover:border-[#FF5D22] p-5 flex flex-col justify-between group cursor-pointer transition-all"
                >
                  <div className="text-center mb-6">
                    <div className="text-xs font-mono-code text-[#FF5D22] font-bold">
                      {s.yearRange}
                    </div>
                    <div className="text-xs font-bold text-white font-display truncate mt-0.5">
                      {s.teamShort}
                    </div>
                  </div>

                  <div className="h-44 flex items-end justify-center py-2 relative">
                    <div className="w-12 bg-white/5 border border-white/10 relative overflow-hidden flex items-end h-full">
                      <div
                        style={{ height: `${pct}%` }}
                        className={`w-full transition-all duration-700 ${
                          s.isCurrentSeason
                            ? 'bg-[#FF5D22]'
                            : 'bg-white/80 group-hover:bg-[#FF5D22]'
                        }`}
                      />
                    </div>
                  </div>

                  <div className="text-center mt-4 pt-3 border-t border-white/10">
                    <div className="text-2xl font-black font-mono-code text-white">
                      {value}
                    </div>
                    <div className="text-[10px] font-mono-code text-white/40 uppercase">
                      Season {s.id}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* All-Time Career Highs Section */}
        <section className="bg-[#141414] border border-white/10 p-8">
          <div className="flex items-center gap-2 mb-6">
            <Flame className="w-5 h-5 text-[#FF5D22]" />
            <h3 className="text-2xl font-black font-display uppercase tracking-tight text-white">
              All-Time Single-Game Highs
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-black/40 border border-white/5">
              <div className="text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-widest mb-1">
                Points in a Game
              </div>
              <div className="text-4xl font-black font-display text-white mb-2">39 PTS</div>
              <div className="text-xs font-mono-code text-white/60">vs Chiba Jets • Jan 28, 2024</div>
              <div className="text-[10px] text-white/40 font-sans-body mt-1">3OT B.League classic</div>
            </div>

            <div className="p-6 bg-black/40 border border-white/5">
              <div className="text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-widest mb-1">
                Assists in a Game
              </div>
              <div className="text-4xl font-black font-display text-[#FF5D22] mb-2">18 AST</div>
              <div className="text-xs font-mono-code text-white/60">vs Sunrockers Shibuya • Dec 16, 2023</div>
              <div className="text-[10px] text-white/40 font-sans-body mt-1">Single-game league record</div>
            </div>

            <div className="p-6 bg-black/40 border border-white/5">
              <div className="text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-widest mb-1">
                Rebounds in a Game
              </div>
              <div className="text-4xl font-black font-display text-white mb-2">11 REB</div>
              <div className="text-xs font-mono-code text-white/60">vs Panathinaikos • Mar 14, 2021</div>
              <div className="text-[10px] text-white/40 font-sans-body mt-1">Part of 19-11-16 Triple-Double</div>
            </div>

            <div className="p-6 bg-black/40 border border-white/5">
              <div className="text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-widest mb-1">
                Steals in a Game
              </div>
              <div className="text-4xl font-black font-display text-white mb-2">7 STL</div>
              <div className="text-xs font-mono-code text-white/60">vs Brisbane Bullets • Nov 11, 2022</div>
              <div className="text-[10px] text-white/40 font-sans-body mt-1">Defensive lockdown clinic</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
