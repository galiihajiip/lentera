<div align="center">
  <img src="public/images/bagong.png" alt="LENTERA Mascot" width="150"/>
  <h1>LENTERA 🦅</h1>
  <p><strong>Pendamping Belajar AI yang Adaptif Secara Budaya & Ramah Aksesibilitas</strong></p>

  <p>
    <a href="https://lentera-id.vercel.app"><b>Lihat Demo Langsung</b></a>
    ·
    <a href="https://github.com/galiihajiip/lentera/issues">Laporkan Bug</a>
    ·
    <a href="https://github.com/galiihajiip/lentera/issues">Minta Fitur</a>
  </p>
  
  ![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
  ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)
  ![TailwindCSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)
  ![Gemini AI](https://img.shields.io/badge/Gemini-2.5%20Flash-orange?logo=google)
</div>

<br />

## 🌟 Tentang Proyek

**LENTERA** diciptakan untuk menyelesaikan satu masalah besar dalam dunia akademik: *Setiap mahasiswa memiliki cara berpikir dan pemahaman yang berbeda, tetapi buku teks hanya berbicara dalam satu bahasa yang kaku.*

Oleh karena itu, kami membangun sebuah platform *AI Study Companion* yang dapat menyederhanakan teks akademik yang padat dan rumit menjadi konsep yang jauh lebih mudah dicerna. LENTERA menerjemahkan konsep akademik ke dalam analogi berdasarkan **Lensa Budaya Nusantara** (seperti wayang, budaya pasar, gotong royong) maupun berbagai budaya pop lainnya.

Sistem ini didesain secara khusus bagi pembelajar dengan tantangan **Disleksia**, rentang fokus yang pendek (ADHD), maupun siapa saja yang lebih mudah belajar lewat cerita dan gamifikasi. Proyek ini dikembangkan secara penuh untuk kompetisi **NITRO 2026**.

---

## ✨ Fitur Utama

- 🌴 **Mesin Lensa Budaya**: Ubah materi sulit tentang *mitokondria* menjadi analogi *dapur warung Padang*, atau *superposisi kuantum* menjadi analogi *orkestra gamelan*. 50+ konteks budaya tersedia.
- 📖 **Antarmuka Ramah Disleksia**: Pemecahan kalimat yang padat menjadi *bullet points* dengan spasi ekstra lebar dan penebalan kata kunci. 
- 🎮 **Kuis Mikro Gamifikasi**: Bangun kuis 3 pertanyaan interaktif secara otomatis berdasarkan teks yang Anda masukkan, lengkap dengan skor dan *Wawasan Budaya* di akhir sesi.
- 🔊 **Asisten Audio (Text-to-Speech)**: Dilengkapi lebih dari 20 suara multibahasa. Membantu Anda mendengarkan materi sambil menyorot teks yang dibacakan (*highlight-sync*).
- 📚 **Glosarium Bilingual Pintar**: Mengekstrak jargon teknis otomatis dan memberikan definisi sederhana (Level B1) beserta konteks lokalnya.
- 📸 **Input Multimodal**: Gunakan kamera (foto buku teks), unggah rekaman audio dosen, atau tempel materi teks langsung. LENTERA dapat mengekstraknya berkat kekuatan Google Gemini 2.5 Flash Vision.

---

## 🛠️ Teknologi yang Digunakan

Proyek LENTERA dibangun menggunakan *tech stack* terkini untuk memastikan performa yang cepat dan desain antarmuka yang sangat dinamis:

* **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
* **Styling:** [Tailwind CSS 4](https://tailwindcss.com/) dengan dukungan efek *Glassmorphism* dan *Micro-animations*
* **Bahasa:** [TypeScript](https://www.typescriptlang.org/)
* **Manajemen State:** [Zustand](https://zustand-demo.pmnd.rs/)
* **Kecerdasan Buatan (AI):** [Google Gen AI SDK](https://www.npmjs.com/package/@google/genai) (`gemini-2.5-flash`)
* **Deployment:** [Vercel](https://vercel.com/)

---

## 🚀 Panduan Instalasi Lokal

Ingin menjalankan LENTERA secara lokal di mesin Anda? Ikuti langkah-langkah di bawah ini.

### Prasyarat
- Node.js versi 20 atau lebih baru.
- Akun Google AI Studio untuk mendapatkan *API Key*.

### Instalasi

1. **Clone repositori ini**
   ```bash
   git clone https://github.com/galiihajiip/lentera.git
   cd lentera/lentera
   ```

2. **Instal dependensi**
   ```bash
   npm install
   ```

3. **Atur Variabel Environment**
   Buat file bernama `.env.local` di dalam folder *root* proyek Anda (`lentera/lentera`), dan tambahkan *API Key* dari Gemini:
   ```env
   GEMINI_API_KEY=KODE_API_KEY_ANDA_DI_SINI
   ```

4. **Jalankan *Development Server***
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di `http://localhost:3000`.

---

## 👨‍💻 Tim Pengembang (Developers)

LENTERA dikembangkan oleh mahasiswa **Universitas Pembangunan Nasional (UPN) "Veteran" Jawa Timur** untuk kompetisi **NITRO 2026**:

1. **Galih Aji Pangestu** 
2. **Sabrina Nurlita Dwi Oktaviani** 
3. **Muhammad Reza Fakhriansah** 

---

## 📄 Lisensi

Hak Cipta © 2026 LENTERA. Hak Cipta Dilindungi.
Dibuat oleh mahasiswa, untuk mahasiswa. 

> *“Belajar Serasa Bercerita. Pahami Lewat Budaya. Nyalakan Lentera Pintarmu.”*
