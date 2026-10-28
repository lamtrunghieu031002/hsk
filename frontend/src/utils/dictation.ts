export type DiffToken = { char: string; status: 'correct' | 'missing' | 'extra' };

export interface ScoreResult {
  answerTokens: DiffToken[];
  typedTokens: DiffToken[];
  score: number;
  correctCount: number;
  totalCount: number;
}

export interface Segment {
  id: number;
  text: string;
  startTime?: number; // seconds
}

export function isCJK(c: string): boolean {
  return c >= '一' && c <= '鿿';
}

export function cjkCount(s: string): number {
  return [...s].filter(isCJK).length;
}

export function computeDiff(typed: string, answer: string): ScoreResult {
  const t = [...typed].filter(isCJK);
  const a = [...answer].filter(isCJK);
  const m = t.length, n = a.length;

  const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = t[i - 1] === a[j - 1]
        ? dp[i - 1][j - 1] + 1
        : Math.max(dp[i - 1][j], dp[i][j - 1]);

  const answerTokens: DiffToken[] = [];
  const typedTokens: DiffToken[] = [];
  let i = m, j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && t[i - 1] === a[j - 1]) {
      answerTokens.unshift({ char: a[j - 1], status: 'correct' });
      typedTokens.unshift({ char: t[i - 1], status: 'correct' });
      i--; j--;
    } else if (j > 0 && (i === 0 || dp[i][j - 1] >= dp[i - 1][j])) {
      answerTokens.unshift({ char: a[j - 1], status: 'missing' });
      j--;
    } else {
      typedTokens.unshift({ char: t[i - 1], status: 'extra' });
      i--;
    }
  }

  const correctCount = answerTokens.filter(tk => tk.status === 'correct').length;
  const score = n > 0 ? Math.round((correctCount / n) * 100) : 0;
  return { answerTokens, typedTokens, score, correctCount, totalCount: n };
}

// Parse a pasted transcript into segments.
// Supports: plain text, newline-per-sentence, [mm:ss] or mm:ss timestamps.
// Long clauses separated by ，are further split when > MAX_CLAUSE chars.
const MAX_CLAUSE = 20; // split at ， if segment exceeds this many CJK chars

export function parseTranscript(raw: string): Segment[] {
  const TIME_RE = /^\[?(\d{1,2}):(\d{2})(?:,\d+)?\]?\s*/;
  const SRT_INDEX_RE = /^\d+$/;
  const segments: Segment[] = [];
  let id = 0;

  const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(l => l && !SRT_INDEX_RE.test(l));

  for (const line of lines) {
    let startTime: number | undefined;
    let text = line;

    const tm = line.match(TIME_RE);
    if (tm) {
      startTime = parseInt(tm[1]) * 60 + parseInt(tm[2]);
      text = line.replace(TIME_RE, '').trim();
    }

    // Skip lines with no Chinese
    if (!/[一-鿿]/.test(text)) continue;

    // Split by hard sentence-ending punctuation first
    const sentences = text
      .split(/(?<=[。！？…⋯])/)
      .map(s => s.trim())
      .filter(s => /[一-鿿]/.test(s));

    let firstInLine = true;
    for (const sent of sentences) {
      // Optionally split long sentences at ，
      const clauses = cjkCount(sent) > MAX_CLAUSE
        ? sent.split(/(?<=，)/).map(c => c.trim()).filter(c => /[一-鿿]/.test(c))
        : [sent];

      for (const clause of clauses) {
        segments.push({
          id: id++,
          text: clause,
          startTime: firstInLine ? startTime : undefined,
        });
        firstInLine = false;
      }
    }
  }

  return segments;
}

export function formatTime(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

// Estimate TTS duration in seconds for a Chinese text
export function estimateDuration(text: string, rate = 0.85): number {
  const chars = cjkCount(text);
  return Math.max(2, (chars / 3.5) / rate + 0.8);
}

// Play TTS with a callback when finished; returns a cancel fn.
// Nulls out onend before cancel so Chrome doesn't fire the callback
// after a manual stop (Chrome bug: cancel() can still trigger onend).
export function speakSegment(
  text: string,
  rate: number,
  onEnd?: () => void
): () => void {
  window.speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = 'zh-CN';
  u.rate = rate;
  u.pitch = 1.0;
  const voices = window.speechSynthesis.getVoices();
  const v = voices.find(v => v.lang === 'zh-CN') || voices.find(v => v.lang.startsWith('zh'));
  if (v) u.voice = v;
  if (onEnd) u.onend = onEnd;
  // Small delay so the previous cancel() has time to flush (Chrome quirk)
  setTimeout(() => window.speechSynthesis.speak(u), 80);
  return () => {
    u.onend = null;   // prevent stale onEnd firing after cancel
    u.onerror = null;
    window.speechSynthesis.cancel();
  };
}
