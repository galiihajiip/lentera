/**
 * Validasi environment variables yang dibutuhkan.
 * Panggil di API routes sebelum menggunakan env vars.
 */
export function validateEnv() {
  const required = ['GEMINI_API_KEY']
  const missing = required.filter((key) => !process.env[key])

  if (missing.length > 0) {
    throw new Error(
      `Environment variable berikut belum di-set: ${missing.join(', ')}. ` +
      `Buat file .env.local dan tambahkan variabel yang dibutuhkan.`
    )
  }
}

export function getGeminiApiKey(): string {
  const key = process.env.GEMINI_API_KEY
  if (!key) {
    throw new Error('GEMINI_API_KEY tidak ditemukan. Tambahkan di file .env.local')
  }
  return key
}
