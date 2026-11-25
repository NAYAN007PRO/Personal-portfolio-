export const DEFAULT_SYNC_REPO = {
  owner: 'NAYAN007PRO',
  repo: 'Personal-portfolio-',
  branch: 'main',
  path: 'public/portfolio-data.json',
};

export const SYNC_CREDS_STORAGE_KEY = 'nayan_portfolio_sync_creds_v1';

export function utf8ToBase64(str) {
  const bytes = new TextEncoder().encode(str);
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

export function sanitizePublicPortfolioData(data) {
  const cloned = JSON.parse(JSON.stringify(data));
  cloned.messages = [];
  cloned.meta = {
    ...(cloned.meta || {}),
    updatedAt: new Date().toISOString(),
  };
  return cloned;
}

export function loadSyncCredentials() {
  try {
    const raw = localStorage.getItem(SYNC_CREDS_STORAGE_KEY);
    if (raw) {
      return { ...DEFAULT_SYNC_REPO, ...JSON.parse(raw) };
    }
  } catch {
    // Ignore storage errors
  }
  return { ...DEFAULT_SYNC_REPO, token: '', customEndpoint: '', customWriteSecret: '' };
}

export function saveSyncCredentials(creds) {
  try {
    localStorage.setItem(SYNC_CREDS_STORAGE_KEY, JSON.stringify(creds));
  } catch {
    // Ignore storage errors
  }
}

export async function fetchRemotePortfolioData(repoConfig = DEFAULT_SYNC_REPO) {
  const { owner, repo, branch, path } = { ...DEFAULT_SYNC_REPO, ...repoConfig };
  const bust = Date.now();

  const candidates = [
    {
      url: `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}&t=${bust}`,
      options: {
        cache: 'no-store',
        headers: { Accept: 'application/vnd.github.raw+json' },
      },
      source: 'github-api',
    },
    {
      url: `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${path}?t=${bust}`,
      options: { cache: 'no-store' },
      source: 'github-raw',
    },
    {
      url: `/portfolio-data.json?t=${bust}`,
      options: { cache: 'no-store' },
      source: 'local-origin',
    },
  ];

  for (const candidate of candidates) {
    try {
      const res = await fetch(candidate.url, candidate.options);
      if (!res.ok) continue;
      const json = await res.json();
      if (json && typeof json === 'object' && json.hero && json.skills) {
        return { data: json, source: candidate.source };
      }
    } catch {
      // Try next source seamlessly
    }
  }

  return null;
}

export async function publishPortfolioToGitHub(portfolioData, creds) {
  const owner = (creds?.owner || DEFAULT_SYNC_REPO.owner).trim();
  const repo = (creds?.repo || DEFAULT_SYNC_REPO.repo).trim();
  const branch = (creds?.branch || DEFAULT_SYNC_REPO.branch).trim();
  const path = (creds?.path || DEFAULT_SYNC_REPO.path).trim();
  const token = (creds?.token || '').trim();

  if (!token) {
    throw new Error('Please paste your GitHub Personal Access Token first.');
  }

  const cleanPayload = sanitizePublicPortfolioData(portfolioData);
  const jsonString = JSON.stringify(cleanPayload, null, 2);
  const contentBase64 = utf8ToBase64(jsonString);

  const apiBase = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
    'Content-Type': 'application/json',
  };

  let existingSha = null;
  const getRes = await fetch(`${apiBase}?ref=${encodeURIComponent(branch)}&t=${Date.now()}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/vnd.github+json',
    },
    cache: 'no-store',
  });

  if (getRes.ok) {
    const fileInfo = await getRes.json();
    existingSha = fileInfo.sha;
  } else if (getRes.status !== 404) {
    const errBody = await getRes.json().catch(() => ({}));
    throw new Error(errBody.message || `GitHub read error (${getRes.status})`);
  }

  const putBody = {
    message: `Update portfolio data (${new Date().toISOString()})`,
    content: contentBase64,
    branch,
    ...(existingSha ? { sha: existingSha } : {}),
  };

  const putRes = await fetch(apiBase, {
    method: 'PUT',
    headers,
    body: JSON.stringify(putBody),
  });

  if (!putRes.ok) {
    const errBody = await putRes.json().catch(() => ({}));
    throw new Error(errBody.message || `GitHub publish failed (${putRes.status})`);
  }

  const result = await putRes.json();
  return {
    publishedData: cleanPayload,
    commitUrl: result?.commit?.html_url || '',
    commitSha: result?.commit?.sha || '',
  };
}

export function generateDefaultDataModule(portfolioData) {
  const cleanPayload = sanitizePublicPortfolioData(portfolioData);
  return `export const STORAGE_KEY = 'nayan_portfolio_data_v1';

export const ACCENT_PRESETS = [
  { name: 'Cobalt Blue', primary: '#0B52C4', secondary: '#1D6DF2', soft: '#EEF4FF' },
  { name: 'Electric Indigo', primary: '#4338CA', secondary: '#6366F1', soft: '#EEF2FF' },
  { name: 'Ocean Cyan', primary: '#0369A1', secondary: '#0EA5E9', soft: '#E0F2FE' },
  { name: 'Emerald Tech', primary: '#047857', secondary: '#10B981', soft: '#ECFDF5' },
  { name: 'Royal Violet', primary: '#6D28D9', secondary: '#8B5CF6', soft: '#F5F3FF' },
  { name: 'Crimson Studio', primary: '#BE123C', secondary: '#F43F5E', soft: '#FFF1F2' },
];

export const DEFAULT_PORTFOLIO_DATA = ${JSON.stringify(cleanPayload, null, 2)};
`;
}
