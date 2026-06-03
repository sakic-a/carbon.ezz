import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useConfigurator } from '../../context/ConfiguratorContext';
import { useLanguage } from '../../context/LanguageContext';
import { threadColours } from '../../data/configuratorConstants';

const ZONE_CONFIG = {
  top: {
    options: ['smooth', 'alcantara', 'perforated', 'carbon'],
    action: 'SET_TOP',
    getCurrentValue: (state) => state.topMaterial,
  },
  bottom: {
    options: ['smooth', 'alcantara', 'perforated', 'carbon'],
    action: 'SET_BOTTOM',
    getCurrentValue: (state) => state.bottomMaterial,
  },
  sides: {
    options: ['smooth', 'alcantara', 'perforated'],
    action: 'SET_SIDE',
    getCurrentValue: (state) => state.sideMaterial,
  },
  thread: {
    options: threadColours,
    action: 'SET_THREAD',
    getCurrentValue: (state) => state.threadColour,
    type: 'colour',
  },
  hub: {
    options: ['factory', 'flat', 'full'],
    action: 'SET_WHEEL_SHAPE',
    getCurrentValue: (state) => state.wheelShape,
  },
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);
  return isMobile;
}

export default function ZonePopover({ zone, onClose }) {
  const { state, dispatch } = useConfigurator();
  const { t } = useLanguage();
  const isMobile = useIsMobile();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const config = ZONE_CONFIG[zone];
  if (!config) return null;
  if (!isMobile) return null;

  const currentValue = config.getCurrentValue(state);

  const handleSelect = (opt) => {
    dispatch({ type: config.action, value: opt });
    onClose();
  };

  const zoneLabel = zone === 'hub' ? t('configurator', 'wheelType') : t('configurator', zone);

  return (
    <div
      className="fixed inset-0 z-50"
      style={{ background: visible ? 'rgba(0,0,0,0.45)' : 'rgba(0,0,0,0)', transition: 'background 0.25s' }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          transform: visible ? 'translateY(0)' : 'translateY(100%)',
          transition: 'transform 0.3s cubic-bezier(0.32, 0.72, 0, 1)',
        }}
        className="bg-white rounded-t-2xl p-6 shadow-2xl"
      >
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-5" />
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-extrabold text-sm uppercase tracking-widest text-black">
            {zoneLabel}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-black transition-colors">
            <X size={18} />
          </button>
        </div>
        {config.type === 'colour' ? (
          <div className="flex flex-wrap gap-3 pb-2">
            {config.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                title={opt.charAt(0).toUpperCase() + opt.slice(1)}
                className={`w-10 h-10 rounded-full border-2 transition-transform hover:scale-110
                  ${currentValue === opt ? 'border-black scale-110' : opt === 'white' ? 'border-gray-300' : 'border-transparent'}`}
                style={{ backgroundColor: opt }}
              />
            ))}
          </div>
        ) : (
          <div className="flex flex-wrap gap-2 pb-2">
            {config.options.map((opt) => (
              <button
                key={opt}
                onClick={() => handleSelect(opt)}
                className={`px-5 py-2.5 rounded-xl border text-sm capitalize font-semibold transition-all
                  ${currentValue === opt
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-black border-gray-200 hover:border-black'
                  }`}
              >
                {t('configurator', opt)}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
