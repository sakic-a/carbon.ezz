import { useConfigurator } from '../../context/ConfiguratorContext';
import { useLanguage } from '../../context/LanguageContext';
import { ringColours } from '../../data/configuratorConstants';

const topOptions    = ['smooth', 'alcantara', 'carbon', 'perforated'];
const sideOptions   = ['smooth', 'alcantara', 'perforated'];
const bottomOptions = ['smooth', 'alcantara', 'carbon', 'perforated'];

function MaterialSelector({ label, options, value, actionType }) {
  const { dispatch } = useConfigurator();
  const { t } = useLanguage();

  return (
    <div className="mb-6">
      <p className="text-sm font-semibold uppercase tracking-wide mb-2">{label}</p>
      <div className="flex gap-2">
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

export default function OptionsPanel({ onOpenInquiry }) {
  const { state, dispatch } = useConfigurator();
  const { t } = useLanguage();

  return (
    <div className="p-6">
      {/* Wheel shape */}
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide mb-2">{t('configurator', 'wheelType')}</p>
        <div className="flex gap-2">
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

      <MaterialSelector label={t('configurator', 'top')}    options={topOptions}    value={state.topMaterial}    actionType="SET_TOP" />
      <MaterialSelector label={t('configurator', 'sides')}  options={sideOptions}   value={state.sideMaterial}   actionType="SET_SIDE" />
      <MaterialSelector label={t('configurator', 'bottom')} options={bottomOptions} value={state.bottomMaterial} actionType="SET_BOTTOM" />

      {/* Ring toggle */}
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