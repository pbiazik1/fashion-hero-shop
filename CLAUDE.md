@AGENTS.md

## Git / GitHub Policy

This repo is a personal fork (`biazikprzemek-arch/fashion-hero-shop`) of a template repo (`strzalex/fashion-hero-shop`). This is an independent project, not a contribution to the upstream template.

- The only remote is `origin`, pointing at the fork. Never add a push-capable `upstream` remote.
- Always commit and push directly to `origin` (this fork). Never open a PR/branch comparison against `strzalex/fashion-hero-shop`.
- If a PR is ever created with `gh pr create`, always pass an explicit `--repo biazikprzemek-arch/fashion-hero-shop` (or run `gh repo set-default biazikprzemek-arch/fashion-hero-shop` once beforehand) so it never defaults to the upstream template repo.

### Local safety net

This clone has:
- `remote.pushDefault = origin` and `push.default = current` — a bare `git push` always targets `origin` (this fork), never anything else.
- `core.hooksPath = scripts/git-hooks` — a `pre-push` hook (`scripts/git-hooks/pre-push`) that refuses any push whose remote URL matches `strzalex/fashion-hero-shop`.

On a fresh clone, re-enable the hook with:
```bash
git config core.hooksPath scripts/git-hooks
```

## Current Feature: Sponsorowane Listingi (fake-door, test at-1a-1)

Pracujemy teraz nad jednym, izolowanym feature'em spoza zakresu clone-website: fake-door prototyp
testujący, czy sprzedawcy chcą płacić za widoczność w wynikach wyszukiwania. Pełny spec (Project
Config addendum + Feature Spec, zweryfikowany spec-checkerem na 10/10) w:

@docs/features/at-1a-1-sponsored-listings.md

Ten spec ma pierwszeństwo nad ogólnymi zasadami clone-website z AGENTS.md w zakresie WYTYCZNYCH
DESIGNU I GRANIC dla tego konkretnego widoku (nie jesteśmy już w fazie klonowania Allbirds) — ale
zasady tech stacku/stylu kodu z AGENTS.md nadal obowiązują.
