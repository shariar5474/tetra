import React from 'react';
import { Link } from 'react-router-dom';

interface TetraLogoProps {
  className?: string;
  theme?: 'dark' | 'light';
  variant?: 'horizontal' | 'stacked' | 'icon';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  linkToHome?: boolean;
}

export const TetraLogo: React.FC<TetraLogoProps> = ({
  className = '',
  theme = 'dark',
  variant = 'horizontal',
  size = 'md',
  linkToHome = true,
}) => {
  const isDarkTheme = theme === 'dark';
  const textColor = isDarkTheme ? '#FFFFFF' : '#071426';
  const blueColor = '#00A9FF';

  // Size configurations
  const heightMap = {
    sm: 'h-7',
    md: 'h-9',
    lg: 'h-12',
    xl: 'h-16',
  };

  const currentHeight = heightMap[size] || 'h-9';

  const logoContent = (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {variant === 'horizontal' ? (
        /* Precise SVG Horizontal Lockup matching Attachment 1 & 2 */
        <svg
          viewBox="0 0 280 64"
          className={`${currentHeight} w-auto transition-transform hover:scale-[1.02]`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* TETRA 'T' Emblem on Left */}
          <g transform="translate(6, 6) scale(0.68)">
            {/* Top horizontal beam with angular cuts */}
            <path
              d="M 6 12 L 18 12 L 66 12 L 78 6 L 80 18 L 66 22 L 18 22 L 6 18 Z"
              fill={textColor}
            />
            {/* Dual vertical columns with flared base */}
            <path
              d="M 28 24 L 37 24 L 37 54 C 37 60 26 64 22 66 L 39 66 L 39 24 Z"
              fill={textColor}
            />
            <path
              d="M 47 24 L 47 66 L 64 66 C 60 64 49 60 49 54 L 49 24 Z"
              fill={textColor}
            />
            {/* Curved ground arc underneath */}
            <path
              d="M 2 72 Q 43 62 84 72 Q 43 66 2 72 Z"
              fill={textColor}
            />
          </g>

          {/* TETRA Wordmark on Right */}
          <g transform="translate(74, 15)">
            {/* T */}
            <path
              d="M 0 4 L 30 4 L 28 9 L 18 9 L 18 34 L 11 34 L 11 9 L 0 9 Z"
              fill={textColor}
            />

            {/* E */}
            <path
              d="M 36 4 L 62 4 L 60 9 L 44 9 L 44 14 L 58 14 L 56 19 L 44 19 L 44 29 L 64 29 L 62 34 L 36 34 Z"
              fill={textColor}
            />
            {/* Vibrant Electric Blue middle bar of E */}
            <path
              d="M 44 14.5 L 59 14.5 L 56 19.5 L 44 19.5 Z"
              fill={blueColor}
            />

            {/* T */}
            <path
              d="M 68 4 L 98 4 L 96 9 L 86 9 L 86 34 L 79 34 L 79 9 L 68 9 Z"
              fill={textColor}
            />

            {/* R */}
            <path
              d="M 104 4 L 126 4 C 134 4 137 7 137 13 C 137 18 132 21 125 22 L 138 34 L 128 34 L 118 23 L 112 23 L 112 34 L 104 34 Z M 112 9 L 112 18 L 124 18 C 127 18 129 16 129 13.5 C 129 11 127 9 124 9 Z"
              fill={textColor}
            />

            {/* A */}
            <path
              d="M 152 4 L 165 4 L 182 34 L 172 34 L 168 26 L 149 26 L 145 34 L 136 34 Z M 153 19 L 164 19 L 158.5 8 Z"
              fill={textColor}
            />
            {/* Electric Blue inner triangle in A */}
            <polygon
              points="152,24 165,24 158.5,13"
              fill={blueColor}
            />
          </g>
        </svg>
      ) : variant === 'stacked' ? (
        /* Stacked Logo matching Attachment 1 */
        <div className="flex flex-col items-center">
          <img
            src={isDarkTheme ? '/assets/brand/tetra-logo-white.png' : '/assets/brand/tetra-logo.png'}
            alt="TETRA Logo"
            className={`${currentHeight} w-auto object-contain`}
          />
        </div>
      ) : (
        /* Icon Only */
        <div className="flex items-center justify-center">
          <img
            src={isDarkTheme ? '/assets/brand/tetra-logo-white.png' : '/assets/brand/tetra-logo.png'}
            alt="TETRA"
            className={`${currentHeight} w-auto object-contain`}
          />
        </div>
      )}
    </div>
  );

  if (linkToHome) {
    return (
      <Link to="/" className="inline-block" aria-label="TETRA Home">
        {logoContent}
      </Link>
    );
  }

  return logoContent;
};
