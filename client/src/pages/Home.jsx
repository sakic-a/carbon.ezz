import { Link } from "react-router-dom";
import { ArrowRight, Wrench, Award, DraftingCompass, ChevronRight } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";
import { useShop } from "../context/ShopContext";
import ProductCard from "../components/ProductCard";

const services = [
  { Icon: Wrench,          titleKey: "s1_title", descKey: "s1_desc" },
  { Icon: Award,           titleKey: "s2_title", descKey: "s2_desc" },
  { Icon: DraftingCompass, titleKey: "s3_title", descKey: "s3_desc" },
];

// carbon fiber CSS pattern — no image needed
const carbonBg = {
  backgroundColor: "#0a0a0a",
  backgroundImage: `
    repeating-linear-gradient(45deg,  rgba(255,255,255,0.018) 0, rgba(255,255,255,0.018) 1px, transparent 0, transparent 50%),
    repeating-linear-gradient(-45deg, rgba(255,255,255,0.018) 0, rgba(255,255,255,0.018) 1px, transparent 0, transparent 50%)
  `,
  backgroundSize: "6px 6px",
};

export default function Home() {
  const { t, lang } = useLanguage();
  const { products } = useShop();
  const featured = products.slice(0, 3);

  return (
    <>
      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="hp-hero" style={carbonBg}>
        <div className="hp-hero__content">
          <span className="hp-hero__tag">Visoko, Bosnia &amp; Herzegovina</span>
          <h1 className="hp-hero__h1">{t("hero", "title")}</h1>
          <p className="hp-hero__sub">{t("hero", "subtitle")}</p>
          <div className="hp-hero__btns">
            <Link to="/configurator" className="hp-btn-primary hp-btn-primary--pulse">
              {t("home", "configureYours")} <ArrowRight size={15} />
            </Link>
            <Link to="/shop" className="hp-btn-ghost">
              {t("hero", "cta")} <ChevronRight size={15} />
            </Link>
          </div>
        </div>

        {/* decorative vertical line + label */}
        <div className="hp-hero__deco">
          <div className="hp-hero__deco-line" />
          <span className="hp-hero__deco-text">Carbon.ez</span>
          <div className="hp-hero__deco-line" />
        </div>
      </section>

      {/* ── THIN ACCENT BAR ──────────────────────────────────────── */}
      <div className="hp-accent-bar">
        <span>{lang === "bs" ? "Preciznost" : "Precision"}</span>
        <span className="hp-accent-bar__dot" />
        <span>{lang === "bs" ? "Premium Materijali" : "Premium Materials"}</span>
        <span className="hp-accent-bar__dot" />
        <span>{lang === "bs" ? "Dizajn po mjeri" : "Custom Design"}</span>
        <span className="hp-accent-bar__dot" />
        <span>{lang === "bs" ? "Ručna Izrada" : "Handcrafted"}</span>
      </div>

      {/* ── WHY CHOOSE ───────────────────────────────────────────── */}
      <section className="hp-section hp-section--white">
        <div className="container mx-auto px-6">
          <p className="hp-label">{lang === "bs" ? "Zašto mi?" : "Why us"}</p>
          <h2 className="hp-section__title">{t("services", "title")}</h2>
          <div className="hp-services">
            {services.map(({ Icon, titleKey, descKey }, i) => (
              <div key={titleKey} className="hp-service">
                <div className="hp-service__top">
                  <span className="hp-service__n">0{i + 1}</span>
                  <Icon size={22} className="hp-service__icon" />
                </div>
                <h3 className="hp-service__title">{t("services", titleKey)}</h3>
                <p className="hp-service__desc">{t("services", descKey)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CONFIGURATOR CTA ─────────────────────────────────────── */}
      <section className="hp-cta" style={carbonBg}>
        <div className="container mx-auto px-6 hp-cta__inner">
          <div>
            <p className="hp-label hp-label--light">
              {lang === "bs" ? "Alat" : "Tool"}
            </p>
            <h2 className="hp-cta__title">{t("home", "designTitle")}</h2>
            <p className="hp-cta__sub">{t("home", "designSubtitle")}</p>
            <Link to="/configurator" className="hp-btn-primary">
              {t("home", "launchConfigurator")} <ArrowRight size={15} />
            </Link>
          </div>
          <div className="hp-cta__stats">
            {[
              { n: "100%", l: lang === "bs" ? "OEM Fitment" : "OEM Fitment" },
              { n: "5+",   l: lang === "bs" ? "Godine" : "Years" },
            ].map(({ n, l }) => (
              <div key={l} className="hp-stat">
                <span className="hp-stat__n">{n}</span>
                <span className="hp-stat__l">{l}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────────────────────────────── */}
      <section className="hp-section hp-section--gray">
        <div className="container mx-auto px-6">
          <div style={{ textAlign: "center", marginBottom: 52 }}>
            <p className="hp-label">{lang === "bs" ? "Ponuda" : "Shop"}</p>
            <h2 className="hp-section__title" style={{ marginBottom: 0 }}>{t("shop", "title")}</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
          <div style={{ textAlign: "center", marginTop: 40 }}>
            <Link
              to="/shop"
              className="hp-btn-outline"
              onClick={() => sessionStorage.removeItem("shopScrollY")}
            >
              {t("shop", "viewAll")} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        /* ── HERO ────────────────────────────── */
        .hp-hero {
          position: relative;
          min-height: 86vh;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: #fff;
          padding: 100px 24px 80px;
          border-bottom: 1px solid #1a1a1a;
        }
        .hp-hero__content { max-width: 1000px; }
        .hp-hero__tag {
          display: inline-block;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: rgba(255,255,255,0.35);
          margin-bottom: 40px;
        }
        .hp-hero__h1 {
          font-size: clamp(48px, 6vw, 88px);
          font-weight: 900;
          letter-spacing: -0.04em;
          line-height: 1.0;
          color: #fff;
          margin-bottom: 36px;
        }
        .hp-hero__sub {
          font-size: 1.05rem;
          color: rgba(255,255,255,0.42);
          line-height: 1.8;
          margin-bottom: 56px;
        }
        .hp-hero__btns {
          display: flex;
          gap: 12px;
          justify-content: center;
          flex-wrap: wrap;
        }

        /* decorative */
        .hp-hero__deco {
          position: absolute;
          bottom: 28px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          align-items: center;
          gap: 12px;
          opacity: 0.25;
        }
        .hp-hero__deco-line {
          width: 40px;
          height: 1px;
          background: #fff;
        }
        .hp-hero__deco-text {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #fff;
        }

        /* ── ACCENT BAR ──────────────────────── */
        .hp-accent-bar {
          background: #facc15;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          padding: 13px 24px;
          flex-wrap: wrap;
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: #000;
        }
        .hp-accent-bar__dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: rgba(0,0,0,0.3);
          flex-shrink: 0;
        }

        /* ── SHARED BUTTONS ──────────────────── */
        .hp-btn-primary {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: #facc15;
          color: #000;
          font-weight: 800;
          font-size: 0.88rem;
          padding: 13px 28px;
          border-radius: 6px;
          text-decoration: none;
          transition: background 0.18s, transform 0.18s;
        }
        .hp-btn-primary:hover { background: #fde047; transform: translateY(-1px); }
        .hp-btn-primary--pulse {
          box-shadow: 0 0 0 0 rgba(250,204,21,0.6);
          animation: hp-pulse 2.4s ease-in-out infinite;
        }
        @keyframes hp-pulse {
          0%   { box-shadow: 0 0 0 0   rgba(250,204,21,0.55); }
          60%  { box-shadow: 0 0 0 12px rgba(250,204,21,0); }
          100% { box-shadow: 0 0 0 0   rgba(250,204,21,0); }
        }

        .hp-btn-ghost {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: transparent;
          color: rgba(255,255,255,0.6);
          font-weight: 600;
          font-size: 0.88rem;
          padding: 13px 24px;
          border-radius: 6px;
          border: 1px solid rgba(255,255,255,0.12);
          text-decoration: none;
          transition: border-color 0.18s, color 0.18s;
        }
        .hp-btn-ghost:hover { border-color: rgba(255,255,255,0.35); color: #fff; }

        .hp-btn-outline {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          background: transparent;
          color: #111;
          font-weight: 700;
          font-size: 0.85rem;
          padding: 11px 22px;
          border-radius: 6px;
          border: 1.5px solid #ddd;
          text-decoration: none;
          transition: border-color 0.18s;
          white-space: nowrap;
          align-self: flex-start;
          margin-top: 6px;
        }
        .hp-btn-outline:hover { border-color: #999; }

        /* ── SECTION BASE ────────────────────── */
        .hp-section { padding: 88px 0; }
        .hp-section--white { background: #fff; }
        .hp-section--gray  { background: #f6f6f6; }

        .hp-label {
          font-size: 0.68rem;
          font-weight: 800;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: #facc15;
          margin-bottom: 10px;
        }
        .hp-label--light { color: rgba(250,204,21,0.85); }

        .hp-section__title {
          font-size: clamp(1.6rem, 3vw, 2.2rem);
          font-weight: 900;
          color: #111;
          letter-spacing: -0.025em;
          margin-bottom: 52px;
          line-height: 1.15;
        }

        /* ── SERVICES ────────────────────────── */
        .hp-services {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1px;
          background: #ebebeb;
          border: 1px solid #ebebeb;
          border-radius: 12px;
          overflow: hidden;
        }
        @media (max-width: 768px) {
          .hp-services { grid-template-columns: 1fr; }
        }
        .hp-service {
          background: #fff;
          padding: 36px 30px;
          transition: background 0.2s;
        }
        .hp-service:hover { background: #fafafa; }
        .hp-service__top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 20px;
        }
        .hp-service__n {
          font-size: 0.65rem;
          font-weight: 900;
          letter-spacing: 0.12em;
          color: #facc15;
        }
        .hp-service__icon { color: #111; }
        .hp-service__title {
          font-size: 1.4rem;
          font-weight: 800;
          color: #111;
          margin-bottom: 10px;
        }
        .hp-service__desc {
          font-size: 0.95rem;
          color: #6b7280;
          line-height: 1.7;
        }

        /* ── CTA ─────────────────────────────── */
        .hp-cta {
          border-top: 1px solid #1a1a1a;
          border-bottom: 1px solid #1a1a1a;
          padding: 88px 0;
          color: #fff;
        }
        .hp-cta__inner {
          display: grid;
          grid-template-columns: 1fr auto;
          align-items: center;
          gap: 60px;
        }
        @media (max-width: 768px) {
          .hp-cta__inner { grid-template-columns: 1fr; gap: 40px; }
        }
        .hp-cta__title {
          font-size: clamp(1.7rem, 3vw, 2.4rem);
          font-weight: 900;
          letter-spacing: -0.03em;
          color: #fff;
          margin-bottom: 14px;
          line-height: 1.15;
        }
        .hp-cta__sub {
          font-size: 0.93rem;
          color: rgba(255,255,255,0.4);
          margin-bottom: 32px;
          line-height: 1.75;
          max-width: 420px;
        }
        .hp-stat {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          padding: 0 24px;
          border-left: 1px solid #222;
          text-align: center;
        }
        .hp-stat:first-child { border-left: none; }
        .hp-cta__stats {
          display: flex;
          gap: 0;
        }
        @media (max-width: 640px) {
          .hp-cta__stats { justify-content: flex-start; }
        }
        .hp-stat__n {
          font-size: 1.8rem;
          font-weight: 900;
          color: #facc15;
          line-height: 1;
        }
        .hp-stat__l {
          font-size: 0.7rem;
          font-weight: 600;
          color: rgba(255,255,255,0.35);
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }


      `}</style>
    </>
  );
}
