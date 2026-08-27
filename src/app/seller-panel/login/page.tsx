import type { Metadata } from "next";
import { SellerLoginForm } from "@/components/seller-panel/seller-login-form";

export const metadata: Metadata = {
  title: "Logowanie dla sprzedawców — FashionHero",
  description: "Demonstracyjne logowanie do panelu sprzedawcy.",
};

export default function SellerLoginPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <SellerLoginForm />
    </div>
  );
}
