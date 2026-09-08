import React, { useState } from 'react';
import {
  Lock,
  FileText,
  Plus,
  Edit,
  Trash2,
  Upload,
  Eye,
  EyeOff,
  User,
  Database,
} from 'lucide-react';
import { useCareer } from '../../context/CareerContext';
import { Season } from '../../types/career';
import { LogSeasonModal } from './modals/LogSeasonModal';
import { UploadMediaModal } from './modals/UploadMediaModal';
import { AttachDocumentModal } from './modals/AttachDocumentModal';
import { DraftMemoryModal } from './modals/DraftMemoryModal';
import { EditSeasonModal } from './modals/EditSeasonModal';
import { EditAthleteProfileModal } from './modals/EditAthleteProfileModal';
import { SupabaseSyncModal } from './modals/SupabaseSyncModal';

interface AdminVaultViewProps {
  onClose: () => void;
  onSelectSeason: (seasonId: string) => void;
}

export const AdminVaultView: React.FC<AdminVaultViewProps> = ({ onClose, onSelectSeason }) => {
  const {
    seasons,
    documents,
    privateNotes,
    playerProfile,
    addPrivateNote,
    deletePrivateNote,
    deleteDocument,
    updateSeason,
    deleteSeason,
    resetToDefaults,
    overallCompleteness,
  } = useCareer();

  const [activeTab, setActiveTab] = useState<'configuration' | 'seasons' | 'documents' | 'notes'>('configuration');
  const [newNote, setNewNote] = useState('');

  // Modals state
  const [isSupabaseModalOpen, setIsSupabaseModalOpen] = useState(false);
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isLogSeasonOpen, setIsLogSeasonOpen] = useState(false);
  const [isUploadMediaOpen, setIsUploadMediaOpen] = useState(false);
  const [isAttachDocOpen, setIsAttachDocOpen] = useState(false);
  const [isDraftMemoryOpen, setIsDraftMemoryOpen] = useState(false);
  const [editingSeason, setEditingSeason] = useState<Season | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [deletingSeasonId, setDeletingSeasonId] = useState<string | null>(null);

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
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-4 border-b border-theme-subtle">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#FF5D22] text-black flex items-center justify-center font-bold rounded shadow-[0_0_15px_rgba(255,93,34,0.3)]">
              <Lock className="w-5 h-5" />
            </div>
            <div className='px-2'>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono-code bg-[#FF5D22]/20 text-[#FF5D22] px-2 py-0.5 font-bold uppercase tracking-widest border border-[#FF5D22]/30">
                  Private Career Vault
                </span>
                <span className="text-xs text-theme-faint font-mono-code">• {playerProfile.name} ({seasons.length} Seasons Logged)</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-black font-display uppercase tracking-tight text-theme-main mt-1">
                Career Administration
              </h1>
            </div>
          </div>
        </div>

        {/* Vault Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8 border-b border-theme-subtle pb-4">
          <button
            onClick={() => setActiveTab('configuration')}
            className={`px-4 py-2 text-xs font-mono-code uppercase tracking-wider transition-colors cursor-pointer border ${activeTab === 'configuration'
              ? 'bg-[#FF5D22] text-black font-bold border-[#FF5D22]'
              : 'bg-theme-subtle text-theme-muted hover:text-theme-main border-theme-subtle'
              }`}
          >
            Configuration
          </button>
          <button
            onClick={() => setActiveTab('seasons')}
            className={`px-4 py-2 text-xs font-mono-code uppercase tracking-wider transition-colors cursor-pointer border ${activeTab === 'seasons'
              ? 'bg-[#FF5D22] text-black font-bold border-[#FF5D22]'
              : 'bg-theme-subtle text-theme-muted hover:text-theme-main border-theme-subtle'
              }`}
          >
            Manage Seasons
          </button>
          <button
            onClick={() => setActiveTab('documents')}
            className={`px-4 py-2 text-xs font-mono-code uppercase tracking-wider transition-colors cursor-pointer border ${activeTab === 'documents'
              ? 'bg-[#FF5D22] text-black font-bold border-[#FF5D22]'
              : 'bg-theme-subtle text-theme-muted hover:text-theme-main border-theme-subtle'
              }`}
          >
            Contracts & Paperwork
          </button>
        </div>

        {/* TAB 1: CONFIGURATION */}
        {activeTab === 'configuration' && (
          <div className="space-y-10">
            {/* Athlete Profile Identity Card */}
            <div className="bg-theme-panel border border-theme-subtle p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
              <div className="flex items-center gap-5">
                <div className="w-16 h-16 bg-theme-subtle border border-theme-subtle overflow-hidden flex-shrink-0 relative">
                  <img
                    src={playerProfile.profileImage || "https://images.unsplash.com/photo-1546519638-68e109498ffc?q=80&w=1000&auto=format&fit=crop"}
                    alt={playerProfile.name}
                    className="w-full h-full object-cover grayscale"
                  />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-widest font-bold">
                      Active Athlete Profile
                    </span>
                  </div>
                  <h3 className="text-xl font-bold font-display uppercase tracking-tight text-theme-main">
                    {playerProfile.name} {playerProfile.nickname ? `"${playerProfile.nickname}"` : ''}
                  </h3>
                  <p className="text-xs text-theme-muted font-sans-body">
                    {playerProfile.currentTeam} ({playerProfile.currentLeague} • {playerProfile.currentCountry}) — {playerProfile.height}, {playerProfile.weight}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsEditProfileOpen(true)}
                className="px-4 py-2 bg-[#FF5D22] hover:bg-white text-black font-mono-code text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 flex-shrink-0"
              >
                <User className="w-4 h-4" />
                <span>Edit Profile</span>
              </button>
            </div>

            {/* Quick Actions Panel */}
            <div className="bg-theme-panel border border-theme-subtle p-8 shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-widest block">
                  Data Management
                </span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setIsSupabaseModalOpen(true)}
                  className="p-5 bg-[#3ECF8E]/10 hover:bg-[#3ECF8E] hover:text-black border border-[#3ECF8E]/30 text-left transition-all group cursor-pointer shadow-sm"
                >
                  <Database className="w-6 h-6 text-[#3ECF8E] group-hover:text-black mb-3" />
                  <div className="text-xs font-bold font-mono-code uppercase text-[#3ECF8E] group-hover:text-black">
                    Supabase Cloud
                  </div>
                  <div className="text-[10px] text-theme-muted group-hover:text-black/80 mt-1">
                    Sync and persist your data
                  </div>
                </button>

                <button
                  onClick={() => setIsUploadMediaOpen(true)}
                  className="p-5 bg-theme-subtle hover:bg-[#FF5D22] hover:text-black border border-theme-subtle text-left transition-all group cursor-pointer shadow-sm"
                >
                  <Upload className="w-6 h-6 text-[#FF5D22] group-hover:text-black mb-3" />
                  <div className="text-xs font-bold font-mono-code uppercase text-theme-main group-hover:text-black">
                    Upload Media
                  </div>
                  <div className="text-[10px] text-theme-muted group-hover:text-black/80 mt-1">
                    Import photos & videos
                  </div>
                </button>

              </div>
            </div>

          </div>
        )}

        {/* TAB 2: SEASONS MANAGEMENT */}
        {activeTab === 'seasons' && (
          <div className="bg-theme-panel border border-theme-subtle p-8 space-y-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-black font-display uppercase tracking-tight text-theme-main">
                  Career Campaigns Directory
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
                      className={`px-2.5 py-1 text-[11px] font-mono-code border flex items-center gap-1 transition-colors cursor-pointer ${s.isPublic
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

                    {deletingSeasonId === s.id ? (
                      <div className="flex items-center gap-1 bg-red-600/10 border border-red-600/30 px-2 py-0.5 rounded">
                        <span className="text-[10px] font-mono-code text-red-500 font-bold uppercase">Delete?</span>
                        <button
                          onClick={() => {
                            deleteSeason(s.id);
                            setDeletingSeasonId(null);
                          }}
                          className="px-2 py-0.5 bg-red-600 hover:bg-red-700 text-white text-[10px] font-mono-code font-bold uppercase cursor-pointer"
                        >
                          Yes
                        </button>
                        <button
                          onClick={() => setDeletingSeasonId(null)}
                          className="px-1.5 py-0.5 bg-theme-subtle text-theme-muted text-[10px] font-mono-code uppercase cursor-pointer"
                        >
                          No
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setDeletingSeasonId(s.id)}
                        className="px-2.5 py-1 bg-theme-subtle hover:bg-red-600 hover:text-white text-red-500 text-xs font-mono-code uppercase transition-colors cursor-pointer border border-theme-subtle flex items-center gap-1"
                        title="Delete Season"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    )}

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
      </div>

      {/* Dynamic Modals */}
      <SupabaseSyncModal
        isOpen={isSupabaseModalOpen}
        onClose={() => setIsSupabaseModalOpen(false)}
      />

      <EditAthleteProfileModal
        isOpen={isEditProfileOpen}
        onClose={() => setIsEditProfileOpen(false)}
      />

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
