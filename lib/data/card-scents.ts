/**
 * The scent recipe for every card in the deck, in perfumery's three-tier form.
 *
 * Authored, and the single source for the reading page's distill block. A
 * six-note accord used to sit alongside this, normalised to a fixed length; it
 * disagreed with these recipes on 45 of the 78 cards and has been removed,
 * since two lists of notes for one card is one too many.
 *
 * Counts run from five to eleven. Nothing downstream may assume six.
 *
 * The tiers are ordered by volatility, not importance: top notes are what you
 * meet first and lose within minutes, heart notes are the body of the thing,
 * base notes are what is still on skin hours later. That maps onto a day, which
 * is why it suits a one-card-a-day app — see the note at the bottom of this file.
 *
 * Keys are card ids from tarot-deck.ts. All 78 cards are covered.
 */

export interface CardScent {
  /** First impression. Bright, volatile, gone quickly. */
  top: string[];
  /** The body of the accord. */
  heart: string[];
  /** What lingers. */
  base: string[];
}

export const cardScents: Record<string, CardScent> = {
  'major-0': {
    top: ['bergamot', 'mimosa'],
    heart: ['elderflower', 'hay'],
    base: ['white cedar'],
  },
  'major-1': {
    top: ['black pepper', 'bergamot'],
    heart: ['tobacco', 'honey'],
    base: ['frankincense', 'labdanum'],
  },
  'major-2': {
    top: ['sea salt', 'yuzu'],
    heart: ['blue lotus', 'orris'],
    base: ['myrrh', 'oakmoss'],
  },
  'major-3': {
    top: ['peach', 'rose'],
    heart: ['tuberose', 'fig', 'honey'],
    base: ['sandalwood'],
  },
  'major-4': {
    top: ['black pepper', 'cardamom'],
    heart: ['tobacco', 'cedar'],
    base: ['labdanum', 'birch tar'],
  },
  'major-5': {
    top: ['bay laurel', 'cardamom'],
    heart: ['frankincense', 'frangipani', 'beeswax'],
    base: ['sandalwood', 'myrrh'],
  },
  'major-6': {
    top: ['rose', 'neroli'],
    heart: ['jasmine sambac', 'honey'],
    base: ['sandalwood', 'ambrette seed'],
  },
  'major-7': {
    top: ['ginger', 'black pepper'],
    heart: ['bay laurel', 'tobacco'],
    base: ['cedar', 'vetiver'],
  },
  'major-8': {
    top: ['pink pepper', 'saffron'],
    heart: ['rose', 'honey'],
    base: ['sandalwood', 'immortelle'],
  },
  'major-9': {
    top: ['hinoki', 'mugwort'],
    heart: ['frankincense', 'garden sage'],
    base: ['cedar', 'ash'],
  },
  'major-10': {
    top: ['star anise', 'cardamom'],
    heart: ['cinnamon', 'honey'],
    base: ['tonka bean', 'frankincense'],
  },
  'major-11': {
    top: ['yuzu', 'violet leaf'],
    heart: ['iris', 'vervain'],
    base: ['vetiver', 'sea salt'],
  },
  'major-12': {
    top: ['petrichor', 'violet leaf'],
    heart: ['blue lotus', 'oakmoss'],
    base: ['vetiver', 'myrrh'],
  },
  'major-13': {
    top: ['rhubarb', 'cypress'],
    heart: ['myrrh', 'immortelle'],
    base: ['oakmoss', 'vetiver', 'patchouli'],
  },
  'major-14': {
    top: ['bergamot', 'coriander seed'],
    heart: ['rose', 'honey', 'chamomile'],
    base: ['sandalwood', 'benzoin'],
  },
  'major-15': {
    top: ['blackcurrant bud', 'ginger'],
    heart: ['tuberose', 'ylang ylang', 'tobacco', 'cacao'],
    base: ['labdanum', 'oud', 'birch tar'],
  },
  'major-16': {
    top: ['black pepper', 'ginger'],
    heart: ['dragon\'s blood', 'tobacco'],
    base: ['birch tar', 'ash'],
  },
  'major-17': {
    top: ['neroli', 'mimosa'],
    heart: ['rose water', 'iris'],
    base: ['white musk'],
  },
  'major-18': {
    top: ['mugwort', 'seaweed'],
    heart: ['jasmine sambac', 'blue lotus'],
    base: ['oakmoss', 'ambergris', 'myrrh'],
  },
  'major-19': {
    top: ['orange blossom', 'yuzu'],
    heart: ['immortelle', 'honey'],
    base: ['saffron', 'sandalwood'],
  },
  'major-20': {
    top: ['frankincense', 'bergamot'],
    heart: ['hyssop', 'frangipani'],
    base: ['myrrh', 'oud'],
  },
  'major-21': {
    top: ['bergamot', 'cardamom'],
    heart: ['rose', 'jasmine', 'fig'],
    base: ['sandalwood', 'oakmoss', 'vetiver', 'ambrette'],
  },
  'cups-ace': {
    top: ['orange blossom water', 'yuzu'],
    heart: ['white rose', 'magnolia'],
    base: ['white musk'],
  },
  'cups-2': {
    top: ['neroli', 'bergamot'],
    heart: ['rose', 'jasmine sambac'],
    base: ['sandalwood', 'ambrette seed'],
  },
  'cups-3': {
    top: ['mandarin', 'pink pepper'],
    heart: ['osmanthus', 'elderflower', 'honey'],
    base: ['white tea'],
  },
  'cups-4': {
    top: ['green tea', 'cucumber'],
    heart: ['chamomile', 'hay'],
    base: ['oakmoss', 'orris'],
  },
  'cups-5': {
    top: ['petrichor'],
    heart: ['violet', 'iris', 'chamomile'],
    base: ['oakmoss', 'wet stone'],
  },
  'cups-6': {
    top: ['peach', 'mandarin'],
    heart: ['pandan', 'rose', 'honey', 'chamomile'],
    base: ['vanilla', 'orris'],
  },
  'cups-7': {
    top: ['blackcurrant bud', 'star anise'],
    heart: ['jasmine grandiflorum', 'ylang ylang', 'tuberose'],
    base: ['poppy', 'myrrh'],
  },
  'cups-8': {
    top: ['sea salt', 'cypress'],
    heart: ['mugwort', 'chamomile'],
    base: ['oakmoss', 'myrrh'],
  },
  'cups-9': {
    top: ['bergamot', 'cardamom'],
    heart: ['rose', 'jasmine', 'honey', 'fig'],
    base: ['sandalwood', 'tonka bean'],
  },
  'cups-10': {
    top: ['neroli', 'mandarin'],
    heart: ['rose', 'orange blossom', 'honey', 'chamomile'],
    base: ['sandalwood', 'beeswax', 'benzoin'],
  },
  'cups-page': {
    top: ['yuzu', 'elderflower'],
    heart: ['violet', 'water lily'],
    base: ['white musk', 'seaweed'],
  },
  'cups-knight': {
    top: ['bergamot', 'neroli'],
    heart: ['rose', 'jasmine sambac', 'ylang ylang'],
    base: ['sandalwood', 'ambergris'],
  },
  'cups-queen': {
    top: ['sea salt', 'mandarin'],
    heart: ['rose', 'jasmine', 'blue lotus', 'magnolia'],
    base: ['sandalwood', 'ambergris', 'oakmoss'],
  },
  'cups-king': {
    top: ['cypress', 'bergamot'],
    heart: ['chamomile', 'champaca', 'tobacco'],
    base: ['oakmoss', 'myrrh', 'ambergris'],
  },
  'swords-ace': {
    top: ['yuzu', 'kaffir lime leaf'],
    heart: ['violet leaf', 'vetiver'],
    base: ['hinoki'],
  },
  'swords-2': {
    top: ['bergamot', 'cucumber'],
    heart: ['iris', 'violet leaf'],
    base: ['white musk'],
  },
  'swords-3': {
    top: ['rhubarb', 'black pepper'],
    heart: ['iris', 'wormwood'],
    base: ['wet stone', 'oakmoss'],
  },
  'swords-4': {
    top: ['eucalyptus', 'lavender'],
    heart: ['chamomile', 'hinoki'],
    base: ['cedar', 'hay'],
  },
  'swords-5': {
    top: ['black pepper', 'ginger'],
    heart: ['tobacco', 'wormwood'],
    base: ['birch tar'],
  },
  'swords-6': {
    top: ['sea salt', 'bergamot'],
    heart: ['violet leaf', 'iris'],
    base: ['cypress', 'oakmoss'],
  },
  'swords-7': {
    top: ['black pepper', 'coriander seed'],
    heart: ['tobacco', 'tarragon'],
    base: ['vetiver', 'ambrette seed'],
  },
  'swords-8': {
    top: ['cypress', 'juniper'],
    heart: ['mugwort', 'wormwood'],
    base: ['oakmoss', 'vetiver'],
  },
  'swords-9': {
    top: ['black pepper', 'ginger'],
    heart: ['valerian', 'wormwood'],
    base: ['myrrh', 'birch tar'],
  },
  'swords-10': {
    top: ['rhubarb', 'black pepper'],
    heart: ['iris', 'wormwood', 'tobacco'],
    base: ['birch tar', 'oakmoss', 'ash'],
  },
  'swords-page': {
    top: ['yuzu', 'pink pepper'],
    heart: ['violet leaf', 'green tea'],
    base: ['vetiver'],
  },
  'swords-knight': {
    top: ['black pepper', 'ginger', 'bergamot'],
    heart: ['tobacco', 'bay laurel'],
    base: ['cedar', 'vetiver'],
  },
  'swords-queen': {
    top: ['bergamot', 'violet leaf'],
    heart: ['iris', 'wormwood', 'tarragon'],
    base: ['vetiver', 'cypress'],
  },
  'swords-king': {
    top: ['black pepper', 'cardamom'],
    heart: ['bay laurel', 'tobacco', 'hinoki'],
    base: ['cedar', 'vetiver', 'oakmoss'],
  },
  'wands-ace': {
    top: ['torch ginger', 'ginger', 'pink pepper'],
    heart: ['dragon\'s blood', 'cinnamon'],
    base: ['cedar'],
  },
  'wands-2': {
    top: ['bergamot', 'black pepper'],
    heart: ['tobacco', 'bay laurel'],
    base: ['cedar', 'frankincense'],
  },
  'wands-3': {
    top: ['bergamot', 'cardamom'],
    heart: ['tobacco', 'saffron'],
    base: ['frankincense', 'sandalwood'],
  },
  'wands-4': {
    top: ['cinnamon', 'orange blossom'],
    heart: ['rose', 'honey'],
    base: ['sandalwood', 'beeswax'],
  },
  'wands-5': {
    top: ['black pepper', 'ginger', 'pink pepper'],
    heart: ['dragon\'s blood', 'tobacco'],
    base: ['cedar', 'hay'],
  },
  'wands-6': {
    top: ['bergamot', 'cardamom'],
    heart: ['bay laurel', 'saffron', 'honey'],
    base: ['frankincense', 'sandalwood'],
  },
  'wands-7': {
    top: ['black pepper', 'ginger'],
    heart: ['dragon\'s blood', 'tobacco', 'thyme'],
    base: ['vetiver', 'cedar'],
  },
  'wands-8': {
    top: ['yuzu', 'ginger', 'pink pepper'],
    heart: ['cardamom', 'star anise'],
    base: ['cedar'],
  },
  'wands-9': {
    top: ['black pepper', 'cypress'],
    heart: ['tobacco', 'thyme', 'dragon\'s blood'],
    base: ['vetiver', 'oakmoss', 'labdanum'],
  },
  'wands-10': {
    top: ['black pepper'],
    heart: ['tobacco', 'hay', 'cedar'],
    base: ['vetiver', 'labdanum', 'patchouli'],
  },
  'wands-page': {
    top: ['ginger', 'pink pepper', 'yuzu'],
    heart: ['cardamom', 'dragon\'s blood'],
    base: ['cedar'],
  },
  'wands-knight': {
    top: ['black pepper', 'ginger', 'cinnamon'],
    heart: ['dragon\'s blood', 'tobacco', 'saffron'],
    base: ['cedar', 'birch tar'],
  },
  'wands-queen': {
    top: ['torch ginger', 'pink pepper', 'bergamot'],
    heart: ['rose', 'cinnamon', 'saffron', 'honey'],
    base: ['sandalwood', 'labdanum'],
  },
  'wands-king': {
    top: ['black pepper', 'cardamom'],
    heart: ['tobacco', 'bay laurel', 'dragon\'s blood'],
    base: ['cedar', 'frankincense', 'labdanum'],
  },
  'pentacles-ace': {
    top: ['fig leaf', 'carrot seed'],
    heart: ['orris', 'beeswax'],
    base: ['sandalwood', 'vetiver'],
  },
  'pentacles-2': {
    top: ['bergamot', 'pink pepper'],
    heart: ['ginger', 'honey'],
    base: ['vetiver', 'hay'],
  },
  'pentacles-3': {
    top: ['cardamom', 'black pepper'],
    heart: ['pandan', 'hay', 'beeswax', 'tobacco'],
    base: ['sandalwood', 'cedar', 'oakmoss'],
  },
  'pentacles-4': {
    top: ['black pepper'],
    heart: ['patchouli', 'tobacco'],
    base: ['labdanum', 'vetiver', 'oakmoss'],
  },
  'pentacles-5': {
    top: ['cypress', 'wet stone'],
    heart: ['mugwort', 'hay'],
    base: ['oakmoss', 'vetiver', 'birch tar'],
  },
  'pentacles-6': {
    top: ['bergamot', 'coriander seed'],
    heart: ['fig', 'honey', 'tobacco'],
    base: ['sandalwood', 'beeswax'],
  },
  'pentacles-7': {
    top: ['tomato leaf', 'cardamom'],
    heart: ['fig', 'hay', 'honey'],
    base: ['vetiver', 'oakmoss', 'patchouli'],
  },
  'pentacles-8': {
    top: ['black pepper', 'coriander seed'],
    heart: ['beeswax', 'hay', 'tobacco'],
    base: ['sandalwood', 'cedar', 'oakmoss'],
  },
  'pentacles-9': {
    top: ['fig', 'bergamot'],
    heart: ['rose', 'honey', 'magnolia'],
    base: ['sandalwood', 'orris', 'beeswax'],
  },
  'pentacles-10': {
    top: ['fig', 'cardamom'],
    heart: ['pandan', 'rose', 'honey', 'tobacco', 'patchouli'],
    base: ['sandalwood', 'oakmoss', 'vetiver', 'beeswax', 'orris'],
  },
  'pentacles-page': {
    top: ['fig leaf', 'coriander seed'],
    heart: ['carrot seed', 'hay'],
    base: ['vetiver', 'oakmoss'],
  },
  'pentacles-knight': {
    top: ['black pepper', 'cardamom'],
    heart: ['hay', 'tobacco', 'patchouli'],
    base: ['vetiver', 'cedar', 'oakmoss'],
  },
  'pentacles-queen': {
    top: ['fig', 'cardamom'],
    heart: ['pandan', 'rose', 'honey', 'champaca', 'fenugreek'],
    base: ['sandalwood', 'beeswax', 'oakmoss'],
  },
  'pentacles-king': {
    top: ['fig', 'black pepper'],
    heart: ['tobacco', 'truffle', 'patchouli'],
    base: ['sandalwood', 'oakmoss', 'vetiver', 'labdanum'],
  },
};

