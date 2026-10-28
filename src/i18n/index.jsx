import { createContext, useContext } from 'react';
import { useRoute } from '../route.jsx';
import hr from './hr.js';
import en from './en.js';

export const DICTIONARIES = { hr, en };
const LangContext = createContext(hr);

export function LanguageProvider({ children }) {
  const { lang } = useRoute();
  return <LangContext.Provider value={DICTIONARIES[lang] || hr}>{children}</LangContext.Provider>;
}

export const useT = () => useContext(LangContext);
