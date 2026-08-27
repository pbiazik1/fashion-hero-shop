import type { Metadata } from "next";
import { SellerDashboard } from "@/components/seller-panel/seller-dashboard";

export const metadata: Metadata = {
  title: "Panel sprzedawcy — FashionHero",
  description: "Zmockowany panel sprzedawcy FashionHero.",
};

export default function SellerPanelPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <SellerDashboard />
    </div>
  );
}
