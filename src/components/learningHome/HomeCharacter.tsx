import React from 'react';
import {
  CharacterState,
  CharacterCustomization,
  CharacterAnimationState
} from '../../types';

interface HomeCharacterProps {
  state: CharacterState;
  onClick?: () => void;
  bubbleMessage?: string | null;
  className?: string;
}

export const DEFAULT_CHARACTER_CUSTOMIZATION: CharacterCustomization = {
  skinTone: '#F5CBA7',
  hairStyle: 'cozy_bun',
  hairColor: '#4A3525',
  outfitColor: '#EFB6BD',
  accessory: 'reading_glasses'
};

export const HomeCharacter: React.FC<HomeCharacterProps> = ({
  state,
  onClick,
  bubbleMessage,
  className = ''
}) => {
  const { customization, animation, facing } = state;
  const { skinTone, hairStyle, hairColor, outfitColor, accessory } = customization;

  // Animation styling
  let animClass = '';
  if (animation === 'walking') animClass = 'animate-bounce';
  else if (animation === 'idle') animClass = 'hover:scale-105 transition-transform duration-300';
  else if (animation === 'sleeping') animClass = 'opacity-95';

  return (
    <div
      onClick={onClick}
      className={`relative select-none cursor-pointer group ${animClass} ${className}`}
      style={{
        transform: `scaleX(${facing === 'left' ? -1 : 1})`
      }}
      title="Click to interact with your mini learner!"
    >
      {/* Speech / Thought Bubble (unflipped so text reads naturally) */}
      {bubbleMessage && (
        <div
          className="absolute -top-12 left-1/2 -translate-x-1/2 z-40 bg-white/95 backdrop-blur-xs text-amber-950 font-bold text-xs px-3 py-1.5 rounded-xl shadow-lg border border-amber-200/80 whitespace-nowrap pointer-events-none animate-fade-in"
          style={{ transform: `scaleX(${facing === 'left' ? -1 : 1}) translateX(-50%)` }}
        >
          {bubbleMessage}
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-white rotate-45 border-b border-r border-amber-200/80" />
        </div>
      )}

      {/* Sleeping "Zzz" floaters */}
      {animation === 'sleeping' && (
        <div
          className="absolute -top-8 -right-2 text-indigo-400 font-bold text-xs animate-pulse pointer-events-none"
          style={{ transform: `scaleX(${facing === 'left' ? -1 : 1})` }}
        >
          💤 Zzz...
        </div>
      )}

      {/* Stylized Miniature Character SVG */}
      <svg viewBox="0 0 80 110" className="w-16 h-22 sm:w-20 sm:h-28 drop-shadow-md">
        <defs>
          <radialGradient id="blushGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#F87171" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#F87171" stopOpacity="0" />
          </radialGradient>
          <filter id="charShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#503728" floodOpacity="0.25" />
          </filter>
        </defs>

        {/* Floor Contact Shadow */}
        <ellipse cx="40" cy="104" rx="20" ry="5" fill="#503728" opacity="0.2" />

        {/* --- LEGS & SHOES --- */}
        {animation === 'sitting' ? (
          // Sitting curled legs
          <g transform="translate(24, 76)">
            <rect x="0" y="4" width="32" height="14" rx="6" fill="#3E4C59" />
            <ellipse cx="6" cy="16" rx="6" ry="4" fill="#875837" />
            <ellipse cx="26" cy="16" rx="6" ry="4" fill="#875837" />
          </g>
        ) : animation === 'sleeping' ? (
          // Lying down legs
          <g transform="translate(26, 78)">
            <rect x="0" y="6" width="30" height="12" rx="4" fill="#3E4C59" />
            <ellipse cx="28" cy="12" rx="5" ry="4" fill="#875837" />
          </g>
        ) : (
          // Standing / Walking legs
          <g transform="translate(28, 76)">
            <rect x="2" y="0" width="8" height="22" rx="3" fill="#3E4C59" />
            <rect x="14" y="0" width="8" height="22" rx="3" fill="#3E4C59" />
            {/* Little Brown Oxford Shoes */}
            <ellipse cx="6" cy="22" rx="6" ry="3.5" fill="#875837" />
            <ellipse cx="18" cy="22" rx="6" ry="3.5" fill="#875837" />
          </g>
        )}

        {/* --- BODY / SWEATER --- */}
        <g transform="translate(24, 48)">
          {/* Main Sweater Torso */}
          <rect x="4" y="2" width="24" height="28" rx="8" fill={outfitColor} filter="url(#charShadow)" />
          {/* Knit Collar */}
          <ellipse cx="16" cy="3" rx="7" ry="3" fill="#FFFDF9" />
          {/* Subtle ribbing stitches */}
          <line x1="8" y1="28" x2="24" y2="28" stroke="#FFFFFF" strokeWidth="1" opacity="0.4" />
        </g>

        {/* --- ARMS / HELD PROPS --- */}
        {animation === 'reading' ? (
          // Holding open book
          <g transform="translate(24, 56)">
            {/* Arms wrapped around book */}
            <ellipse cx="4" cy="8" rx="4" ry="6" fill={outfitColor} />
            <ellipse cx="28" cy="8" rx="4" ry="6" fill={outfitColor} />
            {/* Miniature Open Storybook */}
            <g transform="translate(6, 4)">
              <rect x="0" y="0" width="10" height="12" rx="1" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="0.5" />
              <rect x="10" y="0" width="10" height="12" rx="1" fill="#3B82F6" stroke="#1D4ED8" strokeWidth="0.5" />
              <rect x="1" y="1" width="8" height="10" fill="#FFFDF9" />
              <rect x="11" y="1" width="8" height="10" fill="#FFFDF9" />
              {/* Little text lines */}
              <line x1="3" y1="3" x2="7" y2="3" stroke="#94A3B8" strokeWidth="0.5" />
              <line x1="3" y1="6" x2="7" y2="6" stroke="#94A3B8" strokeWidth="0.5" />
              <line x1="13" y1="3" x2="17" y2="3" stroke="#94A3B8" strokeWidth="0.5" />
            </g>
          </g>
        ) : animation === 'watering' ? (
          // Holding watering can
          <g transform="translate(22, 54)">
            <ellipse cx="26" cy="6" rx="4" ry="7" fill={outfitColor} />
            {/* Cute Blue Watering Can */}
            <rect x="26" y="6" width="12" height="10" rx="2" fill="#38BDF8" />
            <line x1="38" y1="6" x2="44" y2="2" stroke="#0284C7" strokeWidth="2" />
            {/* Water Drops */}
            <circle cx="45" cy="5" r="1.5" fill="#38BDF8" />
            <circle cx="47" cy="8" r="1.5" fill="#38BDF8" />
          </g>
        ) : (
          // Natural resting arms
          <g transform="translate(20, 52)">
            <rect x="0" y="2" width="6" height="18" rx="3" fill={outfitColor} />
            <ellipse cx="3" cy="20" rx="3" ry="3" fill={skinTone} />
            <rect x="34" y="2" width="6" height="18" rx="3" fill={outfitColor} />
            <ellipse cx="37" cy="20" rx="3" ry="3" fill={skinTone} />
          </g>
        )}

        {/* --- HEAD & FACE --- */}
        <g transform="translate(22, 14)">
          {/* Back Hair layer for bun / long hair */}
          {hairStyle === 'cozy_bun' && (
            <circle cx="18" cy="4" r="10" fill={hairColor} />
          )}
          {hairStyle === 'ponytail' && (
            <ellipse cx="4" cy="8" rx="7" ry="12" fill={hairColor} transform="rotate(20 4 8)" />
          )}
          {hairStyle === 'braids' && (
            <>
              <rect x="0" y="14" width="6" height="22" rx="3" fill={hairColor} />
              <rect x="30" y="14" width="6" height="22" rx="3" fill={hairColor} />
            </>
          )}

          {/* Face Oval */}
          <ellipse cx="18" cy="22" rx="16" ry="15" fill={skinTone} />

          {/* Sweet Rosy Cheeks */}
          <circle cx="8" cy="26" r="4" fill="url(#blushGlow)" />
          <circle cx="28" cy="26" r="4" fill="url(#blushGlow)" />

          {/* Eyes (Open vs Closed/Sleeping) */}
          {animation === 'sleeping' ? (
            // Peaceful curved closed eyes
            <>
              <path d="M 10,22 Q 13,25 16,22" fill="none" stroke="#4A3525" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M 20,22 Q 23,25 26,22" fill="none" stroke="#4A3525" strokeWidth="1.5" strokeLinecap="round" />
            </>
          ) : (
            // Bright curious eyes with white sparkle catchlights
            <>
              <ellipse cx="13" cy="21" rx="2.5" ry="3.5" fill="#2E241E" />
              <circle cx="12" cy="20" r="1" fill="#FFFFFF" />
              <ellipse cx="23" cy="21" rx="2.5" ry="3.5" fill="#2E241E" />
              <circle cx="22" cy="20" r="1" fill="#FFFFFF" />
            </>
          )}

          {/* Happy Smile */}
          <path d="M 15,28 Q 18,31 21,28" fill="none" stroke="#874D38" strokeWidth="1.5" strokeLinecap="round" />

          {/* Eyeglasses Accessory */}
          {accessory === 'reading_glasses' && (
            <g transform="translate(6, 17)">
              <rect x="3" y="1" width="9" height="7" rx="2" fill="none" stroke="#B45309" strokeWidth="1.2" />
              <rect x="14" y="1" width="9" height="7" rx="2" fill="none" stroke="#B45309" strokeWidth="1.2" />
              <line x1="12" y1="4" x2="14" y2="4" stroke="#B45309" strokeWidth="1.2" />
            </g>
          )}

          {/* Front Hair Bangs */}
          <path
            d="M 2,18 C 2,6 34,6 34,18 C 30,12 24,14 18,12 C 12,14 6,12 2,18 Z"
            fill={hairColor}
          />

          {/* Accessories */}
          {accessory === 'flower_clip' && (
            <g transform="translate(24, 8)">
              <circle cx="4" cy="4" r="3" fill="#F472B6" />
              <circle cx="4" cy="4" r="1.5" fill="#FDE047" />
            </g>
          )}
          {accessory === 'star_badge' && (
            <polygon points="18,34 19,37 22,37 20,39 21,42 18,40 15,42 16,39 14,37 17,37" fill="#FACC15" />
          )}
        </g>
      </svg>
    </div>
  );
};
