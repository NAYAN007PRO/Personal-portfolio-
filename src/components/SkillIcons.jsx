import React from 'react';

export const SKILL_ICON_OPTIONS = [
  { key: 'c', label: 'C Language' },
  { key: 'cpp', label: 'C++' },
  { key: 'js', label: 'JavaScript' },
  { key: 'css', label: 'CSS3' },
  { key: 'html', label: 'HTML5' },
  { key: 'python', label: 'Python' },
  { key: 'java', label: 'Java' },
  { key: 'php', label: 'PHP' },
  { key: 'mysql', label: 'MySQL' },
  { key: 'dbms', label: 'DBMS / SQL' },
  { key: 'react', label: 'React.js' },
  { key: 'django', label: 'Django' },
  { key: 'git', label: 'Git & GitHub' },
  { key: 'typescript', label: 'TypeScript' },
  { key: 'nodejs', label: 'Node.js' },
  { key: 'tailwind', label: 'Tailwind CSS' },
  { key: 'security', label: 'Cybersecurity' },
  { key: 'figma', label: 'Figma' },
  { key: 'code', label: 'Generic Code' },
];

export function SkillIcon({ iconKey, customIconUrl, size = 40, className = '' }) {
  if (customIconUrl) {
    return (
      <img
        src={customIconUrl}
        alt=""
        style={{ width: size, height: size }}
        className={`object-contain rounded-md ${className}`}
      />
    );
  }

  const s = size;

  switch (iconKey) {
    case 'html':
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none" className={className}>
          <path d="M9 6H39L36.2 37.5L24 41.5L11.8 37.5L9 6Z" fill="#E44D26" />
          <path d="M24 9V38.8L33.8 35.6L36 9H24Z" fill="#F16529" />
          <path d="M24 20.5H17.6L17.2 15.8H24V11.2H12.3L13.5 25.1H24V20.5ZM24 32.5L19.1 31.1L18.8 27.4H14.2L14.8 34.7L24 37.3V32.5Z" fill="#EBEBEB" />
          <path d="M24 20.5V25.1H29.6L29.1 31.1L24 32.5V37.3L33.2 34.7L34.3 20.5H24ZM24 11.2V15.8H35.2L35.6 11.2H24Z" fill="white" />
        </svg>
      );

    case 'css':
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none" className={className}>
          <path d="M9 6H39L36.2 37.5L24 41.5L11.8 37.5L9 6Z" fill="#1572B6" />
          <path d="M24 9V38.8L33.8 35.6L36 9H24Z" fill="#33A9DC" />
          <path d="M24 20.5H16.8L17.2 25.1H24V20.5ZM24 11.2H12.3L12.7 15.8H24V11.2ZM24 32.5L19 31.1L18.7 27.4H14.1L14.7 34.7L24 37.3V32.5Z" fill="#EBEBEB" />
          <path d="M24 20.5V25.1H29.6L29.1 31.1L24 32.5V37.3L33.2 34.7L34.7 15.8H35.1L35.5 11.2H24V15.8H30.3L29.9 20.5H24Z" fill="white" />
        </svg>
      );

    case 'js':
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none" className={className}>
          <rect x="6" y="6" width="36" height="36" rx="6" fill="#F7DF1E" />
          <path
            d="M25.7 32.4C26.4 33.6 27.4 34.4 29 34.4C30.4 34.4 31.3 33.7 31.3 32.7C31.3 31.5 30.4 31.1 28.8 30.4L27.9 30C25.4 28.9 23.7 27.6 23.7 24.7C23.7 22.1 25.7 20.1 28.8 20.1C31 20.1 32.6 20.9 33.8 22.9L31 24.7C30.4 23.6 29.7 23.2 28.8 23.2C27.8 23.2 27.1 23.9 27.1 24.7C27.1 25.7 27.8 26.2 29.3 26.8L30.2 27.2C33.1 28.5 34.8 29.7 34.8 32.7C34.8 35.9 32.3 37.6 28.9 37.6C25.6 37.6 23.5 36 22.5 34L25.7 32.4ZM15.1 32.7C15.7 33.8 16.3 34.6 17.5 34.6C18.7 34.6 19.4 34.1 19.4 32.2V20.4H22.9V32.3C22.9 36.1 20.7 37.7 17.6 37.7C14.8 37.7 13.1 36.2 12.3 34.4L15.1 32.7Z"
            fill="#111827"
          />
        </svg>
      );

    case 'python':
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none" className={className}>
          <path
            d="M23.8 6C15.8 6 16.3 9.5 16.3 9.5V13.1H24V14.2H13.2C13.2 14.2 8 13.6 8 21.8C8 30 12.5 29.7 12.5 29.7H15.2V25.9C15.2 25.9 15.1 21.4 19.6 21.4H27.3C27.3 21.4 31.6 21.5 31.6 17.3V10.4C31.6 10.4 32.3 6 23.8 6ZM19.5 8.5C20.3 8.5 20.9 9.1 20.9 9.9C20.9 10.7 20.3 11.3 19.5 11.3C18.7 11.3 18.1 10.7 18.1 9.9C18.1 9.1 18.7 8.5 19.5 8.5Z"
            fill="#3776AB"
          />
          <path
            d="M24.2 42C32.2 42 31.7 38.5 31.7 38.5V34.9H24V33.8H34.8C34.8 33.8 40 34.4 40 26.2C40 18 35.5 18.3 35.5 18.3H32.8V22.1C32.8 22.1 32.9 26.6 28.4 26.6H20.7C20.7 26.6 16.4 26.5 16.4 30.7V37.6C16.4 37.6 15.7 42 24.2 42ZM28.5 39.5C27.7 39.5 27.1 38.9 27.1 38.1C27.1 37.3 27.7 36.7 28.5 36.7C29.3 36.7 29.9 37.3 29.9 38.1C29.9 38.9 29.3 39.5 28.5 39.5Z"
            fill="#FFD43B"
          />
        </svg>
      );

    case 'react':
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none" className={className}>
          <circle cx="24" cy="24" r="3.8" fill="#06B6D4" />
          <ellipse cx="24" cy="24" rx="18" ry="7" stroke="#06B6D4" strokeWidth="2.4" />
          <ellipse cx="24" cy="24" rx="18" ry="7" transform="rotate(60 24 24)" stroke="#06B6D4" strokeWidth="2.4" />
          <ellipse cx="24" cy="24" rx="18" ry="7" transform="rotate(120 24 24)" stroke="#06B6D4" strokeWidth="2.4" />
        </svg>
      );

    case 'c':
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none" className={className}>
          <path d="M24 5L40 14.2V33.8L24 43L8 33.8V14.2L24 5Z" fill="#00599C" />
          <path d="M40 14.2V33.8L24 43V24L40 14.2Z" fill="#004482" />
          <path d="M24 5L40 14.2L24 24L8 14.2L24 5Z" fill="#659AD2" opacity="0.55" />
          <path
            d="M29.4 28.5C28.2 30.3 26.3 31.4 24 31.4C20.2 31.4 17.2 28.1 17.2 24C17.2 19.9 20.2 16.6 24 16.6C26.4 16.6 28.4 17.8 29.6 19.7L26.2 21.6C25.7 20.8 24.9 20.3 24 20.3C22.2 20.3 20.9 21.9 20.9 24C20.9 26.1 22.2 27.7 24 27.7C24.9 27.7 25.7 27.2 26.2 26.4L29.4 28.5Z"
            fill="white"
          />
        </svg>
      );

    case 'cpp':
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none" className={className}>
          <path d="M24 5L40 14.2V33.8L24 43L8 33.8V14.2L24 5Z" fill="#00599C" />
          <path d="M40 14.2V33.8L24 43V24L40 14.2Z" fill="#004482" />
          <path d="M24 5L40 14.2L24 24L8 14.2L24 5Z" fill="#659AD2" opacity="0.55" />
          <path
            d="M24.2 28.2C23.1 29.8 21.4 30.7 19.5 30.7C16.2 30.7 13.7 27.7 13.7 24C13.7 20.3 16.2 17.3 19.5 17.3C21.5 17.3 23.2 18.3 24.3 20L21.3 21.7C20.9 21 20.2 20.6 19.5 20.6C18.1 20.6 17 22 17 24C17 26 18.1 27.4 19.5 27.4C20.3 27.4 20.9 27 21.3 26.3L24.2 28.2Z"
            fill="white"
          />
          <path d="M27.2 23H29.4V20.8H31.2V23H33.4V24.8H31.2V27H29.4V24.8H27.2V23Z" fill="white" />
          <path d="M34.2 23H36.4V20.8H38.2V23H40.4V24.8H38.2V27H36.4V24.8H34.2V23Z" fill="white" />
        </svg>
      );

    case 'java':
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none" className={className}>
          <path
            d="M19.5 31.8C19.5 31.8 18 32.7 20.6 33C23.7 33.4 25.3 33.3 28.8 32.6C28.8 32.6 29.7 33.2 31 33.7C23.1 37.1 13.2 33.5 19.5 31.8Z"
            fill="#5382A1"
          />
          <path
            d="M18.6 27.7C18.6 27.7 16.9 28.9 19.5 29.2C22.9 29.5 25.6 29.6 30.3 28.7C30.3 28.7 31 29.4 32 29.8C22.5 32.6 11.9 30 18.6 27.7Z"
            fill="#5382A1"
          />
          <path
            d="M26.5 21.3C28.4 23.5 26 25.5 26 25.5C26 25.5 30.8 23 28.6 19.9C26.5 17 24.9 15.6 33.6 10.6C33.6 10.6 20 14 26.5 21.3Z"
            fill="#E76F00"
          />
          <path
            d="M35.4 35C35.4 35 36.5 35.9 34.2 36.6C29.8 37.9 16 38.3 12.2 36.7C10.8 36.1 13.4 35.3 14.2 35.1C15.1 34.9 15.6 34.9 15.6 34.9C14 33.8 5.2 37.1 11.1 38.1C27.2 40.7 40.5 36.9 35.4 35Z"
            fill="#5382A1"
          />
          <path
            d="M25.6 6.5C25.6 6.5 30.1 11 21.4 17.9C14.3 23.5 19.8 26.7 21.4 30.3C17.3 26.6 14.3 23.4 16.3 20.4C19.3 16 27.6 13.8 25.6 6.5Z"
            fill="#E76F00"
          />
        </svg>
      );

    case 'php':
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none" className={className}>
          <ellipse cx="24" cy="24" rx="20" ry="12" fill="#777BB4" />
          <ellipse cx="24" cy="24" rx="18" ry="10" stroke="white" strokeWidth="1.2" strokeOpacity="0.35" />
          <text
            x="24"
            y="28"
            textAnchor="middle"
            fill="white"
            fontSize="12.5"
            fontWeight="800"
            fontStyle="italic"
            fontFamily="Inter, sans-serif"
          >
            php
          </text>
        </svg>
      );

    case 'mysql':
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none" className={className}>
          <rect x="6" y="8" width="36" height="32" rx="8" fill="#E0F2FE" />
          <path
            d="M14 27C14 20.5 20.5 15 28 15C31.2 15 33.5 16.2 35 18C32.2 17.5 29.8 18.6 28.5 20.5C29.8 21.8 30.5 24 30.2 26.8C32 27.6 33.8 28.8 34.8 30.5C32.4 30.3 30.5 29.5 29 28.4C26.2 31.2 21.8 31.6 18.2 30.2C16.2 29.4 14.8 28.3 14 27Z"
            fill="#00758F"
          />
          <circle cx="24.5" cy="19.5" r="1.4" fill="#F29111" />
          <text
            x="24"
            y="37"
            textAnchor="middle"
            fill="#00758F"
            fontSize="7.5"
            fontWeight="800"
            fontFamily="Inter, sans-serif"
          >
            MySQL
          </text>
        </svg>
      );

    case 'dbms':
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none" className={className}>
          <ellipse cx="24" cy="12" rx="14" ry="5.5" fill="#0D9488" />
          <path d="M10 12V20C10 23 16.3 25.5 24 25.5C31.7 25.5 38 23 38 20V12" fill="#14B8A6" />
          <ellipse cx="24" cy="12" rx="14" ry="5.5" fill="#2DD4BF" />
          <path d="M10 21V29C10 32 16.3 34.5 24 34.5C31.7 34.5 38 32 38 29V21" fill="#0F766E" />
          <path d="M10 29V36.5C10 39.5 16.3 42 24 42C31.7 42 38 39.5 38 36.5V29" fill="#115E59" />
          <circle cx="31" cy="25" r="1.8" fill="white" />
          <circle cx="31" cy="34" r="1.8" fill="white" />
        </svg>
      );

    case 'django':
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none" className={className}>
          <rect x="6" y="6" width="36" height="36" rx="8" fill="#092E20" />
          <text
            x="24"
            y="29.5"
            textAnchor="middle"
            fill="white"
            fontSize="16"
            fontWeight="800"
            fontFamily="Plus Jakarta Sans, sans-serif"
          >
            dj
          </text>
        </svg>
      );

    case 'git':
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none" className={className}>
          <rect x="10" y="10" width="28" height="28" rx="5" transform="rotate(45 24 4)" fill="#F05032" />
          <path d="M20 16L27 23M24 20V32" stroke="white" strokeWidth="2.8" strokeLinecap="round" />
          <circle cx="24" cy="20" r="2.6" fill="white" />
          <circle cx="24" cy="31" r="2.6" fill="white" />
          <circle cx="28" cy="24" r="2.6" fill="white" />
        </svg>
      );

    case 'typescript':
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none" className={className}>
          <rect x="6" y="6" width="36" height="36" rx="6" fill="#3178C6" />
          <text x="27" y="36" textAnchor="middle" fill="white" fontSize="17" fontWeight="800">
            TS
          </text>
        </svg>
      );

    case 'nodejs':
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none" className={className}>
          <path d="M24 5L40 14.2V33.8L24 43L8 33.8V14.2L24 5Z" fill="#539E43" />
          <text x="24" y="28" textAnchor="middle" fill="white" fontSize="11" fontWeight="800">
            JS
          </text>
        </svg>
      );

    case 'tailwind':
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none" className={className}>
          <path
            d="M24 14C18.7 14 15.3 16.7 14 22C16 19.3 18.3 18.3 21 19C22.5 19.4 23.6 20.5 24.8 21.7C26.8 23.7 29.1 26 34 26C39.3 26 42.7 23.3 44 18C42 20.7 39.7 21.7 37 21C35.5 20.6 34.4 19.5 33.2 18.3C31.2 16.3 28.9 14 24 14ZM14 26C8.7 26 5.3 28.7 4 34C6 31.3 8.3 30.3 11 31C12.5 31.4 13.6 32.5 14.8 33.7C16.8 35.7 19.1 38 24 38C29.3 38 32.7 35.3 34 30C32 32.7 29.7 33.7 27 33C25.5 32.6 24.4 31.5 23.2 30.3C21.2 28.3 18.9 26 14 26Z"
            fill="#06B6D4"
          />
        </svg>
      );

    case 'security':
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none" className={className}>
          <path d="M24 6L39 12.5V23.5C39 33.2 32.6 40.6 24 43C15.4 40.6 9 33.2 9 23.5V12.5L24 6Z" fill="#0F172A" />
          <path d="M24 14L31 28H27.2L25.8 25H22.2L20.8 28H17L24 14ZM24 19L22.9 22.3H25.1L24 19Z" fill="white" />
        </svg>
      );

    case 'figma':
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none" className={className}>
          <path d="M18 40C21.3 40 24 37.3 24 34V28H18C14.7 28 12 30.7 12 34C12 37.3 14.7 40 18 40Z" fill="#0ACF83" />
          <path d="M12 22C12 18.7 14.7 16 18 16H24V28H18C14.7 28 12 25.3 12 22Z" fill="#A259FF" />
          <path d="M12 10C12 6.7 14.7 4 18 4H24V16H18C14.7 16 12 13.3 12 10Z" fill="#F24E1E" />
          <path d="M24 4H30C33.3 4 36 6.7 36 10C36 13.3 33.3 16 30 16H24V4Z" fill="#FF7262" />
          <path d="M36 22C36 25.3 33.3 28 30 28C26.7 28 24 25.3 24 22C24 18.7 26.7 16 30 16C33.3 16 36 18.7 36 22Z" fill="#1ABCFE" />
        </svg>
      );

    default:
      return (
        <svg width={s} height={s} viewBox="0 0 48 48" fill="none" className={className}>
          <rect x="6" y="6" width="36" height="36" rx="10" fill="#EFF6FF" stroke="#2563EB" strokeWidth="2.5" />
          <path d="M19 18L13 24L19 30M29 18L35 24L29 30M26 15L22 33" stroke="#1D4ED8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      );
  }
}
