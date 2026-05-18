import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useShop } from "../context/ShopContext";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate, Link } from "react-router-dom";
import {
  ShoppingBag,
  MessageSquare,
  Lock,
  ShoppingCart,
  ChevronRight,
  Package,
  CheckCircle,
  Clock,
  Truck,
  AlertCircle,
  Send,
  Eye,
  EyeOff,
  Trash2,
  X,
  User
} from "lucide-react";

const API = "http://localhost:5000/api";

export default function UserDashboard() {
  const { user, logout } = useAuth();
  const { cart, removeFromCart } = useShop();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("orders");

 
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  
  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [msgName, setMsgName] = useState(user?.name || "");
  const [msgEmail, setMsgEmail] = useState(user?.email || "");
  const [msgPhone, setMsgPhone] = useState("");
  const [msgText, setMsgText] = useState("");
  const [msgSending, setMsgSending] = useState(false);
  const [msgSuccess, setMsgSuccess] = useState("");

 
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwError, setPwError] = useState("");

  
  useEffect(() => {
    if (!user) return;
    setOrdersLoading(true);
    fetch(`${API}/orders/user/${encodeURIComponent(user.email)}`)
      .then((r) => r.json())
      .then((data) => {
        setOrders(Array.isArray(data) ? data : []);
        setOrdersLoading(false);
      })
      .catch(() => setOrdersLoading(false));
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setMessagesLoading(true);
    fetch(`${API}/messages/user/${encodeURIComponent(user.email)}`)
      .then((r) => r.json())
      .then((data) => {
        setMessages(Array.isArray(data) ? data : []);
        setMessagesLoading(false);
      })
      .catch(() => setMessagesLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-20">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center max-w-sm w-full mx-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <User size={32} className="text-primary" />
          </div>
          <h1 className="text-2xl font-extrabold text-black mb-2">My Account</h1>
          <p className="text-gray-500 text-sm mb-8">
            Log in to view your orders, messages, cart and account settings.
          </p>
          <Link
            to="/login"
            className="block w-full bg-primary text-black py-3 rounded-lg font-bold text-sm hover:bg-yellow-400 transition-colors"
          >
            Login / Register
          </Link>
        </div>
      </div>
    );
  }

  const cartTotal = cart.reduce((a, i) => a + i.price * i.quantity, 0);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    setMsgSending(true);
    setMsgSuccess("");
    try {
      const res = await fetch(`${API}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: msgName,
          email: msgEmail,
          phone: msgPhone,
          message: msgText,
        }),
      });
      if (res.ok) {
        setMsgSuccess(td("messageSent"));
        setMsgText("");
        setMsgPhone("");
        
        const updated = await fetch(
          `${API}/messages/user/${encodeURIComponent(user.email)}`
        ).then((r) => r.json());
        setMessages(Array.isArray(updated) ? updated : []);
      }
    } catch (err) {
      console.error(err);
    }
    setMsgSending(false);
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setPwError("");
    setPwSuccess("");
    if (newPw !== confirmPw) {
      setPwError(td("pwMismatch"));
      return;
    }
    if (newPw.length < 6) {
      setPwError(td("pwTooShort"));
      return;
    }
    setPwLoading(true);
    try {
      const res = await fetch(`${API}/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: user.email,
          currentPassword: currentPw,
          newPassword: newPw,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setPwSuccess(td("pwSuccess"));
        setCurrentPw("");
        setNewPw("");
        setConfirmPw("");
      } else {
        setPwError(data.error || td("pwError"));
      }
    } catch (err) {
      setPwError(td("pwError"));
    }
    setPwLoading(false);
  };

  // ─── i18n helpers ────────────────────────────────────────────────
  const dashTrans = {
    en: {
      title: "My Account",
      orders: "My Orders",
      inquiries: "Inquiries",
      cart: "Cart",
      password: "Change Password",
      noOrders: "You have no orders yet.",
      orderDate: "Date",
      orderTotal: "Total",
      orderStatus: "Status",
      orderItems: "Items",
      viewDetails: "View Details",
      hide: "Hide",
      statusPending: "Pending",
      statusProcessing: "Processing",
      statusShipped: "Shipped",
      statusDelivered: "Delivered",
      sendMessage: "Send a Message",
      yourMessages: "Your Inquiries",
      noMessages: "You haven't sent any messages yet.",
      adminReply: "Reply from Carbon.ez:",
      noReply: "Awaiting reply...",
      name: "Full Name",
      email: "Email",
      phone: "Phone (optional)",
      message: "Message",
      send: "Send",
      messageSent: "Message sent successfully!",
      cartEmpty: "Your cart is empty.",
      cartTotal: "Total",
      goToCart: "Go to Checkout",
      remove: "Remove",
      currentPw: "Current Password",
      newPw: "New Password",
      confirmPw: "Confirm New Password",
      changePw: "Update Password",
      pwSuccess: "Password changed successfully!",
      pwError: "Failed to change password. Check your current password.",
      pwMismatch: "New passwords do not match.",
      pwTooShort: "Password must be at least 6 characters.",
      logout: "Logout",
      hello: "Hello",
    },
    bs: {
      title: "Moj Profil",
      orders: "Moje Narudžbe",
      inquiries: "Upiti",
      cart: "Korpa",
      password: "Promjena Šifre",
      noOrders: "Nemate narudžbi.",
      orderDate: "Datum",
      orderTotal: "Ukupno",
      orderStatus: "Status",
      orderItems: "Artikli",
      viewDetails: "Detalji",
      hide: "Sakrij",
      statusPending: "Na čekanju",
      statusProcessing: "U obradi",
      statusShipped: "Poslano",
      statusDelivered: "Dostavljeno",
      sendMessage: "Pošalji Poruku",
      yourMessages: "Vaši Upiti",
      noMessages: "Niste poslali nijedan upit.",
      adminReply: "Odgovor Carbon.ez:",
      noReply: "Čeka se odgovor...",
      name: "Ime i Prezime",
      email: "Email",
      phone: "Telefon (opcionalno)",
      message: "Poruka",
      send: "Pošalji",
      messageSent: "Poruka uspješno poslana!",
      cartEmpty: "Vaša korpa je prazna.",
      cartTotal: "Ukupno",
      goToCart: "Idi na Plaćanje",
      remove: "Ukloni",
      currentPw: "Trenutna Šifra",
      newPw: "Nova Šifra",
      confirmPw: "Potvrdi Novu Šifru",
      changePw: "Promijeni Šifru",
      pwSuccess: "Šifra uspješno promijenjena!",
      pwError: "Greška. Provjerite trenutnu šifru.",
      pwMismatch: "Nove šifre se ne podudaraju.",
      pwTooShort: "Šifra mora imati najmanje 6 znakova.",
      logout: "Odjava",
      hello: "Zdravo",
    },
  };

  const td = (key) => dashTrans[lang]?.[key] ?? dashTrans.en[key];

  const statusIcon = (status) => {
    switch (status) {
      case "shipped": return <Truck size={14} className="inline mr-1" />;
      case "delivered": return <CheckCircle size={14} className="inline mr-1" />;
      case "processing": return <Package size={14} className="inline mr-1" />;
      default: return <Clock size={14} className="inline mr-1" />;
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "delivered": return "bg-green-100 text-green-700";
      case "shipped": return "bg-blue-100 text-blue-700";
      case "processing": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  const statusLabel = (status) => {
    const map = {
      pending: td("statusPending"),
      processing: td("statusProcessing"),
      shipped: td("statusShipped"),
      delivered: td("statusDelivered"),
    };
    return map[status] ?? status;
  };

  const tabs = [
    { id: "orders", label: td("orders"), icon: ShoppingBag },
    { id: "inquiries", label: td("inquiries"), icon: MessageSquare },
    { id: "cart", label: td("cart"), icon: ShoppingCart },
    { id: "password", label: td("password"), icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-extrabold text-black">
              {td("hello")},{" "}
              <span className="text-primary">{user.name}</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">{user.email}</p>
          </div>
          <button
            onClick={() => { logout(); navigate("/"); }}
            className="text-sm font-semibold text-secondary hover:text-primary transition-colors flex items-center gap-1"
          >
            <X size={16} /> {td("logout")}
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex gap-1 mb-8 bg-white rounded-xl shadow-sm border border-gray-100 p-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold whitespace-nowrap transition-all flex-1 justify-center ${
                  activeTab === tab.id
                    ? "bg-primary text-black shadow"
                    : "text-gray-500 hover:text-black hover:bg-gray-50"
                }`}
              >
                <Icon size={16} />
                {tab.label}
                {tab.id === "cart" && cart.length > 0 && (
                  <span className="ml-1 bg-black text-primary text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cart.reduce((a, i) => a + i.quantity, 0)}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {activeTab === "orders" && (
          <div className="space-y-4">
            {ordersLoading ? (
              <div className="text-center py-16 text-gray-400">
                <Package size={40} className="mx-auto mb-3 opacity-40" />
                <p>Loading...</p>
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                <ShoppingBag size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">{td("noOrders")}</p>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between p-5 gap-3">
                    <div className="flex flex-col gap-1">
                      <span className="font-bold text-black text-sm">
                        Order #{order.id}
                      </span>
                      <span className="text-gray-400 text-xs">
                        {new Date(order.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor(order.status)}`}
                      >
                        {statusIcon(order.status)}
                        {statusLabel(order.status)}
                      </span>
                      <span className="font-bold text-black">
                        €{Number(order.total).toFixed(2)}
                      </span>
                      <button
                        onClick={() =>
                          setExpandedOrder(
                            expandedOrder === order.id ? null : order.id
                          )
                        }
                        className="flex items-center gap-1 text-xs text-primary font-semibold hover:underline"
                      >
                        {expandedOrder === order.id ? td("hide") : td("viewDetails")}
                        <ChevronRight
                          size={14}
                          className={`transition-transform ${expandedOrder === order.id ? "rotate-90" : ""}`}
                        />
                      </button>
                    </div>
                  </div>

                  {expandedOrder === order.id && (
                    <div className="border-t border-gray-100 p-5 bg-gray-50">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-3 tracking-wide">
                        {td("orderItems")}
                      </p>
                      <div className="space-y-3">
                        {(order.items || []).map((item, idx) => (
                          <div
                            key={idx}
                            className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-100"
                          >
                            {item.image && (
                              <img
                                src={item.image}
                                alt={item.name}
                                className="w-12 h-12 object-cover rounded"
                              />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-black truncate">
                                {item.name}
                              </p>
                              <p className="text-gray-500 text-xs">
                                €{Number(item.price).toFixed(2)} × {item.quantity}
                              </p>
                            </div>
                            <p className="font-bold text-sm text-black">
                              €{(Number(item.price) * item.quantity).toFixed(2)}
                            </p>
                          </div>
                        ))}
                      </div>
                      {order.shipping_address && (
                        <div className="mt-4 text-xs text-gray-500">
                          <span className="font-semibold text-gray-700">
                            {lang === "bs" ? "Dostava:" : "Shipping:"}{" "}
                          </span>
                          {order.shipping_name}, {order.shipping_address},{" "}
                          {order.shipping_city} {order.shipping_zip},{" "}
                          {order.shipping_country}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* ── INQUIRIES TAB ─────────────────────────────────────── */}
        {activeTab === "inquiries" && (
          <div className="space-y-6">
            {/* Send new message */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-black mb-5 flex items-center gap-2">
                <Send size={18} className="text-primary" />
                {td("sendMessage")}
              </h2>
              {msgSuccess && (
                <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
                  <CheckCircle size={16} /> {msgSuccess}
                </div>
              )}
              <form onSubmit={handleSendMessage} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {td("name")}
                    </label>
                    <input
                      className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      value={msgName}
                      onChange={(e) => setMsgName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {td("email")}
                    </label>
                    <input
                      type="email"
                      className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                      value={msgEmail}
                      onChange={(e) => setMsgEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {td("phone")}
                  </label>
                  <input
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    value={msgPhone}
                    onChange={(e) => setMsgPhone(e.target.value)}
                    placeholder="+387 61 123 456"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {td("message")}
                  </label>
                  <textarea
                    rows={4}
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                    value={msgText}
                    onChange={(e) => setMsgText(e.target.value)}
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={msgSending}
                  className="bg-primary text-black px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-yellow-400 transition-colors disabled:opacity-60 flex items-center gap-2"
                >
                  <Send size={15} />
                  {msgSending ? "..." : td("send")}
                </button>
              </form>
            </div>

            {/* Existing messages / replies */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-bold text-black mb-5 flex items-center gap-2">
                <MessageSquare size={18} className="text-primary" />
                {td("yourMessages")}
              </h2>
              {messagesLoading ? (
                <p className="text-gray-400 text-sm">Loading...</p>
              ) : messages.length === 0 ? (
                <p className="text-gray-400 text-sm">{td("noMessages")}</p>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className="border border-gray-100 rounded-xl p-4 bg-gray-50"
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-sm text-black font-medium leading-snug">
                          {msg.message}
                        </p>
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {new Date(msg.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      {msg.phone && (
                        <p className="text-xs text-gray-400 mb-2">
                          📞 {msg.phone}
                        </p>
                      )}
                      <div
                        className={`mt-3 rounded-lg px-4 py-3 text-sm ${
                          msg.reply
                            ? "bg-primary/10 border border-primary/20"
                            : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {msg.reply ? (
                          <>
                            <p className="font-semibold text-xs text-gray-600 mb-1">
                              {td("adminReply")}
                            </p>
                            <p className="text-gray-800">{msg.reply}</p>
                          </>
                        ) : (
                          <p className="flex items-center gap-1.5 italic">
                            <AlertCircle size={13} />
                            {td("noReply")}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "cart" && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">{td("cartEmpty")}</p>
              </div>
            ) : (
              <>
                <div className="divide-y divide-gray-100">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-4 p-5"
                    >
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-black text-sm truncate">
                          {item.name}
                        </p>
                        <p className="text-gray-500 text-xs mt-0.5">
                          €{Number(item.price).toFixed(2)} × {item.quantity}
                        </p>
                      </div>
                      <p className="font-bold text-black text-sm">
                        €{(Number(item.price) * item.quantity).toFixed(2)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-red-400 hover:text-red-600 p-1.5"
                        title={td("remove")}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
                <div className="bg-gray-50 p-5 flex items-center justify-between border-t border-gray-100">
                  <div>
                    <p className="text-sm text-gray-500">{td("cartTotal")}</p>
                    <p className="text-2xl font-extrabold text-black">
                      €{cartTotal.toFixed(2)}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate("/cart")}
                    className="bg-primary text-black px-6 py-3 rounded-lg font-bold text-sm hover:bg-yellow-400 transition-colors"
                  >
                    {td("goToCart")}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {activeTab === "password" && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 max-w-md">
            <h2 className="text-lg font-bold text-black mb-6 flex items-center gap-2">
              <Lock size={18} className="text-primary" />
              {td("password")}
            </h2>

            {pwSuccess && (
              <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
                <CheckCircle size={16} /> {pwSuccess}
              </div>
            )}
            {pwError && (
              <div className="mb-4 bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm flex items-center gap-2">
                <AlertCircle size={16} /> {pwError}
              </div>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
              {/* Current password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {td("currentPw")}
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPw ? "text" : "password"}
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm pr-10 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPw(!showCurrentPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* New password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {td("newPw")}
                </label>
                <div className="relative">
                  <input
                    type={showNewPw ? "text" : "password"}
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm pr-10 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPw(!showNewPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>

              {/* Confirm password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {td("confirmPw")}
                </label>
                <input
                  type="password"
                  className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                  value={confirmPw}
                  onChange={(e) => setConfirmPw(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={pwLoading}
                className="w-full bg-primary text-black py-3 rounded-lg font-bold text-sm hover:bg-yellow-400 transition-colors disabled:opacity-60"
              >
                {pwLoading ? "..." : td("changePw")}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
