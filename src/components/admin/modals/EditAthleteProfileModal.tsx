import React, { useState } from 'react';
import { X, User, Save, Sparkles, Image as ImageIcon, Award, Shield, FileText, CheckCircle } from 'lucide-react';
import { useCareer } from '../../../context/CareerContext';
import { PlayerProfile } from '../../../types/career';
import { MediaDropzone } from '../../common/MediaDropzone';

interface EditAthleteProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EditAthleteProfileModal: React.FC<EditAthleteProfileModalProps> = ({
  isOpen,
  onClose,
}) => {
  const { playerProfile, updatePlayerProfile } = useCareer();

  const [formData, setFormData] = useState<Partial<PlayerProfile>>({
    name: playerProfile.name,
    firstName: playerProfile.firstName,
    lastName: playerProfile.lastName,
    nickname: playerProfile.nickname || '',
    tagline: playerProfile.tagline,
    role: playerProfile.role,
    jerseyNumber: playerProfile.jerseyNumber,
    position: playerProfile.position,
    height: playerProfile.height,
    wingspan: playerProfile.wingspan,
    weight: playerProfile.weight,
    currentTeam: playerProfile.currentTeam,
    currentCountry: playerProfile.currentCountry,
    currentLeague: playerProfile.currentLeague,
    careerSpan: playerProfile.careerSpan,
    bioSummary: playerProfile.bioSummary,
    quote: playerProfile.quote,
    profileImage: playerProfile.profileImage || '',
    philosophy: playerProfile.philosophy || [
      'Dictate the tempo before the defense sets.',
      'Footwork creates space; anticipation creates advantage.',
      'Trust the repetition when the crowd disappears.',
      'Respect the culture of every city you represent.',
    ],
  });

  const [activeTab, setActiveTab] = useState<'general' | 'physical' | 'narrative' | 'philosophy'>('general');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field: keyof PlayerProfile, value: any) => {
    setFormData((prev) => {
      const updated = {
        ...prev,
        [field]: value,
      };

      // If full name is changed, automatically update firstName and lastName
      if (field === 'name' && typeof value === 'string') {
        const parts = value.trim().split(/\s+/);
        if (parts.length > 1) {
          updated.firstName = parts.slice(0, -1).join(' ');
          updated.lastName = parts[parts.length - 1];
        } else if (parts.length === 1 && parts[0]) {
          updated.firstName = parts[0];
          updated.lastName = parts[0];
        }
      }

      return updated;
    });
  };

  const handlePhilosophyChange = (index: number, value: string) => {
    const updated = [...(formData.philosophy || [])];
    updated[index] = value;
    setFormData((prev) => ({
      ...prev,
      philosophy: updated,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const fullName = (formData.name || '').trim();
    let firstName = (formData.firstName || '').trim();
    let lastName = (formData.lastName || '').trim();

    if (fullName) {
      const parts = fullName.split(/\s+/);
      if (!firstName) {
        firstName = parts.length > 1 ? parts.slice(0, -1).join(' ') : parts[0];
      }
      if (!lastName) {
        lastName = parts.length > 1 ? parts[parts.length - 1] : parts[0];
      }
    }

    updatePlayerProfile({
      ...formData,
      name: fullName || formData.name,
      firstName: firstName || 'Athlete',
      lastName: lastName || 'Athlete',
    });

    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-theme-panel border border-theme-subtle w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl transition-colors duration-300">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-theme-subtle bg-theme-subtle/30">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-[#FF5D22] text-black flex items-center justify-center font-bold">
              <User className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-widest font-bold">
                  Portfolio Identity
                </span>
                <span className="text-[10px] font-mono-code text-theme-faint">• Live Customization</span>
              </div>
              <h2 className="text-xl font-bold font-display uppercase tracking-tight text-theme-main">
                Edit Athlete Profile & Specifications
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

        {/* Navigation Tabs */}
        <div className="flex border-b border-theme-subtle px-6 pt-3 gap-2 bg-theme-panel overflow-x-auto">
          {[
            { id: 'general', label: '1. Identity & Club' },
            { id: 'physical', label: '2. Physical Blueprint' },
            { id: 'narrative', label: '3. Story & Manifesto' },
            { id: 'philosophy', label: '4. Philosophy Pillars' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 text-xs font-mono-code uppercase tracking-wider transition-colors cursor-pointer border-b-2 whitespace-nowrap ${activeTab === tab.id
                  ? 'border-[#FF5D22] text-[#FF5D22] font-bold'
                  : 'border-transparent text-theme-muted hover:text-theme-main'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* TAB 1: IDENTITY & CLUB */}
          {activeTab === 'general' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-mono-code text-theme-muted uppercase tracking-wider mb-2">
                    Full Display Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name || ''}
                    onChange={(e) => handleChange('name', e.target.value)}
                    placeholder="e.g. Maya Vance"
                    className="w-full bg-theme-subtle border border-theme-subtle px-4 py-2.5 text-sm font-display text-theme-main focus:outline-none focus:border-[#FF5D22]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-theme-muted uppercase tracking-wider mb-2">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={formData.firstName || ''}
                    onChange={(e) => handleChange('firstName', e.target.value)}
                    placeholder="e.g. Maya"
                    className="w-full bg-theme-subtle border border-theme-subtle px-4 py-2.5 text-sm font-sans-body text-theme-main focus:outline-none focus:border-[#FF5D22]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-theme-muted uppercase tracking-wider mb-2">
                    Last Name (Navbar Brand) *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName || ''}
                    onChange={(e) => handleChange('lastName', e.target.value)}
                    placeholder="e.g. Vance or Maza"
                    className="w-full bg-theme-subtle border border-theme-subtle px-4 py-2.5 text-sm font-display font-bold uppercase text-theme-main focus:outline-none focus:border-[#FF5D22]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono-code text-theme-muted uppercase tracking-wider mb-2">
                    Moniker / Nickname
                  </label>
                  <input
                    type="text"
                    value={formData.nickname || ''}
                    onChange={(e) => handleChange('nickname', e.target.value)}
                    placeholder="e.g. The Architect, Flash, Sniper"
                    className="w-full bg-theme-subtle border border-theme-subtle px-4 py-2.5 text-sm font-sans-body text-theme-main focus:outline-none focus:border-[#FF5D22]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-theme-muted uppercase tracking-wider mb-2">
                    Primary Role / Position Title *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.role || ''}
                    onChange={(e) => handleChange('role', e.target.value)}
                    placeholder="e.g. Point Guard, Shooting Guard, Forward"
                    className="w-full bg-theme-subtle border border-theme-subtle px-4 py-2.5 text-sm font-sans-body text-theme-main focus:outline-none focus:border-[#FF5D22]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono-code text-theme-muted uppercase tracking-wider mb-2">
                    Jersey Number *
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.jerseyNumber ?? 7}
                    onChange={(e) => handleChange('jerseyNumber', parseInt(e.target.value) || 0)}
                    placeholder="7"
                    className="w-full bg-theme-subtle border border-theme-subtle px-4 py-2.5 text-sm font-mono-code text-theme-main focus:outline-none focus:border-[#FF5D22]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-theme-muted uppercase tracking-wider mb-2">
                    Career Span
                  </label>
                  <input
                    type="text"
                    value={formData.careerSpan || ''}
                    onChange={(e) => handleChange('careerSpan', e.target.value)}
                    placeholder="2018 — Present"
                    className="w-full bg-theme-subtle border border-theme-subtle px-4 py-2.5 text-sm font-mono-code text-theme-main focus:outline-none focus:border-[#FF5D22]"
                  />
                </div>
              </div>

              <div className="p-4 bg-theme-subtle/50 border border-theme-subtle space-y-4">
                <span className="text-[10px] font-mono-code text-[#FF5D22] uppercase tracking-widest block font-bold">
                  Current Club Affiliation (Displayed on Hero & Identity Badges)
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                      Current Team
                    </label>
                    <input
                      type="text"
                      value={formData.currentTeam || ''}
                      onChange={(e) => handleChange('currentTeam', e.target.value)}
                      placeholder="e.g. Tokyo Alvark"
                      className="w-full bg-theme-panel border border-theme-subtle px-3 py-2 text-xs font-sans-body text-theme-main focus:outline-none focus:border-[#FF5D22]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                      Current Country
                    </label>
                    <input
                      type="text"
                      value={formData.currentCountry || ''}
                      onChange={(e) => handleChange('currentCountry', e.target.value)}
                      placeholder="e.g. Japan, Spain, USA"
                      className="w-full bg-theme-panel border border-theme-subtle px-3 py-2 text-xs font-sans-body text-theme-main focus:outline-none focus:border-[#FF5D22]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono-code text-theme-faint uppercase mb-1">
                      Current League / Tier
                    </label>
                    <input
                      type="text"
                      value={formData.currentLeague || ''}
                      onChange={(e) => handleChange('currentLeague', e.target.value)}
                      placeholder="e.g. B.League / EuroLeague"
                      className="w-full bg-theme-panel border border-theme-subtle px-3 py-2 text-xs font-sans-body text-theme-main focus:outline-none focus:border-[#FF5D22]"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono-code text-theme-muted uppercase tracking-wider mb-2">
                  Headline Tagline / Motto *
                </label>
                <input
                  type="text"
                  required
                  value={formData.tagline || ''}
                  onChange={(e) => handleChange('tagline', e.target.value)}
                  placeholder="Evolution is the only constant..."
                  className="w-full bg-theme-subtle border border-theme-subtle px-4 py-2.5 text-sm font-serif-editorial italic text-theme-main focus:outline-none focus:border-[#FF5D22]"
                />
              </div>

              <MediaDropzone
                value={formData.profileImage || ''}
                onChange={(url) => handleChange('profileImage', url)}
                label="Athlete Portrait Photo (About & Bio)"
                sublabel="Drop portrait photo or click to browse (PNG, JPG, WEBP)"
                aspectRatio="portrait"
                placeholder="Drop portrait photo here or click to browse"
              />
            </div>
          )}

          {/* TAB 2: PHYSICAL BLUEPRINT */}
          {activeTab === 'physical' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="p-4 bg-[#FF5D22]/10 border border-[#FF5D22]/30 text-xs font-mono-code text-[#FF5D22]">
                Official scouting physical measurements showcased on the About & Bio page.
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono-code text-theme-muted uppercase tracking-wider mb-2">
                    Height (Imperial & Metric)
                  </label>
                  <input
                    type="text"
                    value={formData.height || ''}
                    onChange={(e) => handleChange('height', e.target.value)}
                    placeholder="5'10&quot; / 178 cm"
                    className="w-full bg-theme-subtle border border-theme-subtle px-4 py-2.5 text-sm font-mono-code text-theme-main focus:outline-none focus:border-[#FF5D22]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-theme-muted uppercase tracking-wider mb-2">
                    Wingspan
                  </label>
                  <input
                    type="text"
                    value={formData.wingspan || ''}
                    onChange={(e) => handleChange('wingspan', e.target.value)}
                    placeholder="6'2&quot; / 188 cm"
                    className="w-full bg-theme-subtle border border-theme-subtle px-4 py-2.5 text-sm font-mono-code text-theme-main focus:outline-none focus:border-[#FF5D22]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono-code text-theme-muted uppercase tracking-wider mb-2">
                    Playing Weight
                  </label>
                  <input
                    type="text"
                    value={formData.weight || ''}
                    onChange={(e) => handleChange('weight', e.target.value)}
                    placeholder="154 lbs / 70 kg"
                    className="w-full bg-theme-subtle border border-theme-subtle px-4 py-2.5 text-sm font-mono-code text-theme-main focus:outline-none focus:border-[#FF5D22]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono-code text-theme-muted uppercase tracking-wider mb-2">
                    Detailed Position Category
                  </label>
                  <input
                    type="text"
                    value={formData.position || ''}
                    onChange={(e) => handleChange('position', e.target.value)}
                    placeholder="Point Guard / Combo Guard / Wing"
                    className="w-full bg-theme-subtle border border-theme-subtle px-4 py-2.5 text-sm font-mono-code text-theme-main focus:outline-none focus:border-[#FF5D22]"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STORY & MANIFESTO */}
          {activeTab === 'narrative' && (
            <div className="space-y-6 animate-fadeIn">
              <div>
                <label className="block text-xs font-mono-code text-theme-muted uppercase tracking-wider mb-2">
                  Career Narrative Summary (About Section)
                </label>
                <textarea
                  rows={5}
                  value={formData.bioSummary || ''}
                  onChange={(e) => handleChange('bioSummary', e.target.value)}
                  placeholder="Describe your athletic background, international experiences, leadership qualities, and trajectory..."
                  className="w-full bg-theme-subtle border border-theme-subtle px-4 py-3 text-sm font-sans-body text-theme-main focus:outline-none focus:border-[#FF5D22] leading-relaxed"
                />
              </div>

              <div>
                <label className="block text-xs font-mono-code text-theme-muted uppercase tracking-wider mb-2">
                  Personal Quote & Athletic Manifesto
                </label>
                <textarea
                  rows={4}
                  value={formData.quote || ''}
                  onChange={(e) => handleChange('quote', e.target.value)}
                  placeholder="Basketball isn’t played on spreadsheets..."
                  className="w-full bg-theme-subtle border border-theme-subtle px-4 py-3 text-sm font-serif-editorial italic text-theme-main focus:outline-none focus:border-[#FF5D22] leading-relaxed"
                />
              </div>
            </div>
          )}

          {/* TAB 4: PHILOSOPHY PILLARS */}
          {activeTab === 'philosophy' && (
            <div className="space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono-code text-[#FF5D22] uppercase tracking-widest font-bold">
                  The Four Tenets of Floor Craft
                </span>
                <span className="text-[10px] text-theme-faint font-mono-code">
                  Guiding principles displayed in the About section
                </span>
              </div>

              {(formData.philosophy || ['', '', '', '']).map((tenet, idx) => (
                <div key={idx} className="flex items-center gap-3">
                  <span className="w-8 text-center text-sm font-black font-display text-[#FF5D22]">
                    0{idx + 1}
                  </span>
                  <input
                    type="text"
                    value={tenet}
                    onChange={(e) => handlePhilosophyChange(idx, e.target.value)}
                    placeholder={`Principle #${idx + 1}`}
                    className="flex-1 bg-theme-subtle border border-theme-subtle px-4 py-2 text-xs font-sans-body text-theme-main focus:outline-none focus:border-[#FF5D22]"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Save / Status Button */}
          <div className="flex items-center justify-between pt-6 border-t border-theme-subtle">
            <div className="text-[11px] font-mono-code text-theme-faint">
              Changes sync instantly across all pages and persist in local storage.
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 bg-theme-subtle text-theme-muted hover:text-theme-main text-xs font-mono-code uppercase tracking-wider transition-colors cursor-pointer border border-theme-subtle"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-[#FF5D22] hover:bg-white text-black font-mono-code text-xs font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-2 shadow-sm"
              >
                {saveSuccess ? (
                  <>
                    <CheckCircle className="w-4 h-4 text-emerald-950" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Profile Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
