/**
 * The one element of each card's artwork the ascii trace is meant to pick out.
 *
 * Authored, one per card, and used two ways. It captions the trace card, so the
 * image says what it is tracing. And it is the checklist for whether the
 * automatic region-finder actually landed on the right form — a name here is
 * something to check the drawing against, not something the code can search
 * for. "Horns" tells a person where to look; it tells the tracer nothing.
 *
 * The trace itself finds its subject by taking the largest connected mass of
 * dark linework, which on this deck is usually the drawn figure. Where that
 * disagrees with the name below, the answer is a per-card region rather than a
 * cleverer heuristic — the intent is authored, so the correction should be too.
 */
export const cardTraceSubjects: Record<string, string> = {
  // Major arcana
  'major-0': 'cliff edge',
  'major-1': 'flowering-branch arms',
  'major-2': 'pillars',
  'major-3': 'flowering crown',
  'major-4': 'stone-mountain head',
  'major-5': 'mushroom-cap shell',
  'major-6': 'intertwined branches',
  'major-7': 'snail shells',
  'major-8': 'flowering mane',
  'major-9': 'lantern',
  'major-10': 'tail-biting circle',
  'major-11': 'scales',
  'major-12': 'inverted pose',
  'major-13': 'sprouts at feet',
  'major-14': 'poured water',
  'major-15': 'horns',
  'major-16': 'lightning',
  'major-17': 'constellation antlers',
  'major-18': 'howling',
  'major-19': 'sun-rays scarf',
  'major-20': 'rising ashes',
  'major-21': 'four elements in wreath',

  // Cups
  'cups-ace': 'overflowing water',
  'cups-2': 'shared droplet',
  'cups-3': 'raised cups',
  'cups-4': 'offered fourth cup',
  'cups-5': 'spilled cups',
  'cups-6': 'flowering cup',
  'cups-7': "cups' varied contents",
  'cups-8': 'stacked cups left behind',
  'cups-9': 'arc of cups',
  'cups-10': 'rainbow of cups',
  'cups-page': 'lily-pad hat',
  'cups-knight': 'offered cup',
  'cups-queen': 'cup held to heart',
  'cups-king': 'steady hands',

  // Wands
  'wands-ace': 'flame at tip',
  'wands-2': 'distant mountain',
  'wands-3': 'distant ship',
  'wands-4': 'flowering canopy',
  'wands-5': 'crossed branches',
  'wands-6': 'laurel crown',
  'wands-7': 'elevated stance',
  'wands-8': 'branches in flight',
  'wands-9': 'fence of staffs',
  'wands-10': 'bent posture',
  'wands-page': 'small flame',
  'wands-knight': 'flames in mane',
  'wands-queen': 'sunflower',
  'wands-king': 'flowering antlers',

  // Swords
  'swords-ace': 'crown at tip',
  'swords-2': 'blindfold',
  'swords-3': 'pierced heart',
  'swords-4': 'wall-mounted swords',
  'swords-5': 'fallen feathers',
  'swords-6': 'calm water',
  'swords-7': 'carried-away swords',
  'swords-8': 'encircling ground stakes',
  'swords-9': 'covered face',
  'swords-10': 'sunrise',
  'swords-page': 'tiptoe stance',
  'swords-knight': 'diving posture',
  'swords-queen': 'clear sky',
  'swords-king': 'mountain peaks',

  // Pentacles
  'pentacles-ace': 'visible roots',
  'pentacles-2': 'infinity loop',
  'pentacles-3': 'shared tool',
  'pentacles-4': 'clutched acorns',
  'pentacles-5': 'glowing window',
  'pentacles-6': 'balanced scale',
  'pentacles-7': 'growing fruit',
  'pentacles-8': 'hung finished pieces',
  'pentacles-9': 'solitary abundance',
  'pentacles-10': 'tree-of-life pattern',
  'pentacles-page': 'magnifying glass',
  'pentacles-knight': 'plowed field',
  'pentacles-queen': 'sprouting coin',
  'pentacles-king': 'grapevines',
};
