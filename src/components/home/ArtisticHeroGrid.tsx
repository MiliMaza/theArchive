import React from 'react';
import { ArrowRight, Trophy, Sparkles, MapPin } from 'lucide-react';
import { useCareer } from '../../context/CareerContext';

interface ArtisticHeroGridProps {
  onSelectSeason: (seasonId: string) => void;
  onExploreCareer: () => void;
}

export const ArtisticHeroGrid: React.FC<ArtisticHeroGridProps> = ({
  onSelectSeason,
  onExploreCareer,
}) => {
  const { seasons, totalCareerPoints, totalCareerAssists, totalCareerGames, playerProfile } = useCareer();

  const publicSeasons = seasons.filter((s) => s.isPublic);
  const activeSeason = seasons.find((s) => s.isCurrentSeason) || seasons[seasons.length - 1];
  const championshipsCount = seasons.reduce((acc, s) => {
    const titles = s.results.filter((r) => r.stage === 'Champion' || r.isTrophy).length;
    return acc + (titles > 0 ? titles : 0);
  }, 0);

  const avgAssists = (totalCareerAssists / Math.max(1, totalCareerGames)).toFixed(1);

  const getOrdinalWord = (n: number) => {
    const ordinals = ['', 'FIRST', 'SECOND', 'THIRD', 'FOURTH', 'FIFTH', 'SIXTH', 'SEVENTH', 'EIGHTH', 'NINTH', 'TENTH', 'ELEVENTH', 'TWELFTH', 'THIRTEENTH', 'FOURTEENTH', 'FIFTEENTH'];
    return ordinals[n] || `YEAR ${n}`;
  };

  return (
    <div className="w-full flex-1 grid grid-cols-1 lg:grid-cols-12 min-h-[640px] border-b border-theme-subtle">
      {/* Left Column: Player Identity, Massive Headline & Key Figures */}
      <div className="lg:col-span-5 p-8 sm:p-12 md:p-14 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-theme-subtle bg-theme-canvas relative overflow-hidden transition-colors duration-300">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#FF5D22]/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FF5D22] text-black text-[10px] font-black uppercase tracking-[0.25em] mb-6 shadow-[0_0_15px_rgba(255,93,34,0.3)]">
            <span>{playerProfile.role}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-black"></span>
            <span>NO. {playerProfile.jerseyNumber}</span>
          </div>

          <h1 className="text-6xl sm:text-7xl xl:text-[88px] 2xl:text-[96px] leading-[0.84] font-black tracking-tighter uppercase mb-6 mask-text font-display">
            {playerProfile.firstName + " " + playerProfile.lastName}
          </h1>

          <p className="font-serif-editorial text-lg sm:text-xl italic text-theme-muted leading-relaxed max-w-md">
            "{playerProfile.tagline}"
          </p>
        </div>

        <div className="space-y-6 pt-8 relative z-10">
          <div className="flex flex-wrap gap-8 sm:gap-12 items-end border-t border-theme-subtle pt-6">
            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-theme-faint mb-1 font-mono-code">
                Career Points
              </div>
              <div className="text-3xl sm:text-4xl font-black font-display tracking-tight text-[#FF5D22]">
                {totalCareerPoints.toLocaleString()}
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-theme-faint mb-1 font-mono-code">
                Assists Avg
              </div>
              <div className="text-3xl sm:text-4xl font-black font-display tracking-tight text-theme-main">
                {avgAssists}
              </div>
            </div>

            <div>
              <div className="text-[10px] uppercase tracking-[0.25em] text-theme-faint mb-1 font-mono-code">
                Seasons
              </div>
              <div className="text-3xl sm:text-4xl font-black font-display tracking-tight text-theme-main flex items-center gap-1.5">
                <span>{seasons.length}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              onClick={onExploreCareer}
              className="px-6 py-3 bg-theme-main text-theme-canvas font-bold uppercase tracking-wider text-xs flex items-center gap-2 hover:bg-[#FF5D22] hover:text-black transition-all cursor-pointer font-display shadow-md"
            >
              <span>View Complete Journey</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {activeSeason && (
              <button
                onClick={() => onSelectSeason(activeSeason.id)}
                className="px-5 py-3 border border-theme-subtle text-theme-muted hover:text-theme-main hover:border-theme-main text-xs font-mono-code tracking-wider uppercase transition-colors cursor-pointer"
              >
                View Active Season
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Right Column: Dynamic Interactive Season Cells */}
      <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 bg-theme-canvas transition-colors duration-300 auto-rows-fr">
        {publicSeasons.map((season, idx) => {
          const isCurrent = season.isCurrentSeason;
          const isRightCol = idx % 2 === 1;

          return (
            <div
              key={season.id}
              onClick={() => onSelectSeason(season.id)}
              className={`p-7 sm:p-8 flex flex-col justify-between relative overflow-hidden transition-all duration-300 cursor-pointer group select-none border-b border-theme-subtle min-h-[190px] ${!isRightCol ? 'sm:border-r border-theme-subtle' : ''
                } ${isCurrent
                  ? 'bg-[#FF5D22] text-black hover:bg-[#ff6e38]'
                  : 'bg-theme-canvas hover:bg-theme-panel text-theme-main'
                }`}
            >
              <div className="z-10">
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span
                    className={`text-[10px] font-mono-code font-semibold tracking-wider uppercase ${isCurrent ? 'text-black/70' : 'text-[#FF5D22]'
                      }`}
                  >
                    {isCurrent ? 'Current Season • ' + season.yearRange : season.yearRange}
                  </span>
                  {season.results.some((r) => r.stage === 'Champion' || r.isTrophy) && (
                    <span
                      className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1 ${isCurrent
                        ? 'bg-black text-[#FF5D22]'
                        : 'bg-[#FF5D22]/20 text-[#FF5D22]'
                        }`}
                    >
                      <Trophy className="w-2.5 h-2.5" />
                      <span>Title</span>
                    </span>
                  )}
                </div>

                <h3
                  className={`text-xl sm:text-2xl font-bold leading-tight font-display tracking-tight ${isCurrent ? 'text-black' : 'text-theme-main group-hover:text-[#FF5D22]'
                    }`}
                >
                  {season.team}
                </h3>

                <p
                  className={`text-[11px] mt-2 uppercase tracking-widest font-sans-body ${isCurrent ? 'text-black/70' : 'text-theme-faint'
                    }`}
                >
                  {season.league} • {season.country}
                </p>

                <div className="mt-4 flex items-center gap-4 text-xs font-mono-code">
                  <span className={isCurrent ? 'text-black/80 font-bold' : 'text-theme-muted'}>
                    {season.stats.pointsPerGame} PPG
                  </span>
                  <span className={isCurrent ? 'text-black/50' : 'text-theme-dim'}>•</span>
                  <span className={isCurrent ? 'text-black/80 font-bold' : 'text-theme-muted'}>
                    {season.stats.assistsPerGame} APG
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-6 z-10">
                <span
                  className={`text-[10px] uppercase font-mono-code font-bold flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity ${isCurrent ? 'text-black' : 'text-[#FF5D22]'
                    }`}
                >
                  <span>Season Brief</span>
                  <ArrowRight className="w-3 h-3" />
                </span>

                {/* Huge Watermark Season Number */}
                <span
                  className={`season-num font-black font-display text-7xl sm:text-8xl leading-none absolute bottom-[-10px] right-2 transition-all duration-300 pointer-events-none select-none ${isCurrent
                    ? '!text-black !opacity-15 group-hover:scale-105'
                    : 'text-theme-main opacity-5 group-hover:text-[#FF5D22] group-hover:opacity-20 group-hover:scale-105'
                    }`}
                >
                  {season.id}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
