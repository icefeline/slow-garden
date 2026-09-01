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
