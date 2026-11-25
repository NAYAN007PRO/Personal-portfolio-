import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Palette,
  Layout,
  User,
  Code2,
  FolderKanban,
  GraduationCap,
  Mail,
  Inbox,
  DatabaseBackup,
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Upload,
  RotateCcw,
  Download,
  Check,
  Sparkles,
} from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { ACCENT_PRESETS } from '../data/defaultPortfolioData';
import { SKILL_ICON_OPTIONS, SkillIcon } from './SkillIcons';

async function readAndResizeImageFile(file, maxDimension = 900) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const scale = Math.min(1, maxDimension / Math.max(img.width, img.height));
        const width = Math.round(img.width * scale);
        const height = Math.round(img.height * scale);
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.84));
      };
      img.onerror = reject;
      img.src = reader.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function Field({ label, children, hint }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-semibold text-slate-700">{label}</label>
      {children}
      {hint && <p className="text-[11px] text-slate-400">{hint}</p>}
    </div>
  );
}

function Input({ value, onChange, placeholder, type = 'text' }) {
  return (
    <input
      type={type}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/35 focus:border-blue-500"
    />
  );
}

function TextArea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      rows={rows}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-slate-900 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-blue-500/35 focus:border-blue-500"
    />
  );
}

function Toggle({ checked, onChange, label }) {
  return (
    <label className="inline-flex items-center justify-between gap-3 cursor-pointer select-none w-full py-1">
      <span className="text-sm font-medium text-slate-700">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative w-11 h-6 rounded-full transition-colors ${
          checked ? 'bg-blue-600' : 'bg-slate-300'
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </label>
  );
}

export function AdminPanel() {
  const {
    data,
    updateData,
    updateSection,
    resetToDefaults,
    importData,
    markMessageRead,
    deleteMessage,
    isAdminOpen,
    closeAdmin,
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState('general');
  const [confirmReset, setConfirmReset] = useState(false);
  const [statusToast, setStatusToast] = useState('');

  useEffect(() => {
    if (!isAdminOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') closeAdmin();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isAdminOpen, closeAdmin]);

  const notify = (msg) => {
    setStatusToast(msg);
    setTimeout(() => setStatusToast(''), 2400);
  };

  const unreadCount = (data.messages || []).filter((m) => !m.read).length;

  const tabs = [
    { id: 'general', label: 'Theme & Brand', icon: Palette },
    { id: 'hero', label: 'Hero', icon: Layout },
    { id: 'about', label: 'About', icon: User },
    { id: 'skills', label: 'Skills', icon: Code2 },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
    { id: 'education', label: 'Education', icon: GraduationCap },
    { id: 'contact', label: 'Contact & Socials', icon: Mail },
    { id: 'messages', label: 'Messages', icon: Inbox, badge: unreadCount },
    { id: 'backup', label: 'Backup & Reset', icon: DatabaseBackup },
  ];

  const moveItem = (listKey, index, direction) => {
    updateData((prev) => {
      const list = [...(prev[listKey] || [])];
      const target = index + direction;
      if (target < 0 || target >= list.length) return prev;
      [list[index], list[target]] = [list[target], list[index]];
      return { ...prev, [listKey]: list };
    });
  };

  const handleImageUpload = async (e, onResult) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readAndResizeImageFile(file);
      onResult(dataUrl);
      notify('Image updated');
    } catch {
      notify('Failed to read image');
    }
    e.target.value = '';
  };

  const exportBackup = () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio-backup.json';
    a.click();
    URL.revokeObjectURL(url);
    notify('Backup exported');
  };

  const handleImportBackup = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(reader.result);
        importData(parsed);
        notify('Backup imported successfully');
      } catch {
        notify('Invalid JSON backup file');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  return (
    <AnimatePresence>
      {isAdminOpen && (
      <motion.div
        className="fixed inset-0 z-50 bg-slate-950/65 backdrop-blur-sm flex items-center justify-center p-2 sm:p-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 18 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 18 }}
          transition={{ type: 'spring', stiffness: 300, damping: 28 }}
          className="w-full max-w-6xl h-[92vh] bg-slate-50 text-slate-900 rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col"
        >
          {/* Top Bar */}
          <div className="bg-white border-b border-slate-200 px-5 py-3.5 flex items-center justify-between gap-4 shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center font-display font-extrabold">
                {data.branding.logoLetter || 'N'}
              </div>
              <div>
                <h2 className="font-display font-bold text-base sm:text-lg leading-tight">
                  Portfolio Studio
                </h2>
                <p className="text-xs text-slate-500">
                  Changes apply live and save automatically in your browser
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {statusToast && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                  <Check className="w-3.5 h-3.5" />
                  {statusToast}
                </span>
              )}
              <button
                type="button"
                onClick={closeAdmin}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
                <span>Done</span>
              </button>
            </div>
          </div>

          {/* Body */}
          <div className="flex-1 flex flex-col md:flex-row min-h-0">
            {/* Sidebar Tabs */}
            <aside className="md:w-60 bg-white border-b md:border-b-0 md:border-r border-slate-200 p-2.5 flex md:flex-col gap-1 overflow-x-auto shrink-0">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center justify-between gap-2.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap transition-all cursor-pointer ${
                      active
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span className="flex items-center gap-2.5">
                      <Icon className="w-4 h-4 shrink-0" />
                      <span>{tab.label}</span>
                    </span>
                    {tab.badge > 0 && (
                      <span
                        className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${
                          active ? 'bg-white text-blue-600' : 'bg-blue-600 text-white'
                        }`}
                      >
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </aside>

            {/* Editor Pane */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6">
              {/* TAB: GENERAL & THEME */}
              {activeTab === 'general' && (
                <div className="space-y-6 max-w-3xl">
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                    <h3 className="font-display font-bold text-base">Branding & Identity</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Display Name / Logo Text">
                        <Input
                          value={data.branding.logoText}
                          onChange={(val) => updateSection('branding', { logoText: val })}
                        />
                      </Field>
                      <Field label="Monogram Letter">
                        <Input
                          value={data.branding.logoLetter}
                          onChange={(val) => updateSection('branding', { logoLetter: val })}
                        />
                      </Field>
                      <Field label="Browser Tab Title">
                        <Input
                          value={data.branding.pageTitle}
                          onChange={(val) => updateSection('branding', { pageTitle: val })}
                        />
                      </Field>
                      <Field label="Footer Copyright Text">
                        <Input
                          value={data.branding.footerText}
                          onChange={(val) => updateSection('branding', { footerText: val })}
                        />
                      </Field>
                    </div>

                    <Field label="Custom Logo Image (Optional URL or Upload)">
                      <div className="flex flex-wrap gap-2">
                        <div className="flex-1 min-w-[200px]">
                          <Input
                            value={data.branding.customLogoUrl}
                            onChange={(val) => updateSection('branding', { customLogoUrl: val })}
                            placeholder="Leave blank for default N monogram"
                          />
                        </div>
                        <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold cursor-pointer">
                          <Upload className="w-3.5 h-3.5" />
                          <span>Upload</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleImageUpload(e, (url) =>
                                updateSection('branding', { customLogoUrl: url })
                              )
                            }
                          />
                        </label>
                        {data.branding.customLogoUrl && (
                          <button
                            type="button"
                            onClick={() => updateSection('branding', { customLogoUrl: '' })}
                            className="px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer"
                          >
                            Clear
                          </button>
                        )}
                      </div>
                    </Field>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                    <h3 className="font-display font-bold text-base">Theme, Colors & Animations</h3>

                    <div>
                      <p className="text-xs font-semibold text-slate-700 mb-2">Color Presets</p>
                      <div className="flex flex-wrap gap-2">
                        {ACCENT_PRESETS.map((preset) => (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() =>
                              updateSection('theme', {
                                accentPrimary: preset.primary,
                                accentSecondary: preset.secondary,
                                accentSoft: preset.soft,
                              })
                            }
                            className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                              data.theme.accentPrimary === preset.primary
                                ? 'border-slate-900 bg-slate-900 text-white'
                                : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                            }`}
                          >
                            <span
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: preset.primary }}
                            />
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-1">
                      <Field label="Primary Color">
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={data.theme.accentPrimary}
                            onChange={(e) =>
                              updateSection('theme', { accentPrimary: e.target.value })
                            }
                            className="w-10 h-9 rounded-lg border border-slate-200 cursor-pointer"
                          />
                          <Input
                            value={data.theme.accentPrimary}
                            onChange={(val) => updateSection('theme', { accentPrimary: val })}
                          />
                        </div>
                      </Field>
                      <Field label="Secondary Color">
                        <div className="flex items-center gap-2">
                          <input
                            type="color"
                            value={data.theme.accentSecondary}
                            onChange={(e) =>
                              updateSection('theme', { accentSecondary: e.target.value })
                            }
                            className="w-10 h-9 rounded-lg border border-slate-200 cursor-pointer"
                          />
                          <Input
                            value={data.theme.accentSecondary}
                            onChange={(val) => updateSection('theme', { accentSecondary: val })}
                          />
                        </div>
                      </Field>
                      <Field label="Animation Speed">
                        <select
                          value={data.theme.animationSpeed}
                          onChange={(e) =>
                            updateSection('theme', { animationSpeed: e.target.value })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm"
                        >
                          <option value="snappy">Snappy (Fast)</option>
                          <option value="normal">Balanced (Normal)</option>
                          <option value="relaxed">Smooth (Relaxed)</option>
                        </select>
                      </Field>
                    </div>

                    <div className="divide-y divide-slate-100 pt-2">
                      <Toggle
                        label="Dark Mode Theme"
                        checked={data.theme.darkMode}
                        onChange={(val) => updateSection('theme', { darkMode: val })}
                      />
                      <Toggle
                        label="Enable Scroll & Hover Animations"
                        checked={data.theme.animationsEnabled}
                        onChange={(val) => updateSection('theme', { animationsEnabled: val })}
                      />
                      <Toggle
                        label="Show Top Scroll Progress Bar"
                        checked={data.theme.showScrollProgress}
                        onChange={(val) => updateSection('theme', { showScrollProgress: val })}
                      />
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                    <h3 className="font-display font-bold text-base">Sections & Navigation Labels</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {Object.entries(data.sections).map(([key, cfg]) => (
                        <div
                          key={key}
                          className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 space-y-2"
                        >
                          <Toggle
                            label={`Show ${key.charAt(0).toUpperCase() + key.slice(1)}`}
                            checked={cfg.visible !== false}
                            onChange={(val) =>
                              updateData((prev) => ({
                                ...prev,
                                sections: {
                                  ...prev.sections,
                                  [key]: { ...cfg, visible: val },
                                },
                              }))
                            }
                          />
                          <Input
                            value={cfg.navLabel}
                            placeholder="Nav label"
                            onChange={(val) =>
                              updateData((prev) => ({
                                ...prev,
                                sections: {
                                  ...prev.sections,
                                  [key]: { ...cfg, navLabel: val },
                                },
                              }))
                            }
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: HERO */}
              {activeTab === 'hero' && (
                <div className="space-y-5 max-w-3xl bg-white rounded-2xl border border-slate-200 p-5">
                  <h3 className="font-display font-bold text-base">Hero Section</h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Greeting Text">
                      <Input
                        value={data.hero.greeting}
                        onChange={(val) => updateSection('hero', { greeting: val })}
                      />
                    </Field>
                    <Field label="Highlighted Name">
                      <Input
                        value={data.hero.highlightName}
                        onChange={(val) => updateSection('hero', { highlightName: val })}
                      />
                    </Field>
                    <Field label="Role Subtitle">
                      <Input
                        value={data.hero.subtitle}
                        onChange={(val) => updateSection('hero', { subtitle: val })}
                      />
                    </Field>
                    <Field label="Status Badge Text">
                      <Input
                        value={data.hero.badgeText}
                        onChange={(val) => updateSection('hero', { badgeText: val })}
                      />
                    </Field>
                  </div>

                  <Field label="Hero Bio Description">
                    <TextArea
                      rows={3}
                      value={data.hero.description}
                      onChange={(val) => updateSection('hero', { description: val })}
                    />
                  </Field>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Field label="Primary Button">
                      <Input
                        value={data.hero.primaryCtaLabel}
                        onChange={(val) => updateSection('hero', { primaryCtaLabel: val })}
                      />
                    </Field>
                    <Field label="Secondary Button">
                      <Input
                        value={data.hero.secondaryCtaLabel}
                        onChange={(val) => updateSection('hero', { secondaryCtaLabel: val })}
                      />
                    </Field>
                    <Field label="Navbar CTA Button">
                      <Input
                        value={data.hero.navCtaLabel}
                        onChange={(val) => updateSection('hero', { navCtaLabel: val })}
                      />
                    </Field>
                  </div>

                  <Field label="Custom Hero Card Image (Optional)">
                    <div className="flex flex-wrap gap-2">
                      <div className="flex-1 min-w-[200px]">
                        <Input
                          value={data.hero.heroImageUrl}
                          onChange={(val) => updateSection('hero', { heroImageUrl: val })}
                          placeholder="Leave blank for animated tech wave graphic"
                        />
                      </div>
                      <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold cursor-pointer">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Upload</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageUpload(e, (url) =>
                              updateSection('hero', { heroImageUrl: url })
                            )
                          }
                        />
                      </label>
                      {data.hero.heroImageUrl && (
                        <button
                          type="button"
                          onClick={() => updateSection('hero', { heroImageUrl: '' })}
                          className="px-3 py-2 rounded-xl text-xs font-semibold text-red-600 hover:bg-red-50 cursor-pointer"
                        >
                          Use Animated Vector
                        </button>
                      )}
                    </div>
                  </Field>

                  <div className="divide-y divide-slate-100 pt-2">
                    <Toggle
                      label="Show Top Status Badge"
                      checked={data.hero.showBadge}
                      onChange={(val) => updateSection('hero', { showBadge: val })}
                    />
                    <Toggle
                      label="Show Floating Botanical Leaves"
                      checked={data.hero.showFloatingLeaves}
                      onChange={(val) => updateSection('hero', { showFloatingLeaves: val })}
                    />
                  </div>
                </div>
              )}

              {/* TAB: ABOUT */}
              {activeTab === 'about' && (
                <div className="space-y-6 max-w-3xl">
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                    <h3 className="font-display font-bold text-base">About Me Content</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Field label="Section Eyebrow">
                        <Input
                          value={data.about.eyebrow}
                          onChange={(val) => updateSection('about', { eyebrow: val })}
                        />
                      </Field>
                      <Field label="Heading Prefix">
                        <Input
                          value={data.about.headingPrefix}
                          onChange={(val) => updateSection('about', { headingPrefix: val })}
                        />
                      </Field>
                      <Field label="Heading Highlight">
                        <Input
                          value={data.about.headingHighlight}
                          onChange={(val) => updateSection('about', { headingHighlight: val })}
                        />
                      </Field>
                    </div>

                    <Field label="Short Bio (Visible on Page)">
                      <TextArea
                        rows={3}
                        value={data.about.shortBio}
                        onChange={(val) => updateSection('about', { shortBio: val })}
                      />
                    </Field>

                    <Field label="Extended Bio (Shown in Learn More Modal)">
                      <TextArea
                        rows={3}
                        value={data.about.extendedBio}
                        onChange={(val) => updateSection('about', { extendedBio: val })}
                      />
                    </Field>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-end">
                      <Field label="CTA Button Label">
                        <Input
                          value={data.about.ctaLabel}
                          onChange={(val) => updateSection('about', { ctaLabel: val })}
                        />
                      </Field>

                      <Field label="Profile Portrait Image">
                        <div className="flex gap-2">
                          <Input
                            value={data.about.avatarUrl}
                            onChange={(val) => updateSection('about', { avatarUrl: val })}
                          />
                          <label className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold cursor-pointer shrink-0">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Upload</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleImageUpload(e, (url) =>
                                  updateSection('about', { avatarUrl: url })
                                )
                              }
                            />
                          </label>
                        </div>
                      </Field>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-bold text-base">Quick Highlights</h3>
                      <button
                        type="button"
                        onClick={() =>
                          updateSection('about', {
                            highlights: [
                              ...(data.about.highlights || []),
                              { id: `hl-${Date.now()}`, label: 'Label', value: 'Value' },
                            ],
                          })
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Highlight
                      </button>
                    </div>

                    <div className="space-y-2.5">
                      {(data.about.highlights || []).map((hl, idx) => (
                        <div key={hl.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                          <div className="sm:col-span-5">
                            <Input
                              value={hl.label}
                              placeholder="Label"
                              onChange={(val) => {
                                const next = [...data.about.highlights];
                                next[idx] = { ...hl, label: val };
                                updateSection('about', { highlights: next });
                              }}
                            />
                          </div>
                          <div className="sm:col-span-6">
                            <Input
                              value={hl.value}
                              placeholder="Value"
                              onChange={(val) => {
                                const next = [...data.about.highlights];
                                next[idx] = { ...hl, value: val };
                                updateSection('about', { highlights: next });
                              }}
                            />
                          </div>
                          <div className="sm:col-span-1 flex justify-end">
                            <button
                              type="button"
                              onClick={() =>
                                updateSection('about', {
                                  highlights: data.about.highlights.filter((h) => h.id !== hl.id),
                                })
                              }
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: SKILLS */}
              {activeTab === 'skills' && (
                <div className="space-y-6 max-w-4xl">
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="font-display font-bold text-base">Skills Section Settings</h3>
                      <button
                        type="button"
                        onClick={() =>
                          updateData((prev) => ({
                            ...prev,
                            skills: [
                              ...prev.skills,
                              {
                                id: `skill-${Date.now()}`,
                                name: 'New Skill',
                                category: 'Tools',
                                iconKey: 'code',
                                level: 85,
                                color: prev.theme.accentPrimary,
                              },
                            ],
                          }))
                        }
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        Add Skill
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Eyebrow">
                        <Input
                          value={data.skillsSection.eyebrow}
                          onChange={(val) => updateSection('skillsSection', { eyebrow: val })}
                        />
                      </Field>
                      <Field label="Section Title">
                        <Input
                          value={data.skillsSection.title}
                          onChange={(val) => updateSection('skillsSection', { title: val })}
                        />
                      </Field>
                    </div>
                    <Toggle
                      label="Show Category Filter Pills"
                      checked={data.skillsSection.showCategoryFilter}
                      onChange={(val) =>
                        updateSection('skillsSection', { showCategoryFilter: val })
                      }
                    />
                  </div>

                  <div className="space-y-3">
                    {data.skills.map((skill, idx) => (
                      <div
                        key={skill.id}
                        className="bg-white rounded-2xl border border-slate-200 p-4 flex flex-col lg:flex-row lg:items-center gap-4"
                      >
                        <div className="flex items-center gap-3 shrink-0">
                          <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center">
                            <SkillIcon
                              iconKey={skill.iconKey}
                              customIconUrl={skill.customIconUrl}
                              size={30}
                            />
                          </div>
                          <div className="flex flex-col gap-1">
                            <button
                              type="button"
                              onClick={() => moveItem('skills', idx, -1)}
                              className="p-1 rounded hover:bg-slate-100 text-slate-500 cursor-pointer"
                              title="Move up"
                            >
                              <ArrowUp className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveItem('skills', idx, 1)}
                              className="p-1 rounded hover:bg-slate-100 text-slate-500 cursor-pointer"
                              title="Move down"
                            >
                              <ArrowDown className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 flex-1">
                          <Field label="Skill Name">
                            <Input
                              value={skill.name}
                              onChange={(val) => {
                                const next = [...data.skills];
                                next[idx] = { ...skill, name: val };
                                updateData((prev) => ({ ...prev, skills: next }));
                              }}
                            />
                          </Field>
                          <Field label="Category">
                            <Input
                              value={skill.category}
                              onChange={(val) => {
                                const next = [...data.skills];
                                next[idx] = { ...skill, category: val };
                                updateData((prev) => ({ ...prev, skills: next }));
                              }}
                            />
                          </Field>
                          <Field label="Icon">
                            <select
                              value={skill.iconKey}
                              onChange={(e) => {
                                const next = [...data.skills];
                                next[idx] = { ...skill, iconKey: e.target.value };
                                updateData((prev) => ({ ...prev, skills: next }));
                              }}
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm"
                            >
                              {SKILL_ICON_OPTIONS.map((opt) => (
                                <option key={opt.key} value={opt.key}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                          </Field>
                          <Field label={`Level (${skill.level || 85}%)`}>
                            <input
                              type="range"
                              min={10}
                              max={100}
                              value={skill.level || 85}
                              onChange={(e) => {
                                const next = [...data.skills];
                                next[idx] = { ...skill, level: Number(e.target.value) };
                                updateData((prev) => ({ ...prev, skills: next }));
                              }}
                              className="w-full accent-blue-600 mt-2"
                            />
                          </Field>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <label className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl border border-slate-200 text-xs font-semibold hover:bg-slate-50 cursor-pointer">
                            <Upload className="w-3.5 h-3.5" />
                            <span>Icon</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) =>
                                handleImageUpload(e, (url) => {
                                  const next = [...data.skills];
                                  next[idx] = { ...skill, customIconUrl: url };
                                  updateData((prev) => ({ ...prev, skills: next }));
                                })
                              }
                            />
                          </label>
                          <button
                            type="button"
                            onClick={() =>
                              updateData((prev) => ({
                                ...prev,
                                skills: prev.skills.filter((s) => s.id !== skill.id),
                              }))
                            }
                            className="p-2 rounded-xl text-red-500 hover:bg-red-50 cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: PROJECTS */}
              {activeTab === 'projects' && (
                <div className="space-y-6 max-w-4xl">
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="font-display font-bold text-base">Projects Header</h3>
                      <button
                        type="button"
                        onClick={() =>
                          updateData((prev) => ({
                            ...prev,
                            projects: [
                              {
                                id: `proj-${Date.now()}`,
                                title: 'New Project',
                                shortDescription: 'Describe your project concisely here.',
                                fullDescription: 'Full details about architecture and goals.',
                                imageUrl: '/images/project-portfolio.jpg',
                                tags: ['React.js', 'Python'],
                                githubUrl: 'https://github.com/NAYAN007PRO/',
                                liveUrl: '',
                                featured: true,
                              },
                              ...prev.projects,
                            ],
                          }))
                        }
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        Add Project
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Eyebrow">
                        <Input
                          value={data.projectsSection.eyebrow}
                          onChange={(val) => updateSection('projectsSection', { eyebrow: val })}
                        />
                      </Field>
                      <Field label="Title">
                        <Input
                          value={data.projectsSection.title}
                          onChange={(val) => updateSection('projectsSection', { title: val })}
                        />
                      </Field>
                      <Field label="Subtitle">
                        <Input
                          value={data.projectsSection.subtitle}
                          onChange={(val) => updateSection('projectsSection', { subtitle: val })}
                        />
                      </Field>
                      <Field label="View All Button">
                        <Input
                          value={data.projectsSection.viewAllLabel}
                          onChange={(val) => updateSection('projectsSection', { viewAllLabel: val })}
                        />
                      </Field>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {data.projects.map((proj, idx) => (
                      <div
                        key={proj.id}
                        className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4"
                      >
                        <div className="flex flex-wrap items-center justify-between gap-3">
                          <div className="flex items-center gap-3">
                            <img
                              src={proj.imageUrl || '/images/project-portfolio.jpg'}
                              alt=""
                              className="w-16 h-11 rounded-xl object-cover border border-slate-200"
                            />
                            <div>
                              <h4 className="font-display font-bold text-sm">{proj.title}</h4>
                              <span className="text-xs text-slate-400">
                                {(proj.tags || []).join(' • ')}
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => moveItem('projects', idx, -1)}
                              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => moveItem('projects', idx, 1)}
                              className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 cursor-pointer"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                updateData((prev) => ({
                                  ...prev,
                                  projects: prev.projects.filter((p) => p.id !== proj.id),
                                }))
                              }
                              className="p-2 rounded-lg text-red-500 hover:bg-red-50 cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <Field label="Project Title">
                            <Input
                              value={proj.title}
                              onChange={(val) => {
                                const next = [...data.projects];
                                next[idx] = { ...proj, title: val };
                                updateData((prev) => ({ ...prev, projects: next }));
                              }}
                            />
                          </Field>
                          <Field label="Tags (comma-separated)">
                            <Input
                              value={(proj.tags || []).join(', ')}
                              onChange={(val) => {
                                const next = [...data.projects];
                                next[idx] = {
                                  ...proj,
                                  tags: val
                                    .split(',')
                                    .map((t) => t.trim())
                                    .filter(Boolean),
                                };
                                updateData((prev) => ({ ...prev, projects: next }));
                              }}
                            />
                          </Field>
                        </div>

                        <Field label="Short Description">
                          <TextArea
                            rows={2}
                            value={proj.shortDescription}
                            onChange={(val) => {
                              const next = [...data.projects];
                              next[idx] = { ...proj, shortDescription: val };
                              updateData((prev) => ({ ...prev, projects: next }));
                            }}
                          />
                        </Field>

                        <Field label="Full Description (In Project Modal)">
                          <TextArea
                            rows={2}
                            value={proj.fullDescription}
                            onChange={(val) => {
                              const next = [...data.projects];
                              next[idx] = { ...proj, fullDescription: val };
                              updateData((prev) => ({ ...prev, projects: next }));
                            }}
                          />
                        </Field>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-end">
                          <Field label="Thumbnail URL or Upload">
                            <div className="flex gap-2">
                              <Input
                                value={proj.imageUrl}
                                onChange={(val) => {
                                  const next = [...data.projects];
                                  next[idx] = { ...proj, imageUrl: val };
                                  updateData((prev) => ({ ...prev, projects: next }));
                                }}
                              />
                              <label className="inline-flex items-center px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-semibold cursor-pointer shrink-0">
                                <Upload className="w-3.5 h-3.5" />
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) =>
                                    handleImageUpload(e, (url) => {
                                      const next = [...data.projects];
                                      next[idx] = { ...proj, imageUrl: url };
                                      updateData((prev) => ({ ...prev, projects: next }));
                                    })
                                  }
                                />
                              </label>
                            </div>
                          </Field>

                          <Field label="GitHub URL">
                            <Input
                              value={proj.githubUrl}
                              onChange={(val) => {
                                const next = [...data.projects];
                                next[idx] = { ...proj, githubUrl: val };
                                updateData((prev) => ({ ...prev, projects: next }));
                              }}
                            />
                          </Field>

                          <Field label="Live Demo URL">
                            <Input
                              value={proj.liveUrl}
                              placeholder="https://..."
                              onChange={(val) => {
                                const next = [...data.projects];
                                next[idx] = { ...proj, liveUrl: val };
                                updateData((prev) => ({ ...prev, projects: next }));
                              }}
                            />
                          </Field>
                        </div>

                        <Toggle
                          label="Featured in Main 3-Card Row"
                          checked={proj.featured !== false}
                          onChange={(val) => {
                            const next = [...data.projects];
                            next[idx] = { ...proj, featured: val };
                            updateData((prev) => ({ ...prev, projects: next }));
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB: EDUCATION */}
              {activeTab === 'education' && (
                <div className="space-y-6 max-w-3xl">
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-bold text-base">Education Section</h3>
                      <button
                        type="button"
                        onClick={() =>
                          updateData((prev) => ({
                            ...prev,
                            education: [
                              ...prev.education,
                              {
                                id: `edu-${Date.now()}`,
                                degree: 'Degree / Certification',
                                institution: 'Institution Name',
                                duration: '2024 – 2025',
                                score: 'Completed',
                                description: 'Key coursework and achievements.',
                              },
                            ],
                          }))
                        }
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold cursor-pointer"
                      >
                        <Plus className="w-4 h-4" />
                        Add Education
                      </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Field label="Eyebrow">
                        <Input
                          value={data.educationSection.eyebrow}
                          onChange={(val) => updateSection('educationSection', { eyebrow: val })}
                        />
                      </Field>
                      <Field label="Title">
                        <Input
                          value={data.educationSection.title}
                          onChange={(val) => updateSection('educationSection', { title: val })}
                        />
                      </Field>
                      <Field label="Subtitle">
                        <Input
                          value={data.educationSection.subtitle}
                          onChange={(val) => updateSection('educationSection', { subtitle: val })}
                        />
                      </Field>
                    </div>
                  </div>

                  {data.education.map((edu, idx) => (
                    <div
                      key={edu.id}
                      className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="font-display font-bold text-sm">{edu.degree}</h4>
                        <button
                          type="button"
                          onClick={() =>
                            updateData((prev) => ({
                              ...prev,
                              education: prev.education.filter((item) => item.id !== edu.id),
                            }))
                          }
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Degree / Course">
                          <Input
                            value={edu.degree}
                            onChange={(val) => {
                              const next = [...data.education];
                              next[idx] = { ...edu, degree: val };
                              updateData((prev) => ({ ...prev, education: next }));
                            }}
                          />
                        </Field>
                        <Field label="Institution">
                          <Input
                            value={edu.institution}
                            onChange={(val) => {
                              const next = [...data.education];
                              next[idx] = { ...edu, institution: val };
                              updateData((prev) => ({ ...prev, education: next }));
                            }}
                          />
                        </Field>
                        <Field label="Duration">
                          <Input
                            value={edu.duration}
                            onChange={(val) => {
                              const next = [...data.education];
                              next[idx] = { ...edu, duration: val };
                              updateData((prev) => ({ ...prev, education: next }));
                            }}
                          />
                        </Field>
                        <Field label="Score / Status">
                          <Input
                            value={edu.score}
                            onChange={(val) => {
                              const next = [...data.education];
                              next[idx] = { ...edu, score: val };
                              updateData((prev) => ({ ...prev, education: next }));
                            }}
                          />
                        </Field>
                      </div>
                      <Field label="Description">
                        <TextArea
                          rows={2}
                          value={edu.description}
                          onChange={(val) => {
                            const next = [...data.education];
                            next[idx] = { ...edu, description: val };
                            updateData((prev) => ({ ...prev, education: next }));
                          }}
                        />
                      </Field>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB: CONTACT & SOCIALS */}
              {activeTab === 'contact' && (
                <div className="space-y-6 max-w-3xl">
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                    <h3 className="font-display font-bold text-base">Contact Details</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Banner Title">
                        <Input
                          value={data.contact.title}
                          onChange={(val) => updateSection('contact', { title: val })}
                        />
                      </Field>
                      <Field label="CTA Button Label">
                        <Input
                          value={data.contact.ctaLabel}
                          onChange={(val) => updateSection('contact', { ctaLabel: val })}
                        />
                      </Field>
                    </div>
                    <Field label="Banner Subtitle">
                      <Input
                        value={data.contact.subtitle}
                        onChange={(val) => updateSection('contact', { subtitle: val })}
                      />
                    </Field>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <Field label="Email">
                        <Input
                          value={data.contact.email}
                          onChange={(val) => updateSection('contact', { email: val })}
                        />
                      </Field>
                      <Field label="Phone (Optional)">
                        <Input
                          value={data.contact.phone}
                          placeholder="+91 98765 43210"
                          onChange={(val) => updateSection('contact', { phone: val })}
                        />
                      </Field>
                      <Field label="Location">
                        <Input
                          value={data.contact.location}
                          onChange={(val) => updateSection('contact', { location: val })}
                        />
                      </Field>
                      <Field label="Availability Note">
                        <Input
                          value={data.contact.availability}
                          onChange={(val) => updateSection('contact', { availability: val })}
                        />
                      </Field>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="font-display font-bold text-base">Social Profiles</h3>
                      <button
                        type="button"
                        onClick={() =>
                          updateSection('contact', {
                            socials: [
                              ...(data.contact.socials || []),
                              {
                                id: `soc-${Date.now()}`,
                                platform: 'website',
                                label: 'Website',
                                url: 'https://',
                                enabled: true,
                              },
                            ],
                          })
                        }
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        Add Social Link
                      </button>
                    </div>

                    <div className="space-y-3">
                      {(data.contact.socials || []).map((soc, idx) => (
                        <div
                          key={soc.id}
                          className="p-3 rounded-xl border border-slate-200 bg-slate-50/70 grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                        >
                          <div className="sm:col-span-3">
                            <select
                              value={soc.platform}
                              onChange={(e) => {
                                const next = [...data.contact.socials];
                                next[idx] = { ...soc, platform: e.target.value };
                                updateSection('contact', { socials: next });
                              }}
                              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white text-sm"
                            >
                              <option value="github">GitHub</option>
                              <option value="linkedin">LinkedIn</option>
                              <option value="youtube">YouTube</option>
                              <option value="instagram">Instagram</option>
                              <option value="twitter">X / Twitter</option>
                              <option value="email">Email</option>
                              <option value="website">Website</option>
                            </select>
                          </div>
                          <div className="sm:col-span-6">
                            <Input
                              value={soc.url}
                              placeholder="https://..."
                              onChange={(val) => {
                                const next = [...data.contact.socials];
                                next[idx] = { ...soc, url: val };
                                updateSection('contact', { socials: next });
                              }}
                            />
                          </div>
                          <div className="sm:col-span-2 flex items-center justify-end">
                            <Toggle
                              label=""
                              checked={soc.enabled}
                              onChange={(val) => {
                                const next = [...data.contact.socials];
                                next[idx] = { ...soc, enabled: val };
                                updateSection('contact', { socials: next });
                              }}
                            />
                          </div>
                          <div className="sm:col-span-1 flex justify-end">
                            <button
                              type="button"
                              onClick={() =>
                                updateSection('contact', {
                                  socials: data.contact.socials.filter((s) => s.id !== soc.id),
                                })
                              }
                              className="p-2 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB: MESSAGES INBOX */}
              {activeTab === 'messages' && (
                <div className="space-y-4 max-w-3xl">
                  <div className="flex items-center justify-between">
                    <h3 className="font-display font-bold text-base">
                      Contact Form Messages ({(data.messages || []).length})
                    </h3>
                    {(data.messages || []).length > 0 && (
                      <button
                        type="button"
                        onClick={() => updateData((prev) => ({ ...prev, messages: [] }))}
                        className="text-xs font-semibold text-red-600 hover:underline cursor-pointer"
                      >
                        Clear All
                      </button>
                    )}
                  </div>

                  {(!data.messages || data.messages.length === 0) ? (
                    <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center text-slate-500 text-sm">
                      <Sparkles className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                      No messages yet. Messages sent from your portfolio contact form will show up here.
                    </div>
                  ) : (
                    data.messages.map((msg) => (
                      <div
                        key={msg.id}
                        className={`bg-white rounded-2xl border p-5 space-y-2 ${
                          msg.read ? 'border-slate-200' : 'border-blue-400 ring-2 ring-blue-100'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-sm">{msg.name}</h4>
                              {!msg.read && (
                                <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-bold">
                                  New
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-500">
                              {msg.email} • {new Date(msg.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            {!msg.read && (
                              <button
                                type="button"
                                onClick={() => markMessageRead(msg.id)}
                                className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-xs font-semibold cursor-pointer"
                              >
                                Mark Read
                              </button>
                            )}
                            <button
                              type="button"
                              onClick={() => deleteMessage(msg.id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg cursor-pointer"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        {msg.subject && (
                          <p className="text-xs font-semibold text-slate-700">
                            Subject: {msg.subject}
                          </p>
                        )}
                        <p className="text-sm text-slate-600 whitespace-pre-wrap">{msg.message}</p>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* TAB: BACKUP & RESET */}
              {activeTab === 'backup' && (
                <div className="space-y-6 max-w-2xl">
                  <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
                    <h3 className="font-display font-bold text-base">Export & Import Data</h3>
                    <p className="text-sm text-slate-600">
                      Download a JSON backup of all your customized text, skills, projects, theme, and images, or restore from a saved backup.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={exportBackup}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 cursor-pointer"
                      >
                        <Download className="w-4 h-4" />
                        Export JSON Backup
                      </button>

                      <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-sm font-semibold cursor-pointer">
                        <Upload className="w-4 h-4" />
                        Import JSON Backup
                        <input
                          type="file"
                          accept="application/json"
                          className="hidden"
                          onChange={handleImportBackup}
                        />
                      </label>
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl border border-red-200 p-5 space-y-4">
                    <h3 className="font-display font-bold text-base text-red-700">
                      Reset to Default Portfolio
                    </h3>
                    <p className="text-sm text-slate-600">
                      Restore all text, skills, projects, and theme colors back to the original configuration.
                    </p>
                    {!confirmReset ? (
                      <button
                        type="button"
                        onClick={() => setConfirmReset(true)}
                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-red-300 text-red-600 text-sm font-semibold hover:bg-red-50 cursor-pointer"
                      >
                        <RotateCcw className="w-4 h-4" />
                        Reset Everything
                      </button>
                    ) : (
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => {
                            resetToDefaults();
                            setConfirmReset(false);
                            notify('Reset to defaults');
                          }}
                          className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-700 cursor-pointer"
                        >
                          Yes, Reset Now
                        </button>
                        <button
                          type="button"
                          onClick={() => setConfirmReset(false)}
                          className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-sm font-semibold hover:bg-slate-200 cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
      )}
    </AnimatePresence>
  );
}
