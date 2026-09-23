const LEAFLET = "M0 0 C3.6 -5.5 3.4 -12.5 0 -19 C-3.4 -12.5 -3.6 -5.5 0 0 Z";

const LEAFLETS = [
  "scale(1.05 1.2)",
  "rotate(-30) scale(0.95 1.02)",
  "rotate(30) scale(0.95 1.02)",
  "rotate(-62) scale(0.8 0.78)",
  "rotate(62) scale(0.8 0.78)",
  "rotate(-92) scale(0.6 0.5)",
  "rotate(92) scale(0.6 0.5)",
];

export default function CannabisIcon({ className = "w-5 h-5", stem = true }) {
  return (
    <svg viewBox="0 0 48 48" fill="currentColor" className={className} aria-hidden="true">
      <g transform="translate(24 32)">
        {LEAFLETS.map((t) => (
          <path key={t} d={LEAFLET} transform={t} />
        ))}
      </g>
      {stem && (
        <path d="M24 32 L24 42" stroke="currentColor" strokeWidth="2" strokeLinecap="round" fill="none" />
      )}
    </svg>
  );
}
