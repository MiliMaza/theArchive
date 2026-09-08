import React, { useState } from 'react';
import { useCareer } from '../../context/CareerContext';
import { Season } from '../../types/career';

interface StatsMatrixViewProps {
  onSelectSeason: (seasonId: string) => void;
}

export const StatsMatrixView: React.FC<StatsMatrixViewProps> = ({ onSelectSeason }) => {
  const { seasons, totalCareerPoints, totalCareerAssists, totalCareerGames, totalCareerRebounds } = useCareer();
  const [selectedMetric, setSelectedMetric] = useState<'ppg' | 'apg' | 'rpg' | 'fg' | 'threePt'>('ppg');

  const getNumberWord = (n: number) => {
    const words = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen'];
    return words[n] || `${n}`;
  };

  const championshipsCount = seasons.reduce((acc, s) => {
    return acc + s.results.filter((r) => r.isTrophy || r.stage === 'Champion').length;
  }, 0);

  const avgPpg = totalCareerGames > 0 ? (totalCareerPoints / totalCareerGames).toFixed(1) : "--";
  const avgApg = totalCareerGames > 0 ? (totalCareerAssists / totalCareerGames).toFixed(1) : "--";
  const avgReb = totalCareerRebounds > 0 ? (totalCareerRebounds / totalCareerGames).toFixed(1) : "--";

  const getMetricValue = (season: Season, metric: typeof selectedMetric) => {
    switch (metric) {
      case 'ppg':
        return season.stats.pointsPerGame;
      case 'apg':
        return season.stats.assistsPerGame;
      case 'rpg':
        return season.stats.reboundsPerGame;
      case 'fg':
        return season.stats.fieldGoalPct;
      case 'threePt':
        return season.stats.threePointPct;
      default:
        return season.stats.pointsPerGame;
    }
  };

  const getMetricMax = (metric: typeof selectedMetric) => {
    switch (metric) {
      case 'ppg':
        return 30;
      case 'apg':
        return 12;
      case 'rpg':
        return 8;
      case 'fg':
        return 100;
      case 'threePt':
        return 100;
      default:
        return 30;
    }
  };

  const getMetricSuffix = (metric: typeof selectedMetric) => {
    if (metric === 'fg' || metric === 'threePt') return '%';
    return '';
  };

  return (
    <div className="w-full bg-theme-canvas min-h-screen py-12 px-6 sm:px-12 text-theme-main transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-12 border-b border-theme-subtle pb-8">
          <div className="flex items-center gap-2 text-[10px] font-mono-code text-[#FF5D22] tracking-[0.3em] uppercase mb-2">
            <span>Career Analytics</span>
            <span>•</span>
            <span>{getNumberWord(seasons.length)} Campaigns</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight text-theme-main uppercase mb-4">
            Career Stats
          </h1>
          <p className="font-serif-editorial text-xl italic text-theme-muted max-w-2xl">
            Verified production data across international leagues and championships.
          </p>
        </div>

        {/* Aggregated Career High-Level Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <div className="bg-theme-panel border border-theme-subtle p-6 shadow-sm">
            <span className="text-[10px] font-mono-code text-theme-faint uppercase tracking-widest block mb-2">
              Career Scoring Total
            </span>
            <div className="text-4xl font-black font-display text-theme-main">
              {totalCareerPoints.toLocaleString()}
            </div>
            <div className="text-xs font-mono-code text-[#FF5D22] mt-2">
              {avgPpg} PPG Career Average
            </div>
          </div>

          <div className="bg-theme-panel border border-theme-subtle p-6 shadow-sm">
            <span className="text-[10px] font-mono-code text-theme-faint uppercase tracking-widest block mb-2">
              Career Playmaking
            </span>
            <div className="text-4xl font-black font-display text-theme-main">
              {totalCareerAssists.toLocaleString()}
            </div>
            <div className="text-xs font-mono-code text-[#FF5D22] mt-2">
              {avgApg} APG Career Average
            </div>
          </div>

          <div className="bg-theme-panel border border-theme-subtle p-6 shadow-sm">
            <span className="text-[10px] font-mono-code text-theme-faint uppercase tracking-widest block mb-2">
              Official Games
            </span>
            <div className="text-4xl font-black font-display text-theme-main">
              {totalCareerGames}
            </div>
            <div className="text-xs font-mono-code text-[#FF5D22] mt-2">
              Pro-matches Played
            </div>
          </div>

          <div className="bg-theme-panel border border-theme-subtle p-6 shadow-sm">
            <span className="text-[10px] font-mono-code text-theme-faint uppercase tracking-widest block mb-2">
              Career Rebounds
            </span>
            <div className="text-4xl font-black font-display text-theme-main flex items-center gap-2">
              {totalCareerRebounds}
            </div>
            <div className="text-xs font-mono-code text-[#FF5D22] mt-2">
              {avgReb} RPG Career Average
            </div>
          </div>
        </div>

        {/* Interactive Metric Progression Chart */}
        <section className="bg-theme-panel border border-theme-subtle p-8 sm:p-10 mb-16 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-theme-subtle">
            <div>
              <span className="text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-[0.25em] block mb-1">
                Progression By Campaign
              </span>
              <h2 className="text-2xl font-black font-display uppercase tracking-tight text-theme-main">
                Season Trendline
              </h2>
            </div>

            {/* Metric Selector Tabs */}
            <div className="flex flex-wrap gap-2">
              {(
                [
                  { key: 'ppg', label: 'Points (PPG)' },
                  { key: 'apg', label: 'Assists (APG)' },
                  { key: 'rpg', label: 'Rebounds (RPG)' },
                  { key: 'fg', label: 'Field Goal %' },
                  { key: 'threePt', label: '3-Point %' },
                ] as const
              ).map((m) => (
                <button
                  key={m.key}
                  onClick={() => setSelectedMetric(m.key)}
                  className={`px-3 py-1.5 text-xs font-mono-code uppercase tracking-wider transition-colors cursor-pointer border ${selectedMetric === m.key
                    ? 'bg-[#FF5D22] text-black font-bold border-[#FF5D22]'
                    : 'bg-theme-subtle text-theme-muted hover:text-theme-main border-theme-subtle'
                    }`}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bar Chart Visualization */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 pt-4 items-end min-h-[300px]">
            {seasons.map((s) => {
              const val = getMetricValue(s, selectedMetric);
              const max = getMetricMax(selectedMetric);
              const heightPercent = Math.min(100, Math.round((Number(val) / max) * 100));

              return (
                <div
                  key={s.id}
                  onClick={() => onSelectSeason(s.id)}
                  className="flex flex-col items-center justify-end h-full group cursor-pointer"
                >
                  <div className="text-xs font-bold font-mono-code mb-2 text-[#FF5D22] group-hover:scale-110 transition-transform">
                    {val}
                    {getMetricSuffix(selectedMetric)}
                  </div>

                  <div className="w-full bg-theme-subtle h-48 border border-theme-subtle relative flex items-end overflow-hidden">
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className={`w-full transition-all duration-500 ${s.isCurrentSeason
                        ? 'bg-[#FF5D22]'
                        : 'bg-theme-main/70 group-hover:bg-[#FF5D22]'
                        }`}
                    />
                  </div>

                  <div className="mt-3 text-center">
                    <div className="text-xs font-bold font-mono-code text-theme-main">
                      Season {s.id}
                    </div>
                    <div className="text-[10px] text-theme-faint font-mono-code">{s.yearRange}</div>
                    <div className="text-[10px] text-theme-muted font-display truncate max-w-[110px]">
                      {s.team.split(' ')[0]}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* All-Time Career High Single Games */}
        <section className="bg-theme-panel border border-theme-subtle p-8 shadow-sm">
          <div className="mb-6 pb-4 border-b border-theme-subtle">
            <span className="text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-[0.25em] block mb-1">
              Apex Performances
            </span>
            <h3 className="text-2xl font-black font-display uppercase tracking-tight text-theme-main">
              All-Time Career Single-Game Records
            </h3>
          </div>

          {(() => {
            const statCategories = [
              { key: 'points' as const, label: 'Points Record', suffix: 'PTS', isAccent: true },
              { key: 'assists' as const, label: 'Assists Record', suffix: 'AST', isAccent: false },
              { key: 'steals' as const, label: 'Steals Record', suffix: 'STL', isAccent: false },
              { key: 'rebounds' as const, label: 'Rebounds Record', suffix: 'REB', isAccent: false },
            ];

            const allTimeHighs = statCategories.map(({ key, label, suffix, isAccent }) => {
              let best: { value: number; opponent: string; notes?: string; seasonId: string; yearRange: string } | null = null;
              for (const season of seasons) {
                const high = season.careerHighs[key];
                if (high && (!best || high.value > best.value)) {
                  best = {
                    value: high.value,
                    opponent: high.opponent,
                    notes: high.notes,
                    seasonId: season.id,
                    yearRange: season.yearRange,
                  };
                }
              }
              return { key, label, suffix, isAccent, best };
            });

            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {allTimeHighs.map(({ key, label, suffix, isAccent, best }) => (
                  <div key={key} className="p-5 bg-theme-subtle border border-theme-subtle">
                    <div className="text-[10px] font-mono-code text-theme-faint uppercase tracking-widest mb-1">
                      {label}
                    </div>
                    <div className={`text-3xl font-black font-display mb-1 ${isAccent ? 'text-[#FF5D22]' : 'text-theme-main'}`}>
                      {best ? `${best.value} ${suffix}` : `-- ${suffix}`}
                    </div>
                    {best && (
                      <>
                        <div className="text-xs text-theme-main font-bold">vs {best.opponent}</div>
                        <div className="text-[10px] font-mono-code text-theme-faint mt-1">
                          Season {best.seasonId} ({best.yearRange}){best.notes ? ` • ${best.notes}` : ''}
                        </div>
                      </>
                    )}
                  </div>
                ))}
              </div>
            );
          })()}
        </section>
      </div>
    </div>
  );
};
