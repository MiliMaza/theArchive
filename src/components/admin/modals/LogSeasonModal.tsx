import React, { useState } from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { Season, SeasonStatus } from '../../../types/career';
import { useCareer } from '../../../context/CareerContext';
import { MediaDropzone } from '../../common/MediaDropzone';

interface LogSeasonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (seasonId: string) => void;
}

const PRESET_HERO_IMAGES = [
  { label: 'Yoyogi Tokyo Arena', url: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1200&auto=format&fit=crop' },
  { label: 'WiZink Madrid Match', url: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1200&auto=format&fit=crop' },
  { label: 'Athens Derby Flame', url: 'https://images.unsplash.com/photo-1505666287802-931dc83948e9?q=80&w=1200&auto=format&fit=crop' },
  { label: 'Sydney Qudos Arena', url: 'https://images.unsplash.com/photo-1519861531473-9200262188bf?q=80&w=1200&auto=format&fit=crop' },
  { label: 'Locker Room Focus', url: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=1200&auto=format&fit=crop' },
];

export const LogSeasonModal: React.FC<LogSeasonModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { seasons, addSeason } = useCareer();

  const nextSeasonNum = seasons.length + 1;
  const nextId = nextSeasonNum < 10 ? `0${nextSeasonNum}` : `${nextSeasonNum}`;

  const [activeStep, setActiveStep] = useState<'basics' | 'stats' | 'narrative' | 'media'>('basics');

  // Form State
  const [formData, setFormData] = useState({
    id: nextId,
    seasonNumber: nextSeasonNum,
    slug: '2024-25',
    yearRange: '2024—2025',
    team: 'Fenerbahçe Beko',
    teamShort: 'Fenerbahçe',
    clubCode: 'FB',
    league: 'EuroLeague & Turkish BSL',
    tier: 'First Division EuroLeague',
    country: 'Turkey',
    countryCode: 'TR',
    city: 'Istanbul',
    jerseyNumber: 7,
    position: 'Point Guard',
    roleDescription: 'Starting Floor General & Primary Ball Handler',
    status: 'In Progress' as SeasonStatus,
    isCurrentSeason: true,
    heroImage: PRESET_HERO_IMAGES[0].url,

    // Stats
    games: 32,
    gamesStarted: 32,
    minutesPerGame: 31.4,
    pointsPerGame: 19.8,
    reboundsPerGame: 4.5,
    assistsPerGame: 8.9,
    stealsPerGame: 2.1,
    blocksPerGame: 0.3,
    fieldGoalPct: 50.8,
    threePointPct: 43.5,
    freeThrowPct: 91.0,
    totalPoints: 633,
    totalAssists: 284,
    totalRebounds: 144,
    playerEfficiencyRating: 29.4,

    // Silverware / achievements
    trophyTitle: 'Turkish Presidential Cup Champions',
    trophyStage: 'Champion',
    achievementList: 'EuroLeague MVP Candidate, Turkish Cup Finalist, Presidential Cup MVP',

    // Narrative
    tagline: 'Leading the charge in Istanbul: High-tempo precision in the EuroLeague crucible.',
    summary: 'A new European chapter defined by unrelenting defensive energy and masterclass pick-and-roll execution in Istanbul.',
    bestMoment: 'Clutch stepback buzzer-beater against Anadolu Efes in the derby final.',
    hardestChallenge: 'Managing double-overtime road games in Athens and Madrid within a single 48-hour window.',
    whatILearned: 'Patience in the half-court is a devastating weapon against aggressive drop coverages.',
    whatIImproved: 'Elevated pull-up three-point efficiency off ball screens to 43.5%.',
    coachName: 'Šarūnas Jasikevičius',
    coachRole: 'Head Coach',
    coachNote: 'Demands relentless pace, precise spacing, and defensive aggression.',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const achievementsArray = formData.achievementList
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const newSeasonObj: Season = {
      id: formData.id,
      slug: formData.slug,
      seasonNumber: formData.seasonNumber,
      yearRange: formData.yearRange,
      team: formData.team,
      teamShort: formData.teamShort || formData.team,
      clubCode: formData.clubCode || 'CLB',
      league: formData.league,
      tier: formData.tier,
      country: formData.country,
      countryCode: formData.countryCode,
      city: formData.city,
      jerseyNumber: Number(formData.jerseyNumber),
      position: formData.position,
      roleDescription: formData.roleDescription,
      status: formData.status,
      isCurrentSeason: formData.isCurrentSeason,
      heroImage: formData.heroImage,
      gallery: [
        {
          src: formData.heroImage,
          alt: `${formData.team} match entry`,
          caption: `${formData.team} season debut performance.`,
          tag: 'Match Day',
        },
        {
          src: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=900&auto=format&fit=crop',
          alt: 'Court celebration',
          caption: 'Championship celebration with team.',
          tag: 'Silverware',
        },
      ],
      stats: {
        games: Number(formData.games),
        gamesStarted: Number(formData.gamesStarted),
        minutesPerGame: Number(formData.minutesPerGame),
        pointsPerGame: Number(formData.pointsPerGame),
        reboundsPerGame: Number(formData.reboundsPerGame),
        assistsPerGame: Number(formData.assistsPerGame),
        stealsPerGame: Number(formData.stealsPerGame),
        blocksPerGame: Number(formData.blocksPerGame),
        fieldGoalPct: Number(formData.fieldGoalPct),
        threePointPct: Number(formData.threePointPct),
        freeThrowPct: Number(formData.freeThrowPct),
        totalPoints: Number(formData.totalPoints || Math.round(Number(formData.pointsPerGame) * Number(formData.games))),
        totalAssists: Number(formData.totalAssists || Math.round(Number(formData.assistsPerGame) * Number(formData.games))),
        totalRebounds: Number(formData.totalRebounds || Math.round(Number(formData.reboundsPerGame) * Number(formData.games))),
        playerEfficiencyRating: Number(formData.playerEfficiencyRating),
      },
      results: [
        {
          competition: formData.trophyTitle,
          stage: 'Champion',
          description: 'Silverware victory and tournament recognition.',
          isTrophy: true,
        },
        {
          competition: `${formData.league} Regular Season`,
          stage: 'Playoffs',
          description: 'Top seed playoff advancement.',
          isTrophy: false,
        },
      ],
      achievements: achievementsArray.length > 0 ? achievementsArray : ['Season Starter', 'All-League Honoree'],
      careerHighs: {
        points: { value: Math.round(Number(formData.pointsPerGame) + 12), opponent: 'League Rival', date: 'Jan 2025' },
        rebounds: { value: Math.round(Number(formData.reboundsPerGame) + 5), opponent: 'Derby Match', date: 'Dec 2024' },
        assists: { value: Math.round(Number(formData.assistsPerGame) + 6), opponent: 'Domestic Cup', date: 'Feb 2025' },
        steals: { value: 5, opponent: 'Road Game', date: 'Nov 2024' },
      },
      narrative: {
        tagline: formData.tagline,
        summary: formData.summary,
        bestMoment: formData.bestMoment,
        hardestChallenge: formData.hardestChallenge,
        whatILearned: formData.whatILearned,
        whatIImproved: formData.whatIImproved,
      },
      people: [
        {
          name: formData.coachName,
          role: 'Head Coach',
          note: formData.coachNote,
        },
      ],
      isPublic: true,
      completenessScore: 100,
      privateNotes: [`Logged season on ${new Date().toLocaleDateString()} into career vault.`],
    };

    addSeason(newSeasonObj);
    onSuccess(newSeasonObj.id);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-theme-panel border border-theme-subtle w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl relative my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 sm:px-8 py-5 border-b border-theme-subtle bg-theme-panel">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#FF5D22] text-black font-black font-mono-code flex items-center justify-center text-sm">
              +{formData.id}
            </div>
            <div>
              <span className="text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-widest block">
                Vault Campaign Registry
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-display uppercase tracking-tight text-theme-main">
                Log New Career Season (Season {formData.id})
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-theme-muted hover:text-[#FF5D22] hover:bg-theme-subtle rounded transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step navigation */}
        <div className="flex border-b border-theme-subtle bg-theme-subtle px-6 sm:px-8 overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveStep('basics')}
            className={`py-3 px-4 text-xs font-mono-code uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeStep === 'basics'
              ? 'border-[#FF5D22] text-[#FF5D22] font-bold bg-theme-panel'
              : 'border-transparent text-theme-muted hover:text-theme-main'
              }`}
          >
            1. Team & Club Info
          </button>
          <button
            type="button"
            onClick={() => setActiveStep('stats')}
            className={`py-3 px-4 text-xs font-mono-code uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeStep === 'stats'
              ? 'border-[#FF5D22] text-[#FF5D22] font-bold bg-theme-panel'
              : 'border-transparent text-theme-muted hover:text-theme-main'
              }`}
          >
            2. Stats
          </button>
          <button
            type="button"
            onClick={() => setActiveStep('narrative')}
            className={`py-3 px-4 text-xs font-mono-code uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap ${activeStep === 'narrative'
              ? 'border-[#FF5D22] text-[#FF5D22] font-bold bg-theme-panel'
              : 'border-transparent text-theme-muted hover:text-theme-main'
              }`}
          >
            3. Narrative & Silverware
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* STEP 1: BASICS */}
          {activeStep === 'basics' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1.5">
                    Season Number
                  </label>
                  <input
                    type="number"
                    value={formData.seasonNumber}
                    onChange={(e) => {
                      const num = Number(e.target.value);
                      const idStr = num < 10 ? `0${num}` : `${num}`;
                      setFormData({ ...formData, seasonNumber: num, id: idStr });
                    }}
                    className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1.5">
                    Year Range (e.g. 2024—2025)
                  </label>
                  <input
                    type="text"
                    value={formData.yearRange}
                    onChange={(e) => setFormData({ ...formData, yearRange: e.target.value })}
                    className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1.5">
                    Season Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as SeasonStatus })}
                    className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none cursor-pointer"
                  >
                    <option value="In Progress">In Progress (Active)</option>
                    <option value="Completed">Completed (Historical)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1.5">
                    Full Team Name
                  </label>
                  <input
                    type="text"
                    value={formData.team}
                    onChange={(e) => setFormData({ ...formData, team: e.target.value, teamShort: e.target.value })}
                    className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                    placeholder="e.g. Fenerbahçe Beko"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1.5">
                    Club Code (3 Letters)
                  </label>
                  <input
                    type="text"
                    value={formData.clubCode}
                    onChange={(e) => setFormData({ ...formData, clubCode: e.target.value.toUpperCase() })}
                    className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                    placeholder="e.g. FB"
                    maxLength={4}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1.5">
                    League & Competition
                  </label>
                  <input
                    type="text"
                    value={formData.league}
                    onChange={(e) => setFormData({ ...formData, league: e.target.value })}
                    className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                    placeholder="e.g. EuroLeague & Turkish BSL"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1.5">
                    Tier / Division
                  </label>
                  <input
                    type="text"
                    value={formData.tier}
                    onChange={(e) => setFormData({ ...formData, tier: e.target.value })}
                    className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                    placeholder="e.g. First Division EuroLeague"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1.5">
                    City
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                    placeholder="e.g. Istanbul"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1.5">
                    Country
                  </label>
                  <input
                    type="text"
                    value={formData.country}
                    onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                    className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                    placeholder="e.g. Turkey"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1.5">
                    Country Code (2 Letters)
                  </label>
                  <input
                    type="text"
                    value={formData.countryCode}
                    onChange={(e) => setFormData({ ...formData, countryCode: e.target.value.toUpperCase() })}
                    className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                    placeholder="e.g. TR"
                    maxLength={3}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1.5">
                    Jersey Number
                  </label>
                  <input
                    type="number"
                    value={formData.jerseyNumber}
                    onChange={(e) => setFormData({ ...formData, jerseyNumber: Number(e.target.value) })}
                    className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1.5">
                    Position
                  </label>
                  <input
                    type="text"
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1.5">
                    Current Active Campaign?
                  </label>
                  <div className="flex items-center gap-2 p-3 bg-theme-subtle border border-theme-subtle">
                    <input
                      type="checkbox"
                      id="isCurrentSeason"
                      checked={formData.isCurrentSeason}
                      onChange={(e) => setFormData({ ...formData, isCurrentSeason: e.target.checked })}
                      className="accent-[#FF5D22] w-4 h-4 cursor-pointer"
                    />
                    <label htmlFor="isCurrentSeason" className="text-xs font-mono-code text-theme-main cursor-pointer">
                      Mark as Current Season
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: STATS */}
          {activeStep === 'stats' && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1.5">
                    Games Played (GP)
                  </label>
                  <input
                    type="number"
                    value={formData.games}
                    onChange={(e) => setFormData({ ...formData, games: Number(e.target.value), gamesStarted: Number(e.target.value) })}
                    className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1.5">
                    Minutes / Game (MPG)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.minutesPerGame}
                    onChange={(e) => setFormData({ ...formData, minutesPerGame: Number(e.target.value) })}
                    className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1.5">
                    Points / Game (PPG)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.pointsPerGame}
                    onChange={(e) => setFormData({ ...formData, pointsPerGame: Number(e.target.value) })}
                    className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1.5">
                    Assists / Game (APG)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.assistsPerGame}
                    onChange={(e) => setFormData({ ...formData, assistsPerGame: Number(e.target.value) })}
                    className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1.5">
                    Rebounds / Game (RPG)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.reboundsPerGame}
                    onChange={(e) => setFormData({ ...formData, reboundsPerGame: Number(e.target.value) })}
                    className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1.5">
                    Steals / Game (SPG)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.stealsPerGame}
                    onChange={(e) => setFormData({ ...formData, stealsPerGame: Number(e.target.value) })}
                    className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1.5">
                    Blocks / Game (BPG)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.blocksPerGame}
                    onChange={(e) => setFormData({ ...formData, blocksPerGame: Number(e.target.value) })}
                    className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1.5">
                    Efficiency (PER)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formData.playerEfficiencyRating}
                    onChange={(e) => setFormData({ ...formData, playerEfficiencyRating: Number(e.target.value) })}
                    className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                  />
                </div>
              </div>

              {/* Shooting Acc */}
              <div className="p-4 bg-theme-subtle border border-theme-subtle space-y-4">
                <span className="text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-widest block font-bold">
                  Shooting Accuracy (%)
                </span>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                      Field Goal % (FG)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.fieldGoalPct}
                      onChange={(e) => setFormData({ ...formData, fieldGoalPct: Number(e.target.value) })}
                      className="w-full bg-theme-panel border border-theme-subtle p-2.5 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                      3-Point % (3PT)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.threePointPct}
                      onChange={(e) => setFormData({ ...formData, threePointPct: Number(e.target.value) })}
                      className="w-full bg-theme-panel border border-theme-subtle p-2.5 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                      Free Throw % (FT)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.freeThrowPct}
                      onChange={(e) => setFormData({ ...formData, freeThrowPct: Number(e.target.value) })}
                      className="w-full bg-theme-panel border border-theme-subtle p-2.5 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: NARRATIVE & SILVERWARE */}
          {activeStep === 'narrative' && (
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1.5">
                  Editorial Tagline (High-impact quote)
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                  placeholder="e.g. Masterclass in Istanbul: Tactical precision and playoff elevation."
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1.5">
                  Full Season Narrative Summary
                </label>
                <textarea
                  rows={3}
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-sans-body text-theme-main focus:border-[#FF5D22] focus:outline-none leading-relaxed"
                  placeholder="Write about the overarching atmosphere, tactical growth, and team chemistry..."
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono-code text-[#FF5D22] uppercase mb-1.5 font-bold">
                    Best Memory
                  </label>
                  <textarea
                    rows={2}
                    value={formData.bestMoment}
                    onChange={(e) => setFormData({ ...formData, bestMoment: e.target.value })}
                    className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                    placeholder="e.g. Clutch stepback buzzer-beater in the derby final."
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono-code text-amber-500 uppercase mb-1.5 font-bold">
                    Hardest Obstacle
                  </label>
                  <textarea
                    rows={2}
                    value={formData.hardestChallenge}
                    onChange={(e) => setFormData({ ...formData, hardestChallenge: e.target.value })}
                    className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                    placeholder="e.g. Navigating back-to-back double overtime road games."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono-code text-emerald-400 uppercase mb-1.5 font-bold">
                    What I Learned
                  </label>
                  <textarea
                    rows={2}
                    value={formData.whatILearned}
                    onChange={(e) => setFormData({ ...formData, whatILearned: e.target.value })}
                    className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                    placeholder="e.g. Patience in the half-court is a devastating weapon against drop coverages."
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono-code text-blue-400 uppercase mb-1.5 font-bold">
                    Improvements
                  </label>
                  <textarea
                    rows={2}
                    value={formData.whatIImproved}
                    onChange={(e) => setFormData({ ...formData, whatIImproved: e.target.value })}
                    className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                    placeholder="e.g. Elevated pull-up three-point efficiency off ball screens to 43.5%."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1.5">
                    Primary Silverware / Title
                  </label>
                  <input
                    type="text"
                    value={formData.trophyTitle}
                    onChange={(e) => setFormData({ ...formData, trophyTitle: e.target.value })}
                    className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                    placeholder="e.g. Turkish Presidential Cup Champion"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1.5">
                    Accolades & Honors
                  </label>
                  <input
                    type="text"
                    value={formData.achievementList}
                    onChange={(e) => setFormData({ ...formData, achievementList: e.target.value })}
                    className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                    placeholder="e.g. EuroLeague MVP Candidate, All-League First Team"
                  />
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: MEDIA */}
          {activeStep === 'media' && (
            <div className="space-y-6">
              <MediaDropzone
                value={formData.heroImage}
                onChange={(url) => setFormData({ ...formData, heroImage: url })}
                label="Season Hero Banner Image"
                sublabel="Drop atmospheric arena or match photography (PNG, JPG, WEBP)"
                aspectRatio="banner"
                placeholder="Drop hero banner photo here or click to browse"
                presets={PRESET_HERO_IMAGES.map((p) => ({ src: p.url, label: p.label }))}
              />

              {/* Campaign Summary Badge */}
              <div className="p-4 bg-theme-subtle border border-theme-subtle flex items-center gap-4">
                {formData.heroImage && (
                  <img src={formData.heroImage} alt="Preview" className="w-16 h-16 object-cover border border-theme-subtle flex-shrink-0" />
                )}
                <div className="space-y-1">
                  <div className="text-xs font-mono-code font-bold text-theme-main uppercase">
                    Season {formData.id} • {formData.team}
                  </div>
                  <div className="text-[10px] font-mono-code text-theme-faint">
                    {formData.league} • {formData.city}, {formData.country}
                  </div>
                  <div className="text-[10px] font-mono-code text-[#FF5D22] font-bold">
                    {formData.pointsPerGame} PPG • {formData.assistsPerGame} APG • {formData.games} GP
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-between pt-6 border-t border-theme-subtle">
            <div className="flex items-center gap-2">
              {activeStep !== 'basics' && (
                <button
                  type="button"
                  onClick={() => {
                    if (activeStep === 'media') setActiveStep('narrative');
                    else if (activeStep === 'narrative') setActiveStep('stats');
                    else if (activeStep === 'stats') setActiveStep('basics');
                  }}
                  className="px-4 py-2 bg-theme-subtle text-theme-main text-xs font-mono-code uppercase cursor-pointer hover:bg-theme-main hover:text-theme-canvas transition-colors border border-theme-subtle"
                >
                  Back
                </button>
              )}
            </div>

            <div className="flex items-center gap-3">
              {activeStep !== 'media' ? (
                <button
                  type="button"
                  onClick={() => {
                    if (activeStep === 'basics') setActiveStep('stats');
                    else if (activeStep === 'stats') setActiveStep('narrative');
                    else if (activeStep === 'narrative') setActiveStep('media');
                  }}
                  className="px-5 py-2.5 bg-[#FF5D22] text-black font-bold uppercase text-xs font-mono-code tracking-wider hover:bg-theme-main hover:text-theme-canvas transition-colors cursor-pointer"
                >
                  Continue to Next Step →
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#FF5D22] text-black font-bold uppercase text-xs font-mono-code tracking-widest hover:bg-emerald-500 hover:text-black transition-colors cursor-pointer flex items-center gap-2 shadow-lg"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Publish & Log Season {formData.id}</span>
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
