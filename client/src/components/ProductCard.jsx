import { Plus, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { useShop } from "../context/ShopContext";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { getImageUrl } from "../utils/imageUrl";

export default function ProductCard({ product }) {
  const { addToCart } = useShop();
  const { lang, t } = useLanguage();
  const { user } = useAuth();
  const [added, setAdded] = useState(false);
  const handleAdd = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };
  const name = lang === "bs" ? (product.nameBs || product.name) : product.name;
  const isAdmin = user?.role === "admin";
  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden transition-shadow hover:shadow-md group">
      <Link
        to={`/product/${product.id}`}
        className="block h-[350px] overflow-hidden relative"
        onClick={() => sessionStorage.setItem("shopScrollY", window.scrollY.toString())}
      >
        <img
          src={getImageUrl(product.image)}
          alt={name}
          className="w-full h-full object-cover"
        />
      </Link>
      <div className="p-5">
        <Link
          to={`/product/${product.id}`}
          className="block"
          onClick={() => sessionStorage.setItem("shopScrollY", window.scrollY.toString())}
        >
          <h3 className="text-lg font-semibold mb-2 text-gray-800 hover:text-primary transition-colors">
            {name}
          </h3>
        </Link>
        <p className="text-xl font-bold text-primary mb-4">
          €{Number(product.price).toFixed(2)}
        </p>
        {!isAdmin && (
          <button
            onClick={handleAdd}
            className={`w-full flex items-center justify-center gap-2 py-2 px-4 rounded transition-colors ${added
                ? "bg-green-500 text-white hover:bg-green-600"
                : "bg-primary text-black hover:bg-yellow-400"
              }`}
          >
            {added ? <Check size={18} /> : <Plus size={18} />}
            <span>{added ? "Added" : t("shop", "addToCart")}</span>
          </button>
        )}
      </div>
    </div>
  );
}
