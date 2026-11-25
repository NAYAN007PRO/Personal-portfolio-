import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Send, CheckCircle2, Sparkles } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { SocialIconSvg, normalizeUrl } from './SocialIcons';

function ModalBackdrop({ isOpen, onClose, children, maxWidth = 'max-w-2xl' }) {
  const { data } = usePortfolio();
  const { theme } = data;

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 12 }}
            transition={{ type: 'spring', stiffness: 320, damping: 26 }}
            onClick={(e) => e.stopPropagation()}
            className={`relative w-full ${maxWidth} max-h-[90vh] overflow-y-auto rounded-3xl border shadow-2xl ${
              theme.darkMode
                ? 'bg-slate-900 border-slate-800 text-slate-100'
                : 'bg-white border-slate-200 text-slate-900'
            }`}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function ProjectDetailModal({ project, onClose }) {
  const { data } = usePortfolio();
  const { theme } = data;

  return (
    <ModalBackdrop isOpen={Boolean(project)} onClose={onClose} maxWidth="max-w-2xl">
      {project && (
        <div>
          <div className="relative h-56 sm:h-64 w-full overflow-hidden rounded-t-3xl">
            <img
              src={project.imageUrl || '/images/project-portfolio.jpg'}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <button
              type="button"
              onClick={onClose}
              aria-label="Close modal"
              className="absolute top-4 right-4 w-9 h-9 rounded-full bg-slate-950/60 text-white hover:bg-slate-950/80 flex items-center justify-center backdrop-blur-md transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-5">
            <div>
              <h3 className="font-display font-extrabold text-2xl mb-2">
                {project.title}
              </h3>
              <p
                className={`text-sm sm:text-base leading-relaxed ${
                  theme.darkMode ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {project.fullDescription || project.shortDescription}
              </p>
            </div>

            {project.tags && project.tags.length > 0 && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Technologies Used
                </p>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1 rounded-full text-xs font-semibold border ${
                        theme.darkMode
                          ? 'bg-slate-800 border-slate-700 text-slate-200'
                          : 'bg-blue-50/70 border-blue-100 text-blue-800'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              {project.githubUrl && (
                <a
                  href={normalizeUrl(project.githubUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white transition-transform hover:scale-[1.02]"
                  style={{ backgroundColor: theme.accentPrimary }}
                >
                  <SocialIconSvg platform="github" className="w-4 h-4" />
                  <span>View Source on GitHub</span>
                </a>
              )}
              {project.liveUrl && (
                <a
                  href={normalizeUrl(project.liveUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-colors ${
                    theme.darkMode
                      ? 'border-slate-700 text-slate-200 hover:bg-slate-800'
                      : 'border-slate-300 text-slate-800 hover:bg-slate-100'
                  }`}
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Live Demo</span>
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </ModalBackdrop>
  );
}

export function AboutDetailModal({ isOpen, onClose }) {
  const { data } = usePortfolio();
  const { about, theme } = data;

  return (
    <ModalBackdrop isOpen={isOpen} onClose={onClose} maxWidth="max-w-xl">
      <div className="p-6 sm:p-8 space-y-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <img
              src={about.avatarUrl || '/images/avatar.jpg'}
              alt={data.branding.logoText}
              className="w-16 h-16 rounded-2xl object-cover object-top border border-blue-200"
            />
            <div>
              <span
                className="text-xs font-bold uppercase tracking-wider"
                style={{ color: theme.accentPrimary }}
              >
                {about.eyebrow}
              </span>
              <h3 className="font-display font-extrabold text-2xl">
                {about.headingPrefix}
                <span style={{ color: theme.accentSecondary }}>{about.headingHighlight}</span>
              </h3>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              theme.darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-3 text-sm sm:text-[15px] leading-relaxed">
          <p className={theme.darkMode ? 'text-slate-300' : 'text-slate-700'}>{about.shortBio}</p>
          {about.extendedBio && (
            <p className={theme.darkMode ? 'text-slate-400' : 'text-slate-600'}>
              {about.extendedBio}
            </p>
          )}
        </div>

        {about.highlights && about.highlights.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {about.highlights.map((hl) => (
              <div
                key={hl.id}
                className={`p-3.5 rounded-2xl border ${
                  theme.darkMode
                    ? 'bg-slate-800/60 border-slate-700'
                    : 'bg-slate-50 border-slate-200/80'
                }`}
              >
                <div className="text-xs font-medium text-slate-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" style={{ color: theme.accentSecondary }} />
                  {hl.label}
                </div>
                <div className="font-semibold text-sm mt-1">{hl.value}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </ModalBackdrop>
  );
}

export function ContactFormModal({ isOpen, onClose }) {
  const { data, addMessage } = usePortfolio();
  const { theme, contact } = data;
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) return;
    addMessage(form);
    setSubmitted(true);
    setForm({ name: '', email: '', subject: '', message: '' });
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 1800);
  };

  return (
    <ModalBackdrop isOpen={isOpen} onClose={onClose} maxWidth="max-w-lg">
      <div className="p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h3 className="font-display font-extrabold text-2xl">{contact.title}</h3>
            <p className={`text-sm mt-1 ${theme.darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              {contact.subtitle}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className={`p-2 rounded-full transition-colors cursor-pointer ${
              theme.darkMode ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-500'
            }`}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {submitted ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-10 text-center space-y-3"
          >
            <CheckCircle2 className="w-14 h-14 mx-auto text-emerald-500" />
            <h4 className="font-display font-bold text-xl">Message Sent!</h4>
            <p className={`text-sm ${theme.darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
              Thanks for reaching out. I will get back to you soon!
            </p>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5">Your Name</label>
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Nayan Patel"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
                    theme.darkMode
                      ? 'bg-slate-800 border-slate-700 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5">Email Address</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="you@example.com"
                  className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
                    theme.darkMode
                      ? 'bg-slate-800 border-slate-700 text-white'
                      : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5">Subject</label>
              <input
                type="text"
                value={form.subject}
                onChange={(e) => setForm({ ...form, subject: e.target.value })}
                placeholder="Project Collaboration / Internship"
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
                  theme.darkMode
                    ? 'bg-slate-800 border-slate-700 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1.5">Message</label>
              <textarea
                rows={4}
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Write your message here..."
                className={`w-full px-3.5 py-2.5 rounded-xl border text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500/40 ${
                  theme.darkMode
                    ? 'bg-slate-800 border-slate-700 text-white'
                    : 'bg-slate-50 border-slate-200 text-slate-900'
                }`}
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white shadow-md hover:opacity-95 transition-opacity cursor-pointer"
              style={{ backgroundColor: theme.accentPrimary }}
            >
              <Send className="w-4 h-4" />
              <span>Send Message</span>
            </button>
          </form>
        )}
      </div>
    </ModalBackdrop>
  );
}
