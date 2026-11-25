import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight, Menu, X } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { BrandLogo } from './BrandLogo';

export function Navbar({ activeSection }) {
  const { data } = usePortfolio();
  const { sections, hero, theme } = data;
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navItems = [
    { id: 'home', label: sections.hero?.navLabel || 'Home', visible: sections.hero?.visible !== false },
    { id: 'about', label: sections.about?.navLabel || 'About', visible: sections.about?.visible !== false },
    { id: 'skills', label: sections.skills?.navLabel || 'Skills', visible: sections.skills?.visible !== false },
    { id: 'projects', label: sections.projects?.navLabel || 'Projects', visible: sections.projects?.visible !== false },
    { id: 'education', label: sections.education?.navLabel || 'Education', visible: sections.education?.visible !== false },
    { id: 'contact', label: sections.contact?.navLabel || 'Contact', visible: sections.contact?.visible !== false },
  ].filter((item) => item.visible);

  const handleNavClick = (id) => {
    setMobileOpen(false);
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <motion.header
      initial={theme.animationsEnabled ? { y: -20, opacity: 0 } : false}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.45 }}
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? theme.darkMode
            ? 'bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 shadow-lg shadow-slate-950/20'
            : 'bg-white/85 backdrop-blur-xl border-b border-slate-200/70 shadow-sm'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
        <BrandLogo
          onSingleClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        />

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-7">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`relative py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                  isActive
                    ? theme.darkMode
                      ? 'text-white font-semibold'
                      : 'text-slate-950 font-semibold'
                    : theme.darkMode
                      ? 'text-slate-400 hover:text-slate-100'
                      : 'text-slate-600 hover:text-slate-950'
                }`}
              >
                {item.label}
                {isActive && (
                  <motion.span
                    layoutId="nav-active-underline"
                    transition={{ type: 'spring', stiffness: 420, damping: 32 }}
                    className="absolute left-0 right-0 -bottom-0.5 h-[2.5px] rounded-full"
                    style={{ backgroundColor: theme.accentPrimary }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <motion.button
            type="button"
            whileHover={theme.animationsEnabled ? { scale: 1.04 } : undefined}
            whileTap={theme.animationsEnabled ? { scale: 0.97 } : undefined}
            onClick={() => handleNavClick('contact')}
            className="hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold text-white shadow-md transition-all cursor-pointer btn-shimmer"
            style={{
              backgroundColor: theme.accentPrimary,
              boxShadow: `0 8px 20px -6px ${theme.accentPrimary}66`,
            }}
          >
            <span>{hero.navCtaLabel || "Let's Talk"}</span>
            <ArrowRight className="w-4 h-4" />
          </motion.button>

          <button
            type="button"
            onClick={() => setMobileOpen((prev) => !prev)}
            className={`md:hidden p-2 rounded-xl border transition-colors ${
              theme.darkMode
                ? 'border-slate-800 text-slate-200 hover:bg-slate-800'
                : 'border-slate-200 text-slate-700 hover:bg-slate-100'
            }`}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className={`md:hidden overflow-hidden border-b ${
              theme.darkMode
                ? 'bg-slate-950/95 border-slate-800 backdrop-blur-xl'
                : 'bg-white/95 border-slate-200 backdrop-blur-xl'
            }`}
          >
            <div className="px-4 py-4 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                    activeSection === item.id
                      ? 'text-white'
                      : theme.darkMode
                        ? 'text-slate-300 hover:bg-slate-900'
                        : 'text-slate-700 hover:bg-slate-100'
                  }`}
                  style={
                    activeSection === item.id
                      ? { backgroundColor: theme.accentPrimary }
                      : undefined
                  }
                >
                  {item.label}
                </button>
              ))}
              <button
                type="button"
                onClick={() => handleNavClick('contact')}
                className="w-full mt-2 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
                style={{ backgroundColor: theme.accentPrimary }}
              >
                <span>{hero.navCtaLabel || "Let's Talk"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
