'use client'

import { useMemo, useState, useRef, useEffect } from 'react'
import { ChevronDown, Search, MapPin } from 'lucide-react'
import { useLenteraStore } from '@/store/useLenteraStore'
import type { LensType } from '@/types'

// ─── Data Lensa ─────────────────────────────────────────────
export interface LensItem {
  id: LensType
  emoji: string
  label: string
  region: string
}

/**
 * Data lengkap semua lensa budaya Indonesia.
 * Diurutkan geografis: Meta → Sumatera (barat) → Papua (timur).
 * Di-export agar bisa dipakai komponen lain (misal HistoryCard, ResultPanel).
 */
export const LENS_ITEMS: LensItem[] = [
  // ── Meta / Default ──
  { id: 'nusantara',        emoji: '🏝️', label: 'Nusantara',          region: 'Meta / Default' },

  // ── Sumatera ──
  { id: 'aceh',             emoji: '🕌', label: 'Aceh',               region: 'Sumatera' },
  { id: 'gayo',             emoji: '☕', label: 'Gayo',               region: 'Sumatera' },
  { id: 'batak_toba',       emoji: '🎭', label: 'Batak Toba',         region: 'Sumatera' },
  { id: 'batak_karo',       emoji: '🏡', label: 'Batak Karo',         region: 'Sumatera' },
  { id: 'batak_mandailing', emoji: '🥁', label: 'Mandailing',         region: 'Sumatera' },
  { id: 'minangkabau',      emoji: '🍛', label: 'Minangkabau',        region: 'Sumatera' },
  { id: 'melayu_riau',      emoji: '📜', label: 'Melayu Riau',        region: 'Sumatera' },
  { id: 'melayu_deli',      emoji: '🏰', label: 'Melayu Deli',        region: 'Sumatera' },
  { id: 'palembang',        emoji: '🐟', label: 'Palembang',          region: 'Sumatera' },
  { id: 'jambi',            emoji: '🌿', label: 'Jambi',              region: 'Sumatera' },
  { id: 'lampung',          emoji: '👑', label: 'Lampung',            region: 'Sumatera' },
  { id: 'rejang',           emoji: '✍️', label: 'Rejang',             region: 'Sumatera' },
  { id: 'kerinci',          emoji: '🌋', label: 'Kerinci',            region: 'Sumatera' },
  { id: 'nias',             emoji: '🪨', label: 'Nias',               region: 'Sumatera' },
  { id: 'mentawai',         emoji: '🌊', label: 'Mentawai',           region: 'Sumatera' },
  { id: 'anak_dalam',       emoji: '🌳', label: 'Suku Anak Dalam',    region: 'Sumatera' },

  // ── Jawa ──
  { id: 'jawa_mataraman',   emoji: '🎎', label: 'Jawa Mataraman',     region: 'Jawa' },
  { id: 'jawa_banyumasan',  emoji: '🎋', label: 'Banyumasan',         region: 'Jawa' },
  { id: 'sunda',            emoji: '🎶', label: 'Sunda',              region: 'Jawa' },
  { id: 'cirebon',          emoji: '🎭', label: 'Cirebon',            region: 'Jawa' },
  { id: 'betawi',           emoji: '🪆', label: 'Betawi',             region: 'Jawa' },
  { id: 'madura',           emoji: '🐂', label: 'Madura',             region: 'Jawa' },
  { id: 'tengger',          emoji: '🌄', label: 'Tengger',            region: 'Jawa' },
  { id: 'osing',            emoji: '💃', label: 'Osing',              region: 'Jawa' },
  { id: 'baduy',            emoji: '🌾', label: 'Baduy',              region: 'Jawa' },
  { id: 'samin',            emoji: '✊', label: 'Samin',              region: 'Jawa' },

  // ── Bali & Nusa Tenggara ──
  { id: 'bali',             emoji: '🪷', label: 'Bali',               region: 'Bali & Nusa Tenggara' },
  { id: 'bali_aga',         emoji: '🏛️', label: 'Bali Aga',           region: 'Bali & Nusa Tenggara' },
  { id: 'sasak',            emoji: '🎣', label: 'Sasak',              region: 'Bali & Nusa Tenggara' },
  { id: 'sumbawa',          emoji: '🐃', label: 'Sumbawa',            region: 'Bali & Nusa Tenggara' },
  { id: 'bima',             emoji: '🏺', label: 'Bima Mbojo',         region: 'Bali & Nusa Tenggara' },
  { id: 'manggarai',        emoji: '🕸️', label: 'Manggarai',          region: 'Bali & Nusa Tenggara' },
  { id: 'ngada',            emoji: '🗿', label: 'Ngada',              region: 'Bali & Nusa Tenggara' },
  { id: 'ende_lio',         emoji: '🌈', label: 'Ende-Lio',           region: 'Bali & Nusa Tenggara' },
  { id: 'sumba',            emoji: '⚔️', label: 'Sumba',              region: 'Bali & Nusa Tenggara' },
  { id: 'rote',             emoji: '🎵', label: 'Rote',               region: 'Bali & Nusa Tenggara' },
  { id: 'sabu',             emoji: '🌴', label: 'Sabu',               region: 'Bali & Nusa Tenggara' },
  { id: 'atoni_dawan',      emoji: '🏠', label: 'Atoni Dawan',        region: 'Bali & Nusa Tenggara' },
  { id: 'lamaholot',        emoji: '🐋', label: 'Lamaholot',          region: 'Bali & Nusa Tenggara' },
  { id: 'tetun',            emoji: '🌿', label: 'Tetun',              region: 'Bali & Nusa Tenggara' },

  // ── Kalimantan ──
  { id: 'dayak_kenyah',     emoji: '🎭', label: 'Dayak Kenyah',       region: 'Kalimantan' },
  { id: 'dayak_iban',       emoji: '🏠', label: 'Dayak Iban',         region: 'Kalimantan' },
  { id: 'dayak_ngaju',      emoji: '💀', label: 'Dayak Ngaju',        region: 'Kalimantan' },
  { id: 'dayak_punan',      emoji: '🌿', label: 'Punan',              region: 'Kalimantan' },
  { id: 'dayak_kayan',      emoji: '🔱', label: 'Dayak Kayan',        region: 'Kalimantan' },
  { id: 'dayak_benuaq',     emoji: '🌱', label: 'Dayak Benuaq',       region: 'Kalimantan' },
  { id: 'banjar',           emoji: '🛶', label: 'Banjar',             region: 'Kalimantan' },
  { id: 'kutai',            emoji: '👑', label: 'Kutai',              region: 'Kalimantan' },
  { id: 'paser',            emoji: '🎶', label: 'Paser',              region: 'Kalimantan' },
  { id: 'berau',            emoji: '🐠', label: 'Berau',              region: 'Kalimantan' },
  { id: 'tidung',           emoji: '🌊', label: 'Tidung',             region: 'Kalimantan' },

  // ── Sulawesi ──
  { id: 'bugis',            emoji: '⛵', label: 'Bugis',              region: 'Sulawesi' },
  { id: 'makassar',         emoji: '🏰', label: 'Makassar',           region: 'Sulawesi' },
  { id: 'mandar',           emoji: '🎏', label: 'Mandar',             region: 'Sulawesi' },
  { id: 'toraja',           emoji: '⚰️', label: 'Toraja',             region: 'Sulawesi' },
  { id: 'minahasa',         emoji: '🎵', label: 'Minahasa',           region: 'Sulawesi' },
  { id: 'sangir_talaud',    emoji: '🌋', label: 'Sangir-Talaud',      region: 'Sulawesi' },
  { id: 'gorontalo',        emoji: '🎋', label: 'Gorontalo',          region: 'Sulawesi' },
  { id: 'kaili',            emoji: '🌧️', label: 'Kaili',              region: 'Sulawesi' },
  { id: 'pamona',           emoji: '🤝', label: 'Pamona',             region: 'Sulawesi' },
  { id: 'buton',            emoji: '🏯', label: 'Buton',              region: 'Sulawesi' },
  { id: 'muna',             emoji: '🐴', label: 'Muna',               region: 'Sulawesi' },
  { id: 'tolaki',           emoji: '⭕', label: 'Tolaki',             region: 'Sulawesi' },
  { id: 'wakatobi',         emoji: '🪸', label: 'Wakatobi',           region: 'Sulawesi' },

  // ── Maluku ──
  { id: 'ambon',            emoji: '🥁', label: 'Ambon',              region: 'Maluku' },
  { id: 'seram',            emoji: '🏔️', label: 'Seram',              region: 'Maluku' },
  { id: 'kei',              emoji: '⚖️', label: 'Kei',                region: 'Maluku' },
  { id: 'tanimbar',         emoji: '🗿', label: 'Tanimbar',           region: 'Maluku' },
  { id: 'aru',              emoji: '🦜', label: 'Aru',                region: 'Maluku' },
  { id: 'ternate',          emoji: '🌶️', label: 'Ternate',            region: 'Maluku' },
  { id: 'tidore',           emoji: '🏝️', label: 'Tidore',             region: 'Maluku' },
  { id: 'tobelo_galela',    emoji: '🌿', label: 'Tobelo-Galela',      region: 'Maluku' },

  // ── Papua & Papua Barat ──
  { id: 'asmat',            emoji: '🪵', label: 'Asmat',              region: 'Papua' },
  { id: 'dani',             emoji: '🏠', label: 'Dani',               region: 'Papua' },
  { id: 'lani',             emoji: '🍠', label: 'Lani',               region: 'Papua' },
  { id: 'yali',             emoji: '⛰️', label: 'Yali',               region: 'Papua' },
  { id: 'mee',              emoji: '👜', label: 'Mee',                region: 'Papua' },
  { id: 'amungme',          emoji: '🏔️', label: 'Amungme',            region: 'Papua' },
  { id: 'kamoro',           emoji: '🎨', label: 'Kamoro',             region: 'Papua' },
  { id: 'korowai',          emoji: '🌲', label: 'Korowai',            region: 'Papua' },
  { id: 'marind',           emoji: '🌾', label: 'Marind',             region: 'Papua' },
  { id: 'sentani',          emoji: '🎨', label: 'Sentani',            region: 'Papua' },
  { id: 'biak',             emoji: '🚢', label: 'Biak Numfor',        region: 'Papua' },
  { id: 'arfak',            emoji: '🦅', label: 'Arfak',              region: 'Papua' },
  { id: 'moi',              emoji: '🐠', label: 'Moi',                region: 'Papua' },
]

