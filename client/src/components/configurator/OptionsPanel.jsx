import { useConfigurator } from '../../context/ConfiguratorContext';
import { useLanguage } from '../../context/LanguageContext';
import { ringColours, threadColours } from '../../data/configuratorConstants';


const topOptions    = ['smooth', 'alcantara', 'perforated', 'carbon'];
const sideOptions   = ['smooth', 'alcantara', 'perforated'];
const bottomOptions = ['smooth', 'alcantara', 'perforated', 'carbon'];

function MaterialSelector({ label, options, value, actionType, highlight, gridCols = 'grid-cols-2', className = 'mb-6' }) {
  const { dispatch } = useConfigurator();
  const { t } = useLanguage();

  return (
    <div className={`${className} transition-all duration-300`}>
      <p className={`text-sm font-semibold uppercase tracking-wide mb-2 transition-all duration-300 border-l-[3px] pl-2 ${highlight ? 'border-primary' : 'border-transparent'}`}>{label}</p>
      <div className={`grid gap-2 ${gridCols}`}>
        {options.map(option => (
          <button
            key={option}
            onClick={() => dispatch({ type: actionType, value: option })}
            className={`px-2 py-2 rounded border text-sm capitalize transition-colors
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

export default function OptionsPanel({ onOpenInquiry, activeZone, onDownload }) {
  const { state, dispatch } = useConfigurator();
  const { t } = useLanguage();

  return (
    <div className="p-6">
      {/* Wheel shape */}
      <div className="mb-6">
        <p className={`text-sm font-semibold uppercase tracking-wide mb-2 transition-all duration-300 border-l-[3px] pl-2 ${activeZone === 'hub' ? 'border-primary' : 'border-transparent'}`}>{t('configurator', 'wheelType')}</p>
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
        <MaterialSelector label={t('configurator', 'top')}    options={topOptions}    value={state.topMaterial}    actionType="SET_TOP"    highlight={activeZone === 'top'}    gridCols="grid-cols-2" className="" />
        <MaterialSelector label={t('configurator', 'bottom')} options={bottomOptions} value={state.bottomMaterial} actionType="SET_BOTTOM" highlight={activeZone === 'bottom'} gridCols="grid-cols-2" className="" />
      </div>

      <MaterialSelector label={t('configurator', 'sides')} options={sideOptions} value={state.sideMaterial} actionType="SET_SIDE" highlight={activeZone === 'sides'} gridCols="grid-cols-2 md:grid-cols-4" />

      {/* Ring toggle + colour */}
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide mb-2 border-l-[3px] border-transparent pl-2">{t('configurator', 'ring')}</p>
        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => dispatch({ type: 'SET_RING', value: !state.ringEnabled })}
            className={`px-4 py-2 rounded border text-sm transition-colors shrink-0
              ${state.ringEnabled
                ? 'bg-black text-white border-black'
                : 'bg-white text-black border-gray-300 hover:border-black'
              }`}
          >
            {state.ringEnabled ? t('configurator', 'removeRing') : t('configurator', 'addRing')}
          </button>
          {state.ringEnabled && (
            <div className="flex gap-2 flex-wrap">
              {ringColours.map(colour => (
                <button
                  key={colour}
                  title={colour.charAt(0).toUpperCase() + colour.slice(1)}
                  onClick={() => dispatch({ type: 'SET_RING_COLOUR', value: colour })}
                  className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110
                    ${state.ringColour === colour ? 'border-black scale-110' : colour === 'white' ? 'border-gray-300' : 'border-transparent'}`}
                  style={{ backgroundColor: colour }}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Thread colour picker */}
      <div className="mb-6">
        <p className="text-sm font-semibold uppercase tracking-wide mb-2 border-l-[3px] border-transparent pl-2">{t('configurator', 'stitching')}</p>
        <div className="flex gap-2 flex-wrap">
          {threadColours.map(colour => (
            <button
              key={colour}
              title={colour.charAt(0).toUpperCase() + colour.slice(1)}
              onClick={() => dispatch({ type: 'SET_THREAD', value: colour })}
              className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110
                ${state.threadColour === colour ? 'border-black scale-110' : colour === 'white' ? 'border-gray-300' : 'border-transparent'}`}
              style={{ backgroundColor: colour }}
            />
          ))}
        </div>
      </div>

      <div className="mt-8 flex flex-col gap-3">
        <button
          onClick={onDownload}
          className="w-full bg-black text-white hover:bg-gray-900 font-extrabold uppercase tracking-wider py-4 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-md flex items-center justify-center gap-2"
        >
          {t('configurator', 'downloadDesign') || 'Download Design'}
        </button>
        <button
          onClick={onOpenInquiry}
          className="w-full bg-primary hover:bg-yellow-400 text-black font-extrabold uppercase tracking-wider py-4 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-0.5 shadow-md flex items-center justify-center gap-2"
        >
          {t('configurator', 'inquiryButton')}
        </button>
      </div>
    </div>
  );
}