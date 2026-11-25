import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { DEFAULT_PORTFOLIO_DATA, STORAGE_KEY } from '../data/defaultPortfolioData';

const PortfolioContext = createContext(null);

function deepMerge(defaults, stored) {
  if (!stored || typeof stored !== 'object') return defaults;
  if (Array.isArray(defaults)) {
    return Array.isArray(stored) ? stored : defaults;
  }
  const result = { ...defaults };
  for (const key of Object.keys(defaults)) {
    if (key in stored) {
      if (
        defaults[key] &&
        typeof defaults[key] === 'object' &&
        !Array.isArray(defaults[key]) &&
        stored[key] &&
        typeof stored[key] === 'object' &&
        !Array.isArray(stored[key])
      ) {
        result[key] = deepMerge(defaults[key], stored[key]);
      } else {
        result[key] = stored[key];
      }
    }
  }
  for (const key of Object.keys(stored)) {
    if (!(key in result)) {
      result[key] = stored[key];
    }
  }
  return result;
}

export function PortfolioProvider({ children }) {
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return deepMerge(DEFAULT_PORTFOLIO_DATA, JSON.parse(raw));
      }
    } catch {
      // Fallback cleanly to defaults if storage is unavailable or corrupted
    }
    return DEFAULT_PORTFOLIO_DATA;
  });

  const [isAdminOpen, setIsAdminOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      // Ignore quota errors cleanly
    }
  }, [data]);

  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--accent-primary', data.theme.accentPrimary || '#0B52C4');
    root.style.setProperty('--accent-secondary', data.theme.accentSecondary || '#1D6DF2');
    root.style.setProperty('--accent-soft', data.theme.accentSoft || '#EEF4FF');

    if (data.branding?.pageTitle) {
      document.title = data.branding.pageTitle;
    }

    if (data.theme.darkMode) {
      root.classList.add('dark-theme');
      document.body.style.backgroundColor = '#020617';
      document.body.style.color = '#F8FAFC';
    } else {
      root.classList.remove('dark-theme');
      document.body.style.backgroundColor = '#FFFFFF';
      document.body.style.color = '#0F172A';
    }
  }, [data.theme, data.branding?.pageTitle]);

  const updateData = useCallback((updater) => {
    setData((prev) => (typeof updater === 'function' ? updater(prev) : updater));
  }, []);

  const updateSection = useCallback((sectionKey, patch) => {
    setData((prev) => ({
      ...prev,
      [sectionKey]: {
        ...prev[sectionKey],
        ...(typeof patch === 'function' ? patch(prev[sectionKey]) : patch),
      },
    }));
  }, []);

  const resetToDefaults = useCallback(() => {
    setData(DEFAULT_PORTFOLIO_DATA);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  const importData = useCallback((incoming) => {
    const merged = deepMerge(DEFAULT_PORTFOLIO_DATA, incoming);
    setData(merged);
  }, []);

  const addMessage = useCallback((message) => {
    const entry = {
      id: `msg-${Date.now()}`,
      ...message,
      createdAt: new Date().toISOString(),
      read: false,
    };
    setData((prev) => ({
      ...prev,
      messages: [entry, ...(prev.messages || [])],
    }));
  }, []);

  const markMessageRead = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      messages: (prev.messages || []).map((m) =>
        m.id === id ? { ...m, read: true } : m
      ),
    }));
  }, []);

  const deleteMessage = useCallback((id) => {
    setData((prev) => ({
      ...prev,
      messages: (prev.messages || []).filter((m) => m.id !== id),
    }));
  }, []);

  const openAdmin = useCallback(() => setIsAdminOpen(true), []);
  const closeAdmin = useCallback(() => setIsAdminOpen(false), []);

  const speedMultiplier =
    data.theme.animationSpeed === 'snappy'
      ? 0.65
      : data.theme.animationSpeed === 'relaxed'
        ? 1.35
        : 1;

  return (
    <PortfolioContext.Provider
      value={{
        data,
        updateData,
        updateSection,
        resetToDefaults,
        importData,
        addMessage,
        markMessageRead,
        deleteMessage,
        isAdminOpen,
        openAdmin,
        closeAdmin,
        speedMultiplier,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
}

export function usePortfolio() {
  const ctx = useContext(PortfolioContext);
  if (!ctx) {
    throw new Error('usePortfolio must be used within PortfolioProvider');
  }
  return ctx;
}
