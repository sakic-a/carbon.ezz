import { useLanguage } from "../context/LanguageContext";
export default function Gallery() {
  const { t } = useLanguage();
  const images = [
    { src: "/images/bmw-wheel.png", alt: "BMW M-Performance Carbon" },
    { src: "/images/mercedes-wheel.png", alt: "AMG Alcantara & Carbon" },
    { src: "/images/forged-detail.png", alt: "Forged Carbon Detail" },
    { src: "/images/racing-wheel.png", alt: "Custom Racing Wheel" },
    { src: "/images/audi-wheel.png", alt: "Audi RS Flat Bottom" },
    { src: "/images/tesla-yoke.png", alt: "Tesla Yoke Carbon" },
  ];
  return (
    <div className="py-16 bg-white min-h-screen">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-4 text-primary">
          {t("nav", "gallery")}
        </h1>
        <p className="text-center text-gray-600 mb-12 max-w-2xl mx-auto">
          A glimpse into our premium collection and happy customers.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {images.map((image, index) => (
            <div
              key={index}
              className="h-[300px] rounded-lg overflow-hidden shadow-sm bg-gray-100 relative group"
            >
              <div className="absolute inset-0 flex items-center justify-center text-gray-400 z-0">
                Loading...
              </div>
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover relative z-10 transition-transform duration-500 group-hover:scale-110"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
