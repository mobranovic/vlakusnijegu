// Hrvatska množina: 1 dan, 2 dana; 1 noć, 2–4 noći, 5+ noći
const plural = (n, one, few, many) => {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
};

export const formatDuration = ({ days, nights }) =>
  nights > 0
    ? `${days} ${plural(days, 'dan', 'dana', 'dana')} / ${nights} ${plural(nights, 'noć', 'noći', 'noći')}`
    : `${days} ${plural(days, 'dan', 'dana', 'dana')}`;
