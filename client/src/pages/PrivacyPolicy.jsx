import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const PrivacyPolicy = () => {
  const { lang } = useLanguage();
  
  const content = {
    en: {
      title: 'Privacy Policy',
      lastUpdated: 'Last Updated: August 2026',
      intro: 'At Carbon.ez, we respect your personal data. This Privacy Policy explains how we collect, use, and protect your information.',
      sections: [
        {
          title: '1. Information We Collect',
          text: 'We collect information you provide directly to us, such as when you submit a configurator inquiry, contact us, or create an account. This may include your name, email address, phone number, and vehicle details.'
        },
        {
          title: '2. How We Use Your Information',
          text: 'We use the information we collect to provide, maintain, and improve our services, to process your inquiries and quotes, and to communicate with you.'
        },
        {
          title: '3. Cookies and Tracking',
          text: 'We use cookies to maintain your session when you log in and to ensure our website functions securely. By using our site, you consent to our use of these essential cookies.'
        },
        {
          title: '4. Data Sharing',
          text: 'We do not sell, trade, or otherwise transfer your personally identifiable information to outside parties except when necessary to operate our website or conduct our business.'
        },
        {
          title: '5. Data Security',
          text: 'We implement a variety of security measures to maintain the safety of your personal information. Your data is stored in secure environments.'
        }
      ]
    },
    bs: {
      title: 'Politika Privatnosti',
      lastUpdated: 'Posljednje ažuriranje: August 2026.',
      intro: 'U Carbon.ez poštujemo vaše lične podatke. Ova Politika privatnosti objašnjava kako prikupljamo, koristimo i štitimo vaše informacije.',
      sections: [
        {
          title: '1. Informacije koje prikupljamo',
          text: 'Prikupljamo informacije koje nam direktno pružite, na primjer kada pošaljete upit putem konfiguratora, kontaktirate nas ili kreirate račun. To može uključivati vaše ime, e-mail adresu, broj telefona i detalje o vozilu.'
        },
        {
          title: '2. Kako koristimo vaše informacije',
          text: 'Informacije koje prikupljamo koristimo za pružanje, održavanje i poboljšanje naših usluga, obradu vaših upita i ponuda, te za komunikaciju s vama.'
        },
        {
          title: '3. Kolačići (Cookies)',
          text: 'Koristimo kolačiće kako bismo održali vašu sesiju kada ste prijavljeni i osigurali siguran rad naše web stranice. Korištenjem naše stranice pristajete na upotrebu ovih neophodnih kolačića.'
        },
        {
          title: '4. Dijeljenje podataka',
          text: 'Ne prodajemo, ne trgujemo i na drugi način ne prenosimo vaše lične podatke vanjskim stranama osim kada je to neophodno za rad naše web stranice ili poslovanja.'
        },
        {
          title: '5. Sigurnost podataka',
          text: 'Provodimo različite sigurnosne mjere kako bismo održali sigurnost vaših ličnih podataka. Vaši podaci su pohranjeni u sigurnim okruženjima.'
        }
      ]
    }
  };

  const t = content[lang];

  return (
    <div className="pt-32 pb-20 px-4 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-lg border border-gray-200 p-8 md:p-12 shadow-sm">
        <h1 className="text-3xl md:text-5xl font-bold mb-4 text-black">
          {t.title}
        </h1>
        <p className="text-gray-500 mb-8">{t.lastUpdated}</p>
        
        <p className="text-lg text-gray-700 mb-8 leading-relaxed">
          {t.intro}
        </p>

        <div className="space-y-8">
          {t.sections.map((section, index) => (
            <div key={index}>
              <h2 className="text-xl md:text-2xl font-bold mb-3 text-black">
                {section.title}
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {section.text}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
