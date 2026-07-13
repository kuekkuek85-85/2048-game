const TILE_STYLES = {
  2: { bg: 'bg-tile-2', text: 'text-[#776e65]' },
  4: { bg: 'bg-tile-4', text: 'text-[#776e65]' },
  8: { bg: 'bg-tile-8', text: 'text-white' },
  16: { bg: 'bg-tile-16', text: 'text-white' },
  32: { bg: 'bg-tile-32', text: 'text-white' },
  64: { bg: 'bg-tile-64', text: 'text-white' },
  128: { bg: 'bg-tile-128', text: 'text-white' },
  256: { bg: 'bg-tile-256', text: 'text-white' },
  512: { bg: 'bg-tile-512', text: 'text-white' },
  1024: { bg: 'bg-tile-1024', text: 'text-white' },
  2048: { bg: 'bg-tile-2048', text: 'text-white' },
}
const DEFAULT_STYLE = { bg: 'bg-[#3c3a32]', text: 'text-white' }

function fontSizeClass(value) {
  if (value >= 1024) return 'text-lg sm:text-2xl'
  if (value >= 128) return 'text-xl sm:text-3xl'
  return 'text-2xl sm:text-4xl'
}

export default function Tile({ value, row, col, isNew, justMerged }) {
  const { bg, text } = TILE_STYLES[value] ?? DEFAULT_STYLE

  return (
    <div
      className="absolute top-0 left-0 h-1/4 w-1/4 p-[3%] transition-transform duration-100 ease-in-out"
      style={{ transform: `translate(${col * 100}%, ${row * 100}%)` }}
    >
      <div
        className={`flex h-full w-full items-center justify-center rounded-md font-bold ${bg} ${text} ${fontSizeClass(value)} ${
          isNew ? 'animate-tile-pop' : justMerged ? 'animate-tile-merge' : ''
        }`}
      >
        {value}
      </div>
    </div>
  )
}
