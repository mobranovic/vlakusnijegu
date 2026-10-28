import { SHOW_PLACEHOLDERS } from '../route.jsx';

const BRACKETS = /\s*\[[^\]]*\]/g;

/** Tekst bez rezerviranih mjesta „[…]“ na objavljenoj stranici; u pregledu ostaje cijeli. */
export const ph = (text) => (SHOW_PLACEHOLDERS || typeof text !== 'string' ? text : text.replace(BRACKETS, '').trim());

/** Je li tekst samo rezervirano mjesto (na objavljenoj stranici se cijeli redak izostavlja). */
export const onlyPlaceholder = (text) => typeof text === 'string' && text.replace(BRACKETS, '').trim() === '';

/** Vidi li se redak / odlomak na ovoj stranici. */
export const visible = (text) => SHOW_PLACEHOLDERS || !onlyPlaceholder(text);
