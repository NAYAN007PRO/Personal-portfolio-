import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail, Phone, MapPin, Send, Sparkles } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { SocialIconSvg, normalizeUrl } from './SocialIcons';

export function ContactSection({ onOpenContactModal }) {
  const { data, speedMultiplier } = usePortfolio();
  const { contact, theme } = data;

  const enabledSocials = (contact.socials || []).filter(
    (s) => s.enabled && s.url && s.url.trim() !== ''
  );

  return (
    <section id="contact" className="py-10 sm:py-14 scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={theme.animationsEnabled ? { opacity: 0, y: 28 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.55 * speedMultiplier }}
          className={`relative overflow-hidden rounded-[2rem] p-7 sm:p-10 lg:p-12 border ${
            theme.darkMode
              ? 'bg-gradient-to-br from-slate-900 via-slate-900 to-blue-950/90 border-slate-800'
              : 'bg-gradient-to-br from-[#F2F6FF] via-[#E8F0FE] to-[#DCE8FD] border-blue-100/80'
          }`}
        >
          {/* Decorative sweeping curve matching screenshot */}
          <div
            className="pointer-events-none absolute -bottom-24 -right-12 w-72 h-72 rounded-full opacity-90"
            style={{
              background: `linear-gradient(135deg, ${theme.accentSecondary}, ${theme.accentPrimary})`,
            }}
          />
          <div
            className="pointer-events-none absolute -bottom-14 right-24 w-48 h-48 rounded-full opacity-25"
            style={{ backgroundColor: theme.accentSecondary }}
          />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left CTA Column */}
            <div className="lg:col-span-6 space-y-4">
              <div className="flex items-start gap-4">
                <motion.div
                  animate={
                    theme.animationsEnabled
                      ? { y: [0, -4, 0], rotate: [0, 3, 0] }
                      : undefined
                  }
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm"
                  style={{
                    backgroundColor: theme.darkMode ? 'rgba(29,109,242,0.2)' : '#FFFFFF',
                    color: theme.accentSecondary,
                  }}
                >
                  <Send className="w-6 h-6" />
                </motion.div>

                <div>
                  <h2
                    className={`font-display font-extrabold text-2xl sm:text-3xl tracking-tight ${
                      theme.darkMode ? 'text-white' : 'text-slate-950'
                    }`}
                  >
                    {contact.title}
                  </h2>
                  <p
                    className={`mt-1.5 text-sm sm:text-base ${
                      theme.darkMode ? 'text-slate-300' : 'text-slate-600'
                    }`}
                  >
                    {contact.subtitle}
                  </p>
                </div>
              </div>

              <div className="pt-1 sm:pl-16">
                <motion.button
                  type="button"
                  whileHover={theme.animationsEnabled ? { scale: 1.04, y: -2 } : undefined}
                  whileTap={theme.animationsEnabled ? { scale: 0.97 } : undefined}
                  onClick={onOpenContactModal}
                  className="inline-flex items-center gap-2.5 px-6 py-3 rounded-full text-sm font-semibold text-white shadow-lg transition-all cursor-pointer btn-shimmer group"
                  style={{
                    backgroundColor: theme.accentPrimary,
                    boxShadow: `0 10px 24px -6px ${theme.accentPrimary}80`,
                  }}
                >
                  <span>{contact.ctaLabel}</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </motion.button>
              </div>
            </div>

            {/* Vertical Divider on Desktop */}
            <div className="hidden lg:flex lg:col-span-1 justify-center">
              <div
                className={`w-px h-28 ${
                  theme.darkMode ? 'bg-slate-700/80' : 'bg-blue-200/90'
                }`}
              />
            </div>

            {/* Right Contact Info & Socials */}
            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-row items-start sm:items-center justify-between gap-6">
              <div className="space-y-3 text-sm">
                {contact.email && (
                  <a
                    href={`mailto:${contact.email}`}
                    className={`flex items-center gap-3 font-medium transition-colors ${
                      theme.darkMode
                        ? 'text-slate-200 hover:text-blue-400'
                        : 'text-slate-800 hover:text-blue-700'
                    }`}
                  >
                    <Mail className="w-4 h-4 shrink-0" style={{ color: theme.accentPrimary }} />
                    <span>{contact.email}</span>
                  </a>
                )}

                {contact.phone && (
                  <a
                    href={`tel:${contact.phone.replace(/\s+/g, '')}`}
                    className={`flex items-center gap-3 font-medium transition-colors ${
                      theme.darkMode
                        ? 'text-slate-200 hover:text-blue-400'
                        : 'text-slate-800 hover:text-blue-700'
                    }`}
                  >
                    <Phone className="w-4 h-4 shrink-0" style={{ color: theme.accentPrimary }} />
                    <span>{contact.phone}</span>
                  </a>
                )}

                {contact.location && (
                  <div
                    className={`flex items-center gap-3 font-medium ${
                      theme.darkMode ? 'text-slate-200' : 'text-slate-800'
                    }`}
                  >
                    <MapPin className="w-4 h-4 shrink-0" style={{ color: theme.accentPrimary }} />
                    <span>{contact.location}</span>
                  </div>
                )}

                {contact.availability && (
                  <div
                    className={`flex items-center gap-3 font-medium ${
                      theme.darkMode ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 shrink-0" style={{ color: theme.accentPrimary }} />
                    <span>{contact.availability}</span>
                  </div>
                )}
              </div>

              {/* Circular Social Pills */}
              {enabledSocials.length > 0 && (
                <div className="flex flex-wrap items-center gap-2.5">
                  {enabledSocials.map((social) => (
                    <motion.a
                      key={social.id}
                      href={normalizeUrl(social.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={social.label}
                      whileHover={theme.animationsEnabled ? { y: -3, scale: 1.1 } : undefined}
                      whileTap={theme.animationsEnabled ? { scale: 0.94 } : undefined}
                      className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm transition-colors ${
                        theme.darkMode
                          ? 'bg-slate-800 text-white hover:bg-blue-600'
                          : 'bg-white text-slate-900 hover:text-blue-700'
                      }`}
                    >
                      <SocialIconSvg platform={social.platform} className="w-4.5 h-4.5" />
                    </motion.a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
