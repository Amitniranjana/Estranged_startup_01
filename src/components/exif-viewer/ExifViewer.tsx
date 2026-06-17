"use client";

import { Loader2, ScanSearch, XCircle } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

import { ExifResults } from "./ExifResults";
import { ImageUploadZone } from "./ImageUploadZone";

import { isAcceptedImageFile, parseExifFromFile } from "@/lib/exif-parser";

import type { ParsedExifData, UploadError } from "@/lib/types";

type ViewState =
  | { status: "idle" }
  | { status: "loading"; fileName: string }
  | {
      status: "success";
      fileName: string;
      previewUrl: string;
      data: ParsedExifData;
    }
  | { status: "error"; error: UploadError };

export function ExifViewer() {
  const [viewState, setViewState] = useState<ViewState>({ status: "idle" });

  useEffect(() => {
    return () => {
      if (viewState.status === "success") {
        URL.revokeObjectURL(viewState.previewUrl);
      }
    };
  }, [viewState]);

  const handleFileSelect = useCallback(async (file: File) => {
    if (!isAcceptedImageFile(file)) {
      setViewState({
        status: "error",
        error: {
          type: "invalid-file",
          message:
            "Please upload a valid image file (.jpg, .jpeg, .png, or .webp).",
        },
      });
      return;
    }

    setViewState({ status: "loading", fileName: file.name });

    try {
      const [data, previewUrl] = await Promise.all([
        parseExifFromFile(file),
        Promise.resolve(URL.createObjectURL(file)),
      ]);

      setViewState((previous) => {
        if (previous.status === "success") {
          URL.revokeObjectURL(previous.previewUrl);
        }
        return {
          status: "success",
          fileName: file.name,
          previewUrl,
          data,
        };
      });
    } catch {
      setViewState({
        status: "error",
        error: {
          type: "read-error",
          message:
            "We couldn't read this image. The file may be corrupted or unsupported.",
        },
      });
    }
  }, []);

  const reset = useCallback(() => {
    setViewState((previous) => {
      if (previous.status === "success") {
        URL.revokeObjectURL(previous.previewUrl);
      }
      return { status: "idle" };
    });
  }, []);

  return (
    <div className="mx-auto w-full max-w-5xl space-y-8">
      <header className="text-center">
        <div className="mx-auto mb-4 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-4 py-1.5 text-sm text-violet-300">
          <ScanSearch className="h-4 w-4" />
          Client-side only
        </div>
        <h1 className="bg-gradient-to-br from-zinc-50 via-zinc-200 to-zinc-400 bg-clip-text text-4xl font-bold tracking-tight text-transparent sm:text-5xl">
          EXIF Data Viewer
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-zinc-400">
          Upload a photo to reveal hidden metadata — camera details, capture
          time, dimensions, and GPS location. Everything stays on your device.
        </p>
      </header>

      {viewState.status !== "success" ? (
        <ImageUploadZone
          onFileSelect={handleFileSelect}
          disabled={viewState.status === "loading"}
        />
      ) : null}

      {viewState.status === "loading" ? (
        <div className="flex items-center justify-center gap-3 rounded-xl border border-zinc-800 bg-zinc-900/50 py-8 text-zinc-300">
          <Loader2 className="h-5 w-5 animate-spin text-violet-400" />
          Reading metadata from {viewState.fileName}…
        </div>
      ) : null}

      {viewState.status === "error" ? (
        <div className="flex gap-3 rounded-xl border border-red-500/30 bg-red-500/10 p-4">
          <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
          <div>
            <p className="font-medium text-red-200">Upload failed</p>
            <p className="mt-1 text-sm text-red-100/80">{viewState.error.message}</p>
          </div>
        </div>
      ) : null}

      {viewState.status === "success" ? (
        <div className="space-y-4">
          <div className="flex justify-end">
            <button
              type="button"
              onClick={reset}
              className="rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:border-zinc-600 hover:bg-zinc-800 hover:text-zinc-100"
            >
              Upload another image
            </button>
          </div>
          <ExifResults
            previewUrl={viewState.previewUrl}
            fileName={viewState.fileName}
            data={viewState.data}
          />
        </div>
      ) : null}
    </div>
  );
}
