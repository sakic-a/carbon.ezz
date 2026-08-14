import { createContext, useContext, useState } from "react";
import { translations } from "../data/translations";
const LanguageContext = createContext();
export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("bs");
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
// eslint-disable-next-line react-refresh/only-export-components
export function useLanguage() {
  return useContext(LanguageContext);
}
