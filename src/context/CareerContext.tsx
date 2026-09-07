import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Season, Memory, PlayerProfile, SeasonImage } from '../types/career';
import { seasonsData as initialSeasons } from '../data/seasons';
import { memoriesData as initialMemories } from '../data/memories';
import { playerProfile as initialProfile } from '../data/player';
import { getSupabaseClient, getSupabaseConfig } from '../lib/supabase';

export interface VaultDocument {
  id: string;
  title: string;
  seasonId?: string;
  team?: string;
  category: 'Contract' | 'Clearance' | 'Medical' | 'Tax' | 'Endorsement' | 'Scouting';
  fileType: string;
  fileSize: string;
  uploadedDate: string;
  isEncrypted: boolean;
  notes?: string;
  downloadUrl?: string;
}

const initialDocuments: VaultDocument[] = [
  {
    id: 'doc-01',
    title: 'Tokyo Alvark 2023-25 Player Agreement',
    seasonId: '06',
    team: 'Tokyo Alvark',
    category: 'Contract',
    fileType: 'PDF',
    fileSize: '4.2 MB',
    uploadedDate: 'Oct 2023',
    isEncrypted: true,
    notes: 'Two-year fully guaranteed contract with championship bonus clauses.',
  },
  {
    id: 'doc-02',
    title: 'Sydney Kings NBL Championship Clearance',
    seasonId: '05',
    team: 'Sydney Kings',
    category: 'Clearance',
    fileType: 'PDF',
    fileSize: '2.8 MB',
    uploadedDate: 'Mar 2023',
    isEncrypted: true,
    notes: 'Official Basketball Australia federation sign-off & playoff insurance.',
  },
  {
    id: 'doc-03',
    title: 'Real Madrid Baloncesto ACB Federation Pass',
    seasonId: '04',
    team: 'Real Madrid',
    category: 'Contract',
    fileType: 'PDF',
    fileSize: '1.9 MB',
    uploadedDate: 'Aug 2021',
    isEncrypted: true,
    notes: 'Liga Endesa passport and EU resident athlete license.',
  },
  {
    id: 'doc-04',
    title: 'FIBA International Letter of Clearance (LOC)',
    seasonId: '02',
    team: 'AS Monaco',
    category: 'Clearance',
    fileType: 'PDF',
    fileSize: '890 KB',
    uploadedDate: 'Jul 2019',
    isEncrypted: true,
    notes: 'FIBA Geneva official transfer certificate from NCAA USA to French Federation.',
  },
  {
    id: 'doc-05',
    title: 'Olympiacos Piraeus Medical & Orthopedic Screening',
    seasonId: '03',
    team: 'Olympiacos',
    category: 'Medical',
    fileType: 'PDF',
    fileSize: '3.4 MB',
    uploadedDate: 'Sep 2020',
    isEncrypted: true,
    notes: 'Complete MRI and bilateral ACL durability verification by EuroLeague medical staff.',
  },
];

const initialNotesList: string[] = [
  'Remember to verify official FIBA box score from the 2021 Athens derby for official steal count.',
  'Madrid contract bonus statement received and archived into Valdebebas tax folder.',
  'Tokyo Alvark 2025/26 contract option conversation scheduled for end of post-season in May.',
  'Physical therapy note: continue dry needling on right achilles tendon after back-to-back road games.',
];

interface CareerContextType {
  seasons: Season[];
  memories: Memory[];
  documents: VaultDocument[];
  privateNotes: string[];
  playerProfile: PlayerProfile;
  updatePlayerProfile: (data: Partial<PlayerProfile>) => void;
  addSeason: (season: Season) => void;
  updateSeason: (seasonId: string, updatedData: Partial<Season>) => void;
  deleteSeason: (seasonId: string) => void;
  addMemory: (memory: Memory) => void;
  updateMemory: (memoryId: string, updatedData: Partial<Memory>) => void;
  deleteMemory: (memoryId: string) => void;
  addDocument: (doc: VaultDocument) => void;
  deleteDocument: (docId: string) => void;
  addMediaToSeason: (seasonId: string, image: SeasonImage) => void;
  addPrivateNote: (note: string) => void;
  deletePrivateNote: (index: number) => void;
  resetToDefaults: () => void;
  totalCareerPoints: number;
  totalCareerAssists: number;
  totalCareerRebounds: number;
  totalCareerGames: number;
  overallCompleteness: number;

  // Supabase Cloud Sync
  isSupabaseConnected: boolean;
  isSyncing: boolean;
  supabaseStatus: string | null;
  syncWithSupabase: () => Promise<void>;
  setSupabaseCustomKeys: (url: string, key: string) => void;
}

