import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useShop } from "../context/ShopContext";
import { useLanguage } from "../context/LanguageContext";
import { useNavigate, useSearchParams, Link } from "react-router-dom";
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
  User,
  Search,
  TrendingUp,
  Star,
  Sliders,
  LogOut,
} from "lucide-react";

const API = "/api";

export default function UserDashboard() {
  const { user, logout, getToken } = useAuth();
  const { cart, removeFromCart } = useShop();
  const { t, lang } = useLanguage();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const urlTab = searchParams.get("tab");
  const orderSuccess = searchParams.get("success") === "1";

  const [activeTab, setActiveTab] = useState(urlTab || "orders");
  const [showOrderSuccess, setShowOrderSuccess] = useState(orderSuccess);

  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);
  
  const [orderFilter, setOrderFilter] = useState("all");
  const [orderSearch, setOrderSearch] = useState("");

  const [messages, setMessages] = useState([]);
  const [messagesLoading, setMessagesLoading] = useState(true);
  const [configInquiries, setConfigInquiries] = useState([]);
  const [configInquiriesLoading, setConfigInquiriesLoading] = useState(true);
  const [msgText, setMsgText] = useState("");
  const [msgPhone, setMsgPhone] = useState("");
  const [msgName, setMsgName] = useState("");
  const [msgEmail, setMsgEmail] = useState("");
  const [msgSending, setMsgSending] = useState(false);
  const [msgSuccess, setMsgSuccess] = useState("");

  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const [newInquiriesCount, setNewInquiriesCount] = useState(0);

  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwSuccess, setPwSuccess] = useState("");
  const [pwError, setPwError] = useState("");

  const fetchOrders = () => {
    if (!user) return;
    setOrdersLoading(true);
    fetch(`${API}/orders/user/${encodeURIComponent(user.email)}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json();
      })
      .then((data) => {
        const orderList = Array.isArray(data) ? data : [];
        setOrders(orderList);
        setOrdersLoading(false);

        // Check for new order updates
        const storedKey = `read_orders_status_${user.email}`;
        let storedStatuses = {};
        try {
          storedStatuses = JSON.parse(localStorage.getItem(storedKey)) || {};
        } catch (e) {}

        let newCount = 0;
        orderList.forEach((o) => {
          const prevStatus = storedStatuses[o.id];
          const isFirstLoad = Object.keys(storedStatuses).length === 0;
          if (!isFirstLoad && (!prevStatus || prevStatus !== o.status)) {
            newCount++;
          }
        });
        setNewOrdersCount(newCount);

        if (activeTab === "orders") {
          const newStatuses = {};
          orderList.forEach((o) => {
            newStatuses[o.id] = o.status;
          });
          localStorage.setItem(storedKey, JSON.stringify(newStatuses));
          setNewOrdersCount(0);
          window.dispatchEvent(new Event("dashboard-updates-read"));
        }
      })
      .catch(() => setOrdersLoading(false));
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  useEffect(() => {
    if (!user) return;
    setMessagesLoading(true);
    fetch(`${API}/messages/user/${encodeURIComponent(user.email)}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json();
      })
      .then((data) => {
        const msgList = Array.isArray(data) ? data : [];
        setMessages(msgList);
        setMessagesLoading(false);

        // Check for new message replies
        const storedKey = `seen_messages_replies_${user.email}`;
        let storedReplies = {};
        try {
          storedReplies = JSON.parse(localStorage.getItem(storedKey)) || {};
        } catch (e) {}

        let newCount = 0;
        msgList.forEach((m) => {
          if (m.reply) {
            const prevReply = storedReplies[m.id];
            if (prevReply !== m.reply) {
              newCount++;
            }
          }
        });
        setNewMessagesCount(newCount);

        if (activeTab === "inquiries") {
          const newReplies = {};
          msgList.forEach((m) => {
            if (m.reply) {
              newReplies[m.id] = m.reply;
            }
          });
          localStorage.setItem(storedKey, JSON.stringify(newReplies));
          setNewMessagesCount(0);
          window.dispatchEvent(new Event("dashboard-updates-read"));
        }
      })
      .catch(() => setMessagesLoading(false));
  }, [user]);

  const fetchConfigInquiries = () => {
    if (!user) return;
    setConfigInquiriesLoading(true);
    fetch(`${API}/configurator-inquiries/user/${encodeURIComponent(user.email)}`, {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error(`${r.status}`);
        return r.json();
      })
      .then((data) => {
        const inqList = Array.isArray(data) ? data : [];
        setConfigInquiries(inqList);
        setConfigInquiriesLoading(false);

        // Check for new configurator inquiry replies
        const storedKey = `seen_config_replies_${user.email}`;
        let storedReplies = {};
        try {
          storedReplies = JSON.parse(localStorage.getItem(storedKey)) || {};
        } catch (e) {}

        let newCount = 0;
        inqList.forEach((inq) => {
          if (inq.reply) {
            const prevReply = storedReplies[inq.id];
            if (prevReply !== inq.reply) {
              newCount++;
            }
          }
        });
        setNewInquiriesCount(newCount);

        if (activeTab === "configurator") {
          const newReplies = {};
          inqList.forEach((inq) => {
            if (inq.reply) {
              newReplies[inq.id] = inq.reply;
            }
          });
          localStorage.setItem(storedKey, JSON.stringify(newReplies));
          setNewInquiriesCount(0);
          window.dispatchEvent(new Event("dashboard-updates-read"));
        }
      })
      .catch(() => setConfigInquiriesLoading(false));
  };

  useEffect(() => {
    fetchConfigInquiries();
  }, [user]);

  // Sync notification badges when activeTab changes
  useEffect(() => {
    if (!user) return;
    let didChange = false;
    if (activeTab === "orders" && orders.length > 0) {
      const storedKey = `read_orders_status_${user.email}`;
      const newStatuses = {};
      orders.forEach((o) => {
        newStatuses[o.id] = o.status;
      });
      localStorage.setItem(storedKey, JSON.stringify(newStatuses));
      setNewOrdersCount(0);
      didChange = true;
    }
    if (activeTab === "inquiries" && messages.length > 0) {
      const storedKey = `seen_messages_replies_${user.email}`;
      const newReplies = {};
      messages.forEach((m) => {
        if (m.reply) {
          newReplies[m.id] = m.reply;
        }
      });
      localStorage.setItem(storedKey, JSON.stringify(newReplies));
      setNewMessagesCount(0);
      didChange = true;
    }
    if (activeTab === "configurator" && configInquiries.length > 0) {
      const storedKey = `seen_config_replies_${user.email}`;
      const newReplies = {};
      configInquiries.forEach((inq) => {
        if (inq.reply) {
          newReplies[inq.id] = inq.reply;
        }
      });
      localStorage.setItem(storedKey, JSON.stringify(newReplies));
      setNewInquiriesCount(0);
      didChange = true;
    }
    if (didChange) {
      window.dispatchEvent(new Event("dashboard-updates-read"));
    }
  }, [activeTab, orders, messages, configInquiries, user]);

  useEffect(() => {
    if (user) {
      setMsgName(user.name || "");
      setMsgEmail(user.email || "");
    }
  }, [user]);

  useEffect(() => {
    if (showOrderSuccess) {
      const t = setTimeout(() => setShowOrderSuccess(false), 5000);
      return () => clearTimeout(t);
    }
  }, [showOrderSuccess]);

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
        setMsgName(user?.name || "");
        setMsgEmail(user?.email || "");
        const updated = await fetch(
          `${API}/messages/user/${encodeURIComponent(user.email)}`,
          { headers: { Authorization: `Bearer ${getToken()}` } }
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
    if (newPw !== confirmPw) { setPwError(td("pwMismatch")); return; }
    if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/.test(newPw)) { setPwError(td("pwTooShort")); return; }
    setPwLoading(true);
    try {
      const res = await fetch(`${API}/auth/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ email: user.email, currentPassword: currentPw, newPassword: newPw }),
      });
      const data = await res.json();
      if (res.ok) {
        setPwSuccess(td("pwSuccess"));
        setCurrentPw(""); setNewPw(""); setConfirmPw("");
      } else {
        setPwError(data.error || td("pwError"));
      }
    } catch (err) {
      setPwError(td("pwError"));
    }
    setPwLoading(false);
  };

  
  const dashTrans = {
    en: {
      title: "My Account", orders: "My Orders", inquiries: "Messages",
      configInquiries: "Design Inquiries", noConfigInquiries: "You have no custom design inquiries yet.",
      cart: "Cart", password: "Change Password", noOrders: "You have no orders yet.",
      orderDate: "Date", orderTotal: "Total", orderStatus: "Status", orderItems: "Items",
      viewDetails: "View Details", hide: "Hide",
      statusPending: "Pending", statusApproved: "Approved", statusDeclined: "Declined",
      sendMessage: "Send a Message", yourMessages: "Your Messages",
      noMessages: "You haven't sent any messages yet.",
      adminReply: "Reply from Carbon.ez:", noReply: "Awaiting reply...",
      name: "Full Name", email: "Email", phone: "Phone Number", message: "Message",
      send: "Send", messageSent: "Message sent successfully!",
      cartEmpty: "Your cart is empty.", cartTotal: "Total",
      goToCart: "Go to Checkout", remove: "Remove",
      currentPw: "Current Password", newPw: "New Password",
      confirmPw: "Confirm New Password", changePw: "Update Password",
      pwSuccess: "Password changed successfully!",
      pwError: "Failed to change password. Check your current password.",
      pwMismatch: "New passwords do not match.", pwTooShort: "Password must be 8+ characters with uppercase, lowercase, number and special character (!@#$%^&*).",
      logout: "Logout", hello: "Hello",
      orderSuccessBanner: "Your order was placed successfully!",
      filterAll: "All", filterPending: "Pending", filterApproved: "Approved", filterDeclined: "Declined",
      searchOrders: "Search orders...", 
      memberSince: "Member since",
      refresh: "Refresh Orders",
    },
    bs: {
      title: "Moj Profil", orders: "Moje Narudžbe", inquiries: "Poruke",
      configInquiries: "Upiti za dizajn", noConfigInquiries: "Nemate upita za dizajn.",
      cart: "Korpa", password: "Promjena Šifre", noOrders: "Nemate narudžbi.",
      orderDate: "Datum", orderTotal: "Ukupno", orderStatus: "Status", orderItems: "Artikli",
      viewDetails: "Detalji", hide: "Sakrij",
      statusPending: "Na čekanju", statusApproved: "Odobreno", statusDeclined: "Odbijeno",
      sendMessage: "Pošalji Poruku", yourMessages: "Vaše Poruke",
      noMessages: "Niste poslali nijedan upit.",
      adminReply: "Odgovor Carbon.ez:", noReply: "Čeka se odgovor...",
      name: "Ime i Prezime", email: "Email", phone: "Broj telefona", message: "Poruka",
      send: "Pošalji", messageSent: "Poruka uspješno poslana!",
      cartEmpty: "Vaša korpa je prazna.", cartTotal: "Ukupno",
      goToCart: "Idi na Plaćanje", remove: "Ukloni",
      currentPw: "Trenutna Šifra", newPw: "Nova Šifra",
      confirmPw: "Potvrdi Novu Šifru", changePw: "Promijeni Šifru",
      pwSuccess: "Šifra uspješno promijenjena!",
      pwError: "Greška. Provjerite trenutnu šifru.",
      pwMismatch: "Nove šifre se ne podudaraju.", pwTooShort: "Šifra mora imati 8+ znakova, veliko slovo, broj i poseban znak (!@#$%^&*).",
      logout: "Odjava", hello: "Zdravo",
      orderSuccessBanner: "Vaša narudžba je uspješno primljena!",
      filterAll: "Sve", filterPending: "Na čekanju", filterApproved: "Odobreno", filterDeclined: "Odbijeno",
      searchOrders: "Pretraži narudžbe...", 
       memberSince: "Član od",
      refresh: "Osvježi narudžbe",
    },
  };

  const td = (key) => dashTrans[lang]?.[key] ?? dashTrans.en[key];


  const formatDate = (value) => {
    if (!value) return "—";
    const d = new Date(value);
    return isNaN(d.getTime()) ? "—" : d.toLocaleDateString(lang === "bs" ? "bs-BA" : "en-GB");
  };

  const statusIcon = (status) => {
    switch (status) {
      case "Approved": return <CheckCircle size={14} className="inline mr-1" />;
      case "Declined": return <AlertCircle size={14} className="inline mr-1" />;
      default: return <Clock size={14} className="inline mr-1" />;
    }
  };

  const statusColor = (status) => {
    switch (status) {
      case "Approved": return "bg-green-100 text-green-700";
      case "Declined": return "bg-red-100 text-red-700";
      default: return "bg-yellow-100 text-yellow-800";
    }
  };

  const statusLabel = (status) => {
    const map = {
      Pending: td("statusPending"),
      Approved: td("statusApproved"),
      Declined: td("statusDeclined"),
    };
    return map[status] ?? status ?? td("statusPending");
  };

 
  const filteredOrders = orders.filter((o) => {
    const matchesStatus = orderFilter === "all" || o.status === orderFilter;
    const matchesSearch =
      orderSearch === "" ||
      String(o.id).includes(orderSearch) ||
      (o.items || []).some((i) =>
        i.name.toLowerCase().includes(orderSearch.toLowerCase()) ||
        (i.name_bs || "").toLowerCase().includes(orderSearch.toLowerCase())
      );
    return matchesStatus && matchesSearch;
  });

  const tabs = [
    { id: "orders", label: td("orders"), icon: ShoppingBag },
    { id: "inquiries", label: td("inquiries"), icon: MessageSquare },
    { id: "configurator", label: td("configInquiries"), icon: Sliders },
    { id: "cart", label: td("cart"), icon: ShoppingCart },
    { id: "password", label: td("password"), icon: Lock },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <div className="container mx-auto px-4 max-w-5xl">

        {showOrderSuccess && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 rounded-xl px-5 py-4 flex items-center justify-between gap-3 shadow-sm">
            <div className="flex items-center gap-2">
              <CheckCircle size={20} className="text-green-600 flex-shrink-0" />
              <span className="font-semibold text-sm">{td("orderSuccessBanner")}</span>
            </div>
            <button onClick={() => setShowOrderSuccess(false)} className="text-green-600 hover:text-green-800">
              <X size={16} />
            </button>
          </div>
        )}

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold text-black">
              {td("hello")},{" "}
              <span className="text-primary">{user.name}</span>
            </h1>
            <p className="text-gray-500 text-sm mt-1">{user.email}</p>
          </div>
          <button
            onClick={() => { logout(); navigate("/dashboard"); }}
            className="text-sm font-semibold text-secondary hover:text-primary transition-colors flex items-center gap-1"
          >
            <LogOut size={16} /> {td("logout")}
          </button>
        </div>


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
                {tab.id === "orders" && newOrdersCount > 0 && (
                  <span className="ml-1 bg-black text-primary text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {newOrdersCount}
                  </span>
                )}
                {tab.id === "inquiries" && newMessagesCount > 0 && (
                  <span className="ml-1 bg-black text-primary text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {newMessagesCount}
                  </span>
                )}
                {tab.id === "configurator" && newInquiriesCount > 0 && (
                  <span className="ml-1 bg-black text-primary text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {newInquiriesCount}
                  </span>
                )}
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
            {!ordersLoading && orders.length > 0 && (
              <div className="flex flex-col sm:flex-row gap-3 mb-2">
                <div className="relative flex-1">
                  <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={orderSearch}
                    onChange={(e) => setOrderSearch(e.target.value)}
                    placeholder={td("searchOrders")}
                    className="w-full pl-9 pr-3 py-2 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none bg-white"
                  />
                </div>
                <div className="flex gap-1 flex-wrap">
                  {["all", "Pending", "Approved", "Declined"].map((f) => (
                    <button
                      key={f}
                      onClick={() => setOrderFilter(f)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                        orderFilter === f
                          ? "bg-primary text-black"
                          : "bg-white border border-gray-200 text-gray-500 hover:border-primary"
                      }`}
                    >
                      {td(`filter${f === "all" ? "All" : f}`)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {ordersLoading ? (
              <div className="text-center py-16 text-gray-400">
                <Package size={40} className="mx-auto mb-3 opacity-40" />
                <p>Loading...</p>
              </div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                <ShoppingBag size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">
                  {orders.length === 0 ? td("noOrders") : "No orders match your filter."}
                </p>
                {orders.length === 0 && (
                  <Link
                    to="/shop"
                    className="mt-4 inline-block bg-primary text-black px-5 py-2 rounded-lg text-sm font-bold hover:bg-yellow-400 transition-colors"
                  >
                    {lang === "bs" ? "Idi u Trgovinu" : "Browse Shop"}
                  </Link>
                )}
              </div>
            ) : (
              filteredOrders.map((order) => (
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
                        {formatDate(order.created_at)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor(order.status)}`}>
                        {statusIcon(order.status)}
                        {statusLabel(order.status)}
                      </span>
                      <span className="font-bold text-black">
                        €{Number(order.total).toFixed(2)}
                      </span>
                      <button
                        onClick={() =>
                          setExpandedOrder(expandedOrder === order.id ? null : order.id)
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
                          <div key={idx} className="flex items-center gap-3 bg-white rounded-lg p-3 border border-gray-100">
                            {item.image && (
                              <img src={item.image} alt={item.name} className="w-12 h-12 object-cover rounded" />
                            )}
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-sm text-black truncate">{item.name}</p>
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
                        <div className="mt-4 text-xs text-gray-500 break-words">
                          <span className="font-semibold text-gray-700">
                            {lang === "bs" ? "Dostava: " : "Shipping: "}
                          </span>
                          {order.shipping_name}, {order.shipping_address},{" "}
                          {order.shipping_city} {order.shipping_zip},{" "}
                          {order.shipping_country}
                          {order.shipping_phone && (
                            <span className="ml-2 text-gray-600">
                              {order.shipping_phone}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))
            )}

            {!ordersLoading && (
              <div className="text-center pt-2">
                <button
                  onClick={fetchOrders}
                  className="text-xs text-gray-400 hover:text-primary transition-colors underline"
                >
                  {td("refresh")}
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === "inquiries" && (
          <div className="space-y-6">
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
                  <input
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    placeholder={td("name")}
                    value={msgName}
                    onChange={(e) => setMsgName(e.target.value)}
                    required
                  />
                  <input
                    type="email"
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    placeholder={td("email")}
                    value={msgEmail}
                    onChange={(e) => setMsgEmail(e.target.value)}
                    required
                  />
                  <input
                    type="tel"
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none sm:col-span-2"
                    placeholder={td("phone")}
                    value={msgPhone}
                    onChange={(e) => setMsgPhone(e.target.value.replace(/\D/g, ""))}
                    required
                  />
                </div>
                <textarea
                  rows={5}
                  maxLength={500}
                  className="w-full p-2.5 border border-gray-200 rounded-lg text-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none resize-none"
                  placeholder={td("message")}
                  value={msgText}
                  onChange={(e) => setMsgText(e.target.value)}
                  required
                />
                <p className="text-xs text-gray-400 text-right -mt-2">{msgText.length}/500</p>
                <button
                  type="submit"
                  disabled={msgSending}
                  className="w-full bg-primary text-black py-2.5 rounded-lg font-bold text-sm hover:bg-yellow-400 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
                >
                  <Send size={15} />
                  {msgSending ? "..." : td("send")}
                </button>
              </form>
            </div>

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
                    <div key={msg.id} className="border border-gray-100 rounded-xl p-4 bg-gray-50">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <p className="text-sm text-black font-medium leading-snug whitespace-pre-wrap break-words min-w-0">{msg.message}</p>
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {formatDate(msg.created_at)}
                        </span>
                      </div>
                      <div className={`mt-3 rounded-lg px-4 py-3 text-sm ${msg.reply ? "bg-primary/10 border border-primary/20" : "bg-gray-100 text-gray-400"}`}>
                        {msg.reply ? (
                          <>
                            <p className="font-semibold text-xs text-gray-600 mb-1">{td("adminReply")}</p>
                            <p className="text-gray-800 whitespace-pre-wrap break-words">{msg.reply}</p>
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

        {/* ── CART TAB ───────────────────────────────────────────── */}
        {activeTab === "cart" && (
          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            {cart.length === 0 ? (
              <div className="text-center py-16">
                <ShoppingCart size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500 mb-4">{td("cartEmpty")}</p>
                <Link
                  to="/shop"
                  className="inline-block bg-primary text-black px-5 py-2 rounded-lg text-sm font-bold hover:bg-yellow-400 transition-colors"
                >
                  {lang === "bs" ? "Idi u Trgovinu" : "Browse Shop"}
                </Link>
              </div>
            ) : (
              <>
                <div className="divide-y divide-gray-100">
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center gap-4 p-5">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-lg flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-black text-sm truncate">{item.name}</p>
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
                    <p className="text-2xl font-extrabold text-black">€{cartTotal.toFixed(2)}</p>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{td("currentPw")}</label>
                <div className="relative">
                  <input
                    type={showCurrentPw ? "text" : "password"}
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm pr-10 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    value={currentPw}
                    onChange={(e) => setCurrentPw(e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => setShowCurrentPw(!showCurrentPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showCurrentPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{td("newPw")}</label>
                <div className="relative">
                  <input
                    type={showNewPw ? "text" : "password"}
                    className="w-full p-2.5 border border-gray-200 rounded-lg text-sm pr-10 focus:border-primary focus:ring-1 focus:ring-primary outline-none"
                    value={newPw}
                    onChange={(e) => setNewPw(e.target.value)}
                    required
                  />
                  <button type="button" onClick={() => setShowNewPw(!showNewPw)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showNewPw ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{td("confirmPw")}</label>
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

        {activeTab === "configurator" && (
          <div className="space-y-4">
            {configInquiriesLoading ? (
              <div className="text-center py-16 text-gray-400">
                <p>Loading...</p>
              </div>
            ) : configInquiries.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-100">
                <Sliders size={48} className="mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">{td("noConfigInquiries")}</p>
                <Link
                  to="/configurator"
                  className="mt-4 inline-block bg-primary text-black px-5 py-2 rounded-lg text-sm font-bold hover:bg-yellow-400 transition-colors"
                >
                  {lang === "bs" ? "Otvori Konfigurator" : "Open Configurator"}
                </Link>
              </div>
            ) : (
              configInquiries.map((inq) => (
                <div key={inq.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 relative">
                  <div className="flex flex-col md:flex-row justify-between border-b border-gray-100 pb-4 mb-4 gap-4">
                    <div>
                      <h3 className="font-extrabold text-lg text-black capitalize">
                        {inq.selected_model} Steering Wheel
                      </h3>
                      <p className="text-sm text-gray-500 font-medium">
                        {inq.car_model}
                      </p>
                    </div>
                    <div className="text-right text-xs text-gray-400 font-semibold self-start md:self-center">
                      {formatDate(inq.created_at)}
                    </div>
                  </div>

                  <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 text-sm mb-4">
                    <h4 className="font-bold text-gray-800 mb-2 uppercase tracking-wider text-xs">
                      {lang === "bs" ? "Specifikacija:" : "Specification:"}
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-gray-600 capitalize">
                      <div>
                        <span className="font-semibold text-gray-700">Shape:</span>{" "}
                        {t("configurator", inq.wheel_shape) || inq.wheel_shape}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Top Grip:</span>{" "}
                        {t("configurator", inq.top_material) || inq.top_material}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Side Grips:</span>{" "}
                        {t("configurator", inq.side_material) || inq.side_material}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Bottom Grip:</span>{" "}
                        {t("configurator", inq.bottom_material) || inq.bottom_material}
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Stitching:</span>{" "}
                        <span className="inline-flex items-center gap-1.5 font-medium text-black">
                          <span
                            className="w-3 h-3 rounded-full border border-gray-300 inline-block"
                            style={{
                              backgroundColor:
                                inq.thread_colour === "white"
                                  ? "#ffffff"
                                  : inq.thread_colour === "black"
                                  ? "#000000"
                                  : inq.thread_colour,
                            }}
                          />
                          {inq.thread_colour}
                        </span>
                      </div>
                      <div>
                        <span className="font-semibold text-gray-700">Ring:</span>{" "}
                        {inq.ring_enabled ? (
                          <span className="inline-flex items-center gap-1.5 font-medium text-black">
                            <span
                              className="w-3 h-3 rounded-full border border-gray-300 inline-block"
                              style={{ backgroundColor: inq.ring_colour }}
                            />
                            {inq.ring_colour}
                          </span>
                        ) : (
                          "No Ring"
                        )}
                      </div>
                    </div>
                  </div>

                  {inq.notes && (
                    <div className="bg-yellow-50/50 rounded-xl p-4 border border-yellow-100 text-sm mb-4">
                      <h4 className="font-bold text-yellow-800 mb-1 uppercase tracking-wider text-xs">
                        {lang === "bs" ? "Napomena:" : "Notes:"}
                      </h4>
                      <p className="text-gray-700 italic break-words">"{inq.notes}"</p>
                    </div>
                  )}

                  <div className={`rounded-xl px-4 py-3 text-sm ${inq.reply ? "bg-primary/10 border border-primary/20" : "bg-gray-100 text-gray-400"}`}>
                    {inq.reply ? (
                      <>
                        <p className="font-semibold text-xs text-gray-600 mb-1">
                          {lang === "bs" ? "Odgovor Carbon.ez:" : "Reply from Carbon.ez:"}
                        </p>
                        <p className="text-gray-800 whitespace-pre-wrap break-words">{inq.reply}</p>
                      </>
                    ) : (
                      <p className="flex items-center gap-1.5 italic">
                        <AlertCircle size={13} />
                        {lang === "bs" ? "Čeka se odgovor na cijenu..." : "Awaiting price quote..."}
                      </p>
                    )}
                  </div>
                </div>
              ))
            )}
            {!configInquiriesLoading && (
              <div className="text-center pt-2">
                <button
                  onClick={fetchConfigInquiries}
                  className="text-xs text-gray-400 hover:text-primary transition-colors underline"
                >
                  {lang === "bs" ? "Osvježi upite" : "Refresh Inquiries"}
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
