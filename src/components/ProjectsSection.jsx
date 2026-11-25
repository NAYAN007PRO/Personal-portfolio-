import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';

export function ProjectsSection({ onSelectProject }) {
  const { data, speedMultiplier } = usePortfolio();
  const { projectsSection, projects, theme } = data;
  const [showAll, setShowAll] = useState(false);

  const featuredProjects = projects.filter((p) => p.featured !== false);
  const displayedProjects =
    showAll || featuredProjects.length === 0 ? projects : featuredProjects.slice(0, 3);

  return (
    <section
      id="projects"
      className={`py-14 sm:py-20 scroll-mt-20 border-t ${
        theme.darkMode ? 'border-slate-800/80 bg-slate-950' : 'border-slate-100 bg-white'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Row */}
        <motion.div
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-9"
          initial={theme.animationsEnabled ? { opacity: 0, y: 20 } : false}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45 * speedMultiplier }}
        >
          <div>
            <div className="flex items-center gap-2.5 mb-1.5">
              <span
                className="w-5 h-[2.5px] rounded-full"
                style={{ backgroundColor: theme.accentPrimary }}
              />
              <span
                className="text-sm font-semibold tracking-wide"
                style={{ color: theme.accentPrimary }}
              >
                {projectsSection.eyebrow}
              </span>
            </div>
            <h2
              className={`font-display font-extrabold text-3xl sm:text-[2.1rem] tracking-tight ${
                theme.darkMode ? 'text-white' : 'text-slate-950'
              }`}
            >
              {projectsSection.title}
            </h2>
            <p
              className={`mt-1 text-sm sm:text-base ${
                theme.darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              {projectsSection.subtitle}
            </p>
          </div>

          {projects.length > 3 && (
            <motion.button
              type="button"
              whileHover={theme.animationsEnabled ? { scale: 1.03 } : undefined}
              whileTap={theme.animationsEnabled ? { scale: 0.97 } : undefined}
              onClick={() => setShowAll((prev) => !prev)}
              className={`self-start sm:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold border transition-all cursor-pointer group ${
                theme.darkMode
                  ? 'bg-slate-900 border-slate-700 text-slate-200 hover:border-slate-500'
                  : 'bg-white border-slate-300 text-slate-800 hover:border-slate-400 hover:shadow-xs'
              }`}
            >
              <span>{showAll ? 'Show Featured' : projectsSection.viewAllLabel}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </motion.button>
          )}
        </motion.div>

        {/* Project Cards Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {displayedProjects.map((project, idx) => (
            <motion.article
              key={project.id}
              layout
              initial={theme.animationsEnabled ? { opacity: 0, y: 24 } : false}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{
                duration: 0.45 * speedMultiplier,
                delay: idx * 0.08,
              }}
              whileHover={theme.animationsEnabled ? { y: -6 } : undefined}
              onClick={() => onSelectProject(project)}
              className={`group cursor-pointer rounded-3xl border p-4 flex flex-col justify-between transition-all duration-300 ${
                theme.darkMode
                  ? 'bg-slate-900/90 border-slate-800 hover:border-blue-500/50 shadow-xl shadow-slate-950/40'
                  : 'bg-white border-slate-200/90 hover:border-blue-300 shadow-[0_8px_28px_-10px_rgba(15,23,42,0.09)] hover:shadow-[0_18px_36px_-12px_rgba(11,82,196,0.18)]'
              }`}
            >
              <div>
                <div className="relative h-44 w-full rounded-2xl overflow-hidden bg-slate-100 mb-4">
                  <img
                    src={project.imageUrl || '/images/project-portfolio.jpg'}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>

                <h3
                  className={`font-display font-bold text-lg sm:text-[1.15rem] mb-1.5 transition-colors ${
                    theme.darkMode
                      ? 'text-white group-hover:text-blue-400'
                      : 'text-slate-950 group-hover:text-blue-700'
                  }`}
                >
                  {project.title}
                </h3>

                <p
                  className={`text-sm leading-relaxed line-clamp-2 mb-4 ${
                    theme.darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  {project.shortDescription}
                </p>
              </div>

              <div className="flex items-center justify-between gap-2 pt-2">
                <div className="flex flex-wrap gap-1.5">
                  {(project.tags || []).slice(0, 4).map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className={`px-2.5 py-1 rounded-full text-xs font-medium border ${
                        theme.darkMode
                          ? 'bg-slate-800/80 border-slate-700 text-slate-300'
                          : 'bg-slate-100/90 border-slate-200/80 text-slate-700'
                      }`}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <span
                  className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center text-white shadow-sm transition-transform duration-300 group-hover:scale-110 group-hover:translate-x-0.5"
                  style={{ backgroundColor: theme.accentPrimary }}
                >
                  <ArrowRight className="w-4 h-4" />
                </span>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
