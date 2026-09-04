import React from 'react';
import { BEANIE_COLORS } from '../../data/themes';

/**
 * Pure SVG vector accessories designed specifically to physically fit and attach to Pip's body.
 * Coordinate space: viewBox="0 0 100 100"
 * Head apex: (50, 16)
 * Eyes: Left (38, 48), Right (62, 48)
 * Forehead: (50, 32)
 */
export default function PipAccessories({ hatId = 'none', beanieColorId = 'pink' }) {
  const selectedBeanie = BEANIE_COLORS.find(b => b.id === beanieColorId) || BEANIE_COLORS[2]; // default pink

  switch (hatId) {
    // -------------------------------------------------------------------------
    // 1. 🌿 Natural Sprouting Leaf
    // -------------------------------------------------------------------------
    case 'none':
    case 'leaf':
      return (
        <g id="pip-acc-leaf">
          {/* Organic green stem emerging directly from head apex (50, 16) */}
          <path
            d="M 50 16 Q 48 9, 42 6"
            stroke="#2d6a4f"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Main Leaf blade sprouting left */}
          <path
            d="M 42 6 C 30 1, 22 7, 34 13 C 40 11, 42 7, 42 6 Z"
            fill="#40916c"
          />
          {/* Leaf vein */}
          <path
            d="M 42 6 Q 33 6, 26 7"
            stroke="#74c69d"
            strokeWidth="1"
            strokeLinecap="round"
            fill="none"
          />
          {/* Smaller secondary leaf sprouting right */}
          <path
            d="M 47 11 C 55 7, 62 10, 56 16 C 50 14, 48 12, 47 11 Z"
            fill="#52b788"
          />
        </g>
      );

    // -------------------------------------------------------------------------
    // 2. 🌼 Daisy Crown
    // -------------------------------------------------------------------------
    case 'flower':
    case 'daisy':
      return (
        <g id="pip-acc-daisy">
          {/* Stem connected to head (50, 16) */}
          <path
            d="M 50 16 Q 49 11, 50 7"
            stroke="#2d6a4f"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Tiny leaf on stem */}
          <path
            d="M 50 12 Q 55 10, 58 12 Q 54 14, 50 13 Z"
            fill="#52b788"
          />
          {/* Radiating 8 white petals centered at (50, 7) */}
          <g transform="translate(50, 7)">
            {[0, 45, 90, 135, 180, 225, 270, 315].map((deg, i) => (
              <path
                key={i}
                d="M -2.5 -7 C -2.5 -10, 2.5 -10, 2.5 -7 C 2.5 -4, -2.5 -4, -2.5 -7 Z"
                fill="#ffffff"
                stroke="#e2e8f0"
                strokeWidth="0.6"
                transform={`rotate(${deg})`}
              />
            ))}
            {/* Daisy golden center */}
            <circle cx="0" cy="0" r="4.2" fill="#ffb703" />
            <circle cx="0" cy="0" r="2.2" fill="#fb8500" opacity="0.8" />
          </g>
        </g>
      );

    // -------------------------------------------------------------------------
    // 3. 🌻 Golden Sunflower
    // -------------------------------------------------------------------------
    case 'sunflower':
      return (
        <g id="pip-acc-sunflower">
          {/* Stem connected to head apex */}
          <path
            d="M 50 16 Q 51 10, 50 6"
            stroke="#2d6a4f"
            strokeWidth="2.8"
            strokeLinecap="round"
            fill="none"
          />
          {/* Sunflower leaf */}
          <path
            d="M 50 12 Q 44 9, 41 12 Q 45 15, 50 13 Z"
            fill="#40916c"
          />
          {/* 12 pointed golden petals radiating around (50, 6) */}
          <g transform="translate(50, 6)">
            {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
              <path
                key={i}
                d="M 0 -9.5 L 2.5 -4.5 L -2.5 -4.5 Z"
                fill="#ffb703"
                stroke="#fb8500"
                strokeWidth="0.5"
                transform={`rotate(${deg})`}
              />
            ))}
            {/* Rich brown seed disk */}
            <circle cx="0" cy="0" r="5" fill="#582f0e" />
            <circle cx="0" cy="0" r="3.2" fill="#7f4f24" />
            <circle cx="-1.5" cy="-1.5" r="0.7" fill="#ddb892" opacity="0.7" />
            <circle cx="1.5" cy="1.2" r="0.7" fill="#ddb892" opacity="0.7" />
          </g>
        </g>
      );

    // -------------------------------------------------------------------------
    // 4. 🌷 Spring Tulip
    // -------------------------------------------------------------------------
    case 'tulip':
      return (
        <g id="pip-acc-tulip">
          {/* Graceful curved stem connected to head */}
          <path
            d="M 50 16 Q 49 11, 50 8"
            stroke="#2d6a4f"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* Tulip leaf */}
          <path
            d="M 50 14 Q 57 10, 61 14 Q 56 16, 50 15 Z"
            fill="#52b788"
          />
          {/* Layered Tulip Cup Bloom at (50, 4) */}
          <g transform="translate(50, 5)">
            {/* Left petal */}
            <path
              d="M 0 4 C -7 4, -9 -4, -3 -6 C 0 -1, 0 4, 0 4 Z"
              fill="#ff5d8f"
            />
            {/* Right petal */}
            <path
              d="M 0 4 C 7 4, 9 -4, 3 -6 C 0 -1, 0 4, 0 4 Z"
              fill="#ff758f"
            />
            {/* Center crown petal */}
            <path
              d="M -3 3 C -3 -7, 3 -7, 3 3 Z"
              fill="#ff4d6d"
            />
          </g>
        </g>
      );

    // -------------------------------------------------------------------------
    // 5. 🌸 Cherry Blossom (Sakura)
    // -------------------------------------------------------------------------
    case 'sakura':
      return (
        <g id="pip-acc-sakura">
          {/* Little twig connected to head */}
          <path
            d="M 50 16 Q 48 10, 50 7"
            stroke="#6c584c"
            strokeWidth="2.2"
            strokeLinecap="round"
            fill="none"
          />
          {/* 5-petal Sakura bloom with notched petal tips */}
          <g transform="translate(50, 7)">
            {[0, 72, 144, 216, 288].map((deg, i) => (
              <path
                key={i}
                d="M -3 -3.5 C -4.5 -6.5, -2 -8, 0 -7 C 2 -8, 4.5 -6.5, 3 -3.5 Z"
                fill="#ffb3c6"
                stroke="#ff8fab"
                strokeWidth="0.5"
                transform={`rotate(${deg})`}
              />
            ))}
            {/* Center pistil detail */}
            <circle cx="0" cy="0" r="2.2" fill="#c9184a" />
            <circle cx="-0.8" cy="-0.8" r="0.6" fill="#ffd166" />
            <circle cx="0.8" cy="-0.8" r="0.6" fill="#ffd166" />
            <circle cx="0" cy="0.9" r="0.6" fill="#ffd166" />
          </g>
        </g>
      );

    // -------------------------------------------------------------------------
    // 6. 🌹 Crimson Rose
    // -------------------------------------------------------------------------
    case 'rose':
      return (
        <g id="pip-acc-rose">
          {/* Green stem with tiny leaf */}
          <path
            d="M 50 16 Q 49 11, 50 8"
            stroke="#2d6a4f"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 50 13 Q 44 11, 41 13 Q 45 16, 50 14 Z"
            fill="#40916c"
          />
          {/* Velvety spiral rosebud at (50, 6) */}
          <g transform="translate(50, 6)">
            {/* Sepal base */}
            <path d="M -4 3 Q 0 5, 4 3 L 0 0 Z" fill="#2d6a4f" />
            {/* Outer petals */}
            <circle cx="0" cy="-1" r="5.5" fill="#d90429" />
            {/* Inner layered petals */}
            <path
              d="M -4 -2 C -4 -5, 0 -6, 4 -4 C 3 0, -2 0, -4 -2 Z"
              fill="#ef233c"
            />
            <path
              d="M 3 -1 C 3 -4, -1 -5, -3 -3 C -1 1, 2 1, 3 -1 Z"
              fill="#ff4d6d"
            />
            {/* Rose center bud */}
            <ellipse cx="0" cy="-2" rx="1.8" ry="1.4" fill="#a0001e" />
          </g>
        </g>
      );

    // -------------------------------------------------------------------------
    // 7. 🌺 Tropical Hibiscus
    // -------------------------------------------------------------------------
    case 'hibiscus':
      return (
        <g id="pip-acc-hibiscus">
          {/* Little green base on head */}
          <path
            d="M 50 16 Q 49 11, 50 7"
            stroke="#2d6a4f"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
          />
          {/* 5 large wavy petals */}
          <g transform="translate(50, 7)">
            {[0, 72, 144, 216, 288].map((deg, i) => (
              <path
                key={i}
                d="M -3.5 -3 C -6 -6.5, 0 -9.5, 0 -8 C 0 -9.5, 6 -6.5, 3.5 -3 Z"
                fill="#f72585"
                stroke="#b5179e"
                strokeWidth="0.5"
                transform={`rotate(${deg})`}
              />
            ))}
            {/* Center deep glow */}
            <circle cx="0" cy="0" r="2.8" fill="#7209b7" />
            {/* Arching golden stamen */}
            <path
              d="M 0 0 Q 3 -5, 5 -8"
              stroke="#ffd166"
              strokeWidth="1.4"
              strokeLinecap="round"
              fill="none"
            />
            <circle cx="5" cy="-8" r="0.9" fill="#e76f51" />
            <circle cx="4.2" cy="-6.5" r="0.6" fill="#ffd166" />
          </g>
        </g>
      );

    // -------------------------------------------------------------------------
    // 8. 🧶 Cozy Knitted Beanie (With Custom Colors)
    // -------------------------------------------------------------------------
    case 'beanie':
      return (
        <g id="pip-acc-beanie">
          {/* Beanie main dome covering upper head */}
          <path
            d="M 23 28 C 23 7, 77 7, 77 28 C 65 30, 35 30, 23 28 Z"
            fill={selectedBeanie.hex}
            stroke="rgba(0,0,0,0.12)"
            strokeWidth="1"
          />
          {/* Knitted vertical texture ribs on dome */}
          <path d="M 33 15 Q 33 22, 33 27" stroke="rgba(0,0,0,0.1)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <path d="M 41 11 Q 41 20, 41 27" stroke="rgba(0,0,0,0.1)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <path d="M 50 9 Q 50 19, 50 27" stroke="rgba(0,0,0,0.1)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <path d="M 59 11 Q 59 20, 59 27" stroke="rgba(0,0,0,0.1)" strokeWidth="1.2" strokeLinecap="round" fill="none" />
          <path d="M 67 15 Q 67 22, 67 27" stroke="rgba(0,0,0,0.1)" strokeWidth="1.2" strokeLinecap="round" fill="none" />

          {/* Folded knitted cuff */}
          <rect
            x="21"
            y="24"
            width="58"
            height="8"
            rx="3.5"
            fill={selectedBeanie.cuffHex}
            stroke="rgba(0,0,0,0.15)"
            strokeWidth="0.8"
          />
          {/* Ribbed notches on cuff */}
          {[27, 33, 39, 45, 51, 57, 63, 69, 73].map(x => (
            <line
              key={x}
              x1={x}
              y1="25.5"
              x2={x}
              y2="30.5"
              stroke="rgba(0,0,0,0.15)"
              strokeWidth="1"
              strokeLinecap="round"
            />
          ))}

          {/* Fluffy pom-pom on top */}
          <circle cx="50" cy="7" r="5.5" fill={selectedBeanie.pompomHex} stroke="rgba(0,0,0,0.1)" strokeWidth="0.8" />
          <circle cx="48" cy="5.5" r="2.5" fill="#ffffff" opacity="0.6" />
          <circle cx="52" cy="8" r="2" fill="rgba(0,0,0,0.06)" />
        </g>
      );

    // -------------------------------------------------------------------------
    // 9. 🧙 Starry Wizard Hat
    // -------------------------------------------------------------------------
    case 'wizard':
      return (
        <g id="pip-acc-wizard">
          {/* Wide curved brim sitting on head */}
          <ellipse
            cx="50"
            cy="24"
            rx="30"
            ry="4.5"
            fill="#3a0ca3"
            stroke="#240046"
            strokeWidth="1"
          />

          {/* Pointed cone with cozy bent tip */}
          <path
            d="M 28 23 C 34 14, 44 2, 60 -4 C 54 2, 62 14, 72 23 Z"
            fill="#560bad"
            stroke="#3a0ca3"
            strokeWidth="0.8"
          />

          {/* Golden hat ribbon band */}
          <path
            d="M 28 21 C 35 18, 65 18, 72 21 L 72 24.5 C 65 21.5, 35 21.5, 28 24.5 Z"
            fill="#ffb703"
          />
          {/* Golden buckle */}
          <rect x="46.5" y="19" width="7" height="5" rx="1.2" fill="#ffd166" stroke="#fb8500" strokeWidth="0.6" />

          {/* Decorative glowing stars & crescent moon */}
          {/* Crescent Moon on cone */}
          <path
            d="M 44 8 C 42 6, 42 3, 44 1 C 41 2, 41 7, 44 8 Z"
            fill="#ffd166"
          />
          {/* Golden star 1 */}
          <path
            d="M 52 4 L 53 6 L 55 6 L 53.5 7 L 54 9 L 52 7.5 L 50 9 L 50.5 7 L 49 6 L 51 6 Z"
            fill="#ffd166"
            transform="scale(0.8) translate(14, 1)"
          />
          {/* Golden star 2 */}
          <circle cx="38" cy="14" r="1" fill="#ffd166" />
          <circle cx="58" cy="12" r="0.9" fill="#ffd166" />
        </g>
      );

    // -------------------------------------------------------------------------
    // 10. 🏋️ Workout Sweatband
    // -------------------------------------------------------------------------
    case 'headband':
      return (
        <g id="pip-acc-headband">
          {/* Athletic headband wrapping around forehead (y: 28 to 36) */}
          <path
            d="M 20 28 C 30 26, 70 26, 80 28 L 80 36 C 70 34, 30 34, 20 36 Z"
            fill="#e63946"
            stroke="#c1121f"
            strokeWidth="0.8"
          />
          {/* Dual white sporty racing stripes */}
          <path
            d="M 20 31 C 30 29, 70 29, 80 31"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M 20 33.5 C 30 31.5, 70 31.5, 80 33.5"
            stroke="#ffffff"
            strokeWidth="1.5"
            strokeLinecap="round"
            fill="none"
          />
        </g>
      );

    // -------------------------------------------------------------------------
    // 11. 👨‍🍳 Chef Hat (Toque)
    // -------------------------------------------------------------------------
    case 'chef':
      return (
        <g id="pip-acc-chef">
          {/* Puffed white cloud crown */}
          <path
            d="M 28 18 C 16 11, 20 -7, 38 -5 C 43 -14, 57 -14, 62 -5 C 80 -7, 84 11, 72 18 Z"
            fill="#ffffff"
            stroke="#cbd5e1"
            strokeWidth="1"
          />
          {/* Gentle vertical pleats */}
          <path d="M 38 18 C 38 8, 40 0, 42 -2" stroke="#e2e8f0" strokeWidth="1.3" strokeLinecap="round" fill="none" />
          <path d="M 50 18 C 50 6, 50 -3, 50 -5" stroke="#e2e8f0" strokeWidth="1.3" strokeLinecap="round" fill="none" />
          <path d="M 62 18 C 62 8, 60 0, 58 -2" stroke="#e2e8f0" strokeWidth="1.3" strokeLinecap="round" fill="none" />

          {/* Lower band sitting snugly on head */}
          <rect
            x="29"
            y="17"
            width="42"
            height="6"
            rx="2.5"
            fill="#f8fafc"
            stroke="#cbd5e1"
            strokeWidth="1"
          />
        </g>
      );

    // -------------------------------------------------------------------------
    // 12. 👓 Smart Reading Glasses (Aligned directly with eyes: x: 38 & 62, y: 48)
    // -------------------------------------------------------------------------
    case 'glasses':
      return (
        <g id="pip-acc-glasses">
          {/* Left Frame */}
          <rect
            x="27"
            y="39"
            width="22"
            height="18"
            rx="7"
            fill="rgba(255, 255, 255, 0.25)"
            stroke="#2b2d42"
            strokeWidth="2.4"
          />
          {/* Right Frame */}
          <rect
            x="51"
            y="39"
            width="22"
            height="18"
            rx="7"
            fill="rgba(255, 255, 255, 0.25)"
            stroke="#2b2d42"
            strokeWidth="2.4"
          />
          {/* Nose Bridge */}
          <path
            d="M 49 47 Q 50 44, 51 47"
            stroke="#2b2d42"
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />
          {/* Left Temple Arm */}
          <path
            d="M 27 46 L 16 43"
            stroke="#2b2d42"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Right Temple Arm */}
          <path
            d="M 73 46 L 84 43"
            stroke="#2b2d42"
            strokeWidth="2"
            strokeLinecap="round"
          />
          {/* Glass Glint Reflections */}
          <path d="M 31 42 L 36 51" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" opacity="0.75" />
          <path d="M 55 42 L 60 51" stroke="#ffffff" strokeWidth="1.4" strokeLinecap="round" opacity="0.75" />
        </g>
      );

    // -------------------------------------------------------------------------
    // 13. 🕶️ Cool Sunglasses
    // -------------------------------------------------------------------------
    case 'sunglasses':
      return (
        <g id="pip-acc-sunglasses">
          {/* Left Dark Tinted Lens */}
          <rect
            x="27"
            y="39"
            width="22"
            height="18"
            rx="6"
            fill="#1e293b"
            stroke="#0f172a"
            strokeWidth="2.4"
          />
          {/* Right Dark Tinted Lens */}
          <rect
            x="51"
            y="39"
            width="22"
            height="18"
            rx="6"
            fill="#1e293b"
            stroke="#0f172a"
            strokeWidth="2.4"
          />
          {/* Nose Bridge */}
          <path
            d="M 49 45 L 51 45"
            stroke="#0f172a"
            strokeWidth="3"
            strokeLinecap="round"
          />
          {/* Left Temple Arm */}
          <path
            d="M 27 45 L 16 43"
            stroke="#0f172a"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          {/* Right Temple Arm */}
          <path
            d="M 73 45 L 84 43"
            stroke="#0f172a"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
          {/* Cool White Slash Glint */}
          <path d="M 31 42 L 39 53" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
          <path d="M 55 42 L 63 53" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        </g>
      );

    // -------------------------------------------------------------------------
    // 14. 😇 Golden Halo
    // -------------------------------------------------------------------------
    case 'halo':
      return (
        <g id="pip-acc-halo">
          {/* Soft outer glow */}
          <ellipse
            cx="50"
            cy="5"
            rx="25"
            ry="6.5"
            fill="none"
            stroke="#ffd166"
            strokeWidth="4"
            opacity="0.35"
          />
          {/* Main Golden Halo Ring */}
          <ellipse
            cx="50"
            cy="5"
            rx="23"
            ry="5.5"
            fill="none"
            stroke="#ffb703"
            strokeWidth="2.8"
          />
          {/* Sparkle star left */}
          <circle cx="25" cy="4" r="1.2" fill="#ffd166" />
          <path d="M 25 1.5 L 25 6.5 M 22.5 4 L 27.5 4" stroke="#ffd166" strokeWidth="0.8" strokeLinecap="round" />
          {/* Sparkle star right */}
          <circle cx="75" cy="6" r="1.2" fill="#ffd166" />
          <path d="M 75 3.5 L 75 8.5 M 72.5 6 L 77.5 6" stroke="#ffd166" strokeWidth="0.8" strokeLinecap="round" />
        </g>
      );

    default:
      return null;
  }
}
