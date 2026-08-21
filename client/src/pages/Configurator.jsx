import { useState, useEffect } from 'react';
import { ConfiguratorProvider } from '../context/ConfiguratorContext';
import WheelPreview from '../components/configurator/WheelPreview';
import OptionsPanel from '../components/configurator/OptionsPanel';
import ZonePopover from '../components/configurator/ZonePopover';
import { useConfigurator } from '../context/ConfiguratorContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, X } from 'lucide-react';


function PriceInquiryModal({ isOpen, onClose }) {
  const { state, dispatch } = useConfigurator();
  const { user } = useAuth();
  const { submitInquiry } = useShop();
  const { t } = useLanguage();
  const navigate = useNavigate();

  const [name, setName] = useState(() => sessionStorage.getItem('inquiry_name') || user?.name || "");
  const [email, setEmail] = useState(() => sessionStorage.getItem('inquiry_email') || user?.email || "");
  const [phone, setPhone] = useState(() => sessionStorage.getItem('inquiry_phone') || "");
  const [carModel, setCarModel] = useState(() => sessionStorage.getItem('inquiry_car') || "");
  const [notes, setNotes] = useState(() => sessionStorage.getItem('inquiry_notes') || "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(prev => prev || user.name || "");
      setEmail(prev => prev || user.email || "");
    }
  }, [user]);

  useEffect(() => {
    sessionStorage.setItem('inquiry_name', name);
    sessionStorage.setItem('inquiry_email', email);
    sessionStorage.setItem('inquiry_phone', phone);
    sessionStorage.setItem('inquiry_car', carModel);
    sessionStorage.setItem('inquiry_notes', notes);
  }, [name, email, phone, carModel, notes]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login?redirect=/configurator?inquiry=true');
      return;
    }
    setLoading(true);

    const inquiryData = {
      name,
      email,
      phone,
      selectedModel: state.selectedModel,
      wheelShape: state.wheelShape,
      topMaterial: state.topMaterial,
      sideMaterial: state.sideMaterial,
      bottomMaterial: state.bottomMaterial,
      ringEnabled: state.ringEnabled,
      ringColour: state.ringColour,
      threadColour: state.threadColour,
      notes,
      carModel,
    };

    const success = await submitInquiry(inquiryData);
    setLoading(false);
    if (success) {
      sessionStorage.removeItem('inquiry_name');
      sessionStorage.removeItem('inquiry_email');
      sessionStorage.removeItem('inquiry_phone');
      sessionStorage.removeItem('inquiry_car');
      sessionStorage.removeItem('inquiry_notes');
      alert(t("configurator", "inquirySuccess"));
      dispatch({ type: 'RESET' });
      onClose();
    } else {
      alert(t("configurator", "inquiryError"));
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8 animate-fade-in relative border border-gray-100 max-h-[90vh] overflow-y-auto">
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-black transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-bold mb-2 text-black text-center">
          {t("configurator", "inquiryTitle")}
        </h2>
        <p className="text-sm text-gray-500 text-center mb-6">
          {t("configurator", "inquirySubtitle")}
        </p>

        <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100 text-sm">
          <h4 className="font-bold text-black mb-2 uppercase tracking-wider text-xs">
            {t("configurator", "yourConfig")}
          </h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-gray-600 capitalize">
            <div><span className="font-semibold">{t("configurator", "labelModel")}</span> {state.selectedModel}</div>
            <div><span className="font-semibold">{t("configurator", "labelShape")}</span> {t("configurator", state.wheelShape)}</div>
            <div><span className="font-semibold">{t("configurator", "labelTopGrip")}</span> {t("configurator", state.topMaterial)}</div>
            <div><span className="font-semibold">{t("configurator", "labelSideGrips")}</span> {t("configurator", state.sideMaterial)}</div>
            <div><span className="font-semibold">{t("configurator", "labelBottomGrip")}</span> {t("configurator", state.bottomMaterial)}</div>
            <div>
              <span className="font-semibold">{t("configurator", "labelStitching")}</span>{" "}
              <span className="inline-flex items-center gap-1.5 font-medium text-black">
                <span
                  className="w-3 h-3 rounded-full border border-gray-300 inline-block"
                  style={{ backgroundColor: state.threadColour }}
                />
                {state.threadColour}
              </span>
            </div>
            {state.ringEnabled && (
              <div className="col-span-2">
                <span className="font-semibold">{t("configurator", "labelRing")}</span>{" "}
                <span className="inline-flex items-center gap-1.5 font-medium text-black">
                  <span
                    className="w-3 h-3 rounded-full border border-gray-300 inline-block"
                    style={{ backgroundColor: state.ringColour }}
                  />
                  {state.ringColour}
                </span>
              </div>
            )}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold text-xs uppercase tracking-wider text-gray-600">
              {t("configurator", "fullName")}
            </label>
            <input
              className="w-full p-3 border border-gray-200 rounded-xl focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-sm"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-xs uppercase tracking-wider text-gray-600">
              Email
            </label>
            <input
              type="email"
              className="w-full p-3 border border-gray-200 rounded-xl focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-sm"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-xs uppercase tracking-wider text-gray-600">
              {t("configurator", "carModel")}
            </label>
            <input
              className="w-full p-3 border border-gray-200 rounded-xl focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-sm"
              required
              value={carModel}
              onChange={(e) => setCarModel(e.target.value)}
              placeholder={t("configurator", "carModelPlaceholder")}
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-xs uppercase tracking-wider text-gray-600">
              {t("configurator", "phone")}
            </label>
            <input
              type="tel"
              className="w-full p-3 border border-gray-200 rounded-xl focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-sm"
              required
              value={phone}
              onChange={(e) => {
                const val = e.target.value.replace(/[^\d\s\+\-\(\)]/g, '');
                setPhone(val);
              }}
              placeholder="+387 61 123 456"
            />
          </div>
          <div>
            <label className="block mb-1 font-semibold text-xs uppercase tracking-wider text-gray-600">
              {t("configurator", "notes")}
            </label>
            <textarea
              className="w-full p-3 border border-gray-200 rounded-xl focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-sm"
              rows="3"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder={t("configurator", "notesPlaceholder")}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-black py-4 rounded-xl font-bold text-sm hover:bg-yellow-400 transition-colors uppercase tracking-wider mt-4"
          >
            {loading ? "..." : t("configurator", "sendInquiry")}
          </button>
        </form>
      </div>
    </div>
  );
}

