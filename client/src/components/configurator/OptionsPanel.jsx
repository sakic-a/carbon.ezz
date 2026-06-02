import { useState, useEffect } from 'react';
import { useConfigurator } from '../../context/ConfiguratorContext';
import { useLanguage } from '../../context/LanguageContext';
import { ringColours } from '../../data/configuratorConstants';

function StitchingPreviewCard() {
  const { state } = useConfigurator();
  const { t } = useLanguage();
  const { threadColour } = state;
  const [imageError, setImageError] = useState(false);

  useEffect(() => { setImageError(false); }, [threadColour]);

  return (
    <div className="bg-white border border-gray-100 rounded-xl p-6 shadow-sm mb-6">
      <h3 className="text-sm font-bold uppercase tracking-wider text-black mb-3">
        {t('configurator', 'stitching')}
      </h3>
      <div className="relative border border-gray-100 rounded-lg bg-gray-50 flex flex-col items-center justify-center p-4 min-h-[140px]">
        {!imageError ? (
          <img
            src={`/wheels/thread/${threadColour}.png`}
            alt={`${threadColour} Stitching`}
            className="w-full h-auto object-contain rounded shadow-sm"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-24 bg-gray-50/30 rounded" />
        )}
      </div>
    </div>
  );
}

const topOptions    = ['smooth', 'alcantara', 'carbon', 'perforated'];
const sideOptions   = ['smooth', 'alcantara', 'perforated'];
const bottomOptions = ['smooth', 'alcantara', 'carbon', 'perforated'];

function MaterialSelector({ label, options, value, actionType, highlight, className = 'mb-6' }) {
  const { dispatch } = useConfigurator();
  const { t } = useLanguage();

  return (
    <div
      className={`${className} transition-all duration-300`}
    >
      <p className={`text-sm font-semibold uppercase tracking-wide mb-2 transition-colors duration-300 ${highlight ? 'text-primary' : ''}`}>{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map(option => (
          <button
            key={option}
            onClick={() => dispatch({ type: actionType, value: option })}
            className={`px-4 py-2 rounded border text-sm capitalize transition-colors
              ${value === option
                ? 'bg-black text-white border-black'
                : 'bg-white text-black border-gray-300 hover:border-black'
              }`}
          >
            {t('configurator', option)}
          </button>
        ))}
      </div>
    </div>
  );
}

export default function OptionsPanel({ onOpenInquiry, activeZone }) {
  const { state, dispatch } = useConfigurator();
  const { t } = useLanguage();

  return (
    <div className="p-6">
      {/* Wheel shape */}
      <div className="mb-6 pl-3 border-l-4 border-transparent">
        <p className="text-sm font-semibold uppercase tracking-wide mb-2">{t('configurator', 'wheelType')}</p>
        <div className="flex flex-wrap gap-2">
          {['factory', 'flat', 'full'].map(shape => (
            <button
              key={shape}
              onClick={() => dispatch({ type: 'SET_WHEEL_SHAPE', value: shape })}
              className={`px-4 py-2 rounded border text-sm capitalize transition-colors
                ${state.wheelShape === shape
                  ? 'bg-black text-white border-black'
                  : 'bg-white text-black border-gray-300 hover:border-black'
                }`}
            >
              {t('configurator', shape)}
            </button>
          ))}
        </div>
      </div>

      {/* Top + Bottom side by side */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <MaterialSelector label={t('configurator', 'top')}    options={topOptions}    value={state.topMaterial}    actionType="SET_TOP"    highlight={activeZone === 'top'}    className="" />
        <MaterialSelector label={t('configurator', 'bottom')} options={bottomOptions} value={state.bottomMaterial} actionType="SET_BOTTOM" highlight={activeZone === 'bottom'} className="" />
      </div>

      <MaterialSelector label={t('configurator', 'sides')} options={sideOptions} value={state.sideMaterial} actionType="SET_SIDE" highlight={activeZone === 'sides'} />

      {/* Ring toggle + colour */}
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide mb-2">{t('configurator', 'ring')}</p>
        <button
          onClick={() => dispatch({ type: 'SET_RING', value: !state.ringEnabled })}
          className={`px-4 py-2 rounded border text-sm transition-colors
            ${state.ringEnabled
              ? 'bg-black text-white border-black'
              : 'bg-white text-black border-gray-300 hover:border-black'
            }`}
        >
          {state.ringEnabled ? t('configurator', 'removeRing') : t('configurator', 'addRing')}
        </button>
      </div>
      {state.ringEnabled && (
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wide mb-2">{t('configurator', 'ringColour')}</p>
          <div className="flex gap-2 flex-wrap">
            {ringColours.map(colour => (
              <button
                key={colour}
                title={t('configurator', colour)}
                onClick={() => dispatch({ type: 'SET_RING_COLOUR', value: colour })}
                className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110
                  ${state.ringColour === colour ? 'border-black scale-110' : 'border-transparent'}`}
                style={{ backgroundColor: colour }}
              />
            ))}
          </div>
        </div>
      )}

      <div className="lg:hidden">
        <StitchingPreviewCard />
      </div>

      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide mb-2">{t('configurator', 'stitching')}</p>
        <div className="flex gap-2 flex-wrap">
          {[
            { id: 'white', color: '#ffffff', label: 'threadWhite' },
            { id: 'red', color: 'red', label: 'red' },
            { id: 'blue', color: 'blue', label: 'blue' },
            { id: 'yellow', color: 'yellow', label: 'yellow' },
            { id: 'green', color: 'green', label: 'green' },
            { id: 'orange', color: 'orange', label: 'orange' },
            { id: 'black', color: 'black', label: 'black' }
          ].map(thread => (
            <button
              key={thread.id}
              title={t('configurator', thread.label)}
              onClick={() => dispatch({ type: 'SET_THREAD', value: thread.id })}
              className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110
                ${state.threadColour === thread.id ? 'border-black scale-110' : 'border-gray-300'}`}
              style={{ backgroundColor: thread.color }}
            />
          ))}
        </div>
      </div>

      <button
        onClick={onOpenInquiry}
        className="w-full bg-primary hover:bg-yellow-400 text-black font-extrabold uppercase tracking-wider py-4 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-md flex items-center justify-center gap-2 mt-8"
      >
        {t('configurator', 'inquiryButton')}
      </button>
    </div>
  );
}