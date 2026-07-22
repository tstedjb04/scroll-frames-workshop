import { ScrollCanvas } from "@/components/ScrollCanvas/ScrollCanvas";

export default function HomePage() {
  return (
    <main>
      <header className="px-6 py-16 text-center text-white">
        <h1 className="text-3xl font-semibold">Scroll Frames Lab</h1>
        <p className="mt-3 text-white/70">
          Fix the TODO in <code>src/lib/scrollFrames.ts</code> so scrubbing
          works.
        </p>
      </header>
      <ScrollCanvas />
      <footer className="px-6 py-24 text-center text-white/50">
        End of sequence — try stretch goals in WORKSHOP.md
      </footer>
    </main>
  );
}
