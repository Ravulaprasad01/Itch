import Link from 'next/link';

export default function VoltageLink({ href, children, className = '', onClick, ariaLabel }) {
  return <span className={`voltage-button ${className}`}>
    <Link href={href} onClick={onClick} aria-label={ariaLabel}>{children}</Link>
  </span>;
}
