import React, { useState } from 'react';
import { X, Database, CheckCircle, Copy, AlertCircle, ExternalLink, RefreshCw, Key, ShieldCheck } from 'lucide-react';
import { supabase, isSupabaseConfigured, SUPABASE_SQL_SCHEMA } from '../../../lib/supabase';
import { useCareer } from '../../../context/CareerContext';

interface SupabaseSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupabaseSyncModal: React.FC<SupabaseSyncModalProps> = ({ isOpen, onClose }) => {
  const {
    seasons,
    memories,
    documents,
    privateNotes,
    playerProfile,
    isSupabaseConnected,
    isSyncing,
    syncWithSupabase,
    setSupabaseCustomKeys,
    supabaseStatus,
  } = useCareer();

  const [activeTab, setActiveTab] = useState<'status' | 'sql' | 'credentials'>('status');
  const [copiedSQL, setCopiedSQL] = useState(false);
  const [customUrl, setCustomUrl] = useState(() => localStorage.getItem('supabase_custom_url') || '');
  const [customKey, setCustomKey] = useState(() => localStorage.getItem('supabase_custom_key') || '');
  const [connectionMessage, setConnectionMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopySQL = () => {
    navigator.clipboard.writeText(SUPABASE_SQL_SCHEMA);
    setCopiedSQL(true);
    setTimeout(() => setCopiedSQL(false), 2000);
  };

  const handleSaveKeys = (e: React.FormEvent) => {
    e.preventDefault();
    setSupabaseCustomKeys(customUrl.trim(), customKey.trim());
    setConnectionMessage('Credentials saved! Testing Supabase connection...');
    setTimeout(() => {
      syncWithSupabase();
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-theme-panel border border-theme-subtle w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl transition-colors duration-300">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-theme-subtle bg-theme-subtle/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#3ECF8E] text-black flex items-center justify-center font-bold">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono-code text-[#3ECF8E] uppercase tracking-widest font-bold">
                  Supabase Cloud Integration
                </span>
                <span className="text-[10px] font-mono-code text-theme-faint">• Realtime Postgres Database</span>
              </div>
              <h2 className="text-xl font-bold font-display uppercase tracking-tight text-theme-main">
                Cloud Database Synchronization
              </h2>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-theme-muted hover:text-theme-main hover:bg-theme-subtle transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-theme-subtle px-6 pt-3 gap-2 bg-theme-panel">
          {[
            { id: 'status', label: '1. Sync Status' },
            { id: 'credentials', label: '2. API Keys Config' },
            { id: 'sql', label: '3. SQL Schema Setup' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-mono-code uppercase tracking-wider transition-colors cursor-pointer border-b-2 whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-[#3ECF8E] text-[#3ECF8E] font-bold'
                  : 'border-transparent text-theme-muted hover:text-theme-main'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: STATUS & CLOUD ACTIONS */}
          {activeTab === 'status' && (
            <div className="space-y-6">
              {/* Connection Status Banner */}
              <div
                className={`p-5 border flex items-start justify-between gap-4 ${
                  isSupabaseConnected
                    ? 'bg-[#3ECF8E]/10 border-[#3ECF8E]/40 text-[#3ECF8E]'
                    : 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                }`}
              >
                <div className="flex items-start gap-3">
                  {isSupabaseConnected ? (
                    <CheckCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  )}
                  <div>
                    <div className="text-xs font-mono-code uppercase font-bold tracking-wider">
                      {isSupabaseConnected
                        ? 'Supabase Cloud Database Connected'
                        : 'Local Mode Active (Supabase Not Connected)'}
                    </div>
                    <div className="text-xs text-theme-main mt-1 font-sans-body">
                      {isSupabaseConnected
                        ? 'Your career archive automatically pushes changes to your remote Supabase PostgreSQL database tables.'
                        : 'Currently your data is safely persisted in your browser’s local storage. Connect Supabase to sync your data live to the world.'}
                    </div>
                    {supabaseStatus && (
                      <div className="text-[11px] font-mono-code text-theme-muted mt-2">
                        Status: {supabaseStatus}
                      </div>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => syncWithSupabase()}
                  disabled={isSyncing}
                  className="px-4 py-2 bg-[#3ECF8E] hover:bg-white text-black font-mono-code text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5 flex-shrink-0"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSyncing ? 'animate-spin' : ''}`} />
                  <span>{isSyncing ? 'Syncing...' : 'Sync Now'}</span>
                </button>
              </div>

              {/* Data Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-theme-subtle border border-theme-subtle">
                  <div className="text-[10px] font-mono-code text-theme-muted uppercase">Athlete Profile</div>
                  <div className="text-lg font-bold font-display text-theme-main mt-1 truncate">
                    {playerProfile.name}
                  </div>
                  <div className="text-[10px] font-mono-code text-emerald-400 mt-1">Ready to sync</div>
                </div>

                <div className="p-4 bg-theme-subtle border border-theme-subtle">
                  <div className="text-[10px] font-mono-code text-theme-muted uppercase">Seasons Recorded</div>
                  <div className="text-lg font-bold font-mono-code text-theme-main mt-1">
                    {seasons.length} Seasons
                  </div>
                  <div className="text-[10px] font-mono-code text-emerald-400 mt-1">Ready to sync</div>
                </div>

                <div className="p-4 bg-theme-subtle border border-theme-subtle">
                  <div className="text-[10px] font-mono-code text-theme-muted uppercase">Vault Documents</div>
                  <div className="text-lg font-bold font-mono-code text-theme-main mt-1">
                    {documents.length} Files
                  </div>
                  <div className="text-[10px] font-mono-code text-emerald-400 mt-1">Ready to sync</div>
                </div>

                <div className="p-4 bg-theme-subtle border border-theme-subtle">
                  <div className="text-[10px] font-mono-code text-theme-muted uppercase">Memories & Notes</div>
                  <div className="text-lg font-bold font-mono-code text-theme-main mt-1">
                    {memories.length + privateNotes.length} Entries
                  </div>
                  <div className="text-[10px] font-mono-code text-emerald-400 mt-1">Ready to sync</div>
                </div>
              </div>

              {/* Step-by-step guidance */}
              <div className="p-5 bg-theme-subtle/50 border border-theme-subtle space-y-3">
                <div className="text-xs font-mono-code uppercase font-bold text-theme-main flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-[#3ECF8E]" />
                  <span>How Supabase Cloud Persistence Works:</span>
                </div>
                <ol className="text-xs text-theme-muted space-y-2 list-decimal list-inside font-sans-body leading-relaxed">
                  <li>
                    <strong className="text-theme-main">Create a project</strong> at{' '}
                    <a
                      href="https://supabase.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#3ECF8E] underline inline-flex items-center gap-1"
                    >
                      supabase.com <ExternalLink className="w-3 h-3" />
                    </a>
                  </li>
                  <li>
                    Run the ready-to-use SQL script from the <strong>SQL Schema Setup</strong> tab in your Supabase SQL Editor.
                  </li>
                  <li>
                    Paste your <strong>Project URL</strong> and <strong>anon key</strong> into the <strong>API Keys Config</strong> tab.
                  </li>
                  <li>
                    Your portfolio will automatically sync and remain updated across any device or visitor!
                  </li>
                </ol>
              </div>
            </div>
          )}

          {/* TAB 2: CREDENTIALS */}
          {activeTab === 'credentials' && (
            <form onSubmit={handleSaveKeys} className="space-y-6">
              <div className="p-4 bg-theme-subtle/40 border border-theme-subtle text-xs text-theme-muted">
                You can enter your Supabase Project API URL and anon public key below, or set <code className="text-[#3ECF8E]">VITE_SUPABASE_URL</code> and <code className="text-[#3ECF8E]">VITE_SUPABASE_ANON_KEY</code> in your environment.
              </div>

              <div>
                <label className="block text-xs font-mono-code text-theme-muted uppercase tracking-wider mb-2">
                  Supabase Project URL (e.g., https://xyzcompany.supabase.co)
                </label>
                <input
                  type="url"
                  value={customUrl}
                  onChange={(e) => setCustomUrl(e.target.value)}
                  placeholder="https://your-project-ref.supabase.co"
                  className="w-full bg-theme-subtle border border-theme-subtle px-4 py-2.5 text-xs font-mono-code text-theme-main focus:outline-none focus:border-[#3ECF8E]"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-code text-theme-muted uppercase tracking-wider mb-2">
                  Supabase Anon Public API Key (anon public)
                </label>
                <input
                  type="password"
                  value={customKey}
                  onChange={(e) => setCustomKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full bg-theme-subtle border border-theme-subtle px-4 py-2.5 text-xs font-mono-code text-theme-main focus:outline-none focus:border-[#3ECF8E]"
                />
              </div>

              {connectionMessage && (
                <div className="text-xs font-mono-code text-[#3ECF8E] p-3 bg-[#3ECF8E]/10 border border-[#3ECF8E]/30">
                  {connectionMessage}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-4 border-t border-theme-subtle">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#3ECF8E] hover:bg-white text-black font-mono-code text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2"
                >
                  <Key className="w-4 h-4" />
                  <span>Save & Connect Supabase</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 3: SQL SCHEMA */}
          {activeTab === 'sql' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs font-mono-code text-theme-muted uppercase">
                  Copy & Paste this into your Supabase Dashboard &gt; SQL Editor:
                </div>
                <button
                  onClick={handleCopySQL}
                  className="px-3 py-1.5 bg-theme-subtle hover:bg-[#3ECF8E] text-theme-main hover:text-black border border-theme-subtle text-xs font-mono-code font-bold uppercase tracking-wider transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  <span>{copiedSQL ? 'Copied to Clipboard!' : 'Copy SQL Schema'}</span>
                </button>
              </div>

              <pre className="p-4 bg-black border border-theme-subtle text-xs font-mono-code text-[#3ECF8E] overflow-x-auto max-h-72 leading-relaxed">
                {SUPABASE_SQL_SCHEMA}
              </pre>

              <div className="text-[11px] font-mono-code text-theme-faint">
                Tip: This script creates 4 lightweight jsonb tables (<code className="text-[#3ECF8E]">athlete_profile</code>, <code className="text-[#3ECF8E]">seasons</code>, <code className="text-[#3ECF8E]">vault_documents</code>, <code className="text-[#3ECF8E]">vault_notes</code>) with public read/write policies enabled.
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-6 border-t border-theme-subtle flex items-center justify-between bg-theme-subtle/20">
          <div className="text-[11px] font-mono-code text-theme-muted">
            Seamless hybrid persistence: Local Cache + Supabase PostgreSQL
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-theme-subtle text-theme-main hover:bg-theme-panel border border-theme-subtle text-xs font-mono-code uppercase tracking-wider transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
