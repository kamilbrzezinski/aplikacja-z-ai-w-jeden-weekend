import type { ThemePreference } from './theme';

interface ThemeIconProps {
  preference: ThemePreference;
}

export function ThemeIcon({ preference }: ThemeIconProps) {
  const svgProps = {
    'aria-hidden': true,
    width: 20,
    height: 20,
    fill: 'none',
    viewBox: '0 0 24 24',
    stroke: 'currentColor',
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    strokeWidth: 1.8,
  } as const;

  if (preference === 'light') {
    return (
      <svg {...svgProps}>
        <circle cx="12" cy="12" r="4" />
        <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41" />
      </svg>
    );
  }

  if (preference === 'dark') {
    return (
      <svg {...svgProps}>
        <path d="M20.4 15.2A8.5 8.5 0 0 1 8.8 3.6 8.5 8.5 0 1 0 20.4 15.2Z" />
      </svg>
    );
  }

  return (
    <svg {...svgProps}>
      <rect x="3" y="4" width="18" height="13" rx="2" />
      <path d="M8 21h8M12 17v4" />
    </svg>
  );
}