const CareerContext = createContext<CareerContextType | undefined>(undefined);

const STORAGE_KEYS = {
  SEASONS: 'vance_career_seasons_v2',
  MEMORIES: 'vance_career_memories_v2',
  DOCUMENTS: 'vance_career_documents_v2',
  NOTES: 'vance_career_notes_v2',
  PROFILE: 'vance_career_profile_v2',
};

export const CareerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [customProfile, setCustomProfile] = useState<Partial<PlayerProfile>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PROFILE);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading profile from storage', e);
    }
    return {};
  });

  const [seasons, setSeasons] = useState<Season[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SEASONS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading seasons from storage', e);
    }
    return initialSeasons;
  });

  const [memories, setMemories] = useState<Memory[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MEMORIES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading memories from storage', e);
    }
    return initialMemories;
  });

  const [documents, setDocuments] = useState<VaultDocument[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DOCUMENTS);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading documents from storage', e);
    }
    return initialDocuments;
  });

  const [privateNotes, setPrivateNotes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTES);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error('Error loading notes from storage', e);
    }
    return initialNotesList;
  });

  // Supabase State
  const [isSupabaseConnected, setIsSupabaseConnected] = useState<boolean>(() => {
    return getSupabaseConfig().isConfigured;
  });
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [supabaseStatus, setSupabaseStatus] = useState<string | null>(null);

  // Sync with Supabase Database
  const syncWithSupabase = useCallback(async () => {
    const client = getSupabaseClient();
    if (!client) {
      setIsSupabaseConnected(false);
      setSupabaseStatus('Supabase keys not configured.');
      return;
    }

    setIsSyncing(true);
    setSupabaseStatus('Connecting to Supabase...');

    try {
      // 1. Fetch remote athlete profile
      const { data: profileRow, error: profileErr } = await client
        .from('athlete_profile')
        .select('*')
        .eq('id', 'default_athlete')
        .maybeSingle();

      if (profileErr && profileErr.code !== 'PGRST116') {
        console.warn('Supabase Profile Fetch:', profileErr);
      }

      if (profileRow && profileRow.data) {
        setCustomProfile(profileRow.data);
        localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profileRow.data));
      } else {
        // Upsert current local profile to Supabase
        await client.from('athlete_profile').upsert({
          id: 'default_athlete',
          data: customProfile,
          updated_at: new Date().toISOString(),
        });
      }

      // 2. Fetch remote seasons
      const { data: remoteSeasons, error: seasonsErr } = await client
        .from('seasons')
        .select('*');

      if (!seasonsErr && remoteSeasons && remoteSeasons.length > 0) {
        const parsed = remoteSeasons.map((r: any) => r.data).sort((a: Season, b: Season) => a.id.localeCompare(b.id));
        setSeasons(parsed);
        localStorage.setItem(STORAGE_KEYS.SEASONS, JSON.stringify(parsed));
      } else if (!seasonsErr) {
        // Populate Supabase with current seasons
        for (const s of seasons) {
          await client.from('seasons').upsert({
            id: s.id,
            data: s,
            updated_at: new Date().toISOString(),
          });
        }
      }

      // 3. Fetch remote documents
      const { data: remoteDocs, error: docsErr } = await client
        .from('vault_documents')
        .select('*');

      if (!docsErr && remoteDocs && remoteDocs.length > 0) {
        const parsedDocs = remoteDocs.map((r: any) => r.data);
        setDocuments(parsedDocs);
        localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(parsedDocs));
      }

      // 4. Fetch remote notes
      const { data: remoteNotes, error: notesErr } = await client
        .from('vault_notes')
        .select('*');

      if (!notesErr && remoteNotes && remoteNotes.length > 0) {
        const parsedNotes = remoteNotes.map((r: any) => r.content);
        setPrivateNotes(parsedNotes);
        localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(parsedNotes));
      }

      setIsSupabaseConnected(true);
      setSupabaseStatus(`Synchronized with Supabase at ${new Date().toLocaleTimeString()}`);
    } catch (err: any) {
      console.error('Supabase sync error:', err);
      setSupabaseStatus(`Sync notice: ${err.message || 'Check table schema'}`);
    } finally {
      setIsSyncing(false);
    }
  }, [customProfile, seasons]);

  // Initial Sync check on mount
  useEffect(() => {
    const config = getSupabaseConfig();
    if (config.isConfigured) {
      syncWithSupabase();
    }
  }, []);

  const setSupabaseCustomKeys = (url: string, key: string) => {
    localStorage.setItem('supabase_custom_url', url);
    localStorage.setItem('supabase_custom_key', key);
    const config = getSupabaseConfig();
    setIsSupabaseConnected(config.isConfigured);
  };

  // Push to Supabase on local changes when client is active
  const pushProfileToCloud = async (newProfile: Partial<PlayerProfile>) => {
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('athlete_profile').upsert({
          id: 'default_athlete',
          data: newProfile,
          updated_at: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('Cloud push failed:', e);
      }
    }
  };

  const pushSeasonToCloud = async (season: Season) => {
    const client = getSupabaseClient();
    if (client) {
      try {
        await client.from('seasons').upsert({
          id: season.id,
          data: season,
          updated_at: new Date().toISOString(),
        });
      } catch (e) {
        console.warn('Cloud season push failed:', e);
      }
    }
  };

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SEASONS, JSON.stringify(seasons));
    } catch (e) {
      console.error('Failed to save seasons', e);
    }
  }, [seasons]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MEMORIES, JSON.stringify(memories));
    } catch (e) {
      console.error('Failed to save memories', e);
    }
  }, [memories]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.DOCUMENTS, JSON.stringify(documents));
    } catch (e) {
      console.error('Failed to save documents', e);
    }
  }, [documents]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(privateNotes));
    } catch (e) {
      console.error('Failed to save notes', e);
    }
  }, [privateNotes]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(customProfile));
    } catch (e) {
      console.error('Failed to save profile', e);
    }
  }, [customProfile]);

  // Aggregate stats calculations
  const totalCareerPoints = seasons.reduce((acc, s) => acc + (s.stats.totalPoints || Math.round(s.stats.pointsPerGame * s.stats.games)), 0);
  const totalCareerAssists = seasons.reduce((acc, s) => acc + (s.stats.totalAssists || Math.round(s.stats.assistsPerGame * s.stats.games)), 0);
  const totalCareerRebounds = seasons.reduce((acc, s) => acc + (s.stats.totalRebounds || Math.round(s.stats.reboundsPerGame * s.stats.games)), 0);
  const totalCareerGames = seasons.reduce((acc, s) => acc + s.stats.games, 0);

  const overallCompleteness = seasons.length > 0
    ? Math.round(seasons.reduce((acc, s) => acc + s.completenessScore, 0) / seasons.length)
    : 100;

  const currentActiveSeason = seasons.find((s) => s.isCurrentSeason) || seasons[seasons.length - 1];

  const effectiveName = customProfile.name || initialProfile.name;
  const nameParts = effectiveName.trim().split(/\s+/);
  const derivedFirstName = nameParts.length > 1 ? nameParts.slice(0, -1).join(' ') : nameParts[0] || 'Athlete';
  const derivedLastName = nameParts.length > 1 ? nameParts[nameParts.length - 1] : nameParts[0] || 'Athlete';

  const dynamicPlayerProfile: PlayerProfile = {
    ...initialProfile,
    ...customProfile,
    name: effectiveName,
    firstName: customProfile.firstName || (customProfile.name ? derivedFirstName : initialProfile.firstName),
    lastName: customProfile.lastName || (customProfile.name ? derivedLastName : initialProfile.lastName),
    careerPoints: totalCareerPoints,
    careerAssists: totalCareerAssists,
    careerRebounds: totalCareerRebounds,
    careerGames: totalCareerGames,
    yearsActive: seasons.length,
    totalClubs: new Set(seasons.map((s) => s.team)).size,
    totalCountries: new Set(seasons.map((s) => s.country.split('/')[0].trim())).size,
    currentTeam: customProfile.currentTeam || (currentActiveSeason ? currentActiveSeason.team : initialProfile.currentTeam),
    currentCountry: customProfile.currentCountry || (currentActiveSeason ? currentActiveSeason.country : initialProfile.currentCountry),
    currentLeague: customProfile.currentLeague || (currentActiveSeason ? currentActiveSeason.league : initialProfile.currentLeague),
  };

  const updatePlayerProfile = (data: Partial<PlayerProfile>) => {
    const updated = { ...customProfile, ...data };
    setCustomProfile(updated);
    pushProfileToCloud(updated);
  };

  const addSeason = (newSeason: Season) => {
    setSeasons((prev) => {
      let updatedPrev = prev;
      if (newSeason.isCurrentSeason) {
        updatedPrev = prev.map((s) => ({ ...s, isCurrentSeason: false }));
      }
      return [...updatedPrev, newSeason];
    });
    pushSeasonToCloud(newSeason);
  };

  const updateSeason = (seasonId: string, updatedData: Partial<Season>) => {
    setSeasons((prev) =>
      prev.map((s) => {
        if (s.id === seasonId) {
          const updated = { ...s, ...updatedData };
          if (updatedData.isCurrentSeason) {
            prev.forEach((other) => {
              if (other.id !== seasonId) other.isCurrentSeason = false;
            });
          }
          pushSeasonToCloud(updated);
          return updated;
        }
        return s;
      })
    );
  };

  const deleteSeason = (seasonId: string) => {
    setSeasons((prev) => prev.filter((s) => s.id !== seasonId));
    const client = getSupabaseClient();
    if (client) {
      Promise.resolve(client.from('seasons').delete().eq('id', seasonId)).catch(console.warn);
    }
  };

  const addMemory = (memory: Memory) => {
    setMemories((prev) => [memory, ...prev]);
    const client = getSupabaseClient();
    if (client) {
      Promise.resolve(client.from('vault_memories').upsert({ id: memory.id, data: memory })).catch(console.warn);
    }
  };

  const updateMemory = (memoryId: string, updatedData: Partial<Memory>) => {
    setMemories((prev) =>
      prev.map((m) => {
        if (m.id === memoryId) {
          const updated = { ...m, ...updatedData };
          const client = getSupabaseClient();
          if (client) {
            Promise.resolve(client.from('vault_memories').upsert({ id: updated.id, data: updated })).catch(console.warn);
          }
          return updated;
        }
        return m;
      })
    );
  };

  const deleteMemory = (memoryId: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== memoryId));
    const client = getSupabaseClient();
    if (client) {
      Promise.resolve(client.from('vault_memories').delete().eq('id', memoryId)).catch(console.warn);
    }
  };

  const addDocument = (doc: VaultDocument) => {
    setDocuments((prev) => [doc, ...prev]);
    const client = getSupabaseClient();
    if (client) {
      Promise.resolve(client.from('vault_documents').upsert({ id: doc.id, data: doc })).catch(console.warn);
    }
  };

  const deleteDocument = (docId: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== docId));
    const client = getSupabaseClient();
    if (client) {
      Promise.resolve(client.from('vault_documents').delete().eq('id', docId)).catch(console.warn);
    }
  };

  const addMediaToSeason = (seasonId: string, image: SeasonImage) => {
    setSeasons((prev) =>
      prev.map((s) => {
        if (s.id === seasonId) {
          const updated = {
            ...s,
            gallery: [image, ...s.gallery],
          };
          pushSeasonToCloud(updated);
          return updated;
        }
        return s;
      })
    );
  };

  const addPrivateNote = (note: string) => {
    if (!note.trim()) return;
    setPrivateNotes((prev) => [note.trim(), ...prev]);
    const client = getSupabaseClient();
    if (client) {
      Promise.resolve(client.from('vault_notes').insert({ id: `note-${Date.now()}`, content: note.trim() })).catch(console.warn);
    }
  };

  const deletePrivateNote = (index: number) => {
    setPrivateNotes((prev) => prev.filter((_, i) => i !== index));
  };

  const resetToDefaults = () => {
    setSeasons(initialSeasons);
    setMemories(initialMemories);
    setDocuments(initialDocuments);
    setPrivateNotes(initialNotesList);
    setCustomProfile({});
    try {
      localStorage.removeItem(STORAGE_KEYS.SEASONS);
      localStorage.removeItem(STORAGE_KEYS.MEMORIES);
      localStorage.removeItem(STORAGE_KEYS.DOCUMENTS);
      localStorage.removeItem(STORAGE_KEYS.NOTES);
      localStorage.removeItem(STORAGE_KEYS.PROFILE);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <CareerContext.Provider
      value={{
        seasons,
        memories,
        documents,
        privateNotes,
        playerProfile: dynamicPlayerProfile,
        updatePlayerProfile,
        addSeason,
        updateSeason,
        deleteSeason,
        addMemory,
        updateMemory,
        deleteMemory,
        addDocument,
        deleteDocument,
        addMediaToSeason,
        addPrivateNote,
        deletePrivateNote,
        resetToDefaults,
        totalCareerPoints,
        totalCareerAssists,
        totalCareerRebounds,
        totalCareerGames,
        overallCompleteness,
        isSupabaseConnected,
        isSyncing,
        supabaseStatus,
        syncWithSupabase,
        setSupabaseCustomKeys,
      }}
    >
      {children}
    </CareerContext.Provider>
  );
};

export const useCareer = (): CareerContextType => {
  const context = useContext(CareerContext);
  if (!context) {
    throw new Error('useCareer must be used within a CareerProvider');
  }
  return context;
};
