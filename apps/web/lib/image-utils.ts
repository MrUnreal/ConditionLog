/**
 * Client-side image utilities: validation, compression, and EXIF extraction.
 * No external dependencies — uses browser APIs only.
 */

// ---- Validation ----

const ALLOWED_TYPES = new Set([
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
]);

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20MB raw input (will be compressed)
const MAX_DIMENSION = 3840; // 4K max
const COMPRESSION_QUALITY = 0.82;
const TARGET_MAX_SIZE = 2 * 1024 * 1024; // Compress to ~2MB

export interface ValidationResult {
  valid: boolean;
  error?: string;
}

export function validateImageFile(file: File): ValidationResult {
  if (!file.type.startsWith('image/') && !ALLOWED_TYPES.has(file.type)) {
    return { valid: false, error: `"${file.name}" is not a supported image format. Use JPEG, PNG, or WebP.` };
  }

  if (file.size > MAX_FILE_SIZE) {
    const sizeMB = (file.size / 1024 / 1024).toFixed(1);
    return { valid: false, error: `"${file.name}" is ${sizeMB}MB — exceeds the 20MB limit.` };
  }

  if (file.size === 0) {
    return { valid: false, error: `"${file.name}" is empty.` };
  }

  return { valid: true };
}

// ---- EXIF Extraction ----

export interface ExifData {
  dateTaken: string | null;
  latitude: number | null;
  longitude: number | null;
  orientation: number;
}

/**
 * Extract basic EXIF data (date, GPS, orientation) from a JPEG file.
 * Uses raw ArrayBuffer parsing — no external library needed.
 */
export async function extractExif(file: File): Promise<ExifData> {
  const result: ExifData = { dateTaken: null, latitude: null, longitude: null, orientation: 1 };

  if (!file.type.includes('jpeg') && !file.type.includes('jpg')) {
    return result;
  }

  try {
    const buffer = await file.slice(0, 128 * 1024).arrayBuffer(); // Read first 128KB
    const view = new DataView(buffer);

    // Check JPEG SOI marker
    if (view.getUint16(0) !== 0xFFD8) return result;

    let offset = 2;
    while (offset < view.byteLength - 2) {
      const marker = view.getUint16(offset);

      // APP1 marker (EXIF)
      if (marker === 0xFFE1) {
        const length = view.getUint16(offset + 2);
        const exifOffset = offset + 4;

        // Check "Exif\0\0"
        if (
          view.getUint32(exifOffset) === 0x45786966 &&
          view.getUint16(exifOffset + 4) === 0x0000
        ) {
          const tiffOffset = exifOffset + 6;
          const isLittleEndian = view.getUint16(tiffOffset) === 0x4949;

          parseIFD(view, tiffOffset, tiffOffset + view.getUint32(tiffOffset + 4, isLittleEndian), isLittleEndian, result);
        }
        offset += 2 + length;
      } else if ((marker & 0xFF00) === 0xFF00) {
        offset += 2 + view.getUint16(offset + 2);
      } else {
        break;
      }
    }
  } catch {
    // EXIF parsing is best-effort
  }

  return result;
}

function parseIFD(view: DataView, tiffOffset: number, ifdOffset: number, le: boolean, result: ExifData) {
  try {
    if (ifdOffset + 2 > view.byteLength) return;
    const entries = view.getUint16(ifdOffset, le);

    for (let i = 0; i < entries; i++) {
      const entryOffset = ifdOffset + 2 + i * 12;
      if (entryOffset + 12 > view.byteLength) break;

      const tag = view.getUint16(entryOffset, le);

      // Orientation
      if (tag === 0x0112) {
        result.orientation = view.getUint16(entryOffset + 8, le);
      }

      // ExifIFDPointer
      if (tag === 0x8769) {
        const subIfdOffset = tiffOffset + view.getUint32(entryOffset + 8, le);
        parseExifSubIFD(view, tiffOffset, subIfdOffset, le, result);
      }

      // GPSInfoIFDPointer
      if (tag === 0x8825) {
        const gpsOffset = tiffOffset + view.getUint32(entryOffset + 8, le);
        parseGpsIFD(view, tiffOffset, gpsOffset, le, result);
      }
    }
  } catch {
    // Best effort
  }
}

