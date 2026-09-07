import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Trash2,
  Plus,
  Trophy,
  Award,
  Users,
  Image as ImageIcon,
  BookOpen,
  Activity,
  Upload,
  Sparkles,
  Calculator,
  Flame,
} from 'lucide-react';
import {
  Season,
  SeasonPerson,
  SeasonImage,
  SeasonResult,
  SeasonCareerHighs,
} from '../../../types/career';
import { useCareer } from '../../../context/CareerContext';

interface EditSeasonModalProps {
  season: Season;
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  initialTab?: 'basics' | 'stats' | 'reflections' | 'accolades' | 'people' | 'gallery';
}

const PRESET_PHOTO_TEMPLATES = [
  {
    tag: 'Match Day',
    caption: 'Game action in decisive championship quarter.',
    src: 'https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1000&auto=format&fit=crop',
  },
  {
    tag: 'Championship',
    caption: 'Trophy ceremony celebration with staff and teammates.',
    src: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?q=80&w=1000&auto=format&fit=crop',
  },
  {
    tag: 'Training',
    caption: 'High-intensity conditioning and shooting drills.',
    src: 'https://images.unsplash.com/photo-1519766304817-4f37bda74a29?q=80&w=1000&auto=format&fit=crop',
  },
  {
    tag: 'Arena',
    caption: 'Home crowd energy prior to playoff tip-off.',
    src: 'https://images.unsplash.com/photo-1518063319789-7217e6706b04?q=80&w=1000&auto=format&fit=crop',
  },
  {
    tag: 'Travel',
    caption: 'Continental travel and away game preparation.',
    src: 'https://images.unsplash.com/photo-1509198397868-475647b2a1e5?q=80&w=1000&auto=format&fit=crop',
  },
];

