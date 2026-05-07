"use client";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

type Word = { start: number; end: number; text: string };
type Sentence = { start: number; end: number; words: Word[] };

function tsToSeconds(ts: string): number {
  const [hms, ms = "0"] = ts.split(".");
  const parts = hms.split(":").map(Number);
  let h = 0, m = 0, s = 0;
  if (parts.length === 3) [h, m, s] = parts;
  else if (parts.length === 2) [m, s] = parts;
  else[s] = parts;
  return h * 3600 + m * 60 + s + Number(`0.${ms}`);
}

function parseWordVtt(text: string): Word[] {
  const blocks = text.replace(/\r/g, "").split(/\n\n+/);
  const words: Word[] = [];
  for (const block of blocks) {
    const lines = block.split("\n").filter(Boolean);
    const timing = lines.find((l) => l.includes("-->"));
    if (!timing) continue;
    const m = timing.match(/([\d:.]+)\s*-->\s*([\d:.]+)/);
    if (!m) continue;
    const idx = lines.indexOf(timing);
    const raw = lines.slice(idx + 1).join(" ").trim();
    if (!raw) continue;
    words.push({ start: tsToSeconds(m[1]), end: tsToSeconds(m[2]), text: raw });
  }
  return words;
}

const SENTENCE_END = /[.!?]["')\]]?$/;
const MAX_WORDS = 14;
const MAX_GAP = 1.6;

function groupIntoSentences(words: Word[]): Sentence[] {
  const sentences: Sentence[] = [];
  let buf: Word[] = [];
  const flush = () => {
    if (!buf.length) return;
    sentences.push({ start: buf[0].start, end: buf[buf.length - 1].end, words: buf });
    buf = [];
  };
  for (let i = 0; i < words.length; i++) {
    const w = words[i];
    const prev = buf[buf.length - 1];
    const gap = prev ? w.start - prev.end : 0;
    buf.push(w);
    const endsSentence = SENTENCE_END.test(w.text);
    if (endsSentence || buf.length >= MAX_WORDS || gap > MAX_GAP) flush();
  }
  flush();
  return sentences;
}

export default function SyncedCaption({ currentTime }: { currentTime: number }) {
  const [words, setWords] = useState<Word[]>([]);

  useEffect(() => {
    let mounted = true;
    fetch("/words.vtt")
      .then((r) => r.text())
      .then((t) => mounted && setWords(parseWordVtt(t)))
      .catch(() => { });
    return () => {
      mounted = false;
    };
  }, []);

  const sentences = useMemo(() => groupIntoSentences(words), [words]);

  const sentenceIndex = useMemo(() => {
    if (!sentences.length) return -1;
    let last = -1;
    for (let i = 0; i < sentences.length; i++) {
      if (sentences[i].start <= currentTime + 0.05) last = i;
      else break;
    }
    return last;
  }, [sentences, currentTime]);

  const active = sentenceIndex >= 0 ? sentences[sentenceIndex] : null;
  const idle = currentTime === 0 || !active;

  return (
    <section
      className="mx-auto mt-10 mb-8 px-6 text-center"
      style={{ maxWidth: "min(680px, calc(100vw - 1.5rem))" }}
    >
      <div className="relative min-h-[5.5rem] md:min-h-[6.5rem]">
        <AnimatePresence mode="wait">
          {idle ? (
            <motion.p
              key="idle"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.5 }}
              className="font-serif italic text-ink/60 text-lg md:text-xl"
            >
              Press play.
            </motion.p>
          ) : (
            <motion.p
              key={sentenceIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="font-script text-balance leading-snug"
              style={{ fontSize: "clamp(1.5rem, 5vw, 2.2rem)" }}
            >
              {active!.words.map((w, i) => {
                const cleaned = w.text.replace(/^[\s\-–]+/, "");
                const spoken = currentTime >= w.start - 0.02;
                const isCurrent =
                  currentTime >= w.start - 0.02 && currentTime < w.end + 0.05;
                return (
                  <span
                    key={i}
                    className="inline-block transition-colors duration-200"
                    style={{
                      color: isCurrent
                        ? "#A85C5C"
                        : spoken
                          ? "#3A2E2A"
                          : "rgba(58,46,42,0.28)",
                      textShadow: isCurrent ? "0 0 14px rgba(201,165,91,0.35)" : "none",
                    }}
                  >
                    {cleaned}
                    {i < active!.words.length - 1 ? " " : ""}
                  </span>
                );
              })}
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {sentences.length > 0 && (
        <div className="mt-6 flex items-center justify-center gap-2">
          {Array.from({ length: 12 }).map((_, i) => {
            const filled =
              sentenceIndex >= 0 && i / 12 <= sentenceIndex / sentences.length;
            return (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full transition-colors duration-500 ${filled ? "bg-rose" : "bg-rose/20"
                  }`}
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
