import { useConfigurator } from '../../context/ConfiguratorContext';
import { useLanguage } from '../../context/LanguageContext';
import { ringColours } from '../../data/configuratorConstants';

const topMaterials    = ['alcantara', 'carbon', 'perforated'];
const sideMaterials   = ['alcantara', 'perforated'];
const bottomMaterials = ['alcantara', 'carbon', 'perforated'];

export default function WheelPreview() {
  const { state } = useConfigurator();
  const { t, lang } = useLanguage();
  const { topMaterial, sideMaterial, bottomMaterial, ringEnabled, ringColour, wheelShape, selectedModel } = state;

  const layer = (visible) => ({
    position: 'absolute',
    top: 0, left: 0,
    width: '100%', height: '100%',
    objectFit: 'contain',
    opacity: visible ? 1 : 0,
    transition: 'opacity 0.35s ease',
    pointerEvents: 'none',
  });

  if (selectedModel !== 'audi') {
    return (
      <div 
        style={{ position: 'relative', width: '100%', aspectRatio: '1377/768' }} 
        className="flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden border border-gray-200 shadow-inner"
      >
        <span className="text-gray-400 font-bold uppercase tracking-wider text-sm">
          {lang === 'bs' ? 'Uskoro' : 'Coming Soon'}
        </span>
      </div>
    );
  }

  const BASE = `/wheels/audi/${wheelShape}`;

  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '1377/768' }}>

      <img src="/wheels/audi/background.png" style={layer(true)} />

      <img src="/wheels/audi/factory/audi_factory_base.png" style={layer(wheelShape === 'factory')} />
      <img src="/wheels/audi/full/audi_full_base.png"       style={layer(wheelShape === 'full')} />
      <img src="/wheels/audi/flat/audi_flat_base.png"       style={layer(wheelShape === 'flat')} />

      {topMaterials.map(mat => (
        <img key={mat} src={`${BASE}/top_${mat}.png`} style={layer(topMaterial === mat)} />
      ))}
      {sideMaterials.map(mat => (
        <img key={mat} src={`${BASE}/sides_${mat}.png`} style={layer(sideMaterial === mat)} />
      ))}
      {bottomMaterials.map(mat => (
        <img key={mat} src={`${BASE}/bottom_${mat}.png`} style={layer(bottomMaterial === mat)} />
      ))}

      {ringColours.map(colour => (
        <img key={colour} src={`/wheels/audi/ring/ring_${colour}.png`} style={layer(ringEnabled && ringColour === colour)} />
      ))}

      <img src="/wheels/audi/full/audi_hub.png" style={layer(wheelShape === 'full')} />

    </div>
  );
}
