# Feature: Sponsorowane Listingi — fake-door prototyp (test at-1a-1)

> Źródło: OST Stream B (super-brain, `3-Projects/fashion-hero/decisions/2026-08-25-ost-stream-b.md`),
> assumption test `at-1a-1`, solution `sol-1a`, opportunity `opp-1` (Widoczność).
> Feature Spec zweryfikowany skillem `spec-checker`: **10/10 READY** (2026-08-27).

## Typ prototypu: SMOKE TEST (landing + CTA)

Testujemy **desirability** — czy sprzedawcy chcą licytować o widoczność. Nie testujemy usability
(nie ma flow do zrozumienia) ani value delivery (nic realnie nie dostarczamy pod spodem — to nie
wizard-of-oz). Klik w CTA = jedyny sygnał, którego szukamy.

## Sygnał sukcesu (zdefiniowany PRZED buildem)

- **Co liczymy:** kliknięcia CTA "Zapisz się na wczesny dostęp" → event `fake_door_click`, jako
  % odwiedzin karty (symulowana próba n≈500 dla celów tego prototypu/certyfikacji — to case
  study, nie realny rollout do prawdziwych sprzedawców FashionHero).
- **Próg sukcesu:** ≥8% → buduj płatny pilot (at-1a-2).
- **Próg porażki:** <8% wg OST = "zbadaj głębiej, nie buduj jeszcze". Dodatkowy, autorski podział
  (nieobecny w OST, do potwierdzenia): <3% = zabij koncept, 3–8% = strefa niejednoznaczna,
  porozmawiaj jakościowo z nieklikającymi zanim zdecydujesz.

---

## Project Config — dodatek dla tej funkcji

Bazowe zasady tech/stylu bierz z `AGENTS.md` (Next.js 16 App Router, TypeScript strict, shadcn/ui,
Tailwind v4, named exports, mobile-first) — **nie duplikuj ich tutaj**. Poniżej tylko to, co
specyficzne dla tego fake-doora.

ROLE: Budujesz jeden nowy, samodzielny widok (nie zmieniasz istniejących stron kupującego), który
symuluje panel sprzedawcy z kartą promującą "Sponsorowane listingi".

### Wytyczne designu
- Reużyj istniejące tokeny/klasy z tej aplikacji (`text-charcoal`, `text-warm-gray`,
  `btn-cta-outline`, komponenty z `src/components/ui/`) — nie wymyślaj nowego stylu wizualnego.
- To NIE jest faza klonowania Allbirds (`TARGET.md` nie dotyczy tego widoku) — tu masz swobodę
  co do layoutu karty, o ile trzyma się istniejącego języka wizualnego appki.
