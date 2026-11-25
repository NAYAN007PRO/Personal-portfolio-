import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { SkillIcon } from './SkillIcons';

export function AboutSkillsSection({ onOpenAboutModal }) {
  const { data, speedMultiplier } = usePortfolio();
  const { sections, about, skillsSection, skills, theme } = data;
  const [selectedCategory, setSelectedCategory] = useState('All');

  const showAbout = sections.about?.visible !== false;
  const showSkills = sections.skills?.visible !== false;

  if (!showAbout && !showSkills) return null;

  const categories = ['All', ...Array.from(new Set(skills.map((s) => s.category || 'Other')))];
  const filteredSkills =
    selectedCategory === 'All'
      ? skills
      : skills.filter((s) => (s.category || 'Other') === selectedCategory);

  return (
    <section
      id="about"
      className={`py-14 sm:py-20 border-t ${
        theme.darkMode ? 'border-slate-800/80 bg-slate-950' : 'border-slate-100 bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* About Text + Portrait */}
          {showAbout && (
            <>
              <motion.div
                className={showSkills ? 'lg:col-span-4 space-y-4' : 'lg:col-span-7 space-y-4'}
                initial={theme.animationsEnabled ? { opacity: 0, x: -24 } : false}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.5 * speedMultiplier }}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className="w-5 h-[2.5px] rounded-full"
                    style={{ backgroundColor: theme.accentPrimary }}
                  />
                  <span
                    className="text-sm font-semibold tracking-wide"
                    style={{ color: theme.accentPrimary }}
                  >
                    {about.eyebrow}
                  </span>
                </div>

                <h2
                  className={`font-display font-extrabold text-3xl sm:text-[2.1rem] tracking-tight ${
                    theme.darkMode ? 'text-white' : 'text-slate-950'
                  }`}
                >
                  {about.headingPrefix}
                  <span style={{ color: theme.accentSecondary }}>{about.headingHighlight}</span>
                </h2>

                <p
                  className={`text-[15px] leading-relaxed ${
                    theme.darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  {about.shortBio}
                </p>

                <div className="pt-2">
                  <motion.button
                    type="button"
                    whileHover={theme.animationsEnabled ? { scale: 1.03, x: 2 } : undefined}
                    whileTap={theme.animationsEnabled ? { scale: 0.97 } : undefined}
                    onClick={onOpenAboutModal}
                    className={`inline-flex items-center gap-2.5 px-6 py-2.5 rounded-full text-sm font-semibold border transition-all cursor-pointer group ${
                      theme.darkMode
                        ? 'bg-slate-900 border-slate-700 text-slate-100 hover:border-slate-500'
                        : 'bg-white border-slate-300 text-slate-800 hover:border-slate-400 hover:shadow-sm'
                    }`}
                  >
                    <span>{about.ctaLabel}</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </motion.button>
                </div>
              </motion.div>

              {/* Center Portrait with Soft Blue Geometric Pills */}
              <motion.div
                className={
                  showSkills
                    ? 'lg:col-span-3 flex justify-center'
                    : 'lg:col-span-5 flex justify-center'
                }
                initial={theme.animationsEnabled ? { opacity: 0, scale: 0.9 } : false}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, amount: 0.25 }}
                transition={{ duration: 0.55 * speedMultiplier }}
              >
                <div className="relative w-60 h-68 sm:w-64 sm:h-72 flex items-end justify-center">
                  {/* Soft tilted rounded pills behind portrait */}
                  <div
                    className="absolute bottom-2 left-3 w-36 h-48 rounded-[2.2rem] -rotate-6 opacity-60"
                    style={{
                      backgroundColor: theme.darkMode ? '#1E3A8A' : '#DBEAFE',
                    }}
                  />
                  <div
                    className="absolute top-6 right-3 w-32 h-44 rounded-[2rem] rotate-6 opacity-50"
                    style={{
                      backgroundColor: theme.darkMode ? '#1D4ED8' : '#EFF6FF',
                    }}
                  />
                  <motion.div
                    whileHover={theme.animationsEnabled ? { y: -4, scale: 1.02 } : undefined}
                    transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    className="relative z-10 w-52 h-64 rounded-3xl overflow-hidden shadow-lg border-2 border-white/80"
                  >
                    <img
                      src={about.avatarUrl || '/images/avatar.jpg'}
                      alt={data.branding.logoText}
                      className="w-full h-full object-cover object-top"
                    />
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}

          {/* Skills Grid */}
          {showSkills && (
            <motion.div
              id="skills"
              className={`${showAbout ? 'lg:col-span-5' : 'lg:col-span-12'} scroll-mt-24`}
              initial={theme.animationsEnabled ? { opacity: 0, y: 24 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5 * speedMultiplier }}
            >
              <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
                <div>
                  <div className="flex items-center gap-2.5 mb-1">
                    <span
                      className="w-5 h-[2.5px] rounded-full"
                      style={{ backgroundColor: theme.accentPrimary }}
                    />
                    <span
                      className="text-sm font-semibold tracking-wide"
                      style={{ color: theme.accentPrimary }}
                    >
                      {skillsSection.eyebrow}
                    </span>
                  </div>
                  <h2
                    className={`font-display font-extrabold text-2xl sm:text-[1.75rem] tracking-tight ${
                      theme.darkMode ? 'text-white' : 'text-slate-950'
                    }`}
                  >
                    {skillsSection.title}
                  </h2>
                </div>
              </div>

              {skillsSection.showCategoryFilter && categories.length > 2 && (
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {categories.map((cat) => {
                    const active = selectedCategory === cat;
                    return (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSelectedCategory(cat)}
                        className={`px-3 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
                          active
                            ? 'text-white shadow-xs'
                            : theme.darkMode
                              ? 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
                              : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                        style={active ? { backgroundColor: theme.accentPrimary } : undefined}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              )}

              <motion.div
                layout
                className={`grid gap-3 ${
                  showAbout
                    ? 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4'
                    : 'grid-cols-2 sm:grid-cols-4 md:grid-cols-6'
                }`}
              >
                {filteredSkills.map((skill, idx) => (
                  <motion.div
                    key={skill.id}
                    layout
                    initial={theme.animationsEnabled ? { opacity: 0, y: 16, scale: 0.95 } : false}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, amount: 0.1 }}
                    transition={{
                      duration: 0.35 * speedMultiplier,
                      delay: Math.min(idx * 0.04, 0.35),
                    }}
                    whileHover={
                      theme.animationsEnabled
                        ? { y: -5, scale: 1.03 }
                        : undefined
                    }
                    className={`group relative flex flex-col items-center justify-center py-4 px-2.5 rounded-2xl border transition-all duration-300 ${
                      theme.darkMode
                        ? 'bg-slate-900/90 border-slate-800 hover:border-blue-500/60 shadow-lg shadow-slate-950/30'
                        : 'bg-white border-slate-200/90 hover:border-blue-300 shadow-[0_4px_18px_-6px_rgba(15,23,42,0.08)] hover:shadow-[0_12px_26px_-8px_rgba(11,82,196,0.18)]'
                    }`}
                  >
                    <div className="mb-2 transition-transform duration-300 group-hover:scale-110">
                      <SkillIcon
                        iconKey={skill.iconKey}
                        customIconUrl={skill.customIconUrl}
                        size={38}
                      />
                    </div>
                    <span
                      className={`text-xs sm:text-[13px] font-semibold text-center leading-tight ${
                        theme.darkMode ? 'text-slate-200' : 'text-slate-800'
                      }`}
                    >
                      {skill.name}
                    </span>

                    {/* Subtle animated proficiency indicator on hover */}
                    <div
                      className={`w-full max-w-[70%] h-1 rounded-full mt-2 overflow-hidden opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
                        theme.darkMode ? 'bg-slate-800' : 'bg-slate-100'
                      }`}
                    >
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${skill.level || 85}%`,
                          backgroundColor: skill.color || theme.accentPrimary,
                        }}
                      />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
