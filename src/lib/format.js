// Množina: hrvatski (1 dan, 2 dana, 5 dana) i engleski (1 day, 2 days) iz rječnika t.duration
const form = (n, [one, few, many]) => {
  const m10 = n % 10;
  const m100 = n % 100;
  if (m10 === 1 && m100 !== 11) return one;
  if (m10 >= 2 && m10 <= 4 && (m100 < 12 || m100 > 14)) return few;
  return many;
};

export const formatDuration = ({ days, nights }, d) =>
  nights > 0 ? `${days} ${form(days, d.day)} / ${nights} ${form(nights, d.night)}` : `${days} ${form(days, d.day)}`;
