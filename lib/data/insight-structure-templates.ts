/**
 * Insight Structure Templates - Synthesis-Focused
 */

export interface InsightStructureTemplate {
  id: string;
  structure: string;
  bestFor: {
    transitTone: ('challenging' | 'neutral' | 'expansive')[];
    cardTone: ('challenging' | 'neutral' | 'expansive')[];
  };
  description: string;
}

export const insightStructureTemplates: InsightStructureTemplate[] = [
  {
    id: 'direct',
    structure: '{synthesis}',
    bestFor: {
      transitTone: ['challenging', 'neutral', 'expansive'],
      cardTone: ['challenging', 'neutral', 'expansive']
    },
    description: 'Just the synthesis, nothing else'
  }
];

export const natalPlanetMeanings: Record<string, string[]> = {
  sun: ['your core identity', 'your life force', 'your sense of self', 'your ego and vitality'],
  moon: ['your emotional world', 'your inner life', 'your instincts', 'how you process feelings'],
  mercury: ['your mind', 'how you think', 'your voice', 'the way your brain works'],
  venus: ['what you love', 'how you relate', 'your relationship patterns', 'what you value'],
  mars: ['your drive', 'your will', 'how you go after what you want', 'your anger and passion'],
  jupiter: ['your optimism', 'where you seek meaning', 'your faith', 'how you see possibility']
};

export const transitingPlanetActions: Record<string, string[]> = {
  saturn: ['bringing structure and testing what\'s real', 'asking you to build something that lasts', 'showing you where the foundation needs work', 'demanding maturity'],
  jupiter: ['opening doors', 'asking you to grow beyond your current limits', 'bringing opportunity', 'showing you what\'s possible'],
  uranus: ['breaking patterns', 'bringing sudden insight', 'disrupting what felt stable', 'pushing you towards authenticity'],
  neptune: ['dissolving boundaries and illusions', 'asking what\'s real beyond the story', 'bringing spiritual sensitivity', 'blurring what felt certain'],
  pluto: ['transforming at the root', 'bringing what\'s hidden to the surface', 'demanding you face what\'s been avoided', 'breaking down to rebuild'],
  mars: ['activating your will', 'bringing energy and urgency', 'pushing you to act', 'stirring up conflict or courage']
};

export const aspectDescriptions: Record<string, string[]> = {
  square: ['squaring', 'creating friction with', 'challenging'],
  opposition: ['opposing', 'pulling against', 'in tension with'],
  conjunction: ['conjunct with', 'merging with', 'sitting right on top of'],
  trine: ['trining', 'flowing with', 'supporting'],
  sextile: ['opening pathways with', 'offering opportunity to', 'connecting with']
};

