import { useLanguage } from "../context/LanguageContext";
import { useShop } from "../context/ShopContext";
import { useState, useEffect, useLayoutEffect } from "react";
import { useNavigationType } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { CATEGORIES } from "../data/categories";

export default function Shop() {
  const { t } = useLanguage();
  const { products } = useShop();
  const [filter, setFilter] = useState("all");
  const navType = useNavigationType();

  useEffect(() => {
    if (navType === "PUSH") {
      sessionStorage.removeItem("shopScrollY");
    }
  }, [navType]);

  useLayoutEffect(() => {
    if (products && products.length > 0) {
      const savedScrollY = sessionStorage.getItem("shopScrollY");
      if (savedScrollY) {
        window.scrollTo(0, parseInt(savedScrollY, 10));
        sessionStorage.removeItem("shopScrollY");
      }
    }
  }, [products]);

  const filteredProducts =
    filter === "all" ? products : products.filter((p) => p.category === filter);
  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
          <h1 className="text-3xl font-bold text-black">
            {t("shop", "title")}
          </h1>
          <div className="flex gap-3 overflow-x-auto pb-2 w-full md:w-auto">
            <button
              className={`px-5 py-2 rounded-full border text-sm font-medium transition-colors whitespace-nowrap ${
                filter === "all"
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
                className={`px-5 py-2 rounded-full border text-sm font-medium transition-colors whitespace-nowrap capitalize ${
                  filter === cat.id
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
