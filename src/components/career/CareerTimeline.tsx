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
import { seasonsData } from '../../data/seasons';
import { Season } from '../../types/career';

interface CareerTimelineProps {
  onSelectSeason: (seasonId: string) => void;
}

export const CareerTimeline: React.FC<CareerTimelineProps> = ({ onSelectSeason }) => {
  const [selectedCountry, setSelectedCountry] = useState<string>('ALL');
  const [onlyTrophies, setOnlyTrophies] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'timeline' | 'grid' | 'table'>('timeline');
  const [sortField, setSortField] = useState<keyof Season['stats']>('pointsPerGame');
  const [sortOrder, setSortOrder] = useState<'desc' | 'asc'>('desc');

  // Extract unique countries
  const countries = ['ALL', ...Array.from(new Set(seasonsData.map((s) => s.country.split('/')[0].trim())))];

  // Filter seasons
  const filteredSeasons = seasonsData.filter((season) => {
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
    <div className="w-full bg-[#0F0F0F] min-h-screen py-12 px-6 sm:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Header Title & Subtitle */}
        <div className="mb-12 border-b border-white/10 pb-8">
          <div className="flex items-center gap-2 text-[10px] font-mono-code text-[#FF5D22] tracking-[0.3em] uppercase mb-2">
            <span>Chronological Archive</span>
            <span>•</span>
            <span>Six Chapters</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-black font-display tracking-tight text-white uppercase mb-4">
            The Six-Season Career
          </h1>
          <p className="font-serif-editorial text-xl italic text-white/60 max-w-2xl">
            Explore the tactical progression, international championships, and statistical milestones from 2018 to the present.
          </p>
        </div>

        {/* Filter Toolbar & View Switcher */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-10 pb-6 border-b border-white/10">
          {/* Country Filters */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-mono-code text-white/40 uppercase mr-2 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5" />
              <span>Country:</span>
            </span>
            {countries.map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCountry(c)}
                className={`px-3 py-1.5 text-[11px] font-mono-code uppercase tracking-wider transition-all cursor-pointer border ${
                  selectedCountry === c
                    ? 'bg-[#FF5D22] text-black font-bold border-[#FF5D22]'
                    : 'bg-white/5 text-white/70 hover:text-white border-white/10 hover:border-white/20'
                }`}
              >
                {c}
              </button>
            ))}

            <button
              onClick={() => setOnlyTrophies(!onlyTrophies)}
              className={`px-3 py-1.5 text-[11px] font-mono-code uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1.5 border ml-2 ${
                onlyTrophies
                  ? 'bg-amber-400 text-black font-bold border-amber-400'
                  : 'bg-white/5 text-white/70 hover:text-white border-white/10'
              }`}
            >
              <Trophy className="w-3 h-3" />
              <span>Champions Only</span>
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-white/5 p-1 border border-white/10">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1.5 text-xs font-mono-code uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer ${
                viewMode === 'timeline'
                  ? 'bg-[#FF5D22] text-black font-bold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Timeline</span>
            </button>

            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 text-xs font-mono-code uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer ${
                viewMode === 'grid'
                  ? 'bg-[#FF5D22] text-black font-bold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Grid</span>
            </button>

            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1.5 text-xs font-mono-code uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer ${
                viewMode === 'table'
                  ? 'bg-[#FF5D22] text-black font-bold'
                  : 'text-white/60 hover:text-white'
              }`}
            >
              <TableIcon className="w-3.5 h-3.5" />
              <span>Stats Table</span>
            </button>
          </div>
        </div>

        {/* VIEW 1: TIMELINE CHRONOLOGY */}
        {viewMode === 'timeline' && (
          <div className="relative border-l border-white/10 ml-4 sm:ml-8 pl-6 sm:pl-12 space-y-16 py-4">
            {filteredSeasons.map((season, idx) => {
              const isCurrent = season.isCurrentSeason;

              return (
                <div key={season.id} className="relative group">
                  {/* Timeline Node Point */}
                  <div
                    className={`absolute -left-[31px] sm:-left-[55px] top-0 w-8 h-8 rounded-full border-2 flex items-center justify-center font-mono-code text-xs font-bold transition-all ${
                      isCurrent
                        ? 'bg-[#FF5D22] border-white text-black shadow-[0_0_20px_rgba(255,93,34,0.6)]'
                        : 'bg-[#141414] border-white/30 text-white group-hover:border-[#FF5D22] group-hover:text-[#FF5D22]'
                    }`}
                  >
                    {season.id}
                  </div>

                  {/* Season Card */}
                  <div className="bg-[#141414] border border-white/10 hover:border-white/30 transition-all duration-300 p-6 sm:p-8 relative overflow-hidden">
                    {/* Background Subtle Gradient */}
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/[0.02] rounded-full blur-2xl pointer-events-none" />

                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-white/10">
                      <div>
                        <div className="flex flex-wrap items-center gap-3 mb-2">
                          <span className="text-xs font-mono-code font-bold text-[#FF5D22]">
                            {season.yearRange}
                          </span>
                          <span className="text-white/30">•</span>
                          <span className="text-xs font-mono-code text-white/60">
                            {season.league}
                          </span>
                          <span className="text-white/30">•</span>
                          <span className="text-xs font-mono-code text-white/60 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-[#FF5D22]" />
                            {season.city}, {season.country}
                          </span>
                        </div>

                        <h3 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-white">
                          {season.team}
                        </h3>
                      </div>

                      <button
                        onClick={() => onSelectSeason(season.id)}
                        className="px-5 py-2.5 bg-white/10 hover:bg-[#FF5D22] hover:text-black text-white text-xs font-mono-code uppercase tracking-wider font-bold transition-colors cursor-pointer flex items-center gap-2 self-start lg:self-center"
                      >
                        <span>Examine Season {season.id}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Stats & Narrative Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-8 pt-6">
                      {/* Left: Narrative & Key Achievements */}
                      <div className="md:col-span-7 space-y-4">
                        <p className="font-serif-editorial text-lg italic text-white/80 leading-relaxed">
                          "{season.narrative.summary}"
                        </p>

                        <div className="space-y-2 pt-2">
                          <span className="text-[10px] font-mono-code uppercase text-white/40 tracking-widest block">
                            Key Results & Silverware
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {season.results.map((res, rIdx) => (
                              <span
                                key={rIdx}
                                className={`text-xs px-3 py-1 font-mono-code flex items-center gap-1.5 border ${
                                  res.stage === 'Champion'
                                    ? 'bg-[#FF5D22]/10 border-[#FF5D22] text-[#FF5D22] font-bold'
                                    : 'bg-white/5 border-white/10 text-white/80'
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
                      <div className="md:col-span-5 bg-black/40 border border-white/5 p-5 flex flex-col justify-between">
                        <div className="text-[10px] font-mono-code uppercase text-white/40 tracking-widest mb-4 flex justify-between">
                          <span>Season Production</span>
                          <span className="text-[#FF5D22] font-bold">{season.stats.games} Games</span>
                        </div>

                        <div className="grid grid-cols-3 gap-3 text-center mb-4">
                          <div className="p-2.5 bg-white/5">
                            <div className="text-[10px] font-mono-code text-white/40">PPG</div>
                            <div className="text-xl font-bold font-mono-code text-white">
                              {season.stats.pointsPerGame}
                            </div>
                          </div>

                          <div className="p-2.5 bg-white/5">
                            <div className="text-[10px] font-mono-code text-white/40">APG</div>
                            <div className="text-xl font-bold font-mono-code text-[#FF5D22]">
                              {season.stats.assistsPerGame}
                            </div>
                          </div>

                          <div className="p-2.5 bg-white/5">
                            <div className="text-[10px] font-mono-code text-white/40">RPG</div>
                            <div className="text-xl font-bold font-mono-code text-white">
                              {season.stats.reboundsPerGame}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-xs font-mono-code text-white/50 pt-2 border-t border-white/10">
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
                className="bg-[#141414] border border-white/10 hover:border-[#FF5D22] transition-all duration-300 p-7 flex flex-col justify-between group cursor-pointer relative overflow-hidden"
              >
                {/* Watermark season number */}
                <span className="absolute bottom-[-10px] right-2 font-display text-8xl font-black text-white/5 group-hover:text-[#FF5D22]/10 transition-colors pointer-events-none select-none">
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
                      <span className="text-xs font-mono-code text-white/40">
                        {season.countryCode}
                      </span>
                    )}
                  </div>

                  <h3 className="text-2xl font-black font-display uppercase tracking-tight text-white mb-1 group-hover:text-[#FF5D22] transition-colors">
                    {season.team}
                  </h3>

                  <p className="text-xs font-mono-code text-white/50 uppercase tracking-wider mb-6">
                    {season.league}
                  </p>

                  <div className="grid grid-cols-3 gap-2 bg-black/40 p-3 border border-white/5 mb-6 text-center">
                    <div>
                      <div className="text-[9px] font-mono-code text-white/40">PPG</div>
                      <div className="text-lg font-bold font-mono-code text-white">
                        {season.stats.pointsPerGame}
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] font-mono-code text-white/40">APG</div>
                      <div className="text-lg font-bold font-mono-code text-[#FF5D22]">
                        {season.stats.assistsPerGame}
                      </div>
                    </div>
                    <div>
                      <div className="text-[9px] font-mono-code text-white/40">RPG</div>
                      <div className="text-lg font-bold font-mono-code text-white">
                        {season.stats.reboundsPerGame}
                      </div>
                    </div>
                  </div>

                  <p className="text-xs font-serif-editorial italic text-white/70 line-clamp-2">
                    "{season.narrative.tagline}"
                  </p>
                </div>

                <div className="pt-6 border-t border-white/10 flex items-center justify-between mt-6">
                  <span className="text-[10px] font-mono-code uppercase text-white/40">
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
          <div className="overflow-x-auto bg-[#141414] border border-white/10">
            <table className="w-full text-left text-xs font-mono-code">
              <thead>
                <tr className="border-b border-white/10 bg-black/60 text-white/40 uppercase tracking-wider">
                  <th className="py-4 px-5">Season</th>
                  <th className="py-4 px-5">Club / League</th>
                  <th className="py-4 px-5">Country</th>
                  <th
                    className="py-4 px-5 cursor-pointer hover:text-white"
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
                    className="py-4 px-5 cursor-pointer hover:text-white"
                    onClick={() => handleSort('assistsPerGame')}
                  >
                    APG {sortField === 'assistsPerGame' && (sortOrder === 'desc' ? '↓' : '↑')}
                  </th>
                  <th
                    className="py-4 px-5 cursor-pointer hover:text-white"
                    onClick={() => handleSort('reboundsPerGame')}
                  >
                    RPG {sortField === 'reboundsPerGame' && (sortOrder === 'desc' ? '↓' : '↑')}
                  </th>
                  <th
                    className="py-4 px-5 cursor-pointer hover:text-white"
                    onClick={() => handleSort('stealsPerGame')}
                  >
                    SPG {sortField === 'stealsPerGame' && (sortOrder === 'desc' ? '↓' : '↑')}
                  </th>
                  <th
                    className="py-4 px-5 cursor-pointer hover:text-white"
                    onClick={() => handleSort('fieldGoalPct')}
                  >
                    FG% {sortField === 'fieldGoalPct' && (sortOrder === 'desc' ? '↓' : '↑')}
                  </th>
                  <th
                    className="py-4 px-5 cursor-pointer hover:text-white"
                    onClick={() => handleSort('threePointPct')}
                  >
                    3PT% {sortField === 'threePointPct' && (sortOrder === 'desc' ? '↓' : '↑')}
                  </th>
                  <th
                    className="py-4 px-5 cursor-pointer hover:text-white"
                    onClick={() => handleSort('freeThrowPct')}
                  >
                    FT% {sortField === 'freeThrowPct' && (sortOrder === 'desc' ? '↓' : '↑')}
                  </th>
                  <th className="py-4 px-5">Trophies</th>
                  <th className="py-4 px-5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {sortedTableSeasons.map((season) => (
                  <tr
                    key={season.id}
                    className="hover:bg-white/5 transition-colors cursor-pointer"
                    onClick={() => onSelectSeason(season.id)}
                  >
                    <td className="py-4 px-5 font-bold text-[#FF5D22]">
                      {season.yearRange}
                    </td>
                    <td className="py-4 px-5">
                      <div className="font-bold text-white text-sm font-display">
                        {season.team}
                      </div>
                      <div className="text-[10px] text-white/40">{season.league}</div>
                    </td>
                    <td className="py-4 px-5 text-white/70">{season.country}</td>
                    <td className="py-4 px-5 font-bold">{season.stats.games}</td>
                    <td className="py-4 px-5 font-bold text-base text-[#FF5D22]">
                      {season.stats.pointsPerGame}
                    </td>
                    <td className="py-4 px-5 font-bold text-white">
                      {season.stats.assistsPerGame}
                    </td>
                    <td className="py-4 px-5">{season.stats.reboundsPerGame}</td>
                    <td className="py-4 px-5">{season.stats.stealsPerGame}</td>
                    <td className="py-4 px-5">{season.stats.fieldGoalPct}%</td>
                    <td className="py-4 px-5">{season.stats.threePointPct}%</td>
                    <td className="py-4 px-5">{season.stats.freeThrowPct}%</td>
                    <td className="py-4 px-5">
                      {season.results.some((r) => r.isTrophy || r.stage === 'Champion') ? (
                        <span className="inline-flex items-center gap-1 text-amber-400 font-bold text-[10px] uppercase">
                          <Trophy className="w-3 h-3" />
                          <span>Champion</span>
                        </span>
                      ) : (
                        <span className="text-white/30">—</span>
                      )}
                    </td>
                    <td className="py-4 px-5 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectSeason(season.id);
                        }}
                        className="p-1.5 hover:bg-[#FF5D22] hover:text-black text-white/70 rounded transition-colors"
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
