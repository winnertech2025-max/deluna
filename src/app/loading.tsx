export default function Loading() {
  return (
    <div className="mx-auto max-w-[1480px] px-4 py-10 sm:px-6 xl:px-8">
      <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr]">
        <div>
          <div className="h-4 w-44 animate-pulse rounded bg-black/10" />
          <div className="mt-5 h-14 w-3/4 animate-pulse rounded bg-black/10" />
          <div className="mt-3 h-14 w-2/3 animate-pulse rounded bg-black/10" />
          <div className="mt-6 h-5 w-full max-w-xl animate-pulse rounded bg-black/10" />
          <div className="mt-3 h-5 w-5/6 animate-pulse rounded bg-black/10" />
          <div className="mt-8 flex gap-3">
            <div className="h-12 w-40 animate-pulse rounded-full bg-black/10" />
            <div className="h-12 w-40 animate-pulse rounded-full bg-black/10" />
          </div>
        </div>
        <div className="grid min-h-[420px] grid-cols-2 gap-4">
          <div className="mt-12 animate-pulse rounded-lg bg-black/10" />
          <div className="grid gap-4">
            <div className="animate-pulse rounded-lg bg-black/10" />
            <div className="animate-pulse rounded-lg bg-black/10" />
          </div>
        </div>
      </div>
      <div className="mt-12 grid grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="rounded-lg border border-black/10 bg-white p-4">
            <div className="aspect-[4/5] animate-pulse rounded-md bg-black/10" />
            <div className="mt-4 h-4 w-3/4 animate-pulse rounded bg-black/10" />
            <div className="mt-3 h-4 w-1/2 animate-pulse rounded bg-black/10" />
          </div>
        ))}
      </div>
    </div>
  );
}
