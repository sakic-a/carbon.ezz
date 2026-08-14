import { useLanguage } from "../context/LanguageContext";
import { useShop } from "../context/ShopContext";
import { useState } from "react";
export default function About() {
  const { t, lang } = useLanguage();
  const { sendMessage } = useShop();
  const [cName, setCName] = useState("");
  const [cEmail, setCEmail] = useState("");
  const [cPhone, setCPhone] = useState("");
  const [cMessage, setCMessage] = useState("");
  const handleSendMessage = async (e) => {
    e.preventDefault();
    const ok = await sendMessage({
      name: cName,
      email: cEmail,
      phone: cPhone,
      message: cMessage,
    });
    if (ok) {
      alert(t("faq", "success"));
      setCName("");
      setCEmail("");
      setCPhone("");
      setCMessage("");
    } else {
      alert(t("faq", "error") || "Something went wrong. Please try again.");
    }
  };
  return (
    <div className="py-16 bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-3xl font-bold text-center mb-8 text-black">
          {t("nav", "about")}
        </h1>
        <div className="text-center text-lg text-gray-600 leading-relaxed mb-12">
          <p className="mb-6">{t("about", "p1")}</p>
          <p className="mb-6">{t("about", "p2")}</p>
          <p className="mb-6">{t("about", "p3")}</p>
          <p className="mb-6">{t("about", "p4")}</p>
          <p className="mb-6">{t("about", "p5")}</p>
          <p className="mb-2 font-bold">{t("about", "p6")}</p>
          <p className="font-bold text-black">{t("about", "p7")}</p>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
          <h2 className="text-2xl font-bold text-center mb-2">
            {t("faq", "contactTitle")}
          </h2>
          <p className="text-center text-gray-600 mb-6">
            {t("faq", "contactDesc")}
          </p>
          <div className="text-center mb-8 text-gray-500 text-sm">
            <p className="mb-1">
              <strong className="text-gray-700">{t("faq", "addressLabel")}:</strong> Visoko, Bosnia and Herzegovina
            </p>
            <p>
              <strong className="text-gray-700">{t("faq", "phoneLabel")}:</strong>{" "}
              <a
                href="tel:+38761353966"
                className="text-primary hover:underline font-medium transition-colors"
              >
                +387 61 353 966
              </a>
            </p>
          </div>
          <form onSubmit={handleSendMessage} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder={t("auth", "name")}
                value={cName}
                onChange={(e) => setCName(e.target.value)}
              />
              <input
                type="email"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                placeholder={t("auth", "email")}
                value={cEmail}
                onChange={(e) => setCEmail(e.target.value)}
              />
              <input
                type="tel"
                className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary md:col-span-2"
                placeholder={t("faq", "phone")}
                value={cPhone}
                onChange={(e) => setCPhone(e.target.value.replace(/[^0-9+]/g, ""))}
                required
                onInvalid={(e) =>
                  e.target.setCustomValidity(
                    lang === "bs" ? "Molimo ispunite ovo polje." : "Please fill out this field."
                  )
                }
                onInput={(e) => e.target.setCustomValidity("")}
              />
            </div>
            <textarea
              rows="5"
              className="w-full p-3 border border-gray-300 rounded focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder={t("faq", "message")}
              value={cMessage}
              onChange={(e) => setCMessage(e.target.value)}
              required
              onInvalid={(e) =>
                e.target.setCustomValidity(
                  lang === "bs" ? "Molimo ispunite ovo polje." : "Please fill out this field."
                )
              }
              onInput={(e) => e.target.setCustomValidity("")}
            ></textarea>
            <button
              type="submit"
              className="w-full bg-primary text-black py-3 rounded font-bold hover:bg-yellow-400 transition-colors"
            >
              {t("faq", "send")}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
