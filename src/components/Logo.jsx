import { BRAND } from '../data/company.js';
import { useT } from '../i18n/index.jsx';

// Znak: školsko zvono koje najavljuje veliki odmor
export function LogoMark({ className = 'h-10 w-10' }) {
  return (
    <svg viewBox="0 0 40 40" className={className} aria-hidden>
      <rect width="40" height="40" rx="11" fill="#103A6E" />
      <path d="M8 13.5 Q5.5 9.5 8.5 7 M32 13.5 Q34.5 9.5 31.5 7" stroke="#7FA9D9" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <path d="M20 8.5a8.5 8.5 0 0 0-8.5 8.5v6.2L9 27.5h22l-2.5-4.3V17A8.5 8.5 0 0 0 20 8.5z" fill="#EE8E1A" />
      <path d="M15.5 16.5a4.5 4.5 0 0 1 4.5-4.5" stroke="#F7C77E" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <rect x="8.5" y="27" width="23" height="2.4" rx="1.2" fill="#D07410" />
      <circle cx="20" cy="32.5" r="2.6" fill="#EAF4FB" />
    </svg>
  );
}

export function Logo({ dark }) {
  const t = useT();
  return (
    <span className="flex items-center gap-3">
      <LogoMark />
      <span className="leading-tight">
        <span className={`block font-display text-lg font-bold ${dark ? 'text-white' : 'text-brand-900'}`}>{BRAND}</span>
        <span className={`block text-[11px] font-medium ${dark ? 'text-brand-200' : 'text-slate-500'}`}>{t.ui.tagline}</span>
      </span>
    </span>
  );
}
