import React from 'react';
import { ArrowRight, Trophy, Flame, Activity, ShieldCheck, MapPin } from 'lucide-react';
import { useCareer } from '../../context/CareerContext';

interface CurrentSeasonBannerProps {
  onSelectSeason: (seasonId: string) => void;
}

export const CurrentSeasonBanner: React.FC<CurrentSeasonBannerProps> = ({ onSelectSeason }) => {
  const { seasons } = useCareer();
  const currentSeason = seasons.find((s) => s.isCurrentSeason) || seasons[seasons.length - 1];

  if (!currentSeason) return null;

  const titleResult = currentSeason.results.find((r) => r.isTrophy || r.stage === 'Champion');

  return (
    <section className="w-full border-b border-theme-subtle bg-theme-panel-alt px-6 sm:px-12 py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-theme-subtle gap-4">
          <div>
            <div className="flex items-center gap-2 text-[10px] font-mono-code text-[#FF5D22] tracking-[0.3em] uppercase mb-2">
              <span className="w-2 h-2 rounded-full bg-[#FF5D22] animate-ping" />
              <span>Active Campaign</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black font-display tracking-tight text-theme-main uppercase">
              Season {currentSeason.id} Spotlight — {currentSeason.team}
            </h2>
          </div>

          <button
            onClick={() => onSelectSeason(currentSeason.id)}
            className="inline-flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-[#FF5D22] hover:text-theme-main transition-colors cursor-pointer"
          >
            <span>Open Complete Season File</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Card Left: Identity & Hero Visual */}
          <div className="lg:col-span-5 bg-theme-panel border border-theme-subtle p-8 flex flex-col justify-between relative overflow-hidden group shadow-sm">
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />
            <img
              src={currentSeason.heroImage}
              alt={currentSeason.team}
              className="absolute inset-0 w-full h-full object-cover grayscale opacity-30 group-hover:scale-105 transition-transform duration-700"
            />

            <div className="relative z-20">
              <div className="flex items-center justify-between mb-6">
                <span className="text-[10px] font-mono-code bg-[#FF5D22] text-black px-2.5 py-1 font-bold uppercase tracking-widest">
                  #{currentSeason.jerseyNumber} {currentSeason.position}
                </span>
                <span className="text-xs font-mono-code text-white/90 flex items-center gap-1.5 drop-shadow">
                  <MapPin className="w-3.5 h-3.5 text-[#FF5D22]" />
                  <span>{currentSeason.city}, {currentSeason.country}</span>
                </span>
              </div>

              <h3 className="text-3xl font-black font-display uppercase tracking-tight text-white mb-2 drop-shadow">
                {currentSeason.team}
              </h3>
              <p className="text-xs text-white/80 uppercase tracking-widest font-mono-code drop-shadow">
                {currentSeason.league}
              </p>
            </div>

            <div className="relative z-20 pt-16 space-y-4">
              {titleResult && (
                <div className="p-4 bg-black/60 backdrop-blur-md border border-white/15">
                  <div className="text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-wider mb-1 flex items-center gap-1.5">
                    <Trophy className="w-3.5 h-3.5" />
                    <span>Silverware Achieved</span>
                  </div>
                  <div className="text-sm font-bold text-white">
                    {titleResult.competition} ({titleResult.stage})
                  </div>
                </div>
              )}

              <p className="text-xs text-white/90 font-serif-editorial italic leading-relaxed drop-shadow">
                "{currentSeason.narrative.tagline}"
              </p>
            </div>
          </div>

          {/* Card Right: Statistical Engine & Shooting Splits */}
          <div className="lg:col-span-7 bg-theme-panel border border-theme-subtle p-8 flex flex-col justify-between shadow-sm">
            <div>
              <div className="text-[10px] font-mono-code text-theme-faint uppercase tracking-[0.25em] mb-6 pb-3 border-b border-theme-subtle flex justify-between items-center">
                <span>Official Production Splits</span>
                <span className="text-[#FF5D22] font-bold">{currentSeason.stats.games} Games Logged</span>
              </div>

              {/* Major Numbers Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
                <div className="p-4 bg-theme-subtle border border-theme-subtle">
                  <div className="text-[10px] font-mono-code text-theme-faint uppercase tracking-widest mb-1">
                    PPG
                  </div>
                  <div className="text-3xl font-black font-display text-theme-main">
                    {currentSeason.stats.pointsPerGame}
                  </div>
                  <div className="text-[10px] text-[#FF5D22] font-mono-code mt-1">#1 Team Scoring</div>
                </div>

                <div className="p-4 bg-theme-subtle border border-theme-subtle">
                  <div className="text-[10px] font-mono-code text-theme-faint uppercase tracking-widest mb-1">
                    APG
                  </div>
                  <div className="text-3xl font-black font-display text-[#FF5D22]">
                    {currentSeason.stats.assistsPerGame}
                  </div>
                  <div className="text-[10px] text-theme-muted font-mono-code mt-1">#1 League Assist</div>
                </div>

                <div className="p-4 bg-theme-subtle border border-theme-subtle">
                  <div className="text-[10px] font-mono-code text-theme-faint uppercase tracking-widest mb-1">
                    RPG
                  </div>
                  <div className="text-3xl font-black font-display text-theme-main">
                    {currentSeason.stats.reboundsPerGame}
                  </div>
                  <div className="text-[10px] text-theme-muted font-mono-code mt-1">Perimeter Glass</div>
                </div>

                <div className="p-4 bg-theme-subtle border border-theme-subtle">
                  <div className="text-[10px] font-mono-code text-theme-faint uppercase tracking-widest mb-1">
                    SPG
                  </div>
                  <div className="text-3xl font-black font-display text-theme-main">
                    {currentSeason.stats.stealsPerGame || 1.8}
                  </div>
                  <div className="text-[10px] text-[#FF5D22] font-mono-code mt-1">Defensive Rating</div>
                </div>
              </div>

              {/* Shooting Efficiency Matrix */}
              <div className="p-5 bg-theme-subtle border border-theme-subtle mb-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-wider font-display text-theme-main flex items-center gap-2">
                    <Flame className="w-4 h-4 text-[#FF5D22]" />
                    <span>Shooting Accuracy Splits</span>
                  </span>
                  <span className="text-[10px] font-mono-code text-theme-faint">PER {currentSeason.stats.playerEfficiencyRating || 28.5}</span>
                </div>

                <div className="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-[10px] font-mono-code text-theme-faint mb-1">Field Goal %</div>
                    <div className="text-xl font-bold font-mono-code text-theme-main">{currentSeason.stats.fieldGoalPct}%</div>
                    <div className="w-full bg-theme-panel border border-theme-subtle h-1.5 mt-2 overflow-hidden">
                      <div className="bg-[#FF5D22] h-full" style={{ width: `${Math.min(100, currentSeason.stats.fieldGoalPct)}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-mono-code text-theme-faint mb-1">3-Point %</div>
                    <div className="text-xl font-bold font-mono-code text-[#FF5D22]">{currentSeason.stats.threePointPct}%</div>
                    <div className="w-full bg-theme-panel border border-theme-subtle h-1.5 mt-2 overflow-hidden">
                      <div className="bg-[#FF5D22] h-full" style={{ width: `${Math.min(100, currentSeason.stats.threePointPct)}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="text-[10px] font-mono-code text-theme-faint mb-1">Free Throw %</div>
                    <div className="text-xl font-bold font-mono-code text-theme-main">{currentSeason.stats.freeThrowPct}%</div>
                    <div className="w-full bg-theme-panel border border-theme-subtle h-1.5 mt-2 overflow-hidden">
                      <div className="bg-[#FF5D22] h-full" style={{ width: `${Math.min(100, currentSeason.stats.freeThrowPct)}%` }} />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-4 flex flex-wrap items-center justify-between gap-4 border-t border-theme-subtle">
              <div className="text-xs font-mono-code text-theme-muted">
                Campaign ID: <span className="text-theme-main font-bold">Season {currentSeason.id} ({currentSeason.yearRange})</span>
              </div>

              <button
                onClick={() => onSelectSeason(currentSeason.id)}
                className="px-4 py-2 bg-theme-subtle hover:bg-[#FF5D22] hover:text-black text-theme-main text-xs font-mono-code tracking-wider uppercase transition-colors cursor-pointer border border-theme-subtle"
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
