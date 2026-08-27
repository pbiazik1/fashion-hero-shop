"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";

/*
 * ATRAPA. Nie waliduje niczego, nie tworzy sesji, nie chroni /seller-panel —
 * panel jest dostepny takze bezposrednim URL-em. Ekran istnieje wylacznie po to,
 * by sciezka "wejscie jako sprzedawca" wygladala wiarygodnie na demo.
 */
export function SellerLoginForm() {
  const router = useRouter();

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    router.push("/seller-panel");
  }

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-lg p-6 md:p-8">
      <p className="text-label mb-2">Dla sprzedawców</p>
      <h1 className="text-[22px] font-medium text-charcoal mb-1">Zaloguj się do panelu</h1>
      <p className="text-[13px] text-warm-gray mb-6">
        Wersja demonstracyjna — dane nie są sprawdzane, wejdziesz na dowolnych.
      </p>

      <label htmlFor="seller-email" className="block text-[12px] text-charcoal mb-1">
        E-mail
      </label>
      <input
        id="seller-email"
        type="email"
        defaultValue="kamil@marta-handmade.pl"
        className="w-full border border-border rounded-sm px-3 py-2 text-[13px] mb-4 focus:outline-none focus:ring-1 focus:ring-ring"
      />

      <label htmlFor="seller-password" className="block text-[12px] text-charcoal mb-1">
        Hasło
      </label>
      <input
        id="seller-password"
        type="password"
        defaultValue="demo1234"
        className="w-full border border-border rounded-sm px-3 py-2 text-[13px] mb-6 focus:outline-none focus:ring-1 focus:ring-ring"
      />

      <button type="submit" className="btn-cta w-full">
        Zaloguj się
      </button>
    </form>
  );
}
