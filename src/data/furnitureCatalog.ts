import {
  FurnitureItem,
  HomeItem,
  ShopCategory,
  FurnitureCollection,
  ItemPlacement,
  ItemSize,
  FurnitureActionType
} from '../types';

/**
 * Utility to encode an SVG string into a data URI for direct use in <img src="..." />
 */
function svgToDataUri(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString.trim())}`;
}

// ============================================================================
// 🎨 Custom SVG Vector Graphics for the 26 Furniture & Home Feature Items
// ============================================================================

const SVGS = {
  // 1. Classic Single Bed
  classicSingleBed: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" width="100%" height="100%">
      <rect width="160" height="120" rx="16" fill="#fef8ee"/>
      <!-- Wooden Bed Frame Back -->
      <rect x="25" y="24" width="110" height="50" rx="8" fill="#8d5b36"/>
      <rect x="30" y="28" width="100" height="42" rx="6" fill="#b07d4b"/>
      <line x1="55" y1="28" x2="55" y2="70" stroke="#8d5b36" stroke-width="2"/>
      <line x1="80" y1="28" x2="80" y2="70" stroke="#8d5b36" stroke-width="2"/>
      <line x1="105" y1="28" x2="105" y2="70" stroke="#8d5b36" stroke-width="2"/>
      <!-- Mattress & Bedding -->
      <rect x="25" y="55" width="110" height="44" rx="8" fill="#f8fafc" stroke="#e2e8f0" stroke-width="2"/>
      <!-- Soft Quilt -->
      <path d="M 25 70 Q 80 66 135 70 L 135 98 Q 80 102 25 98 Z" fill="#38bdf8"/>
      <path d="M 25 78 Q 80 74 135 78 L 135 98 Q 80 102 25 98 Z" fill="#0284c7"/>
      <!-- Quilt Pattern -->
      <circle cx="50" cy="88" r="3" fill="#bae6fd" opacity="0.8"/>
      <circle cx="80" cy="88" r="3" fill="#bae6fd" opacity="0.8"/>
      <circle cx="110" cy="88" r="3" fill="#bae6fd" opacity="0.8"/>
      <!-- Pillows -->
      <rect x="34" y="50" width="40" height="20" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
      <rect x="84" y="50" width="40" height="20" rx="6" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5"/>
      <!-- Bed Frame Legs -->
      <rect x="25" y="98" width="10" height="14" rx="2" fill="#6d4223"/>
      <rect x="125" y="98" width="10" height="14" rx="2" fill="#6d4223"/>
    </svg>
  `),

  // 2. Wooden Dresser
  woodenDresser: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" width="100%" height="100%">
      <rect width="160" height="120" rx="16" fill="#fbf7ee"/>
      <!-- Dresser Body -->
      <rect x="35" y="24" width="90" height="74" rx="8" fill="#9a6237" stroke="#6d4223" stroke-width="2"/>
      <rect x="38" y="27" width="84" height="68" rx="6" fill="#b97c4c"/>
      <!-- Top Bevel -->
      <rect x="32" y="20" width="96" height="8" rx="4" fill="#824f28"/>
      <!-- 3 Drawers -->
      <rect x="42" y="32" width="76" height="16" rx="3" fill="#cd905f" stroke="#824f28" stroke-width="1"/>
      <circle cx="80" cy="40" r="2.5" fill="#fef08a" stroke="#ca8a04" stroke-width="1"/>
      <rect x="42" y="52" width="76" height="16" rx="3" fill="#cd905f" stroke="#824f28" stroke-width="1"/>
      <circle cx="80" cy="60" r="2.5" fill="#fef08a" stroke="#ca8a04" stroke-width="1"/>
      <rect x="42" y="72" width="76" height="16" rx="3" fill="#cd905f" stroke="#824f28" stroke-width="1"/>
      <circle cx="80" cy="80" r="2.5" fill="#fef08a" stroke="#ca8a04" stroke-width="1"/>
      <!-- Legs -->
      <rect x="38" y="98" width="8" height="12" rx="2" fill="#6d4223"/>
      <rect x="114" y="98" width="8" height="12" rx="2" fill="#6d4223"/>
    </svg>
  `),

  // 3. Bedside Nightstand
  nightstand: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" width="100%" height="100%">
      <rect width="160" height="120" rx="16" fill="#fbf7ee"/>
      <!-- Table Top -->
      <rect x="42" y="32" width="76" height="10" rx="4" fill="#8d5b36"/>
      <!-- Cabinet Frame -->
      <rect x="46" y="42" width="68" height="52" rx="6" fill="#ad7242" stroke="#6d4223" stroke-width="1.5"/>
      <!-- Top Drawer -->
      <rect x="52" y="48" width="56" height="18" rx="3" fill="#c48a58" stroke="#8d5b36" stroke-width="1"/>
      <circle cx="80" cy="57" r="2.5" fill="#fef08a" stroke="#ca8a04" stroke-width="1"/>
      <!-- Lower Open Cubby -->
      <rect x="52" y="70" width="56" height="18" rx="3" fill="#7a4b27"/>
      <!-- Books inside cubby -->
      <rect x="56" y="76" width="18" height="10" rx="1.5" fill="#38bdf8"/>
      <rect x="76" y="74" width="14" height="12" rx="1.5" fill="#f43f5e"/>
      <!-- Legs -->
      <rect x="48" y="94" width="8" height="14" rx="2" fill="#6d4223"/>
      <rect x="104" y="94" width="8" height="14" rx="2" fill="#6d4223"/>
    </svg>
  `),

  // 4. Warm Bedside Lamp
  bedsideLamp: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" width="100%" height="100%">
      <rect width="160" height="120" rx="16" fill="#fffbeb"/>
      <!-- Warm Glow Rays -->
      <circle cx="80" cy="46" r="38" fill="#fef08a" opacity="0.4"/>
      <circle cx="80" cy="46" r="26" fill="#fef08a" opacity="0.6"/>
      <!-- Lampshade -->
      <polygon points="62,60 98,60 92,30 68,30" fill="#fef3c7" stroke="#d97706" stroke-width="1.5"/>
      <!-- Pleats on Shade -->
      <line x1="72" y1="32" x2="68" y2="58" stroke="#fde68a" stroke-width="1.5"/>
      <line x1="80" y1="31" x2="80" y2="59" stroke="#fde68a" stroke-width="1.5"/>
      <line x1="88" y1="32" x2="92" y2="58" stroke="#fde68a" stroke-width="1.5"/>
      <!-- Finial Top -->
      <circle cx="80" cy="27" r="3" fill="#b45309"/>
      <!-- Lamp Stand & Stem -->
      <rect x="78" y="60" width="4" height="34" fill="#d97706"/>
      <circle cx="80" cy="74" r="5" fill="#b45309"/>
      <!-- Base -->
      <ellipse cx="80" cy="95" rx="22" ry="6" fill="#b45309"/>
      <ellipse cx="80" cy="94" rx="18" ry="4" fill="#f59e0b"/>
    </svg>
  `),

  // 5. Standing Mirror
  standingMirror: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" width="100%" height="100%">
      <rect width="160" height="120" rx="16" fill="#f8fafc"/>
      <!-- Easel Stand Back Legs -->
      <line x1="60" y1="90" x2="48" y2="108" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
      <line x1="100" y1="90" x2="112" y2="108" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
      <!-- Mirror Outer Arched Frame -->
      <path d="M 52 46 A 28 28 0 0 1 108 46 L 108 92 A 4 4 0 0 1 104 96 L 56 96 A 4 4 0 0 1 52 92 Z" fill="#9a6237" stroke="#78350f" stroke-width="2"/>
      <!-- Mirror Glass Reflection -->
      <path d="M 57 47 A 23 23 0 0 1 103 47 L 103 91 L 57 91 Z" fill="#e0f2fe"/>
      <!-- Reflection Sheen Lines -->
      <line x1="64" y1="52" x2="82" y2="34" stroke="#ffffff" stroke-width="3" stroke-linecap="round" opacity="0.9"/>
      <line x1="72" y1="74" x2="96" y2="50" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
      <!-- Mirror Stand Knobs -->
      <circle cx="50" cy="68" r="3.5" fill="#f59e0b"/>
      <circle cx="110" cy="68" r="3.5" fill="#f59e0b"/>
    </svg>
  `),

  // 6. Two-Seat Linen Sofa
  twoSeatSofa: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" width="100%" height="100%">
      <rect width="160" height="120" rx="16" fill="#faf5ee"/>
      <!-- Backrest Cushions -->
      <rect x="34" y="32" width="44" height="42" rx="10" fill="#e2d6c3" stroke="#c4b59f" stroke-width="1.5"/>
      <rect x="82" y="32" width="44" height="42" rx="10" fill="#e2d6c3" stroke="#c4b59f" stroke-width="1.5"/>
      <!-- Seat Base -->
      <rect x="28" y="66" width="104" height="24" rx="8" fill="#d8cabb" stroke="#bbaa95" stroke-width="1.5"/>
      <!-- Seat Cushions Line Divider -->
      <line x1="80" y1="66" x2="80" y2="90" stroke="#bbaa95" stroke-width="2"/>
      <!-- Armrests -->
      <rect x="20" y="52" width="16" height="38" rx="8" fill="#cbbcad" stroke="#b1a08e" stroke-width="1.5"/>
      <rect x="124" y="52" width="16" height="38" rx="8" fill="#cbbcad" stroke="#b1a08e" stroke-width="1.5"/>
      <!-- Throw Pillows -->
      <rect x="36" y="58" width="18" height="18" rx="4" fill="#38bdf8" transform="rotate(-10 45 67)"/>
      <rect x="106" y="58" width="18" height="18" rx="4" fill="#fb923c" transform="rotate(10 115 67)"/>
      <!-- Wooden Tapered Legs -->
      <polygon points="32,90 28,104 34,104 36,90" fill="#78350f"/>
      <polygon points="128,90 126,104 132,104 130,90" fill="#78350f"/>
      <polygon points="78,90 77,104 83,104 82,90" fill="#78350f"/>
    </svg>
  `),

  // 7. Oak Coffee Table
  coffeeTable: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" width="100%" height="100%">
      <rect width="160" height="120" rx="16" fill="#fbf7ee"/>
      <!-- Oval Table Top -->
      <ellipse cx="80" cy="54" rx="58" ry="20" fill="#a46d42" stroke="#78350f" stroke-width="2"/>
      <ellipse cx="80" cy="51" rx="56" ry="18" fill="#c89264"/>
      <!-- Wood Grain Ring Lines -->
      <ellipse cx="80" cy="51" rx="42" ry="12" fill="none" stroke="#b57e51" stroke-width="1.5" opacity="0.6"/>
      <ellipse cx="80" cy="51" rx="24" ry="7" fill="none" stroke="#b57e51" stroke-width="1" opacity="0.6"/>
      <!-- Tea Cup & Saucer on Top -->
      <ellipse cx="64" cy="49" rx="8" ry="3.5" fill="#e2e8f0"/>
      <rect x="60" y="44" width="8" height="6" rx="2" fill="#ffffff"/>
      <!-- Magazine on Table -->
      <rect x="94" y="44" width="18" height="12" rx="2" fill="#f43f5e" transform="rotate(8 103 50)"/>
      <!-- Table Legs -->
      <polygon points="40,68 34,98 40,98 44,68" fill="#78350f"/>
      <polygon points="120,68 116,98 122,98 124,68" fill="#78350f"/>
      <polygon points="68,70 66,94 71,94 72,70" fill="#6d4223"/>
      <polygon points="92,70 89,94 94,94 96,70" fill="#6d4223"/>
    </svg>
  `),

  // 8. Cozy Armchair
  armchair: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" width="100%" height="100%">
      <rect width="160" height="120" rx="16" fill="#fff7ed"/>
      <!-- Winged Backrest -->
      <path d="M 44 30 Q 80 24 116 30 Q 122 56 120 72 L 40 72 Q 38 56 44 30 Z" fill="#ea580c" stroke="#c2410c" stroke-width="2"/>
      <!-- Tufting Buttons -->
      <circle cx="64" cy="42" r="2.5" fill="#9a3412"/>
      <circle cx="96" cy="42" r="2.5" fill="#9a3412"/>
      <circle cx="80" cy="54" r="2.5" fill="#9a3412"/>
      <!-- Seat Cushion -->
      <rect x="36" y="66" width="88" height="22" rx="8" fill="#f97316" stroke="#c2410c" stroke-width="1.5"/>
      <!-- Armrests -->
      <rect x="26" y="52" width="16" height="34" rx="8" fill="#fb923c" stroke="#c2410c" stroke-width="1.5"/>
      <rect x="118" y="52" width="16" height="34" rx="8" fill="#fb923c" stroke="#c2410c" stroke-width="1.5"/>
      <!-- Soft Lumbar Pillow -->
      <rect x="54" y="64" width="52" height="14" rx="6" fill="#fef3c7" stroke="#fde047" stroke-width="1"/>
      <!-- Legs -->
      <polygon points="38,88 34,104 40,104 42,88" fill="#78350f"/>
      <polygon points="122,88 120,104 126,104 126,88" fill="#78350f"/>
    </svg>
  `),

  // 9. Round Side Table
  sideTable: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" width="100%" height="100%">
      <rect width="160" height="120" rx="16" fill="#fbf7ee"/>
      <!-- Circular Table Top -->
      <ellipse cx="80" cy="44" rx="42" ry="16" fill="#a46d42" stroke="#78350f" stroke-width="2"/>
      <ellipse cx="80" cy="41" rx="40" ry="14" fill="#cb9569"/>
      <!-- Flower Vase on Top -->
      <ellipse cx="80" cy="38" rx="6" ry="2" fill="#38bdf8"/>
      <rect x="77" y="28" width="6" height="10" rx="2" fill="#7dd3fc"/>
      <circle cx="80" cy="24" r="5" fill="#f43f5e"/>
      <circle cx="80" cy="24" r="2" fill="#fef08a"/>
      <!-- Tripod Legs -->
      <line x1="60" y1="52" x2="46" y2="100" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
      <line x1="80" y1="54" x2="80" y2="104" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
      <line x1="100" y1="52" x2="114" y2="100" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
    </svg>
  `),

  // 10. Indoor Fiddle Fig
  indoorPlant: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" width="100%" height="100%">
      <rect width="160" height="120" rx="16" fill="#f0fdf4"/>
      <!-- Stem -->
      <path d="M 80 84 Q 82 54 78 30" stroke="#78350f" stroke-width="4" stroke-linecap="round" fill="none"/>
      <!-- Large Fiddle Leaves -->
      <path d="M 78 62 C 60 56 46 64 48 76 C 58 84 72 74 78 66 Z" fill="#15803d" stroke="#14532d" stroke-width="1.5"/>
      <path d="M 80 50 C 98 44 112 52 110 64 C 100 72 86 62 80 54 Z" fill="#16a34a" stroke="#14532d" stroke-width="1.5"/>
      <path d="M 78 38 C 58 28 50 36 54 48 C 66 52 74 44 78 40 Z" fill="#22c55e" stroke="#14532d" stroke-width="1.5"/>
      <path d="M 78 28 C 70 12 90 12 88 24 Z" fill="#4ade80" stroke="#14532d" stroke-width="1.5"/>
      <!-- Pot & Soil -->
      <polygon points="62,80 98,80 94,106 66,106" fill="#ffffff" stroke="#cbd5e1" stroke-width="2"/>
      <ellipse cx="80" cy="80" rx="18" ry="4" fill="#78350f"/>
    </svg>
  `),

  // 11. Small Bookshelf
  smallBookshelf: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" width="100%" height="100%">
      <rect width="160" height="120" rx="16" fill="#fbf7ee"/>
      <!-- Wooden Outer Case -->
      <rect x="36" y="20" width="88" height="84" rx="6" fill="#a46d42" stroke="#78350f" stroke-width="2"/>
      <rect x="42" y="26" width="76" height="72" rx="4" fill="#c89264"/>
      <!-- Middle Shelf -->
      <rect x="38" y="60" width="84" height="6" fill="#8d5b36"/>
      <!-- Top Shelf Books -->
      <rect x="46" y="32" width="10" height="28" rx="2" fill="#ef4444"/>
      <rect x="58" y="36" width="8" height="24" rx="2" fill="#3b82f6"/>
      <rect x="68" y="30" width="12" height="30" rx="2" fill="#10b981"/>
      <rect x="82" y="34" width="9" height="26" rx="2" fill="#f59e0b"/>
      <rect x="93" y="38" width="16" height="22" rx="2" fill="#8b5cf6" transform="rotate(14 101 49)"/>
      <!-- Bottom Shelf Books & Globe -->
      <rect x="46" y="66" width="12" height="30" rx="2" fill="#06b6d4"/>
      <rect x="60" y="70" width="9" height="26" rx="2" fill="#ec4899"/>
      <rect x="71" y="68" width="11" height="28" rx="2" fill="#84cc16"/>
      <!-- Mini Bookend/Globe -->
      <circle cx="102" cy="80" r="10" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5"/>
      <rect x="98" y="90" width="8" height="6" fill="#d97706"/>
      <!-- Feet -->
      <rect x="40" y="104" width="8" height="8" rx="2" fill="#6d4223"/>
      <rect x="112" y="104" width="8" height="8" rx="2" fill="#6d4223"/>
    </svg>
  `),

  // 12. Velvet Reading Chair
  readingChair: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" width="100%" height="100%">
      <rect width="160" height="120" rx="16" fill="#f0fdf4"/>
      <!-- Wingback Shape in Sage Velvet -->
      <path d="M 44 26 Q 80 20 116 26 Q 124 54 122 72 L 38 72 Q 36 54 44 26 Z" fill="#166534" stroke="#14532d" stroke-width="2"/>
      <circle cx="65" cy="40" r="2.5" fill="#14532d"/>
      <circle cx="95" cy="40" r="2.5" fill="#14532d"/>
      <circle cx="80" cy="52" r="2.5" fill="#14532d"/>
      <!-- Cushion -->
      <rect x="36" y="68" width="88" height="22" rx="8" fill="#15803d" stroke="#14532d" stroke-width="1.5"/>
      <!-- Armrests -->
      <rect x="26" y="52" width="16" height="34" rx="8" fill="#22c55e" stroke="#14532d" stroke-width="1.5"/>
      <rect x="118" y="52" width="16" height="34" rx="8" fill="#22c55e" stroke="#14532d" stroke-width="1.5"/>
      <!-- Legs -->
      <polygon points="38,90 34,106 40,106 42,90" fill="#78350f"/>
      <polygon points="122,90 120,106 126,106 126,90" fill="#78350f"/>
    </svg>
  `),

  // 13. Arc Reading Floor Lamp
  readingFloorLamp: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" width="100%" height="100%">
      <rect width="160" height="120" rx="16" fill="#fffbeb"/>
      <!-- Glow Cone -->
      <polygon points="68,44 116,44 136,100 48,100" fill="#fef08a" opacity="0.35"/>
      <!-- Heavy Base on Right -->
      <ellipse cx="118" cy="100" rx="18" ry="6" fill="#78350f"/>
      <ellipse cx="118" cy="98" rx="14" ry="4" fill="#b45309"/>
      <!-- Tall Arching Brass Stem -->
      <path d="M 118 98 L 118 48 Q 118 20 90 22 Q 74 24 72 40" fill="none" stroke="#d97706" stroke-width="4" stroke-linecap="round"/>
      <!-- Hanging Dome Shade -->
      <path d="M 60 44 A 14 14 0 0 1 84 44 Z" fill="#b45309" stroke="#78350f" stroke-width="1.5"/>
      <circle cx="72" cy="46" r="4" fill="#fef08a"/>
    </svg>
  `),

  // 14. Timber Study Desk
  studyDesk: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" width="100%" height="100%">
      <rect width="160" height="120" rx="16" fill="#fbf7ee"/>
      <!-- Desktop Surface -->
      <rect x="25" y="38" width="110" height="12" rx="4" fill="#8d5b36" stroke="#6d4223" stroke-width="2"/>
      <rect x="28" y="40" width="104" height="8" rx="2" fill="#b97c4c"/>
      <!-- Items on Desk: Laptop & Pen Cup -->
      <rect x="62" y="24" width="28" height="16" rx="2" fill="#64748b"/>
      <rect x="60" y="38" width="32" height="2" fill="#94a3b8"/>
      <rect x="104" y="28" width="10" height="12" rx="2" fill="#38bdf8"/>
      <line x1="107" y1="24" x2="107" y2="32" stroke="#f43f5e" stroke-width="2"/>
      <line x1="111" y1="22" x2="111" y2="32" stroke="#eab308" stroke-width="2"/>
      <!-- Left Drawer Stack -->
      <rect x="32" y="50" width="32" height="46" rx="4" fill="#ad7242" stroke="#6d4223" stroke-width="1.5"/>
      <rect x="36" y="54" width="24" height="10" rx="2" fill="#c48a58"/>
      <circle cx="48" cy="59" r="1.5" fill="#fef08a"/>
      <rect x="36" y="68" width="24" height="10" rx="2" fill="#c48a58"/>
      <circle cx="48" cy="73" r="1.5" fill="#fef08a"/>
      <rect x="36" y="82" width="24" height="10" rx="2" fill="#c48a58"/>
      <circle cx="48" cy="87" r="1.5" fill="#fef08a"/>
      <!-- Right Legs -->
      <rect x="118" y="50" width="8" height="48" rx="2" fill="#6d4223"/>
      <!-- Foot Rest Bar -->
      <rect x="64" y="80" width="56" height="4" rx="2" fill="#8d5b36"/>
    </svg>
  `),

  // 15. Padded Desk Chair
  deskChair: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" width="100%" height="100%">
      <rect width="160" height="120" rx="16" fill="#f8fafc"/>
      <!-- Wooden Curved Backrest -->
      <path d="M 54 26 Q 80 20 106 26 L 104 56 Q 80 52 56 56 Z" fill="#a46d42" stroke="#78350f" stroke-width="2"/>
      <!-- Spindles -->
      <line x1="68" y1="26" x2="68" y2="54" stroke="#78350f" stroke-width="2"/>
      <line x1="80" y1="23" x2="80" y2="53" stroke="#78350f" stroke-width="2"/>
      <line x1="92" y1="26" x2="92" y2="54" stroke="#78350f" stroke-width="2"/>
      <!-- Padded Seat Cushion -->
      <rect x="48" y="58" width="64" height="16" rx="6" fill="#38bdf8" stroke="#0284c7" stroke-width="1.5"/>
      <!-- Four Sturdy Tapered Legs -->
      <line x1="56" y1="74" x2="48" y2="104" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
      <line x1="104" y1="74" x2="112" y2="104" stroke="#78350f" stroke-width="4" stroke-linecap="round"/>
      <line x1="72" y1="74" x2="68" y2="102" stroke="#8d5b36" stroke-width="3" stroke-linecap="round"/>
      <line x1="88" y1="74" x2="92" y2="102" stroke="#8d5b36" stroke-width="3" stroke-linecap="round"/>
    </svg>
  `),

  // 16. Golden Frame Wall Art
  pictureFrame: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" width="100%" height="100%">
      <rect width="160" height="120" rx="16" fill="#fffbeb"/>
      <!-- Hanging String -->
      <line x1="80" y1="16" x2="52" y2="34" stroke="#ca8a04" stroke-width="1.5"/>
      <line x1="80" y1="16" x2="108" y2="34" stroke="#ca8a04" stroke-width="1.5"/>
      <circle cx="80" cy="16" r="3" fill="#a16207"/>
      <!-- Gilded Outer Frame -->
      <rect x="36" y="32" width="88" height="68" rx="6" fill="#eab308" stroke="#a16207" stroke-width="3"/>
      <rect x="42" y="38" width="76" height="56" rx="4" fill="#fef08a"/>
      <!-- Landscape Artwork Canvas -->
      <rect x="46" y="42" width="68" height="48" rx="2" fill="#bae6fd"/>
      <!-- Sun & Mountain Landscape -->
      <circle cx="94" cy="54" r="8" fill="#fbbf24"/>
      <path d="M 46 80 L 64 60 L 80 76 L 94 62 L 114 80 L 114 90 L 46 90 Z" fill="#22c55e"/>
      <path d="M 70 90 L 84 74 L 102 90 Z" fill="#15803d"/>
    </svg>
  `),

  // 17. Small Ceramic Succulent
  smallPottedPlant: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" width="100%" height="100%">
      <rect width="160" height="120" rx="16" fill="#f0fdf4"/>
      <!-- Succulent Rosette Petals -->
      <circle cx="80" cy="54" r="26" fill="#86efac" opacity="0.6"/>
      <ellipse cx="80" cy="46" rx="12" ry="18" fill="#22c55e" stroke="#15803d" stroke-width="1.5"/>
      <ellipse cx="70" cy="54" rx="16" ry="12" fill="#16a34a" stroke="#15803d" stroke-width="1.5" transform="rotate(-30 70 54)"/>
      <ellipse cx="90" cy="54" rx="16" ry="12" fill="#16a34a" stroke="#15803d" stroke-width="1.5" transform="rotate(30 90 54)"/>
      <ellipse cx="80" cy="58" rx="14" ry="10" fill="#4ade80" stroke="#15803d" stroke-width="1.5"/>
      <circle cx="80" cy="52" r="5" fill="#bbf7d0"/>
      <!-- Speckled Ceramic Pot -->
      <polygon points="60,70 100,70 94,98 66,98" fill="#fed7aa" stroke="#c2410c" stroke-width="2"/>
      <ellipse cx="80" cy="70" rx="20" ry="4" fill="#78350f"/>
      <!-- Drainage Saucer -->
      <ellipse cx="80" cy="100" rx="22" ry="4" fill="#ea580c"/>
    </svg>
  `),

  // 18. Vanilla Pillar Candle
  decorativeCandle: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" width="100%" height="100%">
      <rect width="160" height="120" rx="16" fill="#fffbeb"/>
      <!-- Glowing Halo -->
      <circle cx="80" cy="38" r="24" fill="#fef08a" opacity="0.5"/>
      <circle cx="80" cy="38" r="14" fill="#fed7aa" opacity="0.7"/>
      <!-- Candle Flame -->
      <path d="M 80 24 C 84 32 86 38 80 44 C 74 38 76 32 80 24 Z" fill="#f59e0b"/>
      <ellipse cx="80" cy="38" rx="2.5" ry="4" fill="#fef08a"/>
      <!-- Candle Wick -->
      <line x1="80" y1="44" x2="80" y2="50" stroke="#78350f" stroke-width="2"/>
      <!-- Beeswax Cylinder Body -->
      <rect x="62" y="48" width="36" height="46" rx="4" fill="#fef3c7" stroke="#fde68a" stroke-width="1.5"/>
      <ellipse cx="80" cy="48" rx="18" ry="5" fill="#fef9c3"/>
      <!-- Wax Drips -->
      <path d="M 68 48 C 68 56 72 58 72 52" fill="none" stroke="#fef9c3" stroke-width="3" stroke-linecap="round"/>
      <!-- Ceramic Coaster Dish -->
      <ellipse cx="80" cy="95" rx="28" ry="7" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="2"/>
    </svg>
  `),

  // 19. Storybook Stack
  stackOfBooks: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" width="100%" height="100%">
      <rect width="160" height="120" rx="16" fill="#fbf7ee"/>
      <!-- Bottom Book (Blue) -->
      <rect x="36" y="78" width="88" height="18" rx="4" fill="#0284c7" stroke="#0369a1" stroke-width="1.5"/>
      <rect x="42" y="81" width="80" height="12" rx="2" fill="#f8fafc"/>
      <line x1="36" y1="87" x2="124" y2="87" stroke="#0369a1" stroke-width="1"/>
      <!-- Middle Book (Red) -->
      <rect x="44" y="60" width="76" height="18" rx="4" fill="#e11d48" stroke="#be123c" stroke-width="1.5"/>
      <rect x="50" y="63" width="68" height="12" rx="2" fill="#f8fafc"/>
      <!-- Gold Bookmark Ribbon -->
      <path d="M 112 66 L 118 78 L 124 74" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round"/>
      <!-- Top Book (Emerald) -->
      <rect x="52" y="44" width="62" height="16" rx="4" fill="#059669" stroke="#047857" stroke-width="1.5"/>
      <rect x="58" y="47" width="54" height="10" rx="2" fill="#f8fafc"/>
      <circle cx="83" cy="52" r="3" fill="#fef08a"/>
    </svg>
  `),

  // 20. Soft Bunny Plushie
  bunnyPlush: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" width="100%" height="100%">
      <rect width="160" height="120" rx="16" fill="#fdf4ff"/>
      <!-- Bunny Long Ears -->
      <ellipse cx="68" cy="34" rx="8" ry="24" fill="#f5d0fe" stroke="#e879f9" stroke-width="1.5" transform="rotate(-15 68 34)"/>
      <ellipse cx="68" cy="34" rx="4" ry="18" fill="#fbcfe8"/>
      <ellipse cx="92" cy="34" rx="8" ry="24" fill="#f5d0fe" stroke="#e879f9" stroke-width="1.5" transform="rotate(15 92 34)"/>
      <ellipse cx="92" cy="34" rx="4" ry="18" fill="#fbcfe8"/>
      <!-- Bunny Body -->
      <ellipse cx="80" cy="80" rx="26" ry="22" fill="#fae8ff" stroke="#e879f9" stroke-width="1.5"/>
      <!-- Fluffy Feet -->
      <ellipse cx="64" cy="98" rx="10" ry="6" fill="#f5d0fe"/>
      <ellipse cx="96" cy="98" rx="10" ry="6" fill="#f5d0fe"/>
      <!-- Head -->
      <circle cx="80" cy="58" r="22" fill="#fae8ff" stroke="#e879f9" stroke-width="1.5"/>
      <!-- Eyes & Nose -->
      <circle cx="73" cy="56" r="2.5" fill="#4a044e"/>
      <circle cx="87" cy="56" r="2.5" fill="#4a044e"/>
      <polygon points="80,62 77,66 83,66" fill="#f43f5e"/>
      <!-- Pink Cheeks -->
      <circle cx="68" cy="62" r="3.5" fill="#f472b6" opacity="0.6"/>
      <circle cx="92" cy="62" r="3.5" fill="#f472b6" opacity="0.6"/>
      <!-- Cozy Bowtie -->
      <polygon points="74,74 80,78 74,82" fill="#38bdf8"/>
      <polygon points="86,74 80,78 86,82" fill="#38bdf8"/>
      <circle cx="80" cy="78" r="2.5" fill="#0284c7"/>
    </svg>
  `),

  // 21. Classic Mullion Window
  classicWindow: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" width="100%" height="100%">
      <rect width="160" height="120" rx="16" fill="#f0f9ff"/>
      <!-- Window Sill & Outer Casing -->
      <rect x="36" y="20" width="88" height="80" rx="6" fill="#ffffff" stroke="#cbd5e1" stroke-width="3"/>
      <!-- Window Sill Shelf -->
      <rect x="30" y="96" width="100" height="10" rx="4" fill="#f1f5f9" stroke="#94a3b8" stroke-width="2"/>
      <!-- Sky Glass Panes -->
      <rect x="44" y="28" width="34" height="30" fill="#bae6fd"/>
      <rect x="82" y="28" width="34" height="30" fill="#bae6fd"/>
      <rect x="44" y="62" width="34" height="30" fill="#bae6fd"/>
      <rect x="82" y="62" width="34" height="30" fill="#bae6fd"/>
      <!-- Sun in Glass -->
      <circle cx="98" cy="40" r="10" fill="#fef08a" opacity="0.9"/>
      <!-- Window Mullion Cross Bars -->
      <line x1="80" y1="24" x2="80" y2="96" stroke="#ffffff" stroke-width="5"/>
      <line x1="40" y1="60" x2="120" y2="60" stroke="#ffffff" stroke-width="5"/>
      <!-- Glass Glare Lines -->
      <line x1="48" y1="32" x2="62" y2="46" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
      <line x1="86" y1="66" x2="100" y2="80" stroke="#ffffff" stroke-width="2" stroke-linecap="round" opacity="0.8"/>
    </svg>
  `),

  // 22. Linen Cream Curtains
  creamCurtains: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" width="100%" height="100%">
      <rect width="160" height="120" rx="16" fill="#fdfbf7"/>
      <!-- Wooden Curtain Rod -->
      <rect x="24" y="20" width="112" height="6" rx="3" fill="#8d5b36"/>
      <circle cx="24" cy="23" r="5" fill="#6d4223"/>
      <circle cx="136" cy="23" r="5" fill="#6d4223"/>
      <!-- Curtain Rings -->
      <circle cx="38" cy="23" r="4" fill="none" stroke="#6d4223" stroke-width="1.5"/>
      <circle cx="56" cy="23" r="4" fill="none" stroke="#6d4223" stroke-width="1.5"/>
      <circle cx="104" cy="23" r="4" fill="none" stroke="#6d4223" stroke-width="1.5"/>
      <circle cx="122" cy="23" r="4" fill="none" stroke="#6d4223" stroke-width="1.5"/>
      <!-- Left Flowing Drape -->
      <path d="M 32 26 C 42 48 34 82 28 104 L 54 104 C 58 76 56 46 56 26 Z" fill="#fef3c7" stroke="#fde68a" stroke-width="1.5"/>
      <ellipse cx="44" cy="68" rx="4" ry="12" fill="#fde047" opacity="0.5"/>
      <!-- Right Flowing Drape -->
      <path d="M 128 26 C 118 48 126 82 132 104 L 106 104 C 102 76 104 46 104 26 Z" fill="#fef3c7" stroke="#fde68a" stroke-width="1.5"/>
      <ellipse cx="116" cy="68" rx="4" ry="12" fill="#fde047" opacity="0.5"/>
    </svg>
  `),

  // 23. Classic Paneled Door
  classicInteriorDoor: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" width="100%" height="100%">
      <rect width="160" height="120" rx="16" fill="#f8fafc"/>
      <!-- Outer Door Frame Trim -->
      <rect x="42" y="16" width="76" height="96" rx="4" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="2"/>
      <!-- Door Panel Slab -->
      <rect x="48" y="20" width="64" height="92" rx="2" fill="#ffffff" stroke="#94a3b8" stroke-width="1.5"/>
      <!-- 4 Recessed Molded Panels -->
      <rect x="54" y="28" width="22" height="34" rx="2" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5"/>
      <rect x="82" y="28" width="22" height="34" rx="2" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5"/>
      <rect x="54" y="68" width="22" height="36" rx="2" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5"/>
      <rect x="82" y="68" width="22" height="36" rx="2" fill="#f1f5f9" stroke="#cbd5e1" stroke-width="1.5"/>
      <!-- Brass Door Handle & Latch -->
      <circle cx="102" cy="64" r="3" fill="#ca8a04"/>
      <line x1="102" y1="64" x2="108" y2="64" stroke="#ca8a04" stroke-width="2.5" stroke-linecap="round"/>
    </svg>
  `),

  // 24. Natural Hardwood Planks
  naturalHardwoodFloor: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" width="100%" height="100%">
      <rect width="160" height="120" rx="16" fill="#fef3c7"/>
      <!-- Floorboard Planks -->
      <rect x="20" y="20" width="120" height="18" fill="#d97706" stroke="#b45309" stroke-width="1"/>
      <line x1="80" y1="20" x2="80" y2="38" stroke="#b45309" stroke-width="2"/>
      <rect x="20" y="40" width="120" height="18" fill="#c2410c" stroke="#9a3412" stroke-width="1"/>
      <line x1="50" y1="40" x2="50" y2="58" stroke="#9a3412" stroke-width="2"/>
      <line x1="110" y1="40" x2="110" y2="58" stroke="#9a3412" stroke-width="2"/>
      <rect x="20" y="60" width="120" height="18" fill="#d97706" stroke="#b45309" stroke-width="1"/>
      <line x1="75" y1="60" x2="75" y2="78" stroke="#b45309" stroke-width="2"/>
      <rect x="20" y="80" width="120" height="18" fill="#b45309" stroke="#78350f" stroke-width="1"/>
      <line x1="40" y1="80" x2="40" y2="98" stroke="#78350f" stroke-width="2"/>
      <line x1="100" y1="80" x2="100" y2="98" stroke="#78350f" stroke-width="2"/>
      <!-- Realistic Grain Strokes -->
      <line x1="30" y1="26" x2="60" y2="26" stroke="#fde68a" stroke-width="1" opacity="0.6"/>
      <line x1="88" y1="46" x2="104" y2="46" stroke="#fde68a" stroke-width="1" opacity="0.6"/>
      <line x1="34" y1="66" x2="54" y2="66" stroke="#fde68a" stroke-width="1" opacity="0.6"/>
      <line x1="60" y1="86" x2="90" y2="86" stroke="#fde68a" stroke-width="1" opacity="0.6"/>
    </svg>
  `),

  // 25. Velvet Cream Wall Finish
  creamPaintedWalls: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" width="100%" height="100%">
      <rect width="160" height="120" rx="16" fill="#fdfbf7"/>
      <!-- Outer Wall Swatch with Baseboard & Crown Molding -->
      <rect x="25" y="20" width="110" height="80" rx="4" fill="#fefce8" stroke="#fef08a" stroke-width="2"/>
      <!-- Crown Molding -->
      <rect x="22" y="16" width="116" height="8" rx="2" fill="#fef3c7" stroke="#fde68a" stroke-width="1"/>
      <!-- Soft Velvet Texture Accent Ribbons -->
      <line x1="35" y1="30" x2="35" y2="86" stroke="#fef08a" stroke-width="1.5" stroke-dasharray="4,4"/>
      <line x1="65" y1="30" x2="65" y2="86" stroke="#fef08a" stroke-width="1.5" stroke-dasharray="4,4"/>
      <line x1="95" y1="30" x2="95" y2="86" stroke="#fef08a" stroke-width="1.5" stroke-dasharray="4,4"/>
      <line x1="125" y1="30" x2="125" y2="86" stroke="#fef08a" stroke-width="1.5" stroke-dasharray="4,4"/>
      <!-- Classic White Baseboard -->
      <rect x="22" y="90" width="116" height="14" rx="2" fill="#ffffff" stroke="#e2e8f0" stroke-width="1.5"/>
    </svg>
  `),

  // 26. Soft Dove Gray Finish
  softGrayWalls: svgToDataUri(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 120" width="100%" height="100%">
      <rect width="160" height="120" rx="16" fill="#f1f5f9"/>
      <!-- Dove Gray Matte Wall Swatch -->
      <rect x="25" y="20" width="110" height="80" rx="4" fill="#e2e8f0" stroke="#cbd5e1" stroke-width="2"/>
      <!-- Modern Top Trim -->
      <rect x="22" y="16" width="116" height="6" rx="2" fill="#cbd5e1"/>
      <!-- Subtle Panel Line Accents -->
      <rect x="36" y="32" width="38" height="48" rx="2" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <rect x="86" y="32" width="38" height="48" rx="2" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <!-- White Clean Baseboard -->
      <rect x="22" y="92" width="116" height="12" rx="2" fill="#ffffff" stroke="#cbd5e1" stroke-width="1.5"/>
    </svg>
  `)
};

// ============================================================================
// 🛋️ The 26 Furniture Objects: Basic Starter Collection (20) & Home Features (6)
// ============================================================================

export const furnitureCatalog: FurnitureItem[] = [
  // --------------------------------------------------------------------------
  // 🛏️ Basic Starter Collection — Bedroom (Items 1 - 5)
  // --------------------------------------------------------------------------
  {
    id: 'furn-classic-single-bed',
    name: 'Classic Single Bed',
    category: 'furniture',
    shopCategory: 'bedroom',
    collection: 'basic',
    price: 250,
    image: SVGS.classicSingleBed,
    icon: '🛏️',
    renderType: 'classic_single_bed',
    placement: 'floor',
    size: 'large',
    description:
      'A comfortable single bed with a warm wooden frame, soft bedding, and layered pillows. A cozy foundation for any bedroom.',
    unlocked: true,
    unlockCondition: 'Free Starter Home Pack',
    unlockSource: 'starter',
    defaultScale: 1.25,
    isResizable: true,
    isRotatable: true,
    interactive: true,
    actions: ['sit', 'sleep', 'messBed', 'makeBed']
  },
  {
    id: 'furn-wooden-dresser',
    name: 'Wooden Dresser',
    category: 'furniture',
    shopCategory: 'bedroom',
    collection: 'basic',
    price: 180,
    image: SVGS.woodenDresser,
    icon: '🗄️',
    renderType: 'wooden_dresser',
    placement: 'floor',
    size: 'medium',
    description:
      'Handcrafted natural oak dresser with smooth brass pulls and roomy drawers for cozy study garments.',
    unlocked: true,
    unlockCondition: 'Free Starter Home Pack',
    unlockSource: 'starter',
    defaultScale: 1.1,
    isResizable: true,
    isRotatable: true,
    interactive: true,
    actions: ['openDrawers']
  },
  {
    id: 'furn-nightstand',
    name: 'Bedside Nightstand',
    category: 'furniture',
    shopCategory: 'bedroom',
    collection: 'basic',
    price: 120,
    image: SVGS.nightstand,
    icon: '🛏️',
    renderType: 'nightstand',
    placement: 'floor',
    size: 'small',
    description:
      'A matching bedside companion table with a quiet slide drawer and surface for nighttime reading.',
    unlocked: false,
    unlockCondition: '120 LearningCoins',
    unlockSource: 'starter',
    defaultScale: 0.95,
    isResizable: true,
    isRotatable: true,
    interactive: true,
    actions: ['openDrawers']
  },
  {
    id: 'furn-bedside-lamp',
    name: 'Warm Bedside Lamp',
    category: 'furniture',
    shopCategory: 'lighting',
    collection: 'basic',
    price: 90,
    image: SVGS.bedsideLamp,
    icon: '💡',
    renderType: 'bedside_lamp',
    placement: 'surface',
    size: 'small',
    description:
      'Pleated linen lampshade casting a gentle, soothing amber glow across your bedroom table.',
    unlocked: true,
    unlockCondition: 'Free Starter Home Pack',
    unlockSource: 'starter',
    defaultScale: 0.85,
    isResizable: true,
    isRotatable: true,
    interactive: true,
    actions: ['turnOn', 'turnOff']
  },
  {
    id: 'furn-standing-mirror',
    name: 'Standing Mirror',
    category: 'furniture',
    shopCategory: 'bedroom',
    collection: 'basic',
    price: 140,
    image: SVGS.standingMirror,
    icon: '🪞',
    renderType: 'standing_mirror',
    placement: 'floor',
    size: 'medium',
    description:
      'An arched honey-oak standing mirror with crystal glass reflecting the bright morning light.',
    unlocked: false,
    unlockCondition: '140 LearningCoins',
    unlockSource: 'starter',
    defaultScale: 1.1,
    isResizable: true,
    isRotatable: true,
    interactive: true,
    actions: ['relax']
  },

  // --------------------------------------------------------------------------
  // 🛋️ Basic Starter Collection — Living Room (Items 6 - 10)
  // --------------------------------------------------------------------------
  {
    id: 'furn-two-seat-sofa',
    name: 'Two-Seat Linen Sofa',
    category: 'furniture',
    shopCategory: 'living_room',
    collection: 'basic',
    price: 300,
    image: SVGS.twoSeatSofa,
    icon: '🛋️',
    renderType: 'two_seat_sofa',
    placement: 'floor',
    size: 'large',
    description:
      'Deep cushioned two-seater sofa in warm woven oatmeal fabric with supportive armrests and accent cushions.',
    unlocked: false,
    unlockCondition: '300 LearningCoins',
    unlockSource: 'starter',
    defaultScale: 1.35,
    isResizable: true,
    isRotatable: true,
    interactive: true,
    actions: ['sit', 'relax']
  },
  {
    id: 'furn-coffee-table',
    name: 'Oak Coffee Table',
    category: 'furniture',
    shopCategory: 'living_room',
    collection: 'basic',
    price: 150,
    image: SVGS.coffeeTable,
    icon: '🪵',
    renderType: 'coffee_table',
    placement: 'floor',
    size: 'medium',
    description:
      'Smooth oval coffee table made from natural light timber, perfect for holding tea and flashcard decks.',
    unlocked: false,
    unlockCondition: '150 LearningCoins',
    unlockSource: 'starter',
    defaultScale: 1.1,
    isResizable: true,
    isRotatable: true,
    interactive: true,
    actions: ['relax']
  },
  {
    id: 'furn-armchair',
    name: 'Cozy Armchair',
    category: 'furniture',
    shopCategory: 'living_room',
    collection: 'basic',
    price: 160,
    image: SVGS.armchair,
    icon: '🪑',
    renderType: 'armchair',
    placement: 'floor',
    size: 'medium',
    description:
      'Plush single armchair with rounded back support, inviting long afternoons of comfortable reading.',
    unlocked: true,
    unlockCondition: 'Free Starter Home Pack',
    unlockSource: 'starter',
    defaultScale: 1.15,
    isResizable: true,
    isRotatable: true,
    interactive: true,
    actions: ['sit', 'relax']
  },
  {
    id: 'furn-side-table',
    name: 'Round Side Table',
    category: 'furniture',
    shopCategory: 'living_room',
    collection: 'basic',
    price: 100,
    image: SVGS.sideTable,
    icon: '🪵',
    renderType: 'side_table',
    placement: 'floor',
    size: 'small',
    description:
      'Slender tripod side table crafted from natural beech wood to accompany sofas and chairs.',
    unlocked: false,
    unlockCondition: '100 LearningCoins',
    unlockSource: 'starter',
    defaultScale: 0.9,
    isResizable: true,
    isRotatable: true,
    interactive: false
  },
  {
    id: 'decor-indoor-plant',
    name: 'Indoor Fiddle Fig',
    category: 'decoration',
    shopCategory: 'decorations',
    collection: 'basic',
    price: 80,
    image: SVGS.indoorPlant,
    icon: '🪴',
    renderType: 'indoor_plant',
    placement: 'floor',
    size: 'medium',
    description:
      'Broad glossy leaves rising out of a clean white ceramic cylinder pot that freshens the room.',
    unlocked: false,
    unlockCondition: '80 LearningCoins',
    unlockSource: 'starter',
    defaultScale: 1.1,
    isResizable: true,
    isRotatable: true,
    interactive: true,
    actions: ['waterPlant']
  },

  // --------------------------------------------------------------------------
  // 📚 Basic Starter Collection — Reading & Study (Items 11 - 15)
  // --------------------------------------------------------------------------
  {
    id: 'furn-small-bookshelf',
    name: 'Small Bookshelf',
    category: 'furniture',
    shopCategory: 'reading_study',
    collection: 'basic',
    price: 200,
    image: SVGS.smallBookshelf,
    icon: '📚',
    renderType: 'small_bookshelf',
    placement: 'floor',
    size: 'medium',
    description:
      'Sturdy two-shelf natural pine bookcase brimming with vocabulary guides, classic adventures, and tales.',
    unlocked: true,
    unlockCondition: 'Free Starter Home Pack',
    unlockSource: 'starter',
    defaultScale: 1.25,
    isResizable: true,
    isRotatable: true,
    interactive: true,
    actions: ['browseBooks', 'read'],
    interactiveType: 'reading_corner',
    interactiveData: {
      title: 'Small Bookshelf',
      description: 'Review your reading book tracker and offline logs.',
      targetSection: 'reading_adventure'
    }
  },
  {
    id: 'furn-reading-chair',
    name: 'Velvet Reading Chair',
    category: 'furniture',
    shopCategory: 'reading_study',
    collection: 'basic',
    price: 220,
    image: SVGS.readingChair,
    icon: '📖',
    renderType: 'reading_chair',
    placement: 'floor',
    size: 'medium',
    description:
      'High winged backrest upholstered in soothing sage velvet, ergonomically shaped for studying.',
    unlocked: false,
    unlockCondition: '220 LearningCoins',
    unlockSource: 'starter',
    defaultScale: 1.2,
    isResizable: true,
    isRotatable: true,
    interactive: true,
    actions: ['sit', 'read']
  },
  {
    id: 'furn-reading-floor-lamp',
    name: 'Arc Reading Floor Lamp',
    category: 'furniture',
    shopCategory: 'lighting',
    collection: 'basic',
    price: 130,
    image: SVGS.readingFloorLamp,
    icon: '💡',
    renderType: 'floor_lamp',
    placement: 'floor',
    size: 'medium',
    description:
      'Brushed brass gooseneck lamp arching gently over your book to provide soft, glare-free light.',
    unlocked: false,
    unlockCondition: '130 LearningCoins',
    unlockSource: 'starter',
    defaultScale: 1.1,
    isResizable: true,
    isRotatable: true,
    interactive: true,
    actions: ['turnOn', 'turnOff']
  },
  {
    id: 'furn-study-desk',
    name: 'Timber Study Desk',
    category: 'furniture',
    shopCategory: 'reading_study',
    collection: 'basic',
    price: 240,
    image: SVGS.studyDesk,
    icon: '✏️',
    renderType: 'study_desk',
    placement: 'floor',
    size: 'large',
    description:
      'Smooth wooden desktop equipped with pen cubbies and stationery drawer for spelling practice.',
    unlocked: false,
    unlockCondition: '240 LearningCoins',
    unlockSource: 'starter',
    defaultScale: 1.3,
    isResizable: true,
    isRotatable: true,
    interactive: true,
    actions: ['read'],
    interactiveType: 'knowledge_desk',
    interactiveData: {
      title: 'Study Desk',
      description: 'Practice today’s vocabulary and flashcard lessons.',
      targetSection: 'daily_adventure'
    }
  },
  {
    id: 'furn-desk-chair',
    name: 'Padded Desk Chair',
    category: 'furniture',
    shopCategory: 'reading_study',
    collection: 'basic',
    price: 110,
    image: SVGS.deskChair,
    icon: '🪑',
    renderType: 'desk_chair',
    placement: 'floor',
    size: 'small',
    description:
      'Curved ergonomic backrest with natural cotton cushion, tailored for concentration and good posture.',
    unlocked: false,
    unlockCondition: '110 LearningCoins',
    unlockSource: 'starter',
    defaultScale: 1.0,
    isResizable: true,
    isRotatable: true,
    interactive: true,
    actions: ['sit']
  },

  // --------------------------------------------------------------------------
  // 🌿 Basic Starter Collection — Decorations (Items 16 - 20)
  // --------------------------------------------------------------------------
  {
    id: 'decor-picture-frame',
    name: 'Golden Frame Wall Art',
    category: 'decoration',
    shopCategory: 'decorations',
    collection: 'basic',
    price: 70,
    image: SVGS.pictureFrame,
    icon: '🖼️',
    renderType: 'picture_frame',
    placement: 'wall',
    size: 'small',
    description:
      'A warm oak picture frame depicting gentle rolling meadows under a pastel morning sky.',
    unlocked: false,
    unlockCondition: '70 LearningCoins',
    unlockSource: 'starter',
    defaultScale: 1.0,
    isResizable: true,
    isRotatable: false,
    interactive: false
  },
  {
    id: 'decor-small-potted-plant',
    name: 'Small Ceramic Succulent',
    category: 'decoration',
    shopCategory: 'decorations',
    collection: 'basic',
    price: 60,
    image: SVGS.smallPottedPlant,
    icon: '🌿',
    renderType: 'small_potted_plant',
    placement: 'surface',
    size: 'small',
    description:
      'A plump green jade succulent nested in a hand-thrown speckled ceramic pot with drainage saucer.',
    unlocked: true,
    unlockCondition: 'Free Starter Home Pack',
    unlockSource: 'starter',
    defaultScale: 0.85,
    isResizable: true,
    isRotatable: true,
    interactive: true,
    actions: ['waterPlant']
  },
  {
    id: 'decor-decorative-candle',
    name: 'Vanilla Pillar Candle',
    category: 'decoration',
    shopCategory: 'decorations',
    collection: 'basic',
    price: 50,
    image: SVGS.decorativeCandle,
    icon: '🕯️',
    renderType: 'decorative_candle',
    placement: 'surface',
    size: 'small',
    description:
      'Pure honeycomb beeswax pillar candle casting a warm gentle flicker that relaxes busy minds.',
    unlocked: false,
    unlockCondition: '50 LearningCoins',
    unlockSource: 'starter',
    defaultScale: 0.8,
    isResizable: true,
    isRotatable: true,
    interactive: true,
    actions: ['turnOn', 'turnOff']
  },
  {
    id: 'decor-stack-of-books',
    name: 'Storybook Stack',
    category: 'decoration',
    shopCategory: 'decorations',
    collection: 'basic',
    price: 65,
    image: SVGS.stackOfBooks,
    icon: '📚',
    renderType: 'stack_of_books',
    placement: 'surface',
    size: 'small',
    description:
      'Three cloth-bound hardcover books stacked neatly with silk bookmark ribbons peeking out.',
    unlocked: false,
    unlockCondition: '65 LearningCoins',
    unlockSource: 'starter',
    defaultScale: 0.85,
    isResizable: true,
    isRotatable: true,
    interactive: true,
    actions: ['browseBooks']
  },
  {
    id: 'decor-bunny-plush',
    name: 'Soft Bunny Plushie',
    category: 'decoration',
    shopCategory: 'decorations',
    collection: 'basic',
    price: 95,
    image: SVGS.bunnyPlush,
    icon: '🧸',
    renderType: 'bunny_plush',
    placement: 'surface',
    size: 'small',
    description:
      'A stitched velvet bunny with floppy ears and a knit collar that loves sitting near your pillows.',
    unlocked: false,
    unlockCondition: '95 LearningCoins',
    unlockSource: 'starter',
    defaultScale: 0.9,
    isResizable: true,
    isRotatable: true,
    interactive: true,
    actions: ['relax']
  },

  // --------------------------------------------------------------------------
  // 🏠 Home Features — Windows, Doors, Walls & Floors (Items 21 - 26)
  // --------------------------------------------------------------------------
  {
    id: 'furn-classic-window',
    name: 'Classic Mullion Window',
    category: 'furniture',
    shopCategory: 'windows_doors',
    collection: 'basic',
    price: 150,
    image: SVGS.classicWindow,
    icon: '🪟',
    renderType: 'classic_window',
    placement: 'wall',
    size: 'medium',
    description:
      'Four-pane white wooden window framing garden sunshine, blue skies, and gentle breezes.',
    unlocked: false,
    unlockCondition: '150 LearningCoins',
    unlockSource: 'starter',
    defaultScale: 1.2,
    isResizable: true,
    isRotatable: false,
    interactive: true,
    actions: ['openWindow', 'closeWindow']
  },
  {
    id: 'furn-cream-curtains',
    name: 'Linen Cream Curtains',
    category: 'furniture',
    shopCategory: 'windows_doors',
    collection: 'basic',
    price: 110,
    image: SVGS.creamCurtains,
    icon: '🤍',
    renderType: 'cream_curtains',
    placement: 'wall',
    size: 'medium',
    description:
      'Natural flowing cream drapes tied with soft wooden rings that filter the afternoon sun.',
    unlocked: false,
    unlockCondition: '110 LearningCoins',
    unlockSource: 'starter',
    defaultScale: 1.15,
    isResizable: true,
    isRotatable: false,
    interactive: true,
    actions: ['openWindow', 'closeWindow']
  },
  {
    id: 'furn-classic-interior-door',
    name: 'Classic Paneled Door',
    category: 'furniture',
    shopCategory: 'windows_doors',
    collection: 'basic',
    price: 160,
    image: SVGS.classicInteriorDoor,
    icon: '🚪',
    renderType: 'interior_door',
    placement: 'wall',
    size: 'large',
    description:
      'Traditional four-panel white interior door with a warm antiqued brass latch knob.',
    unlocked: false,
    unlockCondition: '160 LearningCoins',
    unlockSource: 'starter',
    defaultScale: 1.35,
    isResizable: true,
    isRotatable: false,
    interactive: true,
    actions: ['openDoor', 'closeDoor']
  },
  {
    id: 'furn-natural-hardwood-floor',
    name: 'Natural Hardwood Planks',
    category: 'furniture',
    shopCategory: 'walls_floors',
    collection: 'basic',
    price: 180,
    image: SVGS.naturalHardwoodFloor,
    icon: '🪵',
    renderType: 'hardwood_floor',
    placement: 'floor',
    size: 'large',
    description:
      'Hand-finished honey oak floorboards with natural knots and grain that warm any miniature room.',
    unlocked: false,
    unlockCondition: '180 LearningCoins',
    unlockSource: 'starter',
    defaultScale: 1.0,
    isResizable: false,
    isRotatable: false,
    interactive: false
  },
  {
    id: 'furn-cream-painted-walls',
    name: 'Velvet Cream Wall Finish',
    category: 'furniture',
    shopCategory: 'walls_floors',
    collection: 'basic',
    price: 120,
    image: SVGS.creamPaintedWalls,
    icon: '🤍',
    renderType: 'cream_walls',
    placement: 'wall',
    size: 'large',
    description:
      'Soft eggshell cream pigment that provides a warm, comforting interior backdrop.',
    unlocked: false,
    unlockCondition: '120 LearningCoins',
    unlockSource: 'starter',
    defaultScale: 1.0,
    isResizable: false,
    isRotatable: false,
    interactive: false
  },
  {
    id: 'furn-soft-gray-walls',
    name: 'Soft Dove Gray Finish',
    category: 'furniture',
    shopCategory: 'walls_floors',
    collection: 'basic',
    price: 120,
    image: SVGS.softGrayWalls,
    icon: '🩶',
    renderType: 'gray_walls',
    placement: 'wall',
    size: 'large',
    description:
      'Peaceful light neutral gray tone creating an elegant, calm, modern dollhouse atmosphere.',
    unlocked: false,
    unlockCondition: '120 LearningCoins',
    unlockSource: 'starter',
    defaultScale: 1.0,
    isResizable: false,
    isRotatable: false,
    interactive: false
  }
];

// Re-export alias for convenience
export const FURNITURE_CATALOG = furnitureCatalog;

/**
 * Get a catalog furniture item by its unique ID
 */
export function getFurnitureById(id: string): FurnitureItem | undefined {
  return furnitureCatalog.find((item) => item.id === id);
}

/**
 * Get all furniture items in a specific shop category
 */
export function getFurnitureByCategory(category: ShopCategory): FurnitureItem[] {
  return furnitureCatalog.filter((item) => item.shopCategory === category);
}

/**
 * Get the initial free starter pack furniture items
 */
export function getStarterFurnitureItems(): FurnitureItem[] {
  return furnitureCatalog.filter((item) => item.unlocked);
}

export default furnitureCatalog;
