import { Link } from "react-router-dom";
import { ArrowRight, Truck, Award, Headset } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useShop } from "../context/ShopContext";
import ProductCard from "../components/ProductCard";
export default function Home() {
  const { t } = useLanguage();
  const { products } = useShop();
  const featuredProducts = products.slice(0, 3);
  return (
    <>
      <section className="relative text-white py-32 text-center bg-gray-900">
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight">
            {t("hero", "title")}
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-gray-300 max-w-2xl mx-auto">
            {t("hero", "subtitle")}
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 bg-accent text-black px-8 py-3 rounded-full font-bold text-lg hover:bg-yellow-400 transition-colors"
          >
            {t("hero", "cta")} <ArrowRight size={20} />
          </Link>
        </div>
      </section>
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-black">
            {t("services", "title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-8 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="text-primary mb-6 flex justify-center">
                <Truck size={40} />
              </div>
              <h3 className="text-xl font-bold mb-3">
                {t("services", "s1_title")}
              </h3>
              <p className="text-gray-600">{t("services", "s1_desc")}</p>
            </div>
            <div className="text-center p-8 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="text-primary mb-6 flex justify-center">
                <Award size={40} />
              </div>
              <h3 className="text-xl font-bold mb-3">
                {t("services", "s2_title")}
              </h3>
              <p className="text-gray-600">{t("services", "s2_desc")}</p>
            </div>
            <div className="text-center p-8 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow border border-gray-100">
              <div className="text-primary mb-6 flex justify-center">
                <Headset size={40} />
              </div>
              <h3 className="text-xl font-bold mb-3">
                {t("services", "s3_title")}
              </h3>
              <p className="text-gray-600">{t("services", "s3_desc")}</p>
            </div>
          </div>
        </div>
      </section>
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-black">
            {t("shop", "title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {featuredProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div className="text-center">
            <Link
              to="/shop"
              className="inline-block border-2 border-black text-black px-8 py-3 rounded font-bold hover:bg-primary hover:text-black transition-colors"
            >
              View All Products
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