- Jedna karta, jeden mockup przed/po (#15→#2), jeden CTA. Zero dodatkowej nawigacji.

### Granice

ALWAYS:
- Loguj każde kliknięcie CTA jako zdarzenie `fake_door_click` (seller_id, timestamp) — na start
  wystarczy `console.log` + trzymanie licznika w lokalnym stanie/localStorage, żeby dało się
  pokazać wynik na demo/certyfikacji. Realna integracja analityki to NIE jest wymóg tego kroku.
- Pokazuj ekran/stan potwierdzenia po kliknięciu.
- Oznaczaj mockup wyników wyszukiwania etykietą "Sponsorowane".

ASK FIRST:
- Przed dodaniem nowej trasy do głównej nawigacji (`header.tsx`, `mega-menu.tsx`) — panel
  sprzedawcy może być dostępny bezpośrednim URL-em, nie musi być wpięty w menu kupującego.
  Powiedz mi, którą opcję wolisz, zanim to wepniesz.
- Przed dodaniem nowej zależności/biblioteki (np. do trackingu zdarzeń).
- Przed zmianą progu sukcesu (8%) lub definicji zdarzenia sukcesu.

NEVER:
- Nigdy nie dotykaj istniejących stron/komponentów kupującego (`checkout`, `cart-provider`,
  `auth-provider`, `wishlist-*`, `products/[slug]`, itd.) — ten feature żyje w izolacji.
- Nigdy nie podłączaj prawdziwej płatności/bramki płatniczej — CTA nie musi nigdzie prowadzić.
- Nigdy nie dodawaj logowania/rejestracji dla sprzedawców — wejście wprost do zmockowanego panelu
  pod jednym URL-em, bez auth-gate.
- Nigdy nie buduj realnego mechanizmu aukcyjnego/rankingowego — tylko statyczna wizualizacja.

---

## Feature Spec

**OPPORTUNITY:** Jako sprzedawca chcę być łatwo zauważalny wśród tysięcy ofert — dziś czuję się
niewidoczny niezależnie od jakości oferty (Kamil: "żeby ktoś mnie zobaczył").
**OUTCOME:** ≥8% z symulowanych ~500 eksponowanych sprzedawców klika "Zapisz się na wczesny
dostęp" (test at-1a-1) — sygnał: budować płatny pilot (at-1a-2) czy szukać głębiej.

### Co budujemy
Nowy widok (np. `/seller-panel` lub `/sellers/dashboard` — do potwierdzenia z ASK FIRST powyżej)
z kartą ogłaszającą "Sponsorowane listingi": opis (budżet, podbicie pozycji, etykieta
"Sponsorowane") i mockup pozycji przed/po. CTA "Zapisz się na wczesny dostęp" nie prowadzi
nigdzie poza zalogowaniem zdarzenia.

### User flow
1. Sprzedawca otwiera panel sprzedawcy (bezpośredni URL, bez logowania).
2. Widzi kartę z opisem i mockupem #15→#2.
3. Klika "Zapisz się na wczesny dostęp".
4. System loguje zdarzenie i pokazuje potwierdzenie.

### Kryteria akceptacji
- Karta zawiera opis (budżet, podbicie pozycji, etykietę "Sponsorowane") i mockup #15→#2.
- Kliknięcie CTA zapisuje event `fake_door_click` z `seller_id` i `timestamp`.
- Po kliknięciu pojawia się ekran/stan potwierdzenia.
- Mockup wyników wyszukiwania ma widoczną etykietę "Sponsorowane".
- Zalogowane eventy da się policzyć (licznik widoczny w UI albo w konsoli/localStorage) —
  wystarczające do zademonstrowania % kliknięć na potrzeby certyfikacji.

### Czego NIE budujemy
- Prawdziwy silnik aukcyjny/rankingowy.
- Płatności/billing.
- Panel zarządzania kampanią (budżet, harmonogram, targetowanie).
- Logowanie/rejestracja sprzedawców.

### Przykłady
Input: sprzedawca "Kamil" otwiera panel i klika CTA.
Oczekiwany rezultat: system zapisuje `fake_door_click {seller_id: "kamil", timestamp}`,
użytkownik widzi "Dziękujemy, odezwiemy się wkrótce".

---

## Aneks (2026-08-27) — świadome odstępstwa od specu

Po zbudowaniu pierwszej wersji okazało się, że fake door pod gołym URL-em nie ma źródła ruchu,
więc metryka "% odwiedzin karty" nie miała jak powstać. Decyzją właściciela produktu dobudowano
ścieżkę dojścia. Poniższe punkty **świadomie łamią oryginalne granice** — spis jest tu po to,
żeby rozjazd między specem 10/10 a kodem był jawny, a nie ukryty.

| Zmiana | Status wobec oryginalnego specu |
|---|---|
| Zmockowany dashboard sprzedawcy na `/seller-panel` | Rozszerzenie. Zgodne z duchem (kontekst dla karty). |
| Baner "Chcesz zwiększyć swoją widoczność?" jako wejście do karty | Rozszerzenie. Górny krok lejka. |
| Karta fake-doora przeniesiona na `/seller-panel/sponsored` | Zmiana trasy, bez zmiany zakresu karty. |
| Atrapa ekranu logowania na `/seller-panel/login` | **Łamie NEVER** ("Nigdy nie dodawaj logowania/rejestracji dla sprzedawców"). Nie waliduje danych, nie tworzy sesji, nie chroni panelu — panel działa też bezpośrednim URL-em. |
| Link "Sprzedawaj" w `header.tsx` | **Łamie NEVER** ("Nigdy nie dotykaj istniejących komponentów kupującego"). Zatwierdzone przez ASK FIRST. |

### Wpływ na pomiar — do uwzględnienia przy interpretacji wyniku

- **Sygnał sukcesu pozostaje bez zmian:** wizyta na karcie → klik w CTA, próg ≥8%. Progu ani
  definicji eventu `fake_door_click` nie ruszano.
- **Ale publiczność karty nie jest już zimna.** Kto przychodzi przez baner, jest wstępnie
  zainteresowany, więc CTR karty będzie zawyżony względem oryginalnego założenia. Wyniku
  ≥8% z tego lejka **nie wolno czytać jako równoważnego** progowi z OST.
- Klikalność banera liczona jest osobno (`panel_banner_click`) i **nie jest** sygnałem sukcesu.
- Atrapa logowania dokłada krok odpadu przed kartą — jeśli wynik wyjdzie poniżej progu, sprawdź
  najpierw, ilu ludzi odpadło na loginie, zanim uznasz to za brak zainteresowania ofertą.
