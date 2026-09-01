/**
 * House Context Mappings
 *
 * Natural language descriptions of what each astrological house represents
 * in everyday, emotionally resonant terms.
 */

export interface HouseContext {
  number: number;
  coreThemes: string[];
  emotionalResonance: string; // What it feels like when this area is activated
  naturalPhrases: string[]; // Ways to reference this house area naturally
  questionPrompts: string[]; // Questions that point to this area of life
}

export const houseContexts: Record<number, HouseContext> = {
  1: {
    number: 1,
    coreThemes: ['self', 'identity', 'how you show up', 'first impressions', 'your face to the world'],
    emotionalResonance: 'who you are and how you move through the world',
    naturalPhrases: [
      'your 1st house - the house of self',
      'how you show up in the world',
      'your identity, who you are',
      'the face you present',
      'how you move through life'
    ],
    questionPrompts: [
      'who are you becoming?',
      'how do you want to be seen?',
      'what version of yourself is emerging?',
      'how are you showing up differently?'
    ]
  },

  2: {
    number: 2,
    coreThemes: ['resources', 'values', 'self-worth', 'money', 'what you own'],
    emotionalResonance: 'what you have and what you\'re worth',
    naturalPhrases: [
      'your 2nd house - resources and worth',
      'what you value, what you have',
      'your sense of worth',
      'money and resources',
      'what you own and what owns you'
    ],
    questionPrompts: [
      'what do you actually value?',
      'what are you worth?',
      'what resources do you have access to?',
      'what\'s your relationship with having enough?'
    ]
  },

  3: {
    number: 3,
    coreThemes: ['communication', 'siblings', 'neighbors', 'short trips', 'daily life', 'how you think and speak'],
    emotionalResonance: 'how you communicate and connect with your immediate world',
    naturalPhrases: [
      'your 3rd house of communication',
      'how you speak and think',
      'your immediate environment',
      'daily interactions and exchanges',
      'the conversations you\'re having'
    ],
    questionPrompts: [
      'how are you communicating?',
      'what needs to be said?',
      'are you being heard?',
      'what conversations are you avoiding?'
    ]
  },

  4: {
    number: 4,
    coreThemes: ['home', 'family', 'roots', 'foundation', 'private life', 'where you come from'],
    emotionalResonance: 'home territory - the foundation, the family dynamics, the stuff you thought was solid',
    naturalPhrases: [
      'your 4th house - foundations and family',
      'home, roots, where you come from',
      'your private life, your foundation',
      'family dynamics and home base',
      'the ground you\'re standing on'
    ],
    questionPrompts: [
      'what foundation needs attention?',
      'what family patterns are showing up?',
      'where do you actually feel at home?',
      'what\'s your relationship with your roots?'
    ]
  },

  5: {
    number: 5,
    coreThemes: ['pleasure', 'creativity', 'romance', 'children', 'joy', 'self-expression'],
    emotionalResonance: 'where joy lives and creativity flows',
    naturalPhrases: [
      'your 5th house of pleasure and creativity',
      'joy, play, creative expression',
      'romance and what brings delight',
      'where you create and celebrate',
      'what makes you feel alive'
    ],
    questionPrompts: [
      'when was the last time you felt real joy?',
      'what wants to be created?',
      'are you letting yourself play?',
      'what brings you pleasure without purpose?'
    ]
  },

  6: {
    number: 6,
    coreThemes: ['daily work', 'health', 'service', 'routine', 'the body', 'maintenance'],
    emotionalResonance: 'the daily grind - your body, your routines, your service',
    naturalPhrases: [
      'your 6th house - daily life and health',
      'work, routine, how you serve',
      'your body and daily habits',
      'the practical stuff, the maintenance',
      'how you take care of things'
    ],
    questionPrompts: [
      'what daily habits are serving you?',
      'how\'s your body feeling?',
      'what needs tending?',
      'are you working yourself to the bone?'
    ]
  },

  7: {
    number: 7,
    coreThemes: ['partnerships', 'marriage', 'contracts', 'others', 'one-on-one relationships'],
    emotionalResonance: 'the other - partnerships, commitments, what you see in the mirror of relationship',
    naturalPhrases: [
      'your 7th house of partnerships',
      'committed relationships, the other',
      'marriage, contracts, agreements',
      'one-on-one connections',
      'what you see in others'
    ],
    questionPrompts: [
      'what do your relationships reflect?',
      'what are you committing to?',
      'what does the other person show you?',
      'are you in it together or alone together?'
    ]
  },

  8: {
    number: 8,
    coreThemes: ['transformation', 'death/rebirth', 'shared resources', 'intimacy', 'what\'s hidden', 'power'],
    emotionalResonance: 'the deep stuff - transformation, shared resources, what you inherit',
    naturalPhrases: [
      'your 8th house - transformation and depth',
      'shared resources, intimacy, power',
      'what you inherit from others',
      'death, rebirth, the depths',
      'where things get intense'
    ],
    questionPrompts: [
      'what needs to transform completely?',
      'what are you sharing or inheriting?',
      'where\'s the power dynamic?',
      'what\'s hidden that needs light?'
    ]
  },

  9: {
    number: 9,
    coreThemes: ['beliefs', 'higher learning', 'travel', 'philosophy', 'meaning', 'expansion'],
    emotionalResonance: 'the search for meaning - beliefs, learning, distant horizons',
    naturalPhrases: [
      'your 9th house of beliefs and meaning',
      'higher learning, philosophy, truth',
      'long journeys and expansion',
      'what you believe and why',
      'the bigger picture'
    ],
    questionPrompts: [
      'what do you actually believe?',
      'what\'s the meaning you\'re seeking?',
      'where do you need to expand?',
      'what truth are you looking for?'
    ]
  },

  10: {
    number: 10,
    coreThemes: ['career', 'public life', 'reputation', 'authority', 'what you\'re building', 'legacy'],
    emotionalResonance: 'what you\'re building in the world - career, reputation, public life',
    naturalPhrases: [
      'your 10th house - career and public life',
      'what you\'re building, your reputation',
      'the work you\'re here to do',
      'how the world sees you',
      'your legacy and authority'
    ],
    questionPrompts: [
      'what are you building?',
      'what do you want to be known for?',
      'is this the work you\'re meant to do?',
      'what\'s your relationship with authority?'
    ]
  },

  11: {
    number: 11,
    coreThemes: ['community', 'friends', 'hopes and dreams', 'groups', 'the future', 'belonging'],
    emotionalResonance: 'your people and your future - community, belonging, hopes',
    naturalPhrases: [
      'your 11th house - community and belonging',
      'friends, groups, your people',
      'hopes for the future',
      'where you belong',
      'the life you\'re building towards'
    ],
    questionPrompts: [
      'who are your people?',
      'where do you belong?',
      'what are you hoping for?',
      'what future are you building?'
    ]
  },

  12: {
    number: 12,
    coreThemes: ['the unconscious', 'spirituality', 'solitude', 'what\'s hidden', 'release', 'the unseen'],
    emotionalResonance: 'the hidden realm - your inner life that no one else sees',
    naturalPhrases: [
      'your 12th house - the hidden realm',
      'solitude, spirituality, the unseen',
      'your inner life, the unconscious',
      'what you process alone',
      'the space between worlds'
    ],
    questionPrompts: [
      'what are you processing in private?',
      'what needs to be released?',
      'what\'s happening in your inner world?',
      'what spiritual work is calling?'
    ]
  }
};

/**
 * Get a random natural phrase for a house
 */
export function getRandomHousePhrase(houseNumber: number): string {
  const house = houseContexts[houseNumber];
  if (!house) return '';

  const phrases = house.naturalPhrases;
  return phrases[Math.floor(Math.random() * phrases.length)];
}

/**
 * Get a question prompt for a house
 */
export function getRandomHouseQuestion(houseNumber: number): string {
  const house = houseContexts[houseNumber];
  if (!house) return '';

  const questions = house.questionPrompts;
  return questions[Math.floor(Math.random() * questions.length)];
}

/**
 * Get emotional resonance description for a house
 */
export function getHouseEmotionalResonance(houseNumber: number): string {
  const house = houseContexts[houseNumber];
  return house?.emotionalResonance || '';
}
