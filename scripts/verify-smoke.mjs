/*
 * Smoke test przechodzacy krytyczne sciezki w prawdziwej przegladarce.
 *
 * Uruchomienie:  npm run dev   (osobny terminal)
 *                npm run verify
 *
 * Repo nie ma testow jednostkowych — to jedyna siatka, ktora lapie regresje
 * w localStorage, filtrach PLP i lejku fake-doora at-1a-1.
 */

import { chromium } from "playwright";

const BASE = process.env.VERIFY_BASE_URL || "http://localhost:3000";
const VIEWPORT = { width: 1440, height: 900 };

const results = [];
const consoleErrors = [];

function check(name, passed, detail) {
  results.push({ name, passed, detail });
  console.log(`${passed ? "PASS" : "FAIL"}  ${name}${detail ? "  — " + detail : ""}`);
}

function watch(page) {
  page.on("console", (m) => {
    if (m.type() === "error") consoleErrors.push(m.text().slice(0, 200));
  });
  page.on("pageerror", (e) => consoleErrors.push("pageerror: " + e.message.slice(0, 200)));
}

/* ------------------------------------------------------------------ */
/* Sciezki kupujacego                                                  */
/* ------------------------------------------------------------------ */
async function buyerFlows(browser) {
  console.log("\n--- Sciezki kupujacego ---");
  const page = await browser.newPage({ viewport: VIEWPORT });
  watch(page);

  // Wishlist — trwalosc w localStorage
  await page.goto(`${BASE}/collections/mens`, { waitUntil: "networkidle" });
  await page
    .locator(".group")
    .filter({ has: page.locator('[aria-label="Add to wishlist"]') })
    .first()
    .hover();
  await page.locator('[aria-label="Add to wishlist"]').first().click();
  await page.waitForTimeout(300);

  const stored = await page.evaluate(() => localStorage.getItem("stepforward-wishlist"));
  check("Wishlist — klik zapisuje do localStorage", !!stored && JSON.parse(stored).length === 1, stored);

  await page.reload({ waitUntil: "networkidle" });
  const afterReload = await page.evaluate(() => localStorage.getItem("stepforward-wishlist"));
  const hearts = await page.locator('[aria-label="Remove from wishlist"]').count();
  check("Wishlist — przetrwal odswiezenie", afterReload === stored && hearts >= 1, `serc = ${hearts}`);

  const badge = await page.locator('a[aria-label="Wishlist"] span').first().textContent().catch(() => null);
  check("Wishlist — licznik w headerze", badge === "1", `licznik = ${badge}`);

  // Auth — trwalosc sesji
  await page.goto(`${BASE}/account/login`, { waitUntil: "networkidle" });
  await page.locator("#email").fill("kamil@example.com");
  await page.locator("#password").fill("haslo123");
  await page.getByRole("button", { name: "SIGN IN" }).click();
  await page.waitForTimeout(800);

  const user = await page.evaluate(() => localStorage.getItem("stepforward_user"));
  check("Auth — logowanie zapisuje uzytkownika", !!user && user.includes("kamil@example.com"), user);

  await page.reload({ waitUntil: "networkidle" });
  const initial = await page.locator('a[aria-label="Account"] span').first().textContent().catch(() => null);
  check("Auth — sesja przetrwala odswiezenie", initial === "K", `inicjal = ${initial}`);

  // Search modal — montowany warunkowo, wiec stan resetuje sie sam
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  const modalInput = () => page.locator("div.fixed.inset-0.z-50 input").first();

  await page.locator('button[aria-label="Search"]').click();
  await page.waitForTimeout(300);
  await page.keyboard.type("run");
  await page.waitForTimeout(400);
  check("Search — wpisany tekst widoczny", (await modalInput().inputValue()) === "run", "");

  await page.keyboard.press("Escape");
  await page.waitForTimeout(400);
  check("Search — Escape zamyka modal", (await page.locator(".backdrop-blur-sm").count()) === 0, "");
  check(
    "Search — scroll przywrocony",
    (await page.evaluate(() => document.body.style.overflow)) === "",
    ""
  );

  await page.locator('button[aria-label="Search"]').click();
  await page.waitForTimeout(400);
  check("Search — pole puste po ponownym otwarciu", (await modalInput().inputValue()) === "", "");
  await page.keyboard.press("Escape");
  await page.waitForTimeout(300);

  // Koszyk — link zamyka szuflade (Link nawiguje po stronie klienta)
  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.locator('button[aria-label="View Cart"]').click();
  await page.waitForTimeout(500);
  check("Koszyk — pusta szuflada z linkami", await page.getByRole("link", { name: "SHOP WOMENS" }).isVisible(), "");

  await page.getByRole("link", { name: "SHOP WOMENS" }).click();
  await page.waitForURL("**/collections/womens", { timeout: 10000 });
  await page.waitForTimeout(600);
  check("Koszyk — nawigacja do kolekcji", page.url().includes("/collections/womens"), page.url());

  // Szuflada zostaje w DOM i chowa sie transformem — isVisible() nie jest miarodajne.
  const cls = await page.locator("div.fixed.top-0.right-0").first().getAttribute("class");
  check(
    "Koszyk — szuflada zamknieta po nawigacji",
    (cls || "").includes("translate-x-full"),
    (cls || "").split(" ").filter((c) => c.includes("translate")).join(" ")
  );

  // Filtry PLP — checkbox musi faktycznie zawezac liste
  await page.goto(`${BASE}/collections/mens`, { waitUntil: "networkidle" });
  const count = async () => parseInt(await page.locator("text=/^\\d+ products?$/").first().textContent(), 10);
  const cards = () =>
    page.locator('[aria-label="Add to wishlist"], [aria-label="Remove from wishlist"]').count();

  const n0 = await count();
  const c0 = await cards();

  // Uwaga: pierwszy checkbox to "All" w filtrze plci — na /collections/mens to no-op.
  const runner = page
    .locator("label")
    .filter({ hasText: /^Runner$/ })
    .locator('input[type="checkbox"]')
    .first();

  await runner.check({ force: true });
  await page.waitForTimeout(600);
  const n1 = await count();
  check("Filtry — klik zaweza liste", n1 < n0 && n1 > 0, `${n0} -> ${n1}`);
  check("Filtry — siatka sie zawezila", (await cards()) < c0, `kart ${c0} -> ${await cards()}`);

  await runner.uncheck({ force: true });
  await page.waitForTimeout(600);
  check("Filtry — odznaczenie przywraca liste", (await count()) === n0, `= ${n0}`);

  await runner.focus();
  await page.keyboard.press("Space");
  await page.waitForTimeout(600);
  check(
    "Filtry — obsluga klawiatury (Space)",
    (await runner.isChecked()) && (await count()) < n0,
    `${n0} -> ${await count()}`
  );

  await page.close();
}

