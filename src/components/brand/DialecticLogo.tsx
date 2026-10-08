import React from 'react';

interface DialecticLogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
}

export const DialecticLogo: React.FC<DialecticLogoProps> = ({
  size = 20,
  className = '',
  showText = false,
}) => {
  return (
    <div className={`inline-flex items-center space-x-2 select-none ${className}`}>
      {/* Dialectic Vector Icon:
          Symbolism:
          - The left vertical stem: The Sovereign Anchor (Human Researcher).
          - The two converging rightward arcs (Thesis & Antithesis) meeting at a central synthesis vertex.
          - Combined, they form a sleek, modern, developer-grade geometric "D" monogram.
      */}
      <svg
        width={size}
        height={size}
        viewBox="0 0 32 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <defs>
          {/* Gradients representing dialectical synthesis */}
          <linearGradient id="dialectic-grad-primary" x1="4" y1="4" x2="28" y2="28" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#007acc" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id="dialectic-grad-glow" x1="16" y1="8" x2="28" y2="24" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#818cf8" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* Outer subtle glow/backdrop for high visibility on dark theme */}
        <circle cx="16" cy="16" r="14" fill="#007acc" fillOpacity="0.08" />

        {/* 1. Left Sovereign Stem (Anchor of truth) */}
        <rect
          x="6"
          y="6"
          width="3.5"
          height="20"
          rx="1.75"
          fill="#e2e8f0"
        />

        {/* 2. Thesis Arc (Upper curve sweeping from human anchor toward dialogue) */}
        <path
          d="M 9.5 8 C 17 8 26 10 26 16"
          stroke="url(#dialectic-grad-primary)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* 3. Antithesis Arc (Lower counter-curve probing from bottom to meet synthesis) */}
        <path
          d="M 9.5 24 C 17 24 26 22 26 16"
          stroke="url(#dialectic-grad-primary)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />

        {/* 4. The Synthesis Node / Spark (Where Thesis & Antithesis converge) */}
        <circle
          cx="26"
          cy="16"
          r="2.5"
          fill="#38bdf8"
        />

        {/* 5. Central Dialectical Bridge / Socratic ray */}
        <path
          d="M 12 16 H 20"
          stroke="#38bdf8"
          strokeWidth="2"
          strokeDasharray="2 2"
          strokeLinecap="round"
          opacity="0.8"
        />
      </svg>

      {/* Brand Wordmark */}
      {showText && (
        <span className="font-bold text-white text-sm tracking-wide">Dialectic</span>
      )}
    </div>
  );
};

export default DialecticLogo;
