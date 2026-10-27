import { Castle, Landmark, MountainSnow, Ship, Trees, Waves } from 'lucide-react';

const ICONS = { castle: Castle, landmark: Landmark, 'mountain-snow': MountainSnow, ship: Ship, trees: Trees, waves: Waves };

// Rezervirano mjesto za fotografiju programa: gradijent, silueta planina i ikona destinacije.
export function TripImage({ image, className = '' }) {
  const Icon = ICONS[image.icon] ?? MountainSnow;
  return (
    <div
      className={`relative overflow-hidden ${className}`}
      style={{ background: `linear-gradient(135deg, ${image.from}, ${image.to})` }}
      role="img"
      aria-label="Mjesto za fotografiju programa"
    >
      <svg className="absolute inset-x-0 bottom-0 h-1/2 w-full" viewBox="0 0 400 100" preserveAspectRatio="none" aria-hidden>
        <path d="M0 100 L0 60 L70 20 L120 55 L190 5 L260 60 L320 30 L400 70 L400 100 Z" fill="rgba(255,255,255,0.12)" />
        <path d="M0 100 L0 80 L90 45 L160 80 L240 40 L330 85 L400 60 L400 100 Z" fill="rgba(255,255,255,0.18)" />
      </svg>
      <Icon className="absolute left-1/2 top-[38%] h-12 w-12 -translate-x-1/2 -translate-y-1/2 text-white/85" strokeWidth={1.5} />
    </div>
  );
}
