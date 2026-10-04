import { useId } from 'react';

export default function Mark({ className = '', title }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg className={className} viewBox="0 0 100 124" fill="none" role={title ? 'img' : undefined} aria-label={title} aria-hidden={title ? undefined : true}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#F6E3B0" />
          <stop offset="1" stopColor="#D8AE5E" />
        </linearGradient>
      </defs>
      <g fill={`url(#${id})`}>
        <path d="M50 0 L100 45 L92 53 L50 15 L8 53 L0 45 Z" />
        <rect x="19" y="40" width="10" height="62" />
        <rect x="71" y="40" width="10" height="62" />
        <rect x="19" y="68" width="62" height="9" />
        <path d="M45 16 h10 v94 l-5 13 l-5 -13 z" />
      </g>
    </svg>
  );
}
