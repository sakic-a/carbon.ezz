import { useState } from 'react';
import { useConfigurator } from '../../context/ConfiguratorContext';
import { useLanguage } from '../../context/LanguageContext';
import { ringColours } from '../../data/configuratorConstants';

const topMaterials    = ['alcantara', 'carbon', 'perforated'];
const sideMaterials   = ['alcantara', 'perforated'];
const bottomMaterials = ['alcantara', 'carbon', 'perforated'];

// Zone positions measured from actual non-transparent pixel bounds of the 768×768 layer PNGs
const ZONES = [
  {
    key: 'top',
    zoneId: 'top',
    style: { left: '11.8%', top: '1.7%', width: '76.4%', height: '25.5%' },
    anchor: 'bottom',
    borderRadius: '50% 50% 0 0 / 70% 70% 0 0',
  },
  {
    key: 'bottom',
    zoneId: 'bottom',
    style: { left: '21.4%', top: '68.8%', width: '57.6%', height: '27%' },
    anchor: 'top',
    borderRadius: '0 0 50% 50% / 0 0 70% 70%',
  },
  {
    key: 'sides_left',
    zoneId: 'sides',
    style: { left: '1.7%', top: '21.4%', width: '33.9%', height: '70.1%' },
    anchor: 'right',
    borderRadius: '50% 0 0 50%',
  },
  {
    key: 'sides_right',
    zoneId: 'sides',
    style: { left: '64.5%', top: '21.5%', width: '34.2%', height: '69.7%' },
    anchor: 'left',
    borderRadius: '0 50% 50% 0',
  },
  {
    key: 'hub',
    zoneId: 'hub',
    style: { left: '30.21%', top: '31.38%', width: '39.58%', height: '39.58%' },
    anchor: 'bottom',
    borderRadius: '50%',
  },
];

// SVG outline paths in a 768×768 viewBox, traced from actual pixel contours and
// expanded ~8px outward so the outline sits just outside the real grip bounds.
const OUTLINES = [
  {
    svgKey: 'top',
    zoneId: 'top',
    // Outer edge: smooth arc from (83,168) up to apex (383,4) and back down to (682,155).
    // Inner edge: W-shape — dips to ~y=205 near sides (spoke junctions), rises to y=84 at centre.
    d: [
      'M 83,168',
      'C 83,50 248,4 383,4',
      'C 518,4 682,50 682,155',
      'C 674,178 650,210 620,205',
      'C 546,195 464,84 383,84',
      'C 302,84 220,195 149,205',
      'C 119,210 96,178 83,168 Z',
    ].join(' '),
  },
  {
    svgKey: 'bottom',
    zoneId: 'bottom',
    // Outer edge: smooth arc curving down to apex ~y=736.
    // Inner edge: two sharp notches at x≈315 and x≈461 (spoke attachments), sitting at y≈524–528.
    d: [
      'M 155,672',
      'C 155,754 612,754 612,690',
      'L 588,634',
      'C 564,620 536,628 510,628',
      'C 488,628 475,628 470,625',
      'C 468,618 466,528 462,524',
      'C 458,520 454,525 452,534',
      'C 450,625 432,628 384,628',
      'C 338,628 320,625 316,534',
      'C 314,525 310,520 306,524',
      'C 302,528 300,618 296,625',
      'C 278,628 252,628 230,628',
      'C 206,622 178,632 155,672 Z',
    ].join(' '),
  },
  {
    svgKey: 'sides_left',
    zoneId: 'sides',
    d: 'M 98,158 C 0,158 0,655 98,655 L 196,630 C 85,630 85,181 196,181 Z',
  },
  {
    svgKey: 'sides_right',
    zoneId: 'sides',
    d: 'M 670,158 C 768,158 768,655 670,655 L 572,630 C 683,630 683,181 572,181 Z',
  },
  {
    svgKey: 'hub',
    zoneId: 'hub',
    d: 'M 232,393 A 152,152 0 1,0 536,393 A 152,152 0 1,0 232,393 Z',
  },
];

export default function WheelPreview({ onZoneClick }) {
  const { state } = useConfigurator();
  const { t, lang } = useLanguage();
  const { topMaterial, sideMaterial, bottomMaterial, ringEnabled, ringColour, wheelShape, selectedModel } = state;
  const [hoveredZoneId, setHoveredZoneId] = useState(null);

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
        style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}
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
    <div style={{ position: 'relative', width: '100%', aspectRatio: '1/1' }}>

      <img src="/wheels/audi/background.png" style={layer(true)} alt="" />

      <img src="/wheels/audi/factory/audi_factory_base.png" style={layer(wheelShape === 'factory')} alt="" />
      <img src="/wheels/audi/full/audi_full_base.png"       style={layer(wheelShape === 'full')} alt="" />
      <img src="/wheels/audi/flat/audi_flat_base.png"       style={layer(wheelShape === 'flat')} alt="" />

      {topMaterials.map(mat => (
        <img key={mat} src={`${BASE}/top_${mat}.png`} style={layer(topMaterial === mat)} alt="" />
      ))}
      {sideMaterials.map(mat => (
        <img key={mat} src={`${BASE}/sides_${mat}.png`} style={layer(sideMaterial === mat)} alt="" />
      ))}
      {bottomMaterials.map(mat => (
        <img key={mat} src={`${BASE}/bottom_${mat}.png`} style={layer(bottomMaterial === mat)} alt="" />
      ))}

      {ringColours.map(colour => (
        <img key={colour} src={`/wheels/audi/ring/ring_${colour}.png`} style={layer(ringEnabled && ringColour === colour)} alt="" />
      ))}

      <img src="/wheels/audi/full/audi_hub.png" style={layer(wheelShape === 'full')} alt="" />

      {/* Grip outline SVG — fades in on hover, shaped like each grip zone */}
      {onZoneClick && (
        <svg
          viewBox="0 0 768 768"
          preserveAspectRatio="xMidYMid meet"
          style={{
            position: 'absolute', top: 0, left: 0,
            width: '100%', height: '100%',
            pointerEvents: 'none',
            zIndex: 12,
          }}
        >
          {OUTLINES.map(shape => (
            <path
              key={shape.svgKey}
              d={shape.d}
              fill="rgba(255,255,255,0.07)"
              stroke="white"
              strokeWidth="5"
              strokeLinejoin="round"
              opacity={hoveredZoneId === shape.zoneId ? 0.45 : 0}
              style={{ transition: 'opacity 0.15s ease' }}
            />
          ))}
        </svg>
      )}

      {/* Invisible clickable hotspot zones */}
      {onZoneClick && ZONES.map((zone) => (
        <button
          key={zone.key}
          aria-label={`Configure ${t('configurator', zone.zoneId)}`}
          style={{
            position: 'absolute',
            ...zone.style,
            borderRadius: zone.borderRadius,
            cursor: 'pointer',
            background: 'transparent',
            border: 'none',
            zIndex: 10,
          }}
          onMouseEnter={() => setHoveredZoneId(zone.zoneId)}
          onMouseLeave={() => setHoveredZoneId(null)}
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            onZoneClick(zone.zoneId, rect, zone.anchor);
          }}
        />
      ))}
    </div>
  );
}
