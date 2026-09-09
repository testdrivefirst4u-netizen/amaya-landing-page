/**
 * Amaya icon language — 1.25px stroke equivalent at 24×24 (brand spec 1.2),
 * round joins and caps, never filled. Paths lifted from Brand Guidelines v3.
 */
type IconProps = {
  size?: number;
  className?: string;
};

function base(size: number, className?: string) {
  return {
    viewBox: "0 0 24 24",
    width: size,
    height: size,
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.2,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    className,
    "aria-hidden": true,
  };
}

export function IconHome({ size = 28, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M2 10.5L12 3l10 7.5" />
      <path d="M5 8.5V20a1 1 0 001 1h4v-5h4v5h4a1 1 0 001-1V8.5" />
    </svg>
  );
}

export function IconCommunity({ size = 28, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <circle cx="12" cy="7" r="3" />
      <path d="M7 21v-1a5 5 0 0110 0v1" />
      <circle cx="5" cy="9" r="2.2" />
      <path d="M2 21v-.5a4.2 4.2 0 014.2-4.2" />
      <circle cx="19" cy="9" r="2.2" />
      <path d="M22 21v-.5a4.2 4.2 0 00-4.2-4.2" />
    </svg>
  );
}

export function IconSafety({ size = 28, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M12 2.5L3.5 6v6c0 5 3.8 9.3 8.5 10.5 4.7-1.2 8.5-5.5 8.5-10.5V6L12 2.5z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  );
}

export function IconCare({ size = 28, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" />
    </svg>
  );
}

export function IconLocation({ size = 28, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M12 2C8.7 2 6 4.7 6 8c0 5 6 13 6 13s6-8 6-13c0-3.3-2.7-6-6-6z" />
      <circle cx="12" cy="8" r="2" />
    </svg>
  );
}

export function IconHealthcare({ size = 28, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <rect x="9" y="3" width="6" height="18" rx="2" />
      <rect x="3" y="9" width="18" height="6" rx="2" />
    </svg>
  );
}

export function IconClubhouse({ size = 28, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M3 21h18" />
      <path d="M5 21V10M19 21V10" />
      <path d="M5 10a7 7 0 0114 0" />
      <path d="M9 21v-6h6v6" />
    </svg>
  );
}

export function IconNature({ size = 28, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M12 2C8 2 5 6 5 9.5c0 2 1 3.8 2.5 5H12v5.5" />
      <path d="M12 2c4 0 7 4 7 7.5 0 2-1 3.8-2.5 5H12" />
      <line x1="12" y1="14.5" x2="12" y2="22" />
    </svg>
  );
}

export function IconDining({ size = 28, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M3 15h18" />
      <path d="M3 19h18" />
      <path d="M5 15a7 7 0 0114 0" />
      <line x1="12" y1="8" x2="12" y2="11" />
    </svg>
  );
}

export function IconWellness({ size = 28, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <circle cx="12" cy="4.5" r="1.8" />
      <path d="M8.5 10.5C8.5 8.5 10 7.5 12 7.5s3.5 1 3.5 3" />
      <path d="M6 13c1.5-1 3.5-1.5 6-1.5s4.5.5 6 1.5" />
      <path d="M7 13.5c0 2 .8 3.5 2 4.5h6c1.2-1 2-2.5 2-4.5" />
      <path d="M9 18.5c-1 .5-2 .8-3 .8" />
      <path d="M15 18.5c1 .5 2 .8 3 .8" />
    </svg>
  );
}

export function IconVerandah({ size = 28, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M3 8h18" />
      <path d="M3 18h18" />
      <line x1="7" y1="8" x2="7" y2="18" />
      <line x1="12" y1="8" x2="12" y2="18" />
      <line x1="17" y1="8" x2="17" y2="18" />
      <path d="M2 8c0 0 2-4 10-4s10 4 10 4" />
    </svg>
  );
}

export function IconBook({ size = 28, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M3 5.5c2-1 5-1 7 0v13c-2-1-5-1-7 0z" />
      <path d="M21 5.5c-2-1-5-1-7 0v13c2-1 5-1 7 0z" />
    </svg>
  );
}

export function IconFitness({ size = 28, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <rect x="2" y="9" width="3" height="6" rx="1" />
      <rect x="19" y="9" width="3" height="6" rx="1" />
      <rect x="6.5" y="7" width="2" height="10" rx="1" />
      <rect x="15.5" y="7" width="2" height="10" rx="1" />
      <line x1="8.5" y1="12" x2="15.5" y2="12" />
    </svg>
  );
}

export function IconArts({ size = 28, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M12 3a9 8.5 0 100 17c1.2 0 2-1 2-2.2 0-.6-.25-1.1-.6-1.5-.35-.4-.55-.9-.4-1.4.2-.6.8-1 1.5-1H16c2.8 0 5-2 5-4.4C21 5.8 17 3 12 3z" />
      <circle cx="7.5" cy="10.5" r="1.1" />
      <circle cx="10.5" cy="7.5" r="1.1" />
      <circle cx="14.5" cy="7.7" r="1.1" />
      <circle cx="17" cy="10.7" r="1.1" />
    </svg>
  );
}

export function IconPerformance({ size = 28, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <circle cx="7" cy="18" r="2.2" />
      <circle cx="17" cy="16.5" r="2.2" />
      <path d="M9.2 18V5.5L19.2 4v12.5" />
      <path d="M9.2 8.5l10-1.5" />
    </svg>
  );
}

export function IconCheck({ size = 28, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <circle cx="12" cy="12" r="9" />
      <path d="M8 12.5l2.5 2.5L16 9" />
    </svg>
  );
}

export function IconArrow({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M4 12h16" />
      <path d="M14 6l6 6-6 6" />
    </svg>
  );
}

export function IconPlus({ size = 16, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

export function IconChevronDown({ size = 14, className }: IconProps) {
  return (
    <svg {...base(size, className)}>
      <path d="M5 8.5l7 7 7-7" />
    </svg>
  );
}
