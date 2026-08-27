"use client";

import { useEffect, useRef, useState } from "react";
import { recordClick, recordView } from "@/lib/fake-door-analytics";
import { SearchResultsMockup } from "./search-results-mockup";

/** Zmockowany sprzedawca — panel nie ma logowania, seller_id jest staly. */
const SELLER_ID = "kamil";

const BENEFITS = [
  {
    title: "Ustalasz dzienny budżet",
    body: "Od 20 zl dziennie. Płacisz tylko za kliknięcia w Twoją ofertę, budżet zatrzymujesz kiedy chcesz.",
  },
  {
    title: "Podbijasz pozycję w wynikach",
    body: "Twoja oferta wskakuje z #15 na #2 dla wybranych fraz — zamiast czekać, aż ktoś dojdzie do drugiej strony.",
  },
  {
    title: "Etykieta „Sponsorowane”",
    body: "Kupujący widzi wyraźne oznaczenie, że to promowana oferta. Zero ukrytej reklamy.",
  },
];

export function SponsoredListingsCard() {
  const [submitted, setSubmitted] = useState(false);
  const viewCounted = useRef(false);

  useEffect(() => {
    // Guard na podwojne wywolanie efektu w React StrictMode (dev).
    if (viewCounted.current) return;
    viewCounted.current = true;

    recordView();
  }, []);

  function handleCtaClick() {
    recordClick(SELLER_ID);
    setSubmitted(true);
  }

  return (
    <section className="bg-card border border-border rounded-lg p-6 md:p-8">
      <p className="text-label mb-2">Wkrótce</p>
      <h1 className="text-[24px] md:text-[28px] font-medium text-charcoal mb-3">
        Sponsorowane listingi
      </h1>
      <p className="text-[14px] text-warm-gray max-w-prose mb-8">
        Tysiące ofert konkuruje o tego samego kupującego. Sponsorowane listingi pozwolą Ci
        zapłacić za miejsce na górze wyników wyszukiwania — bez zmieniania czegokolwiek
        w samej ofercie.
      </p>

      <ul className="space-y-5 mb-8">
        {BENEFITS.map((benefit) => (
          <li key={benefit.title}>
            <h2 className="text-[13px] font-medium text-charcoal mb-1">{benefit.title}</h2>
            <p className="text-[13px] text-warm-gray max-w-prose">{benefit.body}</p>
          </li>
        ))}
      </ul>

      <SearchResultsMockup />

      <div className="mt-8 pt-6 border-t border-border">
        {submitted ? (
          <div>
            <p className="text-[15px] font-medium text-charcoal mb-1">
              Dziękujemy, odezwiemy się wkrótce
            </p>
            <p className="text-[13px] text-warm-gray">
              Zapisaliśmy Cię na listę wczesnego dostępu. Damy znać, gdy sponsorowane listingi
              ruszą.
            </p>
          </div>
        ) : (
          <button type="button" className="btn-cta" onClick={handleCtaClick}>
            Zapisz się na wczesny dostęp
          </button>
        )}
      </div>
    </section>
  );
}
