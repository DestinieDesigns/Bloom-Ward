import React from 'react';
import { HomeItem } from '../../types';

interface MiniaturePlantRendererProps {
  item: HomeItem;
  size?: 'sm' | 'md' | 'lg' | 'preview';
  state?: string;
  className?: string;
}

/**
 * Detailed botanical miniature plant illustration renderer.
 * Features individual leaves, realistic stems, natural variegation,
 * hand-thrown ceramic and terracotta pots, and interactive growth/care effects.
 *
 * Replaces generic emoji plants with distinct, high-fidelity miniature game assets.
 */
export const MiniaturePlantRenderer: React.FC<MiniaturePlantRendererProps> = ({
  item,
  size = 'md',
  state = 'healthy',
  className = ''
}) => {
  const sizeStyles = {
    sm: 'w-12 h-12',
    md: 'w-20 h-20 sm:w-24 sm:h-24',
    lg: 'w-28 h-28 sm:w-32 sm:h-32',
    preview: 'w-36 h-36 sm:w-44 sm:h-44'
  }[size];

  const itemId = item.id.toLowerCase();
  const renderKey = (item.renderType || '').toLowerCase();
  const name = item.name.toLowerCase();

  const isWatered = state === 'watered';
  const isObserved = state === 'observed';

  // Determine specific plant species
  const isMonstera = itemId.includes('monstera') || renderKey.includes('monstera') || name.includes('monstera');
  const isSnakePlant = itemId.includes('snake') || renderKey.includes('snake') || name.includes('snake');
  const isPothos = itemId.includes('pothos') || renderKey.includes('pothos') || name.includes('pothos') || itemId.includes('ivy');
  const isPeaceLily = itemId.includes('peace') || itemId.includes('lily') || renderKey.includes('peace_lily') || name.includes('peace lily');
  const isSpiderPlant = itemId.includes('spider') || renderKey.includes('spider') || name.includes('spider');
  const isFern = itemId.includes('fern') || renderKey.includes('fern') || name.includes('fern');
  const isFlowering = itemId.includes('flower') || itemId.includes('curiosity-flower') || renderKey.includes('flowering') || name.includes('flowering') || name.includes('blossom');
  // Default is Succulent or general potted plant

  // Common interactive water droplets / sparkle wrapper
  const renderCareFeedback = () => (
    <>
      {isWatered && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 z-20 pointer-events-none animate-bounce">
          <span className="text-sm">💧</span>
          <span className="text-xs text-sky-500 font-bold drop-shadow-xs">Refreshed!</span>
        </div>
      )}
      {isObserved && (
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 flex items-center gap-1 z-20 pointer-events-none animate-bounce">
          <span className="text-sm">✨</span>
          <span className="text-xs text-emerald-600 font-bold drop-shadow-xs">Thriving!</span>
        </div>
      )}
    </>
  );

  // =========================================================================
  // 1. 🪴 MONSTERA DELICIOSA (Broad split leaves & seagrass basket)
  // =========================================================================
  if (isMonstera) {
    return (
      <div className={`relative ${sizeStyles} ${className} flex items-center justify-center select-none`}>
        {renderCareFeedback()}
        <svg viewBox="0 0 120 130" className="w-full h-full drop-shadow-md">
          <defs>
            <linearGradient id="monsteraLeaf1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3F7A44" />
              <stop offset="100%" stopColor="#255229" />
            </linearGradient>
            <linearGradient id="monsteraLeaf2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#55965B" />
              <stop offset="100%" stopColor="#2E6634" />
            </linearGradient>
            <linearGradient id="basketTexture" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#C99B6A" />
              <stop offset="50%" stopColor="#DEB485" />
              <stop offset="100%" stopColor="#B38555" />
            </linearGradient>
          </defs>

          {/* Cast Shadow */}
          <ellipse cx="60" cy="120" rx="34" ry="7" fill="#503728" opacity="0.16" />

          {/* Woven Seagrass Basket Pot */}
          <polygon points="38,82 82,82 76,118 44,118" fill="url(#basketTexture)" stroke="#9E7044" strokeWidth="1" />
          {/* Basket Weave Lines */}
          <line x1="40" y1="91" x2="80" y2="91" stroke="#8A5E35" strokeWidth="1.5" strokeDasharray="3 2" />
          <line x1="42" y1="100" x2="78" y2="100" stroke="#8A5E35" strokeWidth="1.5" strokeDasharray="3 2" />
          <line x1="43" y1="109" x2="77" y2="109" stroke="#8A5E35" strokeWidth="1.5" strokeDasharray="3 2" />

          {/* Soil */}
          <ellipse cx="60" cy="82" rx="22" ry="5" fill="#422D1D" />

          {/* Stems */}
          <path d="M 60,82 Q 52,58 38,40" stroke="#487A4D" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 60,82 Q 62,50 64,30" stroke="#487A4D" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 60,82 Q 74,58 88,44" stroke="#487A4D" strokeWidth="3" fill="none" strokeLinecap="round" />

          {/* Left Large Fenestrated Leaf */}
          <g transform="translate(18, 16)">
            <path
              d="M 28,40 C 6,30 2,10 24,4 C 42,2 48,22 28,40 Z"
              fill="url(#monsteraLeaf1)"
            />
            {/* Natural Cutouts (Fenestrations) */}
            <ellipse cx="18" cy="18" rx="2.5" ry="6" transform="rotate(-30 18 18)" fill="#FDFBF7" opacity="0.9" />
            <ellipse cx="26" cy="14" rx="2" ry="5" transform="rotate(-15 26 14)" fill="#FDFBF7" opacity="0.9" />
          </g>

          {/* Center Tall Glossy Leaf */}
          <g transform="translate(44, 4)">
            <path
              d="M 20,44 C 2,30 4,8 20,2 C 38,8 40,30 20,44 Z"
              fill="url(#monsteraLeaf2)"
            />
            <ellipse cx="13" cy="20" rx="2.5" ry="6" transform="rotate(-10 13 20)" fill="#FDFBF7" opacity="0.9" />
            <ellipse cx="27" cy="20" rx="2.5" ry="6" transform="rotate(10 27 20)" fill="#FDFBF7" opacity="0.9" />
          </g>

          {/* Right Wide Leaf */}
          <g transform="translate(68, 20)">
            <path
              d="M 12,38 C -4,22 4,4 22,2 C 40,10 36,30 12,38 Z"
              fill="url(#monsteraLeaf1)"
            />
            <ellipse cx="18" cy="18" rx="2.5" ry="6" transform="rotate(25 18 18)" fill="#FDFBF7" opacity="0.9" />
          </g>
        </svg>
      </div>
    );
  }

  // =========================================================================
  // 2. 🪴 SNAKE PLANT (Tall upright variegated sword leaves)
  // =========================================================================
  if (isSnakePlant) {
    return (
      <div className={`relative ${sizeStyles} ${className} flex items-center justify-center select-none`}>
        {renderCareFeedback()}
        <svg viewBox="0 0 120 130" className="w-full h-full drop-shadow-md">
          {/* Shadow */}
          <ellipse cx="60" cy="120" rx="26" ry="6" fill="#503728" opacity="0.16" />

          {/* White Ribbed Cylinder Ceramic Pot */}
          <rect x="42" y="80" width="36" height="38" rx="4" fill="#FDFBF7" stroke="#E2DDD5" strokeWidth="1.5" />
          <line x1="51" y1="84" x2="51" y2="114" stroke="#EDE8DF" strokeWidth="1.5" />
          <line x1="60" y1="84" x2="60" y2="114" stroke="#EDE8DF" strokeWidth="1.5" />
          <line x1="69" y1="84" x2="69" y2="114" stroke="#EDE8DF" strokeWidth="1.5" />
          {/* Pot Saucer */}
          <ellipse cx="60" cy="118" rx="18" ry="3" fill="#C49A76" />
          {/* Dark Soil */}
          <ellipse cx="60" cy="80" rx="17" ry="4" fill="#3D291A" />

          {/* Tall Upright Leaves with Yellow Variegated Borders */}
          {/* Back Tall Leaf */}
          <path d="M 60,80 Q 58,40 60,10 Q 64,40 60,80 Z" fill="#2E5A35" stroke="#EAB308" strokeWidth="2" />
          {/* Left Arched Sword Leaf */}
          <path d="M 52,80 Q 40,46 44,18 Q 50,46 54,80 Z" fill="#386B40" stroke="#EAB308" strokeWidth="1.8" />
          {/* Right Arched Sword Leaf */}
          <path d="M 66,80 Q 78,48 74,22 Q 70,48 64,80 Z" fill="#386B40" stroke="#EAB308" strokeWidth="1.8" />
          {/* Front Shorter Leaf */}
          <path d="M 58,80 Q 50,54 56,36 Q 64,54 60,80 Z" fill="#4B8554" stroke="#FACC15" strokeWidth="1.5" />
        </svg>
      </div>
    );
  }

  // =========================================================================
  // 3. 🪴 POTHOS / MARBLE QUEEN (Cascading trailing heart-shaped leaves)
  // =========================================================================
  if (isPothos) {
    return (
      <div className={`relative ${sizeStyles} ${className} flex items-center justify-center select-none`}>
        {renderCareFeedback()}
        <svg viewBox="0 0 120 130" className="w-full h-full drop-shadow-md">
          {/* Shadow */}
          <ellipse cx="60" cy="118" rx="28" ry="6" fill="#503728" opacity="0.16" />

          {/* Terracotta Pot */}
          <polygon points="40,70 80,70 74,104 46,104" fill="#D9774E" stroke="#B85D36" strokeWidth="1.5" />
          <rect x="38" y="66" width="44" height="6" rx="2" fill="#E6855C" stroke="#B85D36" strokeWidth="1" />
          <ellipse cx="60" cy="70" rx="19" ry="4" fill="#40281A" />

          {/* Trailing Stems cascading down past pot */}
          <path d="M 46,70 Q 30,82 34,112" stroke="#5D8C57" strokeWidth="2" fill="none" strokeLinecap="round" />
          <path d="M 72,70 Q 86,84 80,116" stroke="#5D8C57" strokeWidth="2" fill="none" strokeLinecap="round" />

          {/* Heart Leaves on Crown */}
          <g transform="translate(48, 46)">
            <path d="M 12,18 C 0,10 6,0 12,6 C 18,0 24,10 12,18 Z" fill="#65A30D" />
            <path d="M 12,8 Q 10,12 11,15" stroke="#BEF264" strokeWidth="1.2" fill="none" />
          </g>
          <g transform="translate(34, 52)">
            <path d="M 10,16 C 0,8 4,0 10,5 C 16,0 20,8 10,16 Z" fill="#4D7C0F" />
          </g>
          <g transform="translate(64, 52)">
            <path d="M 10,16 C 0,8 4,0 10,5 C 16,0 20,8 10,16 Z" fill="#65A30D" />
          </g>

          {/* Cascading Heart Leaves (Trailing) */}
          <g transform="translate(24, 82)">
            <path d="M 8,14 C 0,8 4,0 8,4 C 12,0 16,8 8,14 Z" fill="#84CC16" />
          </g>
          <g transform="translate(26, 102)">
            <path d="M 7,12 C 0,6 3,0 7,3 C 11,0 14,6 7,12 Z" fill="#65A30D" />
          </g>
          <g transform="translate(74, 86)">
            <path d="M 8,14 C 0,8 4,0 8,4 C 12,0 16,8 8,14 Z" fill="#65A30D" />
          </g>
          <g transform="translate(72, 106)">
            <path d="M 7,12 C 0,6 3,0 7,3 C 11,0 14,6 7,12 Z" fill="#84CC16" />
          </g>
        </svg>
      </div>
    );
  }

  // =========================================================================
  // 4. 🪴 PEACE LILY (Broad ribbed green leaves with white spathe bloom)
  // =========================================================================
  if (isPeaceLily) {
    return (
      <div className={`relative ${sizeStyles} ${className} flex items-center justify-center select-none`}>
        {renderCareFeedback()}
        <svg viewBox="0 0 120 130" className="w-full h-full drop-shadow-md">
          {/* Shadow */}
          <ellipse cx="60" cy="118" rx="28" ry="6" fill="#503728" opacity="0.16" />

          {/* Fluted Ceramic Pot */}
          <polygon points="42,76 78,76 73,114 47,114" fill="#FAF6EE" stroke="#DDD5C7" strokeWidth="1.5" />
          <ellipse cx="60" cy="76" rx="18" ry="4" fill="#3D291A" />

          {/* Broad Ribbed Arching Leaves */}
          <path d="M 60,76 Q 36,60 26,44 Q 42,50 56,76 Z" fill="#1C4B27" />
          <path d="M 60,76 Q 84,60 94,44 Q 78,50 64,76 Z" fill="#1C4B27" />
          <path d="M 58,76 Q 44,48 40,32 Q 54,44 58,76 Z" fill="#2A6B39" />
          <path d="M 62,76 Q 76,48 80,32 Q 66,44 62,76 Z" fill="#2A6B39" />

          {/* Delicate White Spathe Flower Bloom */}
          <path d="M 60,76 Q 60,40 60,18" stroke="#3F7A4D" strokeWidth="2.5" fill="none" />
          <path d="M 60,14 C 50,22 52,38 60,40 C 68,38 70,22 60,14 Z" fill="#FFFFFF" stroke="#E6E0D4" strokeWidth="1" />
          {/* Spadix (Golden Center) */}
          <line x1="60" y1="22" x2="60" y2="34" stroke="#FACC15" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  // =========================================================================
  // 5. 🪴 SPIDER PLANT (Slender striped leaves & hanging plantlets)
  // =========================================================================
  if (isSpiderPlant) {
    return (
      <div className={`relative ${sizeStyles} ${className} flex items-center justify-center select-none`}>
        {renderCareFeedback()}
        <svg viewBox="0 0 120 130" className="w-full h-full drop-shadow-md">
          {/* Shadow */}
          <ellipse cx="60" cy="118" rx="28" ry="6" fill="#503728" opacity="0.16" />

          {/* Modern Pastel Green Pot */}
          <polygon points="42,76 78,76 73,114 47,114" fill="#E2E8F0" stroke="#CBD5E1" strokeWidth="1.5" />
          <ellipse cx="60" cy="76" rx="18" ry="4" fill="#3D291A" />

          {/* Arching striped leaves */}
          <path d="M 60,76 Q 30,50 18,68" stroke="#15803D" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M 60,76 Q 30,50 18,68" stroke="#DCFCE7" strokeWidth="1.2" fill="none" strokeLinecap="round" />

          <path d="M 60,76 Q 90,50 102,68" stroke="#15803D" strokeWidth="3.5" fill="none" strokeLinecap="round" />
          <path d="M 60,76 Q 90,50 102,68" stroke="#DCFCE7" strokeWidth="1.2" fill="none" strokeLinecap="round" />

          <path d="M 60,76 Q 44,30 36,44" stroke="#16A34A" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 60,76 Q 44,30 36,44" stroke="#DCFCE7" strokeWidth="1" fill="none" strokeLinecap="round" />

          <path d="M 60,76 Q 76,30 84,44" stroke="#16A34A" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 60,76 Q 76,30 84,44" stroke="#DCFCE7" strokeWidth="1" fill="none" strokeLinecap="round" />

          {/* Upright Center Fronds */}
          <path d="M 60,76 Q 58,34 60,20" stroke="#15803D" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 60,76 Q 58,34 60,20" stroke="#DCFCE7" strokeWidth="1" fill="none" strokeLinecap="round" />

          {/* Dangling Baby Spiderette Stolon */}
          <path d="M 60,76 Q 88,80 94,98" stroke="#86EFAC" strokeWidth="1.5" fill="none" />
          {/* Mini baby plant on tip */}
          <circle cx="94" cy="98" r="4" fill="#22C55E" />
          <circle cx="96" cy="96" r="3" fill="#4ADE80" />
        </svg>
      </div>
    );
  }

  // =========================================================================
  // 6. 🌿 BOSTON FERN (Feathery layered fronds)
  // =========================================================================
  if (isFern) {
    return (
      <div className={`relative ${sizeStyles} ${className} flex items-center justify-center select-none`}>
        {renderCareFeedback()}
        <svg viewBox="0 0 120 130" className="w-full h-full drop-shadow-md">
          {/* Shadow */}
          <ellipse cx="60" cy="118" rx="28" ry="6" fill="#503728" opacity="0.16" />

          {/* Terracotta Footed Pot */}
          <polygon points="44,78 76,78 71,114 49,114" fill="#C2714F" stroke="#9C5233" strokeWidth="1.5" />
          <ellipse cx="60" cy="78" rx="16" ry="4" fill="#3D291A" />

          {/* Layered Feathery Fronds */}
          <path d="M 60,78 Q 30,60 14,48 Q 28,68 56,78 Z" fill="#365E32" />
          <path d="M 60,78 Q 90,60 106,48 Q 92,68 64,78 Z" fill="#365E32" />
          <path d="M 60,78 Q 44,48 28,30 Q 48,54 58,78 Z" fill="#5A8254" />
          <path d="M 60,78 Q 76,48 92,30 Q 72,54 62,78 Z" fill="#5A8254" />
          <path d="M 60,78 Q 60,38 60,18 Q 66,48 62,78 Z" fill="#81A263" />
        </svg>
      </div>
    );
  }

  // =========================================================================
  // 7. 🌸 SMALL FLOWERING PLANT / AFRICAN VIOLET
  // =========================================================================
  if (isFlowering) {
    return (
      <div className={`relative ${sizeStyles} ${className} flex items-center justify-center select-none`}>
        {renderCareFeedback()}
        <svg viewBox="0 0 120 130" className="w-full h-full drop-shadow-md">
          {/* Shadow */}
          <ellipse cx="60" cy="118" rx="26" ry="6" fill="#503728" opacity="0.16" />

          {/* Pastel Glazed Pot */}
          <polygon points="42,78 78,78 72,114 48,114" fill="#FEF08A" stroke="#FACC15" strokeWidth="1.5" />
          <ellipse cx="60" cy="78" rx="18" ry="4" fill="#3D291A" />

          {/* Velvety Round Scalloped Leaves */}
          <circle cx="44" cy="70" r="14" fill="#2E5A35" />
          <circle cx="76" cy="70" r="14" fill="#2E5A35" />
          <circle cx="60" cy="62" r="14" fill="#3F7A44" />

          {/* Vivid 5-petal Violet Blossoms */}
          {/* Flower 1 */}
          <g transform="translate(48, 40)">
            <circle cx="4" cy="0" r="5" fill="#C084FC" />
            <circle cx="10" cy="4" r="5" fill="#A855F7" />
            <circle cx="8" cy="10" r="5" fill="#9333EA" />
            <circle cx="0" cy="10" r="5" fill="#A855F7" />
            <circle cx="-2" cy="4" r="5" fill="#C084FC" />
            <circle cx="4" cy="5" r="2.5" fill="#FACC15" />
          </g>

          {/* Flower 2 */}
          <g transform="translate(66, 44)">
            <circle cx="4" cy="0" r="5" fill="#F472B6" />
            <circle cx="10" cy="4" r="5" fill="#EC4899" />
            <circle cx="8" cy="10" r="5" fill="#DB2777" />
            <circle cx="0" cy="10" r="5" fill="#EC4899" />
            <circle cx="-2" cy="4" r="5" fill="#F472B6" />
            <circle cx="4" cy="5" r="2.5" fill="#FDE047" />
          </g>
        </svg>
      </div>
    );
  }

  // =========================================================================
  // 8. 🪴 SUCCULENT / ECHEVERIA (Plump sage rosette in stoneware dish)
  // =========================================================================
  return (
    <div className={`relative ${sizeStyles} ${className} flex items-center justify-center select-none`}>
      {renderCareFeedback()}
      <svg viewBox="0 0 120 130" className="w-full h-full drop-shadow-md">
        {/* Cast Shadow */}
        <ellipse cx="60" cy="118" rx="30" ry="7" fill="#503728" opacity="0.16" />

        {/* Speckled Stoneware Low Bowl */}
        <path d="M 34,80 Q 30,112 60,114 Q 90,112 86,80 Z" fill="#F5EFE6" stroke="#D7CCC8" strokeWidth="1.5" />
        <ellipse cx="60" cy="80" rx="26" ry="7" fill="#5D4037" />

        {/* Echeveria Plump Fleshy Leaves with Pink Blush Tips */}
        {/* Layer 1: Outer Rosette Leaves */}
        <g transform="translate(60, 72)">
          {[-70, -45, -20, 0, 20, 45, 70].map((angle, idx) => (
            <ellipse
              key={idx}
              cx="0"
              cy="-16"
              rx="7"
              ry="14"
              transform={`rotate(${angle} 0 0)`}
              fill="#7A9A85"
              stroke="#E8A598"
              strokeWidth="1"
            />
          ))}
        </g>

        {/* Layer 2: Inner Heart Rosette */}
        <g transform="translate(60, 72)">
          {[-50, -25, 0, 25, 50].map((angle, idx) => (
            <ellipse
              key={idx}
              cx="0"
              cy="-10"
              rx="5"
              ry="10"
              transform={`rotate(${angle} 0 0)`}
              fill="#98B8A2"
              stroke="#F2C2B8"
              strokeWidth="0.8"
            />
          ))}
          <circle cx="0" cy="-4" r="4" fill="#B3D1BD" />
        </g>
      </svg>
    </div>
  );
};
