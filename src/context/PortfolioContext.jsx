import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { DEFAULT_PORTFOLIO_DATA, STORAGE_KEY } from '../data/defaultPortfolioData';
import {
  DEFAULT_SYNC_REPO,
  fetchRemotePortfolioData,
  loadSyncCredentials,
  publishPortfolioToGitHub,
  saveSyncCredentials,
  sanitizePublicPortfolioData,
} from '../utils/cloudSync';

const DRAFT_STORAGE_KEY = 'nayan_portfolio_admin_draft_v1';
const PUBLISHED_CACHE_KEY = 'nayan_portfolio_published_cache_v1';
const MESSAGES_STORAGE_KEY = 'nayan_portfolio_messages_v1';
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

function readJsonStorage(key) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function PortfolioProvider({ children }) {
  const [hasUnpublishedChanges, setHasUnpublishedChanges] = useState(() => {
    return Boolean(readJsonStorage(DRAFT_STORAGE_KEY));
  });

  const [data, setData] = useState(() => {
    const savedMessages = readJsonStorage(MESSAGES_STORAGE_KEY) || [];
    const draft = readJsonStorage(DRAFT_STORAGE_KEY);
    if (draft) {
      return { ...deepMerge(DEFAULT_PORTFOLIO_DATA, draft), messages: savedMessages };
    }

    const cached = readJsonStorage(PUBLISHED_CACHE_KEY);
    if (cached) {
      return { ...deepMerge(DEFAULT_PORTFOLIO_DATA, cached), messages: savedMessages };
    }

    const legacy = readJsonStorage(STORAGE_KEY);
    if (legacy) {
      return { ...deepMerge(DEFAULT_PORTFOLIO_DATA, legacy), messages: savedMessages };
    }

    return { ...DEFAULT_PORTFOLIO_DATA, messages: savedMessages };
  });

  const [syncCreds, setSyncCreds] = useState(() => loadSyncCredentials());
  const [syncState, setSyncState] = useState({
    loadingRemote: true,
    publishing: false,
    lastSource: 'default',
    lastPublishedAt: data?.meta?.updatedAt || '',
    error: '',
  });
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Pull latest published portfolio JSON on load for all browsers/devices
  const refreshFromRemote = useCallback(
    async (forceReplaceDraft = false) => {
      setSyncState((prev) => ({ ...prev, loadingRemote: true, error: '' }));
      const remote = await fetchRemotePortfolioData({
        ...DEFAULT_SYNC_REPO,
        owner: syncCreds.owner || DEFAULT_SYNC_REPO.owner,
        repo: syncCreds.repo || DEFAULT_SYNC_REPO.repo,
        branch: syncCreds.branch || DEFAULT_SYNC_REPO.branch,
        path: syncCreds.path || DEFAULT_SYNC_REPO.path,
      });

      if (!remote) {
        setSyncState((prev) => ({ ...prev, loadingRemote: false }));
        return false;
      }

      const merged = deepMerge(DEFAULT_PORTFOLIO_DATA, remote.data);
      try {
        localStorage.setItem(PUBLISHED_CACHE_KEY, JSON.stringify(merged));
      } catch {
        // Ignore quota errors
      }

      const activeDraft = readJsonStorage(DRAFT_STORAGE_KEY);
      if (!activeDraft || forceReplaceDraft) {
        if (forceReplaceDraft) {
          try {
            localStorage.removeItem(DRAFT_STORAGE_KEY);
            localStorage.removeItem(STORAGE_KEY);
          } catch {
            // Ignore
          }
          setHasUnpublishedChanges(false);
        }
        const savedMessages = readJsonStorage(MESSAGES_STORAGE_KEY) || [];
        setData({ ...merged, messages: savedMessages });
      }

      setSyncState((prev) => ({
        ...prev,
        loadingRemote: false,
        lastSource: remote.source,
        lastPublishedAt: merged?.meta?.updatedAt || prev.lastPublishedAt,
      }));
      return true;
    },
    [syncCreds.branch, syncCreds.owner, syncCreds.path, syncCreds.repo]
  );

  useEffect(() => {
    refreshFromRemote(false);
  }, [refreshFromRemote]);

  // Sync theme variables and browser title
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

  const persistDraft = useCallback((nextData) => {
    setHasUnpublishedChanges(true);
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(nextData));
    } catch {
      // Ignore quota errors
    }
  }, []);

  const updateData = useCallback(
    (updater) => {
      setData((prev) => {
        const next = typeof updater === 'function' ? updater(prev) : updater;
        persistDraft(next);
        return next;
      });
    },
    [persistDraft]
  );

  const updateSection = useCallback(
    (sectionKey, patch) => {
      setData((prev) => {
        const next = {
          ...prev,
          [sectionKey]: {
            ...prev[sectionKey],
            ...(typeof patch === 'function' ? patch(prev[sectionKey]) : patch),
          },
        };
        persistDraft(next);
        return next;
      });
    },
    [persistDraft]
  );

  const updateSyncCreds = useCallback((patch) => {
    setSyncCreds((prev) => {
      const next = { ...prev, ...patch };
      saveSyncCredentials(next);
      return next;
    });
  }, []);

  const publishLive = useCallback(
    async (overrideCreds) => {
      const credsToUse = overrideCreds ? { ...syncCreds, ...overrideCreds } : syncCreds;
      setSyncState((prev) => ({ ...prev, publishing: true, error: '' }));
      try {
        const result = await publishPortfolioToGitHub(data, credsToUse);
        const publishedWithLocalMessages = {
          ...result.publishedData,
          messages: data.messages || [],
        };
        setData(publishedWithLocalMessages);
        setHasUnpublishedChanges(false);
        try {
          localStorage.setItem(
            PUBLISHED_CACHE_KEY,
            JSON.stringify(result.publishedData)
          );
          localStorage.removeItem(DRAFT_STORAGE_KEY);
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          // Ignore
        }
        setSyncState((prev) => ({
          ...prev,
          publishing: false,
          lastSource: 'github-api',
          lastPublishedAt: result.publishedData.meta.updatedAt,
          error: '',
        }));
        return result;
      } catch (err) {
        setSyncState((prev) => ({
          ...prev,
          publishing: false,
          error: err.message || 'Publish failed',
        }));
        throw err;
      }
    },
    [data, syncCreds]
  );

  const resetToDefaults = useCallback(() => {
    const fresh = sanitizePublicPortfolioData(DEFAULT_PORTFOLIO_DATA);
    setData(fresh);
    persistDraft(fresh);
  }, [persistDraft]);

  const importData = useCallback(
    (incoming) => {
      const merged = deepMerge(DEFAULT_PORTFOLIO_DATA, incoming);
      setData(merged);
      persistDraft(merged);
    },
    [persistDraft]
  );

  const addMessage = useCallback(
    (message) => {
      const entry = {
        id: `msg-${Date.now()}`,
        ...message,
        createdAt: new Date().toISOString(),
        read: false,
      };
      setData((prev) => {
        const nextMessages = [entry, ...(prev.messages || [])];
        try {
          localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(nextMessages));
        } catch {
          // Ignore
        }
        return {
          ...prev,
          messages: nextMessages,
        };
      });
    },
    []
  );

  const markMessageRead = useCallback((id) => {
    setData((prev) => {
      const nextMessages = (prev.messages || []).map((m) =>
        m.id === id ? { ...m, read: true } : m
      );
      try {
        localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(nextMessages));
      } catch {
        // Ignore
      }
      return { ...prev, messages: nextMessages };
    });
  }, []);

  const deleteMessage = useCallback((id) => {
    setData((prev) => {
      const nextMessages = (prev.messages || []).filter((m) => m.id !== id);
      try {
        localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(nextMessages));
      } catch {
        // Ignore
      }
      return { ...prev, messages: nextMessages };
    });
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
        hasUnpublishedChanges,
        syncCreds,
        updateSyncCreds,
        syncState,
        publishLive,
        refreshFromRemote,
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
