import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Link } from 'react-router-dom';

const CookieBanner = () => {
  const { lang } = useLanguage();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem('cookieConsent');
    if (!hasConsented) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const content = {
    en: {
      message: 'We use cookies to ensure you get the best experience and to keep your session secure.',
      policyLink: 'Read our Privacy Policy',
      acceptBtn: 'Accept'
    },
    bs: {
      message: 'Koristimo kolačiće kako bismo osigurali najbolje iskustvo i održali vašu sesiju sigurnom.',
      policyLink: 'Pročitajte Politiku privatnosti',
      acceptBtn: 'Prihvatam'
    }
  };

  const t = content[lang];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-black text-white p-4 border-t border-carbon-800">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm md:text-base text-center md:text-left">
          {t.message}{' '}
          <Link to="/privacy-policy" className="text-primary hover:underline">
            {t.policyLink}
          </Link>
        </p>
        <button
          onClick={handleAccept}
          className="px-4 py-1.5 text-sm bg-primary text-black font-medium rounded hover:bg-yellow-500 transition-colors whitespace-nowrap"
        >
          {t.acceptBtn}
        </button>
      </div>
    </div>
  );
};

export default CookieBanner;
