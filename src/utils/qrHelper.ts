import QRCode from 'qrcode';
import { Asset } from '../types/asset';

export function getAssetQRPayload(asset: Asset): string {
  // Use structured payload that can be parsed or matched by registrationNo or ID
  return `UPKS:${asset.registrationNo}`;
}

export async function generateQRCodeDataUrl(payload: string): Promise<string> {
  try {
    return await QRCode.toDataURL(payload, {
      width: 280,
      margin: 1,
      color: {
        dark: '#0F2942', // UPKS Navy primary
        light: '#FFFFFF'
      },
      errorCorrectionLevel: 'M'
    });
  } catch (err) {
    console.error('Failed to generate QR code', err);
    return '';
  }
}

export function parseScannedQRData(scannedText: string): string {
  const trimmed = scannedText.trim();
  if (trimmed.startsWith('UPKS:')) {
    return trimmed.replace('UPKS:', '').trim();
  }
  // If it's a URL
  try {
    if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
      const url = new URL(trimmed);
      const reg = url.searchParams.get('reg') || url.searchParams.get('asset');
      if (reg) return reg;
    }
  } catch {
    // not a valid URL, continue
  }
  return trimmed;
}
