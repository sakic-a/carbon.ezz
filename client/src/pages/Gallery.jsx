import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useShop } from "../context/ShopContext";
import { getImageUrl } from "../utils/imageUrl";

export default function Gallery() {
  const { t } = useLanguage();
  const { galleryImages } = useShop();
  const [visibleCount, setVisibleCount] = useState(9);
  
  const images = galleryImages || [];
  return (
    <div className="py-16 bg-white min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-4 text-primary">
          {t("nav", "gallery")}
        </h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          {t("gallery", "subtitle")}
        </p>
        <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
          {images.slice(0, visibleCount).map((image, index) => (
            <div
              key={index}
              className="rounded-lg overflow-hidden shadow-sm bg-gray-100 relative group break-inside-avoid"
            >
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 z-0">
                {t("gallery", "loading")}
              </div>
              <img
                src={getImageUrl(image.src)}
                alt={image.alt || "Gallery Image"}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                loading="lazy"
              />
            </div>
          ))}
        </div>
        
        {visibleCount < images.length && (
          <div className="mt-12 flex justify-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 9)}
              className="bg-yellow-400 text-black font-bold py-3 px-8 rounded-full hover:bg-yellow-500 hover:scale-110 transition-all duration-300 shadow-lg"
            >
              {t("gallery", "loadMore")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
