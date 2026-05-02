type IconProps = {
  className?: string;
  size?: number;
};

export function Instagram({ className, size = 18 }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <rect x={3} y={3} width={18} height={18} rx={5} />
      <circle cx={12} cy={12} r={3.6} />
      <circle cx={17.5} cy={6.5} r={0.8} fill="currentColor" />
    </svg>
  );
}
