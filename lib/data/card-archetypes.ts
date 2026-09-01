/**
 * Card Archetypes
 *
 * Core psychological and emotional themes for each tarot card.
 * Used to generate natural, conversational insights.
 * Includes both upright and reversed meanings.
 */

export interface CardArchetype {
  id: string;
  name: string;
  upright: {
    coreThemes: string[];
    emotionalTone: 'challenging' | 'neutral' | 'expansive';
    psychologicalFocus: string[];
    actionQualities: string[];
    naturalPhrases: string[];
  };
  reversed: {
    coreThemes: string[];
    emotionalTone: 'challenging' | 'neutral' | 'expansive';
    psychologicalFocus: string[];
    actionQualities: string[];
    naturalPhrases: string[];
  };
}

export const cardArchetypes: Record<string, CardArchetype> = {
  // MAJOR ARCANA
  'major-0': {
    id: 'major-0',
    name: 'The Fool',
    upright: {
      coreThemes: ['new beginnings', 'trust', 'leap of faith', 'innocence', 'potential'],
      emotionalTone: 'expansive',
      psychologicalFocus: ['taking risks', 'letting go of certainty', 'trusting the unknown'],
      actionQualities: ['starting fresh', 'stepping into the unknown', 'following impulse'],
      naturalPhrases: [
        'the leap you\'re being asked to take',
        'that new beginning knocking',
        'the fresh start available',
        'starting without a map'
      ]
    },
    reversed: {
      coreThemes: ['recklessness', 'fear of change', 'holding back', 'naivety', 'missed opportunities'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['fear stopping you', 'not trusting yourself', 'staying stuck in safety'],
      actionQualities: ['hesitating', 'overthinking', 'playing it safe', 'missing the moment'],
      naturalPhrases: [
        'the leap you\'re afraid to take',
        'the fear keeping you stuck',
        'playing it too safe',
        'the opportunity you\'re missing'
      ]
    }
  },

  'major-13': {
    id: 'major-13',
    name: 'Death',
    upright: {
      coreThemes: ['endings', 'transformation', 'release', 'transition', 'rebirth'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['letting go completely', 'accepting endings', 'what needs to die'],
      actionQualities: ['releasing', 'ending', 'transforming', 'allowing death'],
      naturalPhrases: [
        'what needs to end completely',
        'the transformation',
        'the ending that has to happen',
        'what you\'re releasing',
        'the death of an old way'
      ]
    },
    reversed: {
      coreThemes: ['resistance to change', 'fear of letting go', 'stuck in transition', 'clinging'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['refusing to let go', 'holding onto what\'s dead', 'fear of the unknown'],
      actionQualities: ['resisting', 'clinging', 'staying stuck', 'avoiding the end'],
      naturalPhrases: [
        'what you\'re refusing to let go of',
        'the ending you\'re resisting',
        'clinging to what\'s already dead',
        'the transformation you\'re avoiding'
      ]
    }
  },

  'major-16': {
    id: 'major-16',
    name: 'The Tower',
    upright: {
      coreThemes: ['sudden change', 'breakdown', 'truth revealed', 'false structures falling'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['facing uncomfortable truth', 'releasing control', 'what can\'t be held together any more'],
      actionQualities: ['letting it fall', 'naming what\'s crumbling', 'clearing space'],
      naturalPhrases: [
        'what\'s falling apart',
        'the breakdown',
        'what can\'t hold any more',
        'the truth getting loud',
        'the structure collapsing'
      ]
    },
    reversed: {
      coreThemes: ['avoiding disaster', 'delaying the inevitable', 'internal breakdown', 'fear of change'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['seeing it coming but frozen', 'internal collapse', 'prolonging the fall'],
      actionQualities: ['resisting collapse', 'internal crumbling', 'delaying truth', 'holding on tighter'],
      naturalPhrases: [
        'the breakdown happening internally',
        'what you\'re trying to hold together',
        'the collapse you see coming',
        'the truth you\'re avoiding'
      ]
    }
  },

  'major-17': {
    id: 'major-17',
    name: 'The Star',
    upright: {
      coreThemes: ['hope', 'healing', 'renewal', 'guidance', 'faith'],
      emotionalTone: 'expansive',
      psychologicalFocus: ['believing again', 'finding hope', 'healing after loss'],
      actionQualities: ['hoping', 'trusting', 'healing', 'rebuilding faith'],
      naturalPhrases: [
        'hope rebuilding',
        'the healing available',
        'faith returning',
        'the light coming back',
        'renewal after destruction'
      ]
    },
    reversed: {
      coreThemes: ['loss of faith', 'disconnection', 'despair', 'feeling lost'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['can\'t see the light', 'losing hope', 'feeling abandoned'],
      actionQualities: ['losing faith', 'disconnecting', 'despairing', 'giving up'],
      naturalPhrases: [
        'the hope that\'s hard to find',
        'feeling disconnected from yourself',
        'the faith that\'s fading',
        'when the light feels distant'
      ]
    }
  },

  'major-9': {
    id: 'major-9',
    name: 'The Hermit',
    upright: {
      coreThemes: ['solitude', 'inner wisdom', 'introspection', 'guidance from within'],
      emotionalTone: 'neutral',
      psychologicalFocus: ['going inward', 'finding your own answers', 'wisdom through solitude'],
      actionQualities: ['withdrawing', 'reflecting', 'seeking within', 'being alone'],
      naturalPhrases: [
        'the solitude teaching you',
        'going inward',
        'what you learn alone',
        'the inner work',
        'the wisdom in withdrawal'
      ]
    },
    reversed: {
      coreThemes: ['isolation', 'loneliness', 'withdrawal taken too far', 'refusing help'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['isolated, not alone', 'avoiding connection', 'lost in yourself'],
      actionQualities: ['hiding', 'isolating', 'refusing community', 'staying too long in solitude'],
      naturalPhrases: [
        'the isolation that\'s too much',
        'withdrawal that\'s become hiding',
        'when solitude turns to loneliness',
        'refusing the help available'
      ]
    }
  },

  'major-1': {
    id: 'major-1',
    name: 'The Magician',
    upright: {
      coreThemes: ['manifestation', 'resourcefulness', 'power', 'skill', 'action'],
      emotionalTone: 'expansive',
      psychologicalFocus: ['recognizing your power', 'having what you need', 'aligning will with action'],
      actionQualities: ['manifesting', 'creating', 'wielding tools', 'making it happen', 'directing energy'],
      naturalPhrases: [
        'the power you already have',
        'what you can create',
        'the tools at your disposal',
        'making things happen',
        'your ability to manifest'
      ]
    },
    reversed: {
      coreThemes: ['manipulation', 'unused potential', 'trickery', 'self-doubt', 'misused power'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['not trusting your gifts', 'manipulating instead of creating', 'power misused'],
      actionQualities: ['doubting yourself', 'manipulating', 'wasting potential', 'scattered energy'],
      naturalPhrases: [
        'the power you\'re not using',
        'when skill becomes manipulation',
        'doubting what you can do',
        'the gifts going unused'
      ]
    }
  },

  'major-2': {
    id: 'major-2',
    name: 'The High Priestess',
    upright: {
      coreThemes: ['intuition', 'mystery', 'inner knowing', 'the unconscious', 'hidden knowledge'],
      emotionalTone: 'neutral',
      psychologicalFocus: ['trusting what you sense', 'accessing deeper knowing', 'honoring mystery'],
      actionQualities: ['listening within', 'trusting intuition', 'waiting for clarity', 'honouring the unknown'],
      naturalPhrases: [
        'what you already know',
        'the intuition speaking',
        'the mystery unfolding',
        'what\'s sensed but not seen',
        'the knowing beneath words'
      ]
    },
    reversed: {
      coreThemes: ['disconnection from intuition', 'secrets', 'hidden agendas', 'ignoring inner voice'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['not trusting your gut', 'disconnected from knowing', 'secrets keeping you stuck'],
      actionQualities: ['ignoring intuition', 'hiding truth', 'overthinking instead of sensing', 'blocking inner voice'],
      naturalPhrases: [
        'the intuition you\'re ignoring',
        'disconnected from your knowing',
        'the secrets weighing on you',
        'when you can\'t hear yourself'
      ]
    }
  },

  'major-3': {
    id: 'major-3',
    name: 'The Empress',
    upright: {
      coreThemes: ['abundance', 'nurturing', 'creativity', 'growth', 'sensuality'],
      emotionalTone: 'expansive',
      psychologicalFocus: ['allowing abundance', 'creative fertility', 'nurturing yourself and others'],
      actionQualities: ['creating', 'nurturing', 'growing', 'receiving abundance', 'being present in body'],
      naturalPhrases: [
        'the abundance around you',
        'what wants to grow',
        'the creative fertility',
        'nurturing what matters',
        'letting yourself receive'
      ]
    },
    reversed: {
      coreThemes: ['creative blocks', 'neglect', 'smothering', 'scarcity mindset', 'disconnection from body'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['feeling depleted', 'over-nurturing others', 'blocking abundance'],
      actionQualities: ['neglecting self', 'smothering', 'blocking creativity', 'refusing abundance'],
      naturalPhrases: [
        'the abundance you can\'t see',
        'nurturing everyone but yourself',
        'the creative block',
        'when caring becomes depletion'
      ]
    }
  },

  'major-4': {
    id: 'major-4',
    name: 'The Emperor',
    upright: {
      coreThemes: ['structure', 'authority', 'stability', 'leadership', 'control'],
      emotionalTone: 'neutral',
      psychologicalFocus: ['creating order', 'owning authority', 'providing structure'],
      actionQualities: ['leading', 'organizing', 'establishing boundaries', 'taking control', 'building systems'],
      naturalPhrases: [
        'the structure you need',
        'taking charge',
        'the order you\'re creating',
        'your authority',
        'the boundaries you\'re setting'
      ]
    },
    reversed: {
      coreThemes: ['rigidity', 'tyranny', 'lack of discipline', 'domination', 'loss of control'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['control becoming rigid', 'authority misused', 'lacking discipline'],
      actionQualities: ['dominating', 'being inflexible', 'losing control', 'forcing order'],
      naturalPhrases: [
        'when control becomes rigid',
        'the structure that\'s too tight',
        'authority misused',
        'the discipline you\'re lacking'
      ]
    }
  },

  'major-5': {
    id: 'major-5',
    name: 'The Hierophant',
    upright: {
      coreThemes: ['tradition', 'spiritual guidance', 'conformity', 'institutions', 'shared values'],
      emotionalTone: 'neutral',
      psychologicalFocus: ['seeking guidance', 'honoring tradition', 'learning from structures'],
      actionQualities: ['seeking counsel', 'following tradition', 'learning from elders', 'joining institutions'],
      naturalPhrases: [
        'the guidance you\'re seeking',
        'the tradition holding you',
        'wisdom from those before',
        'the structure that teaches',
        'seeking spiritual counsel'
      ]
    },
    reversed: {
      coreThemes: ['rebellion', 'breaking convention', 'dogma', 'false teachers', 'personal beliefs'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['questioning authority', 'rejecting tradition', 'finding your own way'],
      actionQualities: ['breaking rules', 'questioning dogma', 'rebelling', 'going your own way'],
      naturalPhrases: [
        'the tradition you\'re questioning',
        'breaking from convention',
        'the rules that don\'t fit',
        'finding your own path'
      ]
    }
  },

  'major-6': {
    id: 'major-6',
    name: 'The Lovers',
    upright: {
      coreThemes: ['choice', 'union', 'alignment', 'values', 'relationships'],
      emotionalTone: 'expansive',
      psychologicalFocus: ['choosing what aligns', 'honouring relationships', 'values-based decisions'],
      actionQualities: ['choosing', 'committing', 'aligning', 'uniting', 'honoring connection'],
      naturalPhrases: [
        'the choice before you',
        'what you\'re aligning with',
        'the relationship deepening',
        'choosing what matters',
        'the union forming'
      ]
    },
    reversed: {
      coreThemes: ['disharmony', 'misalignment', 'poor choices', 'disconnection', 'values conflict'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['out of alignment', 'conflicting values', 'disconnection in relationship'],
      actionQualities: ['avoiding choice', 'misaligning', 'disconnecting', 'compromising values'],
      naturalPhrases: [
        'the misalignment',
        'when values don\'t match',
        'the choice you\'re avoiding',
        'disconnection growing'
      ]
    }
  },

  'major-7': {
    id: 'major-7',
    name: 'The Chariot',
    upright: {
      coreThemes: ['willpower', 'determination', 'victory', 'control', 'direction'],
      emotionalTone: 'expansive',
      psychologicalFocus: ['harnessing opposing forces', 'directed will', 'moving forward with purpose'],
      actionQualities: ['driving forward', 'controlling direction', 'winning', 'staying focused', 'mastering forces'],
      naturalPhrases: [
        'the momentum building',
        'your determination',
        'staying the course',
        'the victory ahead',
        'directing your will'
      ]
    },
    reversed: {
      coreThemes: ['lack of direction', 'loss of control', 'aggression', 'scattered energy', 'spinning wheels'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['losing direction', 'forces pulling apart', 'control slipping'],
      actionQualities: ['losing control', 'going nowhere', 'forcing things', 'scattered effort'],
      naturalPhrases: [
        'the control slipping',
        'momentum lost',
        'when effort goes nowhere',
        'the direction unclear'
      ]
    }
  },

  'major-8': {
    id: 'major-8',
    name: 'Strength',
    upright: {
      coreThemes: ['inner strength', 'courage', 'compassion', 'patience', 'gentle power'],
      emotionalTone: 'expansive',
      psychologicalFocus: ['finding courage within', 'taming through gentleness', 'patient endurance'],
      actionQualities: ['enduring', 'taming gently', 'showing courage', 'being patient', 'leading with compassion'],
      naturalPhrases: [
        'the strength you have',
        'gentle power',
        'the courage within',
        'taming through patience',
        'your quiet resilience'
      ]
    },
    reversed: {
      coreThemes: ['self-doubt', 'weakness', 'raw emotion', 'abuse of power', 'lack of courage'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['doubting your strength', 'overwhelmed by emotions', 'force instead of gentleness'],
      actionQualities: ['giving up', 'using force', 'doubting self', 'losing patience'],
      naturalPhrases: [
        'the strength you doubt',
        'when gentleness fails',
        'courage wavering',
        'the fight within yourself'
      ]
    }
  },

  'major-10': {
    id: 'major-10',
    name: 'Wheel of Fortune',
    upright: {
      coreThemes: ['cycles', 'fate', 'turning point', 'change', 'destiny'],
      emotionalTone: 'neutral',
      psychologicalFocus: ['accepting life\'s cycles', 'recognising turning points', 'surrendering to change'],
      actionQualities: ['accepting change', 'moving with cycles', 'recognising patterns', 'letting life turn'],
      naturalPhrases: [
        'the cycle turning',
        'change arriving',
        'the wheel moving',
        'what\'s shifting',
        'life\'s natural rhythm'
      ]
    },
    reversed: {
      coreThemes: ['bad luck', 'resistance to change', 'breaking cycles', 'lack of control'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['resisting natural change', 'feeling unlucky', 'stuck in negative cycle'],
      actionQualities: ['resisting change', 'fighting fate', 'stuck in pattern', 'feeling powerless'],
      naturalPhrases: [
        'the cycle you\'re stuck in',
        'resisting the turn',
        'when luck feels absent',
        'the pattern repeating'
      ]
    }
  },

  'major-11': {
    id: 'major-11',
    name: 'Justice',
    upright: {
      coreThemes: ['fairness', 'truth', 'accountability', 'cause and effect', 'integrity'],
      emotionalTone: 'neutral',
      psychologicalFocus: ['facing consequences', 'seeking fairness', 'honoring truth'],
      actionQualities: ['being honest', 'taking accountability', 'seeking balance', 'making it right', 'judging fairly'],
      naturalPhrases: [
        'the truth emerging',
        'accountability required',
        'what\'s fair',
        'cause meeting effect',
        'balance being restored'
      ]
    },
    reversed: {
      coreThemes: ['unfairness', 'dishonesty', 'avoiding accountability', 'bias', 'legal troubles'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['facing injustice', 'avoiding consequences', 'dishonesty with self'],
      actionQualities: ['being dishonest', 'avoiding truth', 'treating unfairly', 'escaping consequences'],
      naturalPhrases: [
        'the unfairness',
        'avoiding what\'s due',
        'the truth you\'re dodging',
        'when things aren\'t right'
      ]
    }
  },

  'major-12': {
    id: 'major-12',
    name: 'The Hanged Man',
    upright: {
      coreThemes: ['surrender', 'new perspective', 'suspension', 'letting go', 'sacrifice'],
      emotionalTone: 'neutral',
      psychologicalFocus: ['surrendering control', 'seeing differently', 'waiting in suspension'],
      actionQualities: ['surrendering', 'releasing', 'seeing from new angle', 'pausing', 'sacrificing'],
      naturalPhrases: [
        'the pause required',
        'seeing it differently',
        'what you\'re surrendering',
        'the waiting',
        'perspective shifting'
      ]
    },
    reversed: {
      coreThemes: ['stalling', 'resistance', 'indecision', 'unnecessary sacrifice', 'martyrdom'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['refusing to let go', 'stuck in limbo', 'martyring yourself'],
      actionQualities: ['stalling', 'resisting perspective', 'playing victim', 'indecision', 'sacrificing too much'],
      naturalPhrases: [
        'the pause that\'s become stuck',
        'refusing to shift',
        'martyring yourself',
        'suspension without purpose'
      ]
    }
  },

  'major-14': {
    id: 'major-14',
    name: 'Temperance',
    upright: {
      coreThemes: ['balance', 'moderation', 'patience', 'harmony', 'integration'],
      emotionalTone: 'expansive',
      psychologicalFocus: ['finding middle path', 'integrating opposites', 'patient alchemy'],
      actionQualities: ['balancing', 'moderating', 'blending', 'being patient', 'harmonizing'],
      naturalPhrases: [
        'the balance you\'re finding',
        'blending opposites',
        'the middle way',
        'patient integration',
        'harmony emerging'
      ]
    },
    reversed: {
      coreThemes: ['imbalance', 'excess', 'lack of harmony', 'impatience', 'extremes'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['out of balance', 'going to extremes', 'forcing instead of flowing'],
      actionQualities: ['overindulging', 'being impatient', 'swinging to extremes', 'forcing harmony'],
      naturalPhrases: [
        'the imbalance',
        'going to extremes',
        'when moderation fails',
        'patience running out'
      ]
    }
  },

  'major-15': {
    id: 'major-15',
    name: 'The Devil',
    upright: {
      coreThemes: ['bondage', 'addiction', 'materialism', 'shadow self', 'unhealthy attachments'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['facing shadow', 'recognizing chains', 'what controls you'],
      actionQualities: ['being bound', 'indulging', 'staying trapped', 'feeding addiction', 'choosing chains'],
      naturalPhrases: [
        'what has you bound',
        'the chains you choose',
        'the shadow holding you',
        'the attachment',
        'what you can\'t let go of'
      ]
    },
    reversed: {
      coreThemes: ['breaking free', 'releasing attachments', 'facing shadow', 'reclaiming power', 'liberation'],
      emotionalTone: 'neutral',
      psychologicalFocus: ['recognizing your power to leave', 'releasing unhealthy bonds', 'seeing the chains'],
      actionQualities: ['breaking free', 'releasing', 'choosing freedom', 'facing truth', 'stepping away'],
      naturalPhrases: [
        'the chains falling away',
        'seeing you were never trapped',
        'the freedom you\'re choosing',
        'breaking the pattern'
      ]
    }
  },

  'major-18': {
    id: 'major-18',
    name: 'The Moon',
    upright: {
      coreThemes: ['illusion', 'fear', 'intuition', 'the unconscious', 'confusion'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['navigating uncertainty', 'facing fears', 'trusting despite confusion'],
      actionQualities: ['feeling uncertain', 'navigating darkness', 'facing illusions', 'trusting intuition'],
      naturalPhrases: [
        'what\'s unclear',
        'the fear in the dark',
        'navigating by feel',
        'the illusions',
        'what you sense but can\'t see'
      ]
    },
    reversed: {
      coreThemes: ['clarity emerging', 'releasing fear', 'truth revealed', 'deception cleared'],
      emotionalTone: 'neutral',
      psychologicalFocus: ['fears subsiding', 'illusions clearing', 'finding solid ground'],
      actionQualities: ['seeing clearly', 'releasing fear', 'truth emerging', 'finding certainty'],
      naturalPhrases: [
        'the fog lifting',
        'clarity coming',
        'fear releasing',
        'the truth becoming visible'
      ]
    }
  },

  'major-19': {
    id: 'major-19',
    name: 'The Sun',
    upright: {
      coreThemes: ['joy', 'success', 'vitality', 'clarity', 'optimism'],
      emotionalTone: 'expansive',
      psychologicalFocus: ['allowing joy', 'feeling alive', 'clear seeing'],
      actionQualities: ['celebrating', 'shining', 'being visible', 'feeling alive', 'expressing joy'],
      naturalPhrases: [
        'the joy available',
        'your light shining',
        'clarity and warmth',
        'the success blooming',
        'vitality returning'
      ]
    },
    reversed: {
      coreThemes: ['diminished joy', 'inner sadness', 'unrealistic optimism', 'fading energy'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['joy feeling distant', 'hiding your light', 'false positivity'],
      actionQualities: ['dimming yourself', 'forcing happiness', 'energy depleting', 'hiding'],
      naturalPhrases: [
        'the joy you can\'t feel',
        'your light dimmed',
        'forced optimism',
        'when happiness feels fake'
      ]
    }
  },

  'major-20': {
    id: 'major-20',
    name: 'Judgement',
    upright: {
      coreThemes: ['awakening', 'renewal', 'reckoning', 'calling', 'absolution'],
      emotionalTone: 'expansive',
      psychologicalFocus: ['hearing your calling', 'awakening to truth', 'being reborn'],
      actionQualities: ['awakening', 'answering the call', 'rising up', 'judging fairly', 'releasing shame'],
      naturalPhrases: [
        'the calling you hear',
        'awakening to yourself',
        'the reckoning',
        'rising renewed',
        'answering what calls you'
      ]
    },
    reversed: {
      coreThemes: ['self-doubt', 'ignoring the call', 'harsh self-judgment', 'refusing renewal'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['judging yourself harshly', 'ignoring what\'s calling', 'refusing to rise'],
      actionQualities: ['ignoring the call', 'staying down', 'being harsh with yourself', 'refusing awakening'],
      naturalPhrases: [
        'the call you\'re ignoring',
        'harsh judgement of self',
        'refusing to rise',
        'the awakening you resist'
      ]
    }
  },

  'major-21': {
    id: 'major-21',
    name: 'The World',
    upright: {
      coreThemes: ['completion', 'wholeness', 'achievement', 'integration', 'fulfillment'],
      emotionalTone: 'expansive',
      psychologicalFocus: ['feeling whole', 'completing cycles', 'integrating all parts'],
      actionQualities: ['completing', 'celebrating achievement', 'integrating', 'feeling whole', 'dancing'],
      naturalPhrases: [
        'the completion',
        'feeling whole',
        'the cycle fulfilled',
        'achievement realised',
        'integration happening'
      ]
    },
    reversed: {
      coreThemes: ['incompletion', 'lack of closure', 'shortcuts', 'emptiness despite success'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['almost there but not quite', 'success feeling empty', 'lacking closure'],
      actionQualities: ['seeking shortcuts', 'avoiding final step', 'feeling incomplete', 'rushing closure'],
      naturalPhrases: [
        'the incompletion',
        'almost there but not quite',
        'success that feels hollow',
        'the closure missing'
      ]
    }
  },

  // WANDS (Action, Passion, Will)
  'wands-ace': {
    id: 'wands-ace',
    name: 'Ace of Wands',
    upright: {
      coreThemes: ['creative spark', 'new passion', 'inspired action', 'potential energy'],
      emotionalTone: 'expansive',
      psychologicalFocus: ['recognizing creative impulse', 'feeling inspired', 'new direction'],
      actionQualities: ['starting', 'creating', 'initiating', 'following spark'],
      naturalPhrases: [
        'that creative spark',
        'the impulse you\'re feeling',
        'the inspiration',
        'the fire igniting',
        'that sudden knowing'
      ]
    },
    reversed: {
      coreThemes: ['creative blocks', 'lack of direction', 'missed opportunities', 'delays'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['can\'t find the spark', 'uninspired', 'directionless'],
      actionQualities: ['stalling', 'doubting', 'missing timing', 'blocking creativity'],
      naturalPhrases: [
        'the spark you can\'t find',
        'feeling uninspired',
        'the creative block',
        'when nothing feels exciting'
      ]
    }
  },

  'wands-2': {
    id: 'wands-2',
    name: 'Two of Wands',
    upright: {
      coreThemes: ['planning', 'future vision', 'decisions', 'personal power', 'bold choices'],
      emotionalTone: 'neutral',
      psychologicalFocus: ['weighing options', 'envisioning future', 'standing at crossroads'],
      actionQualities: ['planning', 'deciding', 'looking ahead', 'preparing to move', 'considering paths'],
      naturalPhrases: [
        'the decision forming',
        'standing at the threshold',
        'what you\'re planning',
        'the future you\'re seeing',
        'the choice ahead'
      ]
    },
    reversed: {
      coreThemes: ['fear of unknown', 'lack of planning', 'playing small', 'avoiding decision'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['too scared to choose', 'staying in comfort zone', 'paralysed by options'],
      actionQualities: ['avoiding decision', 'staying safe', 'refusing to plan', 'shrinking from possibility'],
      naturalPhrases: [
        'the decision you\'re avoiding',
        'staying inside the walls',
        'the fear of choosing',
        'when possibility feels too big'
      ]
    }
  },

  'wands-7': {
    id: 'wands-7',
    name: 'Seven of Wands',
    upright: {
      coreThemes: ['defending position', 'standing ground', 'perseverance', 'courage under pressure'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['holding your boundary', 'protecting what matters', 'fighting for yourself'],
      actionQualities: ['defending', 'standing firm', 'pushing back', 'maintaining position', 'not yielding'],
      naturalPhrases: [
        'the ground you\'re holding',
        'defending what\'s yours',
        'the fight to stay standing',
        'not backing down',
        'the position you\'re protecting'
      ]
    },
    reversed: {
      coreThemes: ['giving up', 'overwhelmed by opposition', 'exhaustion', 'surrendering position'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['too tired to fight', 'feeling outnumbered', 'questioning if it\'s worth it'],
      actionQualities: ['yielding', 'stepping down', 'letting go of position', 'exhausted defense'],
      naturalPhrases: [
        'when the fight feels too much',
        'letting the position go',
        'exhaustion winning',
        'the defence you can\'t sustain'
      ]
    }
  },

  'wands-3': {
    id: 'wands-3',
    name: 'Three of Wands',
    upright: {
      coreThemes: ['expansion', 'foresight', 'progress', 'looking ahead', 'momentum building'],
      emotionalTone: 'expansive',
      psychologicalFocus: ['trusting what you\'ve set in motion', 'looking to horizons', 'waiting with confidence'],
      actionQualities: ['expanding', 'planning ahead', 'watching it unfold', 'building momentum', 'trusting the process'],
      naturalPhrases: [
        'what you\'ve set in motion',
        'the expansion happening',
        'looking to the horizon',
        'the momentum building',
        'watching it grow'
      ]
    },
    reversed: {
      coreThemes: ['delays', 'lack of foresight', 'obstacles', 'playing small', 'limited vision'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['plans stalling', 'can\'t see ahead', 'momentum lost'],
      actionQualities: ['stalling', 'losing sight', 'playing small', 'blocking expansion', 'losing confidence'],
      naturalPhrases: [
        'the delays piling up',
        'when vision narrows',
        'momentum stalling',
        'staying too small'
      ]
    }
  },

  'wands-4': {
    id: 'wands-4',
    name: 'Four of Wands',
    upright: {
      coreThemes: ['celebration', 'homecoming', 'harmony', 'milestone', 'community joy'],
      emotionalTone: 'expansive',
      psychologicalFocus: ['celebrating progress', 'feeling at home', 'stability achieved'],
      actionQualities: ['celebrating', 'enjoying stability', 'gathering together', 'marking milestones', 'feeling grounded in joy'],
      naturalPhrases: [
        'the celebration earned',
        'coming home to yourself',
        'the stability you\'ve built',
        'this moment of harmony',
        'the milestone reached'
      ]
    },
    reversed: {
      coreThemes: ['instability', 'lack of roots', 'disrupted celebration', 'transition without grounding'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['can\'t settle', 'celebration feels hollow', 'lacking foundation'],
      actionQualities: ['unsettled', 'disrupting harmony', 'homeless feeling', 'can\'t celebrate'],
      naturalPhrases: [
        'when home doesn\'t feel stable',
        'celebration interrupted',
        'the grounding missing',
        'can\'t settle in'
      ]
    }
  },

  'wands-5': {
    id: 'wands-5',
    name: 'Five of Wands',
    upright: {
      coreThemes: ['conflict', 'competition', 'tension', 'struggle', 'creative clash'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['everyone pulling different directions', 'healthy competition vs chaos', 'creative tension'],
      actionQualities: ['competing', 'clashing', 'struggling together', 'fighting for space', 'creative conflict'],
      naturalPhrases: [
        'everyone pulling different ways',
        'the creative clash',
        'the struggle for space',
        'competing energies',
        'when wills collide'
      ]
    },
    reversed: {
      coreThemes: ['avoiding conflict', 'resolution', 'inner conflict', 'harmony restored'],
      emotionalTone: 'neutral',
      psychologicalFocus: ['conflict resolving', 'finding common ground', 'inner struggle'],
      actionQualities: ['avoiding fight', 'finding harmony', 'internal struggle', 'resolving tension'],
      naturalPhrases: [
        'the conflict easing',
        'finding common ground',
        'the internal battle',
        'tension releasing'
      ]
    }
  },

  'wands-6': {
    id: 'wands-6',
    name: 'Six of Wands',
    upright: {
      coreThemes: ['victory', 'recognition', 'success', 'public acknowledgement', 'confidence'],
      emotionalTone: 'expansive',
      psychologicalFocus: ['being seen for achievement', 'deserved recognition', 'success earned'],
      actionQualities: ['succeeding', 'being recognized', 'leading', 'receiving acknowledgement', 'claiming victory'],
      naturalPhrases: [
        'the recognition arriving',
        'victory earned',
        'being seen for what you did',
        'the success visible',
        'leading the way'
      ]
    },
    reversed: {
      coreThemes: ['lack of recognition', 'private achievement', 'ego', 'fall from grace'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['success without recognition', 'ego inflated', 'achievement unseen'],
      actionQualities: ['going unnoticed', 'ego leading', 'private victory', 'recognition withheld'],
      naturalPhrases: [
        'when achievement goes unseen',
        'ego taking over',
        'the victory that\'s hollow',
        'recognition you\'re not getting'
      ]
    }
  },

  'wands-8': {
    id: 'wands-8',
    name: 'Eight of Wands',
    upright: {
      coreThemes: ['swift action', 'momentum', 'rapid change', 'messages arriving', 'movement'],
      emotionalTone: 'expansive',
      psychologicalFocus: ['things moving fast', 'momentum accelerating', 'swift progress'],
      actionQualities: ['moving quickly', 'accelerating', 'rushing forward', 'messages flying', 'rapid change'],
      naturalPhrases: [
        'things moving fast now',
        'the acceleration',
        'momentum taking over',
        'rapid movement',
        'everything rushing forward'
      ]
    },
    reversed: {
      coreThemes: ['delays', 'slowing down', 'miscommunication', 'patience needed'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['expected speed not happening', 'messages delayed', 'patience tested'],
      actionQualities: ['slowing', 'delaying', 'messages missed', 'momentum stalled'],
      naturalPhrases: [
        'the delays frustrating you',
        'when speed stalls',
        'momentum slowing',
        'messages not arriving'
      ]
    }
  },

  'wands-9': {
    id: 'wands-9',
    name: 'Nine of Wands',
    upright: {
      coreThemes: ['resilience', 'persistence', 'last stand', 'wounded but standing', 'defensiveness'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['battle-worn but not giving up', 'defending what you\'ve built', 'resilience tested'],
      actionQualities: ['persisting', 'defending', 'standing despite wounds', 'holding on', 'one more round'],
      naturalPhrases: [
        'wounded but standing',
        'the resilience you\'re showing',
        'one more fight left',
        'battle-worn but not done',
        'defending what you\'ve built'
      ]
    },
    reversed: {
      coreThemes: ['exhaustion', 'giving up', 'paranoia', 'dropping defenses'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['too tired to continue', 'defenses too high or too low', 'ready to give up'],
      actionQualities: ['exhausted', 'dropping guard', 'giving in', 'paranoid defending', 'too tired to fight'],
      naturalPhrases: [
        'the exhaustion winning',
        'defenses too high',
        'ready to give up',
        'when you can\'t fight any more'
      ]
    }
  },

  'wands-10': {
    id: 'wands-10',
    name: 'Ten of Wands',
    upright: {
      coreThemes: ['burden', 'overwhelm', 'responsibility', 'carrying too much', 'approaching completion'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['bearing heavy load', 'almost there but struggling', 'responsibility weighing'],
      actionQualities: ['carrying', 'pushing through', 'bearing weight', 'struggling forward', 'shouldering alone'],
      naturalPhrases: [
        'the weight you\'re carrying',
        'the burden',
        'what feels too heavy',
        'carrying it all alone',
        'the responsibility crushing you'
      ]
    },
    reversed: {
      coreThemes: ['releasing burden', 'delegation', 'letting go of responsibility', 'acknowledging limits'],
      emotionalTone: 'neutral',
      psychologicalFocus: ['recognizing you can\'t do it all', 'choosing what to release', 'asking for help'],
      actionQualities: ['putting down', 'delegating', 'releasing responsibility', 'admitting it\'s too much'],
      naturalPhrases: [
        'the burden you\'re releasing',
        'putting it down',
        'the help you\'re accepting',
        'acknowledging your limits'
      ]
    }
  },

  // CUPS (Emotion, Relationships, Intuition)
  'cups-ace': {
    id: 'cups-ace',
    name: 'Ace of Cups',
    upright: {
      coreThemes: ['new emotional beginning', 'love emerging', 'emotional opening', 'compassion', 'intuitive gift'],
      emotionalTone: 'expansive',
      psychologicalFocus: ['heart opening', 'allowing love in', 'emotional renewal'],
      actionQualities: ['opening', 'receiving', 'feeling deeply', 'letting love in', 'trusting emotion'],
      naturalPhrases: [
        'the heart opening',
        'love asking to enter',
        'that emotional beginning',
        'the feeling arriving',
        'what wants to be felt'
      ]
    },
    reversed: {
      coreThemes: ['emotional blockage', 'closed heart', 'withheld love', 'repressed feelings'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['protecting the heart', 'refusing to feel', 'walls around emotion'],
      actionQualities: ['closing off', 'blocking emotion', 'refusing love', 'guarding the heart'],
      naturalPhrases: [
        'the heart staying closed',
        'the love you won\'t let in',
        'emotion you\'re blocking',
        'the walls you\'re keeping'
      ]
    }
  },

  'cups-2': {
    id: 'cups-2',
    name: 'Two of Cups',
    upright: {
      coreThemes: ['partnership', 'connection', 'mutual attraction', 'balanced relationship', 'emotional bond'],
      emotionalTone: 'expansive',
      psychologicalFocus: ['meeting as equals', 'mutual recognition', 'balanced give and take'],
      actionQualities: ['connecting', 'partnering', 'balancing', 'committing', 'meeting halfway'],
      naturalPhrases: [
        'the connection forming',
        'meeting as equals',
        'the partnership',
        'what\'s being exchanged',
        'mutual recognition'
      ]
    },
    reversed: {
      coreThemes: ['imbalance', 'disconnection', 'one-sided relationship', 'broken trust', 'misalignment'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['unequal exchange', 'disconnection growing', 'out of balance'],
      actionQualities: ['disconnecting', 'unbalancing', 'giving too much or too little', 'breaking bond'],
      naturalPhrases: [
        'the imbalance between you',
        'connection fraying',
        'when it\'s one-sided',
        'the partnership cracking'
      ]
    }
  },

  'cups-3': {
    id: 'cups-3',
    name: 'Three of Cups',
    upright: {
      coreThemes: ['celebration', 'community', 'joy', 'friendship', 'connection'],
      emotionalTone: 'expansive',
      psychologicalFocus: ['allowing joy', 'connecting with others', 'celebrating'],
      actionQualities: ['celebrating', 'connecting', 'sharing joy', 'being with people'],
      naturalPhrases: [
        'joy asking to be let in',
        'the celebration available',
        'connection with your people',
        'the ease you\'re feeling',
        'community showing up'
      ]
    },
    reversed: {
      coreThemes: ['isolation from community', 'overindulgence', 'gossip', 'exclusion'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['feeling left out', 'toxic celebration', 'shallow connections'],
      actionQualities: ['isolating', 'overindulging', 'gossiping', 'feeling excluded'],
      naturalPhrases: [
        'feeling outside the circle',
        'when celebration feels hollow',
        'connection that drains',
        'the community that doesn\'t fit'
      ]
    }
  },

  'cups-4': {
    id: 'cups-4',
    name: 'Four of Cups',
    upright: {
      coreThemes: ['apathy', 'contemplation', 'discontent', 'missing opportunity', 'withdrawal'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['lost in thoughts', 'not seeing what\'s offered', 'emotional withdrawal'],
      actionQualities: ['withdrawing', 'contemplating', 'refusing offers', 'looking inward too much', 'apathetic'],
      naturalPhrases: [
        'missing what\'s being offered',
        'lost in your head',
        'the apathy settling',
        'withdrawn from the world',
        'not seeing the gift'
      ]
    },
    reversed: {
      coreThemes: ['awareness returning', 'seeing opportunities', 'engagement', 'coming out of withdrawal'],
      emotionalTone: 'neutral',
      psychologicalFocus: ['seeing what\'s available', 'ready to engage again', 'awareness dawning'],
      actionQualities: ['noticing', 'engaging', 'accepting offers', 'coming back', 'seeing clearly'],
      naturalPhrases: [
        'awareness returning',
        'seeing what you missed',
        'coming out of withdrawal',
        'ready to engage again'
      ]
    }
  },

  'cups-5': {
    id: 'cups-5',
    name: 'Five of Cups',
    upright: {
      coreThemes: ['loss', 'grief', 'regret', 'disappointment', 'focusing on what\'s gone'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['mourning what\'s lost', 'can\'t see what remains', 'dwelling in regret'],
      actionQualities: ['grieving', 'regretting', 'focusing on loss', 'missing what\'s still there', 'mourning'],
      naturalPhrases: [
        'the loss you\'re mourning',
        'what spilled and can\'t be recovered',
        'grief taking over',
        'regret consuming you',
        'can\'t see what\'s still standing'
      ]
    },
    reversed: {
      coreThemes: ['acceptance', 'moving on', 'seeing what remains', 'forgiveness', 'healing'],
      emotionalTone: 'neutral',
      psychologicalFocus: ['ready to move forward', 'seeing what\'s still here', 'accepting loss'],
      actionQualities: ['moving on', 'accepting', 'seeing forward', 'releasing regret', 'healing'],
      naturalPhrases: [
        'ready to move forward',
        'seeing what still remains',
        'acceptance arriving',
        'releasing the regret'
      ]
    }
  },

  'cups-6': {
    id: 'cups-6',
    name: 'Six of Cups',
    upright: {
      coreThemes: ['nostalgia', 'innocence', 'childhood', 'memories', 'past connections'],
      emotionalTone: 'neutral',
      psychologicalFocus: ['revisiting the past', 'childhood patterns', 'innocent joy'],
      actionQualities: ['remembering', 'revisiting', 'reconnecting with innocence', 'looking back', 'nostalgia'],
      naturalPhrases: [
        'the past revisiting you',
        'childhood patterns surfacing',
        'nostalgia pulling you back',
        'innocent connections',
        'what you remember'
      ]
    },
    reversed: {
      coreThemes: ['stuck in past', 'leaving childhood behind', 'unrealistic nostalgia', 'moving forward'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['can\'t move past childhood', 'nostalgia unhelpful', 'ready to grow up'],
      actionQualities: ['stuck in memories', 'idealizing past', 'refusing to grow', 'letting go of childhood'],
      naturalPhrases: [
        'stuck in what was',
        'when nostalgia traps you',
        'ready to leave the past',
        'childhood you can\'t outgrow'
      ]
    }
  },

  'cups-7': {
    id: 'cups-7',
    name: 'Seven of Cups',
    upright: {
      coreThemes: ['choices', 'illusion', 'fantasy vs reality', 'wishful thinking', 'multiple options'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['lost in possibility', 'confusion about what\'s real', 'too many options'],
      actionQualities: ['fantasizing', 'imagining', 'avoiding choice', 'getting lost in options', 'dreaming'],
      naturalPhrases: [
        'the choices overwhelming you',
        'what\'s real vs what\'s fantasy',
        'lost in possibility',
        'the illusions',
        'too many directions'
      ]
    },
    reversed: {
      coreThemes: ['clarity emerging', 'grounding in reality', 'making the choice', 'cutting through illusion'],
      emotionalTone: 'neutral',
      psychologicalFocus: ['seeing clearly now', 'choosing what\'s real', 'grounding back'],
      actionQualities: ['clarifying', 'choosing', 'grounding', 'releasing fantasy', 'seeing truth'],
      naturalPhrases: [
        'the clarity coming',
        'seeing what\'s actually there',
        'fantasy falling away',
        'the real choice emerging'
      ]
    }
  },

  'cups-8': {
    id: 'cups-8',
    name: 'Eight of Cups',
    upright: {
      coreThemes: ['walking away', 'seeking deeper meaning', 'disappointment', 'leaving behind', 'spiritual journey'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['knowing it\'s time to leave', 'seeking something more', 'emotional departure'],
      actionQualities: ['walking away', 'leaving', 'seeking more', 'abandoning', 'journeying inward'],
      naturalPhrases: [
        'walking away from what\'s not enough',
        'leaving it all behind',
        'seeking something deeper',
        'the departure',
        'knowing you need more'
      ]
    },
    reversed: {
      coreThemes: ['afraid to leave', 'aimless wandering', 'staying put', 'fear of change'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['too scared to walk away', 'staying in dissatisfaction', 'wandering without purpose'],
      actionQualities: ['staying stuck', 'afraid to leave', 'aimless searching', 'clinging'],
      naturalPhrases: [
        'too scared to leave',
        'staying in what doesn\'t work',
        'wandering without direction',
        'afraid of what\'s next'
      ]
    }
  },

  'cups-9': {
    id: 'cups-9',
    name: 'Nine of Cups',
    upright: {
      coreThemes: ['contentment', 'satisfaction', 'wish fulfillment', 'emotional happiness', 'having enough'],
      emotionalTone: 'expansive',
      psychologicalFocus: ['satisfaction with what is', 'emotional fulfillment', 'wishes granted'],
      actionQualities: ['enjoying', 'being satisfied', 'feeling content', 'having enough', 'receiving wishes'],
      naturalPhrases: [
        'the contentment you\'re feeling',
        'wishes coming true',
        'satisfaction with what is',
        'emotional happiness',
        'having enough'
      ]
    },
    reversed: {
      coreThemes: ['greed', 'dissatisfaction', 'materialism', 'never enough', 'shallow happiness'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['nothing feels enough', 'seeking external validation', 'hollow satisfaction'],
      actionQualities: ['wanting more', 'dissatisfied', 'seeking externally', 'greedy', 'never satisfied'],
      naturalPhrases: [
        'never enough',
        'satisfaction that\'s hollow',
        'wanting more and more',
        'happiness that doesn\'t last'
      ]
    }
  },

  'cups-10': {
    id: 'cups-10',
    name: 'Ten of Cups',
    upright: {
      coreThemes: ['emotional fulfillment', 'family harmony', 'lasting happiness', 'joy together', 'dreams realized'],
      emotionalTone: 'expansive',
      psychologicalFocus: ['contentment with what is', 'harmony achieved', 'emotional completion'],
      actionQualities: ['appreciating', 'harmonizing', 'feeling fulfilled', 'celebrating together', 'resting in joy'],
      naturalPhrases: [
        'the harmony present',
        'emotional fulfillment',
        'the joy you\'re sharing',
        'what\'s complete',
        'the happiness you\'ve built'
      ]
    },
    reversed: {
      coreThemes: ['disharmony', 'broken family', 'misalignment of values', 'surface happiness'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['appearance vs reality', 'discord beneath surface', 'values clashing'],
      actionQualities: ['pretending', 'forcing harmony', 'ignoring tension', 'maintaining facade'],
      naturalPhrases: [
        'the discord underneath',
        'happiness that\'s forced',
        'when it only looks good',
        'the harmony that\'s missing'
      ]
    }
  },

  // SWORDS (Mind, Conflict, Truth)
  'swords-ace': {
    id: 'swords-ace',
    name: 'Ace of Swords',
    upright: {
      coreThemes: ['clarity', 'breakthrough', 'truth', 'mental clarity', 'new perspective'],
      emotionalTone: 'expansive',
      psychologicalFocus: ['seeing clearly suddenly', 'cutting through confusion', 'truth arriving'],
      actionQualities: ['cutting through', 'seeing clearly', 'speaking truth', 'thinking sharply', 'breaking through'],
      naturalPhrases: [
        'the clarity arriving',
        'cutting through the fog',
        'the truth breaking through',
        'suddenly seeing',
        'mental breakthrough'
      ]
    },
    reversed: {
      coreThemes: ['confusion', 'clouded thinking', 'miscommunication', 'harsh words', 'mental chaos'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['can\'t think straight', 'confusion persisting', 'truth obscured'],
      actionQualities: ['confusing', 'clouding', 'miscommunicating', 'cutting carelessly', 'mental fog'],
      naturalPhrases: [
        'the confusion staying',
        'when thinking gets muddy',
        'clarity you can\'t find',
        'words that cut wrong'
      ]
    }
  },

  'swords-2': {
    id: 'swords-2',
    name: 'Two of Swords',
    upright: {
      coreThemes: ['difficult decision', 'stalemate', 'avoiding truth', 'balanced but stuck', 'refusing to see'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['not ready to choose', 'keeping the blindfold on', 'staying in limbo'],
      actionQualities: ['avoiding', 'balancing precariously', 'refusing to look', 'staying frozen', 'blocking out'],
      naturalPhrases: [
        'the choice you\'re avoiding',
        'staying blindfolded',
        'the stalemate',
        'not wanting to see',
        'balanced but frozen'
      ]
    },
    reversed: {
      coreThemes: ['decision made', 'removing blindfold', 'seeing clearly', 'breaking stalemate', 'clarity dawning'],
      emotionalTone: 'neutral',
      psychologicalFocus: ['finally ready to see', 'making the hard choice', 'ending avoidance'],
      actionQualities: ['deciding', 'seeing', 'moving forward', 'breaking the tie', 'removing blocks'],
      naturalPhrases: [
        'the blindfold coming off',
        'finally choosing',
        'the stalemate breaking',
        'seeing what you avoided'
      ]
    }
  },

  'swords-3': {
    id: 'swords-3',
    name: 'Three of Swords',
    upright: {
      coreThemes: ['heartbreak', 'grief', 'betrayal', 'painful truth', 'emotional pain'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['heart pierced', 'processing betrayal', 'grief moving through'],
      actionQualities: ['hurting', 'grieving', 'feeling betrayed', 'heart breaking', 'bearing pain'],
      naturalPhrases: [
        'the heartbreak',
        'that sharp pain',
        'grief piercing through',
        'the betrayal',
        'when truth cuts deep'
      ]
    },
    reversed: {
      coreThemes: ['healing from pain', 'forgiveness', 'recovery', 'releasing grief', 'moving through'],
      emotionalTone: 'neutral',
      psychologicalFocus: ['grief releasing', 'beginning to heal', 'forgiveness forming'],
      actionQualities: ['healing', 'forgiving', 'releasing pain', 'moving through grief', 'recovering'],
      naturalPhrases: [
        'the healing beginning',
        'grief softening',
        'the pain releasing',
        'forgiveness arriving'
      ]
    }
  },

  'swords-5': {
    id: 'swords-5',
    name: 'Five of Swords',
    upright: {
      coreThemes: ['conflict', 'winning at a cost', 'defeating others', 'hollow victory'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['the cost of being right', 'battles worth fighting', 'empty wins'],
      actionQualities: ['fighting', 'winning', 'losing connection', 'choosing battles'],
      naturalPhrases: [
        'the battle',
        'winning at what cost',
        'the fight you\'re in',
        'the argument',
        'being right vs being heard'
      ]
    },
    reversed: {
      coreThemes: ['making amends', 'ending conflict', 'admitting defeat', 'reconciliation'],
      emotionalTone: 'neutral',
      psychologicalFocus: ['choosing peace over winning', 'letting the battle go', 'humility'],
      actionQualities: ['surrendering', 'reconciling', 'admitting wrong', 'ending the fight'],
      naturalPhrases: [
        'the battle you\'re ending',
        'choosing peace',
        'letting go of being right',
        'the surrender that heals'
      ]
    }
  },

  'swords-4': {
    id: 'swords-4',
    name: 'Four of Swords',
    upright: {
      coreThemes: ['rest', 'recuperation', 'contemplation', 'pause', 'mental recovery'],
      emotionalTone: 'neutral',
      psychologicalFocus: ['needing rest', 'recovering mentally', 'contemplative pause'],
      actionQualities: ['resting', 'recovering', 'contemplating', 'pausing', 'withdrawing to heal'],
      naturalPhrases: [
        'the rest you need',
        'recovering your mind',
        'the pause that heals',
        'contemplative stillness',
        'mental recuperation'
      ]
    },
    reversed: {
      coreThemes: ['restlessness', 'burnout', 'forced rest', 'can\'t stop', 'exhaustion'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['can\'t rest', 'pushing past exhaustion', 'rest feeling impossible'],
      actionQualities: ['restless', 'burned out', 'unable to stop', 'resisting rest', 'exhausted'],
      naturalPhrases: [
        'the rest you can\'t take',
        'burnout setting in',
        'can\'t stop moving',
        'exhaustion you\'re ignoring'
      ]
    }
  },

  'swords-6': {
    id: 'swords-6',
    name: 'Six of Swords',
    upright: {
      coreThemes: ['transition', 'moving on', 'travel', 'leaving difficulty', 'recovery'],
      emotionalTone: 'neutral',
      psychologicalFocus: ['moving toward calmer waters', 'transition in progress', 'leaving pain behind'],
      actionQualities: ['transitioning', 'moving forward', 'traveling', 'leaving behind', 'recovering'],
      naturalPhrases: [
        'the transition happening',
        'moving towards calmer waters',
        'leaving the storm',
        'the journey forward',
        'recovery in motion'
      ]
    },
    reversed: {
      coreThemes: ['resisting change', 'stuck in transition', 'unfinished business', 'baggage'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['can\'t move on', 'carrying too much forward', 'resisting transition'],
      actionQualities: ['stuck', 'resisting movement', 'bringing baggage', 'transition stalled'],
      naturalPhrases: [
        'stuck in transition',
        'the baggage you\'re carrying',
        'resisting the journey',
        'can\'t leave it behind'
      ]
    }
  },

  'swords-7': {
    id: 'swords-7',
    name: 'Seven of Swords',
    upright: {
      coreThemes: ['deception', 'strategy', 'sneaking', 'getting away with something', 'cunning'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['deceiving self or others', 'strategic but dishonest', 'taking shortcuts'],
      actionQualities: ['sneaking', 'deceiving', 'being strategic', 'getting away with it', 'cunning'],
      naturalPhrases: [
        'the deception',
        'sneaking around',
        'getting away with something',
        'the strategy that\'s dishonest',
        'what you\'re hiding'
      ]
    },
    reversed: {
      coreThemes: ['truth revealed', 'getting caught', 'coming clean', 'honesty'],
      emotionalTone: 'neutral',
      psychologicalFocus: ['deception exposed', 'ready to be honest', 'consequences arriving'],
      actionQualities: ['getting caught', 'confessing', 'being honest', 'facing consequences', 'truth emerging'],
      naturalPhrases: [
        'the truth coming out',
        'getting caught',
        'ready to be honest',
        'deception revealed'
      ]
    }
  },

  'swords-8': {
    id: 'swords-8',
    name: 'Eight of Swords',
    upright: {
      coreThemes: ['feeling trapped', 'self-imposed limits', 'mental prison', 'blind spots'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['believing you\'re stuck', 'not seeing options', 'mental constraints'],
      actionQualities: ['feeling bound', 'limiting self', 'missing freedom', 'staying stuck'],
      naturalPhrases: [
        'feeling trapped',
        'the bindings',
        'not seeing the way out',
        'the limits you believe in',
        'the stuck feeling'
      ]
    },
    reversed: {
      coreThemes: ['self-liberation', 'new perspective', 'removing blindfold', 'finding options'],
      emotionalTone: 'neutral',
      psychologicalFocus: ['seeing clearly finally', 'releasing mental prison', 'recognizing freedom'],
      actionQualities: ['freeing yourself', 'seeing options', 'removing limits', 'stepping free'],
      naturalPhrases: [
        'the freedom you\'re finding',
        'seeing the way out',
        'the blindfold coming off',
        'recognising you were never trapped'
      ]
    }
  },

  'swords-9': {
    id: 'swords-9',
    name: 'Nine of Swords',
    upright: {
      coreThemes: ['anxiety', 'worry', 'nightmares', 'mental anguish', 'fear'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['consumed by worry', 'nightmares literal or mental', 'anxiety overwhelming'],
      actionQualities: ['worrying', 'anxious', 'unable to sleep', 'consumed by fear', 'mental torture'],
      naturalPhrases: [
        'the anxiety consuming you',
        'nightmares keeping you up',
        'worry spiraling',
        'the mental anguish',
        'fear taking over'
      ]
    },
    reversed: {
      coreThemes: ['releasing anxiety', 'hope returning', 'recovery from trauma', 'worst fears unfounded'],
      emotionalTone: 'neutral',
      psychologicalFocus: ['anxiety easing', 'seeing fears weren\'t real', 'hope emerging'],
      actionQualities: ['releasing worry', 'recovering', 'finding hope', 'anxiety lifting', 'sleeping again'],
      naturalPhrases: [
        'the anxiety releasing',
        'hope returning',
        'worry easing',
        'fears weren\'t real'
      ]
    }
  },

  'swords-10': {
    id: 'swords-10',
    name: 'Ten of Swords',
    upright: {
      coreThemes: ['rock bottom', 'painful ending', 'betrayal', 'complete defeat', 'crisis point'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['can\'t get worse', 'hitting bottom', 'complete collapse'],
      actionQualities: ['surrendering to the end', 'facing defeat', 'lying down', 'giving in', 'accepting ruin'],
      naturalPhrases: [
        'rock bottom',
        'the painful ending',
        'when it all falls apart',
        'complete defeat',
        'the darkest point'
      ]
    },
    reversed: {
      coreThemes: ['recovery', 'regeneration', 'surviving', 'getting up again', 'worst is over'],
      emotionalTone: 'neutral',
      psychologicalFocus: ['rising from defeat', 'realising you survived', 'regeneration beginning'],
      actionQualities: ['recovering', 'rising', 'healing from trauma', 'getting back up', 'starting over'],
      naturalPhrases: [
        'the worst behind you',
        'rising from the wreckage',
        'beginning to recover',
        'surviving what felt fatal'
      ]
    }
  },

  // PENTACLES (Material, Body, Earth, Resources)
  'pentacles-ace': {
    id: 'pentacles-ace',
    name: 'Ace of Pentacles',
    upright: {
      coreThemes: ['new opportunity', 'material beginning', 'manifestation', 'prosperity seed', 'tangible start'],
      emotionalTone: 'expansive',
      psychologicalFocus: ['grounded opportunity', 'something real taking form', 'material potential'],
      actionQualities: ['beginning materially', 'planting seeds', 'manifesting', 'taking practical steps', 'grounding'],
      naturalPhrases: [
        'the opportunity arriving',
        'something tangible beginning',
        'the seed you\'re planting',
        'what\'s taking material form',
        'the practical start'
      ]
    },
    reversed: {
      coreThemes: ['missed opportunity', 'lack of planning', 'poor foundation', 'financial setback'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['not seeing the opportunity', 'shaky foundation', 'lack of grounding'],
      actionQualities: ['missing chances', 'poor planning', 'unstable beginning', 'wasting resources'],
      naturalPhrases: [
        'the opportunity you\'re missing',
        'foundation that won\'t hold',
        'when the seed won\'t take',
        'the practical start that fails'
      ]
    }
  },

  'pentacles-3': {
    id: 'pentacles-3',
    name: 'Three of Pentacles',
    upright: {
      coreThemes: ['collaboration', 'teamwork', 'skill', 'learning', 'building together'],
      emotionalTone: 'expansive',
      psychologicalFocus: ['working well with others', 'skill being recognised', 'learning through doing'],
      actionQualities: ['collaborating', 'building', 'learning', 'contributing skill', 'working together'],
      naturalPhrases: [
        'the work you\'re building together',
        'your skill being seen',
        'collaboration clicking',
        'the team effort',
        'learning as you build'
      ]
    },
    reversed: {
      coreThemes: ['lack of teamwork', 'poor collaboration', 'disorganization', 'lack of skill'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['working at cross purposes', 'skills not valued', 'coordination failing'],
      actionQualities: ['working against each other', 'disorganized effort', 'skill wasted', 'poor planning'],
      naturalPhrases: [
        'when collaboration fails',
        'working against each other',
        'the teamwork breaking down',
        'effort going nowhere'
      ]
    }
  },

  'pentacles-2': {
    id: 'pentacles-2',
    name: 'Two of Pentacles',
    upright: {
      coreThemes: ['balance', 'juggling', 'adaptability', 'multitasking', 'flexibility'],
      emotionalTone: 'neutral',
      psychologicalFocus: ['managing multiple demands', 'staying flexible', 'finding balance'],
      actionQualities: ['juggling', 'balancing', 'adapting', 'multitasking', 'staying flexible'],
      naturalPhrases: [
        'juggling it all',
        'the balancing act',
        'staying flexible',
        'managing the demands',
        'keeping everything moving'
      ]
    },
    reversed: {
      coreThemes: ['overwhelm', 'imbalance', 'dropping balls', 'poor time management', 'chaos'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['can\'t keep up', 'losing balance', 'too much to handle'],
      actionQualities: ['dropping things', 'losing balance', 'overwhelmed', 'can\'t juggle', 'chaos'],
      naturalPhrases: [
        'dropping the balls',
        'balance lost',
        'too much to handle',
        'when juggling fails'
      ]
    }
  },

  'pentacles-4': {
    id: 'pentacles-4',
    name: 'Four of Pentacles',
    upright: {
      coreThemes: ['control', 'security', 'possession', 'holding on', 'conservatism'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['clinging to security', 'fear of loss', 'holding too tight'],
      actionQualities: ['holding tight', 'controlling', 'possessing', 'hoarding', 'refusing to let go'],
      naturalPhrases: [
        'holding on too tight',
        'the control',
        'clinging to security',
        'what you won\'t release',
        'the grip you have'
      ]
    },
    reversed: {
      coreThemes: ['generosity', 'letting go', 'releasing control', 'greed', 'material loss'],
      emotionalTone: 'neutral',
      psychologicalFocus: ['learning to let go', 'releasing grip', 'finding generosity'],
      actionQualities: ['releasing', 'letting go', 'being generous', 'loosening grip', 'sharing'],
      naturalPhrases: [
        'loosening your grip',
        'learning to let go',
        'the release',
        'finding generosity'
      ]
    }
  },

  'pentacles-5': {
    id: 'pentacles-5',
    name: 'Five of Pentacles',
    upright: {
      coreThemes: ['hardship', 'poverty', 'exclusion', 'loss', 'struggle'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['feeling left out', 'material hardship', 'spiritual poverty'],
      actionQualities: ['struggling', 'suffering', 'being excluded', 'lacking', 'enduring hardship'],
      naturalPhrases: [
        'the hardship',
        'feeling left out in the cold',
        'the struggle for basics',
        'material loss',
        'when you have nothing'
      ]
    },
    reversed: {
      coreThemes: ['recovery', 'charity', 'improvement', 'getting help', 'hard times ending'],
      emotionalTone: 'neutral',
      psychologicalFocus: ['accepting help', 'situation improving', 'recovery beginning'],
      actionQualities: ['recovering', 'accepting help', 'improving', 'finding resources', 'getting through'],
      naturalPhrases: [
        'help arriving',
        'the recovery beginning',
        'accepting what\'s offered',
        'hardship easing'
      ]
    }
  },

  'pentacles-6': {
    id: 'pentacles-6',
    name: 'Six of Pentacles',
    upright: {
      coreThemes: ['generosity', 'charity', 'giving and receiving', 'sharing', 'balance of power'],
      emotionalTone: 'expansive',
      psychologicalFocus: ['balancing giving and receiving', 'sharing resources', 'power dynamics'],
      actionQualities: ['giving', 'receiving', 'sharing', 'being generous', 'balancing exchange'],
      naturalPhrases: [
        'the generosity flowing',
        'what you\'re giving',
        'what you\'re receiving',
        'the balanced exchange',
        'sharing resources'
      ]
    },
    reversed: {
      coreThemes: ['inequality', 'debt', 'strings attached', 'one-sided giving', 'power imbalance'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['unequal exchange', 'giving with strings', 'receiving with obligation'],
      actionQualities: ['unequal giving', 'controlling through giving', 'indebted', 'unbalanced exchange'],
      naturalPhrases: [
        'the strings attached',
        'unequal exchange',
        'when giving controls',
        'the debt weighing on you'
      ]
    }
  },

  'pentacles-7': {
    id: 'pentacles-7',
    name: 'Seven of Pentacles',
    upright: {
      coreThemes: ['patience', 'assessment', 'long-term view', 'waiting for harvest', 'evaluating progress'],
      emotionalTone: 'neutral',
      psychologicalFocus: ['pausing to assess', 'trusting the process', 'long-term investment'],
      actionQualities: ['waiting', 'evaluating', 'being patient', 'assessing growth', 'taking stock'],
      naturalPhrases: [
        'the waiting',
        'assessing what you\'ve built',
        'patience being tested',
        'taking the long view',
        'trusting the timeline'
      ]
    },
    reversed: {
      coreThemes: ['impatience', 'lack of reward', 'poor investment', 'giving up too soon'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['can\'t wait anymore', 'effort feeling wasted', 'questioning investment'],
      actionQualities: ['giving up', 'being impatient', 'abandoning effort', 'seeing no return'],
      naturalPhrases: [
        'impatience taking over',
        'when waiting feels pointless',
        'the investment not paying off',
        'giving up before harvest'
      ]
    }
  },

  'pentacles-8': {
    id: 'pentacles-8',
    name: 'Eight of Pentacles',
    upright: {
      coreThemes: ['mastery', 'skill development', 'dedication', 'craftsmanship', 'quality work'],
      emotionalTone: 'expansive',
      psychologicalFocus: ['honing your craft', 'dedicated practice', 'pursuit of excellence'],
      actionQualities: ['practicing', 'mastering', 'refining', 'dedicating', 'perfecting'],
      naturalPhrases: [
        'the mastery you\'re building',
        'honing your craft',
        'dedicated work',
        'the skill developing',
        'perfecting your art'
      ]
    },
    reversed: {
      coreThemes: ['lack of focus', 'poor quality', 'perfectionism', 'wasted effort', 'shortcuts'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['can\'t focus on one thing', 'perfectionism blocking', 'cutting corners'],
      actionQualities: ['unfocused', 'cutting corners', 'perfectionism', 'wasting effort', 'poor quality'],
      naturalPhrases: [
        'the focus scattered',
        'when perfectionism blocks',
        'cutting corners',
        'effort without direction'
      ]
    }
  },

  'pentacles-9': {
    id: 'pentacles-9',
    name: 'Nine of Pentacles',
    upright: {
      coreThemes: ['independence', 'self-sufficiency', 'luxury', 'refinement', 'abundance alone'],
      emotionalTone: 'expansive',
      psychologicalFocus: ['enjoying what you\'ve built', 'self-reliance', 'refined living'],
      actionQualities: ['enjoying abundance', 'being self-sufficient', 'living well', 'refined taste', 'independence'],
      naturalPhrases: [
        'the abundance you\'ve built',
        'self-sufficiency',
        'enjoying what you created',
        'refined independence',
        'luxury earned'
      ]
    },
    reversed: {
      coreThemes: ['financial dependence', 'lack of discipline', 'overwork', 'material setbacks'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['can\'t enjoy what you have', 'dependent on others', 'overworked without reward'],
      actionQualities: ['dependent', 'overworking', 'can\'t enjoy', 'lacking discipline', 'setbacks'],
      naturalPhrases: [
        'dependent on others',
        'can\'t enjoy what you built',
        'overworked without pleasure',
        'the discipline missing'
      ]
    }
  },

  'pentacles-10': {
    id: 'pentacles-10',
    name: 'Ten of Pentacles',
    upright: {
      coreThemes: ['legacy', 'wealth', 'long-term security', 'family inheritance', 'lasting abundance'],
      emotionalTone: 'expansive',
      psychologicalFocus: ['generational wealth', 'what you\'re building to last', 'security established'],
      actionQualities: ['establishing legacy', 'building for generations', 'creating stability', 'sharing abundance'],
      naturalPhrases: [
        'the legacy you\'re building',
        'lasting security',
        'what you\'re leaving behind',
        'abundance to share',
        'foundation for generations'
      ]
    },
    reversed: {
      coreThemes: ['financial instability', 'family conflict over money', 'loss of inheritance', 'broken legacy'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['legacy crumbling', 'financial insecurity', 'family discord'],
      actionQualities: ['losing security', 'fighting over resources', 'legacy failing', 'instability'],
      naturalPhrases: [
        'the legacy falling apart',
        'security you can\'t count on',
        'family fighting over what\'s left',
        'when wealth divides'
      ]
    }
  },

  // COURT CARDS - WANDS
  'wands-page': {
    id: 'wands-page',
    name: 'Page of Wands',
    upright: {
      coreThemes: ['enthusiasm', 'exploration', 'discovery', 'news', 'free spirit'],
      emotionalTone: 'expansive',
      psychologicalFocus: ['curious and eager', 'open to adventure', 'youthful energy'],
      actionQualities: ['exploring', 'discovering', 'being enthusiastic', 'trying new things', 'free-spirited'],
      naturalPhrases: [
        'the enthusiasm rising',
        'ready to explore',
        'new adventures calling',
        'curious energy',
        'the spark of discovery'
      ]
    },
    reversed: {
      coreThemes: ['immaturity', 'lack of direction', 'procrastination', 'bad news'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['scattered energy', 'immature approach', 'avoiding commitment'],
      actionQualities: ['procrastinating', 'scattered', 'immature', 'lacking follow-through'],
      naturalPhrases: [
        'enthusiasm without direction',
        'the scattered energy',
        'avoiding commitment',
        'immature approach'
      ]
    }
  },

  'wands-knight': {
    id: 'wands-knight',
    name: 'Knight of Wands',
    upright: {
      coreThemes: ['passion', 'action', 'adventure', 'impulsiveness', 'energy'],
      emotionalTone: 'expansive',
      psychologicalFocus: ['charging forward', 'passionate pursuit', 'fearless action'],
      actionQualities: ['charging ahead', 'taking action', 'pursuing passionately', 'adventuring', 'bold moves'],
      naturalPhrases: [
        'charging forward',
        'the passionate pursuit',
        'bold action',
        'fearless movement',
        'the adventure beginning'
      ]
    },
    reversed: {
      coreThemes: ['recklessness', 'impatience', 'delays', 'frustration', 'anger'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['impulsive and reckless', 'frustrated by delays', 'anger driving'],
      actionQualities: ['reckless', 'impatient', 'frustrated', 'angry', 'forcing'],
      naturalPhrases: [
        'reckless energy',
        'impatience taking over',
        'frustrated movement',
        'anger driving you'
      ]
    }
  },

  'wands-queen': {
    id: 'wands-queen',
    name: 'Queen of Wands',
    upright: {
      coreThemes: ['confidence', 'independence', 'determination', 'vibrancy', 'charisma'],
      emotionalTone: 'expansive',
      psychologicalFocus: ['self-assured and vibrant', 'confidently independent', 'magnetic presence'],
      actionQualities: ['leading confidently', 'being vibrant', 'attracting', 'self-assured', 'independent'],
      naturalPhrases: [
        'the confidence you embody',
        'your vibrant presence',
        'self-assured independence',
        'magnetic energy',
        'leading with charisma'
      ]
    },
    reversed: {
      coreThemes: ['insecurity', 'jealousy', 'selfishness', 'demanding', 'vindictive'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['insecure and jealous', 'demanding attention', 'vengeful'],
      actionQualities: ['jealous', 'demanding', 'selfish', 'vindictive', 'insecure'],
      naturalPhrases: [
        'jealousy consuming',
        'demanding everything',
        'insecurity showing',
        'the vindictive energy'
      ]
    }
  },

  'wands-king': {
    id: 'wands-king',
    name: 'King of Wands',
    upright: {
      coreThemes: ['leadership', 'vision', 'entrepreneurship', 'honor', 'boldness'],
      emotionalTone: 'expansive',
      psychologicalFocus: ['natural leader', 'visionary thinking', 'honorable action'],
      actionQualities: ['leading', 'envisioning', 'building empires', 'bold decisions', 'inspiring'],
      naturalPhrases: [
        'the leader emerging',
        'visionary action',
        'bold leadership',
        'the empire you\'re building',
        'inspiring others'
      ]
    },
    reversed: {
      coreThemes: ['tyranny', 'domineering', 'ruthless', 'arrogance', 'impulsiveness'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['dominating others', 'arrogant leadership', 'ruthless pursuit'],
      actionQualities: ['dominating', 'ruthless', 'arrogant', 'tyrannical', 'impulsive leadership'],
      naturalPhrases: [
        'tyrannical control',
        'arrogance leading',
        'ruthless ambition',
        'dominating everyone'
      ]
    }
  },

  // COURT CARDS - CUPS
  'cups-page': {
    id: 'cups-page',
    name: 'Page of Cups',
    upright: {
      coreThemes: ['intuition', 'sensitivity', 'creativity', 'curiosity', 'gentleness'],
      emotionalTone: 'expansive',
      psychologicalFocus: ['emotionally open', 'intuitive messages', 'creative stirrings'],
      actionQualities: ['feeling deeply', 'creating', 'being sensitive', 'following intuition', 'gentle approach'],
      naturalPhrases: [
        'the intuitive message',
        'emotional openness',
        'creative stirrings',
        'gentle sensitivity',
        'what your heart says'
      ]
    },
    reversed: {
      coreThemes: ['emotional immaturity', 'insecurity', 'unrealistic', 'moodiness'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['emotionally immature', 'overly sensitive', 'unrealistic expectations'],
      actionQualities: ['moody', 'overly sensitive', 'immature emotionally', 'unrealistic'],
      naturalPhrases: [
        'emotional immaturity',
        'oversensitive reactions',
        'unrealistic dreams',
        'moody energy'
      ]
    }
  },

  'cups-knight': {
    id: 'cups-knight',
    name: 'Knight of Cups',
    upright: {
      coreThemes: ['romance', 'charm', 'imagination', 'proposals', 'following the heart'],
      emotionalTone: 'expansive',
      psychologicalFocus: ['romantic pursuit', 'following heart', 'charming approach'],
      actionQualities: ['pursuing romance', 'charming', 'proposing', 'following heart', 'imagining'],
      naturalPhrases: [
        'the romantic pursuit',
        'following your heart',
        'the charming approach',
        'love\'s messenger',
        'the proposal coming'
      ]
    },
    reversed: {
      coreThemes: ['moodiness', 'unrealistic', 'jealousy', 'overemotional', 'disappointment'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['mood swings', 'unrealistic romance', 'overly emotional'],
      actionQualities: ['moody', 'jealous', 'overemotional', 'unrealistic expectations', 'disappointed'],
      naturalPhrases: [
        'the mood swings',
        'unrealistic romance',
        'jealousy rising',
        'emotional overwhelm'
      ]
    }
  },

  'cups-queen': {
    id: 'cups-queen',
    name: 'Queen of Cups',
    upright: {
      coreThemes: ['compassion', 'intuition', 'emotional security', 'nurturing', 'wisdom'],
      emotionalTone: 'expansive',
      psychologicalFocus: ['emotionally mature', 'deeply compassionate', 'intuitively wise'],
      actionQualities: ['nurturing', 'being compassionate', 'trusting intuition', 'emotionally secure', 'caring deeply'],
      naturalPhrases: [
        'the compassion flowing',
        'emotional wisdom',
        'nurturing presence',
        'intuitive knowing',
        'secure in feeling'
      ]
    },
    reversed: {
      coreThemes: ['insecurity', 'co-dependency', 'martyrdom', 'emotional manipulation'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['emotionally insecure', 'manipulating through feeling', 'martyring self'],
      actionQualities: ['co-dependent', 'manipulating', 'martyring', 'insecure', 'smothering'],
      naturalPhrases: [
        'emotional manipulation',
        'co-dependent patterns',
        'martyring yourself',
        'insecurity showing'
      ]
    }
  },

  'cups-king': {
    id: 'cups-king',
    name: 'King of Cups',
    upright: {
      coreThemes: ['emotional balance', 'diplomacy', 'compassion', 'wisdom', 'calm'],
      emotionalTone: 'expansive',
      psychologicalFocus: ['emotionally balanced', 'wise compassion', 'diplomatic approach'],
      actionQualities: ['balancing emotion', 'being diplomatic', 'wise leadership', 'calm presence', 'compassionate'],
      naturalPhrases: [
        'emotional mastery',
        'the balanced heart',
        'diplomatic wisdom',
        'calm compassion',
        'mature feeling'
      ]
    },
    reversed: {
      coreThemes: ['emotional manipulation', 'moodiness', 'coldness', 'volatility'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['emotionally manipulative', 'cold or volatile', 'suppressed feelings'],
      actionQualities: ['manipulating', 'volatile', 'cold', 'suppressing emotion', 'moody'],
      naturalPhrases: [
        'emotional manipulation',
        'the coldness',
        'volatile moods',
        'feelings suppressed'
      ]
    }
  },

  // COURT CARDS - SWORDS
  'swords-page': {
    id: 'swords-page',
    name: 'Page of Swords',
    upright: {
      coreThemes: ['curiosity', 'mental agility', 'vigilance', 'new ideas', 'communication'],
      emotionalTone: 'neutral',
      psychologicalFocus: ['mentally curious', 'watchful', 'learning'],
      actionQualities: ['investigating', 'questioning', 'learning', 'communicating', 'being vigilant'],
      naturalPhrases: [
        'the curious mind',
        'questioning everything',
        'new ideas emerging',
        'mental vigilance',
        'learning actively'
      ]
    },
    reversed: {
      coreThemes: ['gossip', 'hurtful words', 'deception', 'lack of planning'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['using words to hurt', 'spreading rumors', 'scattered thinking'],
      actionQualities: ['gossiping', 'deceiving', 'hurtful communication', 'scattered', 'plotting'],
      naturalPhrases: [
        'the gossip spreading',
        'hurtful words',
        'deceptive communication',
        'scattered thoughts'
      ]
    }
  },

  'swords-knight': {
    id: 'swords-knight',
    name: 'Knight of Swords',
    upright: {
      coreThemes: ['action', 'speed', 'directness', 'assertiveness', 'drive'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['direct and fast', 'assertive pursuit', 'cutting through'],
      actionQualities: ['charging forward', 'being direct', 'asserting', 'fast action', 'cutting through'],
      naturalPhrases: [
        'charging ahead',
        'direct action',
        'cutting through obstacles',
        'the swift pursuit',
        'assertive movement'
      ]
    },
    reversed: {
      coreThemes: ['recklessness', 'impulsiveness', 'rudeness', 'scatter-brained'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['recklessly direct', 'impulsive and rude', 'unfocused aggression'],
      actionQualities: ['reckless', 'impulsive', 'rude', 'scattered', 'aggressive'],
      naturalPhrases: [
        'reckless charge',
        'impulsive action',
        'the rudeness',
        'scattered aggression'
      ]
    }
  },

  'swords-queen': {
    id: 'swords-queen',
    name: 'Queen of Swords',
    upright: {
      coreThemes: ['clarity', 'honesty', 'independence', 'intellect', 'direct communication'],
      emotionalTone: 'neutral',
      psychologicalFocus: ['clear-minded', 'intellectually independent', 'honest'],
      actionQualities: ['thinking clearly', 'being honest', 'independent thought', 'direct communication', 'cutting through BS'],
      naturalPhrases: [
        'the clear mind',
        'honest communication',
        'intellectual independence',
        'cutting through illusion',
        'direct truth'
      ]
    },
    reversed: {
      coreThemes: ['coldness', 'cruelty', 'bitterness', 'harsh judgment'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['cold and cruel', 'bitter thinking', 'harsh with self and others'],
      actionQualities: ['cold', 'cruel', 'bitter', 'harshly judging', 'cutting meanly'],
      naturalPhrases: [
        'the coldness',
        'cruel honesty',
        'bitter thoughts',
        'harsh judgment'
      ]
    }
  },

  'swords-king': {
    id: 'swords-king',
    name: 'King of Swords',
    upright: {
      coreThemes: ['intellectual power', 'authority', 'truth', 'clarity', 'ethical'],
      emotionalTone: 'neutral',
      psychologicalFocus: ['intellectual authority', 'clear thinking', 'ethical judgment'],
      actionQualities: ['thinking strategically', 'judging fairly', 'leading intellectually', 'seeking truth', 'ethical'],
      naturalPhrases: [
        'intellectual authority',
        'strategic thinking',
        'ethical judgment',
        'clear leadership',
        'the truth seeker'
      ]
    },
    reversed: {
      coreThemes: ['manipulation', 'abuse of power', 'cruelty', 'lack of ethics'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['intellectually manipulative', 'abusing authority', 'cruel logic'],
      actionQualities: ['manipulating', 'abusing power', 'cruel', 'unethical', 'tyrannical thinking'],
      naturalPhrases: [
        'intellectual manipulation',
        'abusing authority',
        'cruel logic',
        'unethical power'
      ]
    }
  },

  // COURT CARDS - PENTACLES
  'pentacles-page': {
    id: 'pentacles-page',
    name: 'Page of Pentacles',
    upright: {
      coreThemes: ['manifestation', 'study', 'diligence', 'new opportunities', 'ambition'],
      emotionalTone: 'expansive',
      psychologicalFocus: ['eager to learn', 'practical focus', 'ambitious start'],
      actionQualities: ['studying', 'planning', 'being diligent', 'manifesting', 'starting practically'],
      naturalPhrases: [
        'the practical start',
        'eager learning',
        'new opportunity',
        'diligent focus',
        'ambitious beginning'
      ]
    },
    reversed: {
      coreThemes: ['lack of progress', 'procrastination', 'poor planning', 'lack of ambition'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['not following through', 'poor planning', 'unmotivated'],
      actionQualities: ['procrastinating', 'poor planning', 'lacking ambition', 'unfocused'],
      naturalPhrases: [
        'procrastination winning',
        'poor planning',
        'ambition lacking',
        'unfocused effort'
      ]
    }
  },

  'pentacles-knight': {
    id: 'pentacles-knight',
    name: 'Knight of Pentacles',
    upright: {
      coreThemes: ['reliability', 'hard work', 'commitment', 'routine', 'persistence'],
      emotionalTone: 'neutral',
      psychologicalFocus: ['steady and reliable', 'committed to work', 'persistent'],
      actionQualities: ['working steadily', 'being reliable', 'committing', 'persisting', 'routine'],
      naturalPhrases: [
        'steady progress',
        'reliable work',
        'the commitment',
        'persistent effort',
        'showing up daily'
      ]
    },
    reversed: {
      coreThemes: ['laziness', 'boredom', 'stagnation', 'carelessness'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['bored and stagnant', 'lazy approach', 'careless work'],
      actionQualities: ['lazy', 'bored', 'stagnating', 'careless', 'unmotivated'],
      naturalPhrases: [
        'the laziness',
        'bored stagnation',
        'careless effort',
        'motivation missing'
      ]
    }
  },

  'pentacles-queen': {
    id: 'pentacles-queen',
    name: 'Queen of Pentacles',
    upright: {
      coreThemes: ['nurturing', 'practical', 'abundance', 'down-to-earth', 'resourceful'],
      emotionalTone: 'expansive',
      psychologicalFocus: ['practical nurturing', 'grounded abundance', 'resourceful care'],
      actionQualities: ['nurturing practically', 'creating abundance', 'being resourceful', 'grounded care', 'providing'],
      naturalPhrases: [
        'practical nurturing',
        'grounded abundance',
        'resourceful care',
        'the provider',
        'down-to-earth wisdom'
      ]
    },
    reversed: {
      coreThemes: ['materialism', 'self-care neglect', 'smothering', 'jealousy'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['overly materialistic', 'neglecting self', 'smothering with care'],
      actionQualities: ['materialistic', 'neglecting self', 'smothering', 'jealous', 'controlling through care'],
      naturalPhrases: [
        'the materialism',
        'neglecting yourself',
        'smothering care',
        'jealousy showing'
      ]
    }
  },

  'pentacles-king': {
    id: 'pentacles-king',
    name: 'King of Pentacles',
    upright: {
      coreThemes: ['wealth', 'business', 'security', 'discipline', 'abundance'],
      emotionalTone: 'expansive',
      psychologicalFocus: ['mastery of material', 'disciplined abundance', 'secure success'],
      actionQualities: ['building wealth', 'leading business', 'creating security', 'disciplined', 'abundant'],
      naturalPhrases: [
        'material mastery',
        'the wealth you\'re building',
        'disciplined success',
        'security created',
        'abundant leadership'
      ]
    },
    reversed: {
      coreThemes: ['greed', 'materialism', 'stubbornness', 'corruption'],
      emotionalTone: 'challenging',
      psychologicalFocus: ['greedy accumulation', 'materialistic focus', 'corrupted by wealth'],
      actionQualities: ['greedy', 'materialistic', 'stubborn', 'corrupt', 'hoarding'],
      naturalPhrases: [
        'the greed',
        'materialistic obsession',
        'stubborn control',
        'corrupted by wealth'
      ]
    }
  }
};

/**
 * Get card archetype by ID and orientation
 */
export function getCardArchetype(cardId: string, isReversed: boolean = false): CardArchetype['upright'] | undefined {
  const card = cardArchetypes[cardId];
  if (!card) return undefined;

  return isReversed ? card.reversed : card.upright;
}

/**
 * Get a random natural phrase for a card
 */
export function getRandomCardPhrase(cardId: string, isReversed: boolean = false): string {
  const archetype = getCardArchetype(cardId, isReversed);
  if (!archetype) return '';

  const phrases = archetype.naturalPhrases;
  return phrases[Math.floor(Math.random() * phrases.length)];
}