function parseExifSubIFD(view: DataView, tiffOffset: number, ifdOffset: number, le: boolean, result: ExifData) {
  try {
    if (ifdOffset + 2 > view.byteLength) return;
    const entries = view.getUint16(ifdOffset, le);

    for (let i = 0; i < entries; i++) {
      const entryOffset = ifdOffset + 2 + i * 12;
      if (entryOffset + 12 > view.byteLength) break;

      const tag = view.getUint16(entryOffset, le);

      // DateTimeOriginal (0x9003) or DateTimeDigitized (0x9004)
      if (tag === 0x9003 || tag === 0x9004) {
        if (!result.dateTaken) {
          const count = view.getUint32(entryOffset + 4, le);
          if (count <= 20) {
            const strOffset = tiffOffset + view.getUint32(entryOffset + 8, le);
            if (strOffset + count <= view.byteLength) {
              const bytes = new Uint8Array(view.buffer, strOffset, count - 1);
              const dateStr = new TextDecoder().decode(bytes);
              // Format: "2025:01:15 14:30:00" → "2025-01-15T14:30:00"
              result.dateTaken = dateStr.replace(/^(\d{4}):(\d{2}):(\d{2})/, '$1-$2-$3').replace(' ', 'T');
            }
          }
        }
      }
    }
  } catch {
    // Best effort
  }
}

function parseGpsIFD(view: DataView, tiffOffset: number, ifdOffset: number, le: boolean, result: ExifData) {
  try {
    if (ifdOffset + 2 > view.byteLength) return;
    const entries = view.getUint16(ifdOffset, le);

    let latRef = 'N';
    let lonRef = 'E';
    let latVals: number[] | null = null;
    let lonVals: number[] | null = null;

    for (let i = 0; i < entries; i++) {
      const entryOffset = ifdOffset + 2 + i * 12;
      if (entryOffset + 12 > view.byteLength) break;

      const tag = view.getUint16(entryOffset, le);

      // GPSLatitudeRef
      if (tag === 0x0001) {
        latRef = String.fromCharCode(view.getUint8(entryOffset + 8));
      }
      // GPSLongitudeRef
      if (tag === 0x0003) {
        lonRef = String.fromCharCode(view.getUint8(entryOffset + 8));
      }
      // GPSLatitude
      if (tag === 0x0002) {
        latVals = readRationals(view, tiffOffset + view.getUint32(entryOffset + 8, le), 3, le);
      }
      // GPSLongitude
      if (tag === 0x0004) {
        lonVals = readRationals(view, tiffOffset + view.getUint32(entryOffset + 8, le), 3, le);
      }
    }

    if (latVals && latVals.length === 3) {
      result.latitude = (latVals[0]! + latVals[1]! / 60 + latVals[2]! / 3600) * (latRef === 'S' ? -1 : 1);
    }
    if (lonVals && lonVals.length === 3) {
      result.longitude = (lonVals[0]! + lonVals[1]! / 60 + lonVals[2]! / 3600) * (lonRef === 'W' ? -1 : 1);
    }
  } catch {
    // Best effort
  }
}

function readRationals(view: DataView, offset: number, count: number, le: boolean): number[] {
  const vals: number[] = [];
  for (let i = 0; i < count; i++) {
    const o = offset + i * 8;
    if (o + 8 > view.byteLength) break;
    const num = view.getUint32(o, le);
    const den = view.getUint32(o + 4, le);
    vals.push(den === 0 ? 0 : num / den);
  }
  return vals;
}

// ---- Image Compression ----

/**
 * Compress and resize an image file using the Canvas API.
 * Returns a new File object (JPEG) that is ≤ TARGET_MAX_SIZE.
 */
export async function compressImage(file: File): Promise<File> {
  // Skip if already small enough and is JPEG
  if (file.size <= TARGET_MAX_SIZE && file.type === 'image/jpeg') {
    return file;
  }

  const bitmap = await createImageBitmap(file);
  let { width, height } = bitmap;

  // Scale down if exceeding max dimension
  if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
    const scale = MAX_DIMENSION / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = new OffscreenCanvas(width, height);
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context unavailable');

  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  // Try standard quality first
  let blob = await canvas.convertToBlob({ type: 'image/jpeg', quality: COMPRESSION_QUALITY });

  // If still too large, reduce quality iteratively
  let quality = COMPRESSION_QUALITY;
  while (blob.size > TARGET_MAX_SIZE && quality > 0.3) {
    quality -= 0.1;
    blob = await canvas.convertToBlob({ type: 'image/jpeg', quality });
  }

  // Preserve original name but change extension
  const name = file.name.replace(/\.[^.]+$/, '.jpg');
  return new File([blob], name, { type: 'image/jpeg', lastModified: Date.now() });
}
