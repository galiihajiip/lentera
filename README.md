# LENTERA

**Platform Pembelajaran Multi-Sensori Adaptif Berbasis AI & Lensa Budaya untuk Mitigasi Stres Akademik.**

LENTERA membantu pelajar belajar lewat 85+ lensa budaya Nusantara — dari Sabang sampai Merauke — dengan dukungan AI multimodal (teks, gambar, audio), penyederhanaan teks ramah disleksia, glosarium dwibahasa, dan kuis adaptif.

---

## Tech Stack

- **Next.js 16** (App Router) + **TypeScript 5**
- **React 19**
- **Tailwind CSS v4** dengan palette LENTERA strict
- **Zustand v5** (state management)
- **`@google/genai`** (Gemini SDK)
- **`@ducanh2912/next-pwa` v10** (PWA + Workbox)
- **`lucide-react`** (icon set)

## Aturan Project

Sebelum kontribusi, **WAJIB baca `AGENTS.md`**. Aturan utamanya:

1. **Konteks budaya 100% Indonesia** (Sabang–Merauke). Tidak ada lensa internasional.
2. **Bahasa UI**: Bahasa Indonesia.
3. **Palette ketat**: hanya warna `lentera-*` dari `tailwind.config.ts`. Warna `#facc15` HANYA untuk word-highlight TTS (aksesibilitas disleksia).
4. **Build**: `npm run build` pakai `--webpack` (PWA butuh `workbox-webpack-plugin`).
5. **Auto-push** setiap commit ke `main`.

## Setup

```bash
# Install deps
npm install

# Environment (isi GEMINI_API_KEY)
cp .env.local.example .env.local   # lalu edit

# Dev (Turbopack, PWA disabled di dev)
npm run dev

# Build production (Webpack, generate Service Worker)
npm run build && npm start
```

Buka `http://localhost:3000` untuk melihat aplikasi.

## Struktur Folder

```
lentera/
├── public/
│   ├── icons/          ← icon PWA (192, 512, apple-touch)
│   ├── images/         ← aset gambar UI
│   └── manifest.json   ← PWA manifest
├── scripts/
│   └── make_placeholder_icons.py   ← regen icon: uv run scripts/make_placeholder_icons.py
├── src/
│   ├── app/            ← App Router (page, layout, globals.css)
│   ├── types/          ← LensType, ResultData, QuizItem, dll.
│   ├── store/          ← Zustand store (BLOK 2)
│   ├── components/     ← UI components (BLOK selanjutnya)
│   ├── hooks/          ← custom hooks
│   └── lib/            ← util, gemini client
├── tailwind.config.ts  ← palette LENTERA
├── next.config.ts      ← PWA wrapper + serverActions 10mb
├── AGENTS.md           ← aturan project (WAJIB baca)
└── .env.local          ← GEMINI_API_KEY (jangan commit)
```

## Lensa Budaya (`LensType`)

85 lensa budaya Nusantara, urut barat → timur:

| Region | Jumlah | Contoh |
|--------|-------:|--------|
| Sumatera | 16 | Aceh, Batak Toba/Karo/Mandailing, Minang, Lampung, Nias, Mentawai, … |
| Jawa | 10 | Mataraman, Banyumasan, Sunda, Cirebon, Betawi, Madura, Tengger, Osing, Baduy, Samin |
| Bali & Nusa Tenggara | 14 | Bali, Bali Aga, Sasak, Sumbawa, Bima, Manggarai, Sumba, Rote, Atoni Dawan, Lamaholot, … |
| Kalimantan | 11 | Dayak Kenyah/Iban/Ngaju/Punan/Kayan/Benuaq, Banjar, Kutai, Paser, … |
| Sulawesi | 13 | Bugis, Makassar, Mandar, Toraja, Minahasa, Sangir-Talaud, Gorontalo, Buton, … |
| Maluku | 8 | Ambon, Seram, Kei, Tanimbar, Aru, Ternate, Tidore, Tobelo-Galela |
| Papua | 13 | Asmat, Dani, Lani, Yali, Mee, Amungme, Korowai, Marind, Sentani, Biak, Arfak, Moi, … |

Detail di `src/types/index.ts`.

## Skrip Penting

| Skrip | Fungsi |
|-------|--------|
| `npm run dev` | Dev server (Turbopack, PWA off) |
| `npm run build` | Build production (Webpack, PWA on, SW di-generate) |
| `npm start` | Jalankan build production |
| `npm run lint` | ESLint |
| `uv run scripts/make_placeholder_icons.py` | Regenerate icon LENTERA |

## License

Proprietary. © 2026 LENTERA project. All rights reserved.
