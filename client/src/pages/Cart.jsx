import { useShop } from "../context/ShopContext";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { Trash2, Loader2, AlertCircle } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { getImageUrl } from "../utils/imageUrl";

export default function Cart() {
  const { cart, removeFromCart, placeOrder, products } = useShop();
  const { t } = useLanguage();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showShipping, setShowShipping] = useState(false);
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [zip, setZip] = useState("");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderError, setOrderError] = useState("");

  const isItemOutOfStock = (itemId) => {
    const foundProduct = products.find((p) => p.id === itemId);
    return foundProduct ? foundProduct.is_in_stock === false : false;
  };
  const hasOutOfStockItems = cart.some((item) => isItemOutOfStock(item.id));

  const handleCheckout = () => {
    if (hasOutOfStockItems) {
      alert(t("cart", "outOfStockWarning"));
      return;
    }
    if (!user) {
      navigate("/login?redirect=/cart");
      return;
    }
    setShowShipping(true);
  };

  const submitOrder = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setOrderError("");
    try {
      const shippingDetails = { name, address, city, zip, country, phone };
      const success = await placeOrder(user, shippingDetails);
      if (success) {
        setShowShipping(false);
        navigate("/dashboard?tab=orders&success=1");
      } else {
        setOrderError("Order failed. Please try again.");
      }
    } catch {
      setOrderError("Something went wrong. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const cartTotal = cart.reduce(
    (acc, item) => acc + item.price * item.quantity,
    0,
  );

  if (cart.length === 0) {
    return (
      <div className="py-20 text-center container mx-auto px-4 min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold mb-4 text-black">
          {t("cart", "title")}
        </h1>
        <p className="mb-8 text-gray-600">{t("cart", "empty")}</p>
        <Link
          to="/shop"
          className="bg-primary text-black px-6 py-2 rounded hover:bg-yellow-400 transition-colors"
        >
          {t("cart", "continue")}
        </Link>
      </div>
    );
  }

  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-3xl font-bold mb-8 text-black">
          {t("cart", "title")}
        </h1>
        {hasOutOfStockItems && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{t("cart", "outOfStockWarning")}</span>
          </div>
        )}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-8">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex flex-col sm:flex-row items-center p-5 border-b border-gray-100 last:border-b-0 gap-5"
            >
              <div className="w-24 h-24 rounded overflow-hidden flex-shrink-0">
                <img
                  src={getImageUrl(item.image)}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg font-semibold mb-1 flex flex-wrap items-center justify-center sm:justify-start gap-2">
                  {item.name}
                  {isItemOutOfStock(item.id) && (
                    <span className="bg-red-100 text-red-700 text-xs px-2 py-0.5 rounded font-semibold uppercase">
                      {t("cart", "outOfStockBadge")}
                    </span>
                  )}
                </h3>
                <p className="text-gray-600">
                  €{Number(item.price).toFixed(2)} x {item.quantity}
                </p>
              </div>
              <div className="font-bold text-lg text-black">
                €{(Number(item.price) * item.quantity).toFixed(2)}
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="text-red-500 hover:text-red-700 p-2"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
        </div>
        <div className="bg-gray-100 p-8 rounded-lg">
          <div className="flex justify-between items-center text-2xl font-bold text-black mb-6">
            <h2>{t("cart", "total")}:</h2>
            <span>€{Number(cartTotal).toFixed(2)}</span>
          </div>
          <button
            onClick={handleCheckout}
            disabled={hasOutOfStockItems}
            className={`w-full py-4 rounded text-lg font-bold transition-colors ${
              hasOutOfStockItems
                ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                : "bg-primary text-black hover:bg-yellow-400"
            }`}
          >
            {t("cart", "checkout")}
          </button>
        </div>
      </div>

      {showShipping && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8 animate-fade-in">
            <h2 className="text-2xl font-bold mb-6 text-black">
              {t("cart", "shippingTitle")}
            </h2>
            {orderError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
                <AlertCircle size={16} /> {orderError}
              </div>
            )}
            <form onSubmit={submitOrder} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium text-sm">
                  Name and Surname
                </label>
                <input
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-sm">
                  {t("cart", "address")}
                </label>
                <input
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium text-sm">
                    {t("cart", "city")}
                  </label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block mb-1 font-medium text-sm">
                    {t("cart", "zip")}
                  </label>
                  <input
                    className="w-full p-2 border border-gray-300 rounded"
                    required
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                  />
                </div>
              </div>
              <div>
                <label className="block mb-1 font-medium text-sm">
                  {t("cart", "country")}
                </label>
                <input
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                />
              </div>
              <div>
                <label className="block mb-1 font-medium text-sm">
                  {t("cart", "phone")}
                </label>
                <input
                  className="w-full p-2 border border-gray-300 rounded"
                  required
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+387 61 123 456"
                />
              </div>
              <div className="flex gap-4 mt-8">
                <button
                  type="button"
                  onClick={() => setShowShipping(false)}
                  disabled={isSubmitting}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 rounded font-medium hover:bg-gray-300 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-primary text-black py-2 rounded font-medium hover:bg-yellow-400 disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Placing...
                    </>
                  ) : (
                    t("cart", "placeOrder")
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
