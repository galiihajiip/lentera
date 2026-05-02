import os
import glob
import re

# We will recursively replace text in all TSX files in src/
src_dir = "c:/GALIH/CODING/LENTERA/lentera/src"
tw_file = "c:/GALIH/CODING/LENTERA/lentera/tailwind.config.ts"

translations = {
    # Generic
    "KALIKA": "LENTERA",
    "kalika-": "lentera-",
    "Kalika": "Lentera",
    
    # Landing Page
    "AI STUDY COMPANION": "PLATFORM PEMBELAJARAN AI",
    "Launch App": "Buka Aplikasi",
    "Launch LENTERA": "Buka LENTERA",
    "Launch LENTERA Now": "Buka LENTERA Sekarang",
    "Features": "Fitur",
    "Lenses": "Lensa",
    "Who It's For": "Untuk Siapa",
    "Study smarter.": "Belajar lebih pintar.",
    "Think culturally.": "Pahami lewat budaya.",
    "Learn freely.": "Berkembang bebas.",
    "LENTERA transforms complex academic material into": "LENTERA mengubah materi akademik kompleks menjadi",
    "culturally resonant analogies": "analogi budaya yang bermakna",
    "Built to empower": "Dibangun untuk memberdayakan",
    "neurodivergent minds": "semua jenis pembelajar",
    "Start Learning Free": "Mulai Belajar Gratis",
    "See How It Works": "Lihat Cara Kerja",
    "Active Cultural Lens": "Lensa Budaya Aktif",
    "Nusantara Analogy": "Analogi Nusantara",
    "Quiz Score": "Skor Kuis",
    "Cultural Lenses": "Lensa Budaya",
    "From Indigenous to Pop Culture": "Dari Tradisional hingga Pop Kultur",
    "Regional Voices": "Suara Regional",
    "Multilingual TTS Engine": "Mesin TTS Multibahasa",
    "Free Demo": "Demo Gratis",
    "For Hackathon Period": "Untuk NITRO 2026",
    "Your culture.": "Budaya Anda.",
    "Your way of understanding.": "Cara Anda memahami.",
    "Every student thinks differently. LENTERA speaks your language: not just linguistically, but culturally.": "Setiap siswa berpikir berbeda. LENTERA berbicara dalam bahasa Anda: bukan hanya secara linguistik, tetapi budaya.",
    "What LENTERA Does": "Fitur LENTERA",
    "Everything you need to": "Semua yang kamu butuhkan untuk",
    "learn without limits": "belajar tanpa batas",
    "Six AI-powered tools designed with neurodivergent minds in mind.": "Enam alat bertenaga AI yang dirancang untuk memudahkan pemahaman.",
    "The Cultural Lens Engine": "Mesin Lensa Budaya",
    "Core Feature": "Fitur Utama",
    "Dyslexia-Friendly Structuring": "Struktur Ramah Disleksia",
    "Every wall of text broken into short sentences": "Setiap teks panjang dipecah menjadi kalimat pendek",
    "Gamified Mini Quizzes": "Kuis Mikro Gamifikasi",
    "Three culturally-wrapped questions.": "Tiga pertanyaan berbalut budaya.",
    "Bilingual Smart Glossary": "Glosarium Pintar Bilingual",
    "Upload Anything: Notes, Photos, Audio": "Unggah Apa Saja: Catatan, Foto, Audio",
    "Text-to-Speech with Word Highlight": "Text-to-Speech dengan Sorotan Kata",
    "How LENTERA Works": "Cara Kerja LENTERA",
    "Three steps to understanding": "Tiga langkah untuk memahami",
    "Paste or Upload Your Material": "Tempel atau Unggah Materi Anda",
    "Choose Your Cultural Lens": "Pilih Lensa Budaya Anda",
    "Get Your Personalized Analysis": "Dapatkan Analisis Personal Anda",
    "Built for every kind of mind": "Dibangun untuk setiap jenis pikiran",
    "No learner gets left behind.": "Tidak ada pembelajar yang tertinggal.",
    "What learners say": "Apa kata pembelajar",
    "World-class insights from world-class scholars": "Wawasan kelas dunia dari pelajar dunia",
    "Free for Hackathon Demo": "Gratis untuk NITRO 2026",
    "Try LENTERA: completely free": "Coba LENTERA: sepenuhnya gratis",
    "No account needed. No payment.": "Tanpa akun. Tanpa pembayaran.",
    "Unlimited analyses": "Analisis tak terbatas",
    "All 50+ cultural lenses": "Semua 50+ lensa budaya",
    "Mini quiz generation": "Pembuatan kuis mikro",
    "Multimodal input (image + audio)": "Input multimodal (gambar + audio)",
    "Text-to-speech with 20+ voices": "Text-to-speech dengan 20+ suara",
    "Bilingual glossary": "Glosarium bilingual",
    "History saved locally": "Riwayat disimpan lokal",
    "Built by students, for students": "Dibangun oleh mahasiswa, untuk mahasiswa",
    "Powered by Bagong, the Garuda Scholar": "Didukung oleh Gemini 2.5 Flash",
    "Ready to study like": "Siap belajar layaknya",
    "a warrior": "seorang juara",
    "No more struggling alone with dense textbooks.": "Tidak ada lagi kesulitan memahami buku teks yang padat.",

    # Dashboard / App
    "Material to Study": "Materi untuk Dipelajari",
    "Select Cultural Lens": "Pilih Lensa Budaya",
    "GENERATE ANALYSIS": "ANALISIS SEKARANG",
    "ANALYZING...": "MENGANALISIS...",
    "Analysis Result": "Hasil Analisis",
    "Mini Quiz": "Kuis Mikro",
    "Ready when you are": "Siap saat kamu siap",
    "Paste your study material on the left, choose a cultural lens,": "Tempel materi belajarmu di sebelah kiri, pilih lensa budaya,",
    "and click Generate Analysis to begin.": "dan klik ANALISIS SEKARANG untuk memulai.",
    "Try Nusantara": "Coba Nusantara",
    "Try Japanese": "Coba Japanese",
    "Try Viking": "Coba Viking",
    "Try Gamer": "Coba Gamer",
    "No quiz yet": "Belum ada kuis",
    "First generate an analysis, then click \"Generate Mini Quiz\" in the result panel.": "Buat analisis terlebih dahulu, lalu klik \"Buat Kuis\" di panel hasil.",
    "Generate Quiz Now": "Buat Kuis Sekarang",
    "Type or paste your lecture notes here...": "Ketik atau tempel catatan materimu di sini...",
    "Extract Text": "Ekstrak Teks",
    "Transcribe": "Transkrip",
    "Text": "Teks",
    "Image": "Gambar",
    "Audio": "Audio",
    "Upload Image": "Unggah Gambar",
    "Upload Audio": "Unggah Audio",
    "Processing Image...": "Memproses Gambar...",
    "Processing Audio...": "Memproses Audio...",
    
    # Footer replacements (will do via code to be sure)
}

