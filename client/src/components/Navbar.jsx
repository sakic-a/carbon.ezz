import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Menu, X, Globe, LogOut, User } from "lucide-react";
import { useState, useEffect } from "react";
import { useLanguage } from "../context/LanguageContext";
import { useAuth } from "../context/AuthContext";
import { useShop } from "../context/ShopContext";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { lang, toggleLanguage, t } = useLanguage();
  const { user, authLoading, logout } = useAuth();
  const navigate = useNavigate();
  const { cart } = useShop();
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);

  const [updateCount, setUpdateCount] = useState(0);

  useEffect(() => {
    if (authLoading || !user || user.role === "admin") {
      setUpdateCount(0);
      return;
    }

    const checkUpdates = async () => {
      try {
        const emailEnc = encodeURIComponent(user.email);

        const [ordersRes, messagesRes, configRes] = await Promise.all([
          fetch(`/api/orders/user/${emailEnc}`, { credentials: "include" }).then((r) => r.ok ? r.json() : []),
          fetch(`/api/messages/user/${emailEnc}`, { credentials: "include" }).then((r) => r.ok ? r.json() : []),
          fetch(`/api/configurator-inquiries/user/${emailEnc}`, { credentials: "include" }).then((r) => r.ok ? r.json() : []),
        ]);

        let totalCount = 0;

        // 1. Check orders
        const ordersKey = `read_orders_status_${user.email}`;
        let storedStatuses = {};
        try {
          storedStatuses = JSON.parse(localStorage.getItem(ordersKey)) || {};
        // eslint-disable-next-line no-empty, no-unused-vars
        } catch (e) {}
        const isFirstOrdersLoad = Object.keys(storedStatuses).length === 0;
        if (!isFirstOrdersLoad) {
          ordersRes.forEach((o) => {
            const prevStatus = storedStatuses[o.id];
            if (!prevStatus || prevStatus !== o.status) {
              totalCount++;
            }
          });
        }

        // 2. Check messages
        const msgKey = `seen_messages_replies_${user.email}`;
        let storedMsgReplies = {};
        try {
          storedMsgReplies = JSON.parse(localStorage.getItem(msgKey)) || {};
        // eslint-disable-next-line no-empty, no-unused-vars
        } catch (e) {}
        messagesRes.forEach((m) => {
          if (m.reply) {
            const prevReply = storedMsgReplies[m.id];
            if (prevReply !== m.reply) {
              totalCount++;
            }
          }
        });

        // 3. Check configurator inquiries
        const configKey = `seen_config_replies_${user.email}`;
        let storedConfigReplies = {};
        try {
          storedConfigReplies = JSON.parse(localStorage.getItem(configKey)) || {};
        // eslint-disable-next-line no-empty, no-unused-vars
        } catch (e) {}
        configRes.forEach((inq) => {
          if (inq.reply) {
            const prevReply = storedConfigReplies[inq.id];
            if (prevReply !== inq.reply) {
              totalCount++;
            }
          }
        });

        setUpdateCount(totalCount);
      } catch (err) {
        console.error("Failed to check navbar updates:", err);
      }
    };

    checkUpdates();
    // Re-check every 30 seconds or on window focus
    const interval = setInterval(checkUpdates, 30000);
    window.addEventListener("focus", checkUpdates);
    window.addEventListener("dashboard-updates-read", checkUpdates);
    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", checkUpdates);
      window.removeEventListener("dashboard-updates-read", checkUpdates);
    };
  }, [user, authLoading]);

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
          <Link
            to="/shop"
            className="hover:text-primary transition-colors"
            onClick={() => sessionStorage.removeItem("shopScrollY")}
          >
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
              {updateCount > 0 && (
                <span className="ml-1 bg-black text-primary text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {updateCount}
                </span>
              )}
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
            onClick={() => {
              setIsOpen(false);
              sessionStorage.removeItem("shopScrollY");
            }}
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
              <Globe size={18} /> {lang === "bs" ? "Jezik" : "Language"}: {lang.toUpperCase()}
            </button>

            <Link
              to="/cart"
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2 py-2"
            >
              <ShoppingCart size={18} /> {t("nav", "cart")} ({cartCount})
            </Link>

            {user?.role !== "admin" && (
              <Link
                to="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2 py-2 font-bold text-primary"
              >
                <User size={18} />
                {user ? `My Account (${user.name})` : t("nav", "myAccount")}
                {updateCount > 0 && (
                  <span className="ml-1.5 bg-black text-primary text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {updateCount}
                  </span>
                )}
              </Link>
            )}
            {user && (
              <button
                onClick={() => { logout(); setIsOpen(false); navigate("/login"); }}
                className="text-left font-semibold py-2 text-secondary"
              >
                {t("nav", "logout")}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
