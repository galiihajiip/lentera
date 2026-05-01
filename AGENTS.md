# LENTERA — Catatan untuk Agent (Devin / Cursor / Claude / dst.)

Project: **LENTERA** — Platform Pembelajaran Multi-Sensori Adaptif Berbasis AI & Lensa Budaya.
Repo: https://github.com/galiihajiip/lentera

Dokumen ini WAJIB dibaca oleh setiap agent sebelum mengerjakan tugas di repo ini.
Berisi aturan keras (hard rules) yang berlaku ke seluruh kode dan dokumen di proyek.

---

## 1. Aturan Bahasa & Budaya (HARD RULE)

- **Konteks budaya WAJIB Indonesia** — Sabang sampai Merauke. Tidak ada lensa
  budaya internasional (Jepang, Korea, Barat, dll) di proyek ini.
- Setiap kali muncul referensi budaya:
  - Jika non-Indonesia, ubah ke padanan Indonesia (mis. "ramen" → "soto",
    "K-pop" → "dangdut/koplo", "samurai" → "silat/keris", dll).
  - Pakai contoh autentik per region: Jawa = gamelan/wayang, Sunda = angklung,
    Minang = rendang/rumah gadang, Bali = kecak/pura, Toraja = tongkonan,
    Papua = honai/noken, dst.
- Bahasa default UI dan copywriting: **Bahasa Indonesia**.
- `LensType` di `src/types/index.ts` adalah satu-satunya sumber kebenaran daftar
  lensa budaya. Setiap tambahan harus suku/budaya/sub-budaya Indonesia yang
  autentik dan terdokumentasi (BPS, Kemendikbud, atau referensi etnografi).

Jika ada prompt/pengguna meminta menambahkan budaya non-Indonesia, agent harus
**menolak halus dan menawarkan padanan Indonesia**.

---

## 2. Workflow Git

- **Commit + auto-push** setelah setiap perubahan logis (per "prompt"/per fitur).
  User pernah komplain "kok repo nya gak terupdate" — jangan ulangi.
  Default flow: `git add … && git commit -m "…" && git push origin main`.
- Branch utama: `main`. Tidak ada PR/branch kerja kecuali user minta.
- Format pesan commit:
  - Judul singkat dalam Bahasa Indonesia (`feat:`, `fix:`, `chore:`, dst.).
  - Body opsional (Bahasa Indonesia) menjelaskan deviasi atau alasan.
  - WAJIB ada footer:
    ```
    Generated with [Devin](https://cli.devin.ai/docs)

    Co-Authored-By: Devin <158243242+devin-ai-integration[bot]@users.noreply.github.com>
    ```
- JANGAN `git push --force` atau rewrite history tanpa izin eksplisit.
- JANGAN ubah `git config user.*`.

---

## 3. Tech Stack & Catatan Khusus

| Kategori | Pilihan | Catatan |
|----------|---------|---------|
| Framework | Next.js 16.2.4 (App Router) | dipasang via `create-next-app@latest`, bukan v15 |
| React | 19.2.4 | |
| Bahasa | TypeScript 5 | strict mode aktif |
| Styling | Tailwind CSS v4 + `@tailwindcss/postcss` | bukan v3 |
| State | Zustand v5 | |
| Icon | `lucide-react` | |
| LLM SDK | `@google/genai` (Gemini) | |
| PWA | `@ducanh2912/next-pwa` v10 | butuh webpack, bukan Turbopack |

### 3.1 Tailwind v4 (PENTING)

- Tailwind v4 **tidak auto-discover** `tailwind.config.ts`.
- Karena itu `src/app/globals.css` punya baris:
  ```css
  @import "tailwindcss";
  @config "../../tailwind.config.ts";
  ```
- JANGAN hapus baris `@config` — tanpa itu, semua class `bg-lentera-*`,
  `text-lentera-*`, `animate-fade-up`, `rounded-lentera-*` akan mati.
- Palette LENTERA strict: hanya warna dengan prefix `lentera-` yang dipakai
  selain util Tailwind built-in. JANGAN tambah warna baru tanpa update
  `tailwind.config.ts`.
- Warna `#facc15` (lentera-highlight) **HANYA untuk word-highlight TTS**
  (aksesibilitas disleksia), bukan untuk dekorasi umum.

### 3.2 next-pwa v10

- API v10 berbeda dari v8/9: `skipWaiting` ada di
  `workboxOptions.skipWaiting`, bukan top-level. JANGAN pindah ke top-level
  walau dokumen lama menulis demikian.
- `next.config.ts` punya `turbopack: {}` untuk silence warning di dev (PWA
  disabled di dev). JANGAN hapus.
- `npm run build` WAJIB pakai `--webpack` (sudah di-set di `package.json`)
  karena `workbox-webpack-plugin` tidak punya implementasi Turbopack.
- Service worker (`public/sw.js`, `public/workbox-*.js`) di-generate saat
  build dan sudah di-`.gitignore`.

### 3.3 Server Actions

- `experimental.serverActions.bodySizeLimit = '10mb'` agar bisa upload
  gambar/audio multimodal ke Gemini. Warning "Experiments (use with caution)"
  bisa diabaikan — fitur stabil, hanya sub-option-nya yang masih experimental.

### 3.4 ESM Project (`"type": "module"`)