export const EditSeasonModal: React.FC<EditSeasonModalProps> = ({
  season,
  isOpen,
  onClose,
  onSuccess,
  initialTab = 'basics',
}) => {
  const { updateSeason, deleteSeason } = useCareer();

  const [activeTab, setActiveTab] = useState<'basics' | 'stats' | 'reflections' | 'accolades' | 'people' | 'gallery'>(initialTab);

  useEffect(() => {
    if (isOpen && initialTab) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);

  // 1. General Basics
  const [team, setTeam] = useState(season.team);
  const [teamShort, setTeamShort] = useState(season.teamShort || season.team);
  const [clubCode, setClubCode] = useState(season.clubCode || 'CLB');
  const [league, setLeague] = useState(season.league);
  const [tier, setTier] = useState(season.tier || 'First Tier Professional');
  const [city, setCity] = useState(season.city);
  const [country, setCountry] = useState(season.country);
  const [yearRange, setYearRange] = useState(season.yearRange);
  const [jerseyNumber, setJerseyNumber] = useState(season.jerseyNumber);
  const [position, setPosition] = useState(season.position);
  const [roleDescription, setRoleDescription] = useState(season.roleDescription || '');
  const [status, setStatus] = useState(season.status);
  const [isPublic, setIsPublic] = useState(season.isPublic);
  const [isCurrentSeason, setIsCurrentSeason] = useState(season.isCurrentSeason);
  const [heroImage, setHeroImage] = useState(season.heroImage);

  // 2. Stats & Totals
  const [games, setGames] = useState<number>(season.stats.games || 0);
  const [gamesStarted, setGamesStarted] = useState<number>(season.stats.gamesStarted || season.stats.games || 0);
  const [minutesPerGame, setMinutesPerGame] = useState<number>(season.stats.minutesPerGame || 30.0);
  const [pointsPerGame, setPointsPerGame] = useState<number>(season.stats.pointsPerGame || 0);
  const [assistsPerGame, setAssistsPerGame] = useState<number>(season.stats.assistsPerGame || 0);
  const [reboundsPerGame, setReboundsPerGame] = useState<number>(season.stats.reboundsPerGame || 0);
  const [stealsPerGame, setStealsPerGame] = useState<number>(season.stats.stealsPerGame || 0);
  const [blocksPerGame, setBlocksPerGame] = useState<number>(season.stats.blocksPerGame || 0);
  const [fieldGoalPct, setFieldGoalPct] = useState<number>(season.stats.fieldGoalPct || 48.0);
  const [threePointPct, setThreePointPct] = useState<number>(season.stats.threePointPct || 40.0);
  const [freeThrowPct, setFreeThrowPct] = useState<number>(season.stats.freeThrowPct || 85.0);
  const [playerEfficiencyRating, setPlayerEfficiencyRating] = useState<number>(season.stats.playerEfficiencyRating || 25.0);

  // Exact Totals (manual or auto-calculated)
  const [totalPoints, setTotalPoints] = useState<number>(
    season.stats.totalPoints !== undefined
      ? season.stats.totalPoints
      : Math.round((season.stats.pointsPerGame || 0) * (season.stats.games || 0))
  );
  const [totalAssists, setTotalAssists] = useState<number>(
    season.stats.totalAssists !== undefined
      ? season.stats.totalAssists
      : Math.round((season.stats.assistsPerGame || 0) * (season.stats.games || 0))
  );
  const [totalRebounds, setTotalRebounds] = useState<number>(
    season.stats.totalRebounds !== undefined
      ? season.stats.totalRebounds
      : Math.round((season.stats.reboundsPerGame || 0) * (season.stats.games || 0))
  );

  // 3. Reflections / Narrative
  const [tagline, setTagline] = useState(season.narrative.tagline || '');
  const [summary, setSummary] = useState(season.narrative.summary || '');
  const [bestMoment, setBestMoment] = useState(season.narrative.bestMoment || '');
  const [hardestChallenge, setHardestChallenge] = useState(season.narrative.hardestChallenge || '');
  const [whatILearned, setWhatILearned] = useState(season.narrative.whatILearned || '');
  const [whatIImproved, setWhatIImproved] = useState(season.narrative.whatIImproved || '');

  // 4. Accolades, Silverware & Highs
  const [achievements, setAchievements] = useState<string[]>([...season.achievements]);
  const [newAccoladeInput, setNewAccoladeInput] = useState('');
  const [results, setResults] = useState<SeasonResult[]>([...season.results]);
  const [careerHighs, setCareerHighs] = useState<SeasonCareerHighs>(season.careerHighs || {});

  // Highs local state
  const [ptsHighVal, setPtsHighVal] = useState<number>(season.careerHighs?.points?.value || 0);
  const [ptsHighOpp, setPtsHighOpp] = useState<string>(season.careerHighs?.points?.opponent || '');
  const [ptsHighDate, setPtsHighDate] = useState<string>(season.careerHighs?.points?.date || '');

  const [astHighVal, setAstHighVal] = useState<number>(season.careerHighs?.assists?.value || 0);
  const [astHighOpp, setAstHighOpp] = useState<string>(season.careerHighs?.assists?.opponent || '');
  const [astHighDate, setAstHighDate] = useState<string>(season.careerHighs?.assists?.date || '');

  const [rebHighVal, setRebHighVal] = useState<number>(season.careerHighs?.rebounds?.value || 0);
  const [rebHighOpp, setRebHighOpp] = useState<string>(season.careerHighs?.rebounds?.opponent || '');
  const [rebHighDate, setRebHighDate] = useState<string>(season.careerHighs?.rebounds?.date || '');

  const [stlHighVal, setStlHighVal] = useState<number>(season.careerHighs?.steals?.value || 0);
  const [stlHighOpp, setStlHighOpp] = useState<string>(season.careerHighs?.steals?.opponent || '');
  const [stlHighDate, setStlHighDate] = useState<string>(season.careerHighs?.steals?.date || '');

  // 5. People & Staff
  const [people, setPeople] = useState<SeasonPerson[]>([...season.people]);
  const [newPersonName, setNewPersonName] = useState('');
  const [newPersonRole, setNewPersonRole] = useState<SeasonPerson['role']>('Teammate');
  const [newPersonNote, setNewPersonNote] = useState('');

  // 6. Gallery
  const [gallery, setGallery] = useState<SeasonImage[]>([...season.gallery]);
  const [newImgSrc, setNewImgSrc] = useState('');
  const [newImgTag, setNewImgTag] = useState('Match Day');
  const [newImgCaption, setNewImgCaption] = useState('');

  const [confirmDelete, setConfirmDelete] = useState(false);

  if (!isOpen) return null;

  // Helpers
  const handleAutoCalculateTotals = () => {
    setTotalPoints(Math.round(Number(pointsPerGame) * Number(games)));
    setTotalAssists(Math.round(Number(assistsPerGame) * Number(games)));
    setTotalRebounds(Math.round(Number(reboundsPerGame) * Number(games)));
  };

  const handleAddAccolade = () => {
    if (!newAccoladeInput.trim()) return;
    setAchievements([...achievements, newAccoladeInput.trim()]);
    setNewAccoladeInput('');
  };

  const handleRemoveAccolade = (index: number) => {
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  const handleAddResult = () => {
    setResults([
      ...results,
      {
        competition: `${league} Championship`,
        stage: 'Playoffs',
        description: 'Post-season run',
        isTrophy: false,
      },
    ]);
  };

  const handleUpdateResult = (index: number, field: keyof SeasonResult, value: any) => {
    const updated = [...results];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'stage' && value === 'Champion') {
      updated[index].isTrophy = true;
    }
    setResults(updated);
  };

  const handleRemoveResult = (index: number) => {
    setResults(results.filter((_, i) => i !== index));
  };

  const handleAddPerson = () => {
    if (!newPersonName.trim()) return;
    setPeople([
      ...people,
      {
        name: newPersonName.trim(),
        role: newPersonRole,
        note: newPersonNote.trim() || undefined,
      },
    ]);
    setNewPersonName('');
    setNewPersonNote('');
  };

  const handleRemovePerson = (index: number) => {
    setPeople(people.filter((_, i) => i !== index));
  };

  const handleAddGalleryImage = () => {
    if (!newImgSrc.trim()) return;
    setGallery([
      ...gallery,
      {
        src: newImgSrc.trim(),
        alt: `${team} photograph`,
        caption: newImgCaption.trim() || `${team} match action.`,
        tag: newImgTag,
      },
    ]);
    setNewImgSrc('');
    setNewImgCaption('');
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, isHero: boolean = false) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        if (isHero) {
          setHeroImage(result);
        } else {
          setNewImgSrc(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const compiledHighs: SeasonCareerHighs = {
      points: ptsHighVal ? { value: Number(ptsHighVal), opponent: ptsHighOpp || 'League Game', date: ptsHighDate || season.yearRange } : undefined,
      assists: astHighVal ? { value: Number(astHighVal), opponent: astHighOpp || 'League Game', date: astHighDate || season.yearRange } : undefined,
      rebounds: rebHighVal ? { value: Number(rebHighVal), opponent: rebHighOpp || 'League Game', date: rebHighDate || season.yearRange } : undefined,
      steals: stlHighVal ? { value: Number(stlHighVal), opponent: stlHighOpp || 'League Game', date: stlHighDate || season.yearRange } : undefined,
    };

    updateSeason(season.id, {
      team,
      teamShort,
      clubCode,
      league,
      tier,
      city,
      country,
      yearRange,
      jerseyNumber: Number(jerseyNumber),
      position,
      roleDescription,
      status,
      heroImage,
      isPublic,
      isCurrentSeason,
      stats: {
        ...season.stats,
        games: Number(games),
        gamesStarted: Number(gamesStarted),
        minutesPerGame: Number(minutesPerGame),
        pointsPerGame: Number(pointsPerGame),
        assistsPerGame: Number(assistsPerGame),
        reboundsPerGame: Number(reboundsPerGame),
        stealsPerGame: Number(stealsPerGame),
        blocksPerGame: Number(blocksPerGame),
        fieldGoalPct: Number(fieldGoalPct),
        threePointPct: Number(threePointPct),
        freeThrowPct: Number(freeThrowPct),
        playerEfficiencyRating: Number(playerEfficiencyRating),
        totalPoints: Number(totalPoints),
        totalAssists: Number(totalAssists),
        totalRebounds: Number(totalRebounds),
      },
      narrative: {
        tagline,
        summary,
        bestMoment,
        hardestChallenge,
        whatILearned,
        whatIImproved,
      },
      achievements,
      results,
      careerHighs: compiledHighs,
      people,
      gallery,
    });

    if (onSuccess) onSuccess();
    onClose();
  };

  const handleDelete = () => {
    deleteSeason(season.id);
    if (onSuccess) onSuccess();
    onClose();
  };

  const TABS = [
    { id: 'basics', label: '1. Basics & Context', icon: Trophy },
    { id: 'stats', label: '2. Stats & Totals', icon: Activity },
    { id: 'reflections', label: '3. My Reflections', icon: BookOpen },
    { id: 'accolades', label: '4. Accolades & Silverware', icon: Award },
    { id: 'people', label: '5. People & Staff', icon: Users },
    { id: 'gallery', label: '6. Archival Gallery', icon: ImageIcon },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-theme-panel border border-theme-subtle w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl relative my-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-theme-subtle bg-theme-panel">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#FF5D22] text-black font-black font-mono-code flex items-center justify-center text-sm">
              #{season.id}
            </div>
            <div>
              <span className="text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-widest block font-bold">
                Career Vault Editor
              </span>
              <h2 className="text-xl sm:text-2xl font-black font-display uppercase tracking-tight text-theme-main">
                Edit Season {season.id} — {team} ({yearRange})
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

        {/* Tab Switcher */}
        <div className="flex border-b border-theme-subtle bg-theme-subtle px-4 sm:px-6 overflow-x-auto gap-1">
          {TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-3 px-3 sm:px-4 text-xs font-mono-code uppercase tracking-wider border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${activeTab === tab.id
                  ? 'border-[#FF5D22] text-[#FF5D22] font-bold bg-theme-panel'
                  : 'border-transparent text-theme-muted hover:text-theme-main'
                  }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Modal Body / Tabs */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: BASICS */}
          {activeTab === 'basics' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                    Team Name *
                  </label>
                  <input
                    type="text"
                    value={team}
                    onChange={(e) => setTeam(e.target.value)}
                    className="w-full bg-theme-subtle border border-theme-subtle p-2.5 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                    Team Short Name
                  </label>
                  <input
                    type="text"
                    value={teamShort}
                    onChange={(e) => setTeamShort(e.target.value)}
                    className="w-full bg-theme-subtle border border-theme-subtle p-2.5 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                  />
                </div>

              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                    League & Competition *
                  </label>
                  <input
                    type="text"
                    value={league}
                    onChange={(e) => setLeague(e.target.value)}
                    className="w-full bg-theme-subtle border border-theme-subtle p-2.5 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                    Tier / Level
                  </label>
                  <input
                    type="text"
                    value={tier}
                    onChange={(e) => setTier(e.target.value)}
                    placeholder="e.g. First Division EuroLeague"
                    className="w-full bg-theme-subtle border border-theme-subtle p-2.5 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
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
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full bg-theme-subtle border border-theme-subtle p-2.5 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-theme-subtle border border-theme-subtle p-2.5 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                    Year Range (e.g. 2023—2024)
                  </label>
                  <input
                    type="text"
                    value={yearRange}
                    onChange={(e) => setYearRange(e.target.value)}
                    className="w-full bg-theme-subtle border border-theme-subtle p-2.5 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                    Jersey Number
                  </label>
                  <input
                    type="number"
                    value={jerseyNumber}
                    onChange={(e) => setJerseyNumber(Number(e.target.value))}
                    className="w-full bg-theme-subtle border border-theme-subtle p-2.5 text-xs font-mono-code text-[#FF5D22] font-bold focus:border-[#FF5D22] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                    Position
                  </label>
                  <input
                    type="text"
                    value={position}
                    onChange={(e) => setPosition(e.target.value)}
                    className="w-full bg-theme-subtle border border-theme-subtle p-2.5 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                    Campaign Status
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as any)}
                    className="w-full bg-theme-subtle border border-theme-subtle p-2.5 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none cursor-pointer"
                  >
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                  Hero Banner Photo URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={heroImage}
                    onChange={(e) => setHeroImage(e.target.value)}
                    className="flex-1 bg-theme-subtle border border-theme-subtle p-2.5 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                  />
                  <label className="px-3 py-2 bg-theme-subtle hover:bg-theme-subtle/80 border border-theme-subtle text-xs font-mono-code text-theme-muted hover:text-theme-main cursor-pointer flex items-center gap-1.5 flex-shrink-0">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileUpload(e, true)}
                      className="hidden"
                    />
                  </label>
                </div>
                {heroImage && (
                  <div className="mt-2 aspect-[21/9] max-h-36 overflow-hidden border border-theme-subtle bg-black">
                    <img src={heroImage} alt="Hero Preview" className="w-full h-full object-cover grayscale" />
                  </div>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4 p-4 bg-theme-subtle border border-theme-subtle">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="editIsCurrent"
                    checked={isCurrentSeason}
                    onChange={(e) => setIsCurrentSeason(e.target.checked)}
                    className="accent-[#FF5D22] w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="editIsCurrent" className="text-xs font-mono-code text-theme-main cursor-pointer">
                    Active Spotlight Campaign (Marks as current club)
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="editIsPublic"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="accent-[#FF5D22] w-4 h-4 cursor-pointer"
                  />
                  <label htmlFor="editIsPublic" className="text-xs font-mono-code text-theme-main cursor-pointer">
                    Publicly Visible
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: STATS & TOTALS */}
          {activeTab === 'stats' && (
            <div className="space-y-6">
              {/* Per Game Averages */}
              <div className="p-5 bg-theme-subtle border border-theme-subtle space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-code text-[#FF5D22] uppercase tracking-wider font-bold">
                    Per Game Averages & Shooting Efficiency
                  </span>
                  <span className="text-[11px] font-mono-code text-theme-faint">
                    Displayed in player cards & stats matrix
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                      Games (GP)
                    </label>
                    <input
                      type="number"
                      value={games}
                      onChange={(e) => setGames(Number(e.target.value))}
                      className="w-full bg-theme-panel border border-theme-subtle p-2 text-xs font-mono-code text-theme-main"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                      Games Started (GS)
                    </label>
                    <input
                      type="number"
                      value={gamesStarted}
                      onChange={(e) => setGamesStarted(Number(e.target.value))}
                      className="w-full bg-theme-panel border border-theme-subtle p-2 text-xs font-mono-code text-theme-main"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                      Minutes / Game (MPG)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={minutesPerGame}
                      onChange={(e) => setMinutesPerGame(Number(e.target.value))}
                      className="w-full bg-theme-panel border border-theme-subtle p-2 text-xs font-mono-code text-theme-main"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                      PER (Efficiency)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={playerEfficiencyRating}
                      onChange={(e) => setPlayerEfficiencyRating(Number(e.target.value))}
                      className="w-full bg-theme-panel border border-theme-subtle p-2 text-xs font-mono-code text-[#FF5D22] font-bold"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                      PPG (Points)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={pointsPerGame}
                      onChange={(e) => setPointsPerGame(Number(e.target.value))}
                      className="w-full bg-theme-panel border border-theme-subtle p-2 text-xs font-mono-code text-[#FF5D22] font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                      APG (Assists)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={assistsPerGame}
                      onChange={(e) => setAssistsPerGame(Number(e.target.value))}
                      className="w-full bg-theme-panel border border-theme-subtle p-2 text-xs font-mono-code text-theme-main font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                      RPG (Rebounds)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={reboundsPerGame}
                      onChange={(e) => setReboundsPerGame(Number(e.target.value))}
                      className="w-full bg-theme-panel border border-theme-subtle p-2 text-xs font-mono-code text-theme-main font-bold"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                      SPG (Steals)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={stealsPerGame}
                      onChange={(e) => setStealsPerGame(Number(e.target.value))}
                      className="w-full bg-theme-panel border border-theme-subtle p-2 text-xs font-mono-code text-theme-main"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                      BPG (Blocks)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={blocksPerGame}
                      onChange={(e) => setBlocksPerGame(Number(e.target.value))}
                      className="w-full bg-theme-panel border border-theme-subtle p-2 text-xs font-mono-code text-theme-main"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                      FG % (Field Goal)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={fieldGoalPct}
                      onChange={(e) => setFieldGoalPct(Number(e.target.value))}
                      className="w-full bg-theme-panel border border-theme-subtle p-2 text-xs font-mono-code text-theme-main"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                      3PT % (Three Point)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={threePointPct}
                      onChange={(e) => setThreePointPct(Number(e.target.value))}
                      className="w-full bg-theme-panel border border-theme-subtle p-2 text-xs font-mono-code text-theme-main"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                      FT % (Free Throw)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={freeThrowPct}
                      onChange={(e) => setFreeThrowPct(Number(e.target.value))}
                      className="w-full bg-theme-panel border border-theme-subtle p-2 text-xs font-mono-code text-theme-main"
                    />
                  </div>
                </div>
              </div>

              {/* Exact Cumulative Totals Section */}
              <div className="p-5 bg-theme-subtle border-2 border-[#FF5D22]/40 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <span className="text-xs font-mono-code text-[#FF5D22] uppercase tracking-wider font-bold block">
                      Total Season Production Totals (Manual Override)
                    </span>
                    <span className="text-[11px] font-mono-code text-theme-muted">
                      Directly customize cumulative totals for this season.
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={handleAutoCalculateTotals}
                    className="px-3 py-1.5 bg-theme-panel hover:bg-[#FF5D22] text-theme-main hover:text-black border border-theme-subtle text-xs font-mono-code uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 self-start"
                  >
                    <Calculator className="w-3.5 h-3.5" />
                    <span>Auto-calculate (Avg × GP)</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-3 bg-theme-panel border border-theme-subtle">
                    <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                      Total Points in Season
                    </label>
                    <input
                      type="number"
                      value={totalPoints}
                      onChange={(e) => setTotalPoints(Number(e.target.value))}
                      className="w-full bg-theme-subtle border border-theme-subtle p-2 text-sm font-mono-code text-[#FF5D22] font-bold focus:border-[#FF5D22] focus:outline-none"
                    />
                    <div className="text-[10px] font-mono-code text-theme-faint mt-1">
                      Est: ~{Math.round(pointsPerGame * games)} pts
                    </div>
                  </div>

                  <div className="p-3 bg-theme-panel border border-theme-subtle">
                    <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                      Total Assists in Season
                    </label>
                    <input
                      type="number"
                      value={totalAssists}
                      onChange={(e) => setTotalAssists(Number(e.target.value))}
                      className="w-full bg-theme-subtle border border-theme-subtle p-2 text-sm font-mono-code text-theme-main font-bold focus:border-[#FF5D22] focus:outline-none"
                    />
                    <div className="text-[10px] font-mono-code text-theme-faint mt-1">
                      Est: ~{Math.round(assistsPerGame * games)} ast
                    </div>
                  </div>

                  <div className="p-3 bg-theme-panel border border-theme-subtle">
                    <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                      Total Rebounds in Season
                    </label>
                    <input
                      type="number"
                      value={totalRebounds}
                      onChange={(e) => setTotalRebounds(Number(e.target.value))}
                      className="w-full bg-theme-subtle border border-theme-subtle p-2 text-sm font-mono-code text-theme-main font-bold focus:border-[#FF5D22] focus:outline-none"
                    />
                    <div className="text-[10px] font-mono-code text-theme-faint mt-1">
                      Est: ~{Math.round(reboundsPerGame * games)} reb
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: REFLECTIONS (NARRATIVE) */}
          {activeTab === 'reflections' && (
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                  Editorial Tagline (Quote displayed on banner)
                </label>
                <input
                  type="text"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Masterclass in leadership: Navigating the EuroLeague crucible."
                  className="w-full bg-theme-subtle border border-theme-subtle p-2.5 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                  Season Overview & Narrative Summary
                </label>
                <textarea
                  rows={3}
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="A comprehensive retrospective of the campaign..."
                  className="w-full bg-theme-subtle border border-theme-subtle p-2.5 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none leading-relaxed"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div>
                  <label className="block text-xs font-mono-code text-[#FF5D22] uppercase tracking-wider font-bold mb-1.5">
                    Best Memory
                  </label>
                  <textarea
                    rows={4}
                    value={bestMoment}
                    onChange={(e) => setBestMoment(e.target.value)}
                    placeholder="Describe your most memorable victory, game-winner, or team breakthrough..."
                    className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-amber-500 uppercase tracking-wider font-bold mb-1.5">
                    Hardest Obstacle
                  </label>
                  <textarea
                    rows={4}
                    value={hardestChallenge}
                    onChange={(e) => setHardestChallenge(e.target.value)}
                    placeholder="Injuries, brutal road schedules, tactical adjustments, or pressure moments..."
                    className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-emerald-400 uppercase tracking-wider font-bold mb-1.5">
                    What I Learned
                  </label>
                  <textarea
                    rows={4}
                    value={whatILearned}
                    onChange={(e) => setWhatILearned(e.target.value)}
                    placeholder="Key lessons in court vision, leadership, film study, or team dynamics..."
                    className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none leading-relaxed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-blue-400 uppercase tracking-wider font-bold mb-1.5">
                    Improvements
                  </label>
                  <textarea
                    rows={4}
                    value={whatIImproved}
                    onChange={(e) => setWhatIImproved(e.target.value)}
                    placeholder="Specific technical skills polished (e.g. pull-up 3PT, floater package, lateral footwork)..."
                    className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ACCOLADES, SILVERWARE & HIGHS */}
          {activeTab === 'accolades' && (
            <div className="space-y-6">
              {/* Accolades List */}
              <div className="p-5 bg-theme-subtle border border-theme-subtle space-y-4">
                <span className="text-xs font-mono-code text-[#FF5D22] uppercase tracking-wider font-bold block">
                  Season Accolades & Individual Honors
                </span>

                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newAccoladeInput}
                    onChange={(e) => setNewAccoladeInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddAccolade();
                      }
                    }}
                    placeholder="Add an honor (e.g. All-EuroLeague First Team, Finals MVP, Scoring Title)..."
                    className="flex-1 bg-theme-panel border border-theme-subtle p-2.5 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleAddAccolade}
                    className="px-4 py-2 bg-[#FF5D22] hover:bg-white text-black font-mono-code text-xs font-bold uppercase transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add</span>
                  </button>
                </div>

                <div className="space-y-2">
                  {achievements.map((ach, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2.5 bg-theme-panel border border-theme-subtle"
                    >
                      <div className="flex items-center gap-2.5">
                        <Award className="w-4 h-4 text-[#FF5D22]" />
                        <span className="text-xs font-mono-code text-theme-main">{ach}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAccolade(idx)}
                        className="text-theme-muted hover:text-red-500 p-1 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {achievements.length === 0 && (
                    <div className="text-xs font-mono-code text-theme-faint py-2">
                      No accolades logged yet. Add your first above!
                    </div>
                  )}
                </div>
              </div>

              {/* Competition Results & Trophies */}
              <div className="p-5 bg-theme-subtle border border-theme-subtle space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono-code text-[#FF5D22] uppercase tracking-wider font-bold">
                    Competition Finishes & Silverware
                  </span>
                  <button
                    type="button"
                    onClick={handleAddResult}
                    className="px-3 py-1 bg-theme-panel hover:bg-[#FF5D22] text-theme-main hover:text-black border border-theme-subtle text-xs font-mono-code uppercase transition-colors cursor-pointer flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Competition Result</span>
                  </button>
                </div>

                <div className="space-y-3">
                  {results.map((res, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-theme-panel border border-theme-subtle grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                    >
                      <div className="sm:col-span-4">
                        <label className="block text-[9px] font-mono-code text-theme-faint uppercase mb-0.5">
                          Competition Name
                        </label>
                        <input
                          type="text"
                          value={res.competition}
                          onChange={(e) => handleUpdateResult(idx, 'competition', e.target.value)}
                          className="w-full bg-theme-subtle border border-theme-subtle p-1.5 text-xs font-mono-code text-theme-main"
                        />
                      </div>

                      <div className="sm:col-span-3">
                        <label className="block text-[9px] font-mono-code text-theme-faint uppercase mb-0.5">
                          Stage / Finish
                        </label>
                        <select
                          value={res.stage}
                          onChange={(e) => handleUpdateResult(idx, 'stage', e.target.value)}
                          className="w-full bg-theme-subtle border border-theme-subtle p-1.5 text-xs font-mono-code text-theme-main cursor-pointer"
                        >
                          <option value="Champion">Champion 🏆</option>
                          <option value="Finalist">Finalist</option>
                          <option value="Semifinals">Semifinals</option>
                          <option value="Playoffs">Playoffs</option>
                          <option value="Regular Season">Regular Season</option>
                          <option value="Cup Winner">Cup Winner 🏆</option>
                          <option value="National Semifinals">National Semifinals</option>
                        </select>
                      </div>

                      <div className="sm:col-span-4">
                        <label className="block text-[9px] font-mono-code text-theme-faint uppercase mb-0.5">
                          Description Note
                        </label>
                        <input
                          type="text"
                          value={res.description || ''}
                          onChange={(e) => handleUpdateResult(idx, 'description', e.target.value)}
                          placeholder="e.g. 5-game Finals series victory"
                          className="w-full bg-theme-subtle border border-theme-subtle p-1.5 text-xs font-mono-code text-theme-main"
                        />
                      </div>

                      <div className="sm:col-span-1 flex justify-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveResult(idx)}
                          className="text-theme-muted hover:text-red-500 p-1.5 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Single-Game Highs */}
              <div className="p-5 bg-theme-subtle border border-theme-subtle space-y-4">
                <span className="text-xs font-mono-code text-[#FF5D22] uppercase tracking-wider font-bold block">
                  Season Single-Game Highs
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Points High */}
                  <div className="p-3 bg-theme-panel border border-theme-subtle space-y-2">
                    <span className="text-[10px] font-mono-code text-[#FF5D22] uppercase font-bold block">
                      Points High (PTS)
                    </span>
                    <input
                      type="number"
                      value={ptsHighVal || ''}
                      onChange={(e) => setPtsHighVal(Number(e.target.value))}
                      placeholder="Value (e.g. 38)"
                      className="w-full bg-theme-subtle border border-theme-subtle p-1.5 text-xs font-mono-code text-theme-main font-bold"
                    />
                    <input
                      type="text"
                      value={ptsHighOpp}
                      onChange={(e) => setPtsHighOpp(e.target.value)}
                      placeholder="Opponent (e.g. Panathinaikos)"
                      className="w-full bg-theme-subtle border border-theme-subtle p-1.5 text-xs font-mono-code text-theme-muted"
                    />
                  </div>

                  {/* Assists High */}
                  <div className="p-3 bg-theme-panel border border-theme-subtle space-y-2">
                    <span className="text-[10px] font-mono-code text-theme-main uppercase font-bold block">
                      Assists High (AST)
                    </span>
                    <input
                      type="number"
                      value={astHighVal || ''}
                      onChange={(e) => setAstHighVal(Number(e.target.value))}
                      placeholder="Value (e.g. 14)"
                      className="w-full bg-theme-subtle border border-theme-subtle p-1.5 text-xs font-mono-code text-theme-main font-bold"
                    />
                    <input
                      type="text"
                      value={astHighOpp}
                      onChange={(e) => setAstHighOpp(e.target.value)}
                      placeholder="Opponent (e.g. Barcelona)"
                      className="w-full bg-theme-subtle border border-theme-subtle p-1.5 text-xs font-mono-code text-theme-muted"
                    />
                  </div>

                  {/* Rebounds High */}
                  <div className="p-3 bg-theme-panel border border-theme-subtle space-y-2">
                    <span className="text-[10px] font-mono-code text-theme-main uppercase font-bold block">
                      Rebounds High (REB)
                    </span>
                    <input
                      type="number"
                      value={rebHighVal || ''}
                      onChange={(e) => setRebHighVal(Number(e.target.value))}
                      placeholder="Value (e.g. 11)"
                      className="w-full bg-theme-subtle border border-theme-subtle p-1.5 text-xs font-mono-code text-theme-main font-bold"
                    />
                    <input
                      type="text"
                      value={rebHighOpp}
                      onChange={(e) => setRebHighOpp(e.target.value)}
                      placeholder="Opponent (e.g. Melbourne)"
                      className="w-full bg-theme-subtle border border-theme-subtle p-1.5 text-xs font-mono-code text-theme-muted"
                    />
                  </div>

                  {/* Steals High */}
                  <div className="p-3 bg-theme-panel border border-theme-subtle space-y-2">
                    <span className="text-[10px] font-mono-code text-theme-main uppercase font-bold block">
                      Steals High (STL)
                    </span>
                    <input
                      type="number"
                      value={stlHighVal || ''}
                      onChange={(e) => setStlHighVal(Number(e.target.value))}
                      placeholder="Value (e.g. 6)"
                      className="w-full bg-theme-subtle border border-theme-subtle p-1.5 text-xs font-mono-code text-theme-main font-bold"
                    />
                    <input
                      type="text"
                      value={stlHighOpp}
                      onChange={(e) => setStlHighOpp(e.target.value)}
                      placeholder="Opponent (e.g. Monaco)"
                      className="w-full bg-theme-subtle border border-theme-subtle p-1.5 text-xs font-mono-code text-theme-muted"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PEOPLE & STAFF */}
          {activeTab === 'people' && (
            <div className="space-y-6">
              {/* Add person form */}
              <div className="p-5 bg-theme-subtle border border-theme-subtle space-y-4">
                <span className="text-xs font-mono-code text-[#FF5D22] uppercase tracking-wider font-bold block">
                  Add Coach, Teammate or Staff Member
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={newPersonName}
                      onChange={(e) => setNewPersonName(e.target.value)}
                      placeholder="e.g. Šarūnas Jasikevičius"
                      className="w-full bg-theme-panel border border-theme-subtle p-2.5 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                      Role / Position
                    </label>
                    <select
                      value={newPersonRole}
                      onChange={(e) => setNewPersonRole(e.target.value as any)}
                      className="w-full bg-theme-panel border border-theme-subtle p-2.5 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none cursor-pointer"
                    >
                      <option value="Head Coach">Head Coach</option>
                      <option value="Assistant Coach">Assistant Coach</option>
                      <option value="Teammate">Teammate</option>
                      <option value="Team Captain">Team Captain</option>
                      <option value="Strength & Conditioning">Strength & Conditioning</option>
                      <option value="Physio">Physio</option>
                      <option value="Trainer">Trainer</option>
                      <option value="Agent">Agent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                      Note or Memory
                    </label>
                    <input
                      type="text"
                      value={newPersonNote}
                      onChange={(e) => setNewPersonNote(e.target.value)}
                      placeholder="e.g. Pick-and-roll partner"
                      className="w-full bg-theme-panel border border-theme-subtle p-2.5 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleAddPerson}
                  className="px-4 py-2 bg-[#FF5D22] hover:bg-white text-black font-mono-code text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Person to Season</span>
                </button>
              </div>

              {/* Roster / People List */}
              <div className="space-y-3">
                <span className="text-xs font-mono-code text-theme-muted uppercase tracking-wider block">
                  Current Roster & Staff ({people.length})
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {people.map((person, idx) => (
                    <div
                      key={idx}
                      className="p-4 bg-theme-subtle border border-theme-subtle flex items-start justify-between gap-3"
                    >
                      <div>
                        <div className="text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-widest">
                          {person.role}
                        </div>
                        <div className="text-sm font-bold font-display uppercase text-theme-main mt-0.5">
                          {person.name}
                        </div>
                        {person.note && (
                          <div className="text-xs text-theme-muted mt-1 font-sans-body">
                            "{person.note}"
                          </div>
                        )}
                      </div>

                      <button
                        type="button"
                        onClick={() => handleRemovePerson(idx)}
                        className="text-theme-muted hover:text-red-500 p-1 transition-colors cursor-pointer"
                        title="Remove person"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {people.length === 0 && (
                    <div className="text-xs font-mono-code text-theme-faint col-span-2 py-4 text-center">
                      No coaches or teammates logged for this season yet.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-6">
              {/* Upload / Add Photo Box */}
              <div className="p-5 bg-theme-subtle border border-theme-subtle space-y-4">
                <span className="text-xs font-mono-code text-[#FF5D22] uppercase tracking-wider font-bold block">
                  Add Archival Photo to Season Gallery
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                      Image URL or Upload *
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newImgSrc}
                        onChange={(e) => setNewImgSrc(e.target.value)}
                        placeholder="https://images.unsplash.com/..."
                        className="flex-1 bg-theme-panel border border-theme-subtle p-2 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                      />
                      <label className="px-3 py-2 bg-theme-panel hover:bg-theme-subtle border border-theme-subtle text-xs font-mono-code text-theme-muted hover:text-theme-main cursor-pointer flex items-center gap-1 flex-shrink-0">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Browse</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleFileUpload(e, false)}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                      Photo Tag
                    </label>
                    <select
                      value={newImgTag}
                      onChange={(e) => setNewImgTag(e.target.value)}
                      className="w-full bg-theme-panel border border-theme-subtle p-2 text-xs font-mono-code text-theme-main cursor-pointer"
                    >
                      <option value="Match Day">Match Day</option>
                      <option value="Championship">Championship</option>
                      <option value="Silverware">Silverware</option>
                      <option value="Training">Training</option>
                      <option value="Travel">Travel</option>
                      <option value="Arena">Arena</option>
                      <option value="Highlights">Highlights</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                    Photo Caption
                  </label>
                  <input
                    type="text"
                    value={newImgCaption}
                    onChange={(e) => setNewImgCaption(e.target.value)}
                    placeholder="Brief description of the moment..."
                    className="w-full bg-theme-panel border border-theme-subtle p-2 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
                  />
                </div>

                <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono-code text-theme-faint">Presets:</span>
                    {PRESET_PHOTO_TEMPLATES.map((tmpl, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setNewImgSrc(tmpl.src);
                          setNewImgTag(tmpl.tag);
                          setNewImgCaption(tmpl.caption);
                        }}
                        className="px-2 py-0.5 bg-theme-panel hover:bg-[#FF5D22] text-theme-muted hover:text-black text-[10px] font-mono-code border border-theme-subtle cursor-pointer"
                      >
                        {tmpl.tag}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={handleAddGalleryImage}
                    className="px-4 py-2 bg-[#FF5D22] hover:bg-white text-black font-mono-code text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add Photo to Gallery</span>
                  </button>
                </div>
              </div>

              {/* Gallery Grid */}
              <div className="space-y-3">
                <span className="text-xs font-mono-code text-theme-muted uppercase tracking-wider block">
                  Season Gallery Assets ({gallery.length})
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {gallery.map((img, idx) => (
                    <div
                      key={idx}
                      className="group relative aspect-[4/3] bg-theme-subtle border border-theme-subtle overflow-hidden"
                    >
                      <img src={img.src} alt={img.alt} className="w-full h-full object-cover grayscale" />
                      <div className="absolute top-2 left-2 bg-black/80 px-2 py-0.5 text-[9px] font-mono-code text-[#FF5D22] uppercase">
                        {img.tag}
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveGalleryImage(idx)}
                        className="absolute top-2 right-2 bg-black/80 text-white hover:text-red-400 p-1 transition-colors cursor-pointer"
                        title="Delete photo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                      <div className="absolute bottom-0 inset-x-0 bg-black/85 p-2 text-[10px] text-white/90 font-mono-code truncate">
                        {img.caption}
                      </div>
                    </div>
                  ))}
                  {gallery.length === 0 && (
                    <div className="text-xs font-mono-code text-theme-faint col-span-3 py-6 text-center">
                      No photos added to this season yet. Add one above!
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Footer Save & Delete Actions */}
          <div className="pt-5 border-t border-theme-subtle flex flex-wrap items-center justify-between gap-4">
            {confirmDelete ? (
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 text-white font-bold text-xs font-mono-code uppercase cursor-pointer hover:bg-red-700 transition-colors"
                >
                  Confirm Delete Season {season.id}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  className="px-3 py-2 bg-theme-subtle text-theme-muted text-xs font-mono-code uppercase cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                className="text-xs font-mono-code text-red-500 hover:text-red-400 flex items-center gap-1.5 cursor-pointer py-1"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Season</span>
              </button>
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 bg-theme-subtle text-theme-main text-xs font-mono-code uppercase cursor-pointer hover:bg-theme-main hover:text-theme-canvas transition-colors border border-theme-subtle"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#FF5D22] text-black font-bold uppercase text-xs font-mono-code tracking-wider hover:bg-emerald-500 transition-colors cursor-pointer flex items-center gap-1.5 shadow-md"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Save All Season Changes</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
