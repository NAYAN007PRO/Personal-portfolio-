import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Mail } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { SocialIconSvg, normalizeUrl } from './SocialIcons';

export function HeroSection() {
  const { data, speedMultiplier } = usePortfolio();
  const { hero, contact, theme } = data;
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const enabledSocials = (contact.socials || []).filter(
    (s) => s.enabled && s.url && s.url.trim() !== ''
  );

  const handleMouseMove = (e) => {
    if (!theme.animationsEnabled) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: ny * -10, y: nx * 12 });
  };

  const handleMouseLeave = () => setTilt({ x: 0, y: 0 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.09 * speedMultiplier,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 22 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 * speedMultiplier, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <section
      id="home"
      className="relative overflow-hidden hero-ambient-bg pt-8 pb-14 sm:pt-12 sm:pb-20"
    >
      {/* Decorative soft gradient wave backdrop */}
      <div
        className="pointer-events-none absolute -top-24 -right-24 w-[540px] h-[540px] rounded-full opacity-40 blur-3xl"
        style={{ background: `radial-gradient(circle, ${theme.accentSecondary}33, transparent 70%)` }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Hero Content */}
          <motion.div
            className="lg:col-span-6 space-y-5 z-10"
            variants={theme.animationsEnabled ? containerVariants : undefined}
            initial={theme.animationsEnabled ? 'hidden' : false}
            animate="visible"
          >
            {hero.showBadge && (
              <motion.div variants={itemVariants}>
                <span
                  className={`inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium border shadow-xs ${
                    theme.darkMode
                      ? 'bg-slate-900/80 border-slate-700/80 text-slate-200'
                      : 'bg-white/90 border-slate-200/90 text-slate-700'
                  }`}
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span
                      className="animate-pulse-ring absolute inline-flex h-full w-full rounded-full opacity-75"
                      style={{ backgroundColor: hero.badgeDotColor || '#16A34A' }}
                    />
                    <span
                      className="relative inline-flex rounded-full h-2.5 w-2.5"
                      style={{ backgroundColor: hero.badgeDotColor || '#16A34A' }}
                    />
                  </span>
                  {hero.badgeText}
                </span>
              </motion.div>
            )}

            <motion.div variants={itemVariants} className="space-y-2">
              <h1
                className={`font-display font-extrabold tracking-tight text-4xl sm:text-5xl lg:text-[3.35rem] leading-[1.08] ${
                  theme.darkMode ? 'text-white' : 'text-slate-950'
                }`}
              >
                {hero.greeting}{' '}
                <span style={{ color: theme.accentSecondary }}>
                  {hero.highlightName}
                </span>
              </h1>
              <h2
                className={`font-display font-bold text-xl sm:text-2xl lg:text-[1.65rem] ${
                  theme.darkMode ? 'text-slate-200' : 'text-slate-800'
                }`}
              >
                {hero.subtitle}
              </h2>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className={`text-base sm:text-[1.05rem] leading-relaxed max-w-lg ${
                theme.darkMode ? 'text-slate-400' : 'text-slate-600'
              }`}
            >
              {hero.description}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div variants={itemVariants} className="flex flex-wrap items-center gap-3.5 pt-1">
              <motion.button
                type="button"
                whileHover={theme.animationsEnabled ? { scale: 1.03, y: -2 } : undefined}
                whileTap={theme.animationsEnabled ? { scale: 0.97 } : undefined}
                onClick={() => scrollToSection('projects')}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-sm sm:text-[15px] font-semibold text-white shadow-lg transition-all cursor-pointer btn-shimmer group"
                style={{
                  backgroundColor: theme.accentPrimary,
                  boxShadow: `0 12px 24px -8px ${theme.accentPrimary}80`,
                }}
              >
                <span>{hero.primaryCtaLabel}</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
              </motion.button>

              <motion.button
                type="button"
                whileHover={theme.animationsEnabled ? { scale: 1.03, y: -2 } : undefined}
                whileTap={theme.animationsEnabled ? { scale: 0.97 } : undefined}
                onClick={() => scrollToSection('contact')}
                className={`inline-flex items-center gap-2.5 px-6 py-3.5 rounded-full text-sm sm:text-[15px] font-semibold border transition-all cursor-pointer ${
                  theme.darkMode
                    ? 'bg-slate-900 border-slate-700 text-slate-100 hover:border-slate-500'
                    : 'bg-white border-slate-300 text-slate-800 hover:border-slate-400 hover:bg-slate-50 shadow-xs'
                }`}
              >
                <Mail className="w-4 h-4" />
                <span>{hero.secondaryCtaLabel}</span>
              </motion.button>
            </motion.div>

            {/* Social Row */}
            {enabledSocials.length > 0 && (
              <motion.div variants={itemVariants} className="flex items-center gap-4 pt-2">
                {enabledSocials.map((social) => (
                  <motion.a
                    key={social.id}
                    href={normalizeUrl(social.url)}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={social.label}
                    whileHover={theme.animationsEnabled ? { y: -3, scale: 1.12 } : undefined}
                    whileTap={theme.animationsEnabled ? { scale: 0.94 } : undefined}
                    className={`p-2 rounded-full transition-colors ${
                      theme.darkMode
                        ? 'text-slate-300 hover:text-white hover:bg-slate-800'
                        : 'text-slate-800 hover:text-blue-700 hover:bg-blue-50'
                    }`}
                  >
                    <SocialIconSvg platform={social.platform} className="w-5 h-5" />
                  </motion.a>
                ))}
              </motion.div>
            )}
          </motion.div>

          {/* Right Hero Animated Visual Portal */}
          <motion.div
            className="lg:col-span-6 flex justify-center lg:justify-end relative py-4"
            initial={theme.animationsEnabled ? { opacity: 0, scale: 0.92, x: 30 } : false}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.65 * speedMultiplier, ease: [0.22, 1, 0.36, 1] }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <div className="relative w-full max-w-[490px] aspect-[4/3] flex items-center justify-center">
              {/* Soft floating capsule accents */}
              <div
                className="animate-float-slow absolute -top-2 left-8 w-20 h-9 rounded-2xl rotate-[-24deg] opacity-40"
                style={{ backgroundColor: theme.accentSecondary }}
              />
              <div
                className="animate-float-reverse absolute bottom-4 right-8 w-24 h-10 rounded-2xl rotate-[-24deg] opacity-30"
                style={{ backgroundColor: theme.accentPrimary }}
              />
              <div
                className="animate-float-slow absolute top-14 -left-2 w-12 h-5 rounded-full rotate-[-24deg] opacity-55"
                style={{ backgroundColor: '#93C5FD' }}
              />

              {/* Tilted Glass Portal Card */}
              <motion.div
                animate={{
                  rotateX: tilt.x,
                  rotateY: tilt.y,
                  rotateZ: -7,
                }}
                transition={{ type: 'spring', stiffness: 180, damping: 18 }}
                style={{ transformStyle: 'preserve-3d', transformPerspective: 1000 }}
                className={`relative w-[88%] h-[82%] rounded-[2rem] overflow-hidden shadow-2xl border ${
                  theme.darkMode
                    ? 'border-slate-700/80 bg-gradient-to-br from-slate-900 via-slate-800 to-blue-950 shadow-blue-950/50'
                    : 'border-white/90 bg-gradient-to-br from-slate-100 via-blue-50/90 to-indigo-100/80 shadow-blue-900/15'
                }`}
              >
                {hero.heroImageUrl ? (
                  <img
                    src={hero.heroImageUrl}
                    alt="Hero Showcase"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  /* Bespoke Animated Vector Network & Digital Waves */
                  <svg
                    viewBox="0 0 520 380"
                    className="w-full h-full"
                    preserveAspectRatio="xMidYMid slice"
                  >
                    <defs>
                      <linearGradient id="heroWaveGrad1" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor={theme.accentSecondary} stopOpacity="0.32" />
                        <stop offset="100%" stopColor="#93C5FD" stopOpacity="0.06" />
                      </linearGradient>
                      <linearGradient id="heroWaveGrad2" x1="1" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
                        <stop offset="100%" stopColor={theme.accentSecondary} stopOpacity="0.18" />
                      </linearGradient>
                    </defs>

                    {/* Soft background glow */}
                    <rect width="520" height="380" fill="url(#heroWaveGrad1)" />

                    {/* Constellation Nodes & Lines */}
                    <g stroke={theme.accentPrimary} strokeOpacity="0.22" strokeWidth="1.1">
                      <line x1="65" y1="90" x2="145" y2="65" />
                      <line x1="145" y1="65" x2="195" y2="135" />
                      <line x1="65" y1="90" x2="115" y2="175" />
                      <line x1="115" y1="175" x2="195" y2="135" />
                      <line x1="115" y1="175" x2="90" y2="265" />
                      <line x1="90" y1="265" x2="180" y2="255" />
                      <line x1="195" y1="135" x2="290" y2="115" />
                      <line x1="290" y1="115" x2="385" y2="80" />
                      <line x1="290" y1="115" x2="355" y2="200" />
                      <line x1="355" y1="200" x2="445" y2="165" />
                      <line x1="355" y1="200" x2="310" y2="295" />
                    </g>

                    {/* Glowing Nodes */}
                    {[
                      [65, 90],
                      [145, 65],
                      [195, 135],
                      [115, 175],
                      [90, 265],
                      [180, 255],
                      [290, 115],
                      [385, 80],
                      [355, 200],
                      [445, 165],
                      [310, 295],
                    ].map(([cx, cy], idx) => (
                      <g key={idx}>
                        <circle
                          cx={cx}
                          cy={cy}
                          r={idx % 3 === 0 ? 5 : 3.5}
                          fill={idx % 2 === 0 ? '#FFFFFF' : theme.accentSecondary}
                          opacity="0.85"
                        />
                        <circle
                          cx={cx}
                          cy={cy}
                          r="10"
                          fill={theme.accentSecondary}
                          opacity="0.12"
                        />
                      </g>
                    ))}

                    {/* Flowing Ribbon Waves */}
                    <motion.path
                      d="M-30,220 C80,140 180,290 295,185 C390,98 470,185 550,130 L550,255 C455,300 375,210 270,275 C165,340 70,235 -30,295 Z"
                      fill="url(#heroWaveGrad2)"
                      animate={
                        theme.animationsEnabled
                          ? {
                              d: [
                                'M-30,220 C80,140 180,290 295,185 C390,98 470,185 550,130 L550,255 C455,300 375,210 270,275 C165,340 70,235 -30,295 Z',
                                'M-30,200 C95,165 170,265 285,170 C395,82 475,205 550,145 L550,265 C450,285 385,195 275,260 C160,325 75,255 -30,275 Z',
                                'M-30,220 C80,140 180,290 295,185 C390,98 470,185 550,130 L550,255 C455,300 375,210 270,275 C165,340 70,235 -30,295 Z',
                              ],
                            }
                          : undefined
                      }
                      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                    />

                    {/* Subtle Mesh Lines */}
                    <path
                      d="M-20,245 Q130,150 260,210 T540,175"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeOpacity="0.65"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M-20,260 Q140,170 275,225 T540,195"
                      fill="none"
                      stroke={theme.accentSecondary}
                      strokeOpacity="0.3"
                      strokeWidth="1.2"
                    />
                    <path
                      d="M-20,275 Q150,190 290,240 T540,215"
                      fill="none"
                      stroke="#FFFFFF"
                      strokeOpacity="0.45"
                      strokeWidth="1"
                    />
                  </svg>
                )}

                {/* Glass Edge Sheen */}
                <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/50 rounded-[2rem]" />
              </motion.div>

              {/* Fresh Botanical Leaf Accents matching reference aesthetic */}
              {hero.showFloatingLeaves && (
                <>
                  {/* Bottom-Left Leaves */}
                  <motion.svg
                    viewBox="0 0 140 140"
                    className="pointer-events-none absolute bottom-1 left-2 sm:left-4 w-24 h-24 sm:w-28 sm:h-28 drop-shadow-md"
                    animate={theme.animationsEnabled ? { rotate: [0, 3, 0] } : undefined}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <g fill="#2F855A">
                      <path d="M22 118 C16 86 40 62 66 54 C60 84 44 106 22 118Z" fill="#38A169" />
                      <path d="M36 120 C46 92 72 78 96 76 C84 102 64 118 36 120Z" fill="#2F855A" />
                      <path d="M12 96 C10 68 28 42 52 34 C48 62 34 84 12 96Z" fill="#48BB78" />
                      <path d="M52 122 C62 104 86 96 106 98 C94 116 74 124 52 122Z" fill="#276749" />
                    </g>
                  </motion.svg>

                  {/* Top-Right Leaves */}
                  <motion.svg
                    viewBox="0 0 140 140"
                    className="pointer-events-none absolute top-0 right-1 sm:right-3 w-24 h-24 sm:w-28 sm:h-28 drop-shadow-md"
                    animate={theme.animationsEnabled ? { rotate: [0, -3, 0] } : undefined}
                    transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <g>
                      <path d="M118 22 C122 54 98 78 72 86 C78 56 94 34 118 22Z" fill="#38A169" />
                      <path d="M102 16 C92 44 66 58 42 60 C54 34 74 18 102 16Z" fill="#2F855A" />
                      <path d="M126 44 C128 72 110 98 86 106 C90 78 104 56 126 44Z" fill="#48BB78" />
                    </g>
                  </motion.svg>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
