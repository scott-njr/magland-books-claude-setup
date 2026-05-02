type IconProps = {
  className?: string;
  size?: number;
};

export function Cart({ className, size = 20 }: IconProps) {
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
      <path d="M3 3h2l.4 2M7 13h12l3-8H5.4M7 13l-2.4-8M7 13l-1 5h13" />
      <circle cx={9} cy={20} r={1.4} />
      <circle cx={18} cy={20} r={1.4} />
    </svg>
  );
}
