import { Instagram, Facebook, MapPin, ShoppingBag, Mail } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="bg-black text-white py-10 text-center mt-auto">
      <div className="container mx-auto px-4">
        <div className="flex justify-center flex-wrap gap-5 mb-5">
          <a
            href="https://www.instagram.com/carbon.ez"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-text-inverse opacity-80 hover:opacity-100 transition-opacity no-underline"
          >
            <Instagram size={20} /> Instagram
          </a>
          <a
            href="https://www.facebook.com/people/Carbonez/61577012291368/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-text-inverse opacity-80 hover:opacity-100 transition-opacity no-underline"
          >
            <Facebook size={20} /> Facebook
          </a>
          <a
            href="https://olx.ba/shops/CarbonEZ/aktivni"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 text-text-inverse opacity-80 hover:opacity-100 transition-opacity no-underline"
          >
            <ShoppingBag size={20} /> OLX Shop
          </a>
          <a
            href="mailto:karbonezzz@gmail.com"
            className="flex items-center gap-2 text-text-inverse opacity-80 hover:opacity-100 transition-opacity no-underline"
          >
            <Mail size={20} /> karbonezzz@gmail.com
          </a>
        </div>
        <div className="opacity-80 text-sm mb-5">
          <div>
            <MapPin size={18} className="inline mr-1" />
            {t("footer", "location")}
          </div>
          <div className="mt-2">
            <span className="font-bold">{t("footer", "phone")}</span>{" "}
            <a
              href="tel:+38761353966"
              className="hover:text-primary transition-colors underline underline-offset-2"
            >
              +387 61 353 966
            </a>
          </div>
        </div>
        <div className="mt-4 flex flex-col items-center gap-2">
          <p>{t("footer", "rights")}</p>
          <a href="/privacy-policy" className="text-sm text-carbon-400 hover:text-primary transition-colors underline">
            Privacy Policy
          </a>
        </div>
      </div>
    </footer>
  );
}
