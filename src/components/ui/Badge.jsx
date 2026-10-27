const TONES = {
  brand: 'bg-brand-50 text-brand-700 ring-brand-100',
  amber: 'bg-amber-400/15 text-amber-600 ring-amber-400/30',
  ice: 'bg-ice-100 text-brand-600 ring-ice-200',
  white: 'bg-white/90 text-brand-800 ring-white',
};

export function Badge({ tone = 'brand', className = '', children }) {
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium ring-1 ring-inset ${TONES[tone]} ${className}`}>
      {children}
    </span>
  );
}
