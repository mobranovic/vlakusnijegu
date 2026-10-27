import { BRAND, OWNER } from '../data/company.js';

// Znak: planine sa snijegom i vlak koji prolazi ispod vrhova
export function LogoMark({ className = 'h-10 w-10' }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <rect width="40" height="40" rx="11" fill="#103A6E" />
      <path d="M5 27 L14 14 L19 20 L24 13 L35 27 Z" fill="#EAF4FB" />
      <path d="M14 14 L11.4 17.8 L14 17 L16.3 18.2 Z M24 13 L21.2 17 L24 16.2 L26.6 17.3 Z" fill="#7FA9D9" />
      <rect x="9" y="27.5" width="19" height="5" rx="1.6" fill="#EE8E1A" />
      <rect x="28.5" y="25.5" width="3.5" height="7" rx="1" fill="#EE8E1A" />
      <circle cx="13" cy="34" r="1.6" fill="#EAF4FB" />
      <circle cx="20" cy="34" r="1.6" fill="#EAF4FB" />
      <circle cx="27" cy="34" r="1.6" fill="#EAF4FB" />
    </svg>
  );
}

export function Logo({ dark, withOwner }) {
  return (
    <span className="flex items-center gap-3">
      <LogoMark />
      <span className="leading-tight">
        <span className={`block font-display text-lg font-bold ${dark ? 'text-white' : 'text-brand-900'}`}>{BRAND.name}</span>
        <span className={`block text-[11px] font-medium ${dark ? 'text-brand-200' : 'text-slate-500'}`}>
          {withOwner ? `${BRAND.tagline} · ${OWNER.name}` : BRAND.tagline}
        </span>
      </span>
    </span>
  );
}
