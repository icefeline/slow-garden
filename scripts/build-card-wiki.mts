/**
 * Builds the private card wiki — one page per card — into the Obsidian vault.
 *
 * Everything the app knows about a card is scattered across six data files,
 * because each one is shaped for the code that reads it. Nobody can hold a card
 * in their head that way. This gathers all of it onto one page per card, so the
 * deck can be read as a deck rather than as six parallel lists.
 *
 * The pages are generated, never hand-edited: the data files stay the single
 * source of truth, and re-running this after a data change is the only way the
 * wiki is meant to be updated. Anything written by hand here is lost on the next
 * run — hand-written thinking belongs in the vault's own notes, which the pages
 * link out to.
 *
 * Output is Obsidian-flavoured markdown in a private repo. Wikilinks resolve
 * inside the vault; frontmatter drives Obsidian's own search and graph.
 *
 *   npm run wiki
 */
import { writeFileSync, mkdirSync, readdirSync, rmSync } from 'node:fs';
import { join } from 'node:path';

import { tarotDeck } from '../lib/data/tarot-deck.ts';
import { cardArchetypes } from '../lib/data/card-archetypes.ts';
import { cardScents } from '../lib/data/card-scents.ts';
import { cardTraceSubjects } from '../lib/data/card-trace-subjects.ts';
import { CARD_HOUSE_INSIGHTS } from '../lib/data/card-house-insights.ts';

const VAULT = '/Users/katana/slow-garden';
const OUT = join(VAULT, 'cards');

const SUITE_LABEL: Record<string, string> = {
  major: 'Major Arcana',
  cups: 'Cups',
  wands: 'Wands',
  swords: 'Swords',
  pentacles: 'Pentacles',
};

/** Court cards carry numbers 11–14 in the deck data but are never numbered on the page. */
const isCourt = (id: string) => /-(page|knight|queen|king)$/.test(id);

