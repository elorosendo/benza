// Faixa de frases em movimento contínuo. Com "reduzir movimento", fica parada.
export function Marquee({ phrases, className = "" }: { phrases: string[]; className?: string }) {
  const row = (hidden: boolean) => (
    <ul className="flex shrink-0 items-center gap-12 pr-12" aria-hidden={hidden || undefined}>
      {phrases.map((p) => (
        <li key={p} className="flex items-center gap-12 whitespace-nowrap">
          <span className="font-display text-[clamp(48px,7vw,104px)] italic leading-none">{p}</span>
          <span aria-hidden="true" className="text-[0.5em] opacity-60">✦</span>
        </li>
      ))}
    </ul>
  );
  return (
    <div className={`overflow-hidden ${className}`} role="group" aria-label={phrases.join(". ")}>
      <div className="marquee-track flex w-max">
        {row(false)}
        {row(true)}
      </div>
    </div>
  );
}