- `package.json` punya `"type": "module"` agar `tailwind.config.ts` & file
  config lain di-parse sebagai ESM tanpa Node warning
  `MODULE_TYPELESS_PACKAGE_JSON`. Jangan hapus.
- Semua config baru WAJIB pakai sintaks ESM (`import`/`export`), bukan
  `require`/`module.exports`. File `.mjs` boleh; file `.cjs` hanya kalau
  benar-benar perlu CommonJS.

### 3.5 Vulnerability `npm audit` (Diterima Sementara)

`npm audit` melaporkan 7 vulnerability (5 high, 2 moderate) yang **semuanya
berasal dari sub-deps `@ducanh2912/next-pwa`**:

- `serialize-javascript ≤ 7.0.4` (high) → di `workbox-webpack-plugin`
- `postcss < 8.5.10` (moderate) → di Next.js dependency tree
- `@rollup/plugin-terser` → di `workbox-build`

**Mengapa tidak di-fix:** `npm audit fix --force` akan mendowngrade
Next.js ke 9.x (breaking) atau mengganti library PWA. Tidak ada patch
upstream yang aman saat ini. Risiko praktis untuk LENTERA rendah karena:

1. `serialize-javascript` hanya dipakai di build-time (Workbox), bukan runtime.
2. `postcss` hanya dipakai di build-time.
3. Tidak ada user input yang mengalir ke library yang vulnerable.

Re-evaluasi setiap kali `@ducanh2912/next-pwa` rilis versi baru (sekarang
10.2.9, latest). Catat tanggal review terakhir di sini:

- **Last reviewed:** 2026-05-01 — dipertahankan, tidak ada patch upstream.

---

## 4. Struktur Folder

```
lentera/
├── public/
│   ├── icons/
│   │   ├── icon-192.png           ← PWA, maskable safe-zone benar
│   │   ├── icon-512.png           ← PWA, maskable safe-zone benar
│   │   ├── icon-source-1024.png   ← sumber render high-res
│   │   └── apple-touch-icon.png   ← iOS Add-to-Home-Screen 180x180
│   ├── images/                    ← aset gambar UI (.gitkeep)
│   ├── manifest.json              ← PWA manifest (LENTERA brand)
│   └── (sw.js, workbox-*.js)      ← di-generate saat build, di-.gitignore
├── scripts/
│   └── make_placeholder_icons.py  ← regen icon LENTERA: `uv run scripts/make_placeholder_icons.py`
├── src/
│   ├── app/
│   │   ├── layout.tsx             ← root layout (BLOK 2 akan revamp)
│   │   ├── page.tsx               ← halaman utama
│   │   ├── globals.css            ← Tailwind v4 + LENTERA utilities
│   │   ├── favicon.ico            ← multi-size 16/32/48/64/128/256
│   │   ├── robots.ts              ← /robots.txt (App Router metadata route)
│   │   └── sitemap.ts             ← /sitemap.xml
│   ├── types/                     ← LensType (85 budaya), ResultData, dll.
│   ├── components/                ← UI components (.gitkeep, akan diisi)
│   ├── store/                     ← Zustand store (.gitkeep, BLOK 2)
│   ├── hooks/                     ← custom hooks (.gitkeep)
│   └── lib/                       ← util, gemini client (.gitkeep)
├── tailwind.config.ts             ← palette LENTERA, fonts, keyframes
├── next.config.ts                 ← PWA wrapper + serverActions + turbopack:{}
├── package.json                   ← "type": "module"
├── README.md                      ← branding LENTERA
├── AGENTS.md                      ← dokumen ini
├── .env.local                     ← GEMINI_API_KEY (jangan commit)
└── .env.local.example             ← template untuk dev baru
```

### 4.1 Konvensi tambahan

- **`.gitkeep`** dipakai di folder kosong (`src/store/`, `src/lib/`,
  `src/components/`, `src/hooks/`, `public/images/`). Hapus saat ada file
  pertama di folder tersebut.
- **Base URL** untuk robots/sitemap: `process.env.NEXT_PUBLIC_SITE_URL`
  (fallback `http://localhost:3000` di dev).
- **Icons baru**: tambah ke `public/icons/` lalu update referensi di
  `manifest.json` & metadata. Semua icon LENTERA dihasilkan dari
  `scripts/make_placeholder_icons.py` (jangan edit manual; edit script lalu
  re-run).

---

## 5. Verifikasi Sebelum Commit

Untuk perubahan yang menyentuh kode, jalankan minimal:

```bash
cd lentera
npm run build      # webpack build, generate SW, TS check
```

Untuk perubahan kecil (CSS, dokumen), `npm run dev` cukup untuk smoke test.

Jika TypeScript error, JANGAN commit. Perbaiki dulu.

---

## 6. Hal yang TIDAK Boleh Dilakukan

- Tidak boleh menambah library/dependency baru tanpa konfirmasi user.
- Tidak boleh ubah palette warna LENTERA (`tailwind.config.ts`) tanpa konfirmasi.
- Tidak boleh ubah `.env.local` content (struktur key=value boleh, isi value JANGAN).
- Tidak boleh commit secret / API key real.
- Tidak boleh ubah file `package-lock.json` secara manual.

---

_Dokumen ini hidup; perbarui jika ada keputusan arsitektur baru._
