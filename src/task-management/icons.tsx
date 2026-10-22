import type { ReactNode } from 'react';

interface IconProps {
  size?: number;
}

function Icon({ children, size = 18 }: IconProps & { children: ReactNode }) {
  return (
    <svg
      aria-hidden="true"
      width={size}
      height={size}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.8}
    >
      {children}
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M12 5v14M5 12h14" />
    </Icon>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M6 6l12 12M18 6 6 18" />
    </Icon>
  );
}

export function MoreIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <circle cx="5" cy="12" r="1.1" fill="currentColor" />
      <circle cx="12" cy="12" r="1.1" fill="currentColor" />
      <circle cx="19" cy="12" r="1.1" fill="currentColor" />
    </Icon>
  );
}

export function MoveIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M5 12h14M13 6l6 6-6 6" />
    </Icon>
  );
}

export function EditIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 20h4L19 9l-4-4L4 16v4ZM13.5 6.5l4 4" />
    </Icon>
  );
}

export function DeleteIcon(props: IconProps) {
  return (
    <Icon {...props}>
      <path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3" />
    </Icon>
  );
}

export function PriorityHighIcon({ size = 10 }: IconProps) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 10 10">
      <path d="M5 1.5 9 8.5H1Z" fill="currentColor" />
    </svg>
  );
}

export function PriorityLowIcon({ size = 10 }: IconProps) {
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox="0 0 10 10">
      <path
        d="M5 8.5 1.6 2h6.8Z"
        fill="none"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="1.2"
      />
    </svg>
  );
}
