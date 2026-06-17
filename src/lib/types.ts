export interface ParsedExifData {
  make: string | null;
  model: string | null;
  dateTime: string | null;
  width: number | null;
  height: number | null;
  latitude: number | null;
  longitude: number | null;
  hasExif: boolean;
}

export type UploadErrorType = "invalid-file" | "read-error" | "parse-error";

export interface UploadError {
  type: UploadErrorType;
  message: string;
}
