"use client";

import { useState, useEffect } from "react";

function randomViewers(current: number): number {
  // Drift by ±3, stay between 4 and 47
  const delta = Math.floor(Math.random() * 7) - 3;
  return Math.min(47, Math.max(4, current + delta));
}

/*
 * count i rising musza zmieniac sie razem, wiec siedza w jednym stanie.
 * Wczesniej rising wynikal z refa czytanego podczas renderu (react-hooks/refs).
 *
 * Wartosc startowa jest stala, a nie losowa: komponent renderuje sie takze na serwerze,
 * wiec Math.random() w inicjalizatorze dawal inna liczbe na serwerze i na kliencie
 * (niezgodnosc hydracji). Losujemy dopiero po zamontowaniu.
 */
const INITIAL_COUNT = 18;

export function ViewersWidget() {
  const [{ count, rising }, setViewers] = useState({
    count: INITIAL_COUNT,
    rising: true,
  });
  const [bump, setBump] = useState(false);

  useEffect(() => {
    const id = setInterval(() => {
      setViewers((prev) => {
        const next = randomViewers(prev.count);
        return { count: next, rising: next >= prev.count };
      });
      setBump(true);
      setTimeout(() => setBump(false), 400);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="flex items-center gap-2 text-xs text-warm-gray">
      {/* Pulsing dot */}
      <span className="relative flex h-2 w-2 flex-shrink-0">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rose-400 opacity-60" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-rose-500" />
      </span>

      <span>
        <span
          className="font-semibold text-charcoal tabular-nums"
          style={{
            display: "inline-block",
            transition: "color 0.3s",
            color: bump ? (rising ? "oklch(0.45 0.15 25)" : "oklch(0.45 0.12 220)") : undefined,
          }}
        >
          {count}
        </span>{" "}
        {count === 1 ? "person is" : "people are"} viewing this right now
      </span>
    </div>
  );
}
