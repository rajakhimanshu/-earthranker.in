import React, { createContext, useContext, useState, useEffect } from 'react';
import { EN, HI } from '../i18n/translations';

const TRANSLATIONS = {
  en: { key: 'en', label: '🇬🇧 EN', data: EN },
  hi: { key: 'hi', label: '🇮🇳 HI', data: HI }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('language') || 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', lang);
  }, [lang]);

  const t = TRANSLATIONS[lang]?.data || EN;

  const toggleLang = () => {
    setLang(prev => prev === 'en' ? 'hi' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, languageConfig: TRANSLATIONS[lang], t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useTranslation() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
}
