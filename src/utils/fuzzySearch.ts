import { Asset } from '../types/asset';

// Levenshtein distance for fuzzy matching
export function levenshteinDistance(a: string, b: string): number {
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const matrix: number[][] = [];

  for (let i = 0; i <= b.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= a.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          Math.min(
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j] + 1      // deletion
          )
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

// Tokenize and clean text
export function cleanToken(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]/g, '');
}

// Check if search query fuzzy-matches target with 1-2 char tolerance
export function isFuzzyMatch(target: string, query: string): boolean {
  if (!target || !query) return false;
  
  const targetLower = target.toLowerCase();
  const queryLower = query.toLowerCase().trim();
  
  // 1. Direct substring match
  if (targetLower.includes(queryLower)) return true;

  // 2. Clean alphanumeric match (e.g. "GC-MS" vs "GCMS")
  const cleanTarget = cleanToken(targetLower);
  const cleanQuery = cleanToken(queryLower);
  if (cleanTarget.includes(cleanQuery) || cleanQuery.includes(cleanTarget)) return true;

  // 3. Word token matching with Levenshtein tolerance (1-2 edits)
  const targetTokens = targetLower.split(/[\s,./\-_()]+/).filter(Boolean);
  const queryTokens = queryLower.split(/[\s,./\-_()]+/).filter(Boolean);

  for (const qTok of queryTokens) {
    if (qTok.length < 3) continue; // Skip very short tokens
    const maxAllowedDistance = qTok.length <= 4 ? 1 : 2;

    const tokenMatched = targetTokens.some(tTok => {
      if (Math.abs(tTok.length - qTok.length) > maxAllowedDistance) return false;
      const dist = levenshteinDistance(tTok, qTok);
      return dist <= maxAllowedDistance;
    });

    if (tokenMatched) return true;
  }

  return false;
}

// Filter assets using fuzzy logic across multiple fields
export function filterAssetsFuzzy(assets: Asset[], searchQuery: string): Asset[] {
  const q = searchQuery.trim();
  if (!q) return assets;

  return assets.filter(asset => {
    return (
      isFuzzyMatch(asset.registrationNo, q) ||
      isFuzzyMatch(asset.name, q) ||
      (asset.brandModel && isFuzzyMatch(asset.brandModel, q)) ||
      (asset.serialNo && isFuzzyMatch(asset.serialNo, q)) ||
      isFuzzyMatch(asset.custodian, q) ||
      isFuzzyMatch(asset.currentLocation, q) ||
      isFuzzyMatch(asset.category, q)
    );
  });
}

// Recently viewed assets management
const RECENT_KEY = 'upks_recently_viewed_v1';
const PINNED_KEY = 'upks_pinned_assets_v1';

export function getRecentlyViewedIds(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function recordRecentlyViewed(assetId: string): void {
  const current = getRecentlyViewedIds().filter(id => id !== assetId);
  const updated = [assetId, ...current].slice(0, 6);
  localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
}

export function getPinnedAssetIds(): string[] {
  try {
    const raw = localStorage.getItem(PINNED_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function togglePinnedAsset(assetId: string): boolean {
  const current = getPinnedAssetIds();
  let updated: string[];
  let isPinned = false;

  if (current.includes(assetId)) {
    updated = current.filter(id => id !== assetId);
    isPinned = false;
  } else {
    updated = [assetId, ...current];
    isPinned = true;
  }

  localStorage.setItem(PINNED_KEY, JSON.stringify(updated));
  return isPinned;
}
