import { useState, useEffect } from 'react';
import { ConfiguratorProvider } from '../context/ConfiguratorContext';
import WheelPreview from '../components/configurator/WheelPreview';
import OptionsPanel from '../components/configurator/OptionsPanel';
import { useConfigurator } from '../context/ConfiguratorContext';
import { useLanguage } from '../context/LanguageContext';
import { ArrowRight, ChevronLeft } from 'lucide-react';

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

function ConfiguratorContent() {
  const { state, dispatch } = useConfigurator();
  const { t, lang } = useLanguage();
  const { selectedModel } = state;

  const models = [
    { id: 'audi', name: 'Audi 4G S-Line / RS', image: '/wheels/audi/factory/audi_factory_base.png' },
    { id: 'bmw', name: 'BMW E90 M-Sport', image: null },
    { id: 'mercedes', name: 'Mercedes W212 AMG', image: null }
  ];

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
              <OptionsPanel />
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
