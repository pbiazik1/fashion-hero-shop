"use client";

import Link from "next/link";
import { recordBannerClick } from "@/lib/fake-door-analytics";

export function VisibilityBanner() {
  return (
    <div className="bg-charcoal text-white rounded-lg p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-5">
      <div className="flex-1">
        <p className="text-[10px] font-medium uppercase tracking-wider text-white/60 mb-2">
          Nowość
        </p>
        <h2 className="text-[18px] md:text-[20px] font-medium mb-2">
          Chcesz zwiększyć swoją widoczność?
        </h2>
        <p className="text-[13px] text-white/70 max-w-prose">
          Twoje oferty wyświetlają się średnio na pozycji #15. Zobacz, jak możesz trafić na górę
          wyników wyszukiwania.
        </p>
      </div>
      <Link
        href="/seller-panel/sponsored"
        onClick={() => recordBannerClick()}
        className="shrink-0 inline-flex items-center justify-center px-6 py-2.5 bg-white text-charcoal text-[12px] font-medium uppercase tracking-[0.6px] rounded-full hover:opacity-85 transition-opacity"
      >
        Dowiedz się więcej
      </Link>
    </div>
  );
}