/** The accord for a card, or null if the id is unknown. */
export function getCardScent(cardId: string): CardScent | null {
  return cardScents[cardId] ?? null;
}

/** All notes for a card, top through base, for a single-line rendering. */
export function flattenScent(scent: CardScent): string[] {
  return [...scent.top, ...scent.heart, ...scent.base];
}

/**
 * Count how often each note appears across a set of drawn cards — for a
 * year-in-review ("your year smelled of vetiver, honey and oakmoss"), or to
 * find the through-line in a run of readings. Returns notes most-frequent first.
 */
export function dominantNotes(cardIds: string[], limit = 5): Array<{ note: string; count: number }> {
  const tally = new Map<string, number>();
  for (const id of cardIds) {
    const scent = cardScents[id];
    if (!scent) continue;
    for (const note of flattenScent(scent)) {
      tally.set(note, (tally.get(note) ?? 0) + 1);
    }
  }
  return [...tally.entries()]
    .map(([note, count]) => ({ note, count }))
    .sort((a, b) => b.count - a.count || a.note.localeCompare(b.note))
    .slice(0, limit);
}

/**
 * The memory a card carries, for the distill block on the reading page.
 *
 * Not an interpretation and not a second meaning — a plain memory a stranger
 * would recognise: a room, a time of day, a small human act. The card's essence
 * arrives through the scene rather than being stated by it, which is why none
 * of these name or explain the botanicals sitting beside them in the accord.
 *
 * Authored per card, roughly fifty words each. Any card missing an entry simply
 * renders its distill block without the paragraph.
 */