def translate_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Apply KALIKA -> LENTERA replacements first
    content = content.replace('KALIKA', 'LENTERA')
    content = content.replace('kalika-', 'lentera-')
    content = content.replace('Kalika', 'Lentera')

    # Apply translations
    for eng, ind in translations.items():
        # Ensure we don't accidentally replace KALIKA again if it was in the dict
        if eng not in ["KALIKA", "kalika-", "Kalika"]:
            content = content.replace(eng, ind)
            
    # Fix Footer
    if "Footer" in filepath:
        content = re.sub(r'Galih Aji Pangestu \· Muhammad Ananda Hariadi \· Fachri Ahmad Fabian', 'Galih Aji Pangestu (@somanjuntk)', content)
        content = re.sub(r'UPN Veteran East Java, Indonesia', 'UPN "Veteran" Jawa Timur', content)
        content = re.sub(r'GDG UTSC AI Case Competition', 'NITRO 2026', content)

    # Write back
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

# Rename files containing kalika
for root, dirs, files in os.walk(src_dir):
    for name in files:
        if "kalika" in name.lower():
            old_path = os.path.join(root, name)
            new_name = name.replace("kalika", "lentera").replace("Kalika", "Lentera")
            new_path = os.path.join(root, new_name)
            os.rename(old_path, new_path)

# Translate all files
for root, dirs, files in os.walk(src_dir):
    for name in files:
        if name.endswith((".tsx", ".ts", ".css")):
            translate_file(os.path.join(root, name))

# Also translate tailwind config
translate_file(tw_file)

print("Full migration and translation complete!")
