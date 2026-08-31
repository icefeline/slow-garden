# slow garden

A quiet daily tarot app. One card a day, a space to reflect, a year to look back on.

Live at **[slowww.garden](https://slowww.garden)**.

---

## what it is

slow garden is a personal tarot companion built for people who want a moment of stillness each day — not a rushed reading, not a feed, just a single card and whatever it surfaces.

You draw once a day. You can write a reflection. At the end of the year, you have a quiet archive of where you've been.

---

## features

- **daily card** — one tarot card per day, seeded to your birthdate for a touch of personalisation. upright or reversed.
- **reflection** — a freeform space to write after your draw. no prompts, no structure.
- **year view** — a full-year calendar of every card you've drawn. scrollable on mobile, a minimal column grid on desktop.
- **personalised onboarding** — slow garden asks for your name, birthdate (and optionally birth time and location) and writes you a short welcome message based on your sun sign, moon sign, and rising — or just your sun and life path number if that's all you share.
- **drag to begin** — after the welcome message, you drag a card to start. a small ritual.
- **scent** — every card carries a perfumer's three-tier accord: top, heart, base.
- **share cards** — export a reading as a 1080×1920 story card in one of four treatments, from a share sheet styled after an old DVD menu.
- **supporter unlock** — a gift on Buy Me a Coffee unlocks unlimited readings forever, with no account and no database.
- **works on mobile and desktop** — fully responsive. desktop shows a device frame; mobile is full screen.

---

## stack

- [Next.js 16](https://nextjs.org/) (App Router, Turbopack)
- [React 18](https://react.dev/)
- [Tailwind CSS v3](https://tailwindcss.com/)
- TypeScript
- [Upstash Redis](https://upstash.com/) — rate limiting only, fail-open
- [Sentry](https://sentry.io/) (EU region) — errors, with PII scrubbed before send
- [Vercel Analytics](https://vercel.com/analytics) — aggregate page counts
- [Claude](https://www.anthropic.com/) — welcome and insight copy
- Local storage for everything you write. No accounts, no user database.

---

## running locally

```bash
git clone https://github.com/icefeline/slow-hour.git
cd slow-hour
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Copy `.env.example` to `.env.local` and fill it in — the app runs without most of the keys, degrading rather than failing.

> The GitHub repo and the vercel.app subdomain are still named `slow-hour`; the app was renamed in August 2026 and those two names have not caught up yet.

### scripts

| | |
| --- | --- |
| `npm run dev` | dev server on :3000 |
| `npm run build` | production build |
| `npm run lint` | eslint |
| `npm run mint` | mint a supporter unlock code by hand |
| `npm run wiki` | regenerate the private card wiki into the Obsidian vault |
| `npm test` | **currently broken** — jest is configured in `package.json` but not installed |

---

## project structure

```
app/
  components/
    Onboarding.tsx        # welcome flow (name → birthdate → message → drag to begin)
    YearView.tsx          # full-year calendar view
    TarotCard.tsx         # individual card component
    CardDrawer.tsx        # bottom sheet for past card detail
    ShareModal.tsx        # the DVD-menu share sheet
    ActiveInsight.tsx     # transit / insight ticker
  api/
    daily-card/           # card of the day
    calculate-transit/    # astrological transit calculation
    welcome-insight/      # onboarding copy
    geocode-check/        # birth location lookup
    unlock/               # supporter code verification
    bmc-webhook/          # Buy Me a Coffee donation hook
  privacy/                # privacy policy
  page.tsx                # main app shell
lib/
  data/                   # the deck and everything authored about it
  utils/
    share-card.ts         # canvas renderers for the four share templates
    unlock.ts             # HMAC-signed supporter codes
    sentry-scrub.ts       # strips PII before anything leaves the device
    webview.ts            # in-app browser detection
  types/
scripts/
  build-card-wiki.mts     # generates the private card wiki
  mint-unlock.mts         # mints a supporter code
public/
  cards/                  # card image assets
```

---

## the card data

Everything authored about the deck lives in `lib/data/`, split by what reads it:

| file | what it holds |
| --- | --- |
| `tarot-deck.ts` | the 78 cards — names, meanings, keywords, art paths |
| `card-archetypes.ts` | themes, tone, and phrasing the insight writer draws on |
| `card-scents.ts` | a three-tier scent accord per card |
| `card-trace-subjects.ts` | the one element of each artwork the trace card picks out |
| `card-house-insights.ts` | per-house readings, authored for ten cards so far |

These files are the source of truth. `npm run wiki` gathers them into one readable page per card in the private vault at `icefeline/slow-garden-vault` — read the deck there, edit it here.

---

## design notes

- **no accounts** — everything you write lives in `localStorage` and never leaves your device.
- **one draw per day** — the card is locked once revealed. come back tomorrow.
- **fail-open** — rate limiting, geocoding and insight generation all degrade rather than block. a reading always completes.
- **fonts** — Reenie Beanie (handwritten) for body and headings; VT323 (monospace) for calendar numerals and the share sheet.
- **colours** — `#172211` (dark green), `#CEF17B` (yellow-green accent), `#E1EEFC` (pale blue for text and the onboarding screen), `#010179` (the share sheet's deep navy).

---

## privacy

Readings, reflections and birth details stay in `localStorage`. What does leave the device is documented in the [privacy policy](https://slowww.garden/privacy): aggregate analytics, scrubbed error reports, and the birth details sent once to generate a welcome message.

---

## contributing

Work is tracked in [issues](https://github.com/icefeline/slow-hour/issues) and lands through pull requests — see [CONTRIBUTING.md](CONTRIBUTING.md). Released changes are in [CHANGELOG.md](CHANGELOG.md).

---

## licence

personal project. not for redistribution.
