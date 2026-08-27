import type { Metadata } from "next";
import Link from "next/link";
import { SponsoredListingsCard } from "@/components/seller-panel/sponsored-listings-card";

export const metadata: Metadata = {
  title: "Sponsorowane listingi — FashionHero",
  description: "Sponsorowane listingi: zapisz się na wczesny dostęp.",
};

export default function SponsoredListingsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <Link
        href="/seller-panel"
        className="inline-block text-[12px] text-warm-gray hover:text-charcoal transition-colors mb-6"
      >
        &larr; Wróć do panelu
      </Link>
      <SponsoredListingsCard />
    </div>
  );
}