export const cardArchetypeSynthesis: Record<string, { synthesis: string[]; action: string }> = {

  // ── MAJOR ARCANA ──────────────────────────────────────────────────────────

  'major-0': {
    synthesis: [
      'You don\'t have all the information. {transiting_planet} on {natal_planet} in {house_theme} - jump anyway. The Fool never had it either',
      'Safety isn\'t coming. The plan won\'t get clearer. {house_theme} is where {transiting_planet} and your {natal_planet} meet at the cliff edge',
      'Start before you\'re ready or don\'t start. {transiting_planet} hitting your {natal_planet} around {house_theme} is the nudge off the edge'
    ],
    action: 'do the thing you\'ve been postponing until you feel ready'
  },

  'major-1': {
    synthesis: [
      'Stop circling. {transiting_planet} working your {natal_planet} in {house_theme} - the tools are already in your hands. You\'ve been treating this like a waiting room',
      'That missing piece you keep searching for in {house_theme}? It\'s not missing. {transiting_planet} and your {natal_planet} already gave you everything you need',
      'You keep asking for permission. {transiting_planet} hitting your {natal_planet} around {house_theme} - you\'re already authorized'
    ],
    action: 'list what you already have - tools, skills, connections - and use one today'
  },

  'major-2': {
    synthesis: [
      'Logic fails here. {transiting_planet} on your {natal_planet} in {house_theme} is waking something that doesn\'t speak in words and won\'t be argued with',
      'You already sense it. {transiting_planet} meeting your {natal_planet} in {house_theme} - trust the knowing that came before the thinking',
      'Something beneath {house_theme} is moving. {transiting_planet} lighting up your {natal_planet} - stop asking people who weren\'t in the room'
    ],
    action: 'sit quietly for ten minutes. no phone. notice what surfaces without prompting'
  },

  'major-3': {
    synthesis: [
      'Abundance wants to grow in {house_theme} but you keep forcing the timeline. {transiting_planet} on your {natal_planet} - receive, don\'t push',
      'Stop straining. {transiting_planet} nurturing your {natal_planet} around {house_theme} - things that need to grow won\'t be rushed',
      'What wants to be born in {house_theme} is already in motion. {transiting_planet} meeting your {natal_planet} - your job is to not strangle it'
    ],
    action: 'do something that genuinely nourishes you. not productive. nourishing'
  },

  'major-4': {
    synthesis: [
      '{transiting_planet} on your {natal_planet} in {house_theme} is asking who\'s actually in charge. If the answer is nobody, that\'s your answer',
      'The drift in {house_theme} isn\'t circumstance. {transiting_planet} activating your {natal_planet} - someone decided not to decide, and it\'s been costing you',
      'You\'ve been waiting for permission in {house_theme}. {transiting_planet} meeting your {natal_planet} - it\'s not coming from anywhere external'
    ],
    action: 'name one area needing more structure. make one rule about it today'
  },

  'major-5': {
    synthesis: [
      'Are you following the rules in {house_theme} because they work or because you\'re afraid to question them? {transiting_planet} on your {natal_planet} is asking',
      'Not every tradition earns its place. {transiting_planet} activating your {natal_planet} in {house_theme} - wisdom and habit aren\'t the same thing',
      'Somewhere in {house_theme} you\'re doing things the way they\'re "supposed to be done" without knowing why. {transiting_planet} hitting your {natal_planet} - worth examining'
    ],
    action: 'question one thing you do automatically. ask where that rule actually came from'
  },

  'major-6': {
    synthesis: [
      'This choice in {house_theme} matters more than you\'ve admitted. {transiting_planet} and your {natal_planet} - you can\'t have both and you know it',
      'What you actually want versus what you should want. {transiting_planet} hitting your {natal_planet} in {house_theme} - stop pretending those are the same thing',
      'Which path is actually yours? {transiting_planet} working your {natal_planet} around {house_theme} makes it unavoidable'
    ],
    action: 'write down the choice you\'ve been avoiding. be honest about which one you actually want'
  },

  'major-7': {
    synthesis: [
      '{transiting_planet} pressing on your {natal_planet} in {house_theme} is what\'s creating the split. The contradiction isn\'t the problem - your refusal to move through it is',
      'You\'re waiting for the internal conflict around {house_theme} to resolve before you act. {transiting_planet} on your {natal_planet} says: move while it\'s unresolved',
      'The tension in {house_theme} under {transiting_planet} isn\'t a sign to wait. It\'s the condition you\'re working in. Navigate anyway'
    ],
    action: 'commit to one direction today. you can adjust as you go'
  },

  'major-8': {
    synthesis: [
      '{transiting_planet} is creating pressure around {house_theme} and you\'re matching it with more pressure. {natal_planet} - something else is being asked for here',
      'The resistance in {house_theme} intensifies when you push. {transiting_planet} on your {natal_planet} - notice what changes when you stop trying to overpower it',
      'You\'ve been treating {house_theme} like something to conquer. {transiting_planet} meeting your {natal_planet} - the thing you\'re fighting has been waiting for you to get quiet'
    ],
    action: 'notice where you\'re using force. try patience instead, just once'
  },

  'major-9': {
    synthesis: [
      'Other people\'s voices are drowning out your own in {house_theme}. {transiting_planet} on your {natal_planet} - the answer isn\'t in the group chat. Go alone',
      'You\'re not depressed, you\'re recalibrating. {transiting_planet} working your {natal_planet} around {house_theme} needs the door closed and the lights off',
      'The answer lives inside and you can\'t hear it while performing. {transiting_planet} hitting your {natal_planet} in {house_theme} - what do you actually think?'
    ],
    action: 'spend time alone today without filling it. no podcast, no scroll. just you'
  },

  'major-10': {
    synthesis: [
      '{transiting_planet} moving through your {natal_planet} in {house_theme} isn\'t coincidence - it\'s timing. The moment is handing you something. Receive it or miss it',
      'The shift in {house_theme} was in motion long before today. {transiting_planet} on your {natal_planet} is just the point where it becomes undeniable',
      'You\'ve been trying to predict {house_theme}. {transiting_planet} meeting your {natal_planet} says this turn wasn\'t in your model - which means your model needs updating'
    ],
    action: 'let go of one thing you\'ve been trying to control. practice adapting instead'
  },

  'major-11': {
    synthesis: [
      'The scales in {house_theme} are unbalanced and you already know which side. {transiting_planet} on your {natal_planet} - Justice doesn\'t negotiate',
      'What you owe and what\'s owed to you. {transiting_planet} hitting your {natal_planet} in {house_theme} - no excuses, just what\'s actually true',
      'The consequence in {house_theme} is fair, even if uncomfortable. {transiting_planet} activating your {natal_planet} - Justice doesn\'t apologize'
    ],
    action: 'name one area where you haven\'t been fair - to yourself or someone else'
  },

  'major-12': {
    synthesis: [
      'Struggling makes it worse. {transiting_planet} on your {natal_planet} in {house_theme} - stop thrashing. Surrender and the view changes',
      'What if you saw {house_theme} from the other angle? {transiting_planet} working your {natal_planet} - the suspension is the lesson, not the obstacle to it',
      'You\'re not stuck, you\'re paused for a reason. {transiting_planet} meeting your {natal_planet} around {house_theme} - something shifts when you stop forcing your way out'
    ],
    action: 'pause on the thing you\'ve been forcing. sit with not knowing for one day'
  },

  'major-13': {
    synthesis: [
      '{transiting_planet} has been building pressure in {house_theme} for a while. Your {natal_planet} finally got the message. The timing was the transit\'s doing - not yours',
      'Whatever {transiting_planet} has been dismantling around your {natal_planet} in {house_theme} - you\'ve been feeling it coming. The card confirms it\'s not in your head',
      'The loss in {house_theme} and {transiting_planet} on your {natal_planet} arriving at the same time isn\'t coincidence. This was always the mechanism. Now you work with what\'s cleared'
    ],
    action: 'name what you need to stop holding onto. say it out loud, even if nobody hears'
  },

  'major-14': {
    synthesis: [
      'The two things that seem incompatible in {house_theme} aren\'t. {transiting_planet} on your {natal_planet} - pour them together slowly',
      'Not one extreme or the other. {transiting_planet} activating your {natal_planet} around {house_theme} - the middle path holds both truths without collapsing',
      'Patience is doing the work. {transiting_planet} meeting your {natal_planet} in {house_theme} - the alchemy takes the time it takes'
    ],
    action: 'find the middle position between two things you\'ve been treating as opposites'
  },

  'major-15': {
    synthesis: [
      'Chained by choice, not force. {transiting_planet} on your {natal_planet} in {house_theme} - the chains are loose. You could leave. Why don\'t you?',
      'What are you getting from staying stuck in {house_theme}? {transiting_planet} revealing this through your {natal_planet} - there\'s always a payoff for staying',
      'The door in {house_theme} was never locked. {transiting_planet} meeting your {natal_planet} - the Devil doesn\'t trap, it tempts. You\'re here because some part of you chose it'
    ],
    action: 'ask honestly: what am i getting from this situation i claim i want to leave?'
  },

  'major-16': {
    synthesis: [
      'The crack was always there in {house_theme}. {transiting_planet} hitting your {natal_planet} just found it - the Tower reveals the weakness, doesn\'t create it',
      'Whatever collapsed - it couldn\'t hold. {transiting_planet} meeting your {natal_planet} in {house_theme} - the Tower doesn\'t renovate, it levels',
      'That 2am realization it was never going to work? {transiting_planet} on your {natal_planet} around {house_theme} - you knew. The Tower just made you stop pretending'
    ],
    action: 'stop rebuilding what just fell. sit in the rubble before you pick up the bricks'
  },

  'major-17': {
    synthesis: [
      'After the break in {house_theme}, something small and real remains. {transiting_planet} flowing through your {natal_planet} - the Star sees what survived, not what didn\'t',
      'This isn\'t naive optimism. {transiting_planet} helping your {natal_planet} rebuild trust around {house_theme} - the Star knows what was lost and hopes anyway, with eyes open',
      'Healing in {house_theme} looks like this: quiet, slow, undramatic. {transiting_planet} meeting your {natal_planet} - the Star doesn\'t announce itself'
    ],
    action: 'notice one small thing that still feels okay. that\'s where you build from'
  },

  'major-18': {
    synthesis: [
      'Things aren\'t what they appear in {house_theme}. {transiting_planet} on your {natal_planet} - what you\'re afraid of and what\'s actually there aren\'t the same',
      'Your instincts are activated and your logic is confused. {transiting_planet} working your {natal_planet} around {house_theme} - trust the body, not the story you\'re spinning',
      'Something in {house_theme} is hidden even from you. {transiting_planet} meeting your {natal_planet} - what are you not letting yourself see?'
    ],
    action: 'write down what you\'re anxious about without trying to explain or justify it. just the fear'
  },

  'major-19': {
    synthesis: [
      '{transiting_planet} lighting up your {natal_planet} in {house_theme} is removing whatever was blocking the view. You weren\'t wrong - you just couldn\'t see all the way yet',
      'The clarity coming into {house_theme} right now isn\'t naive. {transiting_planet} on your {natal_planet} has been working toward this - the good thing is actually happening',
      'You keep waiting for the complication in {house_theme}. {transiting_planet} meeting your {natal_planet} - sometimes there isn\'t one. This is one of those times'
    ],
    action: 'do one thing purely because it makes you happy. no justification needed'
  },

  'major-20': {
    synthesis: [
      'Wake up to who you actually are. {transiting_planet} on your {natal_planet} in {house_theme} - not the name you perform, the real one',
      'What have you been avoiding facing about {house_theme}? {transiting_planet} demanding your {natal_planet} see it - Judgment doesn\'t whisper',
      'The old version of you in {house_theme} is done. {transiting_planet} meeting your {natal_planet} - who you were always becoming, not who you\'ve been pretending to be'
    ],
    action: 'name one story about yourself that you\'ve outgrown but keep repeating'
  },

  'major-21': {
    synthesis: [
      '{transiting_planet} completing its movement through your {natal_planet} in {house_theme} at the same time as this card - the cycle is genuinely closing. Don\'t manufacture a next chapter yet',
      'The convergence in {house_theme}: {transiting_planet} finishing its work on your {natal_planet}, the thing that has been building finally landing. Both are saying the same thing',
      'Something in {house_theme} has run its full arc under {transiting_planet}. Your {natal_planet} is different for it. Before you move on - know what you\'re carrying forward'
    ],
    action: 'acknowledge what you\'ve actually finished. let yourself feel done'
  },

  // ── CUPS ──────────────────────────────────────────────────────────────────

  'cups-1': {
    synthesis: [
      'Something new is arriving emotionally in {house_theme}. {transiting_planet} on your {natal_planet} - this feeling is clean, hasn\'t been complicated yet. Pay attention before the mind starts editing',
      'A fresh emotional current in {house_theme}. {transiting_planet} meeting your {natal_planet} - Ace of Cups doesn\'t repeat what came before. This is actually new',
      'The overflowing cup in {house_theme} while {transiting_planet} hits your {natal_planet} - don\'t talk yourself out of this feeling before you\'ve fully felt it'
    ],
    action: 'let yourself feel the new thing without immediately analysing it'
  },

  'cups-2': {
    synthesis: [
      'Someone in {house_theme} actually sees you. {transiting_planet} on your {natal_planet} - it goes both ways. This isn\'t you giving more',
      'Mutual. Not you bending down or reaching up. {transiting_planet} hitting your {natal_planet} around {house_theme} - the rare thing: level',
      'Partnership forming where {transiting_planet} meets your {natal_planet} in {house_theme}. Two people actually looking at each other'
    ],
    action: 'tell someone what they mean to you directly. no hints'
  },

  'cups-3': {
    synthesis: [
      'Call your friends. {transiting_planet} working your {natal_planet} in {house_theme} - this joy doesn\'t work alone',
      'The group text that actually makes you laugh, the dinner that runs late - {transiting_planet} on your {natal_planet} around {house_theme}, community doing its actual job',
      'Abundance in {house_theme} multiplies when shared. {transiting_planet} meeting your {natal_planet} - stop celebrating alone'
    ],
    action: 'reach out to people you actually like. make a plan, not a maybe'
  },

  'cups-4': {
    synthesis: [
      'You\'re sulking in {house_theme}. {transiting_planet} on your {natal_planet} - crossed arms, the gift being offered that you\'re ignoring because it\'s not the one you wanted',
      'So fixated on what\'s missing in {house_theme} that you can\'t see what\'s right there. {transiting_planet} hitting your {natal_planet} - look up from your own disappointment',
      'Someone is extending something in {house_theme} and you\'re not seeing it. {transiting_planet} meeting your {natal_planet} - what are you refusing to receive?'
    ],
    action: 'look for what\'s being offered that you\'ve been ignoring. say yes to something small'
  },

  'cups-5': {
    synthesis: [
      'Three cups spilled, two still standing. {transiting_planet} on your {natal_planet} in {house_theme} - staring at the loss and not turning to see what remains',
      'The grief in {house_theme} is real. {transiting_planet} working your {natal_planet} - Five of Cups doesn\'t ask you to stop mourning, it asks you to eventually turn around',
      'What you lost in {house_theme} matters. So does what survived. {transiting_planet} hitting your {natal_planet} - you\'re not left with nothing'
    ],
    action: 'write down what you\'re grieving. then on the other side, what remains'
  },

  'cups-6': {
    synthesis: [
      'Why you texted them at 1am, why that song wrecked you - {transiting_planet} hitting your {natal_planet} in {house_theme}, pulled back not because the past was better but because you were more yourself',
      'The nostalgia in {house_theme} isn\'t about circumstances. {transiting_planet} working your {natal_planet} - about innocence, the version of you that didn\'t know yet what disappointment tastes like',
      'Comparing now to then while {transiting_planet} meets your {natal_planet} around {house_theme} - do you want to go back or do you just miss feeling that way?'
    ],
    action: 'reconnect with something that used to bring joy before you learned to overthink it'
  },

  'cups-7': {
    synthesis: [
      'Seven options, none of them fully real yet. {transiting_planet} on your {natal_planet} in {house_theme} - you\'re not choosing because you\'re not ready to lose the other possibilities',
      'The dream in {house_theme} is seductive while {transiting_planet} clouds your {natal_planet}. Which one would you actually choose if the magic wore off?',
      'Too many visions, not enough commitment. {transiting_planet} hitting your {natal_planet} around {house_theme} - pick one and find out if it\'s real'
    ],
    action: 'choose one option. clarity comes from commitment, not more thinking'
  },

  'cups-8': {
    synthesis: [
      'Walking away from something that still exists in {house_theme}. {transiting_planet} on your {natal_planet} - leaving because staying would be a lie',
      'It wasn\'t a failure. {transiting_planet} working your {natal_planet} around {house_theme} - the honest exit, the moment you admit this isn\'t what you need anymore',
      'The eight cups are full and you\'re leaving them. {transiting_planet} meeting your {natal_planet} in {house_theme} - why? That\'s the question worth sitting with'
    ],
    action: 'ask yourself honestly: am i staying somewhere i\'ve already left emotionally?'
  },

  'cups-9': {
    synthesis: [
      'You got what you wanted in {house_theme}. {transiting_planet} on your {natal_planet} - let it land. Actually enjoy this instead of already scanning for the next thing',
      'Satisfaction is available right now. {transiting_planet} activating your {natal_planet} in {house_theme} - the wish fulfilled. You\'re allowed to feel it',
      'Stop moving the goalpost. {transiting_planet} meeting your {natal_planet} around {house_theme} - contentment is available if you let yourself be content'
    ],
    action: 'actually enjoy what you have today. don\'t plan the next thing. just this'
  },

  'cups-10': {
    synthesis: [
      'The emotional life you\'ve been building in {house_theme} - this is what it looks like. {transiting_planet} on your {natal_planet} - the life that actually works',
      'The rainbow after the storms. {transiting_planet} activating your {natal_planet} around {house_theme} - the love that holds, the whole picture',
      'Fulfilment, not perfection. {transiting_planet} meeting your {natal_planet} in {house_theme} - the good life and you\'re standing in it'
    ],
    action: 'call or message the person who makes you feel most at home'
  },

  'cups-page': {
    synthesis: [
      'A feeling arriving that you haven\'t felt before. {transiting_planet} on your {natal_planet} in {house_theme} - new, raw, unfiltered. Don\'t file it away yet',
      'Emotional openness without knowing what to do with it. {transiting_planet} working your {natal_planet} around {house_theme} - the message that surprises you. Read it',
      'Something is making itself known in {house_theme} through feeling. {transiting_planet} hitting your {natal_planet} - be curious about it, not clinical'
    ],
    action: 'let yourself feel something without immediately needing to understand it'
  },

  'cups-knight': {
    synthesis: [
      'Chasing the feeling in {house_theme}. {transiting_planet} on your {natal_planet} - romantic, idealistic, pursuing what moves you. Are you chasing the feeling or the person?',
      'The invitation in {house_theme} while {transiting_planet} meets your {natal_planet} - the gesture, the poetry, the grand declaration. Is there substance underneath?',
      'Following emotion into {house_theme} while {transiting_planet} activates your {natal_planet} - gorgeous and impractical. Useful for starting things'
    ],
    action: 'make the romantic or creative gesture you\'ve been overthinking. do it while the feeling is alive'
  },

  'cups-queen': {
    synthesis: [
      'You already know what\'s happening in {house_theme}. {transiting_planet} on your {natal_planet} - reads the room before anyone speaks. Trust your read',
      'The empathy you\'re extending in {house_theme} while {transiting_planet} works your {natal_planet} - feels what others feel. Set a boundary before you absorb it all',
      'Emotional intelligence in {house_theme}. {transiting_planet} meeting your {natal_planet} - she knows. She just knows. And acts from that, not from logic'
    ],
    action: 'trust your instinct about how someone is feeling. act on it'
  },

  'cups-king': {
    synthesis: [
      'Hold steady in {house_theme}. {transiting_planet} on your {natal_planet} - calm in the storm. Emotional mastery means feeling everything without letting it run you',
      'Someone in {house_theme} needs your steadiness. {transiting_planet} working your {natal_planet} - leads from the heart without losing the head',
      'The feelings in {house_theme} are big. {transiting_planet} meeting your {natal_planet} - you can hold all of it without being swept away'
    ],
    action: 'be the steady one for someone today. feel your feelings but don\'t perform them'
  },

  // ── SWORDS ────────────────────────────────────────────────────────────────

  'swords-1': {
    synthesis: [
      'Clarity breaking through in {house_theme}. {transiting_planet} on your {natal_planet} - the truth arriving all at once, cutting through everything that was obscuring it',
      'New mental clarity in {house_theme}. {transiting_planet} hitting your {natal_planet} - the breakthrough thought, the thing that suddenly makes everything make sense',
      'The truth in {house_theme} cuts clean. {transiting_planet} meeting your {natal_planet} - sharp, not cruel. Use it'
    ],
    action: 'write down the truth you just realised. clearly. in one sentence'
  },

  'swords-2': {
    synthesis: [
      'Blindfold on, arms crossed. {transiting_planet} pressures your {natal_planet} in {house_theme} - you know both options. You just won\'t look',
      'Neither choice feels safe so you made the standoff. {transiting_planet} on your {natal_planet} around {house_theme} - the pause costs more than choosing',
      'How long can you hold this? {transiting_planet} hitting your {natal_planet} in {house_theme} - making no decision is also a decision'
    ],
    action: 'make the choice you\'ve been stalling on. imperfect action beats perfect paralysis'
  },

  'swords-3': {
    synthesis: [
      'That sentence they said. You keep replaying it in {house_theme} while {transiting_planet} hits your {natal_planet} - the specific wound, not the vague ache',
      'Why you flinch at that tone, why you can\'t stop checking their profile. {transiting_planet} on your {natal_planet} around {house_theme} - the moment trust cracked and the sound it made',
      'Grief in {house_theme} that lives in the chest, not the head. {transiting_planet} meeting your {natal_planet} - it doesn\'t respond to logic. It just has to be felt'
    ],
    action: 'let yourself grieve it properly instead of trying to rationalize it away'
  },

  'swords-4': {
    synthesis: [
      'Stop. {transiting_planet} on your {natal_planet} in {house_theme} - forced rest, mental recovery after too much fighting. Lay down',
      'You can\'t think your way through this today. {transiting_planet} working your {natal_planet} around {house_theme} - recuperation is part of the process',
      'The mind needs to stop in {house_theme}. {transiting_planet} hitting your {natal_planet} - you don\'t have to figure this out right now. That\'s not avoidance, that\'s wisdom'
    ],
    action: 'give yourself permission to not figure it out today. genuine rest'
  },

  'swords-5': {
    synthesis: [
      'You won but look at what it cost. {transiting_planet} on your {natal_planet} in {house_theme} - the hollow victory, the argument you technically won and emotionally lost',
      'Is being right in {house_theme} worth more than the relationship? {transiting_planet} working your {natal_planet} - count the bodies after the battle',
      'The conflict in {house_theme} has a winner and it might be you. {transiting_planet} meeting your {natal_planet} - at what cost?'
    ],
    action: 'ask honestly if winning this particular fight is worth what it\'s costing'
  },

  'swords-6': {
    synthesis: [
      'Moving away from troubled waters in {house_theme}. {transiting_planet} on your {natal_planet} - not escape, transition. Calmer ground',
      'You\'re not running from {house_theme}. {transiting_planet} working your {natal_planet} - deliberate departure. Taking what you need, leaving what you don\'t',
      'Grief and relief happening at the same time in {house_theme}. {transiting_planet} meeting your {natal_planet} - both are okay'
    ],
    action: 'pack what you need for the next phase. put down what doesn\'t belong where you\'re going'
  },

  'swords-7': {
    synthesis: [
      'Are you being honest in {house_theme}? {transiting_planet} on your {natal_planet} - knows the shortcuts you\'re taking and who\'s not watching',
      'That loophole, that half-truth, that thing you\'re getting away with in {house_theme}. {transiting_planet} working your {natal_planet} - works until it doesn\'t',
      'Strategy or deception? {transiting_planet} hitting your {natal_planet} around {house_theme} - which one and could you defend it out loud?'
    ],
    action: 'audit yourself. is there something you\'re being less than honest about?'
  },

  'swords-8': {
    synthesis: [
      'You built this cage in {house_theme}. {transiting_planet} on your {natal_planet} - blindfolded in restraints that are barely tied. You could move. Why aren\'t you?',
      'The prison in {house_theme} is mental. {transiting_planet} working your {natal_planet} - the belief that you\'re stuck is doing more work than any actual obstacle',
      'What\'s the story you tell yourself about why you can\'t change {house_theme}? {transiting_planet} hitting your {natal_planet} - test it'
    ],
    action: 'identify one constraint you\'ve accepted as fixed. challenge whether it actually is'
  },

  'swords-9': {
    synthesis: [
      '3am and the mind won\'t stop. {transiting_planet} on your {natal_planet} in {house_theme} - catastrophizing, worst case on repeat, anxiety that\'s outrun any actual evidence',
      'Write the fear down. {transiting_planet} working your {natal_planet} around {house_theme} - none of those scenarios are happening right now',
      'The suffering in {house_theme} is real but the story generating it isn\'t. {transiting_planet} hitting your {natal_planet} - is this actually happening?'
    ],
    action: 'write down your worst fear. then ask: is this actually happening right now?'
  },

  'swords-10': {
    synthesis: [
      'Rock bottom in {house_theme}. {transiting_planet} on your {natal_planet} - the most dramatic ending possible. And it\'s over. The only direction from here is up',
      'Total collapse in {house_theme} while {transiting_planet} meets your {natal_planet} - don\'t add more swords. This is already the end',
      'The darkest moment in {house_theme} is also the clearest. {transiting_planet} hitting your {natal_planet} - this particular story is done. Let it be'
    ],
    action: 'let it be over. stop narrating the collapse. it happened. what\'s next?'
  },

  'swords-page': {
    synthesis: [
      'A new idea cutting through in {house_theme}. {transiting_planet} on your {natal_planet} - sharp, curious, asking questions that make people uncomfortable',
      'Mental alertness in {house_theme} while {transiting_planet} works your {natal_planet} - watching carefully, testing the edges of things',
      'Ask the question nobody\'s asking in {house_theme}. {transiting_planet} hitting your {natal_planet} - say what everyone else was thinking'
    ],
    action: 'ask the uncomfortable question you\'ve been holding back'
  },

  'swords-knight': {
    synthesis: [
      'Moving fast and cutting straight in {house_theme}. {transiting_planet} on your {natal_planet} - no diplomacy, no waiting for permission',
      'Directness in {house_theme} while {transiting_planet} meets your {natal_planet} - says what needs to be said and moves before doubt catches up',
      'Charge. {transiting_planet} hitting your {natal_planet} around {house_theme} - decisive action, sometimes reckless. Know where you\'re pointing'
    ],
    action: 'say the direct thing. no softening. watch what changes'
  },

  'swords-queen': {
    synthesis: [
      'You see exactly what\'s happening in {house_theme}. {transiting_planet} on your {natal_planet} - cuts through the story, the politeness, the performance. Names what\'s actually there',
      'Perceptive and unsentimental. {transiting_planet} working your {natal_planet} around {house_theme} - pain made her precise, not soft',
      'Name it. {transiting_planet} meeting your {natal_planet} in {house_theme} - what do you actually see here, without the comfortable gloss?'
    ],
    action: 'strip the story back to facts. what is actually happening, with no interpretation?'
  },

  'swords-king': {
    synthesis: [
      'The decision needs to be made in {house_theme}. {transiting_planet} on your {natal_planet} - clarity, not cruelty. You\'ve been circling long enough',
      'Intellectual authority in {house_theme}. {transiting_planet} working your {natal_planet} - sees the full picture, makes the call, lives with it',
      'Lead with the mind, not the mood. {transiting_planet} hitting your {natal_planet} around {house_theme} - what do you actually know to be true?'
    ],
    action: 'make the decision you\'ve been circling. then stop revisiting it'
  },

  // ── WANDS ─────────────────────────────────────────────────────────────────

  'wands-1': {
    synthesis: [
      'A new spark in {house_theme}. {transiting_planet} on your {natal_planet} - raw creative impulse before anyone\'s had a chance to complicate it. It won\'t feel this clear for long',
      'Creative beginning in {house_theme} while {transiting_planet} hits your {natal_planet} - the yes before the how. Start',
      'Something is igniting in {house_theme}. {transiting_planet} meeting your {natal_planet} - all fire, no plan yet. That\'s appropriate'
    ],
    action: 'start the creative thing today. ten minutes. just to begin'
  },

  'wands-2': {
    synthesis: [
      'You see it but haven\'t moved yet. {transiting_planet} showing your {natal_planet} the bigger picture in {house_theme} - the map spread out before the journey begins',
      'Vision needs action eventually. Two of Wands in {house_theme} while {transiting_planet} works your {natal_planet} - the plan is half-formed, the commitment not made. How long before you ship?',
      '{transiting_planet} on your {natal_planet} around {house_theme} - standing at the crossroads with the world in your hands. What are you waiting for?'
    ],
    action: 'write down the plan, even roughly. putting it on paper makes it real'
  },

  'wands-3': {
    synthesis: [
      'The ships you sent out are coming in. {transiting_planet} on your {natal_planet} in {house_theme} - waiting after the doing, watching the horizon for return',
      'You already made the move in {house_theme}. {transiting_planet} working your {natal_planet} - the expansion phase, the thing you set in motion arriving',
      'Already thinking about the next thing while the first thing succeeds. {transiting_planet} hitting your {natal_planet} around {house_theme} - check on what you started'
    ],
    action: 'check on the thing you put out into the world. follow up on what you started'
  },

  'wands-4': {
    synthesis: [
      'Celebration is earned in {house_theme}. {transiting_planet} on your {natal_planet} - homecoming, the completion worth marking. Acknowledge it',
      'The foundation is built in {house_theme}. {transiting_planet} activating your {natal_planet} - stability after striving, the threshold crossed',
      'Stop rushing past the win in {house_theme}. {transiting_planet} meeting your {natal_planet} - pause and recognize what you\'ve actually created'
    ],
    action: 'acknowledge what you\'ve built. tell someone about it. let yourself feel proud'
  },

  'wands-5': {
    synthesis: [
      'Chaos and competition in {house_theme}. {transiting_planet} on your {natal_planet} - everyone going in different directions, the messy energy before clarity',
      'The conflict in {house_theme} while {transiting_planet} works your {natal_planet} - are you actually fighting or is this just friction that precedes something coalescing?',
      'Too many cooks in {house_theme}. {transiting_planet} hitting your {natal_planet} - the struggle, the testing, the friction that reveals what\'s actually strong'
    ],
    action: 'decide if this conflict is worth your energy. if yes, fight clearly. if no, step back'
  },

  'wands-6': {
    synthesis: [
      'Recognition in {house_theme}. {transiting_planet} on your {natal_planet} - the public win, the acknowledgment you earned. The moment people see what you\'ve done',
      'Let yourself receive it. {transiting_planet} activating your {natal_planet} in {house_theme} - shrinking it doesn\'t make you humble, it makes you dishonest',
      'You won in {house_theme}. {transiting_planet} meeting your {natal_planet} - the crowd is watching. Lead'
    ],
    action: 'accept the acknowledgement without deflecting it. you earned it'
  },

  'wands-7': {
    synthesis: [
      'Holding your ground in {house_theme}. {transiting_planet} on your {natal_planet} - outnumbered but not outmatched. What are you actually defending?',
      'Everyone has an opinion about {house_theme}. {transiting_planet} working your {natal_planet} - the position you won\'t abandon, the hill you\'ve chosen. Make sure it\'s worth it',
      'You got here, you can defend it. {transiting_planet} hitting your {natal_planet} in {house_theme} - but pick your battles'
    ],
    action: 'name what you\'re actually defending. your position, your values, or your ego?'
  },

  'wands-8': {
    synthesis: [
      'Messages flying, things moving faster than expected. {transiting_planet} on your {natal_planet} in {house_theme} - catch up',
      'The pace just changed overnight. {transiting_planet} hitting your {natal_planet} - Eight of Wands is rapid-fire movement. Things that were slow are now immediate',
      'Momentum in {house_theme} you can\'t slow down. {transiting_planet} meeting your {natal_planet} - keep up or get left behind'
    ],
    action: 'respond to the thing that needs a response. move while the energy is live'
  },

  'wands-9': {
    synthesis: [
      'Nearly there and completely exhausted in {house_theme}. {transiting_planet} on your {natal_planet} - battle-worn but still holding the staff. Too far to stop',
      'Waiting for the next hit because there\'s always been a next hit. {transiting_planet} working your {natal_planet} - resilience that\'s become hypervigilance. Rest between battles',
      'The wounds are showing and the stance is still held in {house_theme}. {transiting_planet} hitting your {natal_planet} - you don\'t have to be fine. Just continue'
    ],
    action: 'take stock of how far you\'ve come. you\'re closer than you think'
  },

  'wands-10': {
    synthesis: [
      'Carrying too much in {house_theme}. {transiting_planet} on your {natal_planet} - hunched under an impossible load, still trying to carry it all alone',
      'What can you put down? {transiting_planet} working your {natal_planet} in {house_theme} - you took on everything because you could, not because you should',
      'The exhaustion in {house_theme} is self-imposed. {transiting_planet} hitting your {natal_planet} - you don\'t get a prize for suffering through things you could delegate or drop'
    ],
    action: 'put one thing down today. delegate, cancel, or just stop'
  },

  'wands-page': {
    synthesis: [
      'The spark of something new in {house_theme}. {transiting_planet} on your {natal_planet} - pure enthusiasm before doubt arrives. Protect this',
      'Curiosity and fire in {house_theme}. {transiting_planet} working your {natal_planet} - the idea, the vision, the impractical impossible thing that might become real',
      'Something is exciting you in {house_theme}. {transiting_planet} hitting your {natal_planet} - explore it before you explain it'
    ],
    action: 'share the idea with someone who gets excited about things, not someone who\'ll audit it'
  },

  'wands-knight': {
    synthesis: [
      'Charging in {house_theme} before the plan is finished. {transiting_planet} on your {natal_planet} - the energy that starts things and sometimes burns them down. Channel it',
      'The urgency in {house_theme} while {transiting_planet} works your {natal_planet} - moves before thinking. Useful fire. Know where you\'re pointing it',
      'Action without strategy in {house_theme}. {transiting_planet} hitting your {natal_planet} - the leap is thrilling. Make sure there\'s somewhere to land'
    ],
    action: 'channel the energy into something specific. directed action beats raw momentum'
  },

  'wands-queen': {
    synthesis: [
      'Confidence and warmth in {house_theme}. {transiting_planet} on your {natal_planet} - walks in and the room shifts. Doesn\'t ask permission to take up space',
      'What are you genuinely excited about in {house_theme}? {transiting_planet} working your {natal_planet} - builds from passion, not obligation',
      'Do the thing you\'re on fire about in {house_theme}, not the thing that looks responsible. {transiting_planet} meeting your {natal_planet} - the warmth is the authority'
    ],
    action: 'lead with your enthusiasm today. the warmth is magnetic, don\'t suppress it'
  },

  'wands-king': {
    synthesis: [
      'The bold call in {house_theme}. {transiting_planet} on your {natal_planet} - the visionary who makes the decision before the consensus forms',
      'Leadership through vision in {house_theme}. {transiting_planet} working your {natal_planet} - doesn\'t manage the fire, directs it. Already knows where this is going',
      'The moment to lead in {house_theme}. {transiting_planet} hitting your {natal_planet} - decisive, charismatic, five steps ahead. Make the call'
    ],
    action: 'make the bold decision you\'ve been waiting for consensus on. leaders decide'
  },

  // ── PENTACLES ─────────────────────────────────────────────────────────────

  'pentacles-1': {
    synthesis: [
      'Something material is beginning in {house_theme}. {transiting_planet} on your {natal_planet} - the seed, the offer, the first real money, the tangible foundation',
      'A new practical beginning in {house_theme}. {transiting_planet} hitting your {natal_planet} - opportunity in the physical world. Plant it',
      'The tangible thing is available in {house_theme}. {transiting_planet} meeting your {natal_planet} - take the first step, the physical one, not just the mental one'
    ],
    action: 'take one concrete financial or practical step today. something you can actually see'
  },

  'pentacles-2': {
    synthesis: [
      'Not juggling well, just moving fast enough that nothing has dropped yet. {transiting_planet} disrupting your {natal_planet} in {house_theme} - the pretense of balance',
      'Maintaining six things but mastering none. You keep saying you\'ll stabilize once X is done. There\'s always another X. {transiting_planet} on your {natal_planet} around {house_theme} - the juggling IS the problem',
      'Saying yes to everything in {house_theme} because you\'re afraid to admit you can\'t hold it all. {transiting_planet} hitting your {natal_planet} - something drops or you choose what to put down'
    ],
    action: 'list everything you\'re juggling. cross out two things that don\'t actually need you'
  },

  'pentacles-3': {
    synthesis: [
      'Your skill meets other people\'s skill in {house_theme}. {transiting_planet} on your {natal_planet} - the work needs all of you, not just you',
      'Can\'t build this alone. {transiting_planet} bringing your {natal_planet} into collaboration around {house_theme} - not a weakness, the design',
      'Expertise recognized and used in {house_theme}. {transiting_planet} meeting your {natal_planet} - what you know meets what they know and the thing actually gets built'
    ],
    action: 'ask for help or bring in someone with the skill you\'re missing'
  },

  'pentacles-4': {
    synthesis: [
      'Holding on too tight in {house_theme}. {transiting_planet} on your {natal_planet} - the grip that comes from fear of loss, not actual abundance',
      'Security through control. {transiting_planet} working your {natal_planet} in {house_theme} - what are you really afraid will happen if you loosen your grip?',
      'Hoarding in {house_theme}. {transiting_planet} hitting your {natal_planet} - the miser sitting on the gold. The protection is real. So is the prison'
    ],
    action: 'ask: what am i holding onto out of fear? what would happen if i let it flow?'
  },

  'pentacles-5': {
    synthesis: [
      'Left out in the cold in {house_theme}. {transiting_planet} on your {natal_planet} - the hardship, the shortage, the warm light through the window that isn\'t for you',
      'Financial or material struggle in {house_theme}. {transiting_planet} working your {natal_planet} - the help exists. The question is whether you\'ll ask for it',
      'The lack in {house_theme} while {transiting_planet} hits your {natal_planet} - struggling alone when there is a door. Find it'
    ],
    action: 'ask for help. specifically, from someone who can actually provide it'
  },

  'pentacles-6': {
    synthesis: [
      'The give and take in {house_theme}. {transiting_planet} on your {natal_planet} - the flow of resources, the balance of generosity and receiving',
      'Are you giving or receiving in {house_theme} right now? {transiting_planet} working your {natal_planet} - is the exchange fair and are you playing your actual role?',
      'Resources flowing in {house_theme}. {transiting_planet} meeting your {natal_planet} - generosity and gratitude in balance. Where\'s the flow blocked?'
    ],
    action: 'give something freely today, or ask for what you need without guilt'
  },

  'pentacles-7': {
    synthesis: [
      'Waiting for the harvest in {house_theme}. {transiting_planet} on your {natal_planet} - patient assessment mid-growth. Is this still worth the investment?',
      'Building in {house_theme} and {transiting_planet} working your {natal_planet} says step back and honestly assess. Not everything worth planting is worth finishing',
      'Progress slower than expected in {house_theme}. {transiting_planet} hitting your {natal_planet} - the long game. Are you still in?'
    ],
    action: 'assess what you\'ve been building. is it growing? is it still worth the work?'
  },

  'pentacles-8': {
    synthesis: [
      'Redoing it for the fifth time because it\'s not right yet. {transiting_planet} meeting your {natal_planet} in {house_theme} - the repetition nobody sees, the revision that makes the difference',
      'The boring middle part of {house_theme}. {transiting_planet} activating your {natal_planet} - practice, refinement, the draft you throw out. This is where skill actually forms',
      'Stop trying to skip steps in {house_theme}. {transiting_planet} hitting your {natal_planet} - the mastery you want lives in the repetition you keep resisting'
    ],
    action: 'put in the hours on the thing that needs work. the unsexy part. do it anyway'
  },

  'pentacles-9': {
    synthesis: [
      'You built this. {transiting_planet} on your {natal_planet} in {house_theme} - self-sufficiency earned, the garden tended, the independence that came from doing the work',
      'Abundance in {house_theme} from your own effort. {transiting_planet} activating your {natal_planet} - you don\'t need to justify enjoying what you created',
      'The independence in {house_theme} while {transiting_planet} meets your {natal_planet} - luxury that\'s yours because you made it. Receive it'
    ],
    action: 'do something that celebrates what you\'ve built. spend on yourself without guilt'
  },

  'pentacles-10': {
    synthesis: [
      'Legacy and long-term thinking in {house_theme}. {transiting_planet} on your {natal_planet} - what you\'re building that outlasts you',
      'The whole picture in {house_theme}. {transiting_planet} working your {natal_planet} - family, wealth, tradition, the foundation that holds across generations',
      'Security that goes beyond just you in {house_theme}. {transiting_planet} hitting your {natal_planet} - what are you building that your future self will benefit from?'
    ],
    action: 'think about one decision you could make today that your future self will thank you for'
  },

  'pentacles-page': {
    synthesis: [
      'Learning how things actually work in {house_theme}. {transiting_planet} on your {natal_planet} - the student, the apprentice, building skills one careful step at a time',
      'New practical knowledge in {house_theme}. {transiting_planet} working your {natal_planet} - methodical, curious, turning the coin over to understand it fully',
      'Beginning of a material skill in {house_theme}. {transiting_planet} hitting your {natal_planet} - don\'t rush. Study it properly'
    ],
    action: 'dedicate time to actually learning the practical skill. books, course, hands-on'
  },

  'pentacles-knight': {
    synthesis: [
      'Slow, steady, reliable. {transiting_planet} on your {natal_planet} in {house_theme} - shows up every day, finishes things. The methodical one',
      'The necessary but unglamorous work in {house_theme}. {transiting_planet} working your {natal_planet} - not the exciting choice but the effective one',
      'Head down, keeps going in {house_theme}. {transiting_planet} meeting your {natal_planet} - someone needs to be the one who finishes. That\'s the job right now'
    ],
    action: 'do the boring necessary thing you\'ve been postponing. the one with no glory'
  },

  'pentacles-queen': {
    synthesis: [
      'Practical abundance in {house_theme}. {transiting_planet} on your {natal_planet} - tends what she has, nurtures what grows, makes the material world beautiful through care',
      'The home, the body, the resources. {transiting_planet} working your {natal_planet} around {house_theme} - practical magic: things flourish when you pay attention',
      'Grounded generosity in {house_theme}. {transiting_planet} meeting your {natal_planet} - feeds everyone and keeps the books balanced. Take care of your physical reality'
    ],
    action: 'tend to your physical environment. clean something, buy fresh food, care for the body'
  },

  'pentacles-king': {
    synthesis: [
      'Material authority in {house_theme}. {transiting_planet} on your {natal_planet} - built something solid, manages it wisely, knows the difference between wealth and success',
      'The financial decision in {house_theme} while {transiting_planet} works your {natal_planet} - make it from strength, not fear. What do you actually know to be true?',
      'Long-term thinking in {house_theme}. {transiting_planet} hitting your {natal_planet} - built slowly, kept what worked, let go of what didn\'t. One decision toward that today'
    ],
    action: 'make the financial or material decision you\'ve been avoiding'
  },

  // ── SUIT FALLBACKS ────────────────────────────────────────────────────────

  swords: {
    synthesis: [
      '{transiting_planet} hitting your {natal_planet} in {house_theme} - the conversation you rehearse in the shower. You already know what needs to be said. You\'re just negotiating with yourself about when',
      'Whatever {transiting_planet} is doing to your {natal_planet} around {house_theme} - cut the story. Not the one about why it\'s complicated, the actual facts. Write them down',
      '{transiting_planet} meeting your {natal_planet} in {house_theme} - overthinking this to paralysis. Clarity comes from cutting, not more analysis. Decide'
    ],
    action: 'write down the hard truth. then decide what to do with it'
  },

  cups: {
    synthesis: [
      '{transiting_planet} working on your {natal_planet} in {house_theme} - chest getting tight, throat closing, suddenly needing to leave the room. The feeling came first. The reason comes later',
      'Whatever {transiting_planet} is doing to your {natal_planet} around {house_theme} - trying to logic through something that lives in your ribcage. You can explain why you should feel differently. You don\'t. That\'s the information',
      '{transiting_planet} meeting your {natal_planet} in {house_theme} - the friend whose text you answer first, the person whose opinion matters more than it should. You already know what this means'
    ],
    action: 'stop explaining the feeling. just feel it for five minutes'
  },

  wands: {
    synthesis: [
      '{transiting_planet} hitting your {natal_planet} in {house_theme} - can\'t stop talking about this idea. Whether you act or not, the vision is forming',
      'Whatever {transiting_planet} is doing to your {natal_planet} around {house_theme} - that project file you keep opening. Send the email. Make the call. Start',
      '{transiting_planet} meeting your {natal_planet} in {house_theme} - doesn\'t wait for perfect conditions. The creative urge is burning. Move while it\'s alive'
    ],
    action: 'start. ten minutes on the thing you keep saying you\'ll do when you have more time'
  },

  pentacles: {
    synthesis: [
      '{transiting_planet} working on your {natal_planet} in {house_theme} - what\'s actually in your account, not what you wish was there. Check the numbers',
      'Whatever {transiting_planet} is activating in your {natal_planet} around {house_theme} - the thing you can hold. Finish the draft. Build the thing. Make it real',
      '{transiting_planet} meeting your {natal_planet} in {house_theme} - is there something physical to show for all this effort? Do the tangible thing'
    ],
    action: 'do the concrete physical thing. not the planning of it. the thing itself'
  }
};

