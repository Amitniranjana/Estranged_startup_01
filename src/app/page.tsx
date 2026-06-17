import { ExifViewer } from "@/components/exif-viewer/ExifViewer";

export default function Home() {
  return (
    <div className="relative min-h-full flex-1 overflow-hidden bg-zinc-950">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(139,92,246,0.15)_0%,_transparent_50%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 top-1/3 h-96 w-96 rounded-full bg-violet-600/10 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 bottom-1/4 h-80 w-80 rounded-full bg-blue-600/10 blur-3xl"
      />

      <main className="relative px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <ExifViewer />
      </main>

      <footer className="relative border-t border-zinc-900 px-4 py-6 text-center text-xs text-zinc-600">
        Images are processed locally in your browser. No data is sent to any server.
      </footer>
    </div>
  );
}
