const VARIANTS = {
  primary: 'bg-amber-500 text-brand-900 hover:bg-amber-400 focus-visible:ring-amber-500',
  brand: 'bg-brand-700 text-white hover:bg-brand-600 focus-visible:ring-brand-500',
  outline: 'border border-brand-200 bg-white text-brand-700 hover:bg-brand-50 focus-visible:ring-brand-400',
  ghost: 'text-brand-700 hover:bg-brand-50 focus-visible:ring-brand-400',
  light: 'bg-white/10 text-white ring-1 ring-white/30 hover:bg-white/20 focus-visible:ring-white',
};
const SIZES = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-5 text-sm',
  lg: 'h-12 px-6 text-base',
};

export function Button({ variant = 'primary', size = 'md', className = '', as: Tag = 'button', ...props }) {
  return (
    <Tag
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 ${VARIANTS[variant]} ${SIZES[size]} ${className}`}
      {...(Tag === 'button' && !props.type ? { type: 'button' } : {})}
      {...props}
    />
  );
}