export const keyPhraseTemplates = {
  challenging: ['the hard truth', 'what needed to break', 'clarity through breakdown', 'truth over comfort', 'the necessary ending'],
  neutral: ['the pause before motion', 'stillness teaches', 'between what was and what\'s next', 'listening in the quiet'],
  expansive: ['the door opening', 'hope based on truth', 'trust what\'s emerging', 'the moment opening', 'momentum building']
};

/**
 * Which transiting planets and aspects are most resonant for each card.
 * Used to weight transit selection toward the most thematically relevant transit.
 * planets: ordered by relevance (index 0 = strongest affinity)
 * aspects: aspect types that align with this card's energy
 */
export const cardPlanetAffinity: Record<string, { planets: string[]; aspects: string[] }> = {
  // Major Arcana
  'major-0':  { planets: ['uranus', 'jupiter'],           aspects: ['trine', 'sextile', 'conjunction'] },
  'major-1':  { planets: ['mercury', 'sun'],              aspects: ['conjunction', 'trine', 'sextile'] },
  'major-2':  { planets: ['moon', 'neptune'],             aspects: ['conjunction', 'trine', 'sextile'] },
  'major-3':  { planets: ['venus', 'moon'],               aspects: ['trine', 'sextile', 'conjunction'] },
  'major-4':  { planets: ['saturn', 'mars'],              aspects: ['conjunction', 'square', 'trine'] },
  'major-5':  { planets: ['saturn', 'jupiter'],           aspects: ['conjunction', 'square', 'opposition'] },
  'major-6':  { planets: ['venus', 'mercury'],            aspects: ['conjunction', 'trine', 'sextile'] },
  'major-7':  { planets: ['mars', 'sun'],                 aspects: ['conjunction', 'square', 'trine'] },
  'major-8':  { planets: ['sun', 'venus'],                aspects: ['trine', 'sextile', 'conjunction'] },
  'major-9':  { planets: ['saturn', 'mercury'],           aspects: ['conjunction', 'square', 'opposition'] },
  'major-10': { planets: ['jupiter', 'uranus'],           aspects: ['conjunction', 'trine', 'square', 'opposition', 'sextile'] },
  'major-11': { planets: ['saturn', 'venus'],             aspects: ['conjunction', 'square', 'opposition'] },
  'major-12': { planets: ['neptune', 'saturn'],           aspects: ['square', 'opposition', 'conjunction'] },
  'major-13': { planets: ['pluto', 'saturn'],             aspects: ['square', 'opposition', 'conjunction'] },
  'major-14': { planets: ['jupiter', 'moon'],             aspects: ['trine', 'sextile', 'conjunction'] },
  'major-15': { planets: ['pluto', 'saturn'],             aspects: ['square', 'opposition', 'conjunction'] },
  'major-16': { planets: ['uranus', 'pluto'],             aspects: ['square', 'opposition', 'conjunction'] },
  'major-17': { planets: ['neptune', 'venus'],            aspects: ['trine', 'sextile', 'conjunction'] },
  'major-18': { planets: ['neptune', 'moon'],             aspects: ['square', 'opposition', 'conjunction'] },
  'major-19': { planets: ['sun', 'jupiter'],              aspects: ['trine', 'sextile', 'conjunction'] },
  'major-20': { planets: ['pluto', 'uranus'],             aspects: ['conjunction', 'square', 'trine'] },
  'major-21': { planets: ['jupiter', 'saturn'],           aspects: ['trine', 'conjunction', 'sextile'] },

  // Cups (Moon / Venus / Neptune)
  'cups-1':      { planets: ['moon', 'neptune'],          aspects: ['conjunction', 'trine', 'sextile'] },
  'cups-2':      { planets: ['venus', 'moon'],            aspects: ['conjunction', 'trine', 'sextile'] },
  'cups-3':      { planets: ['venus', 'jupiter'],         aspects: ['trine', 'sextile', 'conjunction'] },
  'cups-4':      { planets: ['moon', 'neptune'],          aspects: ['square', 'opposition', 'conjunction'] },
  'cups-5':      { planets: ['moon', 'saturn'],           aspects: ['square', 'opposition', 'conjunction'] },
  'cups-6':      { planets: ['moon', 'venus'],            aspects: ['trine', 'sextile', 'conjunction'] },
  'cups-7':      { planets: ['neptune', 'moon'],          aspects: ['square', 'opposition', 'conjunction'] },
  'cups-8':      { planets: ['saturn', 'moon'],           aspects: ['square', 'opposition', 'conjunction'] },
  'cups-9':      { planets: ['venus', 'jupiter'],         aspects: ['trine', 'sextile', 'conjunction'] },
  'cups-10':     { planets: ['moon', 'venus'],            aspects: ['trine', 'sextile', 'conjunction'] },
  'cups-page':   { planets: ['moon', 'mercury'],          aspects: ['conjunction', 'trine', 'sextile'] },
  'cups-knight': { planets: ['venus', 'mars'],            aspects: ['trine', 'conjunction', 'sextile'] },
  'cups-queen':  { planets: ['moon', 'neptune'],          aspects: ['trine', 'conjunction', 'sextile'] },
  'cups-king':   { planets: ['moon', 'saturn'],           aspects: ['trine', 'conjunction', 'sextile'] },

  // Swords (Mercury / Saturn / Mars)
  'swords-1':      { planets: ['mercury', 'uranus'],      aspects: ['conjunction', 'trine', 'sextile'] },
  'swords-2':      { planets: ['mercury', 'saturn'],      aspects: ['square', 'opposition', 'conjunction'] },
  'swords-3':      { planets: ['saturn', 'mars'],         aspects: ['square', 'opposition', 'conjunction'] },
  'swords-4':      { planets: ['saturn', 'mercury'],      aspects: ['square', 'conjunction', 'opposition'] },
  'swords-5':      { planets: ['mars', 'saturn'],         aspects: ['square', 'opposition', 'conjunction'] },
  'swords-6':      { planets: ['mercury', 'saturn'],      aspects: ['trine', 'sextile', 'conjunction'] },
  'swords-7':      { planets: ['mercury', 'uranus'],      aspects: ['conjunction', 'square', 'trine', 'sextile', 'opposition'] },
  'swords-8':      { planets: ['saturn', 'mercury'],      aspects: ['square', 'opposition', 'conjunction'] },
  'swords-9':      { planets: ['saturn', 'mars'],         aspects: ['square', 'opposition', 'conjunction'] },
  'swords-10':     { planets: ['pluto', 'saturn'],        aspects: ['conjunction', 'square', 'opposition'] },
  'swords-page':   { planets: ['mercury', 'uranus'],      aspects: ['conjunction', 'trine', 'sextile'] },
  'swords-knight': { planets: ['mars', 'mercury'],        aspects: ['conjunction', 'square', 'trine'] },
  'swords-queen':  { planets: ['saturn', 'mercury'],      aspects: ['conjunction', 'square', 'trine'] },
  'swords-king':   { planets: ['saturn', 'mercury'],      aspects: ['conjunction', 'trine', 'sextile'] },

  // Wands (Mars / Jupiter / Sun)
  'wands-1':      { planets: ['mars', 'sun'],             aspects: ['conjunction', 'trine', 'sextile'] },
  'wands-2':      { planets: ['jupiter', 'mars'],         aspects: ['conjunction', 'trine', 'sextile'] },
  'wands-3':      { planets: ['jupiter', 'sun'],          aspects: ['trine', 'sextile', 'conjunction'] },
  'wands-4':      { planets: ['jupiter', 'venus'],        aspects: ['trine', 'sextile', 'conjunction'] },
  'wands-5':      { planets: ['mars', 'uranus'],          aspects: ['square', 'opposition', 'conjunction'] },
  'wands-6':      { planets: ['sun', 'jupiter'],          aspects: ['trine', 'conjunction', 'sextile'] },
  'wands-7':      { planets: ['mars', 'saturn'],          aspects: ['square', 'opposition', 'conjunction'] },
  'wands-8':      { planets: ['mars', 'mercury'],         aspects: ['conjunction', 'trine', 'sextile'] },
  'wands-9':      { planets: ['mars', 'saturn'],          aspects: ['square', 'opposition', 'conjunction'] },
  'wands-10':     { planets: ['saturn', 'mars'],          aspects: ['square', 'conjunction', 'opposition'] },
  'wands-page':   { planets: ['mars', 'mercury'],         aspects: ['conjunction', 'trine', 'sextile'] },
  'wands-knight': { planets: ['mars', 'uranus'],          aspects: ['conjunction', 'square', 'trine'] },
  'wands-queen':  { planets: ['sun', 'mars'],             aspects: ['trine', 'conjunction', 'sextile'] },
  'wands-king':   { planets: ['sun', 'jupiter'],          aspects: ['conjunction', 'trine', 'sextile'] },

  // Pentacles (Saturn / Venus / Jupiter)
  'pentacles-1':      { planets: ['saturn', 'venus'],     aspects: ['conjunction', 'trine', 'sextile'] },
  'pentacles-2':      { planets: ['saturn', 'mercury'],   aspects: ['square', 'conjunction', 'opposition'] },
  'pentacles-3':      { planets: ['saturn', 'jupiter'],   aspects: ['trine', 'conjunction', 'sextile'] },
  'pentacles-4':      { planets: ['saturn', 'venus'],     aspects: ['square', 'conjunction', 'opposition'] },
  'pentacles-5':      { planets: ['saturn', 'mars'],      aspects: ['square', 'opposition', 'conjunction'] },
  'pentacles-6':      { planets: ['venus', 'jupiter'],    aspects: ['trine', 'sextile', 'conjunction'] },
  'pentacles-7':      { planets: ['saturn', 'jupiter'],   aspects: ['square', 'conjunction', 'trine'] },
  'pentacles-8':      { planets: ['saturn', 'mercury'],   aspects: ['conjunction', 'trine', 'square'] },
  'pentacles-9':      { planets: ['venus', 'jupiter'],    aspects: ['trine', 'sextile', 'conjunction'] },
  'pentacles-10':     { planets: ['saturn', 'jupiter'],   aspects: ['trine', 'conjunction', 'sextile'] },
  'pentacles-page':   { planets: ['saturn', 'mercury'],   aspects: ['conjunction', 'trine', 'sextile'] },
  'pentacles-knight': { planets: ['saturn', 'mars'],      aspects: ['conjunction', 'trine', 'square'] },
  'pentacles-queen':  { planets: ['venus', 'saturn'],     aspects: ['trine', 'conjunction', 'sextile'] },
  'pentacles-king':   { planets: ['saturn', 'jupiter'],   aspects: ['trine', 'conjunction', 'sextile'] },
};

