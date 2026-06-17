"use client";

import {
  ExternalLink,
  MapPin,
  Navigation,
  AlertCircle,
} from "lucide-react";

import { LocationMap } from "./LocationMap";

import {
  formatDecimalCoordinates,
  formatDmsCoordinates,
  getGoogleMapsUrl,
  getOpenStreetMapUrl,
} from "@/lib/coordinates";

interface LocationSectionProps {
  latitude: number | null;
  longitude: number | null;
}

export function LocationSection({ latitude, longitude }: LocationSectionProps) {
  const hasGps = latitude !== null && longitude !== null;

  return (
    <section className="overflow-hidden rounded-2xl border border-emerald-500/25 bg-gradient-to-br from-emerald-950/30 via-zinc-900/80 to-zinc-900/60">
      <div className="flex items-center gap-3 border-b border-emerald-500/20 px-5 py-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 ring-1 ring-emerald-500/30">
          <MapPin className="h-5 w-5 text-emerald-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-zinc-100">Location</h3>
          <p className="text-sm text-zinc-400">
            GPS coordinates embedded in the photo
          </p>
        </div>
      </div>

      {hasGps ? (
        <div className="space-y-5 p-5">
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-emerald-400/80">
                Latitude
              </p>
              <p className="mt-1 text-lg font-semibold text-zinc-100">
                {latitude.toFixed(6)}°
              </p>
            </div>
            <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-emerald-400/80">
                Longitude
              </p>
              <p className="mt-1 text-lg font-semibold text-zinc-100">
                {longitude.toFixed(6)}°
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900/50 p-4">
            <div className="mb-2 flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-zinc-500">
              <Navigation className="h-3.5 w-3.5" />
              Coordinates
            </div>
            <p className="text-sm font-medium text-zinc-100">
              {formatDecimalCoordinates(latitude, longitude)}
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              {formatDmsCoordinates(latitude, longitude)}
            </p>
          </div>

          <LocationMap latitude={latitude} longitude={longitude} />

          <div className="flex flex-wrap gap-3">
            <a
              href={getGoogleMapsUrl(latitude, longitude)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:border-emerald-500/40 hover:bg-zinc-800"
            >
              Open in Google Maps
              <ExternalLink className="h-4 w-4 text-emerald-400" />
            </a>
            <a
              href={getOpenStreetMapUrl(latitude, longitude)}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:border-emerald-500/40 hover:bg-zinc-800"
            >
              Open in OpenStreetMap
              <ExternalLink className="h-4 w-4 text-emerald-400" />
            </a>
          </div>
        </div>
      ) : (
        <div className="flex gap-3 p-5">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
          <div>
            <p className="font-medium text-amber-200">No location data found</p>
            <p className="mt-1 text-sm leading-relaxed text-zinc-400">
              This photo has no GPS coordinates. Location is only saved when
              your camera or phone had location services enabled at capture
              time. Shared or edited images from WhatsApp, Instagram, and
              similar apps usually have location stripped out.
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
