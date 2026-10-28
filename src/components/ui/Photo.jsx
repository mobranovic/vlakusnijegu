const BASE = import.meta.env.BASE_URL;

/** Fotografija iz public/images (WebP uz JPG kao pričuvu). */
export function Photo({ name, alt, className = '', eager }) {
  return (
    <picture>
      <source srcSet={`${BASE}images/${name}.webp`} type="image/webp" />
      <img
        src={`${BASE}images/${name}.jpg`}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        className={`h-full w-full object-cover ${className}`}
      />
    </picture>
  );
}
