"use client";

import {
  AlertCircle,
  Calendar,
  Camera,
  Info,
  MapPin,
  Maximize2,
  Smartphone,
} from "lucide-react";

import { LocationMap } from "./LocationMap";

import type { ParsedExifData } from "@/lib/types";

interface ExifResultsProps {
  previewUrl: string;
  fileName: string;
  data: ParsedExifData;
}

interface MetadataItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

function MetadataItem({ icon, label, value }: MetadataItemProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4 transition-colors hover:border-zinc-700">
      <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
        {icon}
        {label}
      </div>
      <p className="text-sm font-medium leading-relaxed text-zinc-100">{value}</p>
    </div>
  );
}

function MissingValue({ label }: { label: string }) {
  return (
    <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 p-4">
      <p className="text-xs font-medium uppercase tracking-wider text-zinc-600">
        {label}
      </p>
      <p className="mt-1 text-sm text-zinc-500">Not available</p>
    </div>
  );
}

export function ExifResults({ previewUrl, fileName, data }: ExifResultsProps) {
  const hasGps = data.latitude !== null && data.longitude !== null;
  const hasAnyMetadata =
    data.make ||
    data.model ||
    data.dateTime ||
    data.width ||
    data.height ||
    hasGps;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
        <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/60">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={previewUrl}
            alt={`Preview of ${fileName}`}
            className="aspect-square w-full object-cover"
          />
          <div className="border-t border-zinc-800 px-4 py-3">
            <p className="truncate text-sm font-medium text-zinc-200">{fileName}</p>
            {data.width && data.height ? (
              <p className="mt-1 text-xs text-zinc-500">
                {data.width} × {data.height} px
              </p>
            ) : null}
          </div>
        </div>

        <div className="space-y-4">
          {!data.hasExif || !hasAnyMetadata ? (
            <div className="flex gap-3 rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
              <div>
                <p className="font-medium text-amber-200">No EXIF metadata found</p>
                <p className="mt-1 text-sm leading-relaxed text-amber-100/80">
                  This image doesn&apos;t contain readable EXIF data. Photos shared
                  through WhatsApp, Instagram, Facebook, and most messaging apps
                  have their metadata stripped for privacy. Try an original photo
                  straight from your camera or phone gallery.
                </p>
              </div>
            </div>
          ) : (
            <div className="flex gap-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
              <p className="text-sm text-emerald-100/90">
                EXIF metadata extracted locally. Your image never left your device.
              </p>
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            {data.make ? (
              <MetadataItem
                icon={<Smartphone className="h-3.5 w-3.5" />}
                label="Make (Brand)"
                value={data.make}
              />
            ) : (
              <MissingValue label="Make (Brand)" />
            )}

            {data.model ? (
              <MetadataItem
                icon={<Camera className="h-3.5 w-3.5" />}
                label="Model"
                value={data.model}
              />
            ) : (
              <MissingValue label="Model" />
            )}

            {data.dateTime ? (
              <MetadataItem
                icon={<Calendar className="h-3.5 w-3.5" />}
                label="Date & Time"
                value={data.dateTime}
              />
            ) : (
              <MissingValue label="Date & Time" />
            )}

            {data.width && data.height ? (
              <MetadataItem
                icon={<Maximize2 className="h-3.5 w-3.5" />}
                label="Dimensions"
                value={`${data.width} × ${data.height} pixels`}
              />
            ) : (
              <MissingValue label="Dimensions" />
            )}
          </div>

          {hasGps ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <MetadataItem
                icon={<MapPin className="h-3.5 w-3.5" />}
                label="Latitude"
                value={data.latitude!.toFixed(6)}
              />
              <MetadataItem
                icon={<MapPin className="h-3.5 w-3.5" />}
                label="Longitude"
                value={data.longitude!.toFixed(6)}
              />
            </div>
          ) : null}
        </div>
      </div>

      {hasGps ? (
        <LocationMap latitude={data.latitude!} longitude={data.longitude!} />
      ) : null}
    </div>
  );
}
