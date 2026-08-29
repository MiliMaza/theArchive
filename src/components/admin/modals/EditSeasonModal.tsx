import React, { useState } from 'react';
import { X, CheckCircle2, Trash2 } from 'lucide-react';
import { Season } from '../../../types/career';
import { useCareer } from '../../../context/CareerContext';

interface EditSeasonModalProps {
  season: Season;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const EditSeasonModal: React.FC<EditSeasonModalProps> = ({ season, isOpen, onClose, onSuccess }) => {
  const { updateSeason, deleteSeason } = useCareer();

  const [formData, setFormData] = useState({
    team: season.team,
    league: season.league,
    city: season.city,
    country: season.country,
    yearRange: season.yearRange,
    jerseyNumber: season.jerseyNumber,
    position: season.position,
    games: season.stats.games,
    pointsPerGame: season.stats.pointsPerGame,
    assistsPerGame: season.stats.assistsPerGame,
    reboundsPerGame: season.stats.reboundsPerGame,
    stealsPerGame: season.stats.stealsPerGame || 1.5,
    fieldGoalPct: season.stats.fieldGoalPct || 48.0,
    threePointPct: season.stats.threePointPct || 40.0,
    freeThrowPct: season.stats.freeThrowPct || 90.0,
    tagline: season.narrative.tagline,
    summary: season.narrative.summary,
    heroImage: season.heroImage,
    isPublic: season.isPublic,
    isCurrentSeason: season.isCurrentSeason,
  });

  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    updateSeason(season.id, {
      team: formData.team,
      league: formData.league,
      city: formData.city,
      country: formData.country,
      yearRange: formData.yearRange,
      jerseyNumber: Number(formData.jerseyNumber),
      position: formData.position,
      heroImage: formData.heroImage,
      isPublic: formData.isPublic,
      isCurrentSeason: formData.isCurrentSeason,
      stats: {
        ...season.stats,
        games: Number(formData.games),
        pointsPerGame: Number(formData.pointsPerGame),
        assistsPerGame: Number(formData.assistsPerGame),
        reboundsPerGame: Number(formData.reboundsPerGame),
        stealsPerGame: Number(formData.stealsPerGame),
        fieldGoalPct: Number(formData.fieldGoalPct),
        threePointPct: Number(formData.threePointPct),
        freeThrowPct: Number(formData.freeThrowPct),
        totalPoints: Math.round(Number(formData.pointsPerGame) * Number(formData.games)),
        totalAssists: Math.round(Number(formData.assistsPerGame) * Number(formData.games)),
        totalRebounds: Math.round(Number(formData.reboundsPerGame) * Number(formData.games)),
      },
      narrative: {
        ...season.narrative,
        tagline: formData.tagline,
        summary: formData.summary,
      },
    });

    if (onSuccess) onSuccess();
    onClose();
  };

