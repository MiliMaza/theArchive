import React, { useState } from 'react';
import {
  Trophy,
  MapPin,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  Users,
  Award,
  Image as ImageIcon,
  Edit,
  Trash2,
  Play,
  Video,
} from 'lucide-react';
import { useCareer } from '../../context/CareerContext';
import { EditSeasonModal } from '../admin/modals/EditSeasonModal';
import { isMediaVideo } from '../../lib/storage';
import { useTheme } from '../../context/ThemeContext';

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
  const { isLight, toggleTheme } = useTheme();
  const { seasons, deleteSeason } = useCareer();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editModalTab, setEditModalTab] = useState<'basics' | 'stats' | 'reflections' | 'accolades' | 'people' | 'gallery'>('basics');
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const seasonIndex = seasons.findIndex((s) => s.id === seasonId);
  const currentSeason = seasonIndex !== -1 ? seasons[seasonIndex] : seasons[0];

  const prevSeason = seasonIndex > 0 ? seasons[seasonIndex - 1] : null;
  const nextSeason = seasonIndex < seasons.length - 1 ? seasons[seasonIndex + 1] : null;

  const openEditTab = (tab: 'basics' | 'stats' | 'reflections' | 'accolades' | 'people' | 'gallery') => {
    setEditModalTab(tab);
    setIsEditModalOpen(true);
  };

  const handleDeleteSeason = () => {
    if (!currentSeason) return;
    deleteSeason(currentSeason.id);
    setShowDeleteConfirm(false);
    onNavigateBack();
  };

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
      <div className={`border-b border-theme-subtle bg-theme-panel/95 backdrop-blur-md sticky top-20 z-40 px-6 sm:px-12 py-4 shadow-sm ${isLight ? 'bg-theme-canvas' : 'bg-theme-canvas/95'}`}>
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={onNavigateBack}
              className="flex items-center gap-2 text-xs font-mono-code uppercase tracking-wider text-theme-muted hover:text-[#FF5D22] transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>All {seasons.length} Seasons</span>
            </button>

            {/* Quick Admin Actions (Edit / Delete) */}
            <div className="hidden sm:flex items-center gap-2 pl-4 border-l border-theme-subtle">
              <button
                onClick={() => openEditTab('basics')}
                className="px-3 py-1 bg-theme-subtle hover:bg-[#FF5D22] hover:text-black text-theme-main text-[11px] font-mono-code font-bold uppercase transition-colors cursor-pointer flex items-center gap-1.5 border border-theme-subtle shadow-sm"
                title="Edit Season Details"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Season File</span>
              </button>

              {showDeleteConfirm ? (
                <div className="flex items-center gap-1.5 bg-red-600/10 border border-red-600/30 px-2 py-0.5 rounded">
                  <span className="text-[10px] font-mono-code text-red-500 font-bold uppercase">Delete Season {currentSeason.id}?</span>
                  <button
                    onClick={handleDeleteSeason}
                    className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-mono-code font-bold uppercase cursor-pointer"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="px-1.5 py-0.5 bg-theme-subtle text-theme-muted text-[10px] font-mono-code uppercase cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-2.5 py-1 bg-theme-subtle hover:bg-red-600 hover:text-white text-red-500 text-[11px] font-mono-code uppercase transition-colors cursor-pointer flex items-center gap-1 border border-theme-subtle"
                  title="Delete Season"
                >
                  <Trash2 className="w-3 h-3" />
                  <span>Delete</span>
                </button>
              )}
            </div>
          </div>

          {/* Quick Season Navigation (Prev / 1-N / Next) */}
          <div className="flex items-center gap-2 sm:gap-4 overflow-x-auto pb-1 sm:pb-0">
            {prevSeason ? (
              <button
                onClick={() => onSelectSeason(prevSeason.id)}
                className="p-2 bg-theme-subtle hover:bg-theme-subtle/80 text-theme-muted hover:text-theme-main rounded transition-colors cursor-pointer flex items-center gap-1 text-xs font-mono-code border border-theme-subtle flex-shrink-0"
                title={`Previous: ${prevSeason.team}`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Season {prevSeason.id}</span>
              </button>
            ) : (
              <div className="w-8" />
            )}

            <div className="flex items-center gap-1 flex-shrink-0">
              {seasons.map((s) => (
                <button
                  key={s.id}
                  onClick={() => onSelectSeason(s.id)}
                  className={`w-8 h-8 rounded text-xs font-mono-code font-bold transition-all cursor-pointer border ${s.id === currentSeason.id
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
                className="p-2 bg-theme-subtle hover:bg-theme-subtle/80 text-theme-muted hover:text-theme-main rounded transition-colors cursor-pointer flex items-center gap-1 text-xs font-mono-code border border-theme-subtle flex-shrink-0"
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
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <div className="flex flex-wrap items-center gap-3">
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

            <button
              onClick={() => openEditTab('basics')}
              className="px-3 py-1.5 bg-black/70 hover:bg-[#FF5D22] text-white hover:text-black border border-white/20 hover:border-[#FF5D22] text-xs font-mono-code uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 backdrop-blur-sm"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Season Header</span>
            </button>
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
          <div className="flex flex-wrap items-center justify-between pb-6 mb-8 border-b border-theme-subtle gap-4">
            <div>
              <span className="text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-[0.25em] block mb-1">
                Analytical Performance
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-theme-main">
                Official Season Statistics
              </h2>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono-code text-theme-faint hidden sm:inline">
                {currentSeason.stats.games} Games Played
              </span>
              <button
                onClick={() => openEditTab('stats')}
                className="px-3 py-1.5 bg-theme-subtle hover:bg-[#FF5D22] text-theme-main hover:text-black border border-theme-subtle text-xs font-mono-code uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Stats & Totals</span>
              </button>
            </div>
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
                {currentSeason.stats.stealsPerGame}
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
                {currentSeason.stats.playerEfficiencyRating}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between text-xs font-mono-code text-theme-muted pt-4 border-t border-theme-subtle gap-4">
            <span className="font-bold text-theme-main">Total Season Points: {currentSeason.stats.totalPoints !== undefined ? currentSeason.stats.totalPoints : Math.round(currentSeason.stats.pointsPerGame * currentSeason.stats.games)}</span>
            <span>Total Season Assists: {currentSeason.stats.totalAssists !== undefined ? currentSeason.stats.totalAssists : Math.round(currentSeason.stats.assistsPerGame * currentSeason.stats.games)}</span>
            <span>Total Season Rebounds: {currentSeason.stats.totalRebounds !== undefined ? currentSeason.stats.totalRebounds : Math.round(currentSeason.stats.reboundsPerGame * currentSeason.stats.games)}</span>
            <span>Minutes / Game: {currentSeason.stats.minutesPerGame}</span>
          </div>
        </section>

        {/* Section 2: Results, Trophies & Season Milestones */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-6 bg-theme-panel border border-theme-subtle p-8 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-[0.25em] block">
                  Silverware & Outcomes
                </span>
                <button
                  onClick={() => openEditTab('accolades')}
                  className="p-1 text-theme-muted hover:text-[#FF5D22] text-xs font-mono-code uppercase flex items-center gap-1 cursor-pointer"
                >
                  <Edit className="w-3.5 h-3.5" />
                  <span>Edit Results</span>
                </button>
              </div>

              <h3 className="text-2xl font-black font-display uppercase tracking-tight text-theme-main mb-6">
                Competition Results
              </h3>

              <div className="space-y-4">
                {currentSeason.results.map((res, idx) => (
                  <div
                    key={idx}
                    className={`p-4 border ${res.stage === 'Champion' || res.isTrophy
                      ? 'bg-[#FF5D22]/10 border-[#FF5D22]'
                      : 'bg-theme-subtle border-theme-subtle'
                      }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-theme-main text-base font-display">
                        {res.competition}
                      </span>
                      <span
                        className={`text-xs font-mono-code font-bold uppercase px-2.5 py-0.5 rounded flex items-center gap-1.5 ${res.stage === 'Champion' || res.isTrophy
                          ? 'bg-[#FF5D22] text-black'
                          : 'bg-theme-panel text-theme-main border border-theme-subtle'
                          }`}
                      >
                        {(res.stage === 'Champion' || res.isTrophy) && <Trophy className="w-3.5 h-3.5" />}
                        <span>{res.stage}</span>
                      </span>
                    </div>
                    {res.description && (
                      <p className="text-xs text-theme-muted font-sans-body">{res.description}</p>
                    )}
                  </div>
                ))}
                {currentSeason.results.length === 0 && (
                  <div className="text-xs font-mono-code text-theme-faint py-4 text-center">
                    No tournament finishes logged for this season.
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="lg:col-span-6 bg-theme-panel border border-theme-subtle p-8 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <span className="text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-[0.25em] block">
                Accolades
              </span>
              <button
                onClick={() => openEditTab('accolades')}
                className="p-1 text-theme-muted hover:text-[#FF5D22] text-xs font-mono-code uppercase flex items-center gap-1 cursor-pointer"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Edit Accolades</span>
              </button>
            </div>

            <h3 className="text-2xl font-black font-display uppercase tracking-tight text-theme-main mb-6">
              Honors & Career Highs
            </h3>

            <div className="space-y-3 mb-6">
              {currentSeason.achievements.map((ach, idx) => (
                <div key={idx} className="flex items-center gap-3 p-3 bg-theme-subtle border border-theme-subtle">
                  <Award className="w-4 h-4 text-[#FF5D22] shrink-0" />
                  <span className="text-xs font-mono-code text-theme-main font-medium">{ach}</span>
                </div>
              ))}
              {currentSeason.achievements.length === 0 && (
                <div className="text-xs font-mono-code text-theme-faint py-3 text-center">
                  No individual honors logged for this season.
                </div>
              )}
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
                    {currentSeason.careerHighs?.points?.value || '—'}
                  </div>
                  <div className="text-[8px] text-theme-muted truncate">
                    vs {currentSeason.careerHighs?.points?.opponent || 'Opponent'}
                  </div>
                </div>

                <div className="p-2.5 bg-theme-subtle border border-theme-subtle">
                  <div className="text-[9px] text-theme-faint">AST</div>
                  <div className="text-lg font-bold text-theme-main">
                    {currentSeason.careerHighs?.assists?.value || '—'}
                  </div>
                  <div className="text-[8px] text-theme-muted truncate">
                    vs {currentSeason.careerHighs?.assists?.opponent || 'Opponent'}
                  </div>
                </div>

                <div className="p-2.5 bg-theme-subtle border border-theme-subtle">
                  <div className="text-[9px] text-theme-faint">REB</div>
                  <div className="text-lg font-bold text-theme-main">
                    {currentSeason.careerHighs?.rebounds?.value || '—'}
                  </div>
                  <div className="text-[8px] text-theme-muted truncate">
                    vs {currentSeason.careerHighs?.rebounds?.opponent || 'Opponent'}
                  </div>
                </div>

                <div className="p-2.5 bg-theme-subtle border border-theme-subtle">
                  <div className="text-[9px] text-theme-faint">STL</div>
                  <div className="text-lg font-bold text-theme-main">
                    {currentSeason.careerHighs?.steals?.value || '—'}
                  </div>
                  <div className="text-[8px] text-theme-muted truncate">
                    vs {currentSeason.careerHighs?.steals?.opponent || 'Opponent'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Section 3: "My Season" — Personal Reflections & Emotional Story */}
        <section className="bg-theme-panel border border-theme-subtle p-8 sm:p-12 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
            <div className="max-w-3xl">
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

            <button
              onClick={() => openEditTab('reflections')}
              className="px-3 py-1.5 bg-theme-subtle hover:bg-[#FF5D22] text-theme-main hover:text-black border border-theme-subtle text-xs font-mono-code uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Reflections</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6 border-t border-theme-subtle">
            <div className="p-6 bg-theme-subtle border border-theme-subtle space-y-3">
              <span className="text-xs font-mono-code text-[#FF5D22] uppercase tracking-wider font-bold block">
                Best Memory
              </span>
              <p className="text-sm text-theme-muted leading-relaxed font-sans-body">
                {currentSeason.narrative.bestMoment || 'No memory logged yet.'}
              </p>
            </div>

            <div className="p-6 bg-theme-subtle border border-theme-subtle space-y-3">
              <span className="text-xs font-mono-code text-amber-500 uppercase tracking-wider font-bold block">
                Hardest Obstacle
              </span>
              <p className="text-sm text-theme-muted leading-relaxed font-sans-body">
                {currentSeason.narrative.hardestChallenge || 'No obstacle logged yet.'}
              </p>
            </div>

            <div className="p-6 bg-theme-subtle border border-theme-subtle space-y-3">
              <span className="text-xs font-mono-code text-emerald-400 uppercase tracking-wider font-bold block">
                What I Learned
              </span>
              <p className="text-sm text-theme-muted leading-relaxed font-sans-body">
                {currentSeason.narrative.whatILearned || 'No learning reflection logged yet.'}
              </p>
            </div>

            <div className="p-6 bg-theme-subtle border border-theme-subtle space-y-3">
              <span className="text-xs font-mono-code text-blue-400 uppercase tracking-wider font-bold block">
                Improvements
              </span>
              <p className="text-sm text-theme-muted leading-relaxed font-sans-body">
                {currentSeason.narrative.whatIImproved || 'No improvement logged yet.'}
              </p>
            </div>
          </div>
        </section>

        {/* Section 4: Teammates & Coaching Staff */}
        <section className="bg-theme-panel border border-theme-subtle p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-[#FF5D22]" />
              <h3 className="text-2xl font-black font-display uppercase tracking-tight text-theme-main">
                The People of Season {currentSeason.id}
              </h3>
            </div>

            <button
              onClick={() => openEditTab('people')}
              className="px-3 py-1.5 bg-theme-subtle hover:bg-[#FF5D22] text-theme-main hover:text-black border border-theme-subtle text-xs font-mono-code uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <Edit className="w-3.5 h-3.5" />
              <span>Edit Staff & Teammates</span>
            </button>
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
            {currentSeason.people.length === 0 && (
              <div className="text-xs font-mono-code text-theme-faint col-span-3 py-4 text-center">
                No teammates or coaching staff logged yet for this season.
              </div>
            )}
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

            <div className="flex items-center gap-3">
              <span className="text-xs font-mono-code text-theme-faint hidden sm:inline">
                {currentSeason.gallery.length} Archival Assets
              </span>
              <button
                onClick={() => openEditTab('gallery')}
                className="px-3 py-1.5 bg-theme-subtle hover:bg-[#FF5D22] text-theme-main hover:text-black border border-theme-subtle text-xs font-mono-code uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Edit className="w-3.5 h-3.5" />
                <span>Manage Photos</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {currentSeason.gallery.map((img, idx) => {
              const isVideo = isMediaVideo(img.src, img.mediaType);
              return (
                <div
                  key={idx}
                  onClick={() => setSelectedImage(img.src)}
                  className="group relative aspect-[4/3] bg-theme-panel border border-theme-subtle overflow-hidden cursor-pointer shadow-sm"
                >
                  {isVideo ? (
                    <div className="relative w-full h-full bg-black flex items-center justify-center">
                      <video
                        src={img.src}
                        preload="metadata"
                        className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-500 opacity-90"
                      />
                      {/* Play button overlay */}
                      <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                        <div className="w-12 h-12 rounded-full bg-black/70 border border-white/20 flex items-center justify-center text-[#FF5D22] group-hover:scale-110 group-hover:bg-[#FF5D22] group-hover:text-black transition-all shadow-lg">
                          <Play className="w-5 h-5 fill-current ml-0.5" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-full object-cover grayscale contrast-125 group-hover:scale-105 group-hover:grayscale-0 transition-all duration-500"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-80 pointer-events-none" />
                  <div className="absolute top-3 left-3 bg-black/80 px-2 py-0.5 text-[9px] font-mono-code text-[#FF5D22] uppercase border border-white/10 flex items-center gap-1">
                    {isVideo && <Video className="w-3 h-3" />}
                    <span>{img.tag}</span>
                  </div>
                  <div className="absolute bottom-3 left-3 right-3 text-xs text-white/90 font-sans-body pointer-events-none">
                    {img.caption}
                  </div>
                </div>
              );
            })}
            {currentSeason.gallery.length === 0 && (
              <div className="text-xs font-mono-code text-theme-faint col-span-3 py-8 text-center">
                No archival photos or videos added to this season yet. Click "Manage Photos" to upload files or add presets.
              </div>
            )}
          </div>
        </section>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div
          onClick={() => setSelectedImage(null)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-6 cursor-pointer"
        >
          <div className="max-w-4xl max-h-[85vh] relative w-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {isMediaVideo(selectedImage) ? (
              <video
                src={selectedImage}
                controls
                autoPlay
                className="max-w-full max-h-[80vh] rounded border border-white/20 shadow-2xl bg-black"
              />
            ) : (
              <img
                src={selectedImage}
                alt="Archival capture full"
                className="max-w-full max-h-[80vh] object-contain border border-white/20 shadow-2xl"
              />
            )}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-[#FF5D22] font-mono-code text-xs uppercase cursor-pointer"
            >
              [Close Esc]
            </button>
          </div>
        </div>
      )}

      {/* Comprehensive Edit Season Modal */}
      {isEditModalOpen && currentSeason && (
        <EditSeasonModal
          season={currentSeason}
          isOpen={isEditModalOpen}
          initialTab={editModalTab}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};
