import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, Globe, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useShop } from "../context/ShopContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, toggleLanguage, t } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { cart } = useShop();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <nav className="sticky top-0 z-50 h-[70px] flex items-center bg-white shadow-sm">
      <div className="container mx-auto px-4 flex justify-between items-center w-full">
        <Link
          to="/"
          className="text-2xl font-extrabold text-black no-underline"
        >
          Carbon<span className="text-primary">.ez</span>
        </Link>

        <div className="hidden md:flex gap-8 font-medium text-secondary">
          <Link to="/" className="hover:text-primary transition-colors">
            {t("nav", "home")}
          </Link>
          <Link to="/shop" className="hover:text-primary transition-colors">
            {t("nav", "shop")}
          </Link>
          <Link to="/gallery" className="hover:text-primary transition-colors">
            {t("nav", "gallery")}
          </Link>
          <Link to="/configurator" className="hover:text-primary transition-colors">
            {t("nav", "configurator")}
          </Link>
          <Link to="/about" className="hover:text-primary transition-colors">
            {t("nav", "about")}
          </Link>
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="text-primary font-bold hover:text-yellow-400"
            >
              {t("nav", "admin")}
            </Link>
          )}
        </div>

        <div className="hidden md:flex items-center gap-6">
          <button
            onClick={toggleLanguage}
            className="flex items-center text-secondary hover:text-primary transition-colors"
            title="Switch Language"
          >
            <Globe size={20} />
            <span className="ml-[5px] text-xs font-bold">
              {lang.toUpperCase()}
            </span>
          </button>

          <Link
            to="/cart"
            className="relative flex items-center text-secondary hover:text-primary transition-colors"
          >
            <ShoppingCart size={20} />
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-accent text-primary text-[0.7rem] w-[18px] h-[18px] rounded-full flex items-center justify-center font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          {user?.role !== "admin" && (
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 text-secondary hover:text-primary transition-colors font-semibold text-sm"
              title="My Account"
            >
              <User size={20} />
              <span>{user ? user.name : t("nav", "myAccount")}</span>
            </Link>
          )}

          {user && (
            <button
              onClick={() => { logout(); navigate("/login"); }}
              className="flex items-center text-secondary hover:text-primary transition-colors"
              title={t("nav", "logout")}
            >
              <LogOut size={20} />
            </button>
          )}
        </div>

        <button
          className="md:hidden text-secondary"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {isOpen && (
        <div className="md:hidden absolute top-[70px] left-0 w-full bg-white shadow-md border-t border-gray-100 flex flex-col p-5 gap-4">
          <Link
            to="/"
            className="text-lg py-2 border-b border-gray-100"
            onClick={() => setIsOpen(false)}
          >
            {t("nav", "home")}
          </Link>
          <Link
            to="/shop"
            className="text-lg py-2 border-b border-gray-100"
            onClick={() => setIsOpen(false)}
          >
            {t("nav", "shop")}
          </Link>
          <Link
            to="/gallery"
            className="text-lg py-2 border-b border-gray-100"
            onClick={() => setIsOpen(false)}
          >
            {t("nav", "gallery")}
          </Link>
          <Link
            to="/configurator"
            className="text-lg py-2 border-b border-gray-100"
            onClick={() => setIsOpen(false)}
          >
            {t("nav", "configurator")}
          </Link>
          <Link
            to="/about"
            className="text-lg py-2 border-b border-gray-100"
            onClick={() => setIsOpen(false)}
          >
            {t("nav", "about")}
          </Link>
          {user?.role === "admin" && (
            <Link
              to="/admin"
              className="text-lg py-2 border-b border-gray-100 text-primary font-bold"
              onClick={() => setIsOpen(false)}
            >
              {t("nav", "admin")}
            </Link>
          )}

          <div className="flex flex-col gap-3 mt-2">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-2 py-2"
            >
              <Globe size={18} /> Language: {lang.toUpperCase()}
            </button>

            <Link
              to="/cart"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 py-2"
            >
              <ShoppingCart size={18} /> Cart ({cartCount})
            </Link>

            {user?.role !== "admin" && (
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 py-2 font-bold text-primary"
              >
                <User size={18} />
                {user ? `My Account (${user.name})` : t("nav", "myAccount")}
              </Link>
            )}
            {user && (
              <button
                onClick={() => { logout(); setIsOpen(false); navigate("/login"); }}
                className="text-left font-semibold py-2 text-secondary"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