/* ------------------------------------------------------------------ */
/* Lejek fake-doora at-1a-1                                            */
/* ------------------------------------------------------------------ */
async function fakeDoorFunnel(browser) {
  console.log("\n--- Lejek fake-doora at-1a-1 ---");
  const page = await browser.newPage({ viewport: VIEWPORT });
  const logs = [];
  page.on("console", (m) => {
    logs.push(m.text());
    if (m.type() === "error") consoleErrors.push(m.text().slice(0, 200));
  });
  page.on("pageerror", (e) => consoleErrors.push("pageerror: " + e.message.slice(0, 200)));

  await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  await page.getByRole("link", { name: "Sprzedawaj" }).first().click();
  await page.waitForURL("**/seller-panel/login", { timeout: 10000 });
  check("Lejek — header prowadzi do logowania", page.url().includes("/seller-panel/login"), "");

  await page.getByRole("button", { name: "Zaloguj się" }).click();
  await page.waitForURL("**/seller-panel", { timeout: 10000 });
  check("Lejek — logowanie przepuszcza do panelu", page.url().endsWith("/seller-panel"), "");

  check("Panel — wita sprzedawce", await page.getByRole("heading", { name: /Cześć, Kamil/ }).isVisible(), "");
  check("Panel — oferty z pozycjami", (await page.locator("text=/pozycja #\\d+/").count()) === 3, "");
  check(
    "Panel — baner obecny",
    await page.getByRole("heading", { name: /Chcesz zwiększyć swoją widoczność/ }).isVisible(),
    ""
  );

  await page.getByRole("link", { name: "Dowiedz się więcej" }).click();
  await page.waitForURL("**/seller-panel/sponsored", { timeout: 10000 });
  check("Lejek — baner prowadzi do karty", page.url().includes("/sponsored"), "");

  const bannerClicks = await page.evaluate(() =>
    localStorage.getItem("fashionhero-panel-banner-clicks")
  );
  check("Lejek — klik w baner policzony osobno", bannerClicks === "1", `panel_banner_click = ${bannerClicks}`);

  check("Karta — mockup #15 (przed)", await page.locator("text=/Dziś — pozycja #15/").isVisible(), "");
  check("Karta — mockup #2 (po)", await page.locator("text=/Ze sponsorowaniem — pozycja #2/").isVisible(), "");
  check("Karta — etykieta „Sponsorowane”", (await page.locator("text=Sponsorowane").count()) >= 1, "");
  check("Karta — opis zawiera budzet", await page.locator("text=/dzienny budżet/i").isVisible(), "");

  const views = await page.evaluate(() => localStorage.getItem("fashionhero-fake-door-views"));
  check("Karta — wizyta policzona (mianownik)", views === "1", `views = ${views}`);

  await page.getByRole("button", { name: "Zapisz się na wczesny dostęp" }).click();
  await page.waitForTimeout(500);

  check("CTA — potwierdzenie widoczne", await page.locator("text=Dziękujemy, odezwiemy się wkrótce").isVisible(), "");
  check(
    "CTA — przycisk zastapiony potwierdzeniem",
    (await page.getByRole("button", { name: "Zapisz się na wczesny dostęp" }).count()) === 0,
    ""
  );

  const raw = await page.evaluate(() => localStorage.getItem("fashionhero-fake-door-clicks"));
  const events = raw ? JSON.parse(raw) : [];
  const ev = events[0] || {};
  check(
    "CTA — event fake_door_click z seller_id i timestamp",
    events.length === 1 &&
      ev.event === "fake_door_click" &&
      ev.seller_id === "kamil" &&
      !Number.isNaN(Date.parse(ev.timestamp)),
    JSON.stringify(ev)
  );
  check(
    "CTA — event trafil do konsoli",
    logs.some((l) => l.includes("fake_door_click") && l.includes("kamil")),
    ""
  );

  await page.close();
}

