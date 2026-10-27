export function SectionHeader({ eyebrow, title, children, center, dark }) {
  return (
    <div className={`max-w-2xl ${center ? 'mx-auto text-center' : ''}`}>
      {eyebrow && (
        <p className={`text-sm font-semibold uppercase tracking-wider ${dark ? 'text-amber-400' : 'text-amber-600'}`}>{eyebrow}</p>
      )}
      <h2 className={`mt-2 font-display text-3xl font-bold sm:text-4xl ${dark ? 'text-white' : 'text-brand-900'}`}>{title}</h2>
      {children && <p className={`mt-4 text-base sm:text-lg ${dark ? 'text-brand-100' : 'text-slate-600'}`}>{children}</p>}
    </div>
  );
}
