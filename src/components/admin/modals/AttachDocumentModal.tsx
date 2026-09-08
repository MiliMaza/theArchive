import React, { useState } from 'react';
import { X, FileText, CheckCircle2, Lock, Upload } from 'lucide-react';
import { useCareer, VaultDocument } from '../../../context/CareerContext';

interface AttachDocumentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AttachDocumentModal: React.FC<AttachDocumentModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { seasons, addDocument } = useCareer();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<VaultDocument['category']>('Contract');
  const [seasonId, setSeasonId] = useState<string>(seasons[0]?.id || '06');
  const [fileType, setFileType] = useState('PDF');
  const [fileSize, setFileSize] = useState('3.2 MB');
  const [isEncrypted, setIsEncrypted] = useState(true);
  const [notes, setNotes] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFileName(file.name);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, ''));
      }
      const sizeInMb = (file.size / (1024 * 1024)).toFixed(1);
      setFileSize(`${sizeInMb} MB`);
      const ext = file.name.split('.').pop()?.toUpperCase() || 'PDF';
      setFileType(ext);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    const matchedSeason = seasons.find((s) => s.id === seasonId);

    const newDoc: VaultDocument = {
      id: `doc-${Date.now()}`,
      title: title.trim(),
      seasonId,
      team: matchedSeason?.team || 'International Federation',
      category,
      fileType,
      fileSize,
      uploadedDate: new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
      isEncrypted,
      notes: notes.trim() || 'Official career legal document archived securely.',
    };

    addDocument(newDoc);
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      if (onSuccess) onSuccess();
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="bg-theme-panel border border-theme-subtle w-full max-w-xl flex flex-col shadow-2xl relative my-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-theme-subtle bg-theme-panel">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-[#FF5D22] text-black font-black font-mono-code flex items-center justify-center text-sm">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <span className="text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-widest block">
                Legal & Paperwork Vault
              </span>
              <h2 className="text-xl font-black font-display uppercase tracking-tight text-theme-main">
                Attach Contract / Document PDF
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

        {/* Content Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {success && (
            <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono-code flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Document encrypted and safely archived in the Vault!</span>
            </div>
          )}

          {/* File Picker */}
          <div className="border-2 border-dashed border-theme-subtle hover:border-[#FF5D22] p-5 text-center transition-colors bg-theme-subtle relative cursor-pointer">
            <input
              type="file"
              accept=".pdf,.doc,.docx,.png,.jpg"
              onChange={handleFileChange}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Upload className="w-6 h-6 text-[#FF5D22] mx-auto mb-1.5" />
            <div className="text-xs font-mono-code text-theme-main font-bold">
              {uploadedFileName ? `Attached: ${uploadedFileName}` : 'Select PDF Contract / Legal Document'}
            </div>
            <div className="text-[10px] text-theme-faint font-mono-code mt-0.5">
              Encrypted AES-256 local career vault storage
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1.5">
              Document Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Tokyo Alvark 2025/26 Extension Agreement"
              className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1.5">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as VaultDocument['category'])}
                className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none cursor-pointer"
              >
                <option value="Contract">Player Agreement / Contract</option>
                <option value="Clearance">FIBA / Federation Clearance</option>
                <option value="Medical">Medical / Screening Pass</option>
                <option value="Tax">Tax Slip / Salary Bonus</option>
                <option value="Endorsement">Endorsement / Shoe Deal</option>
                <option value="Scouting">Scouting & Analytics Report</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1.5">
                Associated Campaign
              </label>
              <select
                value={seasonId}
                onChange={(e) => setSeasonId(e.target.value)}
                className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none cursor-pointer"
              >
                {seasons.map((s) => (
                  <option key={s.id} value={s.id}>
                    Season {s.id} — {s.team}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1.5">
              Confidentiality & Security Note
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Fully guaranteed clause, incentive bonuses for top-4 EuroLeague finish..."
              className="w-full bg-theme-subtle border border-theme-subtle p-3 text-xs font-mono-code text-theme-main focus:border-[#FF5D22] focus:outline-none leading-relaxed"
            />
          </div>

          <div className="flex items-center gap-2 p-3 bg-theme-subtle border border-theme-subtle">
            <input
              type="checkbox"
              id="isEncrypted"
              checked={isEncrypted}
              onChange={(e) => setIsEncrypted(e.target.checked)}
              className="accent-[#FF5D22] w-4 h-4 cursor-pointer"
            />
            <label htmlFor="isEncrypted" className="text-xs font-mono-code text-theme-main flex items-center gap-1.5 cursor-pointer">
              <Lock className="w-3.5 h-3.5 text-[#FF5D22]" />
              <span>Mark as Encrypted Private Document (Hidden from public portfolio)</span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-theme-subtle">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-theme-subtle text-theme-main text-xs font-mono-code uppercase cursor-pointer hover:bg-theme-main hover:text-theme-canvas transition-colors border border-theme-subtle"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-6 py-2.5 bg-[#FF5D22] text-black font-bold uppercase text-xs font-mono-code tracking-widest hover:bg-emerald-500 transition-colors cursor-pointer flex items-center gap-2 shadow-lg"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Archive Document</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
