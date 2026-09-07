import React, { useState } from 'react';
import {
  Trophy,
  MapPin,
  Calendar,
  ArrowRight,
  Filter,
  Layers,
  LayoutGrid,
  Table as TableIcon,
  Sparkles,
  ChevronRight,
  Flame,
} from 'lucide-react';
import { useCareer } from '../../context/CareerContext';
import { Season } from '../../types/career';

interface CareerTimelineProps {
  onSelectSeason: (seasonId: string) => void;
}

export const CareerTimeline: React.FC<CareerTimelineProps> = ({ onSelectSeason }) => {
  const { seasons } = useCareer();
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');
  const [onlyTrophies, setOnlyTrophies] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'timeline' | 'grid' | 'table'>('timeline');
  const [sortField, setSortField] = useState<keyof Season['stats']>('pointsPerGame');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  const getNumberWord = (n: number) => {
    const words = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen'];
    return words[n] || `${n}`;
  };

  const earliestYear = seasons.length > 0
    ? seasons[seasons.length - 1]?.yearRange.split('—')[0]?.trim() || seasons[0]?.yearRange.split('—')[0]?.trim() || '2018'
    : '2018';

  // Extract unique countries
  const countries = ['ALL', ...Array.from(new Set(seasons.map((s) => s.country.split('/')[0].trim())))];

  // Filter seasons
  const filteredSeasons = seasons.filter((season) => {
    const matchesCountry =
      selectedCountry === 'ALL' || season.country.toLowerCase().includes(selectedCountry.toLowerCase());
    const matchesTrophy = !onlyTrophies || season.results.some((r) => r.isTrophy || r.stage === 'Champion');
    return matchesCountry && matchesTrophy;
  });

  // Sorted seasons for table view
  const sortedTableSeasons = [...filteredSeasons].sort((a, b) => {
    const valA = a.stats[sortField] ?? 0;
    const valB = b.stats[sortField] ?? 0;
    return sortOrder === 'desc' ? Number(valB) - Number(valA) : Number(valA) - Number(valB);
  });

  const handleSort = (field: keyof Season['stats']) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  return (
    <div className="w-full bg-theme-canvas min-h-screen py-12 px-6 sm:px-12 text-theme-main transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Header Title & Subtitle */}
        <div className="mb-12 border-b border-theme-subtle pb-8">
          <div className="flex items-center gap-2 text-[10px] font-mono-code text-[#FF5D22] tracking-[0.3em] uppercase mb-2">
            <span>Chronological Archive</span>
            <span>•</span>
            <span>{seasons.length === 1 ? '1 Chapter' : `${getNumberWord(seasons.length)} Chapters`}</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight text-theme-main uppercase mb-4">
            My Career
          </h1>
          <p className="font-serif-editorial text-xl italic text-theme-muted max-w-2xl">
            Explore my progression, championships and stats from {earliestYear} to the present.
          </p>
        </div>

        {/* Filter Toolbar & View Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 pb-6 border-b border-theme-subtle">
          {/* Country Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono-code text-theme-faint uppercase mr-2 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" />
              <span>Country:</span>
            </span>
            {countries.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCountry(c)}
                className={`px-3 py-1.5 text-[11px] font-mono-code uppercase tracking-wider transition-all cursor-pointer border ${selectedCountry === c
                  ? 'bg-[#FF5D22] text-black font-bold border-[#FF5D22]'
                  : 'bg-theme-subtle text-theme-muted hover:text-theme-main border-theme-subtle hover:border-theme-hover'
                  }`}
              >
                {c}
              </button>
            ))}

            <button
              onClick={() => setOnlyTrophies(!onlyTrophies)}
              className={`px-3 py-1.5 text-[11px] font-mono-code uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 border ml-2 ${onlyTrophies
                ? 'bg-amber-400 text-black font-bold border-amber-400'
                : 'bg-theme-subtle text-theme-muted hover:text-theme-main border-theme-subtle'
                }`}
            >
              <Trophy className="w-3 h-3" />
              <span>Titles Only</span>
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-theme-subtle p-1 border border-theme-subtle">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 text-xs font-mono-code uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer ${viewMode === 'timeline'
                ? 'bg-[#FF5D22] text-black font-bold'
                : 'text-theme-muted hover:text-theme-main'
                }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Timeline</span>
            </button>

            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 text-xs font-mono-code uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer ${viewMode === 'grid'
                ? 'bg-[#FF5D22] text-black font-bold'
                : 'text-theme-muted hover:text-theme-main'
                }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>

            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 text-xs font-mono-code uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer ${viewMode === 'table'
                ? 'bg-[#FF5D22] text-black font-bold'
                : 'text-theme-muted hover:text-theme-main'
                }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Stats Table</span>
            </button>
          </div>
        </div>

        {/* VIEW 1: TIMELINE CHRONOLOGY */}
        {viewMode === 'timeline' && (
          <div className="relative border-l border-theme-subtle ml-4 sm:ml-8 pl-6 sm:pl-12 space-y-16 py-4">
            {filteredSeasons.map((season, idx) => {
              const isCurrent = season.isCurrentSeason;

              return (
                <div key={season.id} className="relative group">
                  {/* Timeline Node Point */}
                  <div
                    className={`absolute -left-[31px] sm:-left-[55px] top-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-mono-code text-xs font-bold transition-all ${isCurrent
                      ? 'bg-[#FF5D22] border-theme-main text-black shadow-[0_0_20px_rgba(255,93,34,0.6)]'
                      : 'bg-theme-panel border-theme-subtle text-theme-main group-hover:border-[#FF5D22] group-hover:text-[#FF5D22]'
                      }`}
                  >
                    {season.id}
                  </div>

                  {/* Season Card */}
                  <div className="bg-theme-panel border border-theme-subtle hover:border-theme-hover transition-all duration-300 p-6 sm:p-8 relative overflow-hidden shadow-sm">
                    {/* Background Subtle Gradient */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-theme-subtle rounded-full blur-2xl pointer-events-none" />

                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-theme-subtle">
                      <div>
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <span className="text-xs font-mono-code font-bold text-[#FF5D22]">
                            {season.yearRange}
                          </span>
                          <span className="text-theme-dim">•</span>
                          <span className="text-xs font-mono-code text-theme-muted">
                            {season.league}
                          </span>
                          <span className="text-theme-dim">•</span>
                          <span className="text-xs font-mono-code text-theme-muted flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#FF5D22]" />
                            {season.city}, {season.country}
                          </span>
                        </div>

                        <h3 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-theme-main">
                          {season.team}
                        </h3>
                      </div>

                      <button
                        onClick={() => onSelectSeason(season.id)}
                        className="px-5 py-2.5 bg-theme-subtle hover:bg-[#FF5D22] hover:text-black text-theme-main text-xs font-mono-code uppercase tracking-wider font-bold transition-colors cursor-pointer flex items-center gap-2 self-start lg:self-center border border-theme-subtle"
                      >
                        <span>Examine Season {season.id}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Stats & Narrative Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-6">
                      {/* Left: Narrative & Key Achievements */}
                      <div className="md:col-span-7 space-y-4">
                        <p className="font-serif-editorial text-lg italic text-theme-muted leading-relaxed">
                          "{season.narrative.summary}"
                        </p>

                        <div className="space-y-2 pt-2">
                          <span className="text-[10px] font-mono-code uppercase text-theme-faint tracking-widest block">
                            Key Results & Silverware
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {season.results.map((res, rIdx) => (
                              <span
                                key={rIdx}
                                className={`text-xs px-3 py-1 font-mono-code flex items-center gap-1.5 border ${res.stage === 'Champion'
                                  ? 'bg-[#FF5D22]/10 border-[#FF5D22] text-[#FF5D22] font-bold'
                                  : 'bg-theme-subtle border-theme-subtle text-theme-muted'
                                  }`}
                              >
                                {res.stage === 'Champion' && <Trophy className="w-3 h-3 text-[#FF5D22]" />}
                                <span>
                                  {res.competition}: {res.stage}
                                </span>
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right: Key Stats Card */}
                      <div className="md:col-span-5 bg-theme-subtle border border-theme-subtle p-5 flex flex-col justify-between">
                        <div className="text-[10px] font-mono-code uppercase text-theme-faint tracking-widest mb-4 flex justify-between">
                          <span>Season Production</span>
                          <span className="text-[#FF5D22] font-bold">{season.stats.games} Games</span>
                        </div>

                        <div className="grid grid-cols-3 gap-3 text-center mb-4">
                          <div className="p-2.5 bg-theme-panel border border-theme-subtle">
                            <div className="text-[10px] font-mono-code text-theme-faint">PPG</div>
                            <div className="text-xl font-bold font-mono-code text-theme-main">
                              {season.stats.pointsPerGame}
                            </div>
                          </div>

                          <div className="p-2.5 bg-theme-panel border border-theme-subtle">
                            <div className="text-[10px] font-mono-code text-theme-faint">APG</div>
                            <div className="text-xl font-bold font-mono-code text-[#FF5D22]">
                              {season.stats.assistsPerGame}
                            </div>
                          </div>

                          <div className="p-2.5 bg-theme-panel border border-theme-subtle">
                            <div className="text-[10px] font-mono-code text-theme-faint">RPG</div>
                            <div className="text-xl font-bold font-mono-code text-theme-main">
                              {season.stats.reboundsPerGame}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs font-mono-code text-theme-muted pt-2 border-t border-theme-subtle">
                          <span>FG {season.stats.fieldGoalPct}%</span>
                          <span>3PT {season.stats.threePointPct}%</span>
                          <span>FT {season.stats.freeThrowPct}%</span>
                          {season.stats.playerEfficiencyRating && (
                            <span className="text-[#FF5D22] font-bold">
                              PER {season.stats.playerEfficiencyRating}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* VIEW 2: GRID OF 6 SEASONS */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSeasons.map((season) => (
              <div
                key={season.id}
                onClick={() => onSelectSeason(season.id)}
                className="bg-theme-panel border border-theme-subtle hover:border-[#FF5D22] transition-all duration-300 p-7 flex flex-col justify-between group cursor-pointer relative overflow-hidden shadow-sm"
              >
                {/* Watermark season number */}
                <span className="absolute bottom-[-10px] right-2 font-display text-8xl font-black text-theme-main opacity-5 group-hover:text-[#FF5D22] group-hover:opacity-15 transition-colors pointer-events-none select-none">
                  {season.id}
                </span>

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono-code text-[#FF5D22] font-bold">
                      {season.yearRange}
                    </span>
                    {season.isCurrentSeason ? (
                      <span className="text-[10px] font-mono-code bg-[#FF5D22] text-black px-2 py-0.5 font-bold uppercase">
                        Current
                      </span>
                    ) : (
                      <span className="text-xs font-mono-code text-theme-faint">
                        {season.countryCode}
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-black font-display uppercase tracking-tight text-theme-main mb-1 group-hover:text-[#FF5D22] transition-colors">
                    {season.team}
                  </h3>

                  <p className="text-xs font-mono-code text-theme-muted uppercase tracking-wider mb-6">
                    {season.league}
                  </p>

                  <div className="grid grid-cols-3 gap-2 bg-theme-subtle p-3 border border-theme-subtle mb-6 text-center">
                    <div>
                      <div className="text-[9px] font-mono-code text-theme-faint">PPG</div>
                      <div className="text-lg font-bold font-mono-code text-theme-main">
                        {season.stats.pointsPerGame}
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] font-mono-code text-theme-faint">APG</div>
                      <div className="text-lg font-bold font-mono-code text-[#FF5D22]">
                        {season.stats.assistsPerGame}
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] font-mono-code text-theme-faint">RPG</div>
                      <div className="text-lg font-bold font-mono-code text-theme-main">
                        {season.stats.reboundsPerGame}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs font-serif-editorial italic text-theme-muted line-clamp-2">
                    "{season.narrative.tagline}"
                  </p>
                </div>

                <div className="pt-6 border-t border-theme-subtle flex items-center justify-between mt-6">
                  <span className="text-[10px] font-mono-code uppercase text-theme-faint">
                    {season.stats.games} Games Total
                  </span>

                  <span className="text-xs font-mono-code text-[#FF5D22] font-bold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Inspect</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* VIEW 3: FULL STATS COMPARISON TABLE */}
        {viewMode === 'table' && (
          <div className="overflow-x-auto bg-theme-panel border border-theme-subtle shadow-sm">
            <table className="w-full text-left text-xs font-mono-code">
              <thead>
                <tr className="border-b border-theme-subtle bg-theme-panel-alt text-theme-faint uppercase tracking-wider">
                  <th className="py-4 px-5">Season</th>
                  <th className="py-4 px-5">Club / League</th>
                  <th className="py-4 px-5">Country</th>
                  <th
                    className="py-4 px-5 cursor-pointer hover:text-theme-main"
                    onClick={() => handleSort('games')}
                  >
                    GP {sortField === 'games' && (sortOrder === 'desc' ? '↓' : '↑')}
                  </th>
                  <th
                    className="py-4 px-5 cursor-pointer hover:text-[#FF5D22] text-[#FF5D22]"
                    onClick={() => handleSort('pointsPerGame')}
                  >
                    PPG {sortField === 'pointsPerGame' && (sortOrder === 'desc' ? '↓' : '↑')}
                  </th>
                  <th
                    className="py-4 px-5 cursor-pointer hover:text-theme-main"
                    onClick={() => handleSort('assistsPerGame')}
                  >
                    APG {sortField === 'assistsPerGame' && (sortOrder === 'desc' ? '↓' : '↑')}
                  </th>
                  <th
                    className="py-4 px-5 cursor-pointer hover:text-theme-main"
                    onClick={() => handleSort('reboundsPerGame')}
                  >
                    RPG {sortField === 'reboundsPerGame' && (sortOrder === 'desc' ? '↓' : '↑')}
                  </th>
                  <th
                    className="py-4 px-5 cursor-pointer hover:text-theme-main"
                    onClick={() => handleSort('stealsPerGame')}
                  >
                    SPG {sortField === 'stealsPerGame' && (sortOrder === 'desc' ? '↓' : '↑')}
                  </th>
                  <th
                    className="py-4 px-5 cursor-pointer hover:text-theme-main"
                    onClick={() => handleSort('fieldGoalPct')}
                  >
                    FG% {sortField === 'fieldGoalPct' && (sortOrder === 'desc' ? '↓' : '↑')}
                  </th>
                  <th
                    className="py-4 px-5 cursor-pointer hover:text-theme-main"
                    onClick={() => handleSort('threePointPct')}
                  >
                    3PT% {sortField === 'threePointPct' && (sortOrder === 'desc' ? '↓' : '↑')}
                  </th>
                  <th
                    className="py-4 px-5 cursor-pointer hover:text-theme-main"
                    onClick={() => handleSort('freeThrowPct')}
                  >
                    FT% {sortField === 'freeThrowPct' && (sortOrder === 'desc' ? '↓' : '↑')}
                  </th>
                  <th className="py-4 px-5">Trophies</th>
                  <th className="py-4 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-theme-subtle">
                {sortedTableSeasons.map((season) => (
                  <tr
                    key={season.id}
                    className="hover:bg-theme-subtle transition-colors cursor-pointer"
                    onClick={() => onSelectSeason(season.id)}
                  >
                    <td className="py-4 px-5 font-bold text-[#FF5D22]">
                      {season.yearRange}
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-bold text-theme-main text-sm font-display">
                        {season.team}
                      </div>
                      <div className="text-[10px] text-theme-faint">{season.league}</div>
                    </td>
                    <td className="py-4 px-5 text-theme-muted">{season.country}</td>
                    <td className="py-4 px-5 font-bold text-theme-main">{season.stats.games}</td>
                    <td className="py-4 px-5 font-bold text-base text-[#FF5D22]">
                      {season.stats.pointsPerGame}
                    </td>
                    <td className="py-4 px-5 font-bold text-theme-main">
                      {season.stats.assistsPerGame}
                    </td>
                    <td className="py-4 px-5 text-theme-muted">{season.stats.reboundsPerGame}</td>
                    <td className="py-4 px-5 text-theme-muted">{season.stats.stealsPerGame}</td>
                    <td className="py-4 px-5 text-theme-muted">{season.stats.fieldGoalPct}%</td>
                    <td className="py-4 px-5 text-theme-muted">{season.stats.threePointPct}%</td>
                    <td className="py-4 px-5 text-theme-muted">{season.stats.freeThrowPct}%</td>
                    <td className="py-4 px-5">
                      {season.results.some((r) => r.isTrophy || r.stage === 'Champion') ? (
                        <span className="inline-flex items-center gap-1 text-amber-500 font-bold text-[10px] uppercase">
                          <Trophy className="w-3 h-3" />
                          <span>Champion</span>
                        </span>
                      ) : (
                        <span className="text-theme-dim">—</span>
                      )}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSeason(season.id);
                        }}
                        className="p-1.5 hover:bg-[#FF5D22] hover:text-black text-theme-muted rounded transition-colors"
                      >
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
