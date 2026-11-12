import { Asset } from '../types/asset';

export function isChemicalExpired(asset: Asset): boolean {
  if (asset.category !== 'Peralatan Test Chemical' || !asset.expiryDate) {
    return false;
  }
  const today = new Date().toISOString().split('T')[0];
  return asset.expiryDate < today;
}

export function getChemicalExpiryDays(asset: Asset): number | null {
  if (asset.category !== 'Peralatan Test Chemical' || !asset.expiryDate) {
    return null;
  }
  const expiryTime = new Date(asset.expiryDate).getTime();
  const todayTime = new Date(new Date().toISOString().split('T')[0]).getTime();
  const diffDays = Math.ceil((expiryTime - todayTime) / (1000 * 60 * 60 * 24));
  return diffDays;
}