/* ------------------------------------------------------------------ */

(async () => {
  let browser;
  try {
    browser = await chromium.launch();
  } catch (e) {
    console.error("Nie udalo sie uruchomic Chromium. Zainstaluj: npx playwright install chromium");
    console.error(e.message);
    process.exit(1);
  }

  try {
    await buyerFlows(browser);
    await fakeDoorFunnel(browser);
  } catch (e) {
    console.error(`\nPrzerwano wyjatkiem: ${e.message}`);
    console.error(`Czy serwer dev dziala pod ${BASE}?`);
    results.push({ name: "wykonanie skryptu", passed: false, detail: e.message });
  } finally {
    await browser.close();
  }

  const failed = results.filter((r) => !r.passed);
  console.log("\n================ PODSUMOWANIE ================");
  console.log(`Testow: ${results.length}, PASS: ${results.length - failed.length}, FAIL: ${failed.length}`);
  if (failed.length) {
    console.log("\nNIEUDANE:");
    failed.forEach((f) => console.log(`  - ${f.name}: ${f.detail}`));
  }
  console.log(`Bledy konsoli przegladarki: ${consoleErrors.length}`);
  consoleErrors.slice(0, 10).forEach((e) => console.log("  " + e));

  process.exit(failed.length || consoleErrors.length ? 1 : 0);
})();
