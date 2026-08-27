import { VisibilityBanner } from "./visibility-banner";

/** Statyczne atrapy — panel nic nie liczy, sluzy wylacznie za kontekst dla fake-doora. */
const STATS = [
  { label: "Wyświetlenia (30 dni)", value: "1 240" },
  { label: "Kliknięcia w oferty", value: "86" },
  { label: "Zamówienia", value: "7" },
];

const LISTINGS = [
  { name: "Trampki lniane", price: 269, position: 15, swatch: "#d8c9a8" },
  { name: "Buty zamszowe brązowe", price: 289, position: 22, swatch: "#a89684" },
  { name: "Sneakersy biegowe", price: 329, position: 31, swatch: "#8fa3a8" },
];

export function SellerDashboard() {
  return (
    <div className="space-y-8">
      <div>
        <p className="text-label mb-2">Panel sprzedawcy</p>
        <h1 className="text-[24px] md:text-[28px] font-medium text-charcoal">Cześć, Kamil</h1>
        <p className="text-[14px] text-warm-gray mt-1">Marta Handmade — sklep aktywny od 2022</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {STATS.map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-lg p-5">
            <p className="text-[22px] font-medium text-charcoal">{stat.value}</p>
            <p className="text-[12px] text-warm-gray mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <VisibilityBanner />

      <div>
        <h2 className="text-[13px] font-medium text-charcoal mb-3">Twoje oferty</h2>
        <ul className="bg-card border border-border rounded-lg divide-y divide-border">
          {LISTINGS.map((listing) => (
            <li key={listing.name} className="flex items-center gap-4 p-4">
              <span
                className="w-11 h-11 shrink-0 rounded-sm"
                style={{ backgroundColor: listing.swatch }}
                aria-hidden="true"
              />
              <span className="min-w-0 flex-1">
                <span className="block text-[13px] font-medium text-charcoal truncate">
                  {listing.name}
                </span>
                <span className="block text-[12px] text-warm-gray">{listing.price} zl</span>
              </span>
              <span className="text-[12px] text-warm-gray shrink-0 tabular-nums">
                pozycja #{listing.position}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
