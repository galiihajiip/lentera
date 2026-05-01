/**
 * Deteksi bahasa sederhana berdasarkan kata-kata umum.
 * Default: Indonesian jika tidak terdeteksi.
 */
export function detectLanguageHint(text: string): string {
  const lower = text.toLowerCase()
  const tokens = lower.split(/\s+/)

  const langPatterns: Record<string, string[]> = {
    Indonesian: ['yang', 'adalah', 'dan', 'untuk', 'ini', 'itu', 'dari', 'dengan', 'pada', 'tidak', 'juga', 'akan', 'bisa', 'harus', 'dapat', 'telah', 'sudah', 'masih', 'seperti', 'oleh'],
    English: ['the', 'is', 'are', 'was', 'were', 'have', 'has', 'been', 'will', 'would', 'could', 'should', 'this', 'that', 'with', 'from', 'they', 'their', 'which', 'about'],
    Malay: ['ialah', 'tetapi', 'kerana', 'serta', 'bagi', 'oleh', 'sahaja', 'iaitu', 'pula', 'telah'],
  }

  let bestLang = 'Indonesian'
  let bestScore = 0

  for (const [lang, words] of Object.entries(langPatterns)) {
    const score = tokens.filter((t) => words.includes(t)).length / tokens.length
    if (score > bestScore) {
      bestScore = score
      bestLang = lang
    }
  }

  return bestLang
}
