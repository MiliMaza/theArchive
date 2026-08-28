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
    <div className="w-full bg-theme-canvas min-h-screen py-12 px-6 sm:px-12 text-theme-main border-t-2 border-[#FF5D22] transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Top Vault Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-theme-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF5D22] text-black flex items-center justify-center font-bold rounded">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono-code bg-[#FF5D22]/20 text-[#FF5D22] px-2 py-0.5 font-bold uppercase tracking-widest border border-[#FF5D22]/30">
                  Private Career Vault
                </span>
                <span className="text-xs text-theme-faint font-mono-code">• Maya Vance #7</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-theme-main mt-1">
                Career Management & Archival Health
              </h1>
            </div>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-2 bg-theme-subtle hover:bg-theme-main text-theme-main hover:text-theme-canvas text-xs font-mono-code uppercase tracking-wider transition-colors cursor-pointer self-start sm:self-center border border-theme-subtle"
          >
            Exit Vault Mode
          </button>
        </div>

        {/* Vault Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-theme-subtle pb-4">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 text-xs font-mono-code uppercase tracking-wider transition-colors cursor-pointer border ${
              activeTab === 'overview'
                ? 'bg-[#FF5D22] text-black font-bold border-[#FF5D22]'
                : 'bg-theme-subtle text-theme-muted hover:text-theme-main border-theme-subtle'
            }`}
          >
            Career Completeness & Audits
          </button>
          <button
            onClick={() => setActiveTab('seasons')}
            className={`px-4 py-2 text-xs font-mono-code uppercase tracking-wider transition-colors cursor-pointer border ${
              activeTab === 'seasons'
                ? 'bg-[#FF5D22] text-black font-bold border-[#FF5D22]'
                : 'bg-theme-subtle text-theme-muted hover:text-theme-main border-theme-subtle'
            }`}
          >
            Manage 6 Seasons
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2 text-xs font-mono-code uppercase tracking-wider transition-colors cursor-pointer border ${
              activeTab === 'documents'
                ? 'bg-[#FF5D22] text-black font-bold border-[#FF5D22]'
                : 'bg-theme-subtle text-theme-muted hover:text-theme-main border-theme-subtle'
            }`}
          >
            Contracts & Paperwork
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 text-xs font-mono-code uppercase tracking-wider transition-colors cursor-pointer border ${
              activeTab === 'notes'
                ? 'bg-[#FF5D22] text-black font-bold border-[#FF5D22]'
                : 'bg-theme-subtle text-theme-muted hover:text-theme-main border-theme-subtle'
            }`}
          >
            Private Reflections & Memos
          </button>
        </div>

        {/* TAB 1: OVERVIEW & COMPLETENESS GAUGE */}
        {activeTab === 'overview' && (
          <div className="space-y-10">
            {/* Completeness Card */}
            <div className="bg-theme-panel border border-theme-subtle p-8 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                <div>
                  <span className="text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-widest block mb-1">
                    Archival Audit
                  </span>
                  <h2 className="text-3xl font-black font-display uppercase tracking-tight text-theme-main">
                    Overall Career Completeness: {totalCompleteness}%
                  </h2>
                  <p className="text-xs text-theme-muted font-sans-body mt-1">
                    All 6 professional campaigns structured with statistical records, photos, and narratives.
                  </p>
                </div>

                <div className="w-full lg:w-72 bg-theme-subtle h-3 border border-theme-subtle relative overflow-hidden">
                  <div
                    style={{ width: `${totalCompleteness}%` }}
                    className="bg-[#FF5D22] h-full transition-all duration-700"
                  />
                </div>
              </div>

              {/* Completeness Per Season Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {seasonsData.map((s) => (
                  <div key={s.id} className="p-5 bg-theme-subtle border border-theme-subtle space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono-code text-[#FF5D22] font-bold">
                        Season {s.id} • {s.yearRange}
                      </span>
                      <span className="text-xs font-mono-code text-theme-main font-bold">
                        {s.completenessScore}%
                      </span>
                    </div>

                    <div className="text-sm font-bold text-theme-main font-display truncate">
                      {s.team}
                    </div>

                    <div className="w-full bg-theme-panel h-1.5 overflow-hidden">
                      <div
                        style={{ width: `${s.completenessScore}%` }}
                        className="bg-[#FF5D22] h-full"
                      />
                    </div>

                    <div className="text-[10px] font-mono-code text-theme-faint flex items-center justify-between pt-1">
                      <span>Stats: Complete</span>
                      <span className="text-emerald-500 font-bold">Verified</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-theme-panel border border-theme-subtle p-8 shadow-sm">
              <span className="text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-widest block mb-4">
                Vault Quick Actions
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <button className="p-4 bg-theme-subtle hover:bg-[#FF5D22] hover:text-black border border-theme-subtle text-left transition-all group cursor-pointer">
                  <Plus className="w-5 h-5 text-[#FF5D22] group-hover:text-black mb-2" />
                  <div className="text-xs font-bold font-mono-code uppercase text-theme-main group-hover:text-black">Log Future Season</div>
                  <div className="text-[10px] text-theme-muted group-hover:text-black/70">Prepare 2025/26 campaign</div>
                </button>

                <button className="p-4 bg-theme-subtle hover:bg-[#FF5D22] hover:text-black border border-theme-subtle text-left transition-all group cursor-pointer">
                  <Upload className="w-5 h-5 text-[#FF5D22] group-hover:text-black mb-2" />
                  <div className="text-xs font-bold font-mono-code uppercase text-theme-main group-hover:text-black">Upload High-Res Media</div>
                  <div className="text-[10px] text-theme-muted group-hover:text-black/70">Batch import match photography</div>
                </button>

                <button className="p-4 bg-theme-subtle hover:bg-[#FF5D22] hover:text-black border border-theme-subtle text-left transition-all group cursor-pointer">
                  <FileText className="w-5 h-5 text-[#FF5D22] group-hover:text-black mb-2" />
                  <div className="text-xs font-bold font-mono-code uppercase text-theme-main group-hover:text-black">Attach Contract PDF</div>
                  <div className="text-[10px] text-theme-muted group-hover:text-black/70">Private salary / federation slip</div>
                </button>

                <button className="p-4 bg-theme-subtle hover:bg-[#FF5D22] hover:text-black border border-theme-subtle text-left transition-all group cursor-pointer">
                  <Sparkles className="w-5 h-5 text-[#FF5D22] group-hover:text-black mb-2" />
                  <div className="text-xs font-bold font-mono-code uppercase text-theme-main group-hover:text-black">Draft Private Memory</div>
                  <div className="text-[10px] text-theme-muted group-hover:text-black/70">Locker room & mental notes</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: SEASONS MANAGEMENT */}
        {activeTab === 'seasons' && (
          <div className="bg-theme-panel border border-theme-subtle p-8 space-y-4 shadow-sm">
            <h2 className="text-2xl font-black font-display uppercase tracking-tight text-theme-main mb-4">
              Six Seasons Directory & Access Control
            </h2>
            <div className="divide-y divide-theme-subtle">
              {seasonsData.map((s) => (
                <div key={s.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="w-8 h-8 rounded bg-[#FF5D22] text-black font-black font-mono-code flex items-center justify-center text-xs">
                      {s.id}
                    </span>
                    <div>
                      <div className="text-sm font-bold text-theme-main font-display uppercase">
                        {s.team} ({s.yearRange})
                      </div>
                      <div className="text-xs font-mono-code text-theme-faint">
                        {s.league} • {s.city}, {s.country} • {s.stats.games} Games
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono-code text-emerald-500 bg-emerald-500/10 px-2 py-1 border border-emerald-500/30">
                      Public Visibility
                    </span>
                    <button
                      onClick={() => onSelectSeason(s.id)}
                      className="px-3 py-1 bg-theme-subtle hover:bg-[#FF5D22] hover:text-black text-theme-main text-xs font-mono-code uppercase transition-colors cursor-pointer border border-theme-subtle"
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
          <div className="bg-theme-panel border border-theme-subtle p-8 space-y-6 shadow-sm">
            <h2 className="text-2xl font-black font-display uppercase tracking-tight text-theme-main">
              Private Contracts & Administrative Vault
            </h2>
            <p className="text-xs text-theme-muted font-sans-body">
              These documents are strictly encrypted and hidden from the public portfolio.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-theme-subtle border border-theme-subtle flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#FF5D22]" />
                  <div>
                    <div className="text-xs font-bold text-theme-main font-mono-code">Tokyo Alvark 2023-25 Player Agreement</div>
                    <div className="text-[10px] text-theme-faint">PDF • 4.2 MB • Encrypted Private</div>
                  </div>
                </div>
                <span className="text-xs font-mono-code text-theme-muted">Verified</span>
              </div>

              <div className="p-4 bg-theme-subtle border border-theme-subtle flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#FF5D22]" />
                  <div>
                    <div className="text-xs font-bold text-theme-main font-mono-code">Sydney Kings NBL Championship Clearance</div>
                    <div className="text-[10px] text-theme-faint">PDF • 2.8 MB • Encrypted Private</div>
                  </div>
                </div>
                <span className="text-xs font-mono-code text-theme-muted">Verified</span>
              </div>

              <div className="p-4 bg-theme-subtle border border-theme-subtle flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#FF5D22]" />
                  <div>
                    <div className="text-xs font-bold text-theme-main font-mono-code">Real Madrid Baloncesto ACB Federation Pass</div>
                    <div className="text-[10px] text-theme-faint">PDF • 1.9 MB • Encrypted Private</div>
                  </div>
                </div>
                <span className="text-xs font-mono-code text-theme-muted">Verified</span>
              </div>

              <div className="p-4 bg-theme-subtle border border-theme-subtle flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-[#FF5D22]" />
                  <div>
                    <div className="text-xs font-bold text-theme-main font-mono-code">FIBA International Letter of Clearance (LOC)</div>
                    <div className="text-[10px] text-theme-faint">PDF • 890 KB • Encrypted Private</div>
                  </div>
                </div>
                <span className="text-xs font-mono-code text-theme-muted">Verified</span>
              </div>
            </div>
          </div>
        )}

        {/* TAB 4: PRIVATE NOTES & REFLECTIONS */}
        {activeTab === 'notes' && (
          <div className="bg-theme-panel border border-theme-subtle p-8 space-y-6 shadow-sm">
            <h2 className="text-2xl font-black font-display uppercase tracking-tight text-theme-main">
              Private Athlete Logbook
            </h2>

            <form onSubmit={handleAddNote} className="space-y-3">
              <textarea
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                placeholder="Log a private memory, physical note, or tactical reminder..."
                rows={3}
                className="w-full bg-theme-subtle border border-theme-subtle p-4 text-xs font-mono-code text-theme-main placeholder:text-theme-faint focus:outline-none focus:border-[#FF5D22]"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-[#FF5D22] text-black font-bold uppercase text-xs font-mono-code tracking-wider hover:bg-theme-main hover:text-theme-canvas transition-colors cursor-pointer"
              >
                Save Private Note
              </button>
            </form>

            <div className="space-y-3 pt-4 border-t border-theme-subtle">
              {savedNotes.map((note, idx) => (
                <div key={idx} className="p-4 bg-theme-subtle border border-theme-subtle flex items-start gap-3">
                  <Lock className="w-3.5 h-3.5 text-[#FF5D22] shrink-0 mt-0.5" />
                  <p className="text-xs font-mono-code text-theme-muted leading-relaxed">{note}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