const ROMAN: [number, string][] = [
  [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'],
  [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
];
function roman(n: number): string {
  if (n === 0) return '0';
  let out = '';
  for (const [v, s] of ROMAN) while (n >= v) { out += s; n -= v; }
  return out;
}

/** The house insights are keyed by a loose slug of the card name, not by card id. */
function houseKey(name: string): string {
  return name.toLowerCase().replace(/^the /, '').replace(/\s+/g, '-');
}

const slug = (name: string) => name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

const list = (items: string[] | undefined) =>
  items?.length ? items.map((i) => `- ${i}`).join('\n') : '_none recorded_';

const inline = (items: string[] | undefined) =>
  items?.length ? items.join(', ') : '_none recorded_';

function page(card: (typeof tarotDeck)[number]): string {
  const arch = cardArchetypes[card.id];
  const scent = cardScents[card.id];
  const trace = cardTraceSubjects[card.id];
  const houses = CARD_HOUSE_INSIGHTS[houseKey(card.name)];

  const numeral =
    typeof card.number === 'number' && !isCourt(card.id)
      ? card.suite === 'major'
        ? roman(card.number)
        : String(card.number)
      : null;

  const parts: string[] = [];

  parts.push(
    '---',
    `title: ${card.name}`,
    `id: ${card.id}`,
    `suite: ${card.suite}`,
    numeral ? `numeral: "${numeral}"` : null,
    `tone-upright: ${arch?.upright.emotionalTone ?? 'unknown'}`,
    `tone-reversed: ${arch?.reversed.emotionalTone ?? 'unknown'}`,
    'tags:',
    `  - card/${card.suite}`,
    ...(arch ? [`  - tone/${arch.upright.emotionalTone}`] : []),
    'generated: true',
    '---',
    '',
    `# ${card.name}`,
    '',
    `${SUITE_LABEL[card.suite] ?? card.suite}${numeral ? ` · ${numeral}` : ''}`,
    '',
    `> ${card.description}`,
    '',
    '> [!warning] Generated page',
    '> Built by `npm run wiki` from the app\'s data files. Edits here are overwritten.',
    '> Write loose thinking in [[card meanings]] or a note of your own instead.',
    '',
    '## Upright',
    '',
    card.uprightMeaning,
    '',
    `**Keywords** — ${inline(card.uprightKeywords)}`,
    ''
  );

  if (arch) {
    parts.push(
      `**Core themes** — ${inline(arch.upright.coreThemes)}`,
      '',
      `**Psychological focus** — ${inline(arch.upright.psychologicalFocus)}`,
      '',
      `**Action qualities** — ${inline(arch.upright.actionQualities)}`,
      '',
      '**Phrases the insight writer may reach for**',
      '',
      list(arch.upright.naturalPhrases),
      ''
    );
  }

  parts.push('## Reversed', '', card.reversedMeaning, '', `**Keywords** — ${inline(card.reversedKeywords)}`, '');

  if (arch) {
    parts.push(
      `**Core themes** — ${inline(arch.reversed.coreThemes)}`,
      '',
      `**Psychological focus** — ${inline(arch.reversed.psychologicalFocus)}`,
      '',
      `**Action qualities** — ${inline(arch.reversed.actionQualities)}`,
      '',
      '**Phrases the insight writer may reach for**',
      '',
      list(arch.reversed.naturalPhrases),
      ''
    );
  }

  if (scent) {
    const count = scent.top.length + scent.heart.length + scent.base.length;
    parts.push(
      '## Scent',
      '',
      `${count} notes, in perfumery's three tiers — what you meet first, the body of it, what is still there hours later.`,
      '',
      `| Tier | Notes |`,
      `| --- | --- |`,
      `| Top | ${scent.top.join(', ')} |`,
      `| Heart | ${scent.heart.join(', ')} |`,
      `| Base | ${scent.base.join(', ')} |`,
      '',
      'Recipe notes live in [[botanical scent recipes]].',
      ''
    );
  }

  if (trace) {
    parts.push(
      '## Artwork',
      '',
      `The trace card picks out the **${trace}**.`,
      '',
      `Image: \`public${card.imagePath}\``,
      ''
    );
  }

  if (houses) {
    const nums = Object.keys(houses).map(Number).sort((a, b) => a - b);
    parts.push(
      '## By house',
      '',
      `Authored for ${nums.length} of the twelve houses. The rest fall back to the generic reading.`,
      ''
    );
    for (const n of nums) parts.push(`**House ${n}** — ${houses[n]}`, '');
    parts.push('House meanings are in [[reading message calc]].', '');
  }

  parts.push('---', '', `Part of the [[cards|deck]]. Meanings drafted in [[card meanings]], descriptions in [[card descriptions]].`, '');

  return parts.filter((l) => l !== null).join('\n');
}

function index(): string {
  const bySuite = new Map<string, typeof tarotDeck>();
  for (const c of tarotDeck) {
    const g = bySuite.get(c.suite) ?? [];
    g.push(c);
    bySuite.set(c.suite, g);
  }

  const parts = [
    '---',
    'title: The deck',
    'generated: true',
    '---',
    '',
    '# The deck',
    '',
    `All ${tarotDeck.length} cards, one page each, generated from the app's data by \`npm run wiki\`.`,
    '',
    '> [!warning] Generated pages',
    '> Everything under `cards/` is overwritten on each run. Edit the data files in',
    '> `daily-tarot-app/lib/data/`, then re-run. Loose thinking goes in the vault notes.',
    '',
  ];

  for (const suite of ['major', 'cups', 'wands', 'swords', 'pentacles']) {
    const cards = bySuite.get(suite);
    if (!cards) continue;
    parts.push(`## ${SUITE_LABEL[suite]}`, '');
    for (const c of cards) {
      const arch = cardArchetypes[c.id];
      const tone = arch ? ` · ${arch.upright.emotionalTone}` : '';
      parts.push(`- [[${slug(c.name)}|${c.name}]] — ${inline(c.uprightKeywords.slice(0, 3))}${tone}`);
    }
    parts.push('');
  }

  return parts.join('\n');
}

mkdirSync(OUT, { recursive: true });

// Cards get removed and renamed; a stale page is worse than a missing one.
for (const f of readdirSync(OUT)) {
  if (f.endsWith('.md')) rmSync(join(OUT, f));
}

for (const card of tarotDeck) {
  writeFileSync(join(OUT, `${slug(card.name)}.md`), page(card), 'utf8');
}
writeFileSync(join(OUT, 'cards.md'), index(), 'utf8');

const missing = {
  archetype: tarotDeck.filter((c) => !cardArchetypes[c.id]).length,
  scent: tarotDeck.filter((c) => !cardScents[c.id]).length,
  trace: tarotDeck.filter((c) => !cardTraceSubjects[c.id]).length,
  houses: tarotDeck.filter((c) => !CARD_HOUSE_INSIGHTS[houseKey(c.name)]).length,
};

console.log(`wrote ${tarotDeck.length} card pages + index to ${OUT}`);
console.log(
  `coverage — archetypes missing on ${missing.archetype}, scents ${missing.scent}, ` +
    `trace subjects ${missing.trace}, house insights ${missing.houses}`
);
