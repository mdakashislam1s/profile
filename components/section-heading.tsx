type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  description?: string;
};

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="mb-10 space-y-3 sm:mb-14">
      <p className="inline-flex rounded-full border border-gold-400/30 bg-gold-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-gold-300">
        {eyebrow}
      </p>
      <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">{title}</h2>
      {description ? (
        <p className="max-w-3xl text-base leading-relaxed text-zinc-300 sm:text-lg">{description}</p>
      ) : null}
    </div>
  );
}
