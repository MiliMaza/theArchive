import React, { useState } from 'react';
import {
  Lock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Plus,
  Edit,
  Trash2,
  ShieldAlert,
  Upload,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { seasonsData } from '../../data/seasons';
import { playerProfile } from '../../data/player';

interface AdminVaultViewProps {
  onClose: () => void;
  onSelectSeason: (seasonId: string) => void;
}

export const AdminVaultView: React.FC<AdminVaultViewProps> = ({ onClose, onSelectSeason }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'seasons' | 'documents' | 'notes'>('overview');
  const [newNote, setNewNote] = useState('');
  const [savedNotes, setSavedNotes] = useState<string[]>([
    'Remember to verify official FIBA box score from the 2021 Athens derby for official steal count.',
    'Madrid contract bonus statement received and archived into Valdebebas tax folder.',
    'Tokyo Alvark 2025/26 contract option conversation scheduled for end of post-season in May.',
  ]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setSavedNotes([newNote.trim(), ...savedNotes]);
    setNewNote('');
  };

  const totalCompleteness = Math.round(
    seasonsData.reduce((acc, s) => acc + s.completenessScore, 0) / seasonsData.length
  );

  return (
    <div className="w-full bg-[#0a0a0a] min-h-screen py-12 px-6 sm:px-12 text-white border-t-2 border-[#FF5D22]">
      <div className="max-w-7xl mx-auto">
        {/* Top Vault Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF5D22] text-black flex items-center justify-center font-bold rounded">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono-code bg-[#FF5D22]/20 text-[#FF5D22] px-2 py-0.5 font-bold uppercase tracking-widest border border-[#FF5D22]/30">
                  Private Career Vault
                </span>
                <span className="text-xs text-white/40 font-mono-code">• Maya Vance #7</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-white mt-1">
                Career Management & Archival Health
              </h1>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/10 hover:bg-white text-white hover:text-black text-xs font-mono-code uppercase tracking-wider transition-colors cursor-pointer self-start sm:self-center"
          >
            Exit Vault Mode
          </button>
        </div>

        {/* Vault Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-white/10 pb-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-xs font-mono-code uppercase tracking-wider transition-colors cursor-pointer border ${
              activeTab === 'overview'
                ? 'bg-[#FF5D22] text-black font-bold border-[#FF5D22]'
                : 'bg-white/5 text-white/60 hover:text-white border-white/10'
            }`}
          >
            Career Completeness & Audits
          </button>
          <button
            onClick={() => setActiveTab('seasons')}
            className={`px-4 py-2 text-xs font-mono-code uppercase tracking-wider transition-colors cursor-pointer border ${
              activeTab === 'seasons'
                ? 'bg-[#FF5D22] text-black font-bold border-[#FF5D22]'
                : 'bg-white/5 text-white/60 hover:text-white border-white/10'
            }`}
          >
            Manage 6 Seasons
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2 text-xs font-mono-code uppercase tracking-wider transition-colors cursor-pointer border ${
              activeTab === 'documents'
                ? 'bg-[#FF5D22] text-black font-bold border-[#FF5D22]'
                : 'bg-white/5 text-white/60 hover:text-white border-white/10'
            }`}
          >
            Contracts & Paperwork
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 text-xs font-mono-code uppercase tracking-wider transition-colors cursor-pointer border ${
              activeTab === 'notes'
                ? 'bg-[#FF5D22] text-black font-bold border-[#FF5D22]'
                : 'bg-white/5 text-white/60 hover:text-white border-white/10'
            }`}
          >
            Private Reflections & Memos
          </button>
        </div>

        {/* TAB 1: OVERVIEW & COMPLETENESS GAUGE */}
        {activeTab === 'overview' && (
          <div className="space-y-10">
            {/* Completeness Card */}
            <div className="bg-[#141414] border border-white/10 p-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                <div>
                  <span className="text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-widest block mb-1">
                    Archival Audit
                  </span>
                  <h2 className="text-3xl font-black font-display uppercase tracking-tight text-white">
                    Overall Career Completeness: {totalCompleteness}%
                  </h2>
                  <p className="text-xs text-white/60 font-sans-body mt-1">
                    All 6 professional campaigns structured with statistical records, photos, and narratives.
                  </p>
                </div>

                <div className="w-full lg:w-72 bg-white/10 h-3 border border-white/10 relative overflow-hidden">
                  <div
                    style={{ width: `${totalCompleteness}%` }}
                    className="bg-[#FF5D22] h-full transition-all duration-700"
                  />
                </div>
              </div>

              {/* Completeness Per Season Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {seasonsData.map((s) => (
                  <div key={s.id} className="p-5 bg-black/40 border border-white/5 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono-code text-[#FF5D22] font-bold">
                        Season {s.id} • {s.yearRange}
                      </span>
                      <span className="text-xs font-mono-code text-white font-bold">
                        {s.completenessScore}%
                      </span>
                    </div>

                    <div className="text-sm font-bold text-white font-display truncate">
                      {s.team}
                    </div>

                    <div className="w-full bg-white/10 h-1.5 overflow-hidden">
                      <div
                        style={{ width: `${s.completenessScore}%` }}
                        className="bg-[#FF5D22] h-full"
                      />
                    </div>

                    <div className="text-[10px] font-mono-code text-white/50 flex items-center justify-between pt-1">
                      <span>Stats: Complete</span>
                      <span className="text-emerald-400">Verified</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-[#141414] border border-white/10 p-8">
              <span className="text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-widest block mb-4">
                Vault Quick Actions
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <button className="p-4 bg-black/40 hover:bg-[#FF5D22] hover:text-black border border-white/10 text-left transition-all group cursor-pointer">
                  <Plus className="w-5 h-5 text-[#FF5D22] group-hover:text-black mb-2" />
                  <div className="text-xs font-bold font-mono-code uppercase">Log Future Season</div>
                  <div className="text-[10px] opacity-60">Prepare 2025/26 campaign</div>
                </button>

                <button className="p-4 bg-black/40 hover:bg-[#FF5D22] hover:text-black border border-white/10 text-left transition-all group cursor-pointer">
                  <Upload className="w-5 h-5 text-[#FF5D22] group-hover:text-black mb-2" />
                  <div className="text-xs font-bold font-mono-code uppercase">Upload High-Res Media</div>
                  <div className="text-[10px] opacity-60">Batch import match photography</div>
                </button>

                <button className="p-4 bg-black/40 hover:bg-[#FF5D22] hover:text-black border border-white/10 text-left transition-all group cursor-pointer">
                  <FileText className="w-5 h-5 text-[#FF5D22] group-hover:text-black mb-2" />
                  <div className="text-xs font-bold font-mono-code uppercase">Attach Contract PDF</div>
                  <div className="text-[10px] opacity-60">Private salary / federation slip</div>
                </button>

                <button className="p-4 bg-black/40 hover:bg-[#FF5D22] hover:text-black border border-white/10 text-left transition-all group cursor-pointer">
                  <Sparkles className="w-5 h-5 text-[#FF5D22] group-hover:text-black mb-2" />
                  <div className="text-xs font-bold font-mono-code uppercase">Draft Private Memory</div>
                  <div className="text-[10px] opacity-60">Locker room & mental notes</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SEASONS MANAGEMENT */}
        {activeTab === 'seasons' && (
          <div className="bg-[#141414] border border-white/10 p-8 space-y-4">
            <h2 className="text-2xl font-black font-display uppercase tracking-tight text-white mb-4">
              Six Seasons Directory & Access Control
            </h2>
            <div className="divide-y divide-white/10">
              {seasonsData.map((s) => (
                <div key={s.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded bg-[#FF5D22] text-black font-black font-mono-code flex items-center justify-center text-xs">
                      {s.id}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-white font-display uppercase">
                        {s.team} ({s.yearRange})
                      </div>
                      <div className="text-xs font-mono-code text-white/50">
                        {s.league} • {s.city}, {s.country} • {s.stats.games} Games
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono-code text-emerald-400 bg-emerald-950/40 px-2 py-1 border border-emerald-800">
                      Public Visibility
                    </span>
                    <button
                      onClick={() => onSelectSeason(s.id)}
                      className="px-3 py-1 bg-white/10 hover:bg-white hover:text-black text-xs font-mono-code uppercase transition-colors cursor-pointer"
                    >
                      Inspect File
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 3: DOCUMENTS & PAPERWORK */}
        {activeTab === 'documents' && (
          <div className="bg-[#141414] border border-white/10 p-8 space-y-6">
            <h2 className="text-2xl font-black font-display uppercase tracking-tight text-white">
              Private Contracts & Administrative Vault
            </h2>
            <p className="text-xs text-white/60 font-sans-body">
              These documents are strictly encrypted and hidden from the public portfolio.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-black/40 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#FF5D22]" />
                  <div>
                    <div className="text-xs font-bold text-white font-mono-code">Tokyo Alvark 2023-25 Player Agreement</div>
                    <div className="text-[10px] text-white/40">PDF • 4.2 MB • Encrypted Private</div>
                  </div>
                </div>
                <span className="text-xs font-mono-code text-white/60">Verified</span>
              </div>

              <div className="p-4 bg-black/40 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#FF5D22]" />
                  <div>
                    <div className="text-xs font-bold text-white font-mono-code">Sydney Kings NBL Championship Clearance</div>
                    <div className="text-[10px] text-white/40">PDF • 2.8 MB • Encrypted Private</div>
                  </div>
                </div>
                <span className="text-xs font-mono-code text-white/60">Verified</span>
              </div>

              <div className="p-4 bg-black/40 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#FF5D22]" />
                  <div>
                    <div className="text-xs font-bold text-white font-mono-code">Real Madrid Baloncesto ACB Federation Pass</div>
                    <div className="text-[10px] text-white/40">PDF • 1.9 MB • Encrypted Private</div>
                  </div>
                </div>
                <span className="text-xs font-mono-code text-white/60">Verified</span>
              </div>

              <div className="p-4 bg-black/40 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#FF5D22]" />
                  <div>
                    <div className="text-xs font-bold text-white font-mono-code">FIBA International Letter of Clearance (LOC)</div>
                    <div className="text-[10px] text-white/40">PDF • 890 KB • Encrypted Private</div>
                  </div>
                </div>
                <span className="text-xs font-mono-code text-white/60">Verified</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PRIVATE NOTES & REFLECTIONS */}
        {activeTab === 'notes' && (
          <div className="bg-[#141414] border border-white/10 p-8 space-y-6">
            <h2 className="text-2xl font-black font-display uppercase tracking-tight text-white">
              Private Athlete Logbook
            </h2>

            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Log a private memory, physical note, or tactical reminder..."
                rows={3}
                className="w-full bg-black/50 border border-white/20 p-4 text-xs font-mono-code text-white placeholder-white/30 focus:outline-none focus:border-[#FF5D22]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#FF5D22] text-black font-bold uppercase text-xs font-mono-code tracking-wider hover:bg-white transition-colors cursor-pointer"
              >
                Save Private Note
              </button>
            </form>

            <div className="space-y-3 pt-4 border-t border-white/10">
              {savedNotes.map((note, idx) => (
                <div key={idx} className="p-4 bg-black/40 border border-white/5 flex items-start gap-3">
                  <Lock className="w-3.5 h-3.5 text-[#FF5D22] shrink-0 mt-0.5" />
                  <p className="text-xs font-mono-code text-white/80 leading-relaxed">{note}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
