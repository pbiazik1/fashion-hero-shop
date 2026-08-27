import posthog from "posthog-js";

/*
 * PostHog — chmura US (`https://us.i.posthog.com`). Region zmieniasz samym
 * NEXT_PUBLIC_POSTHOG_HOST; `ui_host` (adres, pod ktory linkuje toolbar) wyliczamy z niego,
 * zeby nie dalo sie ustawic regionu polowicznie.
 *
 * Init robimy na poziomie modulu, a nie w useEffect — efekty dzieci odpalaja sie PRZED efektem
 * rodzica, wiec przy inicjalizacji w providerze pierwszy `fake_door_view` wypadlby przed
 * zaladowaniem PostHoga. Import tego modulu gwarantuje, ze klient jest gotowy zanim ktokolwiek
 * wywola capture().
 *
 * Bez NEXT_PUBLIC_POSTHOG_KEY nic sie nie inicjalizuje — dev/build dzialaja normalnie,
 * a eventy leca wtedy tylko do console.log + localStorage.
 */
const POSTHOG_KEY = process.env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = process.env.NEXT_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";

/*
 * `us.i.posthog.com` → `us.posthog.com`. Dla wlasnego reverse proxy zwracamy null —
 * wtedy PostHog sam sobie radzi, zamiast linkowac w zly region.
 */
function resolveUiHost(apiHost: string): string | null {
  const match = /^https:\/\/(us|eu)\.i\.posthog\.com\/?$/.exec(apiHost);
  return match ? `https://${match[1]}.posthog.com` : null;
}

export const isPostHogConfigured = Boolean(POSTHOG_KEY);

if (typeof window !== "undefined" && POSTHOG_KEY && !posthog.__loaded) {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
    ui_host: resolveUiHost(POSTHOG_HOST),
    // 'history_change' — pageview'y same lapia nawigacje App Routera (bez recznego trackowania).
    defaults: "2026-08-30",
    person_profiles: "identified_only",
  });
}

/**
 * Wysyla event do PostHog, o ile jest skonfigurowany. Analityka nigdy nie wywraca UI.
 *
 * Warunkiem jest obecnosc klucza, a NIE `posthog.__loaded` — ta flaga zapala sie dopiero po
 * asynchronicznym pobraniu remote config, czyli grubo po zamontowaniu karty. Gdybysmy na nia
 * czekali, pierwszy `fake_door_view` (mianownik metryki at-1a-1) wypadalby przy kazdym
 * pierwszym wejsciu na strone.
 */
export function track(event: string, properties: Record<string, unknown>) {
  try {
    if (typeof window === "undefined" || !isPostHogConfigured) return;
    posthog.capture(event, properties);
  } catch {
    // ignorujemy bledy analityki
  }
}

export { posthog };
