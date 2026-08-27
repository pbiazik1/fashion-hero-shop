"use client";

import { useMemo, useRef, useSyncExternalStore } from "react";
import type { Product } from "@/types";
import { products as allProducts } from "@/data/products";
import { ProductCard } from "./product-card";
import { ChevronLeftIcon, ChevronRightIcon } from "./icons";
import { createLocalStorageStore } from "@/lib/local-storage-store";

const MAX_ITEMS = 8;

const EMPTY: string[] = [];

const recentlyViewedStore = createLocalStorageStore<string[]>(
  "stepforward-recently-viewed",
  EMPTY
);

export function trackRecentlyViewed(productId: string) {
  const ids = recentlyViewedStore.getSnapshot();
  recentlyViewedStore.set(
    [productId, ...ids.filter((id) => id !== productId)].slice(0, MAX_ITEMS)
  );
}

export function RecentlyViewed({ currentProductId }: { currentProductId: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const ids = useSyncExternalStore(
    recentlyViewedStore.subscribe,
    recentlyViewedStore.getSnapshot,
    recentlyViewedStore.getServerSnapshot
  );

  const recentProducts = useMemo(
    () =>
      ids
        .filter((id) => id !== currentProductId)
        .map((id) => allProducts.find((p) => p.id === id))
        .filter((p): p is Product => !!p),
    [ids, currentProductId]
  );

  function scroll(direction: "left" | "right") {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -300 : 300,
      behavior: "smooth",
    });
  }

  if (recentProducts.length === 0) return null;

  return (
    <section className="py-12">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-medium text-charcoal">Recently Viewed</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll("left")}
            className="w-9 h-9 flex items-center justify-center border border-border rounded-full hover:border-charcoal transition-colors"
            aria-label="Previous"
          >
            <ChevronLeftIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            className="w-9 h-9 flex items-center justify-center border border-border rounded-full hover:border-charcoal transition-colors"
            aria-label="Next"
          >
            <ChevronRightIcon className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto scrollbar-hide -mx-4 px-4 snap-x snap-mandatory"
      >
        {recentProducts.map((product) => (
          <div key={product.id} className="flex-shrink-0 w-[220px] md:w-[260px] snap-start">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
}
