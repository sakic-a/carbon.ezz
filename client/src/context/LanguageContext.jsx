import { createContext, useContext, useState } from "react";
import { translations } from "../data/translations";
const LanguageContext = createContext();
export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");
  const toggleLanguage = () => {
    setLang((prev) => (prev === "en" ? "bs" : "en"));
  };
  const t = (section, key) => {
    return translations[lang][section]?.[key] || key;
  };
  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}
export function useLanguage() {
  return useContext(LanguageContext);
}
