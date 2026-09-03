import styles from './card-page.module.css';

/**
 * SPEC §07. The traditional meaning: a lede addressed to the reader, then a
 * smaller third-person line describing the figure on the card.
 *
 * The sub is the deck's own `description`, which is already written in exactly
 * that register — this is where the old standalone "about this card" block
 * ended up, rather than trailing the page after the personalised read.
 *
 * It is bracketed. The lede speaks to the reader and the sub speaks about the
 * card, and the two sat as one grey paragraph after another with nothing but a
 * size change between them. Parentheses are the punctuation that already means
 * "this is an aside" — cheaper than a rule or a label, and they say it before
 * the sentence is read rather than after.
 *
 * Real characters rather than ::before/::after: they belong to the sentence, so
 * they should survive being copied and be announced by a screen reader.
 */
export function Meaning({ lede, sub }: { lede: string; sub?: string }) {
  return (
    <section className={styles.meaning}>
      <div className={styles.prompt}>&gt; MEANING</div>
      <p className={styles.lede}>{lede}</p>
      {sub && <p className={styles.sub}>({sub})</p>}
    </section>
  );
}

export default Meaning;
