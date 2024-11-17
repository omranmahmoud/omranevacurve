import React from 'react';

interface LogoProps {
  className?: string;
}

export function Logo({ className = '' }: LogoProps) {
  return (
    <div className={`relative ${className}`}>
      <svg
        viewBox="0 0 800 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Animated Silhouette */}
        <path
          d="M200 50C300 50 350 150 350 200C350 250 300 350 200 350"
          stroke="currentColor"
          strokeWidth="20"
          strokeLinecap="round"
          className="animate-spin-slow origin-center"
        />
        
        {/* Letters */}
        <g className="animate-fadeIn">
          <text x="400" y="200" fontSize="120" fontFamily="serif" fontWeight="bold" fill="currentColor">
            EVA
          </text>
          <text x="400" y="300" fontSize="80" fontFamily="serif" fill="currentColor">
            CURVES
          </text>
        </g>
      </svg>
    </div>
  );
}