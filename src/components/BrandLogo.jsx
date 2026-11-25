import React, { useRef } from 'react';
import { motion } from 'framer-motion';
import { usePortfolio } from '../context/PortfolioContext';

export function BrandLogo({ size = 'md', onSingleClick }) {
  const { data, openAdmin } = usePortfolio();
  const { branding, theme } = data;
  const lastTapRef = useRef(0);

  const handleClick = (e) => {
    const now = Date.now();
    if (now - lastTapRef.current < 320) {
      e.preventDefault();
      lastTapRef.current = 0;
      openAdmin();
      return;
    }
    lastTapRef.current = now;
    if (onSingleClick) {
      onSingleClick(e);
    }
  };

  const handleDoubleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    openAdmin();
  };

  const iconSize = size === 'sm' ? 28 : 34;

  return (
    <motion.a
      href="#home"
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      whileHover={theme.animationsEnabled ? { scale: 1.03 } : undefined}
      whileTap={theme.animationsEnabled ? { scale: 0.97 } : undefined}
      className="inline-flex items-center gap-2.5 select-none cursor-pointer group focus:outline-none"
    >
      {branding.customLogoUrl ? (
        <img
          src={branding.customLogoUrl}
          alt={branding.logoText}
          style={{ width: iconSize, height: iconSize }}
          className="rounded-lg object-cover"
          draggable={false}
        />
      ) : (
        <svg
          width={iconSize}
          height={iconSize}
          viewBox="0 0 36 36"
          fill="none"
          className="shrink-0 transition-transform duration-300 group-hover:rotate-[-3deg]"
        >
          <path
            d="M7 29V7H13.2L22.8 20.5V7H29V29H22.8L13.2 15.5V29H7Z"
            fill={theme.accentPrimary}
          />
          <path
            d="M7 7L13.2 7L22.8 20.5L16.8 20.5L7 7Z"
            fill={theme.accentSecondary}
            opacity="0.85"
          />
        </svg>
      )}
      <span
        className={`font-display font-extrabold tracking-tight ${
          size === 'sm' ? 'text-lg' : 'text-xl'
        } ${theme.darkMode ? 'text-white' : 'text-slate-900'}`}
      >
        {branding.logoText}
      </span>
    </motion.a>
  );
}
