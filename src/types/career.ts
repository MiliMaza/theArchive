export type SeasonStatus = 'In Progress' | 'Completed';

export interface SeasonStats {
  games: number;
  gamesStarted?: number;
  minutesPerGame?: number;
  pointsPerGame: number;
  reboundsPerGame: number;
  assistsPerGame: number;
  stealsPerGame?: number;
  blocksPerGame?: number;
  fieldGoalPct?: number; // e.g. 48.5
  threePointPct?: number;
  freeThrowPct?: number;
  totalPoints?: number;
  totalAssists?: number;
  totalRebounds?: number;
  playerEfficiencyRating?: number;
}

export interface SeasonResult {
  competition: string;
  stage: 'Champion' | 'Finalist' | 'Semifinals' | 'Playoffs' | 'Regular Season' | 'Cup Winner' | 'National Semifinals';
  description?: string;
  isTrophy?: boolean;
}

export interface SeasonCareerHighs {
  points?: { value: number; opponent: string; date: string; notes?: string };
  rebounds?: { value: number; opponent: string; date: string; notes?: string };
  assists?: { value: number; opponent: string; date: string; notes?: string };
  steals?: { value: number; opponent: string; date: string; notes?: string };
  blocks?: { value: number; opponent: string; date: string; notes?: string };
  minutes?: { value: number; opponent: string; date: string; notes?: string };
}

export interface SeasonPerson {
  name: string;
  role: 'Head Coach' | 'Assistant Coach' | 'Teammate' | 'Strength & Conditioning' | 'Physio' | 'Trainer' | 'Team Captain' | 'Agent';
  note?: string;
  avatar?: string;
}

export interface SeasonImage {
  src: string;
  alt: string;
  caption?: string;
  tag?: string;
  mediaType?: 'image' | 'video';
}

export interface Season {
  id: string; // "01", "02", "03", "04", "05", "06"
  slug: string; // "2018-19", "2019-20", etc.
  seasonNumber: number; // 1 to 6
  yearRange: string; // "2018—2019"
  team: string;
  teamShort: string;
  clubCode: string;
  league: string;
  tier: string;
  country: string;
  countryCode: string;
  city: string;
  jerseyNumber: number;
  position: string;
  roleDescription: string;
  status: SeasonStatus;
  isCurrentSeason: boolean;
  heroImage: string;
  gallery: SeasonImage[];
  stats: SeasonStats;
  results: SeasonResult[];
  achievements: string[];
  careerHighs: SeasonCareerHighs;
  narrative: {
    tagline: string;
    summary: string;
    bestMoment: string;
    hardestChallenge: string;
    whatILearned: string;
    whatIImproved: string;
  };
  people: SeasonPerson[];
  isPublic: boolean;
  completenessScore: number;
  privateNotes?: string[];
}

export interface Memory {
  id: string;
  seasonId: string;
  seasonLabel: string;
  team: string;
  country: string;
  title: string;
  date: string;
  category: 'Milestones' | 'Games' | 'People' | 'Travel' | 'Hard Moments' | 'Championships';
  excerpt: string;
  fullStory: string;
  quote?: string;
  image?: string;
  featured?: boolean;
  location?: string;
  isPublic: boolean;
}

export interface PlayerProfile {
  name: string;
  firstName: string;
  lastName: string;
  nickname?: string;
  tagline: string;
  role: string;
  height: string;
  wingspan: string;
  weight: string;
  position: string;
  jerseyNumber: number;
  currentTeam: string;
  currentCountry: string;
  currentLeague: string;
  careerSpan: string;
  yearsActive: number;
  careerPoints: number;
  careerAssists: number;
  careerRebounds: number;
  careerGames: number;
  totalClubs: number;
  totalCountries: number;
  totalChampionships: number;
  bioSummary: string;
  quote: string;
  profileImage?: string;
  philosophy: string[];
  socialLinks: {
    label: string;
    url: string;
  }[];
}
