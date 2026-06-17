"use client";

import { ExternalLink, MapPin } from "lucide-react";

interface LocationMapProps {
  latitude: number;
  longitude: number;
}

export function LocationMap({ latitude, longitude }: LocationMapProps) {
  const delta = 0.015;
  const bbox = [
    longitude - delta,
    latitude - delta,
    longitude + delta,
    latitude + delta,
  ].join(",");

  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${latitude}%2C${longitude}`;
  const openUrl = `https://www.openstreetmap.org/?mlat=${latitude}&mlon=${longitude}#map=15/${latitude}/${longitude}`;

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60">
      <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-medium text-zinc-200">
          <MapPin className="h-4 w-4 text-emerald-400" />
          Photo location
        </div>
        <a
          href={openUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs text-violet-400 transition-colors hover:text-violet-300"
        >
          Open in OpenStreetMap
          <ExternalLink className="h-3 w-3" />
        </a>
      </div>
      <iframe
        title="Photo location map"
        src={embedUrl}
        className="h-64 w-full border-0"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <div className="border-t border-zinc-800 px-4 py-2 text-xs text-zinc-500">
        {latitude.toFixed(6)}, {longitude.toFixed(6)}
      </div>
    </div>
  );
}
