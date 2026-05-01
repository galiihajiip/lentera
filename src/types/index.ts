// ═══════════════════════════════════════════════════
// LENTERA — Type Definitions
// ═══════════════════════════════════════════════════
//
// CATATAN PROYEK:
// Seluruh konteks budaya di LENTERA WAJIB Indonesia (Sabang–Merauke).
// Tidak ada lensa internasional. Setiap penambahan LensType harus
// merujuk pada suku/budaya/sub-budaya Indonesia yang autentik.
// ═══════════════════════════════════════════════════

// ─── Lensa Budaya Nusantara ────────────────────────
// Disusun urut geografis: barat → timur (Sabang ke Merauke).
export type LensType =
  // ─── Sumatera ─────────────────────────────────
  | 'aceh'                 // Aceh — Tari Saman, Mie Aceh, Rumoh Aceh
  | 'gayo'                 // Dataran Tinggi Gayo — Tari Saman asli, Kopi Gayo
  | 'batak_toba'           // Batak Toba — Ulos, Danau Toba, Gondang Sabangunan
  | 'batak_karo'           // Karo — Rumah Siwaluh Jabu, Tari Lima Serangkai
  | 'batak_mandailing'     // Mandailing — Gordang Sambilan, Sipirok
  | 'minangkabau'          // Minang — Rumah Gadang, Rendang, Adat Bundo Kanduang
  | 'melayu_riau'          // Melayu Riau — Pantun, Zapin, Tanjak
  | 'melayu_deli'          // Melayu Deli — Istana Maimun, Bika Ambon
  | 'palembang'            // Palembang — Pempek, Songket, Rumah Limas
  | 'jambi'                // Jambi — Batik Jambi, Rumah Kajang Lako
  | 'lampung'              // Lampung — Tapis, Siger, Rumah Nuwo Sesat
  | 'rejang'               // Rejang Bengkulu — Tabot, Aksara Kaganga
  | 'kerinci'              // Kerinci — Tale, Rumah Larik
  | 'nias'                 // Nias — Lompat Batu (Fahombo), Omo Sebua
  | 'mentawai'             // Mentawai — Tato Mentawai, Sikerei, Uma
  | 'anak_dalam'           // Suku Anak Dalam (Orang Rimba) Jambi

  // ─── Jawa ─────────────────────────────────────
  | 'jawa_mataraman'       // Yogya–Solo–Kediri — Gamelan, Wayang Kulit, Batik Klasik
  | 'jawa_banyumasan'      // Banyumas–Tegal — Calung, Lengger, dialek Ngapak
  | 'sunda'                // Sunda — Angklung, Wayang Golek, Kacapi Suling
  | 'cirebon'              // Cirebon — Topeng Cirebon, Batik Mega Mendung
  | 'betawi'               // Betawi — Ondel-ondel, Lenong, Gambang Kromong
  | 'madura'               // Madura — Karapan Sapi, Sate Madura, Saronen
  | 'tengger'              // Tengger Bromo — Yadnya Kasada, Hindu Tengger
  | 'osing'                // Osing Banyuwangi — Tari Gandrung, Janger
  | 'baduy'                // Baduy Banten — Hidup tanpa modernisasi, Pikukuh
  | 'samin'                // Samin/Sedulur Sikep — Filosofi anti-feodal

  // ─── Bali & Nusa Tenggara ─────────────────────
  | 'bali'                 // Bali — Kecak, Pura, Galungan, Subak
  | 'bali_aga'             // Bali Aga (Tenganan, Trunyan) — Bali pra-Majapahit
  | 'sasak'                // Sasak Lombok — Bau Nyale, Sade, Tenun Sasak
  | 'sumbawa'              // Sumbawa — Barapan Kebo, Istana Dalam Loka
  | 'bima'                 // Bima Mbojo — Uma Lengge, Tenun Bima
  | 'manggarai'            // Manggarai Flores — Caci, Wae Rebo, Compang
  | 'ngada'                // Ngada — Bena, Tarian Ja’i
  | 'ende_lio'             // Ende-Lio — Kelimutu, Sao Ria
  | 'sumba'                // Sumba — Pasola, Marapu, Kain Tenun Ikat
  | 'rote'                 // Rote — Sasando, Topi Ti'i Langga
  | 'sabu'                 // Sabu Raijua — Tenun Sabu
  | 'atoni_dawan'          // Atoni Dawan Timor — Ume Kbubu, Tenun Insana
  | 'lamaholot'            // Flores Timur–Lembata–Adonara — Lefa, Paus tradisional
  | 'tetun'                // Tetun (Belu/Malaka) — perbatasan Timor

  // ─── Kalimantan ───────────────────────────────
  | 'dayak_kenyah'         // Dayak Kenyah — Tari Hudoq, Mandau
  | 'dayak_iban'           // Dayak Iban — Rumah Betang, tato
  | 'dayak_ngaju'          // Dayak Ngaju — Tiwah, Sandung
  | 'dayak_punan'          // Punan — peramu hutan
  | 'dayak_kayan'          // Kayan — telinga panjang, ukiran
  | 'dayak_benuaq'         // Benuaq Kutai Barat — Belian
  | 'banjar'               // Banjar — Sasirangan, Pasar Terapung, Mandau
  | 'kutai'                // Kutai — Erau, Kesultanan Kutai
  | 'paser'                // Paser — Ronggeng Paser
  | 'berau'                // Berau — Kesultanan Berau
  | 'tidung'               // Tidung Kaltara — Tari Jepin

  // ─── Sulawesi ─────────────────────────────────
  | 'bugis'                // Bugis — Phinisi, La Galigo, Bissu
  | 'makassar'             // Makassar — Pa'raga, Coto, Karaeng
  | 'mandar'               // Mandar — Sandeq, Tomatindo
  | 'toraja'               // Toraja — Rambu Solo', Tongkonan, Tau Tau
  | 'minahasa'             // Minahasa — Maengket, Waruga, Kolintang
  | 'sangir_talaud'        // Sangir-Talaud — Masamper
  | 'gorontalo'            // Gorontalo — Polopalo, Bili'u
  | 'kaili'                // Kaili Sulteng — Tari Pamonte
  | 'pamona'               // Pamona Poso — Mosintuwu
  | 'buton'                // Buton — Benteng Wolio, Kesultanan Buton
  | 'muna'                 // Muna — Ekaja, kerajaan tua
  | 'tolaki'               // Tolaki Sultra — Lulo, Mosehe
  | 'wakatobi'             // Wakatobi — bahari, Bajo Sama

  // ─── Maluku ───────────────────────────────────
  | 'ambon'                // Ambon — Pela Gandong, Tifa, Sasi
  | 'seram'                // Seram (Nuaulu, Wemale) — Maluku Tengah
  | 'kei'                  // Kei — Sasi laut, Larvul Ngabal
  | 'tanimbar'             // Tanimbar — patung leluhur, tenun
  | 'aru'                  // Kepulauan Aru — Cendrawasih, ikan
  | 'ternate'              // Ternate — Kesultanan Ternate, cengkeh
  | 'tidore'               // Tidore — Kesultanan Tidore
  | 'tobelo_galela'        // Halmahera — Tobelo & Galela

  // ─── Papua & Papua Barat ──────────────────────
  | 'asmat'                // Asmat — Patung Mbis, Bisj
  | 'dani'                 // Dani Lembah Baliem — Honai, Bakar Batu, Koteka
  | 'lani'                 // Lani Pegunungan Tengah
  | 'yali'                 // Yali Pegunungan
  | 'mee'                  // Mee Paniai — Noken
  | 'amungme'              // Amungme — Sakral Nemangkawi
  | 'kamoro'               // Kamoro Mimika — ukir kayu
  | 'korowai'              // Korowai — rumah pohon
  | 'marind'               // Marind Merauke — Dema
  | 'sentani'              // Sentani — Isolo, Khombow
  | 'biak'                 // Biak Numfor — Wor, Munara
  | 'arfak'                // Arfak Manokwari — Rumah Kaki Seribu
  | 'moi'                  // Moi Sorong — Kambik

// ─── Mode & Tab ──────────────────────────────────────
export type InputMode = 'text' | 'image' | 'audio'
export type TabType = 'result' | 'quiz'
export type Difficulty = 'mudah' | 'sedang' | 'sulit'
export type CorrectAnswer = 'A' | 'B' | 'C' | 'D'

// ─── Data Structures ─────────────────────────────────
export interface GlossaryItem {
  term: string
  englishB1: string
  localContext: string
}

export interface ResultData {
  dyslexiaFriendlyText: string
  culturalAnalogy: string
  examBoundary: string
  bilingualGlossary: GlossaryItem[]
}

export interface QuizItem {
  question: string
  options: [string, string, string, string]
  correctAnswer: CorrectAnswer
  culturalExplanation: string
  difficulty: Difficulty
}

export interface HistoryEntry {
  id: string
  inputText: string
  lens: LensType | string
  result: ResultData
  timestamp: number
}

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}
