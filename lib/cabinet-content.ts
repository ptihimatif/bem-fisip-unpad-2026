export type ContentCard = { title: string; description: string };
export type VisionHighlight = { phrase: string; description: string };

/** Highlight only explicitly modeled phrases; preserve every character of the sentence. */
export function visionParts(sentence: string, highlights: VisionHighlight[]) {
  const matches = highlights.map((item, term) => ({ index: sentence.indexOf(item.phrase), length: item.phrase.length, term }))
    .filter((item) => item.index >= 0 && item.length > 0).sort((a, b) => a.index - b.index);
  const parts: { text: string; term: number }[] = [];
  let position = 0;
  for (const item of matches) {
    if (item.index < position) continue;
    if (item.index > position) parts.push({ text: sentence.slice(position, item.index), term: -1 });
    parts.push({ text: sentence.slice(item.index, item.index + item.length), term: item.term });
    position = item.index + item.length;
  }
  if (position < sentence.length) parts.push({ text: sentence.slice(position), term: -1 });
  return parts;
}
