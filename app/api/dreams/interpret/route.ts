import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

export type ReadingLength = 'short' | 'medium' | 'long';

interface InterpretRequest {
  text: string;
  readingLength?: ReadingLength;
  symbolCount?: number;
}

interface InterpretResult {
  reading: string;
  symbols: { name: string; note: string }[];
  actions: { do: string; why: string }[];
}

const WORD_RANGES: Record<ReadingLength, string> = {
  short: '70-100',
  medium: '150-200',
  long: '260-320',
};

/**
 * Ported from Dream Interpreter v3.dc.html — same register, same JSON
 * contract. Lowercase and British spelling are stated explicitly rather than
 * left to house style, since this is the only place in slow-garden that
 * writes prose without a human editing it afterwards.
 */
function buildSystemPrompt(words: string, max: number): string {
  return (
    'You interpret dreams plainly. Register: clinical, unmystical, matter-of-fact, a careful reader, not an oracle. ' +
    'No mysticism, no prophecy, no destiny, no reassurance padding. Never claim certainty; say what the dream is ' +
    'organised around and what it plausibly tracks in waking life. Plain sentences that are easy to follow on a ' +
    'first read. No markdown, no headings, no lists, no em dashes. Write entirely in lowercase, including the ' +
    'start of sentences and paragraphs. Use British English spelling throughout (organised, colour, behaviour, ' +
    'realise, and so on). Return ONLY valid JSON, no code fence: {"reading": string with ' +
    words +
    ' words across 2-3 paragraphs separated by \\n, "symbols": [{"name": short label, "note": one sentence on ' +
    'what it appears to be doing in THIS dream}] with at most ' +
    max +
    ' entries drawn from the dream itself, "actions": [{"do": imperative sentence of at most 14 words naming one ' +
    'specific thing to do in waking life, "why": one short sentence tying it to the dream}] with exactly 3 ' +
    'entries}. The actions are the point of the whole response: each must be small, concrete, and doable this ' +
    'week by one person alone (a conversation to have, a question to ask someone specific, a decision to write ' +
    'down, a thing to stop doing, a fifteen-minute task). No journaling prompts unless the dream is genuinely ' +
    'about memory, no meditation, no self-care advice, no therapy referrals, no vague verbs like reflect, ' +
    'explore, sit with, honour, or consider. If a dream supports no concrete action, name the one piece of ' +
    'information the person is missing and how to get it.'
  );
}

export async function POST(request: Request) {
  const apiKey = process.env.SLOW_GARDEN_ANTHROPIC_KEY;
  if (!apiKey) {
    console.error('SLOW_GARDEN_ANTHROPIC_KEY not set');
    return NextResponse.json({ error: 'reading didn’t come back. try again.' }, { status: 500 });
  }

  let body: InterpretRequest;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'not enough to go on. a few sentences.' }, { status: 400 });
  }

  const text = typeof body.text === 'string' ? body.text.trim() : '';
  if (text.length < 12) {
    return NextResponse.json({ error: 'not enough to go on. a few sentences.' }, { status: 400 });
  }

  const readingLength: ReadingLength = body.readingLength ?? 'medium';
  const words = WORD_RANGES[readingLength] ?? WORD_RANGES.medium;
  const max = typeof body.symbolCount === 'number' ? body.symbolCount : 4;

  const anthropic = new Anthropic({ apiKey });

  try {
    const response = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1600,
      system: buildSystemPrompt(words, max),
      messages: [{ role: 'user', content: 'Dream:\n\n' + text }],
    });

    const raw = response.content
      .map((block) => (block.type === 'text' ? block.text : ''))
      .join('');

    const match = raw.match(/\{[\s\S]*\}/);
    const data = JSON.parse(match ? match[0] : raw);

    const result: InterpretResult = {
      reading: typeof data.reading === 'string' ? data.reading : String(raw),
      symbols: Array.isArray(data.symbols)
        ? data.symbols.filter((s: { name?: unknown }) => s && s.name).slice(0, max)
        : [],
      actions: Array.isArray(data.actions)
        ? data.actions.filter((a: { do?: unknown }) => a && a.do).slice(0, 4)
        : [],
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Dream interpretation failed:', error);
    return NextResponse.json({ error: 'reading didn’t come back. try again.' }, { status: 502 });
  }
}
