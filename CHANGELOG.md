# Changelog

What changed in slow garden, newest first.

Written for the person using the app, not for the person who wrote it — a line
here should mean something to someone who has never opened the repo. Anything
purely internal is left out.

The releases below `1.0.0` were reconstructed from the commit history after the
fact, and grouped by the day's work rather than by a real release. From `1.4.0`
onward they are written as the work lands.

---

## Unreleased

### Added
- A private wiki of the deck — one page per card, gathering its meanings, keywords,
  themes, scent accord, artwork subject and house readings onto a single page.
  Generated from the app's own data by `npm run wiki` into the vault, so it can't
  drift from what the app actually says.
- `CONTRIBUTING.md`, and this changelog.

### Changed
- The README now describes the app as it actually is — the stack had drifted three
  major versions, and the share cards, scents and supporter unlock weren't mentioned.

---

## 1.3.0 — 2026-08-28

**Share your reading.**

### Added
- Export a reading as a 1080×1920 story card, ready for Instagram. Four treatments:
  a full-bleed image, two typographic plates, and a stamp.
- A share sheet styled after an old DVD menu — deep navy, pixel type, transport
  arrows — with the templates on a rail you swipe rather than buttons you read.
- Exports are named for the day and the card: `2026-08-28_the-world.png`.

### Fixed
- Reversed draws share their reversed reading. They had been sharing the upright one.
- The plates say which way up the card came, rather than truncating the question.
- Court cards no longer print a roman numeral they don't have.
- Cards beginning with "the" keep it on the stamp.
- The treatments were silently doing nothing on iOS, so the colours came out wrong
  on exactly the device most people share from.

---

## 1.2.0 — 2026-08-20 → 08-21

**Launch.**

### Added
- The app answers to **slow garden** throughout.
- Seven free readings instead of three.
- Supporters unlock the app for good. A gift on Buy Me a Coffee returns a code that
  works forever, with no account and no database behind it.
- A warning before a social-media in-app browser swallows your garden — those
  browsers throw away everything you've written when they close.
- Error tracking, with everything about the reader stripped out before it is sent.
- A content security policy and a full set of security headers.
- Terms of use, and a privacy policy that reads as a document rather than as the app.

### Changed
- Geocode lookups are cached, and every rate-limit call now has a clock on it, so a
  slow network can't hold up a reading.
- The city field types in capitals, matching the name field.
- Desktop onboarding places its fields where mobile does.

### Fixed
- Location permission was broken in production by a header meant to protect it.
- Error reports were being silently dropped before they left the browser.
- A row of onboarding bugs that only appeared on real phones: the keyboard shoving
  the layout around, steps opening halfway down, the page dragging off its canvas.

---

## 1.1.0 — 2026-08-16

**The reading page.**

### Added
- Every card carries a perfumer's accord — top, heart and base notes — printed in
  full on the reading page.
- Fifteen scent recipes revised.
- The card holds its place through the tear-away.

### Fixed
- The reading fits its space, and the date develops in with the page.
- The year drawer fades its top edge instead of slicing content in half.

---

## 1.0.0 — 2026-08-15

First release. A card a day, a place to write, and a year to look back on.
