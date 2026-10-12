export default function LockIcon({ color = "#66645B" }: { color?: string }) {
  return (
    <svg width="14" height="16" viewBox="0 0 14 16" fill="none" stroke={color} strokeWidth="1.5" aria-hidden="true">
      <rect x="1.5" y="7" width="11" height="8" rx="2" />
      <path d="M4 7V5a3 3 0 0 1 6 0v2" />
    </svg>
  );
}
