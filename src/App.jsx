import React, { useState, useEffect } from 'react';
import { MotionConfig, motion, useScroll, useSpring } from 'framer-motion';
import { PortfolioProvider, usePortfolio } from './context/PortfolioContext';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSkillsSection } from './components/AboutSkillsSection';
import { ProjectsSection } from './components/ProjectsSection';
import { EducationSection } from './components/EducationSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ProjectDetailModal, AboutDetailModal, ContactFormModal } from './components/Modals';
import { AdminPanel } from './components/AdminPanel';

function PortfolioShell() {
  const { data } = usePortfolio();
  const { sections, theme } = data;

  const [activeSection, setActiveSection] = useState('home');
  const [selectedProject, setSelectedProject] = useState(null);
  const [aboutModalOpen, setAboutModalOpen] = useState(false);
  const [contactModalOpen, setContactModalOpen] = useState(false);

  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 26,
    restDelta: 0.001,
  });

  useEffect(() => {
    const sectionIds = ['home', 'about', 'skills', 'projects', 'education', 'contact'];
    const handleScroll = () => {
      const scrollPos = window.scrollY + 140;
      let current = 'home';
      for (const id of sectionIds) {
        const el = document.getElementById(id);
        if (el && el.offsetTop <= scrollPos) {
          current = id;
        }
      }
      setActiveSection(current);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <MotionConfig reducedMotion={theme.animationsEnabled ? 'user' : 'always'}>
      <div
        className={`min-h-screen flex flex-col transition-colors duration-300 ${
          theme.darkMode ? 'bg-slate-950 text-slate-100' : 'bg-white text-slate-900'
        }`}
      >
        {theme.showScrollProgress && (
          <motion.div
            style={{ scaleX, backgroundColor: theme.accentSecondary }}
            className="fixed top-0 left-0 right-0 h-[3px] origin-left z-50"
          />
        )}

        <Navbar activeSection={activeSection} />

        <main className="flex-1">
          {sections.hero?.visible !== false && <HeroSection />}

          <AboutSkillsSection onOpenAboutModal={() => setAboutModalOpen(true)} />

          {sections.projects?.visible !== false && (
            <ProjectsSection onSelectProject={(proj) => setSelectedProject(proj)} />
          )}

          {sections.education?.visible !== false && <EducationSection />}

          {sections.contact?.visible !== false && (
            <ContactSection onOpenContactModal={() => setContactModalOpen(true)} />
          )}
        </main>

        <Footer />

        <ProjectDetailModal
          project={selectedProject}
          onClose={() => setSelectedProject(null)}
        />
        <AboutDetailModal
          isOpen={aboutModalOpen}
          onClose={() => setAboutModalOpen(false)}
        />
        <ContactFormModal
          isOpen={contactModalOpen}
          onClose={() => setContactModalOpen(false)}
        />

        <AdminPanel />
      </div>
    </MotionConfig>
  );
}

export default function App() {
  return (
    <PortfolioProvider>
      <PortfolioShell />
    </PortfolioProvider>
  );
}