export const cardMemories: Record<string, string> = {
  // ── Major Arcana ──────────────────────────────────────────────────────────
  'major-0': "Some mornings you leave the house with almost nothing in your bag and the air arrives colder and cleaner than you'd braced for. Just your own footsteps for a while, a bird you couldn't name, the road going somewhere you hadn't quite decided on. You go anyway. Something in you is already lighter for the not-knowing.",
  'major-1': "An uncle who could fix anything with what was already in the drawer. Screwdriver, rubber band, half a candle, a look of concentration you learned to trust before you knew why. The thing worked when he was done, every time, and he never made a fuss about it. You watched carefully because even then you knew this was a kind of magic you'd want later.",
  'major-2': "Some women answer the door before you knock. Tea already poured, no questions asked, the kind of quiet that isn't waiting for you to fill it. You leave with something you didn't come in with, some knowing that arrived sideways through her stillness, and she never once mentioned it. That's teaching that doesn't announce itself as teaching.",
  'major-3': "Some people feed you before you know you're hungry. A friend's mother, peaches going soft on her counter, someone else's laundry warm off the line, her hand on your back not needing to ask what was wrong. You ate two helpings without meaning to, and she didn't say a word about it, just kept moving through her kitchen like she'd been waiting all week for you to arrive.",
  'major-4': "A grandfather at the head of the table who never had to raise his voice for the room to arrange itself around him. He carved the meat, everyone waited to be served in the order he chose, and nobody thought it strange because it had always been that way. You learned about authority from watching him. The kind that doesn't announce itself, and doesn't have to.",
  'major-5': "Temples, churches, mosques attended at an hour that always felt too early. Words you didn't understand yet, said by everyone at once, the sound of them settling somewhere in you for later. Years on, far from home, you'd catch yourself humming a fragment of it in the shower without meaning to. Whatever it was got in.",
  'major-6': "Some afternoons you both fall asleep on the same couch without meaning to. Sun on the wall, someone laughing outside, the small weight of another person breathing beside you. You wake first and stay very still so they'll keep sleeping. It occurs to you, in that suspended minute, that this was the exact thing you'd been looking for and hadn't known how to name.",
  'major-7': "The morning of the interview, the exam, the long drive across a country you'd never crossed before. Bag packed the night before and checked twice, coffee made, keys where you'd left them on purpose. Nothing left to decide. Just the road and your own held breath and the forward motion of a thing you'd finally committed to.",
  'major-8': "A mother in the supermarket aisle holding her child through a tantrum. Not embarrassed, not tired, not trying to make it stop faster than it wants to. Her hand stays on the small back until it passes. She isn't controlling the storm, only staying close to it, and by the end the child is quiet and reaching up for her hand.",
  'major-9': "There's an hour, usually around 4am, that belongs to no one and nothing. Small light above the stove, fridge cycling, the house making the small noises it makes when it thinks nobody's listening. Nobody needs anything from you for the next hour, and that hour is the most honest one you'll have all week. You sit with your tea and you don't have to be anything to anyone.",
  'major-10': "Some coincidences arrive like winks. The song in the taxi on the day you'd been thinking about them, the stranger who quoted the line you'd read that morning. You don't tell anyone because they'll say it's nothing, and you know it isn't nothing. Sometimes the world winks at you, and it's alright to wink back.",
  'major-11': "An elder who listened to both sides and then sat quiet for a long minute before she spoke. When she did, both people went still. Neither was fully happy with what she said, and both of them knew it was fair. You understood then that fairness isn't the same as everyone being comfortable, and that a real judgement costs the judge something too.",
  'major-12': "Fevers change the ceiling. You couldn't move and finally stopped trying, the fan turning slowly, time doing something odd with itself. You saw the room from a different height, or your mind did, and something you'd been wrong about became so obvious you almost laughed. Nothing had happened. You were just still enough to see it.",
  'major-13': "Clearing out a house after a funeral is its own strange labour. Clothes still smelling of them, the tin of tea they always used, shoes by the door as if any minute now. You put things in boxes, you cry, you keep working, and something in you is quietly becoming a person who can do this. You aren't making room for the ending. You're making room for whatever comes next.",
  'major-14': "An auntie at the stove who could taste a pot and know exactly what it needed. A little more salt, a squeeze of lime, ten more minutes with the lid on. She never measured, and the dish always came out the way it was supposed to, and she wasn't ever surprised. She'd been listening to the pot the whole time.",
  'major-15': "Small compulsions have their own gravity. The third drink you knew you shouldn't have and had anyway, the message you sent at 1am, the thing you kept going back to because it made you feel something even when the something was wrong. You knew the whole time, and that was part of it. The knowing didn't stop you, and eventually you stopped expecting it to.",
  'major-16': "Some phone calls come at the wrong hour and before you pick up you already know. Whatever floor you thought you were standing on wasn't there. Everything from now on will be counted from this exact minute. There's nothing to say about it yet. You'll survive it, and right now you're just here, on the ground, still holding the phone.",
  'major-17': "The first proper shower after a long illness is close to a resurrection. Window open, water on skin that hadn't been touched by anything much in weeks, the feeling of being returned to yourself in small increments. Nothing has been solved. You just remembered you're still here, still in a body, still capable of standing in warm water and being quietly grateful.",
  'major-18': "Cities you don't know behave differently at night. Take a wrong turn on purpose, follow the light doing something strange between the buildings. Dogs behind a wall somewhere, a radio through an open window, your own footsteps sounding louder than they should. Your mind will show you things that aren't quite there, and some of them, you'll realise later, were.",
  'major-19': "A child running towards you across a courtyard with something to show you. A stone, a beetle, a drawing, whatever it is the most important thing in the world for the length of the run. You catch them. You look at what they hold. You give it the full attention it deserves, and later you can't remember what it was, only how their face looked when you took it seriously.",
  'major-20': "A message from someone you hadn't spoken to in years, sitting in your notifications for a full afternoon before you opened it. You read it twice, and the old feeling came up but different now, softer or clearer or both. You knew what you were being asked. You knew what you were going to answer, and there was a quiet in you that hadn't been there the last time this happened.",
  'major-21': "The last night of a long trip, sitting on a balcony with the person you'd travelled with, not needing to speak for long stretches. Everything you'd set out to do got done, and some things you hadn't planned for happened too, and both kinds counted. Tomorrow you'd go home, and you'd be a slightly different person than the one who left, and that was the whole point of leaving.",

  // ── Cups ──────────────────────────────────────────────────────────────────
  'cups-ace': "The first cup of tea someone hands you after a long journey, already the right temperature, already sweetened the way you like without having to say. You hold it in both hands before drinking, because the holding is part of it. Whatever was hard about the getting here is starting to soften, one warm minute at a time.",
  'cups-2': "A friend says the thing you'd both been circling for months, quietly, in the middle of an ordinary conversation, as though it had always been sitting there. Neither of you moves for a second. Something gets promised without either of you having to name it, and you both know it, and both of you keep it.",
  'cups-3': "Weddings, birthdays, reunions in someone's small kitchen. Three of you laughing at something one of you said an hour ago that just landed for the second time. The food's mostly gone, nobody's leaving, and later you won't remember what was so funny. Just that your face hurt from smiling and you were all there, together, in one of those nights.",
  'cups-4': "Some offers you can't bring yourself to want. A trip, a job, an evening out, and you said no and you weren't sure why. Something in you had turned its face to the wall before your mouth had caught up. It wasn't the offer's fault. You just weren't there for it, not yet, and forcing yourself wouldn't have made you present.",
  'cups-5': "Grief has its own kitchen at 8am. Standing there with your hands not knowing what to do with themselves, kettle boiled and forgotten. Three things spilled, two things still standing, and you can't see the two yet. That's alright. Nobody's asking you to see them today.",
  'cups-6': "The smell of a house you hadn't been in for twenty years. A cousin's, a grandmother's, a friend's you'd lost touch with, and your body remembered the corridor before your mind did. Something in you was seven years old for a full second before you came back. You didn't tell anyone. It felt like a private thing.",
  'cups-7': "Some evenings the future arrives as too many open tabs. Every option shimmering, none close enough to touch, all of them equally possible and equally unreal. You go to bed without choosing, and by morning half of them have quietly closed themselves out of your interest. Not deciding, sometimes, is how you find out what you actually wanted.",
  'cups-8': "Some nights you pack a small bag and go, quietly, without making a scene of it. You'd built the thing you were leaving and it was good, and it wasn't yours any more, and you closed the door behind you without slamming it. Nobody heard you go, and that was how you needed it. Leaving well is its own skill.",
  'cups-9': "Cooking a meal for yourself on a night in, and having it turn out better than you expected, might be one of the smaller miracles. You sit down and eat it slowly. Nobody to perform for, nobody to please, just the food and the quiet and your own good company. You go back for a second helping. You don't feel bad about it once.",
  'cups-10': "Evenings on the veranda with the family, everyone in their own conversation, the children running underfoot, someone laughing loud enough to hear from three rooms away. You look around and something quiet in you says, this, this is what all of it was for. It isn't perfect. None of it is. It's more than enough.",
  'cups-page': "A kid brings you a shell they found and tells you a whole story about it, half made up and all of it meant. You listen without correcting anything, because the story isn't the point. They run off to find the next thing, and you keep the shell for longer than you'd meant to.",
  'cups-knight': "Someone writes you a letter by hand. Not a text, not an email, a folded page in an envelope with your name on it in ink. They'd thought about you for the whole length of the writing, and you can feel that in the paper. You read it twice, put it somewhere safe, and think about them for the rest of the afternoon.",
  'cups-queen': "A friend you call at a bad hour who doesn't ask you to explain, who just listens, who knows when to say something and when to let the silence do the work. When you get off the phone the thing is still there, but you can carry it now. That's because of her.",
  'cups-king': "A father who stayed calm when the news was bad. Not distant, not unfeeling, just steady in a way that let the rest of the family breathe. He asked one clear question and then made the tea. Later, alone, he let himself feel it fully. You didn't see that part, and you knew it was happening somewhere.",

  // ── Swords ────────────────────────────────────────────────────────────────
  'swords-ace': "Some sentences arrive in the head fully formed, the one you'd been trying to write for a week, clear as glass and impossible to unsee. You wrote it down before it could leave. Everything that had been tangled was suddenly not, and that's how clarity works when it finally comes, all at once, and you have to be ready to catch it.",
  'swords-2': "Decisions you've been avoiding have a way of sitting on the table longer than they should. You've read both emails four times by now. Both answers will cost something, and you can't yet tell which cost you're more willing to pay. You close the laptop and make another coffee, and the decision waits, patient as a cat.",
  'swords-3': "Some messages you have to read twice to be sure of what they say. Nothing to do with your hands, nothing to say to anyone, just the fact of it sitting in your chest. Some griefs are simple and complete, and there's nothing to add to them, and pretending otherwise is its own kind of harm.",
  'swords-4': "Every house has a chair no one else sits in. You fold into it after a long week, when the light is going soft and the house has finally gone quiet. Curtains half drawn, phone somewhere else on purpose, one long exhale you didn't know you'd been holding. You don't dream of anything. You wake up different.",
  'swords-5': "Some arguments you win and know, walking away, that you'd lost something in the winning. The room after, coffee gone cold, the other person's chair still pushed back at an angle. You were right, and you made sure everyone knew, and now the quiet in the room is a quiet you have to sit alone in.",
  'swords-6': "Buses at dawn, ferries, flights leaving before sunrise. Everyone quiet, the sky doing its slow blue thing, the water or the road going where it's going. You didn't look back at what you were leaving. You didn't feel brave about it. You just felt tired and pointed the other way, and that was enough to get you moving.",
  'swords-7': "Small lies have small weights until they don't. You told one nobody caught, almost harmless, and you watched yourself tell it and knew you'd have to remember it later. You went home and it sat in you like a stone in a shoe, always there when you took a step. Small things aren't small when you have to carry them.",
  'swords-8': "Some mornings every option looks closed off. Walls up, no obvious door, the light coming in from the wrong angle. You'd made most of the walls yourself and forgotten. Anyone standing next to you would have seen the way out immediately, but you were the only one in the room, so you didn't.",
  'swords-9': "3am and the light's on again. You've been staring at the ceiling long enough to hear the fridge cycle three times, the thought coming back and each time it's wearing something a little worse. You already know it'll look smaller in the morning. That doesn't help right now, but hold on anyway, because it always does end.",
  'swords-10': "The end of a thing you'd been holding together for too long. Face down on the bed, phone somewhere on the floor, the specific relief of not having to hold it anymore. It couldn't get worse from here, and in a strange small way that was the beginning of something. You just had to lie there for a while first.",
  'swords-page': "Teenagers at the dinner table who've read one book and won't stop bringing it up. Half right, half naive, entirely convinced. You remember being that certain about something once, and you almost miss the feeling, that specific sharpness before life had complicated it. Let them have it. It doesn't last.",
  'swords-knight': "A friend told you the truth without softening it, in the middle of the street, before you were ready to hear it. You were angry with them for a full day. By the end of the week you knew they'd been right, and by the end of the month you were grateful they'd been the one to say it.",
  'swords-queen': "Some women lose a lot and don't hide it, but don't let it make them cruel either. She could see through most things, and she was gentle where it mattered and sharp where it counted, and you always wanted her on your side of a hard conversation. You learned from her that clarity and kindness aren't opposites.",
  'swords-king': "A judge, a professor, an elder who could hold a hard truth without dressing it up or apologising for it. He didn't need to be liked, which was part of why you leaned in when he spoke. You wrote things down later so you wouldn't forget, and years on you'd still catch yourself quoting him without realising.",

  // ── Wands ─────────────────────────────────────────────────────────────────
  'wands-ace': "Some ideas wake you up at 5am and won't let you go back to sleep. You get up and write it down in the dark, half legible, not caring. Something is starting, you can feel the heat of it in your chest. You don't know what yet. You don't need to.",
  'wands-2': "Rooftops after you've made a decision but before you've told anyone have a specific kind of hush. Looking out at the city you're about to leave, or the one you're about to move to, the world felt wide and yours in a way it hadn't before. You took a long breath and held the moment for yourself. Once you told people, it would become something else.",
  'wands-3': "Mornings after you send the application, the pitch, the proposal, when there's nothing to do but wait. You make breakfast slowly. You drink your coffee at the window. Somewhere out of sight the future is assembling itself, and for once you're letting it, without trying to reach in and adjust it.",
  'wands-4': "Weddings, housewarmings, graduation parties, fairy lights strung wherever they can be strung. Aunties running the kitchen, uncles arguing about the music, someone handing you a drink you didn't ask for that turns out to be exactly what you wanted. This was the good part. You knew to notice it while it was still happening.",
  'wands-5': "Group projects where nobody will stop talking over each other, everyone wanting to be the one who's right, nothing actually getting decided. You went home with your jaw aching. Nothing terrible had happened, exactly, but nothing useful had happened either, and you weren't sure which was more tiring.",
  'wands-6': "Some walks home are just walks home, and some are the one after you got the news. Sun setting in that particular gold way that felt like the sky knew. You wanted to tell everyone and also to keep it to yourself for one more hour. You'd worked for this longer than most people realised, and now it was here, and it was yours.",
  'wands-7': "Meetings where you're the only one holding a position and you know you have to hold it. Not aggressively, just steadily. People push and you stay where you are. You go home tired, and you didn't back down, and that matters more than winning would have.",
  'wands-8': "Weeks when the messages won't stop coming, calls and emails and one thing after another, all of it moving fast in the direction you'd been hoping for. You caught up with none of it and it didn't matter, the momentum was doing the work. You'd rest at the weekend, or you'd rest when it was done. Either way it was fine.",
  'wands-9': "Nights before the last day of a hard thing, when you're nearly done and nearly broken, and you know both. You slept badly. You got up and you did it anyway. That's what nine of anything means. One more push, and you're through.",
  'wands-10': "Halfway up four flights with the groceries, it hits you: you've said yes to too many things again. Nobody had asked you to hold all of it. You had, and now here you were, out of breath, headache building, wondering when you'd finally learn. Some burdens are honest, and some are just how you show love badly.",
  'wands-page': "A friend calls you excited about a new plan again, the fifth one this year. You listen because one of them might be the one, and even the ones that aren't are part of the making. Their enthusiasm is contagious even when it's slightly ridiculous. That's the whole point of them.",
  'wands-knight': "A cousin who booked the flight before deciding where to stay, who'd figure it out because he always did, mostly. Stories he came back with were worth the small chaos, worth the calls at odd hours asking for help with things he'd got himself into. Life was more interesting with him in it, and everyone knew it.",
  'wands-queen': "Certain women walk into a room and it reorganises itself around them, and they aren't doing anything to make it happen. She knows exactly what she brings and isn't apologising for it. Warm to the people she likes, nothing much for the ones she doesn't, no time for pretending she can't tell the difference. Sit near her at dinner if you can.",
  'wands-king': "Founders who can look at a mess and see the shape of what it will become. He'd bet on himself enough times to know how the odds actually worked. When he asked you to help build something, you believed you could, and that belief was half of what made it possible. That was his real gift.",

  // ── Pentacles ─────────────────────────────────────────────────────────────
  'pentacles-ace': "Some envelopes, offers, seeds get handed to you quietly by someone who isn't making a big deal of it. You hold it in your palm and feel the weight, small but real, and you know this one could grow into something if you give it what it needs. Beginnings don't always announce themselves. Sometimes they just arrive.",
  'pentacles-2': "Weeks when you're holding three jobs and a family situation and still remembering to buy milk. You aren't graceful about any of it, but you're doing it. Some days that's what balance actually looks like, not elegant, just kept up. You were tired and you were managing, and both were true at once.",
  'pentacles-3': "Kitchens at the temple, the church, the community centre. Three women chopping, two men at the stove, someone's kid handing out plates. Nobody in charge, everyone knowing what to do, the meal coming out on time somehow. This is how a thing gets made when nobody needs credit for it.",
  'pentacles-4': "Tins under the bed, accounts you don't tell anyone about, counting twice before you spend. You'd been without once and it had marked you, and you weren't wrong to be careful. You were starting to be a little too careful though. Somewhere in you a small voice had noticed.",
  'pentacles-5': "Some winters you'd rather not remember. Walking past a warm restaurant window with almost nothing in your pocket, the help you didn't ask for because you didn't know how to. It ended, eventually. You still flinch a little at certain streets, and you're gentler than most people with anyone you see out in the cold.",
  'pentacles-6': "A neighbour left a bag of mangoes at your door when the tree fruited, no note, no expectation. Later, when you had extra rice, you took some over. Nobody was keeping score, and that was the whole point, and both of you knew it without ever saying so.",
  'pentacles-7': "Some mornings you look at what you've built, the garden or the business or the child, and can't yet tell if it's working. You've done the work, and now it's the plant's turn, and there's nothing to do but wait and water. You go inside and make lunch, because that's still yours to do.",
  'pentacles-8': "An apprentice at the bench, doing the same small movement for the two thousandth time, not bored, getting better in a way only she can feel. The master watches without saying anything, and that's the compliment. Skill builds this way, quietly, one repetition at a time, and nobody outside the room notices until much later.",
  'pentacles-9': "Afternoons in your own garden, in a house you'd bought yourself, with a coffee made exactly the way you liked it and no one to answer to for an hour. You'd earned the quiet, and you knew it, and you weren't apologising for it to anyone. This was what all the working had been for.",
  'pentacles-10': "Family isn't a thing you build in one lifetime. Grandparents' house on a holiday afternoon, three generations in the same room, someone asleep on the sofa, a dish that has been made in that kitchen for forty years. This is what your people built, over long stretches of time you weren't around for. You're inside it now, sitting in the middle of a long chain, and you can feel it.",
  'pentacles-page': "A kid saving for the thing, counting the coins in the jar every week, slow and patient and entirely serious about it. You wanted to just hand them the rest of what they needed, and you didn't, because that wasn't the point and even they knew it. The saving was the thing they were learning, not the buying.",
  'pentacles-knight': "A friend who said he'd help you move and turned up at 8am with coffee and a plan. Not fast and not fancy, just done properly. Everything ended up where it was meant to be. He left before you could thank him twice, because that was the kind of man he was, and you were lucky to know him.",
  'pentacles-queen': "An auntie whose house was always warm, whose kitchen always had food ready, whose cats knew her and came when she called. She didn't fuss over you when you visited. She just made sure you were fed and had somewhere comfortable to sit. You always slept well when you stayed there, and you never really understood why until much later.",
  'pentacles-king': "An old man who'd owned the shop for forty years and knew every regular by name and what they'd come in for. He didn't chase growth. The shop was good, the workers were paid on time, the family was fed. He'd built something that lasted, and he didn't need to tell you about it, and that was part of why it had lasted.",
};

