import { AssetCategory } from '../types/asset';

// High-fidelity category photos generated for UPKS lab
import instrumentsImg from '../assets/images/category_instruments_1794452158003.jpg';
import furnitureImg from '../assets/images/category_furniture_1794452241852.jpg';
import computerImg from '../assets/images/category_computer_1794452256986.jpg';
import chemicalImg from '../assets/images/category_chemical_1794452275653.jpg';

export const CATEGORY_IMAGE_MAP: Record<AssetCategory, string> = {
  'Instruments': instrumentsImg,
  'Perabot': furnitureImg,
  'Barangan Komputer': computerImg,
  'Peralatan Test Chemical': chemicalImg,
};

export function getCategoryImageUrl(category: AssetCategory): string {
  return CATEGORY_IMAGE_MAP[category] || instrumentsImg;
}

export function getAssetDisplayImage(asset: { category: AssetCategory; imageUrl?: string }): string {
  return asset.imageUrl?.trim() || getCategoryImageUrl(asset.category);
}
