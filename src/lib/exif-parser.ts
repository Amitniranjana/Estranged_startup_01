import ExifReader, { type ExpandedTags } from "exifreader";

import type { ParsedExifData } from "./types";

const ACCEPTED_MIME_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
]);

const ACCEPTED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

interface TagWithDescription {
  description?: string;
}

function getExifDescription(tags: ExpandedTags, key: string): string | null {
  const tag = tags.exif?.[
    key as keyof NonNullable<ExpandedTags["exif"]>
  ] as TagWithDescription | undefined;
  if (!tag || typeof tag.description !== "string") return null;
  const value = tag.description.trim();
  return value.length > 0 ? value : null;
}

function formatExifDate(raw: string): string {
  const normalized = raw.replace(/^(\d{4}):(\d{2}):(\d{2})/, "$1-$2-$3");
  const date = new Date(normalized);

  if (Number.isNaN(date.getTime())) return raw;

  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "full",
    timeStyle: "medium",
  }).format(date);
}

function extractDateTime(tags: ExpandedTags): string | null {
  const raw =
    getExifDescription(tags, "DateTimeOriginal") ??
    getExifDescription(tags, "DateTime") ??
    getExifDescription(tags, "CreateDate");

  return raw ? formatExifDate(raw) : null;
}

function extractDimensions(tags: ExpandedTags): {
  width: number | null;
  height: number | null;
} {
  const width =
    tags.exif?.PixelXDimension?.value ??
    tags.exif?.ImageWidth?.value ??
    tags.file?.["Image Width"]?.value ??
    tags.pngFile?.["Image Width"]?.value ??
    null;

  const height =
    tags.exif?.PixelYDimension?.value ??
    tags.exif?.ImageLength?.value ??
    tags.file?.["Image Height"]?.value ??
    tags.pngFile?.["Image Height"]?.value ??
    null;

  return { width, height };
}

function extractGps(tags: ExpandedTags): {
  latitude: number | null;
  longitude: number | null;
} {
  const latitude = tags.gps?.Latitude ?? null;
  const longitude = tags.gps?.Longitude ?? null;

  if (
    typeof latitude === "number" &&
    typeof longitude === "number" &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude)
  ) {
    return { latitude, longitude };
  }

  return { latitude: null, longitude: null };
}

function hasMeaningfulExif(tags: ExpandedTags): boolean {
  return Boolean(
    tags.exif &&
      Object.keys(tags.exif).length > 0 &&
      (getExifDescription(tags, "Make") ||
        getExifDescription(tags, "Model") ||
        extractDateTime(tags) ||
        tags.gps?.Latitude !== undefined)
  );
}

export function isAcceptedImageFile(file: File): boolean {
  if (ACCEPTED_MIME_TYPES.has(file.type)) return true;

  const extension = file.name
    .slice(file.name.lastIndexOf("."))
    .toLowerCase();

  return ACCEPTED_EXTENSIONS.has(extension);
}

export function readFileAsArrayBuffer(file: File): Promise<ArrayBuffer> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (reader.result instanceof ArrayBuffer) {
        resolve(reader.result);
        return;
      }
      reject(new Error("Unexpected file read result"));
    };
    reader.onerror = () => reject(new Error("Failed to read the image file"));
    reader.readAsArrayBuffer(file);
  });
}

export function readImageDimensions(
  file: File
): Promise<{ width: number; height: number }> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      resolve({ width: image.naturalWidth, height: image.naturalHeight });
      URL.revokeObjectURL(url);
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image preview"));
    };

    image.src = url;
  });
}

export async function parseExifFromFile(file: File): Promise<ParsedExifData> {
  const [buffer, dimensions] = await Promise.all([
    readFileAsArrayBuffer(file),
    readImageDimensions(file),
  ]);

  try {
    const tags = ExifReader.load(buffer, { expanded: true });
    const exifDimensions = extractDimensions(tags);
    const { latitude, longitude } = extractGps(tags);

    return {
      make: getExifDescription(tags, "Make"),
      model: getExifDescription(tags, "Model"),
      dateTime: extractDateTime(tags),
      width: exifDimensions.width ?? dimensions.width,
      height: exifDimensions.height ?? dimensions.height,
      latitude,
      longitude,
      hasExif: hasMeaningfulExif(tags),
    };
  } catch {
    return {
      make: null,
      model: null,
      dateTime: null,
      width: dimensions.width,
      height: dimensions.height,
      latitude: null,
      longitude: null,
      hasExif: false,
    };
  }
}
