import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { BrandLogo } from './BrandLogo';

export function Footer() {
  const { data } = usePortfolio();
  const { branding, sections, theme } = data;

  const navItems = [
    { id: 'home', label: sections.hero?.navLabel || 'Home', visible: sections.hero?.visible !== false },
    { id: 'about', label: sections.about?.navLabel || 'About', visible: sections.about?.visible !== false },
    { id: 'skills', label: sections.skills?.navLabel || 'Skills', visible: sections.skills?.visible !== false },
    { id: 'projects', label: sections.projects?.navLabel || 'Projects', visible: sections.projects?.visible !== false },
    { id: 'education', label: sections.education?.navLabel || 'Education', visible: sections.education?.visible !== false },
    { id: 'contact', label: sections.contact?.navLabel || 'Contact', visible: sections.contact?.visible !== false },
  ].filter((item) => item.visible);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <footer
      className={`border-t py-6 ${
        theme.darkMode
          ? 'border-slate-800 bg-slate-950 text-slate-400'
          : 'border-slate-200/80 bg-white text-slate-600'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-5">
          <BrandLogo
            size="sm"
            onSingleClick={(e) => {
              e.preventDefault();
              scrollToTop();
            }}
          />
          <span className="text-xs sm:text-sm">{branding.footerText}</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => scrollToSection(item.id)}
              className={`text-xs sm:text-sm font-medium transition-colors cursor-pointer ${
                theme.darkMode ? 'hover:text-white' : 'hover:text-slate-950'
              }`}
            >
              {item.label}
            </button>
          ))}

          <motion.button
            type="button"
            whileHover={theme.animationsEnabled ? { y: -3, scale: 1.08 } : undefined}
            whileTap={theme.animationsEnabled ? { scale: 0.94 } : undefined}
            onClick={scrollToTop}
            aria-label="Scroll to top"
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
              theme.darkMode
                ? 'border-slate-700 text-slate-300 hover:bg-slate-800'
                : 'border-slate-300 text-slate-700 hover:bg-slate-100'
            }`}
          >
            <ArrowUp className="w-4 h-4" />
          </motion.button>
        </div>
      </div>
    </footer>
  );
}