/**
 * Transit action modifiers — appended to the card's action to ground it in the transit's energy.
 * Keyed by transiting planet → aspect tone.
 */
export const transitActionModifiers: Record<string, { challenging: string; neutral: string; expansive: string }> = {
  saturn: {
    challenging: 'write it down and put a date on it. saturn wants the commitment real',
    neutral:     'make it concrete. one step you can actually do today',
    expansive:   'build the structure around this so it lasts'
  },
  jupiter: {
    challenging: 'check where you\'re overextending. generosity without limits isn\'t generosity',
    neutral:     'say yes to the bigger version of this',
    expansive:   'act on the expansion. the opening is genuine'
  },
  uranus: {
    challenging: 'break the pattern deliberately. do it differently than you normally would',
    neutral:     'try something you wouldn\'t normally do here',
    expansive:   'follow the unexpected impulse. that disruption is the message'
  },
  neptune: {
    challenging: 'check what\'s real vs what you\'re projecting before you act',
    neutral:     'spend time near water or in quiet. let the answer surface',
    expansive:   'trust the intuition completely. logic won\'t get you there'
  },
  pluto: {
    challenging: 'go to the root, not the surface. the real thing is underneath',
    neutral:     'go one layer deeper than you\'d normally let yourself',
    expansive:   'let the transformation happen instead of managing it'
  },
  mars: {
    challenging: 'channel it into one clear action instead of scattering the energy',
    neutral:     'move your body first. the clarity will follow',
    expansive:   'act while the energy is live. it won\'t wait'
  }
};
