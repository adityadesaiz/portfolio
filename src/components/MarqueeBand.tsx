interface MarqueeBandProps {
  content: string;
  direction?: 'ltr' | 'rtl';
  speed?: number;
  className?: string;
}

export function MarqueeBand({ content, direction = 'ltr', speed = 30, className = '' }: MarqueeBandProps) {
  const repeated = `${content} `.repeat(8);

  return (
    <div
      className={`w-full overflow-hidden border-y border-industrial-grey/30 py-3 ${className}`}
    >
      <div
        className={`whitespace-nowrap font-mono text-base tracking-[0.1em] uppercase text-muted-grey ${
          direction === 'ltr' ? 'animate-marquee-ltr' : 'animate-marquee-rtl'
        }`}
        style={{ animationDuration: `${speed}s` }}
      >
        <span className="inline-block">{repeated}</span>
        <span className="inline-block">{repeated}</span>
      </div>
    </div>
  );
}
