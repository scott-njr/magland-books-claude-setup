type IconProps = {
  className?: string;
  size?: number;
  'aria-hidden'?: boolean;
};

export function ArrowRight({ className, size = 14, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden={rest['aria-hidden'] ?? true}
    >
      <path d="M5 12h14m-7-7 7 7-7 7" />
    </svg>
  );
}
