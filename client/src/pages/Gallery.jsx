import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
export default function Gallery() {
  const { t } = useLanguage();
  const [visibleCount, setVisibleCount] = useState(9);
  
  const images = [
    { src: "/gallery/20260610_193948.jpg.jpeg", alt: "Carbon Steering Wheel Gallery Image" },
    { src: "/gallery/20260610_194247.jpg.jpeg", alt: "Carbon Steering Wheel Gallery Image" },
    { src: "/gallery/20260616_160157.jpg.jpeg", alt: "Carbon Steering Wheel Gallery Image" },
    { src: "/gallery/20260617_140356.jpg.jpeg", alt: "Carbon Steering Wheel Gallery Image" },
    { src: "/gallery/20260617_140420.jpg.jpeg", alt: "Carbon Steering Wheel Gallery Image" },
    { src: "/gallery/20260705_155118.jpg.jpeg", alt: "Carbon Steering Wheel Gallery Image" },
    { src: "/gallery/20260711_130254.jpg.jpeg", alt: "Carbon Steering Wheel Gallery Image" },
    { src: "/gallery/20260712_185645.jpg.jpeg", alt: "Carbon Steering Wheel Gallery Image" },
    { src: "/gallery/20260712_185955.jpg.jpeg", alt: "Carbon Steering Wheel Gallery Image" },
    { src: "/gallery/20260714_105514.jpg.jpeg", alt: "Carbon Steering Wheel Gallery Image" },
    { src: "/gallery/20260714_164142.jpg.jpeg", alt: "Carbon Steering Wheel Gallery Image" },
    { src: "/gallery/20260719_143400.jpg.jpeg", alt: "Carbon Steering Wheel Gallery Image" },
    { src: "/gallery/20260719_143425.jpg.jpeg", alt: "Carbon Steering Wheel Gallery Image" },
    { src: "/gallery/20260719_193201.jpg.jpeg", alt: "Carbon Steering Wheel Gallery Image" },
    { src: "/gallery/20260719_193747.jpg.jpeg", alt: "Carbon Steering Wheel Gallery Image" },
    { src: "/gallery/20260720_135643.jpg.jpeg", alt: "Carbon Steering Wheel Gallery Image" },
    { src: "/gallery/20260720_140103.jpg.jpeg", alt: "Carbon Steering Wheel Gallery Image" },
    { src: "/gallery/20260721_123137.jpg.jpeg", alt: "Carbon Steering Wheel Gallery Image" },
    { src: "/gallery/20260721_123507.jpg.jpeg", alt: "Carbon Steering Wheel Gallery Image" },
    { src: "/gallery/20260721_152221.jpg.jpeg", alt: "Carbon Steering Wheel Gallery Image" },
    { src: "/gallery/20260721_152227.jpg.jpeg", alt: "Carbon Steering Wheel Gallery Image" },
    { src: "/gallery/20260721_152249.jpg.jpeg", alt: "Carbon Steering Wheel Gallery Image" },
    { src: "/gallery/20260721_152553.jpg.jpeg", alt: "Carbon Steering Wheel Gallery Image" },
    { src: "/gallery/20260722_191007.jpg.jpeg", alt: "Carbon Steering Wheel Gallery Image" },
    { src: "/gallery/20260722_195838.jpg.jpeg", alt: "Carbon Steering Wheel Gallery Image" },
    { src: "/gallery/20260723_223706.jpg.jpeg", alt: "Carbon Steering Wheel Gallery Image" },
    { src: "/gallery/20260724_103846.jpg.jpeg", alt: "Carbon Steering Wheel Gallery Image" },
    { src: "/gallery/20260727_134133.jpg.jpeg", alt: "Carbon Steering Wheel Gallery Image" },
    { src: "/gallery/20260727_134614.jpg.jpeg", alt: "Carbon Steering Wheel Gallery Image" },
    { src: "/gallery/20260728_124053.jpg.jpeg", alt: "Carbon Steering Wheel Gallery Image" },
    { src: "/gallery/20260728_124339.jpg.jpeg", alt: "Carbon Steering Wheel Gallery Image" },
    { src: "/gallery/20260729_142646.jpg.jpeg", alt: "Carbon Steering Wheel Gallery Image" },
    { src: "/gallery/20260729_143142.jpg.jpeg", alt: "Carbon Steering Wheel Gallery Image" },
  ];
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
                src={image.src}
                alt={image.alt}
                className="w-full h-auto relative z-10 transition-transform duration-500 group-hover:scale-105"
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
