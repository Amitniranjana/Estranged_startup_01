"use client";

import { MapPin } from "lucide-react";

interface LocationMapProps {
  latitude: number;
  longitude: number;
}

export function LocationMap({ latitude, longitude }: LocationMapProps) {
  const delta = 0.012;
  const bbox = [
    longitude - delta,
    latitude - delta,
    longitude + delta,
    latitude + delta,
  ].join(",");

  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${latitude}%2C${longitude}`;
  const googleEmbedUrl = `https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`;

  return (
    <div className="overflow-hidden rounded-xl border border-zinc-800 bg-zinc-900/60">
      <div className="flex items-center gap-2 border-b border-zinc-800 px-4 py-3 text-sm font-medium text-zinc-200">
        <MapPin className="h-4 w-4 text-emerald-400" />
        Map preview
      </div>
      <div className="grid lg:grid-cols-2">
        <iframe
          title="OpenStreetMap location preview"
          src={embedUrl}
          className="h-72 w-full border-0 lg:h-80"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <iframe
          title="Google Maps location preview"
          src={googleEmbedUrl}
          className="h-72 w-full border-0 border-t border-zinc-800 lg:h-80 lg:border-l lg:border-t-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
