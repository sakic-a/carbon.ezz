import { useLanguage } from "../context/LanguageContext";
import { useShop } from "../context/ShopContext";
import { useState, useEffect } from "react";
import ProductCard from "../components/ProductCard";
import { CATEGORIES } from "../data/categories";

export default function Shop() {
  const { t, lang } = useLanguage();
  const { products } = useShop();
  const [filter, setFilter] = useState("all");
  const [isRestoringScroll, setIsRestoringScroll] = useState(() => {
    return !!sessionStorage.getItem("shopScrollY");
  });

  useEffect(() => {
    if (products && products.length > 0 && isRestoringScroll) {
      const savedScrollY = sessionStorage.getItem("shopScrollY");
      if (savedScrollY) {
        const timer = setTimeout(() => {
          window.scrollTo(0, parseInt(savedScrollY, 10));
          sessionStorage.removeItem("shopScrollY");
          setIsRestoringScroll(false);
        }, 80);
        return () => clearTimeout(timer);
      } else {
        setIsRestoringScroll(false);
      }
    } else if (products && products.length > 0 && !isRestoringScroll) {
      // If we aren't restoring, make sure we show the page
      setIsRestoringScroll(false);
    }
  }, [products, isRestoringScroll]);

  const filteredProducts =
    filter === "all" ? products : products.filter((p) => p.category === filter);
  return (
    <div
      className="py-16 bg-gray-50 min-h-screen transition-opacity duration-150"
      style={{ opacity: isRestoringScroll ? 0 : 1 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <h1 className="text-3xl font-bold text-black">
            {t("shop", "title")}
          </h1>
          <div className="flex gap-3 overflow-x-auto pb-2 w-full md:w-auto">
            <button
              className={`px-5 py-2 rounded-full border text-sm font-medium transition-colors whitespace-nowrap ${filter === "all"
                  ? "bg-primary text-black border-primary"
                  : "bg-white text-gray-600 border-gray-300 hover:border-black"
                }`}
              onClick={() => setFilter("all")}
            >
              All
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                className={`px-5 py-2 rounded-full border text-sm font-medium transition-colors whitespace-nowrap capitalize ${filter === cat.id
                    ? "bg-primary text-black border-primary"
                    : "bg-white text-gray-600 border-gray-300 hover:border-black"
                  }`}
                onClick={() => setFilter(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-300 mb-4 uppercase tracking-widest">
            {t("configurator", "comingSoon")}
          </h2>
          <p className="text-gray-500 max-w-md mx-auto">
            {lang === "bs" ? "Naša trgovina je trenutno u pripremi." : "Our shop is currently being prepared."}
          </p>
        </div>
      </div>
    </div>
  );
}
