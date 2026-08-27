import { track } from "@/lib/posthog-client";
import type { FakeDoorClickEvent } from "@/types/fake-door";

const STORAGE_KEY_CLICKS = "fashionhero-fake-door-clicks";
const STORAGE_KEY_VIEWS = "fashionhero-fake-door-views";
const STORAGE_KEY_BANNER = "fashionhero-panel-banner-clicks";

/*
 * Jedyne miejsce, w ktorym feature emituje zdarzenia. Kazdy event idzie do PostHog (chmura US),
 * a console.log + localStorage zostaja jako zapasowy zapis, zeby dalo sie policzyc eventy
 * lokalnie (demo/certyfikacja) takze bez skonfigurowanego klucza PostHog.
 */

/** Zwraca zalogowane klikniecia — do podejrzenia z konsoli, gdy nie ma jeszcze analityki. */
export function loadClicks(): FakeDoorClickEvent[] {
  try {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(STORAGE_KEY_CLICKS);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function readCounter(key: string): number {
  try {
    if (typeof window === "undefined") return 0;
    const stored = localStorage.getItem(key);
    const parsed = stored ? Number.parseInt(stored, 10) : 0;
    return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
  } catch {
    return 0;
  }
}

function writeCounter(key: string, value: number) {
  try {
    localStorage.setItem(key, String(value));
  } catch {
    // localStorage unavailable
  }
}

/** Sygnal sukcesu testu at-1a-1. Klik w CTA "Zapisz sie na wczesny dostep". */
export function recordClick(sellerId: string): FakeDoorClickEvent {
  const event: FakeDoorClickEvent = {
    event: "fake_door_click",
    seller_id: sellerId,
    timestamp: new Date().toISOString(),
  };

  console.log("fake_door_click", event);
  track("fake_door_click", { seller_id: event.seller_id, timestamp: event.timestamp });

  try {
    localStorage.setItem(STORAGE_KEY_CLICKS, JSON.stringify([...loadClicks(), event]));
  } catch {
    // localStorage unavailable
  }

  return event;
}

/** Wyswietlenie karty — mianownik metryki "% odwiedzin karty". */
export function recordView(): number {
  const views = readCounter(STORAGE_KEY_VIEWS) + 1;
  writeCounter(STORAGE_KEY_VIEWS, views);
  const timestamp = new Date().toISOString();
  console.log("fake_door_view", { timestamp });
  track("fake_door_view", { timestamp });
  return views;
}

/*
 * Metryka pomocnicza, NIE jest sygnalem sukcesu testu at-1a-1.
 * Baner to gorny krok lejka — kto z niego przychodzi, jest juz wstepnie zainteresowany,
 * wiec CTR karty liczymy osobno, od wizyt na karcie.
 */
export function recordBannerClick(): number {
  const clicks = readCounter(STORAGE_KEY_BANNER) + 1;
  writeCounter(STORAGE_KEY_BANNER, clicks);
  const timestamp = new Date().toISOString();
  console.log("panel_banner_click", { timestamp });
  track("panel_banner_click", { timestamp });
  return clicks;
}
