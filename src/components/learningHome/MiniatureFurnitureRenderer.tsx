import React from 'react';
import { HomeItem, CharacterState } from '../../types';
import { MiniatureAnimalRenderer } from './MiniatureAnimalRenderer';
import { MiniaturePlantRenderer } from './MiniaturePlantRenderer';

interface MiniatureFurnitureRendererProps {
  item: HomeItem;
  size?: 'sm' | 'md' | 'lg' | 'preview';
  state?: string;
  isLit?: boolean;
  className?: string;
  sleepingCharacter?: CharacterState;
}

/**
 * Semi-realistic, warm, cozy miniature furniture illustration renderer.
 * Built with realistic dollhouse proportions, rich wood tones (#B88963),
 * soft fabrics (#EFB6BD, #F3EADC, #8FA58B), gentle drop shadows,
 * ceramic finishes, and interactive lighting effects.
 */
export const MiniatureFurnitureRenderer: React.FC<MiniatureFurnitureRendererProps> = ({
  item,
  size = 'md',
  state,
  isLit = true,
  className = '',
  sleepingCharacter
}) => {
  const renderKey = item.renderType || item.id;
  const itemId = item.id.toLowerCase();
  const itemName = (item.name || '').toLowerCase();

  // 1. ROUTE ALL ANIMALS TO HIGH-FIDELITY MINIATURE ANIMAL RENDERER
  const isAnimal =
    item.category === 'companion' ||
    itemId.startsWith('pet-') ||
    itemId.includes('cat') ||
    itemId.includes('pup') ||
    itemId.includes('dog') ||
    itemId.includes('bunny') ||
    itemId.includes('rabbit') ||
    itemId.includes('owl') ||
    itemId.includes('bird') ||
    itemId.includes('fox') ||
    itemName.includes('cat') ||
    itemName.includes('dog') ||
    itemName.includes('pup') ||
    itemName.includes('bunny') ||
    itemName.includes('rabbit') ||
    itemName.includes('owl') ||
    itemName.includes('fox');

  if (isAnimal) {
    return <MiniatureAnimalRenderer item={item} size={size} state={state} className={className} />;
  }

  // 2. ROUTE ALL BOTANICALS & PLANTS TO HIGH-FIDELITY PLANT RENDERER
  const isPlant =
    itemId.includes('plant') ||
    itemId.includes('monstera') ||
    itemId.includes('snake') ||
    itemId.includes('pothos') ||
    itemId.includes('succulent') ||
    itemId.includes('lily') ||
    itemId.includes('spider') ||
    itemId.includes('fern') ||
    itemId.includes('flower') ||
    itemId.includes('bonsai') ||
    itemName.includes('plant') ||
    itemName.includes('monstera') ||
    itemName.includes('succulent') ||
    itemName.includes('fern') ||
    itemName.includes('flower') ||
    itemName.includes('bonsai') ||
    itemName.includes('pothos') ||
    itemName.includes('palm');

  if (isPlant) {
    return <MiniaturePlantRenderer item={item} size={size} state={state} className={className} />;
  }

  // Size configurations (pixel widths & heights for SVG or container)
  const sizeStyles = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20 sm:w-24 sm:h-24',
    lg: 'w-28 h-28 sm:w-36 sm:h-36',
    preview: 'w-36 h-36 sm:w-48 sm:h-48'
  }[size];

  // Specific high-fidelity miniature furniture vector components
  switch (renderKey) {
    // 🛏️ CLASSIC SINGLE BED
    case 'classic_single_bed':
    case 'furn-classic-single-bed':
    case 'furn-starter-bed': {
      const isMessy = state === 'messy';
      return (
        <div className={`relative ${sizeStyles} ${className} flex items-center justify-center select-none`}>
          <svg viewBox="0 0 160 140" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="bedWood" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#C49A76" />
                <stop offset="50%" stopColor="#A87955" />
                <stop offset="100%" stopColor="#875837" />
              </linearGradient>
              <linearGradient id="bedQuilt" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#F8D3D8" />
                <stop offset="60%" stopColor="#EFB6BD" />
                <stop offset="100%" stopColor="#DF9EA6" />
              </linearGradient>
              <linearGradient id="bedSheet" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFFDF9" />
                <stop offset="100%" stopColor="#F0EAE1" />
              </linearGradient>
              <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#503728" floodOpacity="0.18" />
              </filter>
            </defs>

            {/* Floor cast shadow */}
            <ellipse cx="80" cy="128" rx="66" ry="10" fill="#503728" opacity="0.16" />

            {/* Wooden Headboard */}
            <rect x="24" y="24" width="112" height="60" rx="8" fill="url(#bedWood)" filter="url(#softShadow)" />
            {/* Headboard inner carved bevel */}
            <rect x="30" y="30" width="100" height="42" rx="4" fill="#996947" opacity="0.4" />
            <rect x="32" y="32" width="96" height="38" rx="3" fill="#B38461" />

            {/* Wooden Legs (back) */}
            <rect x="22" y="70" width="10" height="48" rx="2" fill="#754829" />
            <rect x="128" y="70" width="10" height="48" rx="2" fill="#754829" />

            {/* Mattress Foundation */}
            <rect x="28" y="58" width="104" height="62" rx="6" fill="#E6DED5" />
            <rect x="30" y="60" width="100" height="58" rx="5" fill="url(#bedSheet)" />

            {/* Layered Sleeping Pillows */}
            <g transform="translate(40, 48)">
              {/* Back Pillow */}
              <rect x="4" y="0" width="40" height="22" rx="7" fill="#EBE3D8" />
              <rect x="36" y="0" width="40" height="22" rx="7" fill="#EBE3D8" />
              {/* Front Pillows with soft tuft */}
              <rect x="6" y="4" width="36" height="18" rx="6" fill="#FFFDF9" stroke="#E2D9CE" strokeWidth="1" />
              <rect x="38" y="4" width="36" height="18" rx="6" fill="#FFFDF9" stroke="#E2D9CE" strokeWidth="1" />
            </g>

            {/* 😴 Tucked-in Sleeping Character resting peacefully on the pillow */}
            {sleepingCharacter && (
              <g id="bed-sleeping-learner" transform="translate(44, 44)">
                {/* Back hair on pillow */}
                <ellipse
                  cx="24"
                  cy="14"
                  rx="14"
                  ry="10"
                  fill={sleepingCharacter.customization.hairColor || '#4A3525'}
                />
                {/* Face on pillow */}
                <ellipse
                  cx="24"
                  cy="14"
                  rx="13"
                  ry="12"
                  fill={sleepingCharacter.customization.skinTone || '#F5CBA7'}
                />
                {/* Soft Rosy Cheek */}
                <circle cx="20" cy="18" r="3.5" fill="#F87171" opacity="0.65" />
                {/* Closed sleeping eyelashes (◠ ◠) */}
                <path
                  d="M 18,13 Q 21,10 24,13"
                  fill="none"
                  stroke="#4A3525"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                <path
                  d="M 26,13 Q 29,10 32,13"
                  fill="none"
                  stroke="#4A3525"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
                {/* Peaceful Resting Smile */}
                <path
                  d="M 22,21 Q 25,23 28,21"
                  fill="none"
                  stroke="#874D38"
                  strokeWidth="1.3"
                  strokeLinecap="round"
                />
                {/* Front Hair Bangs */}
                <path
                  d="M 14,10 C 18,4 32,4 36,10 C 32,7 26,8 22,7 C 18,8 15,7 14,10 Z"
                  fill={sleepingCharacter.customization.hairColor || '#4A3525'}
                />
                {/* Upper Pajama Torso resting on mattress (covered by quilt below) */}
                <rect
                  x="10"
                  y="24"
                  width="48"
                  height="30"
                  rx="6"
                  fill={sleepingCharacter.customization.outfitColor || '#EFB6BD'}
                />
                {/* Cozy Hand resting above blanket */}
                <ellipse
                  cx="32"
                  cy="28"
                  rx="11"
                  ry="5"
                  fill={sleepingCharacter.customization.outfitColor || '#EFB6BD'}
                />
                <circle
                  cx="42"
                  cy="28"
                  r="3.5"
                  fill={sleepingCharacter.customization.skinTone || '#F5CBA7'}
                />
              </g>
            )}

            {/* Quilt & Folded Blanket */}
            {isMessy ? (
              <path
                d="M 28,78 Q 65,95 85,82 Q 115,70 132,84 L 132,118 Q 80,126 28,118 Z"
                fill="url(#bedQuilt)"
                filter="url(#softShadow)"
              />
            ) : (
              <g>
                {/* Turned-down sheet lip */}
                <rect x="28" y="72" width="104" height="10" rx="2" fill="#FAF6F0" />
                {/* Main Quilt */}
                <rect x="28" y="80" width="104" height="38" rx="4" fill="url(#bedQuilt)" filter="url(#softShadow)" />
                {/* Delicate stitch diamond pattern */}
                <path
                  d="M 38,84 L 54,100 L 70,84 L 86,100 L 102,84 L 118,100"
                  stroke="#FFFFFF"
                  strokeWidth="1"
                  strokeOpacity="0.4"
                  fill="none"
                />
                <path
                  d="M 38,100 L 54,116 L 70,100 L 86,116 L 102,100 L 118,116"
                  stroke="#FFFFFF"
                  strokeWidth="1"
                  strokeOpacity="0.4"
                  fill="none"
                />
              </g>
            )}

            {/* Wooden Footboard */}
            <rect x="26" y="108" width="108" height="18" rx="4" fill="url(#bedWood)" filter="url(#softShadow)" />
            {/* Front Turned Wooden Legs */}
            <rect x="24" y="112" width="9" height="18" rx="2" fill="#754829" />
            <rect x="127" y="112" width="9" height="18" rx="2" fill="#754829" />

            {/* Peaceful Floating Zzz particles */}
            {sleepingCharacter && (
              <g className="animate-pulse">
                <text x="76" y="38" fill="#818CF8" fontSize="9" fontWeight="bold">z</text>
                <text x="86" y="30" fill="#6366F1" fontSize="12" fontWeight="extrabold">Z</text>
                <text x="98" y="22" fill="#4F46E5" fontSize="15" fontWeight="black">Z</text>
              </g>
            )}
          </svg>
        </div>
      );
    }

    // 🗄️ WOODEN DRESSER
    case 'wooden_dresser':
    case 'furn-wooden-dresser': {
      return (
        <div className={`relative ${sizeStyles} ${className} flex items-center justify-center select-none`}>
          <svg viewBox="0 0 140 130" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="dresserOak" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#B38461" />
                <stop offset="50%" stopColor="#C89D7B" />
                <stop offset="100%" stopColor="#A87955" />
              </linearGradient>
              <linearGradient id="dresserTop" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#D4AD8C" />
                <stop offset="100%" stopColor="#B88963" />
              </linearGradient>
            </defs>
            {/* Cast Shadow */}
            <ellipse cx="70" cy="120" rx="55" ry="7" fill="#503728" opacity="0.16" />

            {/* Wooden Legs */}
            <rect x="18" y="100" width="8" height="18" rx="2" fill="#754829" />
            <rect x="114" y="100" width="8" height="18" rx="2" fill="#754829" />

            {/* Main Cabinet Body */}
            <rect x="16" y="28" width="108" height="80" rx="5" fill="url(#dresserOak)" />

            {/* Beveled Top Surface */}
            <path d="M 12,28 L 20,20 L 120,20 L 128,28 Z" fill="url(#dresserTop)" />
            <rect x="12" y="27" width="116" height="3" fill="#8C5C38" opacity="0.3" />

            {/* 3 Drawer Panels with Brass Pulls */}
            {[0, 1, 2].map((idx) => {
              const y = 34 + idx * 23;
              return (
                <g key={idx}>
                  {/* Drawer Frame */}
                  <rect x="22" y={y} width="96" height="19" rx="3" fill="#9E704D" opacity="0.4" />
                  <rect x="24" y={y + 1} width="92" height="17" rx="2" fill="#BA8B67" />
                  {/* Dual Antique Brass Drop Pulls */}
                  <circle cx="48" cy={y + 9} r="3" fill="#E6B84F" stroke="#9E7A24" strokeWidth="1" />
                  <circle cx="92" cy={y + 9} r="3" fill="#E6B84F" stroke="#9E7A24" strokeWidth="1" />
                </g>
              );
            })}
          </svg>
        </div>
      );
    }

    // 🛋️ TWO-SEAT LINEN SOFA
    case 'two_seat_sofa':
    case 'furn-two-seat-sofa': {
      return (
        <div className={`relative ${sizeStyles} ${className} flex items-center justify-center select-none`}>
          <svg viewBox="0 0 160 120" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="sofaLinen" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FBF7F0" />
                <stop offset="50%" stopColor="#EFE8DE" />
                <stop offset="100%" stopColor="#D9D0C3" />
              </linearGradient>
              <linearGradient id="cushionPink" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#F9DCE0" />
                <stop offset="100%" stopColor="#EFB6BD" />
              </linearGradient>
            </defs>
            {/* Cast Shadow */}
            <ellipse cx="80" cy="112" rx="70" ry="8" fill="#503728" opacity="0.18" />

            {/* Tapered Mid-Century Wooden Legs */}
            <polygon points="26,98 22,112 28,112 30,98" fill="#875837" />
            <polygon points="134,98 138,112 132,112 130,98" fill="#875837" />
            <polygon points="46,98 44,110 49,110 50,98" fill="#754829" />
            <polygon points="114,98 116,110 111,110 110,98" fill="#754829" />

            {/* Sofa Backrest Cushion */}
            <rect x="22" y="24" width="116" height="54" rx="14" fill="url(#sofaLinen)" />
            {/* Center Backrest Split */}
            <line x1="80" y1="28" x2="80" y2="76" stroke="#C5BCAE" strokeWidth="2" strokeDasharray="4 2" />

            {/* Rounded Armrests */}
            <rect x="14" y="44" width="22" height="52" rx="10" fill="#E6DECE" stroke="#D3C9BA" strokeWidth="1" />
            <rect x="124" y="44" width="22" height="52" rx="10" fill="#E6DECE" stroke="#D3C9BA" strokeWidth="1" />

            {/* Twin Thick Bottom Seat Cushions */}
            <rect x="34" y="64" width="44" height="34" rx="7" fill="url(#sofaLinen)" stroke="#C8BFB0" strokeWidth="1" />
            <rect x="82" y="64" width="44" height="34" rx="7" fill="url(#sofaLinen)" stroke="#C8BFB0" strokeWidth="1" />

            {/* Accent Velvet Pillow on Corner */}
            <rect
              x="36"
              y="56"
              width="24"
              height="24"
              rx="6"
              transform="rotate(-10 36 56)"
              fill="url(#cushionPink)"
              stroke="#D89CA3"
              strokeWidth="1"
            />
          </svg>
        </div>
      );
    }

    // 🪑 COZY ARMCHAIR
    case 'armchair':
    case 'furn-armchair':
    case 'reading_chair':
    case 'furn-reading-chair':
    case 'readers_chair':
    case 'reward-readers-chair': {
      const isRoyal = renderKey.includes('readers') || renderKey.includes('reward');
      const fabricGradient = isRoyal ? '#3B5998' : '#8FA58B';
      const fabricLight = isRoyal ? '#5B79B8' : '#A9BEA5';
      return (
        <div className={`relative ${sizeStyles} ${className} flex items-center justify-center select-none`}>
          <svg viewBox="0 0 130 130" className="w-full h-full drop-shadow-md">
            {/* Cast Shadow */}
            <ellipse cx="65" cy="118" rx="46" ry="8" fill="#503728" opacity="0.16" />

            {/* Wooden Legs */}
            <polygon points="28,102 24,118 30,118 33,102" fill="#875837" />
            <polygon points="102,102 106,118 100,118 97,102" fill="#875837" />

            {/* High Curved Backrest */}
            <rect x="30" y="22" width="70" height="66" rx="14" fill={fabricLight} />
            <rect x="34" y="26" width="62" height="58" rx="10" fill={fabricGradient} />

            {/* Tufted Button Details */}
            <circle cx="50" cy="42" r="3" fill="#E6B84F" opacity={isRoyal ? '1' : '0.4'} />
            <circle cx="80" cy="42" r="3" fill="#E6B84F" opacity={isRoyal ? '1' : '0.4'} />
            <circle cx="65" cy="56" r="3" fill="#E6B84F" opacity={isRoyal ? '1' : '0.4'} />

            {/* Curved Armrests */}
            <rect x="18" y="52" width="18" height="48" rx="8" fill={fabricLight} />
            <rect x="94" y="52" width="18" height="48" rx="8" fill={fabricLight} />

            {/* Plump Seat Cushion */}
            <rect x="32" y="74" width="66" height="28" rx="7" fill={fabricLight} stroke="#7D9379" strokeWidth="1" />
          </svg>
        </div>
      );
    }

    // 📚 SMALL BOOKSHELF / GRAND BOOKSHELF
    case 'small_bookshelf':
    case 'furn-small-bookshelf':
    case 'furn-wonders-bookshelf': {
      return (
        <div className={`relative ${sizeStyles} ${className} flex items-center justify-center select-none`}>
          <svg viewBox="0 0 130 140" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="shelfWood" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#A87955" />
                <stop offset="50%" stopColor="#C49A76" />
                <stop offset="100%" stopColor="#A87955" />
              </linearGradient>
            </defs>
            {/* Cast Shadow */}
            <ellipse cx="65" cy="132" rx="54" ry="6" fill="#503728" opacity="0.18" />

            {/* Outer Bookshelf Frame */}
            <rect x="16" y="16" width="98" height="114" rx="4" fill="url(#shelfWood)" />
            {/* Backboard Inner Shadow */}
            <rect x="22" y="22" width="86" height="102" rx="2" fill="#754829" opacity="0.35" />

            {/* Top Shelf Divider */}
            <rect x="18" y="66" width="94" height="8" rx="1" fill="#D4AD8C" />
            {/* Bottom Base */}
            <rect x="14" y="122" width="102" height="8" rx="2" fill="#875837" />

            {/* Row 1 Books (Colorful Mini Spines) */}
            <g transform="translate(26, 32)">
              <rect x="0" y="2" width="8" height="32" rx="1" fill="#C75252" />
              <rect x="9" y="0" width="10" height="34" rx="1" fill="#3D7B99" />
              <rect x="20" y="4" width="7" height="30" rx="1" fill="#E6B84F" />
              <rect x="28" y="1" width="9" height="33" rx="1" fill="#6B8E63" />
              <rect x="38" y="6" width="12" height="28" rx="1" fill="#91638E" />
              {/* Leaning Book */}
              <rect x="52" y="3" width="8" height="31" rx="1" transform="rotate(15 52 34)" fill="#E08B52" />
            </g>

            {/* Row 2 Books & Mini Plant */}
            <g transform="translate(26, 76)">
              <rect x="0" y="4" width="11" height="42" rx="1" fill="#3B5998" />
              <rect x="12" y="2" width="9" height="44" rx="1" fill="#4B4038" />
              <rect x="22" y="6" width="14" height="40" rx="1" fill="#D4AD8C" />
              <rect x="37" y="1" width="8" height="45" rx="1" fill="#C45865" />
              {/* Small potted succulent bookend */}
              <rect x="54" y="30" width="16" height="16" rx="2" fill="#F3EADC" stroke="#C49A76" strokeWidth="1" />
              <circle cx="62" cy="26" r="6" fill="#8FA58B" />
              <circle cx="66" cy="24" r="5" fill="#A2B79E" />
            </g>
          </svg>
        </div>
      );
    }

    // 💡 BEDSIDE LAMP / FLOOR LAMP / KNOWLEDGE BEACON
    case 'bedside_lamp':
    case 'furn-bedside-lamp':
    case 'furn-starter-lamp':
    case 'floor_lamp':
    case 'furn-reading-floor-lamp':
    case 'knowledge_lamp':
    case 'reward-knowledge-lamp': {
      const isKnowledge = renderKey.includes('knowledge');
      const isLitState = state !== 'turned_off' && isLit;
      return (
        <div className={`relative ${sizeStyles} ${className} flex items-center justify-center select-none`}>
          {/* Ambient Glow Rays when lit */}
          {isLitState && (
            <div
              className={`absolute inset-0 rounded-full blur-xl animate-pulse pointer-events-none ${
                isKnowledge ? 'bg-amber-300/60' : 'bg-yellow-200/50'
              }`}
            />
          )}
          <svg viewBox="0 0 120 130" className="w-full h-full relative z-10 drop-shadow-md">
            {/* Base Shadow */}
            <ellipse cx="60" cy="116" rx="26" ry="5" fill="#503728" opacity="0.18" />

            {/* Lamp Base & Turned Stem */}
            <ellipse cx="60" cy="112" rx="18" ry="4" fill="#C49A76" />
            <rect x="58" y="58" width="4" height="54" fill="#E6B84F" rx="1" />
            <circle cx="60" cy="74" r="5" fill="#D4A33B" />

            {/* Pleated Fabric Lampshade */}
            <polygon
              points="40,58 80,58 92,26 28,26"
              fill={isLitState ? (isKnowledge ? '#FFF2B2' : '#FFF6D6') : '#EFE8DE'}
              stroke="#D1C3B2"
              strokeWidth="1"
            />

            {/* Light Cone effect */}
            {isLitState && (
              <polygon points="28,58 92,58 114,116 6,116" fill="url(#lampBeam)" opacity="0.22" pointerEvents="none" />
            )}

            <defs>
              <linearGradient id="lampBeam" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFE066" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#FFE066" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      );
    }

    // 🪴 POTTED PLANTS & SUCCULENTS
    case 'indoor_plant':
    case 'decor-indoor-plant':
    case 'small_potted_plant':
    case 'decor-small-potted-plant':
    case 'paradise_palm':
    case 'furn-summer-palm': {
      const isWatered = state === 'watered';
      return (
        <div className={`relative ${sizeStyles} ${className} flex items-center justify-center select-none`}>
          <svg viewBox="0 0 120 130" className="w-full h-full drop-shadow-md">
            {/* Cast Shadow */}
            <ellipse cx="60" cy="118" rx="28" ry="6" fill="#503728" opacity="0.16" />

            {/* Ceramic Pot */}
            <polygon points="42,76 78,76 72,114 48,114" fill="#FFFDF9" stroke="#E2DDD5" strokeWidth="1" />
            {/* Pot Saucer */}
            <ellipse cx="60" cy="114" rx="16" ry="3" fill="#B88963" />

            {/* Soil */}
            <ellipse cx="60" cy="76" rx="18" ry="4" fill="#5A3D28" />

            {/* Lush Botanical Fronds / Leaves */}
            <path d="M 60,76 Q 40,40 28,26 Q 44,48 58,74 Z" fill="#6B8E63" />
            <path d="M 60,76 Q 78,36 92,24 Q 78,50 62,74 Z" fill="#8FA58B" />
            <path d="M 60,74 Q 60,20 60,12 Q 66,34 62,74 Z" fill="#A2B79E" />
            <path d="M 60,76 Q 46,56 36,50 Q 52,64 60,76 Z" fill="#5A7D52" />
            <path d="M 60,76 Q 74,56 84,50 Q 68,64 60,76 Z" fill="#7D9F75" />

            {/* Water Drops animation if recently watered */}
            {isWatered && (
              <g className="animate-bounce">
                <circle cx="50" cy="40" r="3" fill="#38BDF8" opacity="0.85" />
                <circle cx="72" cy="34" r="2.5" fill="#38BDF8" opacity="0.85" />
                <circle cx="60" cy="22" r="3" fill="#38BDF8" opacity="0.85" />
              </g>
            )}
          </svg>
        </div>
      );
    }

    // 🪟 WINDOW WITH CURTAINS
    case 'classic_window':
    case 'furn-classic-window':
    case 'cream_curtains':
    case 'furn-cream-curtains': {
      const isOpen = state === 'open';
      return (
        <div className={`relative ${sizeStyles} ${className} flex items-center justify-center select-none`}>
          <svg viewBox="0 0 130 140" className="w-full h-full drop-shadow-md">
            <defs>
              <linearGradient id="skyDay" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#BAE6FD" />
                <stop offset="60%" stopColor="#E0F2FE" />
                <stop offset="100%" stopColor="#FEF3C7" />
              </linearGradient>
            </defs>
            {/* Window Wooden Trim */}
            <rect x="22" y="16" width="86" height="106" rx="4" fill="#FFFFFF" stroke="#E2DDD5" strokeWidth="2" />
            {/* Sky Panes Background */}
            <rect x="28" y="22" width="74" height="94" fill="url(#skyDay)" />

            {/* Sun / Clouds outside */}
            <circle cx="48" cy="42" r="10" fill="#FDE047" opacity="0.8" />
            <ellipse cx="78" cy="48" rx="14" ry="6" fill="#FFFFFF" opacity="0.75" />

            {/* Mullion Frame Grid */}
            <rect x="63" y="22" width="4" height="94" fill="#FFFFFF" />
            <rect x="28" y="67" width="74" height="4" fill="#FFFFFF" />

            {/* Curtains on the sides */}
            <path
              d={isOpen ? 'M 22,14 Q 30,60 24,120 L 22,120 Z' : 'M 22,14 Q 40,60 32,120 L 22,120 Z'}
              fill="#F7F3EB"
              stroke="#DCD4C7"
              strokeWidth="1"
            />
            <path
              d={isOpen ? 'M 108,14 Q 100,60 106,120 L 108,120 Z' : 'M 108,14 Q 90,60 98,120 L 108,120 Z'}
              fill="#F7F3EB"
              stroke="#DCD4C7"
              strokeWidth="1"
            />

            {/* Window Sill */}
            <rect x="18" y="120" width="94" height="8" rx="2" fill="#F3EADC" stroke="#C8BFB0" strokeWidth="1" />
          </svg>
        </div>
      );
    }

    // 🚪 CLASSIC INTERIOR DOOR
    case 'interior_door':
    case 'furn-classic-interior-door': {
      const isOpen = state === 'open';
      return (
        <div className={`relative ${sizeStyles} ${className} flex items-center justify-center select-none`}>
          <svg viewBox="0 0 110 160" className="w-full h-full drop-shadow-md">
            {/* Door Frame */}
            <rect x="14" y="10" width="82" height="142" rx="3" fill="#EAE4DA" stroke="#D3C9BA" strokeWidth="2" />
            {/* Inner Wall opening */}
            <rect x="20" y="16" width="70" height="136" fill={isOpen ? '#3B4252' : '#FFFFFF'} />

            {/* Door Leaf */}
            <rect
              x={isOpen ? '20' : '20'}
              y="16"
              width={isOpen ? '30' : '70'}
              height="136"
              rx="1"
              fill="#FFFDF9"
              stroke="#D9D0C3"
              strokeWidth="1"
            />

            {/* 4 Classic Recessed Door Panels */}
            {!isOpen && (
              <>
                <rect x="28" y="24" width="22" height="42" rx="2" fill="#F4EFE6" />
                <rect x="58" y="24" width="22" height="42" rx="2" fill="#F4EFE6" />
                <rect x="28" y="76" width="22" height="64" rx="2" fill="#F4EFE6" />
                <rect x="58" y="76" width="22" height="64" rx="2" fill="#F4EFE6" />
                {/* Brass Door Knob */}
                <circle cx="78" cy="90" r="4" fill="#E6B84F" stroke="#997A26" strokeWidth="1" />
              </>
            )}
          </svg>
        </div>
      );
    }

    // 🔥 STONE FIREPLACE
    case 'stone_fireplace':
    case 'furn-winter-fireplace':
    case 'furn-streak-fireplace': {
      const isLitState = state !== 'turned_off' && isLit;
      return (
        <div className={`relative ${sizeStyles} ${className} flex items-center justify-center select-none`}>
          <svg viewBox="0 0 150 130" className="w-full h-full drop-shadow-lg">
            {/* Stone Fireplace Body */}
            <rect x="20" y="24" width="110" height="96" rx="4" fill="#A89F91" />

            {/* Riverstone Texture */}
            <rect x="24" y="28" width="24" height="12" rx="3" fill="#8C8375" />
            <rect x="52" y="28" width="28" height="12" rx="3" fill="#999082" />
            <rect x="84" y="28" width="24" height="12" rx="3" fill="#8C8375" />
            <rect x="24" y="44" width="18" height="14" rx="3" fill="#999082" />
            <rect x="108" y="44" width="18" height="14" rx="3" fill="#8C8375" />

            {/* Solid Timber Mantle */}
            <rect x="14" y="16" width="122" height="14" rx="3" fill="#875837" stroke="#684226" strokeWidth="1" />

            {/* Hearth Arch Firebox */}
            <path d="M 44,116 L 44,66 Q 75,50 106,66 L 106,116 Z" fill="#2E241E" />

            {/* Fire Logs */}
            <polygon points="52,106 98,106 90,114 60,114" fill="#543825" />

            {/* Flames when lit */}
            {isLitState && (
              <g className="animate-pulse">
                <path d="M 64,106 Q 75,64 75,68 Q 86,64 86,106 Z" fill="#F97316" />
                <path d="M 68,106 Q 75,76 75,80 Q 82,76 82,106 Z" fill="#FDE047" />
              </g>
            )}
          </svg>
        </div>
      );
    }

    // 🏆 TROPHIES & SCHOLAR SPECIALS
    case 'speller_trophy':
    case 'reward-master-speller-trophy': {
      return (
        <div className={`relative ${sizeStyles} ${className} flex items-center justify-center select-none`}>
          <svg viewBox="0 0 110 120" className="w-full h-full drop-shadow-md">
            <ellipse cx="55" cy="110" rx="30" ry="6" fill="#503728" opacity="0.16" />
            {/* Marble Base */}
            <rect x="36" y="88" width="38" height="18" rx="3" fill="#332B25" />
            <rect x="40" y="92" width="30" height="10" rx="1" fill="#E6B84F" />

            {/* Golden Stem & Cup */}
            <path d="M 50,88 L 50,70 L 60,70 L 60,88 Z" fill="#D4A33B" />
            <path d="M 32,32 Q 32,70 55,70 Q 78,70 78,32 Z" fill="#F5C042" stroke="#B8861E" strokeWidth="1" />
            {/* Trophy Handles */}
            <path d="M 32,38 Q 18,48 34,58" fill="none" stroke="#D4A33B" strokeWidth="3" />
            <path d="M 78,38 Q 92,48 76,58" fill="none" stroke="#D4A33B" strokeWidth="3" />
            <polygon points="55,42 57,48 63,48 58,52 60,58 55,54 50,58 52,52 47,48 53,48" fill="#FFFDF9" />
          </svg>
        </div>
      );
    }

    // Default Fallback: Clean Styled Presentation Badge with Emoji
    default: {
      return (
        <div
          className={`relative ${sizeStyles} ${className} flex items-center justify-center rounded-2xl bg-amber-50/70 border-2 border-amber-200/60 p-2 shadow-xs select-none`}
        >
          <span className="text-4xl sm:text-5xl drop-shadow-md select-none">{item.icon}</span>
        </div>
      );
    }
  }
};