  const handleDelete = () => {
    deleteSeason(season.id);
    if (onSuccess) onSuccess();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-theme-panel border border-theme-subtle w-full max-w-2xl flex flex-col shadow-2xl relative my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-theme-subtle bg-theme-panel">
          <div>
            <span className="text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-widest block">
              Editing Season File
            </span>
            <h2 className="text-xl font-black font-display uppercase tracking-tight text-theme-main">
              Season {season.id} — {season.team} ({season.yearRange})
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-theme-muted hover:text-[#FF5D22] hover:bg-theme-subtle rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                Team Name
              </label>
              <input
                type="text"
                value={formData.team}
                onChange={(e) => setFormData({ ...formData, team: e.target.value })}
                className="w-full bg-theme-subtle border border-theme-subtle p-2.5 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                League & Tier
              </label>
              <input
                type="text"
                value={formData.league}
                onChange={(e) => setFormData({ ...formData, league: e.target.value })}
                className="w-full bg-theme-subtle border border-theme-subtle p-2.5 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                City
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full bg-theme-subtle border border-theme-subtle p-2.5 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                Country
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                className="w-full bg-theme-subtle border border-theme-subtle p-2.5 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                Year Range
              </label>
              <input
                type="text"
                value={formData.yearRange}
                onChange={(e) => setFormData({ ...formData, yearRange: e.target.value })}
                className="w-full bg-theme-subtle border border-theme-subtle p-2.5 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
              />
            </div>
          </div>

          {/* Stats quick edit */}
          <div className="p-4 bg-theme-subtle border border-theme-subtle space-y-3">
            <span className="text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-widest block font-bold">
              Key Production Stats
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div>
                <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                  Games (GP)
                </label>
                <input
                  type="number"
                  value={formData.games}
                  onChange={(e) => setFormData({ ...formData, games: Number(e.target.value) })}
                  className="w-full bg-theme-panel border border-theme-subtle p-2 text-xs font-mono-code text-theme-main"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                  PPG
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.pointsPerGame}
                  onChange={(e) => setFormData({ ...formData, pointsPerGame: Number(e.target.value) })}
                  className="w-full bg-theme-panel border border-theme-subtle p-2 text-xs font-mono-code text-[#FF5D22] font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                  APG
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.assistsPerGame}
                  onChange={(e) => setFormData({ ...formData, assistsPerGame: Number(e.target.value) })}
                  className="w-full bg-theme-panel border border-theme-subtle p-2 text-xs font-mono-code text-theme-main font-bold"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                  RPG
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.reboundsPerGame}
                  onChange={(e) => setFormData({ ...formData, reboundsPerGame: Number(e.target.value) })}
                  className="w-full bg-theme-panel border border-theme-subtle p-2 text-xs font-mono-code text-theme-main"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              <div>
                <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                  FG %
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.fieldGoalPct}
                  onChange={(e) => setFormData({ ...formData, fieldGoalPct: Number(e.target.value) })}
                  className="w-full bg-theme-panel border border-theme-subtle p-2 text-xs font-mono-code text-theme-main"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                  3PT %
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.threePointPct}
                  onChange={(e) => setFormData({ ...formData, threePointPct: Number(e.target.value) })}
                  className="w-full bg-theme-panel border border-theme-subtle p-2 text-xs font-mono-code text-theme-main"
                />
              </div>
              <div>
                <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                  FT %
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={formData.freeThrowPct}
                  onChange={(e) => setFormData({ ...formData, freeThrowPct: Number(e.target.value) })}
                  className="w-full bg-theme-panel border border-theme-subtle p-2 text-xs font-mono-code text-theme-main"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
              Editorial Tagline
            </label>
            <input
              type="text"
              value={formData.tagline}
              onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
              className="w-full bg-theme-subtle border border-theme-subtle p-2.5 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
              Hero Photo URL
            </label>
            <input
              type="text"
              value={formData.heroImage}
              onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
              className="w-full bg-theme-subtle border border-theme-subtle p-2.5 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-theme-subtle border border-theme-subtle">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="editIsCurrent"
                checked={formData.isCurrentSeason}
                onChange={(e) => setFormData({ ...formData, isCurrentSeason: e.target.checked })}
                className="accent-[#FF5D22] w-4 h-4 cursor-pointer"
              />
              <label htmlFor="editIsCurrent" className="text-xs font-mono-code text-theme-main cursor-pointer">
                Active Spotlight Campaign
              </label>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="editIsPublic"
                checked={formData.isPublic}
                onChange={(e) => setFormData({ ...formData, isPublic: e.target.checked })}
                className="accent-[#FF5D22] w-4 h-4 cursor-pointer"
              />
              <label htmlFor="editIsPublic" className="text-xs font-mono-code text-theme-main cursor-pointer">
                Publicly Visible
              </label>
            </div>
          </div>

          {/* Delete Danger Zone */}
          <div className="pt-3 border-t border-theme-subtle flex items-center justify-between">
            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-3 py-1.5 bg-red-600 text-white font-bold text-xs font-mono-code uppercase cursor-pointer hover:bg-red-700 transition-colors"
                >
                  Yes, Delete Season
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-3 py-1.5 bg-theme-subtle text-theme-muted text-xs font-mono-code uppercase cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="text-xs font-mono-code text-red-500 hover:text-red-400 flex items-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Season</span>
              </button>
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-theme-subtle text-theme-main text-xs font-mono-code uppercase cursor-pointer hover:bg-theme-main hover:text-theme-canvas transition-colors border border-theme-subtle"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-[#FF5D22] text-black font-bold uppercase text-xs font-mono-code tracking-wider hover:bg-emerald-500 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
