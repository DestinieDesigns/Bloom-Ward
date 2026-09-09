import React from 'react';
import { HomeItem } from '../../types';

interface MiniatureAnimalRendererProps {
  item: HomeItem;
  size?: 'sm' | 'md' | 'lg' | 'preview';
  state?: string;
  className?: string;
}

/**
 * High-fidelity, charming original miniature animal game asset renderer.
 * Designed with natural anatomical proportions, soft fur/feather shading,
 * detailed paws, expressive facial features, and cozy idle / interactive animations.
 *
 * Replaces all emoji-based animal placeholders with bespoke vector assets.
 */
export const MiniatureAnimalRenderer: React.FC<MiniatureAnimalRendererProps> = ({
  item,
  size = 'md',
  state = 'idle',
  className = ''
}) => {
  const sizeStyles = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20 sm:w-22 sm:h-22',
    lg: 'w-26 h-26 sm:w-28 sm:h-28',
    preview: 'w-32 h-32 sm:w-36 sm:h-36'
  }[size];

  const itemId = item.id.toLowerCase();
  const renderKey = (item.renderType || '').toLowerCase();

  // Determine animal type from ID, name, or renderType
  const isCat = itemId.includes('cat') || itemId.includes('luna') || renderKey.includes('cat');
  const isDog = itemId.includes('pup') || itemId.includes('dog') || itemId.includes('sparky') || renderKey.includes('dog');
  const isRabbit = itemId.includes('bunny') || itemId.includes('rabbit') || itemId.includes('pippin') || renderKey.includes('rabbit') || itemId.includes('plush');
  const isBird = itemId.includes('owl') || itemId.includes('bird') || itemId.includes('barnaby') || renderKey.includes('owl');
  const isFox = itemId.includes('fox') || itemId.includes('pip-fox') || renderKey.includes('fox');

  // =========================================================================
  // 🐱 1. LUNA THE CALICO / GINGER READING CAT
  // =========================================================================
  if (isCat) {
    const isSleeping = state === 'sleep';
    const isStretching = state === 'stretch';
    const isGrooming = state === 'groom';
    const isPlaying = state === 'play';
    const isPetted = state === 'pet';

    return (
      <div className={`relative ${sizeStyles} ${className} flex items-center justify-center select-none`}>
        {/* Heart bubbles when petted */}
        {isPetted && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none z-20 animate-bounce">
            <span className="text-sm">💖</span>
            <span className="text-xs">✨</span>
          </div>
        )}

        {/* Yarn ball when playing */}
        {isPlaying && (
          <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-rose-400 border border-rose-600 shadow-xs z-20 animate-spin" style={{ animationDuration: '3s' }}>
            <div className="w-full h-0.5 bg-rose-200 mt-2" />
          </div>
        )}

        {/* Soft ground cast shadow */}
        <div className="absolute bottom-1 w-3/4 h-2.5 bg-stone-900/15 rounded-full blur-2xs" />

        <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 drop-shadow-xs">
          <defs>
            <linearGradient id="catFur" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F5A25D" />
              <stop offset="50%" stopColor="#E28743" />
              <stop offset="100%" stopColor="#C46E2E" />
            </linearGradient>
            <linearGradient id="catWhitePatch" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#F4EDE4" />
            </linearGradient>
            <linearGradient id="catCalicoPatch" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4A3F35" />
              <stop offset="100%" stopColor="#302822" />
            </linearGradient>
          </defs>

          {isSleeping ? (
            // 😴 SLEEPING CURLED CAT
            <g className="transition-all duration-300">
              {/* Curled Body */}
              <ellipse cx="50" cy="58" rx="34" ry="24" fill="url(#catFur)" />
              {/* Calico back spots */}
              <path d="M 38,44 Q 52,38 60,46 Q 52,54 38,44 Z" fill="url(#catCalicoPatch)" opacity="0.85" />
              <ellipse cx="64" cy="62" rx="12" ry="10" fill="url(#catWhitePatch)" />

              {/* Wrapped Tail */}
              <path d="M 22,66 Q 16,50 28,42 Q 22,54 28,68 Z" fill="url(#catFur)" />

              {/* Tucked Head */}
              <circle cx="70" cy="54" r="15" fill="url(#catFur)" />
              {/* Ears folded */}
              <polygon points="62,44 68,36 74,44" fill="#E28743" />
              <polygon points="64,43 68,39 72,43" fill="#F8B4B8" />
              <polygon points="76,46 84,40 86,48" fill="#E28743" />
              <polygon points="78,46 83,42 84,48" fill="#F8B4B8" />

              {/* Sleeping happy eye slits */}
              <path d="M 68,54 Q 72,58 76,54" stroke="#4A3F35" strokeWidth="1.8" fill="none" strokeLinecap="round" />
              <circle cx="78" cy="56" r="1.5" fill="#F88379" />

              {/* Cute Zzz */}
              <text x="82" y="36" fill="#818CF8" fontSize="11" fontWeight="bold" className="animate-pulse">Z</text>
              <text x="88" y="28" fill="#818CF8" fontSize="9" fontWeight="bold" className="animate-pulse">z</text>
            </g>
          ) : isStretching ? (
            // 🧘 STRETCHING CAT
            <g className="transition-all duration-300">
              {/* Lowered front chest & arched rear */}
              <path d="M 24,46 Q 40,36 56,54 L 78,68 L 78,74 L 32,74 Z" fill="url(#catFur)" />
              <circle cx="28" cy="46" r="12" fill="#E28743" />
              {/* Calico Spot */}
              <circle cx="44" cy="48" r="8" fill="url(#catCalicoPatch)" opacity="0.8" />
              {/* Front Paws stretched far */}
              <rect x="76" y="70" width="14" height="6" rx="3" fill="url(#catWhitePatch)" />
              <rect x="66" y="70" width="14" height="6" rx="3" fill="url(#catWhitePatch)" />
              {/* Back Legs */}
              <rect x="22" y="60" width="8" height="16" rx="4" fill="#C46E2E" />
              {/* Upright stretched tail */}
              <path d="M 22,48 Q 12,32 18,20 Q 22,24 24,46 Z" fill="url(#catFur)" />
              {/* Head resting low */}
              <circle cx="68" cy="62" r="11" fill="url(#catFur)" />
              <polygon points="62,56 65,48 70,55" fill="#E28743" />
              <polygon points="72,56 77,50 80,58" fill="#E28743" />
              <ellipse cx="76" cy="64" rx="2" ry="1.5" fill="#332B25" />
            </g>
          ) : isGrooming ? (
            // 🐾 GROOMING CAT
            <g className="transition-all duration-300">
              {/* Sitting body */}
              <ellipse cx="48" cy="60" rx="20" ry="18" fill="url(#catFur)" />
              <ellipse cx="48" cy="64" rx="12" ry="12" fill="url(#catWhitePatch)" />
              {/* Head tilted */}
              <circle cx="48" cy="40" r="14" fill="url(#catFur)" />
              {/* Ears */}
              <polygon points="38,34 42,22 49,32" fill="#E28743" />
              <polygon points="40,32 43,26 47,32" fill="#F8B4B8" />
              <polygon points="53,32 60,24 62,36" fill="#E28743" />
              <polygon points="55,33 59,27 61,35" fill="#F8B4B8" />
              {/* Raised paw licking face */}
              <path d="M 52,56 Q 64,52 58,42 Q 54,42 50,50 Z" fill="url(#catWhitePatch)" />
              <circle cx="58" cy="42" r="3.5" fill="#FFFFFF" stroke="#E28743" strokeWidth="1" />
              {/* Closed content eyes */}
              <path d="M 44,40 Q 47,43 50,40" stroke="#332B25" strokeWidth="1.5" fill="none" />
              {/* Tail resting */}
              <path d="M 28,68 Q 20,66 22,54 Q 26,60 32,66 Z" fill="url(#catFur)" />
            </g>
          ) : (
            // 🐱 SITTING / IDLE CAT (With breathing & tail animation)
            <g className="transition-all duration-300">
              {/* Tail with gentle wave */}
              <path
                d="M 28,68 Q 14,56 16,36 Q 22,44 26,62 Z"
                fill="url(#catFur)"
                className="origin-bottom animate-[wiggle_4s_ease-in-out_infinite]"
              />

              {/* Rear Thighs */}
              <ellipse cx="36" cy="66" rx="14" ry="11" fill="#C46E2E" />
              <ellipse cx="64" cy="66" rx="14" ry="11" fill="#C46E2E" />

              {/* Main Body */}
              <path d="M 34,44 Q 50,38 66,44 Q 72,66 64,74 L 36,74 Q 28,66 34,44 Z" fill="url(#catFur)" />

              {/* Calico Back patch */}
              <path d="M 36,46 Q 44,40 50,48 Q 42,54 36,46 Z" fill="url(#catCalicoPatch)" opacity="0.9" />

              {/* Fluffy White Chest & Bib */}
              <ellipse cx="50" cy="58" rx="11" ry="15" fill="url(#catWhitePatch)" />

              {/* Front Paws */}
              <rect x="40" y="66" width="8" height="12" rx="4" fill="url(#catWhitePatch)" />
              <rect x="52" y="66" width="8" height="12" rx="4" fill="url(#catWhitePatch)" />

              {/* Head */}
              <circle cx="50" cy="34" r="16" fill="url(#catFur)" />

              {/* Calico Eye Patch */}
              <path d="M 38,24 Q 46,24 46,34 Q 38,40 36,32 Z" fill="url(#catCalicoPatch)" opacity="0.85" />

              {/* Ears */}
              <polygon points="36,26 40,12 48,22" fill="#E28743" />
              <polygon points="38,24 41,16 46,22" fill="#F8B4B8" />
              <polygon points="56,22 64,14 66,28" fill="#E28743" />
              <polygon points="58,23 63,18 64,27" fill="#F8B4B8" />

              {/* Whiskers */}
              <line x1="32" y1="36" x2="22" y2="34" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.8" />
              <line x1="32" y1="39" x2="20" y2="40" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.8" />
              <line x1="68" y1="36" x2="78" y2="34" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.8" />
              <line x1="68" y1="39" x2="80" y2="40" stroke="#FFFFFF" strokeWidth="1.2" strokeOpacity="0.8" />

              {/* Bright expressive eyes */}
              {isPetted ? (
                // Happy purring crescent eyes
                <>
                  <path d="M 40,32 Q 44,28 47,32" stroke="#2B2118" strokeWidth="2" fill="none" strokeLinecap="round" />
                  <path d="M 53,32 Q 56,28 60,32" stroke="#2B2118" strokeWidth="2" fill="none" strokeLinecap="round" />
                </>
              ) : (
                <>
                  <ellipse cx="43" cy="32" rx="3.2" ry="4" fill="#3D8B57" />
                  <ellipse cx="43" cy="32" rx="1.5" ry="3.5" fill="#1C3823" />
                  <circle cx="44" cy="30.5" r="1" fill="#FFFFFF" />

                  <ellipse cx="57" cy="32" rx="3.2" ry="4" fill="#3D8B57" />
                  <ellipse cx="57" cy="32" rx="1.5" ry="3.5" fill="#1C3823" />
                  <circle cx="58" cy="30.5" r="1" fill="#FFFFFF" />
                </>
              )}

              {/* Pink Nose & Cute Mouth */}
              <polygon points="48.5,37 51.5,37 50,39" fill="#F472B6" />
              <path d="M 47,40 Q 50,42 53,40" stroke="#2B2118" strokeWidth="1.2" fill="none" strokeLinecap="round" />
            </g>
          )}
        </svg>
      </div>
    );
  }

  // =========================================================================
  // 🐶 2. SPARKY THE GOLDEN SPELLING PUPPY
  // =========================================================================
  if (isDog) {
    const isSleeping = state === 'sleep';
    const isPlaying = state === 'play';
    const isSitting = state === 'sit';
    const isPetted = state === 'pet';

    return (
      <div className={`relative ${sizeStyles} ${className} flex items-center justify-center select-none`}>
        {/* Tennis ball when playing */}
        {isPlaying && (
          <div className="absolute bottom-1 right-2 w-5 h-5 rounded-full bg-lime-400 border border-lime-600 shadow-xs z-20 animate-bounce">
            <div className="w-full h-0.5 bg-white mt-2 opacity-80" />
          </div>
        )}

        {isPetted && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none z-20 animate-bounce">
            <span className="text-sm">⭐</span>
            <span className="text-xs">🐾</span>
          </div>
        )}

        {/* Soft shadow */}
        <div className="absolute bottom-1 w-3/4 h-2.5 bg-stone-900/15 rounded-full blur-2xs" />

        <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 drop-shadow-xs">
          <defs>
            <linearGradient id="dogFur" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FAD02C" />
              <stop offset="50%" stopColor="#E9B71F" />
              <stop offset="100%" stopColor="#C99411" />
            </linearGradient>
            <linearGradient id="dogMuzzle" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFF4D0" />
              <stop offset="100%" stopColor="#F5E4B0" />
            </linearGradient>
          </defs>

          {isSleeping ? (
            // 😴 SLEEPING PUP
            <g className="transition-all duration-300">
              <ellipse cx="50" cy="62" rx="34" ry="20" fill="url(#dogFur)" />
              {/* Tucked tail */}
              <ellipse cx="20" cy="64" rx="8" ry="4" fill="#C99411" />
              {/* Head resting on front paws */}
              <circle cx="70" cy="58" r="16" fill="url(#dogFur)" />
              {/* Floppy Ear over cheek */}
              <path d="M 62,48 Q 54,64 64,70 Q 70,64 68,50 Z" fill="#C99411" />
              {/* Sleeping eye */}
              <path d="M 74,56 Q 78,60 82,56" stroke="#4A3F35" strokeWidth="2" fill="none" strokeLinecap="round" />
              {/* Black button nose */}
              <ellipse cx="84" cy="60" rx="3" ry="2.5" fill="#261E17" />
              {/* Red Collar */}
              <rect x="58" y="58" width="5" height="12" rx="2" fill="#E11D48" />
              {/* Paws */}
              <ellipse cx="76" cy="74" rx="6" ry="3" fill="url(#dogMuzzle)" />
              <text x="84" y="42" fill="#818CF8" fontSize="10" fontWeight="bold" className="animate-pulse">Zzz</text>
            </g>
          ) : (
            // 🐶 ACTIVE / SITTING PUP (Wagging tail)
            <g className="transition-all duration-300">
              {/* Energetic Tail with wagging animation */}
              <path
                d="M 28,64 Q 12,50 18,36 Q 24,42 28,58 Z"
                fill="url(#dogFur)"
                className="origin-bottom animate-[bounce_1.5s_infinite]"
              />

              {/* Back Haunches */}
              <ellipse cx="36" cy="66" rx="14" ry="12" fill="#D4A015" />
              <ellipse cx="64" cy="66" rx="14" ry="12" fill="#D4A015" />

              {/* Main Torso */}
              <path d="M 36,44 Q 50,38 64,44 Q 72,66 64,74 L 36,74 Q 28,66 36,44 Z" fill="url(#dogFur)" />

              {/* Cream Chest */}
              <ellipse cx="50" cy="58" rx="10" ry="14" fill="url(#dogMuzzle)" />

              {/* Front Paws with paw pads */}
              <rect x="40" y="66" width="9" height="13" rx="4" fill="url(#dogMuzzle)" />
              <rect x="51" y="66" width="9" height="13" rx="4" fill="url(#dogMuzzle)" />

              {/* Red Collar with Golden Bell/Tag */}
              <rect x="40" y="46" width="20" height="5" rx="2.5" fill="#E11D48" />
              <circle cx="50" cy="52" r="3.5" fill="#FBBF24" stroke="#B45309" strokeWidth="1" />

              {/* Head */}
              <circle cx="50" cy="32" r="17" fill="url(#dogFur)" />

              {/* Velvety Floppy Ears */}
              <path d="M 38,24 Q 24,36 30,50 Q 38,50 42,34 Z" fill="#C99411" />
              <path d="M 62,24 Q 76,36 70,50 Q 62,50 58,34 Z" fill="#C99411" />

              {/* Snout / Muzzle */}
              <ellipse cx="50" cy="38" rx="8" ry="6" fill="url(#dogMuzzle)" />
              <ellipse cx="50" cy="35" rx="3.5" ry="2.5" fill="#241B13" />

              {/* Cheerful Tongue sticking out */}
              <path d="M 49,41 Q 50,46 52,46 Q 54,46 53,41 Z" fill="#F43F5E" />

              {/* Warm, loyal puppy eyes */}
              <ellipse cx="44" cy="29" rx="3" ry="3.5" fill="#3D2914" />
              <circle cx="45" cy="27.5" r="1" fill="#FFFFFF" />

              <ellipse cx="56" cy="29" rx="3" ry="3.5" fill="#3D2914" />
              <circle cx="57" cy="27.5" r="1" fill="#FFFFFF" />
            </g>
          )}
        </svg>
      </div>
    );
  }

  // =========================================================================
  // 🐰 3. PIPPIN THE LOP-EARED STUDY BUNNY
  // =========================================================================
  if (isRabbit) {
    const isFeeding = state === 'feed';
    const isHopping = state === 'hop';
    const isPetted = state === 'pet';

    return (
      <div className={`relative ${sizeStyles} ${className} flex items-center justify-center select-none`}>
        {/* Carrot when feeding */}
        {isFeeding && (
          <div className="absolute top-2 right-1 z-20 animate-bounce">
            <span className="text-sm">🥕</span>
          </div>
        )}

        {isPetted && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none z-20 animate-bounce">
            <span className="text-sm">🌸</span>
          </div>
        )}

        {/* Soft shadow */}
        <div className={`absolute bottom-1 w-3/4 h-2 bg-stone-900/15 rounded-full blur-2xs ${isHopping ? 'scale-75 opacity-40' : ''}`} />

        <svg viewBox="0 0 100 100" className={`w-full h-full relative z-10 drop-shadow-xs ${isHopping ? '-translate-y-3 transition-transform duration-300' : ''}`}>
          <defs>
            <linearGradient id="bunnyFur" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="60%" stopColor="#F9F6F0" />
              <stop offset="100%" stopColor="#EFE8DE" />
            </linearGradient>
            <linearGradient id="bunnyEarInner" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FDE2E4" />
              <stop offset="100%" stopColor="#F9BEC7" />
            </linearGradient>
          </defs>

          {/* Fluffy Round Cotton Tail */}
          <circle cx="24" cy="62" r="7" fill="#FFFFFF" stroke="#E5DCCE" strokeWidth="1" />

          {/* Round Plump Body */}
          <ellipse cx="50" cy="62" rx="26" ry="20" fill="url(#bunnyFur)" stroke="#E5DCCE" strokeWidth="1" />

          {/* Tucked Back Foot */}
          <ellipse cx="36" cy="74" rx="10" ry="5" fill="#FFFFFF" stroke="#E5DCCE" strokeWidth="1" />
          <ellipse cx="64" cy="74" rx="10" ry="5" fill="#FFFFFF" stroke="#E5DCCE" strokeWidth="1" />

          {/* Head */}
          <circle cx="50" cy="38" r="16" fill="url(#bunnyFur)" stroke="#E5DCCE" strokeWidth="1" />

          {/* Soft Drooping Lop Ears */}
          <path d="M 38,30 Q 22,40 26,60 Q 34,60 38,40 Z" fill="url(#bunnyFur)" stroke="#E5DCCE" strokeWidth="1" />
          <path d="M 36,34 Q 26,42 29,56 Q 34,56 36,42 Z" fill="url(#bunnyEarInner)" />

          <path d="M 62,30 Q 78,40 74,60 Q 66,60 62,40 Z" fill="url(#bunnyFur)" stroke="#E5DCCE" strokeWidth="1" />
          <path d="M 64,34 Q 74,42 71,56 Q 66,56 64,42 Z" fill="url(#bunnyEarInner)" />

          {/* Plump Cheeks */}
          <circle cx="43" cy="42" r="5" fill="#FFFFFF" />
          <circle cx="57" cy="42" r="5" fill="#FFFFFF" />

          {/* Twitching Pink Nose */}
          <polygon points="48.5,41 51.5,41 50,43" fill="#F472B6" />

          {/* Big Gentle Dark Eyes with High-Catchlights */}
          <ellipse cx="42" cy="35" rx="3.5" ry="4" fill="#382E25" />
          <circle cx="43.5" cy="33.5" r="1.3" fill="#FFFFFF" />
          <circle cx="41" cy="36.5" r="0.7" fill="#FFFFFF" />

          <ellipse cx="58" cy="35" rx="3.5" ry="4" fill="#382E25" />
          <circle cx="59.5" cy="33.5" r="1.3" fill="#FFFFFF" />
          <circle cx="57" cy="36.5" r="0.7" fill="#FFFFFF" />

          {/* Tiny Front Paws */}
          <ellipse cx="46" cy="68" rx="4" ry="5" fill="#FFFFFF" />
          <ellipse cx="54" cy="68" rx="4" ry="5" fill="#FFFFFF" />
        </svg>
      </div>
    );
  }

  // =========================================================================
  // 🦉 4. BARNABY THE SCHOLAR OWL / COMPANION BIRD
  // =========================================================================
  if (isBird) {
    const isTalking = state === 'talk';
    const isFlying = state === 'fly';

    return (
      <div className={`relative ${sizeStyles} ${className} flex items-center justify-center select-none`}>
        {/* Musical notes if talking */}
        {isTalking && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex gap-1 pointer-events-none z-20 animate-bounce">
            <span className="text-xs">🎵</span>
            <span className="text-sm">🎶</span>
          </div>
        )}

        <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 drop-shadow-xs">
          <defs>
            <linearGradient id="owlFeathers" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8C6239" />
              <stop offset="100%" stopColor="#5E3F1F" />
            </linearGradient>
            <linearGradient id="owlChest" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#FFF3E0" />
              <stop offset="100%" stopColor="#FFE0B2" />
            </linearGradient>
          </defs>

          {/* Wooden Book Perch */}
          <rect x="22" y="78" width="56" height="8" rx="2" fill="#4E342E" stroke="#3E2723" strokeWidth="1" />
          <rect x="26" y="86" width="48" height="4" rx="1" fill="#D7CCC8" />

          {/* Owl Talons / Feet Gripping Perch */}
          <ellipse cx="44" cy="78" rx="4" ry="3" fill="#FFB300" />
          <ellipse cx="56" cy="78" rx="4" ry="3" fill="#FFB300" />

          {/* Body */}
          <ellipse cx="50" cy="56" rx="22" ry="24" fill="url(#owlFeathers)" />

          {/* Feathered Speckled Chest */}
          <ellipse cx="50" cy="58" rx="14" ry="18" fill="url(#owlChest)" />
          {/* Subtle chest feather chevron marks */}
          <path d="M 46,50 L 50,54 L 54,50" stroke="#8D6E63" strokeWidth="1.2" fill="none" />
          <path d="M 44,58 L 50,62 L 56,58" stroke="#8D6E63" strokeWidth="1.2" fill="none" />
          <path d="M 46,66 L 50,70 L 54,66" stroke="#8D6E63" strokeWidth="1.2" fill="none" />

          {/* Folded Wings or Fluttering Wings */}
          {isFlying ? (
            <>
              <path d="M 30,50 Q 8,34 16,56 Q 26,64 32,58 Z" fill="#795548" />
              <path d="M 70,50 Q 92,34 84,56 Q 74,64 68,58 Z" fill="#795548" />
            </>
          ) : (
            <>
              <path d="M 30,46 Q 24,56 28,68 Q 36,66 34,50 Z" fill="#6D4C41" />
              <path d="M 70,46 Q 76,56 72,68 Q 64,66 66,50 Z" fill="#6D4C41" />
            </>
          )}

          {/* Ear Tufts */}
          <polygon points="34,30 30,16 42,26" fill="#5E3F1F" />
          <polygon points="66,30 70,16 58,26" fill="#5E3F1F" />

          {/* Head */}
          <circle cx="50" cy="36" r="18" fill="url(#owlFeathers)" />

          {/* Facial Discs */}
          <circle cx="42" cy="36" r="9" fill="#FFF8E1" />
          <circle cx="58" cy="36" r="9" fill="#FFF8E1" />

          {/* Scholarly Golden Spectacles */}
          <circle cx="42" cy="36" r="8" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
          <circle cx="58" cy="36" r="8" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
          <line x1="50" y1="36" x2="50" y2="36" stroke="#F59E0B" strokeWidth="2" />

          {/* Big Golden Amber Eyes */}
          <circle cx="42" cy="36" r="5" fill="#FFC107" />
          <circle cx="42" cy="36" r="3" fill="#212121" />
          <circle cx="43.5" cy="34.5" r="1" fill="#FFFFFF" />

          <circle cx="58" cy="36" r="5" fill="#FFC107" />
          <circle cx="58" cy="36" r="3" fill="#212121" />
          <circle cx="59.5" cy="34.5" r="1" fill="#FFFFFF" />

          {/* Curved Beak */}
          <path d="M 48,39 L 52,39 L 50,45 Z" fill="#FF9800" />
        </svg>
      </div>
    );
  }

  // =========================================================================
  // 🦊 5. PIP THE EXPLORER FOX (Fallback / Fox)
  // =========================================================================
  return (
    <div className={`relative ${sizeStyles} ${className} flex items-center justify-center select-none`}>
      <div className="absolute bottom-1 w-3/4 h-2 bg-stone-900/15 rounded-full blur-2xs" />
      <svg viewBox="0 0 100 100" className="w-full h-full relative z-10 drop-shadow-xs">
        <defs>
          <linearGradient id="foxFur" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#F97316" />
            <stop offset="100%" stopColor="#C2410C" />
          </linearGradient>
        </defs>

        {/* Bushy Tail with White Tip */}
        <path d="M 28,68 Q 10,50 16,30 Q 28,40 32,60 Z" fill="url(#foxFur)" />
        <path d="M 16,30 Q 14,40 22,38 Z" fill="#FFFFFF" />

        {/* Body */}
        <ellipse cx="50" cy="62" rx="20" ry="16" fill="url(#foxFur)" />
        <ellipse cx="50" cy="64" rx="10" ry="11" fill="#FFFFFF" />

        {/* Explorer Teal Bandanna */}
        <polygon points="40,48 60,48 50,56" fill="#0D9488" />

        {/* Head */}
        <polygon points="32,32 68,32 50,50" fill="url(#foxFur)" />
        <polygon points="40,42 60,42 50,50" fill="#FFFFFF" />

        {/* Alert Ears */}
        <polygon points="32,32 36,16 44,30" fill="#C2410C" />
        <polygon points="34,30 37,20 42,28" fill="#FEE2E2" />
        <polygon points="68,32 64,16 56,30" fill="#C2410C" />
        <polygon points="66,30 63,20 58,28" fill="#FEE2E2" />

        {/* Dark Paws */}
        <rect x="42" y="68" width="6" height="10" rx="3" fill="#292524" />
        <rect x="52" y="68" width="6" height="10" rx="3" fill="#292524" />

        {/* Eyes & Nose */}
        <circle cx="43" cy="35" r="2.5" fill="#292524" />
        <circle cx="57" cy="35" r="2.5" fill="#292524" />
        <circle cx="50" cy="49" r="2" fill="#1C1917" />
      </svg>
    </div>
  );
};