/**
 * The same recipe, read the other way up.
 *
 * The scents do not change when a card reverses — a reversal is not a different
 * accord, it is the same accord on a different day, and the deck's notes were
 * chosen for the card rather than for its orientation. What changes is what the
 * accord is doing to you, so only the memory has a second version.
 *
 * These are darker than their upright twins on purpose, and they are not their
 * opposites. Most hold two failures at once — the thing done too much and the
 * same thing not done at all — because that is how a reversal actually arrives:
 * not as the inverse of the card but as its energy gone wrong in one of two
 * directions, and rarely with the reader certain which one they are in.
 *
 * Keys are card ids from tarot-deck.ts, in the same order as cardMemories
 * above. All 78 cards are covered; Distill falls back to the upright memory if
 * one is ever missing, so a gap reads as unwritten rather than as blank.
 */
export const cardMemoriesReversed: Record<string, string> = {
  // ── Major Arcana ────────────────────────────────────────────────────────────
  'major-0': "Keys in your hand for weeks now, the door still closed, the leaving imagined so many times it has quietly replaced the actual leaving. Somewhere else you flung a bag together and hurled it at the wrong door again, wanting-to-be-elsewhere doing all the choosing. Neither the wise walk nor the reckless one has been taken. Morning keeps arriving and finding you exactly where it left you the night before, and the night before that.",
  'major-1': "Half a dozen jobs started, none finished, tools scattered across the bench, that steady concentration you used to trust gone somewhere it won't answer to being called. Some days the power runs ahead of you into rooms it has no business entering, fixing what wasn't broken, unmaking things that only needed to be left alone. Other days the skill sits in the drawer like a stranger's tool, and your hand doesn't remember the shape of holding it. What used to move through you has become something you're pretending to.",
  'major-2': "Doors that used to open before you knocked have gone silent, and the tea nobody offers is a specific texture of quiet. Wisdom kept as a weapon and wisdom drowned in chatter leave the same room empty by different routes. Some seasons the auntie won't stop talking; other seasons you can't find her at all. Whatever used to arrive sideways through her stillness has stopped arriving, and neither of you is saying it.",
  'major-3': "Peaches three days past ripe on the counter, sweetness turning heavy, turning wrong. Being fed until you can't leave, being fed as a way of keeping you, a hand on the back that carries weight now instead of comfort. And somewhere else, a kitchen you stood outside of your whole childhood, still hungry, watching another child eat. Love that came too much and love that never came have a way of settling into the same body, and confusing themselves for each other.",
  'major-4': "A grandfather whose word has to be law now because nothing else is holding him upright, brittleness worn like armour. Or the chair at the head of the table sitting empty for a decade, everyone still glancing at it before they speak, still waiting to be told. Rigidity and abdication cast the same shadow across a room. Children learn to hold themselves, and they hold themselves too hard, and later they don't know how to set the weight down.",
  'major-5': "Rituals repeated until the meaning was polished off them, the words said by mouths that stopped listening a generation ago. Walking away was the only honest move some years; other years the walking-away took a piece of the ground with it that you still need to stand on. Dogma without breath. Freedom without floor. The teaching keeps calling from a distance you can't quite measure, and can't quite close.",
  'major-6': "Falling asleep on the same couch and waking up further apart than when your eyes closed, some slow drift no one authorised. Reaching that has gone tired, or reaching that always would have missed by the same small margin no matter how many times you tried. Some afternoons the person is right there and might as well be in another country. Some afternoons the country you're in is one they were never asked to visit.",
  'major-7': "Foot down harder every mile, knowing for hours the road is wrong, unable to lift it. Somewhere in another life the keys have been in your hand for months and the engine is cold and you keep saying tomorrow. Momentum without steering, steering without momentum, both end up in the same parked car at dusk. Going has stopped meaning going, and you can feel the difference in your chest.",
  'major-8': "The mother in the aisle has nothing left, and the child is still crying, and her hand doesn't land on the small back the way it used to because there is no way left. Somewhere else, the storm plays out in front of someone too gentle or too tired to step near it, and the child learns that storms are things you weather alone. Force spent past its edge, force that never quite got called on. Either way the moment moves through the room and past everyone in it, unheld.",
  'major-9': "The small light above the stove has been on for months and the tea has gone cold beside you again. What began as retreat has thickened into a room you can't find the door of, solitude curdling into something you no longer recognise as company. Somewhere else, a person cannot sit still for the length of a phone call, terrified of the quiet that would arrive if they did. The honest hour was taken, in either direction, and nobody noticed it leaving.",
  'major-10': "Winks from the world have gone silent, or you've stopped trusting them, or you're seeing them in everything now and cannot tell the real ones from the ones your loneliness invented. Every song a message. Every stranger a sign. Every coincidence stretched thin over the shape of what you wanted it to mean. And somewhere else, the world has stopped speaking altogether, and you've stopped listening for it, and both of you are worse for the silence.",
  'major-11': "The elder took a side before either party had finished speaking, and the ceremony of listening became a costume worn over a decision already made. In a different room, another elder refuses to judge at all, calls it kindness, calls it neutrality, calls it anything but the cowardice it is becoming. Fairness dressed up and fairness dodged. Both let the wrong thing stand, and both send the wronged person home carrying it alone.",
  'major-12': "The fever won't break, the ceiling fan has been turning for months, and the seeing-things-differently has quietly become a way of never having to move. In another version, the pause won't be tolerated for even a minute, every stillness thrashed against, the fan ripped from the ceiling and thrown out. Neither of you lets the insight land where it was trying to arrive. Time keeps doing something strange, and no one is around to catch what it's offering.",
  'major-13': "Clothes still hanging in the wardrobe. Tin of tea unopened on the shelf. Shoes waiting by the door as if any minute now, and the minutes have quietly become years. In another life, the boxes were packed before the grief could arrive, the door closed on something that wasn't finished with you, and the too-quick clearing left you standing in an empty room whose emptiness you didn't understand.",
  'major-14': "The auntie has stopped tasting the pot. She dumps salt in by the handful and walks away, and nobody at the table says anything because nobody wants to be the one to. In another kitchen, another cook cannot stop adjusting, a little more salt, another squeeze of lime, waiting for a moment of rightness that keeps not arriving. Some meals sit on the table cold. Some never make it to the table at all.",
  'major-15': "Some chains you see clearly and choose again anyway, the seeing becoming part of the pleasure. Others you have spent years explaining to yourself, calling them by kinder names, wearing them under your clothes so no one asks. The lock is on the inside. Everyone knew, including you, especially you.",
  'major-16': "Something in your chest has been ringing for months. You keep almost answering it, keep almost letting it break the thing it is calling you out of. Years ago the foundation gave way and you built a house on the rubble and called it home, learned to love the tilt of the floor, learned to walk with one shoulder lower than the other. The whole structure is asking to be allowed to fall the rest of the way.",
  'major-17': "A shower you keep meaning to take and can't quite bring yourself to stand under, the return to yourself deferred another day, another week, another quiet catastrophe. In another version, the recovery is being performed for the room, brightness turned up past what you actually feel, sitting-in-the-unwell too hard to bear where anyone can see. Hope withheld from yourself. Hope faked to keep the others comfortable. Neither one lets the actual healing in.",
  'major-18': "Cities you no longer trust yourself in, wrong turns you won't take, shadows you've stopped believing you can walk through. Somewhere else, you have vanished so far into the dark you cannot find the road home, and the mind's images have become the only weather you know how to read. The moon keeps rising over both of you. The path is somewhere in the darkness, and neither of you is walking it.",
  'major-19': "A child runs across the courtyard with something to show you and you cannot quite lift your eyes, tired or elsewhere or dimmer than you used to be, or unable to bear the brightness of what they're offering. Somewhere in another life, you are the sun for everyone else, warmth performed at full volume while something in you goes quietly cold. Warmth withheld. Warmth forced. The child keeps running for a while. Then stops.",
  'major-20': "A message has been sitting in your notifications for a full season now, and every morning you almost open it, and every morning something in you decides today isn't the day. In another life you opened it too fast, replied too fast, forgave too fast, and the reconciliation hadn't earned itself yet. The reckoning waits either way, patient as weather, patient as tides. It will still be there when you turn around.",
  'major-21': "A trip that never quite ends, a loop you keep repeating in slightly different clothes, the completion always arranged for next week. Somewhere else, the arrival happened and you couldn't let yourself feel it, packed up before the ending got to be an ending, moved on before you had properly moved through. Wholeness has been waiting for a while now. It keeps almost being let in.",

  // ── Cups ────────────────────────────────────────────────────────────────────
  'cups-ace': "Tea sitting cold in front of you for an hour, the offering arrived and something in you can't lift your hands to receive it. Somewhere else, a cup got knocked from a hand on the way to yours, and neither of you knew how to name what spilled. Something wanted to begin. It hasn't quite been let in, or it hasn't quite been allowed to arrive.",
  'cups-2': "Words you both circled for months finally got said, and something in the air went wrong instead of right. Meanings crossed. You meant one thing and the other person heard another, and now the ordinary conversations have a small cold place in them neither of you knows how to warm. Or the circling just kept happening, and both of you feel it, and neither of you speaks first.",
  'cups-3': "Small kitchen, laughter, food mostly gone, and you're at the edge of the room hearing the party in a different frequency from everyone else. Jokes land and you smile out of politeness and the smile doesn't reach anywhere it needs to. Some nights the belonging is being performed three drinks in, from a version of you that isn't quite present. Later the face-ache is from the wrong reason, and you know it.",
  'cups-4': "Offers sit in your inbox for weeks and you can't tell if you're honestly considering them or just watching them expire on purpose. Your face has been turned toward the wall so long you've forgotten which direction the room was in. Somewhere in you the wanting hasn't come back. Somewhere else it has been there the whole time and you cannot hear it over your own held breath.",
  'cups-5': "Every morning has been the morning-after for a long time now, hands still not knowing what to do with themselves, kettle still boiled and forgotten. Or you've walked past the spilled cups so many times you have stopped seeing them, and stopped seeing the standing ones too, the whole kitchen a place you move through without registering. Something wants to be grieved and finished. Something else wants to be counted, and hasn't been.",
  'cups-6': "A corridor of the old house comes back and you cannot leave it, sitting inside the memory of being seven for hours some days, the present a room you keep exiting through the back. In another version of you, the past has been sealed off so cleanly you can't feel it anymore, and something that should have been kept warm has gone quietly cold. The body still remembers. The body always remembers, whether or not you're speaking to it.",
  'cups-7': "Too many futures shimmering, none of them close enough to touch, and now you can't leave the shimmering, addicted to the fog that lets you never quite choose. In another version, you clutched at the first option that passed and called it decisiveness, refused to see it wasn't what you wanted, and are living inside it now like a coat that doesn't fit. Fantasy that has become its own room. Reality that never got questioned. Both leave you further from what you actually want.",
  'cups-8': "You keep meaning to leave and never quite finish packing, the door half closed for months, the goodbye rehearsed and never delivered. Somewhere else you left too fast, walked out of something before you knew what it was, and are still carrying the shape of what you didn't stay to learn. Leaving well requires knowing what you're leaving. Neither of you did.",
  'cups-9': "Cooking a meal for yourself and finding you can't taste it, sitting at the table performing a pleasure that isn't quite arriving. In a different life, the wish got granted and turned out to be smaller than you'd needed it to be, or larger, or shaped like something you couldn't quite hold. Satisfaction that won't land. Satisfaction that arrived and made you sadder. The plate goes back to the sink either way.",
  'cups-10': "Everyone laughing on the veranda and you're a small distance from all of it, not quite inside the picture, not quite gone. Some versions of belonging cost you a piece of yourself every time you fold small enough to fit. Others never quite got offered no matter how long you stood near the door. The children keep running. Someone keeps laughing. You keep listening from a slightly different room.",
  'cups-page': "A kid brings you a shell they found and you can't quite give it the attention it needed, distracted or too tired or somewhere the shell can't reach. In another version, the shell is real and you're the child, and no one has looked at what you brought them in a long time. Wonder ignored. Wonder that never learned to trust it would be received. Both of you stop bringing shells eventually.",
  'cups-knight': "A letter you keep meaning to write and never finish, the affection real and the delivery stalled, the paper going yellow in the drawer. Somewhere else, the gesture arrived so grand it swallowed the person it was meant for, romance performed at a volume that stopped meaning anything. Love that couldn't cross the room. Love that arrived shouting. Neither one landed.",
  'cups-queen': "Some friends you would have called at a bad hour have gone somewhere you can't reach now, or they've picked up so many times they can no longer hold their own life. Empathy withdrawn behind a wall, or empathy stretched so thin the person offering it is disappearing inside it. The phone rings differently depending on which of you it is this year. Both of you know it.",
  'cups-king': "A father who was steady has gone still in a different way, the calm turned to distance, the tea still being made but nobody's certain who it's for anymore. In another life, the steadiness cracked and the whole household is now walking around what broke. Feeling suppressed until it went strange. Feeling let loose without a shape to hold it. Both need someone to sit with them, and there isn't one.",

  // ── Swords ──────────────────────────────────────────────────────────────────
  'swords-ace': "Clarity you had for a moment last week is gone, and you can't find it, and every attempt to write it down makes it further away. Somewhere else, you're wielding an idea you haven't examined closely enough, calling it truth because it's the sharpest thing in your hand. Insight lost, or insight weaponised too soon. Both cut, and both cut wrong.",
  'swords-2': "A decision you've been avoiding is starting to make itself, quietly, without your permission, in the shape of what you keep not doing. In another version, you've torn the blindfold off and are now making the choice at high speed, refusing the pause the choice actually needed. Refusing to decide is deciding. Deciding too fast is refusing too.",
  'swords-3': "Grief has been sitting in your chest so long you've built a room around it, decorated it, learned to receive guests in it. Somewhere else, you never let it in at all, sealed the door, and now the grief lives in your shoulders, your jaw, the small explanations you keep having to make for your own behaviour. Sorrow rehearsed. Sorrow refused. The body carries both.",
  'swords-4': "Rest keeps sliding into next week again, and next week, and next week, and now you can't remember when you last actually stopped. In another life, you've been resting so long the resting has become hiding, curtains permanent, phone permanently in another room. Depletion, or retreat that has forgotten its way back. Either way, the body has been trying to tell you something.",
  'swords-5': "An argument you won is still going, months later, replayed in your head with different endings, none of them ones you're proud of. Somewhere else, you walked away from a fight you should have had, and the not-having has become a small stone you carry from room to room. Victory that curdled. Conflict that got swallowed. Both cost.",
  'swords-6': "You keep meaning to get on the boat and every morning something else needs you first, and the far shore is still there, and you are still here. Somewhere else, you got on the boat but didn't leave what you were leaving, brought all of it with you in different clothes, and the far shore turned out to be exactly the near one. Departure deferred. Departure that never actually departed.",
  'swords-7': "A small lie you told is being discovered slowly, one detail at a time, and you can feel it happening and cannot decide whether to confess or wait. In another version, you've been so scrupulously honest for so long you've become sharp with it, using truth as a way of not having to be kind. Concealment about to collapse. Honesty being wielded like a blade. Both hurt the people around you.",
  'swords-8': "You've begun to see the walls you built, and the seeing is worse than the not-seeing was, and you don't yet know what to do with the freedom that's approaching. Somewhere else, you've catalogued the walls so thoroughly you've built a whole life around explaining them, and the explaining has become another wall. Just starting to see. Seeing without moving. Both close to something.",
  'swords-9': "3am has stopped being an occasional visit and become the shape of your days, so familiar you've stopped calling it suffering. In another version, you've been suppressing the thought so successfully it's finding you sideways now, through the body, through the small collapses of ordinary moments. Anxiety that has become furniture. Anxiety that has gone underground. Neither is asleep.",
  'swords-10': "A collapse that already happened is being relived every morning, the ending refusing to stay ended, ten swords still in the back long after they should have been drawn out. Or you jumped up from the floor before you were ready, insisted on the recovery, and the wounds are healing badly because they weren't given time. Lying there too long. Standing up too soon. Both leave scar tissue you'll feel for years.",
  'swords-page': "Teenagers who were once so certain have become cynical too early, sharpness turned to cruelty, curiosity turned to constant testing. In another version, they never developed the edge at all, absorbed every idea without ever pushing back on one, and are now a room full of other people's furniture. Sharpness that hurts. Sharpness that never came. Neither is thinking.",
  'swords-knight': "Friends who tell the truth without softening it have stopped softening the delivery too, and the truth is landing as attack now, and people are starting to keep their distance. Somewhere else, the same person has gone quiet, stopped telling the truth altogether, decided the delivering isn't worth the cost. Directness without care. Care that has swallowed the directness. Both leave the truth unsaid.",
  'swords-queen': "Women who could see through most things have begun to see cruelty in everything, mistaking suspicion for clarity, keeping people at a distance that started as protection and is now just distance. In another version, she has softened past the point of usefulness, refuses to name what she sees, calls it grace. Discernment turned cold. Discernment abandoned. Neither one is the wisdom she used to hold.",
  'swords-king': "A judge who has begun ruling on things he no longer understands, mistaking authority for accuracy, cold where cold isn't called for. Or he has lost his nerve, refuses to rule at all, calls it humility when it's really that he's stopped trusting his own mind. Intellect without warmth. Intellect that has withdrawn. Both leave the room without the ruling it came for.",

  // ── Wands ───────────────────────────────────────────────────────────────────
  'wands-ace': "An idea that woke you at 5am has been sitting on your desk for three weeks and you haven't touched it, the heat gone, the moment passed. In another version, you started so many things this month you can't finish any of them, all of them clamouring, none of them getting the fire. Spark that went out. Spark scattered across too many rooms. Neither is going to build.",
  'wands-2': "A decision made on the rooftop has begun to feel wrong and you can't tell if it's cold feet or genuine wisdom. Somewhere else, you're still on the rooftop looking, and looking, and looking, and the deciding keeps getting deferred to another view. Second-guessing after the fact. Refusing to move at all. The city keeps going without you.",
  'wands-3': "Ships you sent out are late, or they aren't coming back, or you're refusing to check the horizon because you can't bear another day of nothing. In another version, you sent so many ships you've stopped tracking them, and half the ventures have quietly failed while you were looking at the others. Anxious watching. Watching without seeing. Both leave the shore feeling empty.",
  'wands-4': "Celebration is happening around you and you can't quite feel it, going through the motions of the good time, smiling at the right moments, elsewhere in a way only you notice. Somewhere else, the party never happened, the milestone passed unmarked, the thing you built didn't get its ceremony. Joy performed. Joy skipped. Both leave a small hollow where the marking should have been.",
  'wands-5': "A group project that has become a war of egos is still going, in emails, in group chats, in your head at night, long after the actual project stopped mattering. In another version, you've stopped fighting for anything, agree to everything, and are quietly furious about it. Conflict that won't end. Conflict swallowed. Both cost more than the disagreement was worth.",
  'wands-6': "Wins you got are being talked about too much, in too many rooms, and you can feel yourself becoming the story instead of the person. Somewhere else, the win happened and no one noticed, or you couldn't accept it, and the recognition you'd worked for slid past without landing. Applause that has become its own weight. Applause that never came. Neither is what you actually needed.",
  'wands-7': "A position you were holding has become a bunker you can't leave, defending long after there's anyone left attacking. Or you have already given up the ground, backed down from the thing you knew was worth holding, and are now living with the knowing. Defence that has become paranoia. Defence surrendered. Both leave you tired in different ways.",
  'wands-8': "Messages have stopped coming, or they've slowed to a trickle, and the momentum you were counting on has quietly become a wait. Somewhere else, everything is arriving at once and none of it in the order it should, chaos wearing the mask of progress. Stalled. Overwhelmed. Both make it hard to feel where the current actually is.",
  'wands-9': "A last push has become the fifth-last push, and you don't have anything left, and you're still standing on the wall because you don't know how to step down. In another version, you stepped down early, gave up on the ninety-percent-done thing, and the giving-up is still living in your body. Depleted past useful. Quit before the finish. Both leave the last stretch unwalked.",
  'wands-10': "Whatever you were carrying has become who you are, and you can't remember what you look like without it, and you're afraid to find out. Somewhere else, you've dropped everything at once, refused all of it, and now you're standing empty-handed in a life that needed some of what you were carrying. Burden fused to identity. Burden refused entirely. Neither is the honest weight.",
  'wands-page': "Friends who used to call with a new plan have gone quiet, or have become impossible to trust because the plans have started collapsing before they leave the ground. In another version, you're the friend, and something in you has stopped starting things because the last three didn't finish. Enthusiasm that has become noise. Enthusiasm that has gone out. Both leave the room without the spark it used to have.",
  'wands-knight': "Cousins who booked flights before deciding where to stay have begun to leave real damage in their wake, and the stories aren't funny anymore. Somewhere else, he's stopped moving altogether, the wildness spent, the calls at odd hours no longer coming. Recklessness that started costing others. Recklessness that has burned itself out. The life around him is quieter, and worse for it.",
  'wands-queen': "Women who used to walk into a room have begun to need the room to notice, and something in her has thinned, and everyone can feel it and no one says. In another version, she has stepped out of the light altogether, refuses to take up the space she used to, calls it maturity when it's really something else. Magnetism that needs an audience. Magnetism withdrawn. Neither is her actual heat.",
  'wands-king': "Founders who have begun to believe their own myth, vision running the company off a cliff nobody can name to him. Somewhere else, he's lost his conviction, is second-guessing every call, and the team can feel the ground shifting under them. Vision unchecked. Vision abandoned. Both leave the people who trusted him nowhere to stand.",

  // ── Pentacles ───────────────────────────────────────────────────────────────
  'pentacles-ace': "An offer arrived and you can't quite receive it, some old story about not deserving still sitting between you and the gift. In another version, you took it too fast, without asking what came with it, and are now inside a beginning you don't fully own. Opportunity refused. Opportunity taken without looking. Both leave the seed unplanted in the ground it actually needed.",
  'pentacles-2': "Juggling has become dropping, and you're pretending you can still hold everything, and the tired is starting to show in ways you can't hide. Somewhere else, you've refused to juggle at all, dropped everything on purpose to force a rest, and the pieces are scattered across the room. Overwhelm without release. Collapse dressed as choice. Neither is balance.",
  'pentacles-3': "Kitchens that used to run themselves now no one knows who's chopping what, resentments building over who does what work, the meal coming out late and wrong. In another version, you've become so much the one doing everything that no one else knows how anymore, and the whole thing rests on you and only you. Collaboration frayed. Collaboration collapsed into one person. Both make the meal harder than it needed to be.",
  'pentacles-4': "A tin under the bed has become a sickness, counting twice becoming counting five times, careful becoming controlling. Or the opposite has happened, the careful released too fast, the tin emptied out to prove something to yourself, and now you're vulnerable in ways you didn't intend. Hoarding. Reckless releasing. Both are the same fear wearing different clothes.",
  'pentacles-5': "Winters you'd rather not remember are coming back, in dreams, in flinches, in the way you handle money now decades later. In another version, help you needed has finally arrived and you can't accept it, don't know how, keep declining out of a habit you learned when there was no other option. Wound reopening. Help refused. Both keep the cold present.",
  'pentacles-6': "Generosity has become performance, given for what it says about you rather than what it gives to them. Somewhere else, you've been on the receiving end so long you can't remember how to give, or you've become bitter about needing at all. Giving as ego. Taking as habit. Neither is the exchange the card was pointing at.",
  'pentacles-7': "A plant you've been tending has stopped growing and you can't tell if the problem is the soil, the light, or the tending itself, and you keep tending anyway. In another version, you've stopped tending too early, walked away from something that just needed one more season, and are watching it die from another room. Effort that isn't landing. Effort abandoned. The garden knows either way.",
  'pentacles-8': "A two-thousandth repetition has become the twenty-thousandth and you can't feel yourself getting better anymore, mastery turning to monotony. Or you have refused the repetition altogether, chased novelty, and have twelve skills at the same shallow depth. Craft that has gone stale. Craft that never went deep. Neither is the mastery you were reaching for.",
  'pentacles-9': "Gardens you built have become places you can't leave, luxury turning to loneliness, self-sufficiency becoming a wall no one can cross. In another version, you're still working for the garden and it never quite arrives, always another year, always another push. Solitude that has become isolation. Rest deferred forever. Neither is the earned quiet you were building toward.",
  'pentacles-10': "Family has become an obligation you can't refuse, generations of expectation sitting on your shoulders, the dish still being made in that kitchen and you can feel yourself becoming the one who has to keep making it. Somewhere else, the lineage has broken, the recipes lost, the house sold, and you're the first generation who won't inherit any of it. Inheritance that weighs. Inheritance that isn't coming. Both leave you standing outside the chain.",
  'pentacles-page': "Kids saving for the thing have lost patience, spent it all on the wrong thing, and are now further from the goal than when they started. In another version, they saved so long and so carefully they forgot what they were saving for, and the jar has become the thing itself. Discipline collapsed. Discipline that became its own trap. Neither is the practice the card was teaching.",
  'pentacles-knight': "Friends who said they'd help you move never turned up, or turned up hours late without apology, and something small but important has shifted in what you can count on. Somewhere else, he's still helping, always helping, and you can see the resentment building in him and neither of you is naming it. Reliability that broke. Reliability being extracted from him. Both leave the thing badly moved.",
  'pentacles-queen': "An auntie's house has stopped feeling warm and you don't know when the change happened, food still being made but with less care, invitation still standing but a little colder now. In another version, she's given so much for so long that nothing is left, and the house is warm but she isn't in it anymore. Nurture withdrawn. Nurture exhausted. Both leave the guest less fed than they arrived.",
  'pentacles-king': "An old man who owned the shop has begun cutting corners, letting the quality slip, chasing a growth he never used to need. Somewhere else, he has grown too cautious, refused every chance to change, and the shop is dying slowly while he insists everything is fine. Greed that arrived late. Rigidity that will not adapt. Either way, the thing he built for forty years is starting to come apart, and he is the last to see it.",
};
