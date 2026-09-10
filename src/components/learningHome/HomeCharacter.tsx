import React from 'react';
import {
  CharacterState,
  CharacterCustomization,
  CharacterAnimationState
} from '../../types';
import { getWardrobeItemById } from '../../data/wardrobeCatalog';

interface HomeCharacterProps {
  state: CharacterState;
  onClick?: () => void;
  bubbleMessage?: string | null;
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showShadow?: boolean;
  inBedMode?: boolean; // When true, rendered directly on top of the mattress
}

export const DEFAULT_CHARACTER_CUSTOMIZATION: CharacterCustomization = {
  skinTone: '#F5CBA7',
  hairStyle: 'hair-cozy-bun',
  hairColor: '#4A3525',
  outfitColor: '#EFB6BD',
  topId: 'top-cozy-rose-sweater',
  bottomId: 'bot-classic-denim-jeans',
  shoesId: 'shoe-classic-white-sneakers',
  eyewearId: 'acc-reading-glasses',
  accessoryId: 'acc-blossom-hair-clip',
  expression: 'happy'
};

export const HomeCharacter: React.FC<HomeCharacterProps> = ({
  state,
  onClick,
  bubbleMessage,
  className = '',
  size = 'md',
  showShadow = true,
  inBedMode = false
}) => {
  const { customization, animation, facing } = state;
  const {
    skinTone = '#F5CBA7',
    hairStyle = 'hair-cozy-bun',
    hairColor = '#4A3525',
    outfitColor = '#EFB6BD',
    topId,
    bottomId,
    dressId,
    sleepwearId,
    shoesId,
    accessoryId,
    headwearId,
    eyewearId,
    accessory,
    expression = 'happy'
  } = customization;

  // Resolve equipped items with fallbacks
  const topItem = getWardrobeItemById(topId);
  const bottomItem = getWardrobeItemById(bottomId);
  const dressItem = getWardrobeItemById(dressId);
  const sleepwearItem = getWardrobeItemById(sleepwearId);
  const shoesItem = getWardrobeItemById(shoesId);
  const headwearItem = getWardrobeItemById(headwearId);
  const eyewearItem = getWardrobeItemById(eyewearId) || (accessory === 'reading_glasses' ? getWardrobeItemById('acc-reading-glasses') : undefined);
  const accessoryItem = getWardrobeItemById(accessoryId) || (accessory === 'flower_clip' ? getWardrobeItemById('acc-blossom-hair-clip') : accessory === 'star_badge' ? { id: 'star_badge', renderKey: 'star_badge' } : undefined);

  // If in sleep pose or inBedMode, optionally wear sleepwear if equipped
  const isSleeping = animation === 'sleeping' || inBedMode;
  const isSitting = animation === 'sitting' || animation === 'reading' || animation === 'studying' || animation === 'relaxing' || animation === 'writing';

  // Clothing color palette
  const topColor = isSleeping && sleepwearItem ? sleepwearItem.color : (dressItem ? dressItem.color : (topItem ? topItem.color : outfitColor));
  const topSecondary = isSleeping && sleepwearItem ? sleepwearItem.secondaryColor : (dressItem ? dressItem.secondaryColor : (topItem ? topItem.secondaryColor : '#FFFDF9'));
  const bottomColor = isSleeping && sleepwearItem ? sleepwearItem.color : (bottomItem ? bottomItem.color : '#2563EB');
  const shoeColor = shoesItem ? shoesItem.color : '#875837';
  const shoeSecondary = shoesItem ? shoesItem.secondaryColor : '#503728';

  // Size configurations
  const sizeClasses = {
    sm: 'w-12 h-16',
    md: 'w-16 h-22 sm:w-20 sm:h-28',
    lg: 'w-24 h-32 sm:w-32 sm:h-42',
    xl: 'w-36 h-48 sm:w-44 sm:h-60'
  }[size];

  // Animation styling
  let animClass = '';
  if (animation === 'walking') animClass = 'animate-bounce';
  else if (animation === 'celebrating') animClass = 'animate-pulse';

  // If inBedMode, the character is horizontally positioned on the mattress
  if (inBedMode) {
    return (
      <div
        className={`relative select-none ${className}`}
        style={{ width: '100%', height: '100%' }}
      >
        <svg viewBox="0 0 120 70" className="w-full h-full drop-shadow-md">
          <defs>
            <radialGradient id="bedBlushGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#F87171" stopOpacity="0.6" />
              <stop offset="100%" stopColor="#F87171" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Pillow indent shadow */}
          <ellipse cx="38" cy="28" rx="16" ry="10" fill="#E2D9CE" opacity="0.4" />

          {/* Back hair resting on pillow */}
          <g transform="translate(18, 12)">
            <ellipse cx="20" cy="16" rx="14" ry="12" fill={hairColor} />
            {hairStyle.includes('bun') && (
              <circle cx="8" cy="14" r="8" fill={hairColor} />
            )}
            {hairStyle.includes('curls') && (
              <>
                <circle cx="6" cy="18" r="6" fill={hairColor} />
                <circle cx="32" cy="18" r="6" fill={hairColor} />
              </>
            )}
          </g>

          {/* Peaceful Head resting sideways */}
          <g transform="translate(20, 14)">
            {/* Face Oval */}
            <ellipse cx="20" cy="15" rx="14" ry="13" fill={skinTone} />

            {/* Soft Rosy Cheek */}
            <circle cx="16" cy="19" r="3.5" fill="url(#bedBlushGlow)" />

            {/* Peaceful Sleeping Closed Eyes (◠ ◠) */}
            <path
              d="M 14,14 Q 17,11 20,14"
              fill="none"
              stroke="#4A3525"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
            <path
              d="M 23,14 Q 26,11 29,14"
              fill="none"
              stroke="#4A3525"
              strokeWidth="1.6"
              strokeLinecap="round"
            />

            {/* Gentle Resting Smile */}
            <path
              d="M 18,21 Q 21,23 24,21"
              fill="none"
              stroke="#874D38"
              strokeWidth="1.3"
              strokeLinecap="round"
            />

            {/* Front bangs and wisps */}
            <path
              d="M 8,11 C 12,4 28,4 32,11 C 28,7 22,8 18,7 C 14,8 10,7 8,11 Z"
              fill={hairColor}
            />

            {/* Cute sleeping cap or blossom clip */}
            {accessoryItem?.renderKey === 'blossom_clip' && (
              <g transform="translate(26, 4)">
                <circle cx="3" cy="3" r="2.5" fill="#F472B6" />
                <circle cx="3" cy="3" r="1.2" fill="#FDE047" />
              </g>
            )}
          </g>

          {/* Shoulders & Upper Pajama Body resting on mattress */}
          <g transform="translate(48, 22)">
            <rect
              x="0"
              y="0"
              width="44"
              height="24"
              rx="6"
              fill={topColor}
              stroke={topSecondary}
              strokeWidth="0.8"
            />
            {/* Gentle Pajama Collar */}
            <ellipse cx="2" cy="12" rx="4" ry="6" fill="#FFFDF9" />
            {/* Relaxed Arm curled above blanket */}
            <ellipse cx="14" cy="12" rx="10" ry="5" fill={topColor} />
            <circle cx="23" cy="12" r="3.5" fill={skinTone} />
          </g>

          {/* Cute Floating Zzz Floating Upwards */}
          <g className="animate-pulse">
            <text x="32" y="10" fill="#818CF8" fontSize="8" fontWeight="bold">z</text>
            <text x="38" y="6" fill="#6366F1" fontSize="10" fontWeight="extrabold">Z</text>
            <text x="46" y="3" fill="#4F46E5" fontSize="12" fontWeight="black">Z</text>
          </g>
        </svg>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`relative select-none cursor-pointer group ${animClass} ${className}`}
      style={{
        transform: `scaleX(${facing === 'left' ? -1 : 1})`
      }}
      title="Click to interact with your character!"
    >
      {/* Speech / Thought Bubble */}
      {bubbleMessage && (
        <div
          className="absolute -top-14 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-xs text-amber-950 font-bold text-xs px-3.5 py-1.5 rounded-2xl shadow-xl border border-amber-200/80 whitespace-nowrap pointer-events-none animate-fade-in flex items-center gap-1.5"
          style={{ transform: `scaleX(${facing === 'left' ? -1 : 1}) translateX(-50%)` }}
        >
          <span>{bubbleMessage}</span>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-b border-r border-amber-200/80" />
        </div>
      )}

      {/* Floating Action Icons */}
      {animation === 'sleeping' && (
        <div
          className="absolute -top-10 -right-2 text-indigo-400 font-black text-sm animate-pulse pointer-events-none"
          style={{ transform: `scaleX(${facing === 'left' ? -1 : 1})` }}
        >
          💤 Zzz...
        </div>
      )}
      {animation === 'celebrating' && (
        <div
          className="absolute -top-10 left-1/2 -translate-x-1/2 text-amber-400 text-lg animate-bounce pointer-events-none"
          style={{ transform: `scaleX(${facing === 'left' ? -1 : 1})` }}
        >
          ✨🌟✨
        </div>
      )}

      {/* Stylized Miniature Character Layered SVG */}
      <svg viewBox="0 0 80 112" className={`${sizeClasses} drop-shadow-md overflow-visible`}>
        <defs>
          <radialGradient id="blushGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F87171" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#F87171" stopOpacity="0" />
          </radialGradient>
          <filter id="charShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#503728" floodOpacity="0.22" />
          </filter>
        </defs>

        {/* 1. Floor Contact Shadow */}
        {showShadow && !isSitting && (
          <ellipse cx="40" cy="106" rx="20" ry="4.5" fill="#503728" opacity="0.22" />
        )}
        {showShadow && isSitting && (
          <ellipse cx="40" cy="94" rx="22" ry="5" fill="#503728" opacity="0.26" />
        )}

        {/* 2. BACK HAIR LAYER (Behind Head and Torso) */}
        <g transform="translate(22, 14)">
          {hairStyle.includes('bun') && (
            <circle cx="18" cy="4" r="10" fill={hairColor} />
          )}
          {hairStyle.includes('ponytail') && (
            <ellipse cx="4" cy="8" rx="8" ry="14" fill={hairColor} transform="rotate(22 4 8)" />
          )}
          {hairStyle.includes('braids') && (
            <>
              <rect x="0" y="14" width="6" height="24" rx="3" fill={hairColor} />
              <rect x="30" y="14" width="6" height="24" rx="3" fill={hairColor} />
              {/* Ribbon ties */}
              <circle cx="3" cy="36" r="2.5" fill="#F472B6" />
              <circle cx="33" cy="36" r="2.5" fill="#F472B6" />
            </>
          )}
          {hairStyle.includes('curls') && (
            <>
              <circle cx="2" cy="14" r="8" fill={hairColor} />
              <circle cx="34" cy="14" r="8" fill={hairColor} />
              <circle cx="0" cy="24" r="7" fill={hairColor} />
              <circle cx="36" cy="24" r="7" fill={hairColor} />
            </>
          )}
          {hairStyle.includes('locs') && (
            <>
              <rect x="0" y="14" width="5" height="26" rx="2.5" fill={hairColor} />
              <rect x="31" y="14" width="5" height="26" rx="2.5" fill={hairColor} />
              {/* Golden Beads */}
              <rect x="0" y="24" width="5" height="3" rx="1" fill="#FACC15" />
              <rect x="31" y="28" width="5" height="3" rx="1" fill="#FACC15" />
            </>
          )}
          {hairStyle.includes('afro_puffs') && (
            <>
              <circle cx="2" cy="6" r="9" fill={hairColor} />
              <circle cx="34" cy="6" r="9" fill={hairColor} />
            </>
          )}
          {hairStyle.includes('bob') && (
            <rect x="0" y="12" width="36" height="22" rx="10" fill={hairColor} />
          )}
          {hairStyle.includes('side_braid') && (
            <g transform="translate(24, 14)">
              <ellipse cx="8" cy="14" rx="6" ry="16" fill={hairColor} transform="rotate(18 8 14)" />
              <circle cx="12" cy="28" r="2.5" fill="#F472B6" />
            </g>
          )}
        </g>

        {/* 3. LEGS, BOTTOMS & SHOES LAYER */}
        {isSitting ? (
          // ================= SITTING LEGS =================
          <g transform="translate(22, 70)">
            {/* Thighs extended forward */}
            <rect x="4" y="0" width="28" height="14" rx="5" fill={bottomColor} />
            {/* Lower legs bent down */}
            <rect x="4" y="10" width="10" height="14" rx="4" fill={skinTone} />
            <rect x="22" y="10" width="10" height="14" rx="4" fill={skinTone} />
            {/* Pants cuffs or tights */}
            {!dressItem && (
              <>
                <rect x="4" y="10" width="10" height="8" rx="2" fill={bottomColor} />
                <rect x="22" y="10" width="10" height="8" rx="2" fill={bottomColor} />
              </>
            )}
            {/* Shoes */}
            <ellipse cx="9" cy="23" rx="6.5" ry="3.8" fill={shoeColor} />
            <ellipse cx="27" cy="23" rx="6.5" ry="3.8" fill={shoeColor} />
            {shoesItem?.renderKey === 'sneakers' && (
              <>
                <rect x="3" y="23" width="12" height="2" rx="1" fill="#FFFFFF" />
                <rect x="21" y="23" width="12" height="2" rx="1" fill="#FFFFFF" />
              </>
            )}
            {shoesItem?.renderKey === 'bunny_slippers' && (
              <>
                <circle cx="9" cy="20" r="3" fill="#FCE7F3" />
                <circle cx="7" cy="17" r="1.5" fill="#F43F5E" />
                <circle cx="11" cy="17" r="1.5" fill="#F43F5E" />
                <circle cx="27" cy="20" r="3" fill="#FCE7F3" />
                <circle cx="25" cy="17" r="1.5" fill="#F43F5E" />
                <circle cx="29" cy="17" r="1.5" fill="#F43F5E" />
              </>
            )}
          </g>
        ) : (
          // ================= STANDING / WALKING LEGS =================
          <g transform="translate(28, 76)">
            {/* Left Leg */}
            <rect
              x="2"
              y="0"
              width="8"
              height="22"
              rx="3"
              fill={dressItem ? skinTone : bottomColor}
              transform={animation === 'walking' ? 'rotate(-6 6 0)' : undefined}
            />
            {/* Right Leg */}
            <rect
              x="14"
              y="0"
              width="8"
              height="22"
              rx="3"
              fill={dressItem ? skinTone : bottomColor}
              transform={animation === 'walking' ? 'rotate(6 18 0)' : undefined}
            />
            {/* Left Shoe */}
            <ellipse
              cx="6"
              cy="23"
              rx="6.5"
              ry="3.8"
              fill={shoeColor}
              transform={animation === 'walking' ? 'translate(-1, 0)' : undefined}
            />
            {/* Right Shoe */}
            <ellipse
              cx="18"
              cy="23"
              rx="6.5"
              ry="3.8"
              fill={shoeColor}
              transform={animation === 'walking' ? 'translate(1, 0)' : undefined}
            />

            {/* Sneaker White Sole accent */}
            {shoesItem?.renderKey === 'sneakers' && (
              <>
                <rect x="0" y="23" width="12" height="2" rx="1" fill="#FFFFFF" />
                <rect x="12" y="23" width="12" height="2" rx="1" fill="#FFFFFF" />
              </>
            )}
            {shoesItem?.renderKey === 'bunny_slippers' && (
              <>
                <circle cx="6" cy="20" r="3" fill="#FCE7F3" />
                <circle cx="4" cy="17" r="1.5" fill="#F43F5E" />
                <circle cx="8" cy="17" r="1.5" fill="#F43F5E" />
                <circle cx="18" cy="20" r="3" fill="#FCE7F3" />
                <circle cx="16" cy="17" r="1.5" fill="#F43F5E" />
                <circle cx="20" cy="17" r="1.5" fill="#F43F5E" />
              </>
            )}
          </g>
        )}

        {/* 4. TORSO / TOP / DRESS LAYER */}
        <g transform={isSitting ? 'translate(24, 46)' : 'translate(24, 48)'}>
          {dressItem ? (
            // Flowing Dress
            <g>
              <path
                d="M 4,2 Q 16,0 28,2 L 32,28 Q 16,32 0,28 Z"
                fill={topColor}
                filter="url(#charShadow)"
              />
              <ellipse cx="16" cy="2" rx="6" ry="3" fill={topSecondary} />
            </g>
          ) : (
            // Shirt / Sweater / Hoodie Torso
            <g>
              <rect
                x="4"
                y="2"
                width="24"
                height={isSitting ? "24" : "28"}
                rx="7"
                fill={topColor}
                filter="url(#charShadow)"
              />
              {/* Collar / Neckline */}
              <ellipse cx="16" cy="3" rx="7" ry="3" fill={topSecondary} />

              {/* Graphic Print or Ribbing */}
              {topItem?.renderKey === 'knit_sweater' && (
                <line x1="8" y1="26" x2="24" y2="26" stroke="#FFFFFF" strokeWidth="1" opacity="0.4" />
              )}
              {topItem?.renderKey === 'hoodie' && (
                <g>
                  {/* Hoodie pouch pocket */}
                  <rect x="8" y="16" width="16" height="8" rx="3" fill="#64748B" opacity="0.3" />
                  <path d="M 14,4 L 14,10" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.6" />
                  <path d="M 18,4 L 18,10" stroke="#FFFFFF" strokeWidth="0.8" opacity="0.6" />
                </g>
              )}
              {topItem?.renderKey === 'blazer' && (
                <g>
                  {/* Gold blazer buttons & lapels */}
                  <polygon points="12,3 16,12 20,3" fill="#FFFFFF" />
                  <circle cx="16" cy="15" r="1.5" fill="#F59E0B" />
                  <circle cx="16" cy="20" r="1.5" fill="#F59E0B" />
                </g>
              )}
              {topItem?.renderKey === 'striped_tee' && (
                <g stroke="#1E3A8A" strokeWidth="1.2" opacity="0.7">
                  <line x1="6" y1="8" x2="26" y2="8" />
                  <line x1="6" y1="13" x2="26" y2="13" />
                  <line x1="6" y1="18" x2="26" y2="18" />
                </g>
              )}
            </g>
          )}

          {/* Skirt overlay if wearing a skirt and not a dress */}
          {bottomItem?.renderKey === 'pleated_skirt' && !dressItem && (
            <path d="M 2,24 L 30,24 L 33,32 L -1,32 Z" fill={bottomColor} />
          )}
          {bottomItem?.renderKey === 'floral_skirt' && !dressItem && (
            <path d="M 2,24 L 30,24 L 34,33 L -2,33 Z" fill={bottomColor} />
          )}
        </g>

        {/* 5. ARMS & HELD PROPS LAYER */}
        {animation === 'reading' ? (
          // Holding open storybook
          <g transform="translate(24, 52)">
            <ellipse cx="3" cy="8" rx="4" ry="6" fill={topColor} />
            <ellipse cx="29" cy="8" rx="4" ry="6" fill={topColor} />
            {/* Open book */}
            <g transform="translate(6, 4)">
              <rect x="0" y="0" width="10" height="13" rx="1" fill="#2563EB" stroke="#1D4ED8" strokeWidth="0.5" />
              <rect x="10" y="0" width="10" height="13" rx="1" fill="#2563EB" stroke="#1D4ED8" strokeWidth="0.5" />
              <rect x="1" y="1" width="8" height="11" fill="#FFFDF9" />
              <rect x="11" y="1" width="8" height="11" fill="#FFFDF9" />
              <line x1="3" y1="3.5" x2="7" y2="3.5" stroke="#94A3B8" strokeWidth="0.6" />
              <line x1="3" y1="6" x2="7" y2="6" stroke="#94A3B8" strokeWidth="0.6" />
              <line x1="3" y1="8.5" x2="7" y2="8.5" stroke="#94A3B8" strokeWidth="0.6" />
              <line x1="13" y1="3.5" x2="17" y2="3.5" stroke="#94A3B8" strokeWidth="0.6" />
              <line x1="13" y1="6" x2="17" y2="6" stroke="#94A3B8" strokeWidth="0.6" />
              {/* Gold bookmark ribbon */}
              <line x1="10" y1="0" x2="10" y2="15" stroke="#F59E0B" strokeWidth="1" />
            </g>
            {/* Hands clasping edges */}
            <circle cx="5" cy="11" r="2.5" fill={skinTone} />
            <circle cx="27" cy="11" r="2.5" fill={skinTone} />
          </g>
        ) : animation === 'studying' || animation === 'writing' ? (
          // Holding pencil and study notebook
          <g transform="translate(24, 52)">
            <ellipse cx="3" cy="8" rx="4" ry="6" fill={topColor} />
            <ellipse cx="29" cy="8" rx="4" ry="6" fill={topColor} />
            {/* Desk Notebook */}
            <rect x="7" y="5" width="16" height="13" rx="2" fill="#FEF3C7" stroke="#D97706" strokeWidth="0.8" />
            <line x1="10" y1="9" x2="20" y2="9" stroke="#B45309" strokeWidth="0.6" />
            <line x1="10" y1="12" x2="18" y2="12" stroke="#B45309" strokeWidth="0.6" />
            {/* Yellow Pencil */}
            <polygon points="24,2 26,4 21,12 19,10" fill="#FBBF24" />
            <polygon points="19,10 21,12 18,14" fill="#78350F" />
            <circle cx="5" cy="11" r="2.5" fill={skinTone} />
            <circle cx="21" cy="10" r="2.5" fill={skinTone} />
          </g>
        ) : animation === 'watering' ? (
          // Holding watering can
          <g transform="translate(22, 52)">
            <ellipse cx="26" cy="6" rx="4" ry="7" fill={topColor} />
            <rect x="26" y="6" width="14" height="11" rx="2" fill="#38BDF8" />
            <line x1="40" y1="6" x2="48" y2="1" stroke="#0284C7" strokeWidth="2.5" strokeLinecap="round" />
            <circle cx="49" cy="4" r="1.5" fill="#38BDF8" />
            <circle cx="51" cy="8" r="1.5" fill="#38BDF8" />
          </g>
        ) : animation === 'celebrating' ? (
          // Arms raised joyfully
          <g transform="translate(18, 38)">
            <ellipse cx="4" cy="8" rx="4" ry="10" fill={topColor} transform="rotate(-35 4 8)" />
            <circle cx="0" cy="0" r="3" fill={skinTone} />
            <ellipse cx="40" cy="8" rx="4" ry="10" fill={topColor} transform="rotate(35 40 8)" />
            <circle cx="44" cy="0" r="3" fill={skinTone} />
          </g>
        ) : animation === 'relaxing' ? (
          // Holding warm mug with steam
          <g transform="translate(24, 52)">
            <ellipse cx="4" cy="8" rx="4" ry="6" fill={topColor} />
            <ellipse cx="28" cy="8" rx="4" ry="6" fill={topColor} />
            {/* Ceramic Warm Mug */}
            <rect x="11" y="6" width="10" height="10" rx="2" fill="#F87171" />
            <path d="M 21,8 C 24,8 24,12 21,12" fill="none" stroke="#F87171" strokeWidth="1.2" />
            {/* Steam wisp */}
            <path d="M 14,4 Q 15,2 14,0" fill="none" stroke="#CBD5E1" strokeWidth="0.8" />
            <path d="M 18,4 Q 17,2 18,0" fill="none" stroke="#CBD5E1" strokeWidth="0.8" />
            <circle cx="9" cy="11" r="2.5" fill={skinTone} />
            <circle cx="23" cy="11" r="2.5" fill={skinTone} />
          </g>
        ) : (
          // Natural resting arms
          <g transform={isSitting ? 'translate(20, 50)' : 'translate(20, 52)'}>
            <rect x="0" y="2" width="6" height="16" rx="3" fill={topColor} />
            <ellipse cx="3" cy="18" rx="3" ry="3" fill={skinTone} />
            <rect x="34" y="2" width="6" height="16" rx="3" fill={topColor} />
            <ellipse cx="37" cy="18" rx="3" ry="3" fill={skinTone} />
          </g>
        )}

        {/* 6. HEAD & FACE LAYER */}
        <g transform="translate(22, 14)">
          {/* Face Oval */}
          <ellipse cx="18" cy="22" rx="16" ry="15" fill={skinTone} />

          {/* Sweet Rosy Blush Cheeks */}
          <circle cx="8" cy="26" r="4" fill="url(#blushGlow)" />
          <circle cx="28" cy="26" r="4" fill="url(#blushGlow)" />

          {/* Eyes & Eyebrows */}
          {animation === 'sleeping' || expression === 'sleepy' ? (
            // Peaceful curved sleeping eyes
            <>
              <path d="M 10,22 Q 13,25 16,22" fill="none" stroke="#4A3525" strokeWidth="1.6" strokeLinecap="round" />
              <path d="M 20,22 Q 23,25 26,22" fill="none" stroke="#4A3525" strokeWidth="1.6" strokeLinecap="round" />
            </>
          ) : expression === 'proud' || animation === 'celebrating' ? (
            // Big happy eye sparkles
            <>
              <ellipse cx="13" cy="21" rx="3" ry="4" fill="#2E241E" />
              <circle cx="12" cy="19" r="1.3" fill="#FFFFFF" />
              <circle cx="14" cy="22" r="0.7" fill="#FFFFFF" />
              <ellipse cx="23" cy="21" rx="3" ry="4" fill="#2E241E" />
              <circle cx="22" cy="19" r="1.3" fill="#FFFFFF" />
              <circle cx="24" cy="22" r="0.7" fill="#FFFFFF" />
              {/* Confident curved eyebrows */}
              <path d="M 10,16 Q 13,14 16,16" fill="none" stroke="#4A3525" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M 20,16 Q 23,14 26,16" fill="none" stroke="#4A3525" strokeWidth="1.2" strokeLinecap="round" />
            </>
          ) : (
            // Natural bright curious eyes
            <>
              <ellipse cx="13" cy="21" rx="2.5" ry="3.5" fill="#2E241E" />
              <circle cx="12" cy="20" r="1" fill="#FFFFFF" />
              <ellipse cx="23" cy="21" rx="2.5" ry="3.5" fill="#2E241E" />
              <circle cx="22" cy="20" r="1" fill="#FFFFFF" />
              {/* Eyebrows */}
              <path d="M 11,16 Q 13,15 15,16" fill="none" stroke="#4A3525" strokeWidth="1" strokeLinecap="round" />
              <path d="M 21,16 Q 23,15 25,16" fill="none" stroke="#4A3525" strokeWidth="1" strokeLinecap="round" />
            </>
          )}

          {/* Mouth */}
          {animation === 'celebrating' || expression === 'proud' ? (
            // Big joyful open smile
            <path d="M 14,27 Q 18,34 22,27 Z" fill="#874D38" />
          ) : (
            // Sweet gentle smile
            <path d="M 15,28 Q 18,31 21,28" fill="none" stroke="#874D38" strokeWidth="1.5" strokeLinecap="round" />
          )}

          {/* Eyewear */}
          {eyewearItem?.renderKey === 'reading_glasses' && (
            <g transform="translate(6, 17)">
              <rect x="3" y="1" width="9" height="7" rx="2" fill="none" stroke="#B45309" strokeWidth="1.3" />
              <rect x="14" y="1" width="9" height="7" rx="2" fill="none" stroke="#B45309" strokeWidth="1.3" />
              <line x1="12" y1="4" x2="14" y2="4" stroke="#B45309" strokeWidth="1.3" />
            </g>
          )}
          {eyewearItem?.renderKey === 'wire_glasses' && (
            <g transform="translate(6, 17)">
              <circle cx="7" cy="4" r="4.5" fill="none" stroke="#D97706" strokeWidth="1" />
              <circle cx="18" cy="4" r="4.5" fill="none" stroke="#D97706" strokeWidth="1" />
              <line x1="11.5" y1="4" x2="13.5" y2="4" stroke="#D97706" strokeWidth="1" />
            </g>
          )}

          {/* Front Hair Bangs & Texture */}
          <path
            d="M 2,18 C 2,6 34,6 34,18 C 30,12 24,14 18,12 C 12,14 6,12 2,18 Z"
            fill={hairColor}
          />

          {/* Headwear & Accessories */}
          {headwearItem?.renderKey === 'beret' && (
            <ellipse cx="18" cy="5" rx="18" ry="7" fill={headwearItem.color || '#991B1B'} transform="rotate(-8 18 5)" />
          )}
          {headwearItem?.renderKey === 'beanie' && (
            <g>
              <path d="M 4,12 C 4,0 32,0 32,12 Z" fill={headwearItem.color || '#D97706'} />
              <circle cx="18" cy="0" r="3.5" fill={headwearItem.secondaryColor || '#92400E'} />
            </g>
          )}
          {headwearItem?.renderKey === 'hair_bow' && (
            <g transform="translate(18, 4)">
              <polygon points="0,0 -8,-5 -8,5" fill="#FB7185" />
              <polygon points="0,0 8,-5 8,5" fill="#FB7185" />
              <circle cx="0" cy="0" r="2.5" fill="#E11D48" />
            </g>
          )}
          {accessoryItem?.renderKey === 'blossom_clip' && (
            <g transform="translate(24, 8)">
              <circle cx="4" cy="4" r="3" fill="#F472B6" />
              <circle cx="4" cy="4" r="1.5" fill="#FDE047" />
            </g>
          )}
          {accessoryItem?.renderKey === 'headphones' && (
            <g transform="translate(2, 6)">
              <path d="M 0,14 C 0,-2 32,-2 32,14" fill="none" stroke="#059669" strokeWidth="2.5" />
              <rect x="-2" y="10" width="5" height="10" rx="2" fill="#34D399" />
              <rect x="29" y="10" width="5" height="10" rx="2" fill="#34D399" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};