// ─── Urutan region ──────────────────────────────────────────
const REGION_ORDER = [
  'Meta / Default',
  'Sumatera',
  'Jawa',
  'Bali & Nusa Tenggara',
  'Kalimantan',
  'Sulawesi',
  'Maluku',
  'Papua',
]

// ─── Warna aksen per region ─────────────────────────────────
const REGION_ACCENT: Record<string, string> = {
  'Meta / Default':       'text-lentera-green',
  'Sumatera':             'text-emerald-400',
  'Jawa':                 'text-teal-400',
  'Bali & Nusa Tenggara': 'text-cyan-400',
  'Kalimantan':           'text-sky-400',
  'Sulawesi':             'text-indigo-400',
  'Maluku':               'text-violet-400',
  'Papua':                'text-fuchsia-400',
}

// ─── Komponen Utama ─────────────────────────────────────────
interface LensSelectorProps {
  /** Jika true, tampil sebagai dropdown. Jika false, tampil inline grid. Default: true */
  variant?: 'dropdown' | 'inline'
  className?: string
}

export default function LensSelector({ variant = 'dropdown', className = '' }: LensSelectorProps) {
  const selectedLens = useLenteraStore((s) => s.selectedLens)
  const setSelectedLens = useLenteraStore((s) => s.setSelectedLens)

  const [isOpen, setIsOpen] = useState(false)
  const [search, setSearch] = useState('')
  const dropdownRef = useRef<HTMLDivElement>(null)
  const searchRef = useRef<HTMLInputElement>(null)

  // ── Tutup dropdown saat klik luar ──
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false)
        setSearch('')
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // ── Auto-focus search saat buka dropdown ──
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => searchRef.current?.focus(), 50)
    }
  }, [isOpen])

  // ── Lens terpilih ──
  const selectedItem = useMemo(
    () => LENS_ITEMS.find((l) => l.id === selectedLens) ?? LENS_ITEMS[0],
    [selectedLens]
  )

  // ── Filter + group ──
  const filteredGroups = useMemo(() => {
    const q = search.toLowerCase().trim()
    const filtered = q
      ? LENS_ITEMS.filter(
          (l) =>
            l.label.toLowerCase().includes(q) ||
            l.region.toLowerCase().includes(q) ||
            l.id.toLowerCase().includes(q)
        )
      : LENS_ITEMS

    const grouped: Record<string, LensItem[]> = {}
    for (const item of filtered) {
      if (!grouped[item.region]) grouped[item.region] = []
      grouped[item.region].push(item)
    }

    return REGION_ORDER.filter((r) => r in grouped).map((region) => ({
      region,
      items: grouped[region],
    }))
  }, [search])

  const totalResults = filteredGroups.reduce((acc, g) => acc + g.items.length, 0)

  const handleSelect = (lens: LensType) => {
    setSelectedLens(lens)
    setIsOpen(false)
    setSearch('')
  }

  // ─── Render inline grid ──────────────────────────────────
  if (variant === 'inline') {
    return (
      <InlineGrid
        filteredGroups={filteredGroups}
        search={search}
        onSearchChange={setSearch}
        selectedLens={selectedLens}
        onSelect={handleSelect}
        totalResults={totalResults}
        className={className}
        searchRef={searchRef}
      />
    )
  }

  // ─── Render dropdown ─────────────────────────────────────
  return (
    <div ref={dropdownRef} className={`relative ${className}`}>
      {/* Trigger button */}
      <button
        id="lens-selector-trigger"
        type="button"
        onClick={() => setIsOpen((p) => !p)}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        className={[
          'flex items-center gap-2.5 w-full px-3.5 py-2.5',
          'rounded-lentera border transition-all duration-200',
          'bg-lentera-surface text-lentera-text text-sm font-body',
          'hover:border-lentera-border2 focus-visible:outline-none',
          isOpen
            ? 'border-lentera-green-glow ring-1 ring-lentera-green/20'
            : 'border-lentera-border',
        ].join(' ')}
      >
        <span className="text-base leading-none shrink-0">{selectedItem.emoji}</span>
        <span className="flex-1 text-left truncate font-medium">{selectedItem.label}</span>
        <span className="text-xs text-lentera-muted shrink-0 hidden sm:block">
          {selectedItem.region}
        </span>
        <ChevronDown
          size={14}
          className={`shrink-0 text-lentera-muted transition-transform duration-200 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <div
          role="listbox"
          aria-label="Pilih lensa budaya"
          className={[
            'absolute z-50 top-full left-0 right-0 mt-1.5',
            'rounded-lentera-lg border border-lentera-border',
            'bg-lentera-surface shadow-2xl shadow-black/60',
            'animate-fade-in',
          ].join(' ')}
          style={{ minWidth: '260px' }}
        >
          {/* Search */}
          <div className="p-2.5 border-b border-lentera-border">
            <div className="relative">
              <Search
                size={13}
                className="absolute left-2.5 top-1/2 -translate-y-1/2 text-lentera-muted pointer-events-none"
              />
              <input
                ref={searchRef}
                type="text"
                placeholder="Cari lensa budaya..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={[
                  'w-full pl-8 pr-3 py-2 text-xs rounded-[8px]',
                  'bg-lentera-surface2 border border-lentera-border',
                  'text-lentera-text placeholder-lentera-muted',
                  'focus:outline-none focus:border-lentera-border2',
                  'transition-colors duration-150',
                ].join(' ')}
              />
            </div>
          </div>

          {/* List */}
          <div className="max-h-[360px] overflow-y-auto custom-scrollbar p-2">
            {totalResults === 0 ? (
              <div className="py-8 text-center text-lentera-muted text-xs">
                Tidak ada lensa yang cocok dengan &ldquo;{search}&rdquo;
              </div>
            ) : (
              filteredGroups.map(({ region, items }) => (
                <div key={region} className="mb-3 last:mb-0">
                  {/* Region header */}
                  <div
                    className={`flex items-center gap-1.5 px-1 mb-1.5 text-[10px] font-semibold uppercase tracking-widest ${
                      REGION_ACCENT[region] ?? 'text-lentera-muted'
                    }`}
                  >
                    <MapPin size={9} className="shrink-0" />
                    {region}
                    <span className="ml-auto font-normal text-lentera-muted normal-case tracking-normal">
                      {items.length}
                    </span>
                  </div>

                  {/* Grid 2 kolom */}
                  <div className="grid grid-cols-2 gap-1">
                    {items.map((item) => (
                      <LensItemButton
                        key={item.id}
                        item={item}
                        isSelected={selectedLens === item.id}
                        onSelect={handleSelect}
                      />
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-lentera-border px-3 py-2 flex items-center justify-between">
            <span className="text-[10px] text-lentera-muted">
              {totalResults} lensa tersedia
            </span>
            <span className="text-[10px] text-lentera-muted">Sabang – Merauke 🇮🇩</span>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── Sub: Tombol per lensa ───────────────────────────────────
function LensItemButton({
  item,
  isSelected,
  onSelect,
}: {
  item: LensItem
  isSelected: boolean
  onSelect: (id: LensType) => void
}) {
  return (
    <button
      type="button"
      role="option"
      aria-selected={isSelected}
      id={`lens-option-${item.id}`}
      onClick={() => onSelect(item.id)}
      className={[
        'flex items-center gap-2 px-2.5 py-2 rounded-[10px]',
        'border text-left text-xs transition-all duration-150 w-full group',
        isSelected
          ? 'border-lentera-green-glow bg-lentera-green-subtle text-lentera-green-text'
          : 'border-transparent hover:border-lentera-border hover:bg-lentera-surface2 text-lentera-text-secondary hover:text-lentera-text',
      ].join(' ')}
    >
      <span className="text-sm leading-none shrink-0">{item.emoji}</span>
      <span className="truncate font-medium leading-tight">{item.label}</span>
      {isSelected && (
        <span className="ml-auto shrink-0 w-1.5 h-1.5 rounded-full bg-lentera-green" />
      )}
    </button>
  )
}

// ─── Sub: Inline Grid (variant='inline') ────────────────────
function InlineGrid({
  filteredGroups,
  search,
  onSearchChange,
  selectedLens,
  onSelect,
  totalResults,
  className,
  searchRef,
}: {
  filteredGroups: { region: string; items: LensItem[] }[]
  search: string
  onSearchChange: (v: string) => void
  selectedLens: LensType
  onSelect: (id: LensType) => void
  totalResults: number
  className: string
  searchRef: React.RefObject<HTMLInputElement | null>
}) {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {/* Search */}
      <div className="relative">
        <Search
          size={13}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-lentera-muted pointer-events-none"
        />
        <input
          ref={searchRef}
          type="text"
          placeholder="Cari lensa budaya..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className={[
            'w-full pl-9 pr-3 py-2.5 text-sm rounded-lentera',
            'bg-lentera-surface2 border border-lentera-border',
            'text-lentera-text placeholder-lentera-muted',
            'focus:outline-none focus:border-lentera-border2 transition-colors',
          ].join(' ')}
        />
      </div>

      {/* Scrollable list */}
      <div className="max-h-[400px] overflow-y-auto custom-scrollbar pr-1 space-y-4">
        {totalResults === 0 ? (
          <div className="py-10 text-center text-lentera-muted text-sm">
            Tidak ada lensa cocok dengan &ldquo;{search}&rdquo;
          </div>
        ) : (
          filteredGroups.map(({ region, items }) => (
            <div key={region}>
              <div
                className={`flex items-center gap-1.5 mb-2 text-[11px] font-semibold uppercase tracking-widest ${
                  REGION_ACCENT[region] ?? 'text-lentera-muted'
                }`}
              >
                <MapPin size={10} className="shrink-0" />
                {region}
                <span className="ml-auto font-normal text-lentera-muted normal-case tracking-normal">
                  {items.length}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {items.map((item) => (
                  <LensItemButton
                    key={item.id}
                    item={item}
                    isSelected={selectedLens === item.id}
                    onSelect={onSelect}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer count */}
      <div className="text-[11px] text-lentera-muted text-center pt-1 border-t border-lentera-border">
        {totalResults} lensa tersedia · Sabang – Merauke 🇮🇩
      </div>
    </div>
  )
}
