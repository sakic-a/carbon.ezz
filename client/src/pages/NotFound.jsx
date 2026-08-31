import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  const { lang } = useLanguage();

  const carbonBg = {
    backgroundColor: "#0a0a0a",
    backgroundImage: `
      repeating-linear-gradient(45deg,  rgba(255,255,255,0.018) 0, rgba(255,255,255,0.018) 1px, transparent 0, transparent 50%),
      repeating-linear-gradient(-45deg, rgba(255,255,255,0.018) 0, rgba(255,255,255,0.018) 1px, transparent 0, transparent 50%)
    `,
    backgroundSize: "6px 6px",
  };

  return (
    <div 
      className="min-h-[80vh] flex flex-col items-center justify-center text-center px-6"
      style={carbonBg}
    >
      <div className="bg-black/50 backdrop-blur-md p-12 rounded-2xl border border-gray-800 shadow-2xl max-w-lg w-full">
        <h1 className="text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-red-400 mb-4 tracking-tighter">
          404
        </h1>
        <h2 className="text-2xl font-bold text-white mb-6 uppercase tracking-widest">
          {lang === "bs" ? "Stranica Nije Pronađena" : "Page Not Found"}
        </h2>
        <p className="text-gray-400 mb-10 text-sm">
          {lang === "bs" 
            ? "Izgleda da ste skrenuli s puta. Stranica koju tražite ne postoji ili je premještena."
            : "Looks like you drifted off track. The page you are looking for doesn't exist or has been moved."}
        </p>
        <Link 
          to="/" 
          className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full transition-all duration-300 hover:scale-105"
        >
          <ArrowLeft size={18} />
          {lang === "bs" ? "Nazad na Početnu" : "Back to Home"}
        </Link>
      </div>
    </div>
  );
}
