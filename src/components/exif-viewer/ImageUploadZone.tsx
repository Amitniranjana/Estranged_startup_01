"use client";

import { ImageUp, Upload } from "lucide-react";
import { useCallback, useRef, useState } from "react";

interface ImageUploadZoneProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export function ImageUploadZone({
  onFileSelect,
  disabled = false,
}: ImageUploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = useCallback(
    (file: File | undefined) => {
      if (file) onFileSelect(file);
    },
    [onFileSelect]
  );

  const handleDragOver = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      if (!disabled) setIsDragging(true);
    },
    [disabled]
  );

  const handleDragLeave = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
    },
    []
  );

  const handleDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      setIsDragging(false);
      if (disabled) return;
      handleFile(event.dataTransfer.files[0]);
    },
    [disabled, handleFile]
  );

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label="Upload an image to view EXIF metadata"
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          if (!disabled) inputRef.current?.click();
        }
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={[
        "group relative cursor-pointer rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-300",
        "bg-zinc-900/40 backdrop-blur-sm",
        isDragging
          ? "border-violet-400 bg-violet-500/10 shadow-[0_0_40px_rgba(139,92,246,0.25)]"
          : "border-zinc-700 hover:border-violet-500/60 hover:bg-zinc-900/60",
        disabled ? "pointer-events-none opacity-50" : "",
      ].join(" ")}
    >
      <input
        ref={inputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        className="hidden"
        disabled={disabled}
        onChange={(event) => {
          handleFile(event.target.files?.[0]);
          event.target.value = "";
        }}
      />

      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-violet-500/15 ring-1 ring-violet-500/30 transition-transform group-hover:scale-105">
        {isDragging ? (
          <ImageUp className="h-8 w-8 text-violet-400" />
        ) : (
          <Upload className="h-8 w-8 text-violet-400" />
        )}
      </div>

      <h2 className="text-lg font-semibold text-zinc-100">
        Drop your image here
      </h2>
      <p className="mt-2 text-sm text-zinc-400">
        or click to browse — JPG, PNG, or WebP
      </p>
      <p className="mt-4 text-xs text-zinc-500">
        Processed entirely in your browser. Nothing is uploaded.
      </p>
    </div>
  );
}