function ConfiguratorContent() {
  const { state, dispatch } = useConfigurator();
  const { t } = useLanguage();
  const { selectedModel } = state;
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [inquiryOpen, setInquiryOpen] = useState(false);
  const [activeZone, setActiveZone] = useState(null); // { zone, rect, anchor }

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('inquiry') === 'true') {
      setInquiryOpen(true);
      navigate('/configurator', { replace: true });
    }
  }, [location, navigate]);

  const handleZoneClick = (zone, rect, anchor) => {
    setActiveZone({ zone, rect, anchor });
  };

  const models = [
    { id: 'audi', name: 'Audi 4G S-Line / RS', image: '/wheels/audi/factory/audi_factory_base.png' },
    { id: 'bmw', name: 'BMW E90 M-Sport', image: null },
    { id: 'mercedes', name: 'Mercedes W212 AMG', image: null }
  ];

  const handleOpenInquiry = () => {
    setInquiryOpen(true);
  };

  if (!selectedModel) {
    return (
      <div className="bg-gray-50/50 min-h-screen py-16">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-extrabold text-black tracking-tight">
              {t('configurator', 'selectModel')}
            </h1>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {models.map(model => (
              <div 
                key={model.id} 
                className="bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="aspect-[4/3] bg-gray-50 rounded-xl overflow-hidden mb-6 flex items-center justify-center p-4">
                    {model.image ? (
                      <img 
                        src={model.image} 
                        alt={model.name} 
                        className="max-w-full max-h-full object-contain hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <span className="text-gray-400 font-bold uppercase tracking-wider text-xs">
                        {t('configurator', 'comingSoon')}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-black mb-6">{model.name}</h3>
                </div>
                <button
                  onClick={() => dispatch({ type: 'SET_MODEL', value: model.id })}
                  className="w-full bg-black text-white hover:bg-primary hover:text-black py-3 rounded-xl font-bold text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {t('configurator', 'configure')} <ArrowRight size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-4 pb-12">
      {/* No px-4 on the container — padding is applied per-element below */}
      <div className="container mx-auto max-w-7xl lg:max-w-6xl">
        <div className="px-4">
          <button
            onClick={() => dispatch({ type: 'SET_MODEL', value: null })}
            className="mb-6 flex items-center gap-1.5 text-sm font-semibold text-secondary hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
          >
            {t('configurator', 'backToModels')}
          </button>
        </div>

        {selectedModel === 'audi' ? (
          <div className="flex flex-col lg:flex-row lg:gap-6 lg:px-4 items-start">
            {/* Preview — full-width on mobile, naturally, no negative-margin tricks */}
            <div className="w-full lg:w-[54%] flex flex-col">
              <p className="lg:hidden px-4 text-xs text-gray-400 text-center mb-2">{t('configurator', 'tapHint')}</p>
              <div className="lg:rounded-xl overflow-hidden shadow-md bg-gray-100 relative select-none">
                <WheelPreview onZoneClick={handleZoneClick} />
              </div>
              <div className="relative w-full overflow-hidden lg:rounded-b-xl rounded-b-xl">
                <img
                  src={`/wheels/audi/thread/thread_${state.threadColour}.png`}
                  alt="Stitching thread"
                  className="w-full h-auto object-contain lg:cursor-default cursor-pointer"
                  style={{ transition: 'opacity 0.35s ease' }}
                  onClick={() => setActiveZone({ zone: 'thread' })}
                />
                {/* Watermarks for thread image */}
                <div
                  style={{
                    position: 'absolute',
                    inset: '-20%',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(5, 1fr)',
                    gridTemplateRows: 'repeat(3, 1fr)',
                    placeItems: 'center',
                    opacity: 0.28,
                    pointerEvents: 'none',
                    zIndex: 11,
                    overflow: 'hidden'
                  }}
                >
                  {Array.from({ length: 15 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        transform: 'rotate(-25deg)',
                        fontFamily: '"Inter", "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                        fontSize: 'clamp(0.4rem, 1vw, 0.8rem)',
                        fontWeight: '500',
                        color: '#fff',
                        letterSpacing: '0.15em',
                        whiteSpace: 'nowrap',
                      }}
                    >
                      carbonez.ba
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar options panel */}
            <div className="px-4 lg:px-0 w-full lg:w-[46%] lg:border-l border-gray-200 shrink-0">
              <OptionsPanel onOpenInquiry={handleOpenInquiry} activeZone={activeZone?.zone} />
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto px-4">
            <div className="rounded-xl overflow-hidden shadow-md bg-gray-100 relative border border-gray-200">
              <WheelPreview />
            </div>
          </div>
        )}
      </div>

      <PriceInquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} />

      {activeZone && (
        <ZonePopover
          zone={activeZone.zone}
          onClose={() => setActiveZone(null)}
        />
      )}
    </div>
  );
}

export default function Configurator() {
  return (
    <ConfiguratorProvider>
      <ConfiguratorContent />
    </ConfiguratorProvider>
  );
}
