import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { Check, Plus, ArrowLeft, Truck, Shield, Clock } from "lucide-react";
export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useShop();
  const { t, lang } = useLanguage();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);
  const [activeImage, setActiveImage] = useState("");
  useEffect(() => {
    fetch(`http://localhost:5001/api/products/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Product not found");
        return res.json();
      })
      .then((data) => {
        setProduct(data);
        setActiveImage(data.image);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch product", err);
        setLoading(false);
      });
  }, [id]);
  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };
  if (loading)
    return (
      <div className="py-20 text-center font-bold text-xl">Loading...</div>
    );
  if (!product)
    return (
      <div className="py-20 text-center font-bold text-xl">
        Product not found
      </div>
    );
  const name = lang === "bs" ? (product.nameBs || product.name) : product.name;
  const isAdmin = user?.role === "admin";
  const gallery = product.gallery
    ? [product.image, ...product.gallery]
    : [product.image];
  return (
    <div className="py-16 bg-white min-h-screen">
      <div className="container mx-auto px-4">
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-gray-500 hover:text-black mb-8 transition-colors"
        >
          <ArrowLeft size={20} /> {t("nav", "shop")}
        </Link>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <div className="bg-gray-50 rounded-lg overflow-hidden h-[500px] flex items-center justify-center border border-gray-100 mb-4">
              <img
                src={activeImage}
                alt={name}
                className="w-full h-full object-cover"
              />
            </div>
            {gallery.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {gallery.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={`w-24 h-24 flex-shrink-0 rounded-md overflow-hidden border-2 transition-all ${activeImage === img ? "border-primary" : "border-transparent hover:border-gray-300"}`}
                  >
                    <img
                      src={img}
                      alt={`View ${idx}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          <div>
            <div className="mb-2">
              <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded uppercase tracking-wide">
                {product.category}
              </span>
            </div>
            <h1 className="text-4xl font-extrabold mb-4 text-black">{name}</h1>
            <p className="text-3xl font-bold text-primary mb-6">
              €{Number(product.price).toFixed(2)}
            </p>
            <div className="prose prose-lg text-gray-600 mb-8 border-t border-b border-gray-100 py-6">
              <h3 className="text-lg font-bold text-black mb-2">Description</h3>
              <p>
                {product.description ||
                  "No description available for this product."}
              </p>
            </div>
            {!isAdmin && (
              <button
                onClick={handleAdd}
                className={`w-full md:w-auto px-8 py-4 rounded-full font-bold text-lg flex items-center justify-center gap-3 transition-colors ${
                  added
                    ? "bg-green-500 text-white"
                    : "bg-primary text-black hover:bg-yellow-400"
                }`}
              >
                {added ? <Check size={24} /> : <Plus size={24} />}
                <span>{added ? "Added to Cart" : t("shop", "addToCart")}</span>
              </button>
            )}
            <div className="grid grid-cols-3 gap-4 mt-10 text-center">
              <div className="p-4 bg-gray-50 rounded">
                <Truck size={24} className="mx-auto mb-2 text-primary" />
                <p className="text-xs font-bold">Fast Shipping</p>
              </div>
              <div className="p-4 bg-gray-50 rounded">
                <Shield size={24} className="mx-auto mb-2 text-primary" />
                <p className="text-xs font-bold">Warranty</p>
              </div>
              <div className="p-4 bg-gray-50 rounded">
                <Clock size={24} className="mx-auto mb-2 text-primary" />
                <p className="text-xs font-bold">24/7 Support</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
