import React from 'react';

interface HomeLifeLogoProps {
  className?: string;
  variant?: 'color' | 'monochrome' | 'gold-white';
  withBackground?: boolean;
}

export default function HomeLifeLogo({ 
  className = 'w-full max-w-[280px]', 
  variant = 'color',
  withBackground = true
}: HomeLifeLogoProps) {
  // Color configuration based on variants
  const getColors = () => {
    switch (variant) {
      case 'monochrome':
        return {
          starPrimary: '#cbd5e1', // slate-300
          starSecondary: '#94a3b8', // slate-400
          boxLine: '#cbd5e1',
          textHomeLife: '#ffffff',
          textStandards: '#94a3b8',
        };
      case 'gold-white':
        return {
          starPrimary: '#fbbf24', // amber-400
          starSecondary: '#f59e0b', // amber-500
          boxLine: '#d97706', // amber-600
          textHomeLife: '#ffffff',
          textStandards: '#cbd5e1', // slate-300
        };
      case 'color':
      default:
        return {
          starPrimary: '#fbbf24', // bright shiny gold star
          starSecondary: '#f59e0b', // rich gold star shadow
          boxLine: '#94a3b8', // sophisticated gray/silver brackets
          textHomeLife: '#10b981', // brand-aligned vibrant green
          textStandards: '#cbd5e1', // silver tagline text
        };
    }
  };

  const colors = getColors();

  const svgContent = (
    <svg
      viewBox="0 0 600 240"
      className="w-full h-full"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="HomeLife Higher Standards Logo"
    >
      {/* Gradients for stars */}
      <defs>
        <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fef08a" /> {/* bright highlight */}
          <stop offset="30%" stopColor={colors.starPrimary} />
          <stop offset="100%" stopColor={colors.starSecondary} />
        </linearGradient>
        <filter id="subtleDropShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2.5" floodColor="#000000" floodOpacity="0.25" />
        </filter>
      </defs>

      {/* Five Golden Stars arranged in an elegant curve */}
      <g filter="url(#subtleDropShadow)">
        {/* Star 1 (Far Left) - Center approx (110, 75) */}
        <polygon
          points="110,55 114,67 126,67 116,75 120,87 110,80 100,87 104,75 94,67 106,67"
          fill="url(#goldGradient)"
        />
        {/* Star 2 (Middle Left) - Center approx (200, 48) */}
        <polygon
          points="200,24 206,40 222,40 209,51 214,67 200,58 186,67 191,51 178,40 194,40"
          fill="url(#goldGradient)"
        />
        {/* Star 3 (Center - Largest) - Center approx (300, 38) */}
        <polygon
          points="300,2 309,24 332,24 314,39 320,62 300,49 280,62 286,39 268,24 291,24"
          fill="url(#goldGradient)"
        />
        {/* Star 4 (Middle Right) - Center approx (400, 48) */}
        <polygon
          points="400,24 406,40 422,40 409,51 414,67 400,58 386,67 391,51 378,40 394,40"
          fill="url(#goldGradient)"
        />
        {/* Star 5 (Far Right) - Center approx (490, 75) */}
        <polygon
          points="490,55 494,67 506,67 496,75 500,87 490,80 480,87 484,75 474,67 486,67"
          fill="url(#goldGradient)"
        />
      </g>

      {/* Frame Box (Brackets) */}
      <g stroke={colors.boxLine} strokeWidth="4.5" strokeLinecap="square">
        {/* Left bracket: top horizontal, vertical down, bottom horizontal */}
        <path d="M 125,92 L 40,92 L 40,205 L 140,205" />
        
        {/* Right bracket: top horizontal, vertical down, bottom horizontal */}
        <path d="M 475,92 L 560,92 L 560,205 L 460,205" />

        {/* Center line extensions flanking the standards text */}
        <path d="M 40,205 H 145" />
        <path d="M 455,205 H 560" />
      </g>

      {/* Brand Text: HOMELIFE */}
      <text
        x="300"
        y="158"
        textAnchor="middle"
        fill={colors.textHomeLife}
        style={{
          fontFamily: "'Georgia', 'Times New Roman', serif",
          fontSize: '72px',
          fontWeight: '900',
          letterSpacing: '1px',
        }}
      >
        HOMELIFE
      </text>

      {/* Tagline Text: HIGHER STANDARDS™ */}
      <text
        x="300"
        y="214"
        textAnchor="middle"
        fill={colors.textStandards}
        style={{
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
          fontSize: '26px',
          fontWeight: '800',
          letterSpacing: '5.5px',
        }}
      >
        HIGHER STANDARDS™
      </text>
    </svg>
  );

  if (withBackground) {
    return (
      <div 
        className={`bg-black px-5 py-3 rounded-xl shadow-xl border border-slate-800/80 inline-flex items-center justify-center ${className}`}
        style={{ contentVisibility: 'auto' }}
      >
        {svgContent}
      </div>
    );
  }

  return (
    <div className={className}>
      {svgContent}
    </div>
  );
}
