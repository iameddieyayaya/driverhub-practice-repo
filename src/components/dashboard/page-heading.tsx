export function PageHeading({ eyebrow, title, description, action }: { eyebrow: string; title: string; description?: string; action?: React.ReactNode }) {
  return <header className="mb-7 flex flex-col justify-between gap-4 sm:flex-row sm:items-end"><div><p className="data-type text-[11px] uppercase tracking-[.2em] text-road">{eyebrow}</p><h1 className="display-type mt-1 text-4xl leading-none sm:text-5xl">{title}</h1>{description ? <p className="mt-2 max-w-2xl text-sm text-muted">{description}</p> : null}</div>{action}</header>;
}
