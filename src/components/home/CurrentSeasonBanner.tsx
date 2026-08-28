import React from 'react';
import { ArrowRight, Trophy, Flame, Activity, ShieldCheck, MapPin } from 'lucide-react';
import { seasonsData } from '../../data/seasons';

interface CurrentSeasonBannerProps {
  onSelectSeason: (seasonId: string) => void;
}

export const CurrentSeasonBanner: React.FC<CurrentSeasonBannerProps> = ({ onSelectSeason }) => {
  const currentSeason = seasonsData.find((s) => s.isCurrentSeason) || seasonsData[5];

  return (
    <section className="w-full border-b border-white/10 bg-[#121212] px-6 sm:px-12 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-white/10 gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono-code text-[#FF5D22] tracking-[0.3em] uppercase mb-2">
              <span className="w-2 h-2 rounded-full bg-[#FF5D22] animate-ping" />
              <span>Active Campaign</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-white uppercase">
              Season 06 Spotlight — Tokyo Alvark
            </h2>
          </div>

          <button
            onClick={() => onSelectSeason(currentSeason.id)}
            className="inline-flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-[#FF5D22] hover:text-white transition-colors cursor-pointer"
          >
            <span>Open Complete Season File</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Card Left: Identity & Hero Visual */}
          <div className="lg:col-span-5 bg-[#171717] border border-white/10 p-8 flex flex-col justify-between relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
            <img
              src={currentSeason.heroImage}
              alt={currentSeason.team}
              className="absolute inset-0 w-full h-full object-cover grayscale opacity-30 group-hover:scale-105 transition-transform duration-700"
            />

            <div className="relative z-20">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-mono-code bg-[#FF5D22] text-black px-2.5 py-1 font-bold uppercase tracking-widest">
                  #7 Point Guard
                </span>
                <span className="text-xs font-mono-code text-white/70 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#FF5D22]" />
                  <span>Tokyo, Japan</span>
                </span>
              </div>

              <h3 className="text-3xl font-black font-display uppercase tracking-tight text-white mb-2">
                {currentSeason.team}
              </h3>
              <p className="text-xs text-white/60 uppercase tracking-widest font-mono-code">
                {currentSeason.league} • B1 Division
              </p>
            </div>

            <div className="relative z-20 pt-16 space-y-4">
              <div className="p-4 bg-black/60 backdrop-blur-md border border-white/10">
                <div className="text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                  <Trophy className="w-3.5 h-3.5" />
                  <span>Silverware Achieved</span>
                </div>
                <div className="text-sm font-bold text-white">
                  2024 Emperor Cup National Champions (MVP)
                </div>
              </div>

              <p className="text-xs text-white/70 font-serif-editorial italic leading-relaxed">
                "{currentSeason.narrative.tagline}"
              </p>
            </div>
          </div>

          {/* Card Right: Statistical Engine & Shooting Splits */}
          <div className="lg:col-span-7 bg-[#171717] border border-white/10 p-8 flex flex-col justify-between">
            <div>
              <div className="text-[10px] font-mono-code text-white/40 uppercase tracking-[0.25em] mb-6 pb-3 border-b border-white/10 flex justify-between items-center">
                <span>Official Production Splits</span>
                <span className="text-[#FF5D22]">46 Games Started</span>
              </div>

              {/* Major Numbers Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="p-4 bg-black/40 border border-white/5">
                  <div className="text-[10px] font-mono-code text-white/40 uppercase tracking-widest mb-1">
                    PPG
                  </div>
                  <div className="text-3xl font-black font-display text-white">
                    {currentSeason.stats.pointsPerGame}
                  </div>
                  <div className="text-[10px] text-[#FF5D22] font-mono-code mt-1">#1 Team Scoring</div>
                </div>

                <div className="p-4 bg-black/40 border border-white/5">
                  <div className="text-[10px] font-mono-code text-white/40 uppercase tracking-widest mb-1">
                    APG
                  </div>
                  <div className="text-3xl font-black font-display text-[#FF5D22]">
                    {currentSeason.stats.assistsPerGame}
                  </div>
                  <div className="text-[10px] text-white/60 font-mono-code mt-1">#1 League Assist</div>
                </div>

                <div className="p-4 bg-black/40 border border-white/5">
                  <div className="text-[10px] font-mono-code text-white/40 uppercase tracking-widest mb-1">
                    RPG
                  </div>
                  <div className="text-3xl font-black font-display text-white">
                    {currentSeason.stats.reboundsPerGame}
                  </div>
                  <div className="text-[10px] text-white/60 font-mono-code mt-1">Perimeter Glass</div>
                </div>

                <div className="p-4 bg-black/40 border border-white/5">
                  <div className="text-[10px] font-mono-code text-white/40 uppercase tracking-widest mb-1">
                    SPG
                  </div>
                  <div className="text-3xl font-black font-display text-white">
                    {currentSeason.stats.stealsPerGame}
                  </div>
                  <div className="text-[10px] text-[#FF5D22] font-mono-code mt-1">Defensive Rating</div>
                </div>
              </div>

              {/* Shooting Efficiency Matrix: 50 / 40 / 90 */}
              <div className="p-5 bg-black/60 border border-white/10 mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider font-display text-white flex items-center gap-2">
                    <Flame className="w-4 h-4 text-[#FF5D22]" />
                    <span>Elite 50 / 40 / 90 Efficiency Club</span>
                  </span>
                  <span className="text-[10px] font-mono-code text-white/40">TS% 63.8</span>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-[10px] font-mono-code text-white/40 mb-1">Field Goal %</div>
                    <div className="text-xl font-bold font-mono-code text-white">51.4%</div>
                    <div className="w-full bg-white/10 h-1 mt-2">
                      <div className="bg-[#FF5D22] h-1 w-[51.4%]" />
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-mono-code text-white/40 mb-1">3-Point %</div>
                    <div className="text-xl font-bold font-mono-code text-[#FF5D22]">44.2%</div>
                    <div className="w-full bg-white/10 h-1 mt-2">
                      <div className="bg-[#FF5D22] h-1 w-[44.2%]" />
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-mono-code text-white/40 mb-1">Free Throw %</div>
                    <div className="text-xl font-bold font-mono-code text-white">93.0%</div>
                    <div className="w-full bg-white/10 h-1 mt-2">
                      <div className="bg-[#FF5D22] h-1 w-[93.0%]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-white/10">
              <div className="text-xs font-mono-code text-white/50">
                Next Match: <span className="text-white font-bold">vs Utsunomiya Brex (Playoffs G1)</span>
              </div>

              <button
                onClick={() => onSelectSeason(currentSeason.id)}
                className="px-4 py-2 bg-white/10 hover:bg-[#FF5D22] hover:text-black text-white text-xs font-mono-code tracking-wider uppercase transition-colors cursor-pointer"
              >
                Inspect Season Narrative
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
