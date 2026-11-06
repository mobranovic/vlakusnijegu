import { TERRA_LOGO } from './terraLogoPaths.js';

/** Primarni logo Terra Pomalo (oblici iz Knjige standarda, boja = currentColor); najmanje 230 px širine. */
export function TerraLogo({ className = '' }) {
  return (
    <svg viewBox={TERRA_LOGO.viewBox} className={className} fill="currentColor" role="img" aria-label="Terra Pomalo" focusable="false">
      {TERRA_LOGO.paths.map((d, i) => <path key={i} d={d} />)}
    </svg>
  );
}
