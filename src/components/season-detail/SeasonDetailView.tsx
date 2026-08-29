import React, { useState } from 'react';
import {
  Trophy,
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Flame,
  Users,
  Award,
  Sparkles,
  BookOpen,
  Image as ImageIcon,
  Lock,
} from 'lucide-react';
import { useCareer } from '../../context/CareerContext';
import { Season } from '../../types/career';

interface SeasonDetailViewProps {
  seasonId: string;
  onNavigateBack: () => void;
  onSelectSeason: (seasonId: string) => void;
  isAdminMode?: boolean;
}

export const SeasonDetailView: React.FC<SeasonDetailViewProps> = ({
  seasonId,
  onNavigateBack,
  onSelectSeason,
  isAdminMode = false,
}) => {
  const { seasons } = useCareer();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const seasonIndex = seasons.findIndex((s) => s.id === seasonId);
  const currentSeason = seasonIndex !== -1 ? seasons[seasonIndex] : seasons[0];

  const prevSeason = seasonIndex > 0 ? seasons[seasonIndex - 1] : null;
  const nextSeason = seasonIndex < seasons.length - 1 ? seasons[seasonIndex + 1] : null;

  if (!currentSeason) {
    return (
      <div className="w-full bg-theme-canvas min-h-[60vh] flex flex-col items-center justify-center p-12 text-center">
        <h2 className="text-2xl font-bold font-display uppercase mb-4 text-theme-main">Season File Not Found</h2>
        <button
          onClick={onNavigateBack}
          className="px-4 py-2 bg-[#FF5D22] text-black font-bold uppercase text-xs font-mono-code"
        >
          Return to Career Timeline
        </button>
      </div>
    );
  }

  return (
    <div className="w-full bg-theme-canvas min-h-screen pb-24 text-theme-main transition-colors duration-300">
      {/* Top Breadcrumb & Season Switcher Bar */}
      <div className="border-b border-theme-subtle bg-theme-panel/95 backdrop-blur-md sticky top-20 z-40 px-6 sm:px-12 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <button
            onClick={onNavigateBack}
            className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-theme-muted hover:text-[#FF5D22] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>All 6 Seasons</span>
          </button>

          {/* Quick Season Navigation (Prev / 1-6 / Next) */}
          <div className="flex items-center gap-2 sm:gap-4">
            {prevSeason ? (
              <button
                onClick={() => onSelectSeason(prevSeason.id)}
                className="p-2 bg-theme-subtle hover:bg-theme-subtle/80 text-theme-muted hover:text-theme-main rounded transition-colors cursor-pointer flex items-center gap-1 text-xs font-mono-code border border-theme-subtle"
                title={`Previous: ${prevSeason.team}`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Season {prevSeason.id}</span>
              </button>
            ) : (
              <div className="w-8" />
            )}

            <div className="flex items-center gap-1">
              {seasons.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onSelectSeason(s.id)}
                  className={`w-8 h-8 rounded text-xs font-mono-code font-bold transition-all cursor-pointer border ${
                    s.id === currentSeason.id
                      ? 'bg-[#FF5D22] text-black border-[#FF5D22] shadow-[0_0_12px_rgba(255,93,34,0.5)]'
                      : 'bg-theme-subtle border-theme-subtle text-theme-muted hover:text-theme-main hover:border-theme-hover'
                  }`}
                >
                  {s.id}
                </button>
              ))}
            </div>

            {nextSeason ? (
              <button
                onClick={() => onSelectSeason(nextSeason.id)}
                className="p-2 bg-theme-subtle hover:bg-theme-subtle/80 text-theme-muted hover:text-theme-main rounded transition-colors cursor-pointer flex items-center gap-1 text-xs font-mono-code border border-theme-subtle"
                title={`Next: ${nextSeason.team}`}
              >
                <span className="hidden sm:inline">Season {nextSeason.id}</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="w-8" />
            )}
          </div>
        </div>
      </div>

      {/* Season Hero Banner */}
      <div className="relative border-b border-theme-subtle bg-theme-panel-alt overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-transparent z-10" />
        <img
          src={currentSeason.heroImage}
          alt={currentSeason.team}
          className="absolute inset-0 w-full h-full object-cover grayscale contrast-125 opacity-35"
        />

        <div className="relative z-20 max-w-7xl mx-auto px-6 sm:px-12 py-16 sm:py-24">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="px-3 py-1 bg-[#FF5D22] text-black text-xs font-black uppercase font-mono-code tracking-widest">
              Season {currentSeason.id} • {currentSeason.yearRange}
            </span>
            <span className="px-3 py-1 bg-black/60 border border-white/20 text-white text-xs font-mono-code uppercase tracking-wider">
              {currentSeason.league}
            </span>
            <span className="text-xs font-mono-code text-white/90 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#FF5D22]" />
              <span>
                {currentSeason.city}, {currentSeason.country}
              </span>
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-black font-display uppercase tracking-tight text-white mb-4 drop-shadow">
            {currentSeason.team}
          </h1>

          <p className="font-serif-editorial text-2xl sm:text-3xl italic text-white/90 max-w-3xl leading-relaxed mb-8 drop-shadow">
            "{currentSeason.narrative.tagline}"
          </p>

          <div className="flex flex-wrap gap-8 items-center pt-6 border-t border-white/20">
            <div>
              <div className="text-[10px] font-mono-code text-white/60 uppercase tracking-widest">
                Jersey Number
              </div>
              <div className="text-2xl font-bold font-mono-code text-[#FF5D22]">
                #{currentSeason.jerseyNumber}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-mono-code text-white/60 uppercase tracking-widest">
                Position / Role
              </div>
              <div className="text-2xl font-bold font-display uppercase text-white">
                {currentSeason.position}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-mono-code text-white/60 uppercase tracking-widest">
                Campaign Status
              </div>
              <div className="text-2xl font-bold font-mono-code text-white">
                {currentSeason.status}
              </div>
            </div>

            <div>
              <div className="text-[10px] font-mono-code text-white/60 uppercase tracking-widest">
                Completeness
              </div>
              <div className="text-2xl font-bold font-mono-code text-white">
                {currentSeason.completenessScore}%
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Sections */}
      <div className="max-w-7xl mx-auto px-6 sm:px-12 pt-16 space-y-16">
        {/* Section 1: Statistical Production Matrix */}
        <section className="bg-theme-panel border border-theme-subtle p-8 sm:p-10 shadow-sm">
          <div className="flex items-center justify-between pb-6 mb-8 border-b border-theme-subtle">
            <div>
              <span className="text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-[0.25em] block mb-1">
                Analytical Performance
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-theme-main">
                Official Season Statistics
              </h2>
            </div>
            <span className="text-xs font-mono-code text-theme-faint">
              {currentSeason.stats.games} Games Played
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4 mb-8">
            <div className="p-4 bg-theme-subtle border border-theme-subtle text-center">
              <div className="text-[10px] font-mono-code text-theme-faint uppercase mb-1">PPG</div>
              <div className="text-2xl font-black font-display text-[#FF5D22]">
                {currentSeason.stats.pointsPerGame}
              </div>
            </div>

            <div className="p-4 bg-theme-subtle border border-theme-subtle text-center">
              <div className="text-[10px] font-mono-code text-theme-faint uppercase mb-1">APG</div>
              <div className="text-2xl font-black font-display text-theme-main">
                {currentSeason.stats.assistsPerGame}
              </div>
            </div>

            <div className="p-4 bg-theme-subtle border border-theme-subtle text-center">
              <div className="text-[10px] font-mono-code text-theme-faint uppercase mb-1">RPG</div>
              <div className="text-2xl font-black font-display text-theme-main">
                {currentSeason.stats.reboundsPerGame}
              </div>
            </div>

            <div className="p-4 bg-theme-subtle border border-theme-subtle text-center">
              <div className="text-[10px] font-mono-code text-theme-faint uppercase mb-1">SPG</div>
              <div className="text-2xl font-black font-display text-theme-main">
                {currentSeason.stats.stealsPerGame || '—'}
              </div>
            </div>

            <div className="p-4 bg-theme-subtle border border-theme-subtle text-center">
              <div className="text-[10px] font-mono-code text-theme-faint uppercase mb-1">FG%</div>
              <div className="text-2xl font-black font-mono-code text-theme-main">
                {currentSeason.stats.fieldGoalPct}%
              </div>
            </div>

            <div className="p-4 bg-theme-subtle border border-theme-subtle text-center">
              <div className="text-[10px] font-mono-code text-theme-faint uppercase mb-1">3PT%</div>
              <div className="text-2xl font-black font-mono-code text-theme-main">
                {currentSeason.stats.threePointPct}%
              </div>
            </div>

            <div className="p-4 bg-theme-subtle border border-theme-subtle text-center">
              <div className="text-[10px] font-mono-code text-theme-faint uppercase mb-1">FT%</div>
              <div className="text-2xl font-black font-mono-code text-theme-main">
                {currentSeason.stats.freeThrowPct}%
              </div>
            </div>

            <div className="p-4 bg-theme-subtle border border-theme-subtle text-center">
              <div className="text-[10px] font-mono-code text-theme-faint uppercase mb-1">PER</div>
              <div className="text-2xl font-black font-display text-[#FF5D22]">
                {currentSeason.stats.playerEfficiencyRating || '26.0'}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs font-mono-code text-theme-muted pt-4 border-t border-theme-subtle gap-4">
            <span>Total Points: {currentSeason.stats.totalPoints || '—'}</span>
            <span>Total Assists: {currentSeason.stats.totalAssists || '—'}</span>
            <span>Total Rebounds: {currentSeason.stats.totalRebounds || '—'}</span>
            <span>Minutes / Game: {currentSeason.stats.minutesPerGame || '31.0'}</span>
          </div>
        </section>

        {/* Section 2: Results, Trophies & Season Milestones */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 bg-theme-panel border border-theme-subtle p-8 shadow-sm">
            <span className="text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-[0.25em] block mb-2">
              Silverware & Outcomes
            </span>
            <h3 className="text-2xl font-black font-display uppercase tracking-tight text-theme-main mb-6">
              Competition Results
            </h3>

            <div className="space-y-4">
              {currentSeason.results.map((res, idx) => (
                <div
                  key={idx}
                  className={`p-4 border ${
                    res.stage === 'Champion'
                      ? 'bg-[#FF5D22]/10 border-[#FF5D22]'
                      : 'bg-theme-subtle border-theme-subtle'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-theme-main text-base font-display">
                      {res.competition}
                    </span>
                    <span
                      className={`text-xs font-mono-code font-bold uppercase px-2.5 py-0.5 rounded flex items-center gap-1.5 ${
                        res.stage === 'Champion'
                          ? 'bg-[#FF5D22] text-black'
                          : 'bg-theme-panel text-theme-main border border-theme-subtle'
                      }`}
                    >
                      {res.stage === 'Champion' && <Trophy className="w-3.5 h-3.5" />}
                      <span>{res.stage}</span>
                    </span>
                  </div>
                  {res.description && (
                    <p className="text-xs text-theme-muted font-sans-body">{res.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-6 bg-theme-panel border border-theme-subtle p-8 shadow-sm">
            <span className="text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-[0.25em] block mb-2">
              Accolades
            </span>
            <h3 className="text-2xl font-black font-display uppercase tracking-tight text-theme-main mb-6">
              Honors & Career Highs
            </h3>

            <div className="space-y-4 mb-6">
              {currentSeason.achievements.map((ach, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-theme-subtle border border-theme-subtle">
                  <Award className="w-4 h-4 text-[#FF5D22] shrink-0" />
                  <span className="text-xs font-mono-code text-theme-main font-medium">{ach}</span>
                </div>
              ))}
            </div>

            {/* Single Game Season Highs */}
            <div className="pt-4 border-t border-theme-subtle">
              <span className="text-[10px] font-mono-code text-theme-faint uppercase tracking-widest block mb-3">
                Season Single-Game Highs
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs font-mono-code">
                <div className="p-2.5 bg-theme-subtle border border-theme-subtle">
                  <div className="text-[9px] text-theme-faint">PTS</div>
                  <div className="text-lg font-bold text-[#FF5D22]">
                    {currentSeason.careerHighs.points?.value || '—'}
                  </div>
                  <div className="text-[8px] text-theme-muted truncate">
                    vs {currentSeason.careerHighs.points?.opponent}
                  </div>
                </div>

                <div className="p-2.5 bg-theme-subtle border border-theme-subtle">
                  <div className="text-[9px] text-theme-faint">AST</div>
                  <div className="text-lg font-bold text-theme-main">
                    {currentSeason.careerHighs.assists?.value || '—'}
                  </div>
                  <div className="text-[8px] text-theme-muted truncate">
                    vs {currentSeason.careerHighs.assists?.opponent}
                  </div>
                </div>

                <div className="p-2.5 bg-theme-subtle border border-theme-subtle">
                  <div className="text-[9px] text-theme-faint">REB</div>
                  <div className="text-lg font-bold text-theme-main">
                    {currentSeason.careerHighs.rebounds?.value || '—'}
                  </div>
                  <div className="text-[8px] text-theme-muted truncate">
                    vs {currentSeason.careerHighs.rebounds?.opponent}
                  </div>
                </div>

                <div className="p-2.5 bg-theme-subtle border border-theme-subtle">
                  <div className="text-[9px] text-theme-faint">STL</div>
                  <div className="text-lg font-bold text-theme-main">
                    {currentSeason.careerHighs.steals?.value || '—'}
                  </div>
                  <div className="text-[8px] text-theme-muted truncate">
                    vs {currentSeason.careerHighs.steals?.opponent}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: "My Season" — Personal Reflections & Emotional Story */}
        <section className="bg-theme-panel border border-theme-subtle p-8 sm:p-12 shadow-sm">
          <div className="max-w-3xl mb-8">
            <span className="text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-[0.25em] block mb-2">
              Subjective Archive
            </span>
            <h3 className="text-3xl font-black font-display uppercase tracking-tight text-theme-main mb-4">
              My Season Reflections
            </h3>
            <p className="font-serif-editorial text-xl italic text-theme-muted leading-relaxed">
              "{currentSeason.narrative.summary}"
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-theme-subtle">
            <div className="p-6 bg-theme-subtle border border-theme-subtle space-y-3">
              <span className="text-xs font-mono-code text-[#FF5D22] uppercase tracking-wider font-bold block">
                Best Memory & Defining Triumph
              </span>
              <p className="text-sm text-theme-muted leading-relaxed font-sans-body">
                {currentSeason.narrative.bestMoment}
              </p>
            </div>

            <div className="p-6 bg-theme-subtle border border-theme-subtle space-y-3">
              <span className="text-xs font-mono-code text-theme-faint uppercase tracking-wider font-bold block">
                Hardest Obstacle Overcome
              </span>
              <p className="text-sm text-theme-muted leading-relaxed font-sans-body">
                {currentSeason.narrative.hardestChallenge}
              </p>
            </div>

            <div className="p-6 bg-theme-subtle border border-theme-subtle space-y-3">
              <span className="text-xs font-mono-code text-theme-faint uppercase tracking-wider font-bold block">
                What I Learned (Tactical & Psychological)
              </span>
              <p className="text-sm text-theme-muted leading-relaxed font-sans-body">
                {currentSeason.narrative.whatILearned}
              </p>
            </div>

            <div className="p-6 bg-theme-subtle border border-theme-subtle space-y-3">
              <span className="text-xs font-mono-code text-theme-faint uppercase tracking-wider font-bold block">
                Craft Improvements
              </span>
              <p className="text-sm text-theme-muted leading-relaxed font-sans-body">
                {currentSeason.narrative.whatIImproved}
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Teammates & Coaching Staff */}
        <section className="bg-theme-panel border border-theme-subtle p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <Users className="w-5 h-5 text-[#FF5D22]" />
            <h3 className="text-2xl font-black font-display uppercase tracking-tight text-theme-main">
              The People of Season {currentSeason.id}
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {currentSeason.people.map((person, idx) => (
              <div key={idx} className="p-5 bg-theme-subtle border border-theme-subtle">
                <div className="text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-widest mb-1">
                  {person.role}
                </div>
                <div className="text-lg font-bold font-display uppercase text-theme-main mb-2">
                  {person.name}
                </div>
                {person.note && (
                  <p className="text-xs text-theme-muted font-sans-body">{person.note}</p>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Section 5: Season Visual Gallery */}
        <section className="bg-theme-panel border border-theme-subtle p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <ImageIcon className="w-5 h-5 text-[#FF5D22]" />
              <h3 className="text-2xl font-black font-display uppercase tracking-tight text-theme-main">
                Archival Photography & Moments
              </h3>
            </div>
            <span className="text-xs font-mono-code text-theme-faint">
              {currentSeason.gallery.length} Archival Assets
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {currentSeason.gallery.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedImage(img.src)}
                className="group relative aspect-[4/3] bg-theme-panel border border-theme-subtle overflow-hidden cursor-pointer shadow-sm"
              >
                <img
                  src={img.src}
                  alt={img.alt}
                  className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80" />
                <div className="absolute top-3 left-3 bg-black/80 px-2 py-0.5 text-[9px] font-mono-code text-[#FF5D22] uppercase border border-white/10">
                  {img.tag}
                </div>
                <div className="absolute bottom-3 left-3 right-3 text-xs text-white/90 font-sans-body">
                  {img.caption}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6 cursor-pointer"
        >
          <div className="max-w-4xl max-h-[85vh] relative" onClick={(e) => e.stopPropagation()}>
            <img
              src={selectedImage}
              alt="Archival capture full"
              className="max-w-full max-h-[80vh] object-contain border border-white/20"
            />
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-[#FF5D22] font-mono-code text-xs uppercase"
            >
              [Close Esc]
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
