/**
 * The last pass over anything Claude wrote before a reader sees it.
 *
 * The prompts carry the real work — what to say, what voice to say it in, which
 * words never to use. This only catches the tells that are mechanical enough to
 * fix without judgement: punctuation a model reaches for that this app does not
 * use. A rule here has to be safe on every possible sentence, because it runs
 * unsupervised on text nobody will read before the reader does.
 *
 * Anything requiring taste stays in the prompt. Rewriting a clause in code means
 * guessing at meaning, and a wrong guess in a reading someone takes personally is
 * worse than an em dash.
 *
 * Deliberately not a second model call. Every reading already costs one, the free
 * tier is seven of them, and a humanising pass that doubled the latency and the
 * bill would be paying twice to fix something the first prompt should get right.
 */

/** Curly quotes and the ellipsis character, which the app sets as plain marks. */
const TYPOGRAPHIC: [RegExp, string][] = [
  [/[‘’]/g, "'"],
  [/[“”]/g, '"'],
  [/…/g, '...'],
];

/**
 * Em and en dashes become commas.
 *
 * A comma rather than a full stop because the dash is nearly always parenthetical
 * in this register — "a pull towards beauty, and what that costs" — and splitting
 * it into two sentences changes the rhythm more than joining it does.
 *
 * The spaced form is handled first so " — " does not leave a doubled space, and
 * any comma the substitution stacks against existing punctuation is collapsed
 * afterwards.
 */
function dashesToCommas(s: string): string {
  return s
    .replace(/\s*[—–]\s*/g, ', ')
    // " -- " used as a dash. Not a bare hyphen: those are real, in "self-doubt".
    .replace(/\s+--+\s+/g, ', ')
    // ", ," or ". ," left where the dash sat next to punctuation already there.
    .replace(/([,.;:!?])\s*,\s*/g, '$1 ')
    .replace(/,\s*([,.;:!?])/g, '$1');
}

/**
 * Tidies one string of generated copy.
 *
 * Returns the input unchanged when it is empty or not a string — the callers
 * hand this whatever came back over the wire, which is not always what was asked
 * for, and a formatter is the wrong place to start throwing.
 */
export function humanise(text: string): string {
  if (typeof text !== 'string' || !text) return text;

  let out = text;
  for (const [pattern, replacement] of TYPOGRAPHIC) out = out.replace(pattern, replacement);
  out = dashesToCommas(out);

  return out
    .replace(/[ \t]{2,}/g, ' ')
    .replace(/\s+([,.;:!?])/g, '$1')
    .trim();
}

/**
 * The same pass over every string in an object, leaving other values alone.
 *
 * Typed against `object` rather than `Record<string, unknown>` so it accepts a
 * plain interface — the shapes this runs on are declared ones like ClaudeInsight,
 * and those have no index signature to satisfy.
 */
export function humaniseFields<T extends object>(obj: T): T {
  const out = { ...obj };
  for (const key of Object.keys(out) as (keyof T)[]) {
    const value = out[key];
    if (typeof value === 'string') {
      (out as Record<keyof T, unknown>)[key] = humanise(value);
    }
  }
  return out;
}
