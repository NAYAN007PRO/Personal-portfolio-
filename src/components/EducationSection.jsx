import React from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Calendar } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export function EducationSection() {
  const { data, speedMultiplier } = usePortfolio();
  const { educationSection, education, theme } = data;

  if (!education || education.length === 0) return null;

  return (
    <section
      id="education"
      className={`py-14 sm:py-18 scroll-mt-20 border-t ${
        theme.darkMode ? 'border-slate-800/80 bg-slate-950' : 'border-slate-100 bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="mb-8"
          initial={theme.animationsEnabled ? { opacity: 0, y: 20 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 * speedMultiplier }}
        >
          <div className="flex items-center gap-2.5 mb-1.5">
            <span
              className="w-5 h-[2.5px] rounded-full"
              style={{ backgroundColor: theme.accentPrimary }}
            />
            <span
              className="text-sm font-semibold tracking-wide"
              style={{ color: theme.accentPrimary }}
            >
              {educationSection.eyebrow}
            </span>
          </div>
          <h2
            className={`font-display font-extrabold text-3xl sm:text-[2rem] tracking-tight ${
              theme.darkMode ? 'text-white' : 'text-slate-950'
            }`}
          >
            {educationSection.title}
          </h2>
          <p
            className={`mt-1 text-sm sm:text-base ${
              theme.darkMode ? 'text-slate-400' : 'text-slate-600'
            }`}
          >
            {educationSection.subtitle}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {education.map((edu, idx) => (
            <motion.div
              key={edu.id}
              initial={theme.animationsEnabled ? { opacity: 0, y: 20 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.45 * speedMultiplier, delay: idx * 0.1 }}
              whileHover={theme.animationsEnabled ? { y: -4 } : undefined}
              className={`rounded-3xl border p-6 transition-all ${
                theme.darkMode
                  ? 'bg-slate-900/80 border-slate-800 hover:border-blue-500/40'
                  : 'bg-slate-50/70 border-slate-200/80 hover:bg-white hover:shadow-lg hover:shadow-blue-900/5'
              }`}
            >
              <div className="flex items-start justify-between gap-4 mb-3">
                <div
                  className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: theme.darkMode ? 'rgba(29,109,242,0.18)' : theme.accentSoft,
                    color: theme.accentPrimary,
                  }}
                >
                  <GraduationCap className="w-5 h-5" />
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                      theme.darkMode
                        ? 'bg-slate-800 text-slate-300'
                        : 'bg-white border border-slate-200 text-slate-600'
                    }`}
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    {edu.duration}
                  </span>
                  {edu.score && (
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                      style={{ backgroundColor: theme.accentPrimary }}
                    >
                      {edu.score}
                    </span>
                  )}
                </div>
              </div>

              <h3
                className={`font-display font-bold text-lg mb-1 ${
                  theme.darkMode ? 'text-white' : 'text-slate-950'
                }`}
              >
                {edu.degree}
              </h3>
              <p
                className="text-sm font-semibold mb-2.5"
                style={{ color: theme.accentSecondary }}
              >
                {edu.institution}
              </p>
              <p
                className={`text-sm leading-relaxed ${
                  theme.darkMode ? 'text-slate-400' : 'text-slate-600'
                }`}
              >
                {edu.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
