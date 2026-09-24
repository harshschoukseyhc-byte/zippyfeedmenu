import React from 'react';

interface FoodMarkProps {
  veg: boolean;
  size?: number;
  className?: string;
}

/**
 * FSSAI Food Mark (Indian Standard)
 * - Veg: Green square border with filled green circle
 * - Non-Veg: Brown square border with filled brown triangle (current FSSAI specification)
 * Colors: Veg green #1B8E3E, Non-veg brown #7A3B12
 */
export const FoodMark: React.FC<FoodMarkProps> = ({ veg, size = 15, className = '' }) => {
  if (veg) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={`flex-shrink-0 inline-block ${className}`}
        aria-label="Vegetarian"
        role="img"
      >
        <rect
          x="1"
          y="1"
          width="14"
          height="14"
          rx="2.5"
          stroke="#1B8E3E"
          strokeWidth="1.6"
          fill="#FFFFFF"
        />
        <circle cx="8" cy="8" r="3.5" fill="#1B8E3E" />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`flex-shrink-0 inline-block ${className}`}
      aria-label="Non-Vegetarian"
      role="img"
    >
      <rect
        x="1"
        y="1"
        width="14"
        height="14"
        rx="2.5"
        stroke="#7A3B12"
        strokeWidth="1.6"
        fill="#FFFFFF"
      />
      {/* Equilateral triangle pointing upward */}
      <polygon points="8,4 12,11.5 4,11.5" fill="#7A3B12" />
    </svg>
  );
};
