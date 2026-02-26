import Image from 'next/image';

interface LogoProps {
  size?: number;
  className?: string;
}

/**
 * ConditionLog logo — renders the logo.png from /public.
 * Falls back to a shield+camera inline SVG if the image fails to load.
 */
export function Logo({ size = 28, className = '' }: LogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="ConditionLog"
      width={size}
      height={size}
      className={`rounded-lg ${className}`}
      priority
    />
  );
}

/**
 * Inline SVG fallback — shield with camera lens.
 * Used where next/image isn't appropriate (email templates, etc.)
 */
export function LogoSVG({ size = 28, className = '' }: LogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      {/* Shield */}
      <path
        d="M16 2L4 7v7c0 7.73 5.12 14.96 12 17 6.88-2.04 12-9.27 12-17V7L16 2z"
        fill="#00E5C5"
      />
      {/* Camera body */}
      <rect x="9" y="12" width="14" height="10" rx="2" fill="#080C12" />
      {/* Lens */}
      <circle cx="16" cy="17" r="3.5" stroke="#00E5C5" strokeWidth="1.5" fill="none" />
      <circle cx="16" cy="17" r="1.5" fill="#00E5C5" />
      {/* Flash */}
      <rect x="19" y="10" width="4" height="3" rx="0.5" fill="#080C12" />
    </svg>
  );
}
