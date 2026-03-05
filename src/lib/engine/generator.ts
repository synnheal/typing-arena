import { COMMON_WORDS_EN, SENTENCES_EN } from "@/lib/data/corpus-en";
import { COMMON_WORDS_FR, SENTENCES_FR } from "@/lib/data/corpus-fr";

type Mode = "words" | "sentences";
type Language = "en" | "fr";

function shuffle<T>(arr: T[]): T[] {
  const result = [...arr];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function getWordList(language: Language): string[] {
  return language === "fr" ? COMMON_WORDS_FR : COMMON_WORDS_EN;
}

function getSentenceList(language: Language): string[] {
  return language === "fr" ? SENTENCES_FR : SENTENCES_EN;
}

export function generateText(
  mode: Mode,
  language: Language,
  wordCount = 50
): string {
  if (mode === "sentences") {
    const sentences = shuffle(getSentenceList(language));
    let result = "";
    let i = 0;
    while (result.split(" ").length < wordCount && i < sentences.length) {
      result += (result ? " " : "") + sentences[i];
      i++;
    }
    return result;
  }

  const words = getWordList(language);
  return shuffle(words).slice(0, wordCount).join(" ");
}

export function generateDrillText(
  targetLetters: string[],
  language: Language,
  wordCount = 30
): string {
  const words = getWordList(language);
  const filtered = words.filter((w) =>
    targetLetters.some((l) => w.toLowerCase().includes(l.toLowerCase()))
  );
  const pool = filtered.length >= wordCount ? filtered : [...filtered, ...words];
  return shuffle(pool).slice(0, wordCount).join(" ");
}
