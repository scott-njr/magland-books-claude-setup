type IconProps = {
  className?: string;
  size?: number;
};

export function Facebook({ className, size = 18 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M13 22v-8h2.7l.4-3H13V9.1c0-.9.3-1.5 1.5-1.5h1.6V5c-.3 0-1.2-.1-2.3-.1-2.3 0-3.8 1.4-3.8 4v2H8v3h2v8h3z" />
    </svg>
  );
}
