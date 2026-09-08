import React from 'react';
import { FlowerSpecies } from '../../types';

interface GardenPlantAssetProps {
  stage: 'seed' | 'sprout' | 'blossom' | 'permanent_flower';
  species?: FlowerSpecies;
  color?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  animate?: boolean;
}

export const GardenPlantAsset: React.FC<GardenPlantAssetProps> = ({
  stage,
  species = 'wildflower',
  color = '#ec4899',
  size = 'md',
  className = '',
  animate = true
}) => {
  // Size mapping
  const sizeDims = {
    sm: { width: 48, height: 48, viewBox: '0 0 100 100' },
    md: { width: 80, height: 80, viewBox: '0 0 100 100' },
    lg: { width: 120, height: 120, viewBox: '0 0 100 100' },
    xl: { width: 160, height: 160, viewBox: '0 0 100 100' }
  }[size];

  // Derive harmonious color palette
  const primaryColor = color;
  const secondaryColor = `${color}dd`;
  const accentColor = `${color}99`;

  // Render Seed Asset
  if (stage === 'seed') {
    return (
      <svg
        width={sizeDims.width}
        height={sizeDims.height}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`select-none ${animate ? 'hover:scale-110 transition-transform duration-300' : ''} ${className}`}
      >
        <defs>
          <radialGradient id={`seed-soil-${color}`} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#78350f" stopOpacity="0.8" />
            <stop offset="70%" stopColor="#451a03" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#290e02" stopOpacity="0.95" />
          </radialGradient>
          <linearGradient id={`seed-grad-${color}`} x1="30%" y1="20%" x2="70%" y2="80%">
            <stop offset="0%" stopColor="#fde68a" />
            <stop offset="40%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>
          <filter id="seed-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Soil Mound Base */}
        <ellipse cx="50" cy="78" rx="36" ry="12" fill={`url(#seed-soil-${color})`} />
        <ellipse cx="50" cy="76" rx="30" ry="8" fill="#92400e" opacity="0.4" />

        {/* Small soil pebbles */}
        <circle cx="30" cy="80" r="2.5" fill="#451a03" />
        <circle cx="68" cy="81" r="2" fill="#451a03" />
        <circle cx="42" cy="83" r="1.5" fill="#78350f" />

        {/* Subterranean delicate rootlet */}
        <path
          d="M50 72 Q52 82 48 88 Q45 92 42 95"
          stroke="#fef3c7"
          strokeWidth="1.8"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M50 78 Q55 84 58 87"
          stroke="#fef3c7"
          strokeWidth="1.2"
          strokeLinecap="round"
          opacity="0.65"
        />

        {/* Golden Seed Body */}
        <g filter="url(#seed-glow)">
          <path
            d="M50 44 C42 48 38 60 45 70 C48 74 52 74 55 70 C62 60 58 48 50 44 Z"
            fill={`url(#seed-grad-${color})`}
            stroke="#78350f"
            strokeWidth="1.2"
          />
          {/* Seed striation highlights */}
          <path
            d="M48 50 C45 56 46 64 49 68"
            stroke="#fef3c7"
            strokeWidth="1.2"
            strokeLinecap="round"
            opacity="0.8"
          />
          {/* Spark of vitality */}
          <circle cx="51" cy="52" r="1.5" fill="#ffffff" opacity="0.9" />
        </g>

        {/* Tiny green awakening sprout tip */}
        <path
          d="M50 44 Q50 36 53 32"
          stroke="#84cc16"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <circle cx="53" cy="32" r="1.8" fill="#a3e635" />
      </svg>
    );
  }

  // Render Young Sprout / Plant Asset
  if (stage === 'sprout') {
    return (
      <svg
        width={sizeDims.width}
        height={sizeDims.height}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`select-none ${animate ? 'hover:scale-110 transition-transform duration-300' : ''} ${className}`}
      >
        <defs>
          <linearGradient id={`sprout-stem-${color}`} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#4d7c0f" />
            <stop offset="50%" stopColor="#65a30d" />
            <stop offset="100%" stopColor="#84cc16" />
          </linearGradient>
          <linearGradient id={`sprout-leaf-l-${color}`} x1="0%" y1="50%" x2="100%" y2="50%">
            <stop offset="0%" stopColor="#a3e635" />
            <stop offset="100%" stopColor="#4d7c0f" />
          </linearGradient>
          <linearGradient id={`sprout-leaf-r-${color}`} x1="100%" y1="50%" x2="0%" y2="50%">
            <stop offset="0%" stopColor="#bef264" />
            <stop offset="100%" stopColor="#65a30d" />
          </linearGradient>
        </defs>

        {/* Soil Base */}
        <ellipse cx="50" cy="84" rx="32" ry="9" fill="#582f0e" opacity="0.8" />
        <ellipse cx="50" cy="83" rx="26" ry="6" fill="#7f4f24" />

        {/* Slender Growing Stem */}
        <path
          d="M50 82 Q49 66 50 52 Q51 44 49 38"
          stroke={`url(#sprout-stem-${color})`}
          strokeWidth="4"
          strokeLinecap="round"
        />

        {/* Left Cotyledon Leaf */}
        <g transform="translate(48, 48)">
          <path
            d="M0 0 C-12 -6 -24 -2 -26 8 C-20 14 -8 10 0 0 Z"
            fill={`url(#sprout-leaf-l-${color})`}
            stroke="#365314"
            strokeWidth="0.8"
          />
          {/* Leaf vein */}
          <path d="M0 0 Q-14 2 -24 7" stroke="#d9f99d" strokeWidth="0.8" strokeLinecap="round" opacity="0.8" />
          {/* Morning dewdrop */}
          <circle cx="-20" cy="8" r="1.6" fill="#ffffff" opacity="0.9" />
        </g>

        {/* Right Cotyledon Leaf */}
        <g transform="translate(51, 44)">
          <path
            d="M0 0 C14 -8 26 -2 27 8 C20 14 8 8 0 0 Z"
            fill={`url(#sprout-leaf-r-${color})`}
            stroke="#365314"
            strokeWidth="0.8"
          />
          {/* Leaf vein */}
          <path d="M0 0 Q14 2 24 7" stroke="#ecfccb" strokeWidth="0.8" strokeLinecap="round" opacity="0.8" />
          {/* Morning dewdrop */}
          <circle cx="21" cy="7" r="1.4" fill="#ffffff" opacity="0.9" />
        </g>

        {/* Central young unfurling shoot */}
        <path
          d="M49 40 Q48 30 52 26 C53 29 52 35 50 40"
          fill="#bef264"
          stroke="#4d7c0f"
          strokeWidth="0.7"
        />
      </svg>
    );
  }

  // Render Budding Blossom Plant Asset
  if (stage === 'blossom') {
    return (
      <svg
        width={sizeDims.width}
        height={sizeDims.height}
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`select-none ${animate ? 'hover:scale-110 transition-transform duration-300' : ''} ${className}`}
      >
        <defs>
          <linearGradient id={`bud-stem-${color}`} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor="#3f6212" />
            <stop offset="100%" stopColor="#65a30d" />
          </linearGradient>
          <linearGradient id={`bud-petal-${color}`} x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={secondaryColor} />
            <stop offset="60%" stopColor={primaryColor} />
            <stop offset="100%" stopColor="#ffffff" />
          </linearGradient>
          <linearGradient id={`bud-calyx-${color}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#84cc16" />
            <stop offset="100%" stopColor="#3f6212" />
          </linearGradient>
        </defs>

        {/* Soil Base */}
        <ellipse cx="50" cy="88" rx="34" ry="8" fill="#582f0e" opacity="0.75" />
        <ellipse cx="50" cy="86" rx="28" ry="6" fill="#7f4f24" />

        {/* Main Plant Stem */}
        <path
          d="M50 86 Q48 64 51 46 Q52 36 50 28"
          stroke={`url(#bud-stem-${color})`}
          strokeWidth="4.5"
          strokeLinecap="round"
        />

        {/* Lower Left Bushy Leaf */}
        <g transform="translate(49, 66)">
          <path
            d="M0 0 C-16 -8 -28 2 -30 14 C-20 18 -10 12 0 0 Z"
            fill="#65a30d"
            stroke="#365314"
            strokeWidth="1"
          />
          <path d="M0 0 Q-16 6 -26 12" stroke="#d9f99d" strokeWidth="1" strokeLinecap="round" />
        </g>

        {/* Lower Right Bushy Leaf */}
        <g transform="translate(50, 56)">
          <path
            d="M0 0 C16 -8 28 2 30 14 C20 18 10 12 0 0 Z"
            fill="#84cc16"
            stroke="#365314"
            strokeWidth="1"
          />
          <path d="M0 0 Q16 6 26 12" stroke="#ecfccb" strokeWidth="1" strokeLinecap="round" />
        </g>

        {/* Swelling Flower Bud (Top) */}
        <g transform="translate(50, 26)">
          {/* Swelling Colored Bud Petals (Tightly Clustered) */}
          <path
            d="M-10 -2 C-14 -14 -6 -24 0 -26 C6 -24 14 -14 10 -2 C5 4 -5 4 -10 -2 Z"
            fill={`url(#bud-petal-${color})`}
            stroke={accentColor}
            strokeWidth="1.2"
          />
          {/* Outer Petal Swirl */}
          <path
            d="M-7 -4 C-10 -16 -2 -22 0 -26 C2 -18 7 -10 6 -2"
            fill="none"
            stroke="#ffffff"
            strokeWidth="1"
            opacity="0.8"
          />

          {/* Green Calyx / Sepals enveloping bud base */}
          <path
            d="M-11 -3 Q-14 3 0 5 Q14 3 11 -3 Q6 -8 0 -4 Q-6 -8 -11 -3 Z"
            fill={`url(#bud-calyx-${color})`}
            stroke="#365314"
            strokeWidth="1"
          />
          <path d="M-8 -2 Q-12 -12 -9 -18" stroke="#65a30d" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M8 -2 Q12 -12 9 -18" stroke="#65a30d" strokeWidth="1.5" strokeLinecap="round" />
        </g>

        {/* Shimmer of anticipation */}
        <circle cx="42" cy="12" r="1.5" fill="#fef08a" opacity="0.9" />
        <circle cx="58" cy="10" r="1.2" fill="#ffffff" opacity="0.9" />
      </svg>
    );
  }

  // Render Permanent Mastered Flower Asset (Magnificent Full Bloom)
  return (
    <svg
      width={sizeDims.width}
      height={sizeDims.height}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`select-none ${animate ? 'hover:scale-115 transition-all duration-300 drop-shadow-md' : ''} ${className}`}
    >
      <defs>
        <radialGradient id={`master-bloom-glow-${color}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.45" />
          <stop offset="60%" stopColor={color} stopOpacity="0.15" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`master-stem-${color}`} x1="0%" y1="100%" x2="0%" y2="0%">
          <stop offset="0%" stopColor="#166534" />
          <stop offset="50%" stopColor="#22c55e" />
          <stop offset="100%" stopColor="#86efac" />
        </linearGradient>
        <linearGradient id={`petal-grad-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="35%" stopColor={primaryColor} />
          <stop offset="100%" stopColor={secondaryColor} />
        </linearGradient>
        <linearGradient id={`gold-center-${color}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fef08a" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
        <filter id={`bloom-shadow-${color}`} x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" floodColor="#0f172a" floodOpacity="0.2" />
        </filter>
      </defs>

      {/* Golden Mastery Celestial Aura */}
      <circle cx="50" cy="38" r="32" fill={`url(#master-bloom-glow-${color})`} />

      {/* Soil Mound Base with lush grass blades */}
      <ellipse cx="50" cy="90" rx="36" ry="8" fill="#3d210b" opacity="0.8" />
      <ellipse cx="50" cy="88" rx="28" ry="5.5" fill="#582f0e" />

      {/* Little grass sprigs at base */}
      <path d="M30 89 Q28 82 24 80" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" />
      <path d="M70 89 Q72 82 76 80" stroke="#4ade80" strokeWidth="1.5" strokeLinecap="round" />

      {/* Main Robust Green Stem */}
      <path
        d="M50 88 Q48 68 51 54 Q52 46 50 38"
        stroke={`url(#master-stem-${color})`}
        strokeWidth="4.8"
        strokeLinecap="round"
      />

      {/* Healthy Lush Leaves */}
      <g transform="translate(50, 68)">
        <path
          d="M0 0 C-18 -10 -30 2 -32 16 C-20 20 -10 12 0 0 Z"
          fill="#22c55e"
          stroke="#15803d"
          strokeWidth="1.2"
        />
        <path d="M0 0 Q-18 6 -28 14" stroke="#bbf7d0" strokeWidth="1" strokeLinecap="round" />
      </g>
      <g transform="translate(50, 58)">
        <path
          d="M0 0 C18 -10 30 2 32 16 C20 20 10 12 0 0 Z"
          fill="#16a34a"
          stroke="#15803d"
          strokeWidth="1.2"
        />
        <path d="M0 0 Q18 6 28 14" stroke="#dcfce7" strokeWidth="1" strokeLinecap="round" />
      </g>

      {/* 🌸 SPECIES-SPECIFIC BLOOMING PETALS */}
      <g transform="translate(50, 36)" filter={`url(#bloom-shadow-${color})`}>
        {species === 'sunflower' ? (
          // Sunflower Pattern: Ray of bright tapered petals with seeded disc
          <g>
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle) => (
              <path
                key={angle}
                d="M0 0 Q-5 -16 0 -25 Q5 -16 0 0"
                fill="#facc15"
                stroke="#ca8a04"
                strokeWidth="0.8"
                transform={`rotate(${angle})`}
              />
            ))}
            {/* Center Seed Disc */}
            <circle cx="0" cy="0" r="11" fill="#713f12" stroke="#451a03" strokeWidth="1.2" />
            <circle cx="0" cy="0" r="8" fill="#854d0e" />
            <circle cx="-3" cy="-3" r="1" fill="#fde047" opacity="0.8" />
            <circle cx="3" cy="2" r="1" fill="#fde047" opacity="0.8" />
          </g>
        ) : species === 'lotus' ? (
          // Lotus Pattern: Tiered sacred blossom petals
          <g>
            {/* Outer Petals */}
            {[-60, -30, 0, 30, 60].map((angle) => (
              <path
                key={angle}
                d="M0 4 C-10 -10 -6 -24 0 -26 C6 -24 10 -10 0 4 Z"
                fill={`url(#petal-grad-${color})`}
                stroke="#ffffff"
                strokeWidth="0.8"
                transform={`rotate(${angle})`}
              />
            ))}
            {/* Inner Sacred Center */}
            <circle cx="0" cy="0" r="7" fill={`url(#gold-center-${color})`} stroke="#b45309" strokeWidth="1" />
          </g>
        ) : species === 'rose' ? (
          // Rose Pattern: Layered velvet petals
          <g>
            {/* Outer Petals */}
            {[0, 72, 144, 216, 288].map((angle) => (
              <circle
                key={angle}
                cx={Math.cos((angle * Math.PI) / 180) * 11}
                cy={Math.sin((angle * Math.PI) / 180) * 11}
                r="11"
                fill={`url(#petal-grad-${color})`}
                stroke="#ffffff"
                strokeWidth="0.8"
                opacity="0.95"
              />
            ))}
            {/* Inner Rose Petals */}
            {[36, 108, 180, 252, 324].map((angle) => (
              <circle
                key={angle}
                cx={Math.cos((angle * Math.PI) / 180) * 6}
                cy={Math.sin((angle * Math.PI) / 180) * 6}
                r="7"
                fill={primaryColor}
                stroke="#ffffff"
                strokeWidth="0.6"
              />
            ))}
            {/* Rose Core Swirl */}
            <path
              d="M-3 -2 C-3 -6 3 -6 3 -2 C3 2 -2 3 -3 -1"
              stroke="#fef08a"
              strokeWidth="1.6"
              strokeLinecap="round"
              fill="none"
            />
          </g>
        ) : species === 'tulip' ? (
          // Tulip Pattern: Graceful goblet petals
          <g>
            <path
              d="M-14 8 C-18 -12 -12 -24 -8 -26 C-4 -20 -2 -8 0 8 Z"
              fill={`url(#petal-grad-${color})`}
              stroke="#ffffff"
              strokeWidth="0.8"
            />
            <path
              d="M14 8 C18 -12 12 -24 8 -26 C4 -20 2 -8 0 8 Z"
              fill={`url(#petal-grad-${color})`}
              stroke="#ffffff"
              strokeWidth="0.8"
            />
            <path
              d="M-8 8 C-10 -14 0 -28 0 -28 C0 -28 10 -14 8 8 Z"
              fill={primaryColor}
              stroke="#ffffff"
              strokeWidth="1"
            />
            {/* Tulip Center Heart */}
            <circle cx="0" cy="-6" r="3" fill="#fde047" />
          </g>
        ) : (
          // Default Radiant Wildflower / Daisy Bloom
          <g>
            {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
              <path
                key={angle}
                d="M0 0 C-6 -10 -6 -20 0 -24 C6 -20 6 -10 0 0 Z"
                fill={`url(#petal-grad-${color})`}
                stroke="#ffffff"
                strokeWidth="0.9"
                transform={`rotate(${angle})`}
              />
            ))}
            {/* Golden Core Center */}
            <circle cx="0" cy="0" r="9" fill={`url(#gold-center-${color})`} stroke="#b45309" strokeWidth="1.2" />
            <circle cx="0" cy="0" r="6" fill="#facc15" />
            <circle cx="-2" cy="-2" r="1.5" fill="#ffffff" opacity="0.9" />
          </g>
        )}
      </g>

      {/* Golden Master Star Badge on Bloom */}
      <g transform="translate(68, 14)">
        <polygon
          points="0,-6 1.8,-1.8 6.4,-1.8 2.8,1 4.2,5.4 0,2.6 -4.2,5.4 -2.8,1 -6.4,-1.8 -1.8,-1.8"
          fill="#facc15"
          stroke="#ca8a04"
          strokeWidth="0.8"
        />
      </g>

      {/* Celestial Morning Sparkle Highlights */}
      <circle cx="28" cy="18" r="1.6" fill="#ffffff" opacity="0.9" />
      <circle cx="74" cy="42" r="1.4" fill="#ffffff" opacity="0.9" />
      <circle cx="24" cy="52" r="1.2" fill="#fef08a" opacity="0.8" />
    </svg>
  );
};
