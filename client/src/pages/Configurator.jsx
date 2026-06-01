import { useState, useEffect } from 'react';
import { ConfiguratorProvider } from '../context/ConfiguratorContext';
import WheelPreview from '../components/configurator/WheelPreview';
import OptionsPanel from '../components/configurator/OptionsPanel';
import { useConfigurator } from '../context/ConfiguratorContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { useShop } from '../context/ShopContext';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, ChevronLeft, X } from 'lucide-react';

function StitchingPreviewCard() {
  const { state } = useConfigurator();
  const { t } = useLanguage();
  const { threadColour } = state;
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [threadColour]);

  const imageUrl = `/wheels/thread/${threadColour}.png`;

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm mt-6">
      <h3 className="text-sm font-bold uppercase tracking-wider text-black mb-3">
        {t('configurator', 'stitching')}
      </h3>
      <div className="relative border border-gray-100 rounded-lg bg-gray-50 flex flex-col items-center justify-center p-4 min-h-[140px] transition-all duration-300">
        {!imageError ? (
          <div className="w-full flex items-center justify-center">
            <img 
              src={imageUrl} 
              alt={`${threadColour} Stitching`} 
              className="w-full h-auto object-contain rounded shadow-sm"
              onError={() => setImageError(true)}
            />
          </div>
        ) : (
          <div className="w-full h-24 flex items-center justify-center bg-gray-50/30 rounded" />
        )}
      </div>
    </div>
  );
}

function PriceInquiryModal({ isOpen, onClose }) {
  const { state } = useConfigurator();
  const { user } = useAuth();
  const { submitInquiry } = useShop();
  const { t, lang } = useLanguage();

  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState("");
  const [carModel, setCarModel] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name || "");
      setEmail(user.email || "");
    }
  }, [user]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      alert(t("configurator", "inquirySuccess"));
      onClose();
    } else {
      alert(lang === "bs" ? "Došlo je do greške. Pokušajte ponovo." : "Something went wrong. Please try again.");
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
          {lang === "bs" 
            ? "Pošaljite nam svoje kontakt podatke i mi ćemo vam odgovoriti sa ponudom cijene za vaš prilagođeni dizajn volana."
            : "Send us your contact information and our team will get back to you with a price quote for your custom steering wheel build."}
        </p>

        <div className="bg-gray-50 rounded-xl p-4 mb-6 border border-gray-100 text-sm">
          <h4 className="font-bold text-black mb-2 uppercase tracking-wider text-xs">
            {lang === "bs" ? "Vaš Dizajn" : "Your Configuration"}
          </h4>
          <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-gray-600 capitalize">
            <div><span className="font-semibold">{lang === "bs" ? "Model:" : "Base Model:"}</span> {state.selectedModel}</div>
            <div><span className="font-semibold">{lang === "bs" ? "Oblik:" : "Shape:"}</span> {t("configurator", state.wheelShape)}</div>
            <div><span className="font-semibold">{lang === "bs" ? "Gornji dio:" : "Top Grip:"}</span> {t("configurator", state.topMaterial)}</div>
            <div><span className="font-semibold">{lang === "bs" ? "Strane:" : "Side Grips:"}</span> {t("configurator", state.sideMaterial)}</div>
            <div><span className="font-semibold">{lang === "bs" ? "Donji dio:" : "Bottom Grip:"}</span> {t("configurator", state.bottomMaterial)}</div>
            <div>
              <span className="font-semibold">{lang === "bs" ? "Šavovi:" : "Stitching:"}</span>{" "}
              <span className="inline-flex items-center gap-1.5 font-medium text-black">
                <span 
                  className="w-3 h-3 rounded-full border border-gray-300 inline-block"
                  style={{ 
                    backgroundColor: state.threadColour === 'white' ? '#ffffff' : 
                                    state.threadColour === 'black' ? '#000000' : state.threadColour 
                  }}
                />
                {state.threadColour}
              </span>
            </div>
            {state.ringEnabled && (
              <div className="col-span-2">
                <span className="font-semibold">{lang === "bs" ? "Prsten:" : "Colour Ring:"}</span>{" "}
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
              {lang === "bs" ? "Ime i prezime" : "Full Name"}
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
              required
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
              {lang === "bs" ? "Broj telefona" : "Phone Number"}
            </label>
            <input
              type="tel"
              className="w-full p-3 border border-gray-200 rounded-xl focus:border-black focus:ring-1 focus:ring-black outline-none transition-all text-sm"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
              placeholder={lang === "bs" ? "Unesite posebne zahtjeve ili pitanja..." : "Enter any special requests, custom finishes, or questions..."}
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
  const { t, lang } = useLanguage();
  const { selectedModel } = state;
  const { user } = useAuth();
  const navigate = useNavigate();
  const [inquiryOpen, setInquiryOpen] = useState(false);

  const models = [
    { id: 'audi', name: 'Audi 4G S-Line / RS', image: '/wheels/audi/factory/audi_factory_base.png' },
    { id: 'bmw', name: 'BMW E90 M-Sport', image: null },
    { id: 'mercedes', name: 'Mercedes W212 AMG', image: null }
  ];

  const handleOpenInquiry = () => {
    if (!user) {
      navigate('/login?redirect=/configurator');
      return;
    }
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
                        {lang === 'bs' ? 'Uskoro' : 'Coming Soon'}
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
    <div className="bg-white min-h-screen py-16">
      <div className="container mx-auto px-4 max-w-6xl">
        <button 
          onClick={() => dispatch({ type: 'SET_MODEL', value: null })}
          className="mb-8 flex items-center gap-1.5 text-sm font-semibold text-secondary hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
        >
          <ChevronLeft size={16} /> {t('configurator', 'backToModels')}
        </button>

        {selectedModel === 'audi' ? (
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-2/3 flex flex-col">
              <div className="rounded-lg overflow-hidden shadow-sm bg-gray-100 relative">
                <WheelPreview />
              </div>
              <StitchingPreviewCard />
            </div>

            <div className="w-full md:w-1/3 md:border-l border-gray-200">
              <OptionsPanel onOpenInquiry={handleOpenInquiry} />
            </div>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto">
            <div className="rounded-lg overflow-hidden shadow-sm bg-gray-100 relative border border-gray-200">
              <WheelPreview />
            </div>
          </div>
        )}
      </div>

      <PriceInquiryModal isOpen={inquiryOpen} onClose={() => setInquiryOpen(false)} />
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
