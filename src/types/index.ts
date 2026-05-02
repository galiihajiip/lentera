export type LensType =
  // Meta
  | 'nusantara'
  
  // Sumatera
  | 'aceh' | 'gayo' | 'batak_toba' | 'batak_karo' | 'batak_mandailing' | 'minangkabau' 
  | 'melayu_riau' | 'melayu_deli' | 'palembang' | 'jambi' | 'lampung' | 'rejang' 
  | 'kerinci' | 'nias' | 'mentawai' | 'anak_dalam'
  
  // Jawa
  | 'jawa_mataraman' | 'jawa_banyumasan' | 'sunda' | 'cirebon' | 'betawi' | 'madura' 
  | 'tengger' | 'osing' | 'baduy' | 'samin'
  
  // Bali & Nusa Tenggara
  | 'bali' | 'bali_aga' | 'sasak' | 'sumbawa' | 'bima' | 'manggarai' | 'ngada' 
  | 'ende_lio' | 'sumba' | 'rote' | 'sabu' | 'atoni_dawan' | 'lamaholot' | 'tetun'
  
  // Kalimantan
  | 'dayak_kenyah' | 'dayak_iban' | 'dayak_ngaju' | 'dayak_punan' | 'dayak_kayan' 
  | 'dayak_benuaq' | 'banjar' | 'kutai' | 'paser' | 'berau' | 'tidung'
  
  // Sulawesi
  | 'bugis' | 'makassar' | 'mandar' | 'toraja' | 'minahasa' | 'sangir_talaud' 
  | 'gorontalo' | 'kaili' | 'pamona' | 'buton' | 'muna' | 'tolaki' | 'wakatobi'
  
  // Maluku
  | 'ambon' | 'seram' | 'kei' | 'tanimbar' | 'aru' | 'ternate' | 'tidore' | 'tobelo_galela'
  
  // Papua
  | 'asmat' | 'dani' | 'lani' | 'yali' | 'mee' | 'amungme' | 'kamoro' | 'korowai' 
  | 'marind' | 'sentani' | 'biak' | 'arfak' | 'moi'
  
  // Extra / International (Optional legacy support)
  | 'japanese' | 'chinese' | 'korean' | 'viking' | 'gamer' | 'cyber' | 'scientific'

export type InputMode = 'text' | 'image' | 'audio'
export type TabType = 'result' | 'quiz'
export type Difficulty = 'easy' | 'medium' | 'hard'
export type CorrectAnswer = 'A' | 'B' | 'C' | 'D'

export interface GlossaryItem {
  term: string
  englishB1: string
  localContext: string
}

export interface ResultData {
  dyslexiaFriendlyTeks: string
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
  inputTeks: string
  lens: LensType | string // Added string fallback to avoid breaking past history (e.g. old 'islamic')
  result: ResultData
  timestamp: number
}

export interface Toast {
  id: string
  message: string
  type: 'success' | 'error' | 'info' | 'warning'
  duration?: number
}
