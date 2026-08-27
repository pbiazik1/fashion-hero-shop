interface MockResult {
  rank: number;
  name: string;
  price: number;
  swatch: string;
  isOwn?: boolean;
}

const BEFORE_RESULTS: MockResult[] = [
  { rank: 1, name: "Trampki miejskie", price: 249, swatch: "#c9c2b6" },
  { rank: 2, name: "Sneakersy biegowe", price: 329, swatch: "#8fa3a8" },
  { rank: 3, name: "Buty zamszowe", price: 289, swatch: "#a89684" },
  { rank: 14, name: "Mokasyny klasyczne", price: 359, swatch: "#7a7a7a" },
  { rank: 15, name: "Twoje trampki lniane", price: 269, swatch: "#d8c9a8", isOwn: true },
];

const AFTER_RESULTS: MockResult[] = [
  { rank: 1, name: "Twoje trampki lniane", price: 269, swatch: "#d8c9a8", isOwn: true },
  { rank: 2, name: "Trampki miejskie", price: 249, swatch: "#c9c2b6" },
  { rank: 3, name: "Sneakersy biegowe", price: 329, swatch: "#8fa3a8" },
  { rank: 4, name: "Buty zamszowe", price: 289, swatch: "#a89684" },
  { rank: 5, name: "Mokasyny klasyczne", price: 359, swatch: "#7a7a7a" },
];

function ResultRow({
  result,
  sponsored = false,
}: {
  result: MockResult;
  sponsored?: boolean;
}) {
  const highlight = result.isOwn && sponsored;

  return (
    <li
      className={
        highlight
          ? "flex items-center gap-3 p-2 border border-charcoal bg-white"
          : "flex items-center gap-3 p-2 border border-transparent"
      }
    >
      <span className="text-[11px] text-warm-gray w-7 shrink-0 tabular-nums">
        #{result.rank}
      </span>
      <span
        className="w-9 h-9 shrink-0 rounded-sm"
        style={{ backgroundColor: result.swatch }}
        aria-hidden="true"
      />
      <span className="min-w-0 flex-1">
        {sponsored && result.isOwn && (
          <span className="inline-block mb-0.5 text-[8px] uppercase tracking-wide text-warm-gray border border-border px-1 py-px rounded-sm">
            Sponsorowane
          </span>
        )}
        <span
          className={
            result.isOwn
              ? "block text-[12px] font-medium text-charcoal truncate"
              : "block text-[12px] text-warm-gray truncate"
          }
        >
          {result.name}
        </span>
        <span className="block text-[12px] text-warm-gray">{result.price} zl</span>
      </span>
    </li>
  );
}

export function SearchResultsMockup() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div>
        <p className="text-label mb-3">Dziś — pozycja #15</p>
        <ul className="bg-cream-light p-3 space-y-1">
          {BEFORE_RESULTS.map((result) => (
            <ResultRow key={`before-${result.rank}`} result={result} />
          ))}
        </ul>
        <p className="mt-2 text-[12px] text-warm-gray">
          Twoja oferta ginie na drugiej stronie wyników.
        </p>
      </div>

      <div>
        <p className="text-label mb-3">Ze sponsorowaniem — pozycja #1</p>
        <ul className="bg-cream-light p-3 space-y-1">
          {AFTER_RESULTS.map((result) => (
            <ResultRow key={`after-${result.rank}`} result={result} sponsored />
          ))}
        </ul>
        <p className="mt-2 text-[12px] text-warm-gray">
          Twoja oferta na górze, oznaczona etykietą &bdquo;Sponsorowane&rdquo;.
        </p>
      </div>
    </div>
  );
}
