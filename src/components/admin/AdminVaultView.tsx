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
  RotateCcw,
  Download,
  ExternalLink,
} from 'lucide-react';
import { useCareer, VaultDocument } from '../../context/CareerContext';
import { Season } from '../../types/career';
import { LogSeasonModal } from './modals/LogSeasonModal';
import { UploadMediaModal } from './modals/UploadMediaModal';
import { AttachDocumentModal } from './modals/AttachDocumentModal';
import { DraftMemoryModal } from './modals/DraftMemoryModal';
import { EditSeasonModal } from './modals/EditSeasonModal';

interface AdminVaultViewProps {
  onClose: () => void;
  onSelectSeason: (seasonId: string) => void;
}

export const AdminVaultView: React.FC<AdminVaultViewProps> = ({ onClose, onSelectSeason }) => {
  const {
    seasons,
    documents,
    privateNotes,
    addPrivateNote,
    deletePrivateNote,
    deleteDocument,
    updateSeason,
    resetToDefaults,
    overallCompleteness,
  } = useCareer();

  const [activeTab, setActiveTab] = useState<'overview' | 'seasons' | 'documents' | 'notes'>('overview');
  const [newNote, setNewNote] = useState('');
  
  // Modals state
  const [isLogSeasonOpen, setIsLogSeasonOpen] = useState(false);
  const [isUploadMediaOpen, setIsUploadMediaOpen] = useState(false);
  const [isAttachDocOpen, setIsAttachDocOpen] = useState(false);
  const [isDraftMemoryOpen, setIsDraftMemoryOpen] = useState(false);
  const [editingSeason, setEditingSeason] = useState<Season | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    addPrivateNote(newNote);
    setNewNote('');
  };

  const handleToggleVisibility = (season: Season) => {
    updateSeason(season.id, { isPublic: !season.isPublic });
  };

  return (
    <div className="w-full bg-theme-canvas min-h-screen py-12 px-6 sm:px-12 text-theme-main border-t-2 border-[#FF5D22] transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        {/* Top Vault Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-8 border-b border-theme-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF5D22] text-black flex items-center justify-center font-bold rounded shadow-[0_0_15px_rgba(255,93,34,0.3)]">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono-code bg-[#FF5D22]/20 text-[#FF5D22] px-2 py-0.5 font-bold uppercase tracking-widest border border-[#FF5D22]/30">
                  Private Career Vault
                </span>
                <span className="text-xs text-theme-faint font-mono-code">• Maya Vance #7 ({seasons.length} Seasons Logged)</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-theme-main mt-1">
                Career Management & Archival Administration
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3 self-start sm:self-center">
            <button
              onClick={() => setIsLogSeasonOpen(true)}
              className="px-4 py-2 bg-[#FF5D22] hover:bg-theme-main text-black hover:text-theme-canvas text-xs font-mono-code font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Log Season</span>
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 bg-theme-subtle hover:bg-theme-main text-theme-main hover:text-theme-canvas text-xs font-mono-code uppercase tracking-wider transition-colors cursor-pointer border border-theme-subtle"
            >
              Exit Vault Mode
            </button>
          </div>
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
            Manage Seasons ({seasons.length})
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2 text-xs font-mono-code uppercase tracking-wider transition-colors cursor-pointer border ${
              activeTab === 'documents'
                ? 'bg-[#FF5D22] text-black font-bold border-[#FF5D22]'
                : 'bg-theme-subtle text-theme-muted hover:text-theme-main border-theme-subtle'
            }`}
          >
            Contracts & Paperwork ({documents.length})
          </button>
          <button
            onClick={() => setActiveTab('notes')}
            className={`px-4 py-2 text-xs font-mono-code uppercase tracking-wider transition-colors cursor-pointer border ${
              activeTab === 'notes'
                ? 'bg-[#FF5D22] text-black font-bold border-[#FF5D22]'
                : 'bg-theme-subtle text-theme-muted hover:text-theme-main border-theme-subtle'
            }`}
          >
            Private Reflections & Memos ({privateNotes.length})
          </button>
        </div>

        {/* TAB 1: OVERVIEW & COMPLETENESS GAUGE */}
        {activeTab === 'overview' && (
          <div className="space-y-10">
            {/* Quick Actions Panel */}
            <div className="bg-theme-panel border border-theme-subtle p-8 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-widest block">
                  Vault Quick Actions (Interactive)
                </span>
                <span className="text-[10px] font-mono-code text-theme-faint">
                  Click any action to open workflow
                </span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <button
                  onClick={() => setIsLogSeasonOpen(true)}
                  className="p-5 bg-theme-subtle hover:bg-[#FF5D22] hover:text-black border border-theme-subtle text-left transition-all group cursor-pointer shadow-sm"
                >
                  <Plus className="w-6 h-6 text-[#FF5D22] group-hover:text-black mb-3" />
                  <div className="text-xs font-bold font-mono-code uppercase text-theme-main group-hover:text-black">
                    Log Future Season
                  </div>
                  <div className="text-[10px] text-theme-muted group-hover:text-black/80 mt-1">
                    Register Season {seasons.length + 1} with full stats & club data
                  </div>
                </button>

                <button
                  onClick={() => setIsUploadMediaOpen(true)}
                  className="p-5 bg-theme-subtle hover:bg-[#FF5D22] hover:text-black border border-theme-subtle text-left transition-all group cursor-pointer shadow-sm"
                >
                  <Upload className="w-6 h-6 text-[#FF5D22] group-hover:text-black mb-3" />
                  <div className="text-xs font-bold font-mono-code uppercase text-theme-main group-hover:text-black">
                    Upload High-Res Media
                  </div>
                  <div className="text-[10px] text-theme-muted group-hover:text-black/80 mt-1">
                    Import match photography & arena captures
                  </div>
                </button>

                <button
                  onClick={() => setIsAttachDocOpen(true)}
                  className="p-5 bg-theme-subtle hover:bg-[#FF5D22] hover:text-black border border-theme-subtle text-left transition-all group cursor-pointer shadow-sm"
                >
                  <FileText className="w-6 h-6 text-[#FF5D22] group-hover:text-black mb-3" />
                  <div className="text-xs font-bold font-mono-code uppercase text-theme-main group-hover:text-black">
                    Attach Contract PDF
                  </div>
                  <div className="text-[10px] text-theme-muted group-hover:text-black/80 mt-1">
                    Store confidential federation & salary documents
                  </div>
                </button>

                <button
                  onClick={() => setIsDraftMemoryOpen(true)}
                  className="p-5 bg-theme-subtle hover:bg-[#FF5D22] hover:text-black border border-theme-subtle text-left transition-all group cursor-pointer shadow-sm"
                >
                  <Sparkles className="w-6 h-6 text-[#FF5D22] group-hover:text-black mb-3" />
                  <div className="text-xs font-bold font-mono-code uppercase text-theme-main group-hover:text-black">
                    Draft Private Memory
                  </div>
                  <div className="text-[10px] text-theme-muted group-hover:text-black/80 mt-1">
                    Write personal game anecdotes & reflections
                  </div>
                </button>
              </div>
            </div>

            {/* Completeness Card */}
            <div className="bg-theme-panel border border-theme-subtle p-8 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
                <div>
                  <span className="text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-widest block mb-1">
                    Archival Audit
                  </span>
                  <h2 className="text-3xl font-black font-display uppercase tracking-tight text-theme-main">
                    Overall Career Completeness: {overallCompleteness}%
                  </h2>
                  <p className="text-xs text-theme-muted font-sans-body mt-1">
                    All {seasons.length} campaigns structured with statistical records, photos, and narratives.
                  </p>
                </div>

                <div className="w-full lg:w-72 bg-theme-subtle h-3 border border-theme-subtle relative overflow-hidden">
                  <div
                    style={{ width: `${overallCompleteness}%` }}
                    className="bg-[#FF5D22] h-full transition-all duration-700"
                  />
                </div>
              </div>

              {/* Completeness Per Season Breakdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {seasons.map((s) => (
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
                      <span>{s.stats.games} Games • {s.stats.pointsPerGame} PPG</span>
                      <span className="text-emerald-500 font-bold">Verified</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reset to Default Records Bar */}
            <div className="p-6 bg-theme-panel border border-theme-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="text-xs font-mono-code font-bold text-theme-main uppercase">
                  Data Reset & Restoration
                </div>
                <div className="text-[10px] text-theme-faint font-mono-code mt-0.5">
                  Restore original canonical six-season dataset if needed.
                </div>
              </div>

              {showResetConfirm ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      resetToDefaults();
                      setShowResetConfirm(false);
                    }}
                    className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-xs font-mono-code uppercase font-bold cursor-pointer transition-colors"
                  >
                    Confirm Reset
                  </button>
                  <button
                    onClick={() => setShowResetConfirm(false)}
                    className="px-3 py-1.5 bg-theme-subtle text-theme-muted text-xs font-mono-code uppercase cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setShowResetConfirm(true)}
                  className="px-4 py-2 bg-theme-subtle hover:bg-theme-main text-theme-muted hover:text-theme-canvas text-xs font-mono-code uppercase tracking-wider transition-colors cursor-pointer border border-theme-subtle flex items-center gap-2"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset to Defaults</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: SEASONS MANAGEMENT */}
        {activeTab === 'seasons' && (
          <div className="bg-theme-panel border border-theme-subtle p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black font-display uppercase tracking-tight text-theme-main">
                  Career Campaigns Directory ({seasons.length} Seasons)
                </h2>
                <p className="text-xs text-theme-muted font-sans-body mt-1">
                  Manage visibility, edit statistical splits, or log new campaigns.
                </p>
              </div>

              <button
                onClick={() => setIsLogSeasonOpen(true)}
                className="px-4 py-2 bg-[#FF5D22] text-black font-bold uppercase text-xs font-mono-code tracking-wider hover:bg-theme-main hover:text-theme-canvas transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Log New Season</span>
              </button>
            </div>

            <div className="divide-y divide-theme-subtle">
              {seasons.map((s) => (
                <div key={s.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="w-9 h-9 rounded bg-[#FF5D22] text-black font-black font-mono-code flex items-center justify-center text-xs shadow-sm">
                      {s.id}
                    </span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold text-theme-main font-display uppercase">
                          {s.team} ({s.yearRange})
                        </span>
                        {s.isCurrentSeason && (
                          <span className="text-[10px] font-mono-code bg-[#FF5D22] text-black px-1.5 py-0.2 font-bold uppercase">
                            Active Campaign
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-mono-code text-theme-faint mt-0.5">
                        {s.league} • {s.city}, {s.country} • {s.stats.games} Games • {s.stats.pointsPerGame} PPG • {s.stats.assistsPerGame} APG
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleVisibility(s)}
                      className={`px-2.5 py-1 text-[11px] font-mono-code border flex items-center gap-1 transition-colors cursor-pointer ${
                        s.isPublic
                          ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30'
                          : 'text-amber-500 bg-amber-500/10 border-amber-500/30'
                      }`}
                      title="Toggle Public/Private status"
                    >
                      {s.isPublic ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                      <span>{s.isPublic ? 'Public' : 'Private'}</span>
                    </button>

                    <button
                      onClick={() => setEditingSeason(s)}
                      className="px-3 py-1 bg-theme-subtle hover:bg-[#FF5D22] hover:text-black text-theme-main text-xs font-mono-code uppercase transition-colors cursor-pointer border border-theme-subtle flex items-center gap-1"
                    >
                      <Edit className="w-3 h-3" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => onSelectSeason(s.id)}
                      className="px-3 py-1 bg-theme-subtle hover:bg-theme-main hover:text-theme-canvas text-theme-main text-xs font-mono-code uppercase transition-colors cursor-pointer border border-theme-subtle"
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black font-display uppercase tracking-tight text-theme-main">
                  Private Contracts & Legal Vault
                </h2>
                <p className="text-xs text-theme-muted font-sans-body mt-1">
                  Confidential athlete agreements, FIBA clearances, tax certificates, and medical records.
                </p>
              </div>

              <button
                onClick={() => setIsAttachDocOpen(true)}
                className="px-4 py-2 bg-[#FF5D22] text-black font-bold uppercase text-xs font-mono-code tracking-wider hover:bg-theme-main hover:text-theme-canvas transition-colors cursor-pointer flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Attach Document</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {documents.map((doc) => (
                <div key={doc.id} className="p-4 bg-theme-subtle border border-theme-subtle flex flex-col justify-between gap-3 group hover:border-[#FF5D22] transition-colors">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <div className="p-2 bg-theme-panel text-[#FF5D22] border border-theme-subtle rounded mt-0.5">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-theme-main font-mono-code leading-snug">
                          {doc.title}
                        </div>
                        <div className="text-[10px] text-theme-faint font-mono-code mt-1">
                          {doc.category} • {doc.fileType} • {doc.fileSize} • Uploaded {doc.uploadedDate}
                        </div>
                        {doc.notes && (
                          <div className="text-[11px] text-theme-muted font-sans-body mt-2 leading-relaxed">
                            {doc.notes}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-theme-subtle text-[11px] font-mono-code">
                    <div className="flex items-center gap-1.5 text-emerald-500">
                      <Lock className="w-3 h-3" />
                      <span>Encrypted Private</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => deleteDocument(doc.id)}
                        className="text-theme-faint hover:text-red-500 transition-colors p-1 cursor-pointer"
                        title="Delete document"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PRIVATE NOTES & REFLECTIONS */}
        {activeTab === 'notes' && (
          <div className="bg-theme-panel border border-theme-subtle p-8 space-y-6 shadow-sm">
            <h2 className="text-2xl font-black font-display uppercase tracking-tight text-theme-main">
              Private Athlete Logbook & Tactical Memos
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
                className="px-5 py-2.5 bg-[#FF5D22] text-black font-bold uppercase text-xs font-mono-code tracking-wider hover:bg-theme-main hover:text-theme-canvas transition-colors cursor-pointer flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Save Private Note</span>
              </button>
            </form>

            <div className="space-y-3 pt-4 border-t border-theme-subtle">
              {privateNotes.map((note, idx) => (
                <div key={idx} className="p-4 bg-theme-subtle border border-theme-subtle flex items-start justify-between gap-3 group">
                  <div className="flex items-start gap-3">
                    <Lock className="w-3.5 h-3.5 text-[#FF5D22] shrink-0 mt-0.5" />
                    <p className="text-xs font-mono-code text-theme-muted leading-relaxed">{note}</p>
                  </div>
                  <button
                    onClick={() => deletePrivateNote(idx)}
                    className="text-theme-faint hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity p-1 cursor-pointer"
                    title="Delete note"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Dynamic Modals */}
      <LogSeasonModal
        isOpen={isLogSeasonOpen}
        onClose={() => setIsLogSeasonOpen(false)}
        onSuccess={(seasonId) => {
          onSelectSeason(seasonId);
        }}
      />

      <UploadMediaModal
        isOpen={isUploadMediaOpen}
        onClose={() => setIsUploadMediaOpen(false)}
      />

      <AttachDocumentModal
        isOpen={isAttachDocOpen}
        onClose={() => setIsAttachDocOpen(false)}
      />

      <DraftMemoryModal
        isOpen={isDraftMemoryOpen}
        onClose={() => setIsDraftMemoryOpen(false)}
      />

      {editingSeason && (
        <EditSeasonModal
          season={editingSeason}
          isOpen={!!editingSeason}
          onClose={() => setEditingSeason(null)}
        />
      )}
    </div>
  );
};
