// Shows a food's tier as a coloured badge. CONTEXT.md requires tier to
// never be shown by colour alone, so every badge also has the tier's name
// as text, plus a distinct symbol -- three separate cues, so the
// information still comes through for a colour-blind reader or a black and
// white printout.
const TIER_STYLES = {
  Excellent: { bg: 'bg-[var(--color-tier-excellent)]', text: 'text-white', symbol: '●●●' },
  High: { bg: 'bg-[var(--color-tier-high)]', text: 'text-white', symbol: '●●' },
  Moderate: { bg: 'bg-[var(--color-tier-moderate)]', text: 'text-[var(--color-text)]', symbol: '●' },
  Low: { bg: 'bg-[var(--color-tier-low)]', text: 'text-[var(--color-text)]', symbol: '○' },
}

export default function TierBadge({ tier }) {
  const style = TIER_STYLES[tier] ?? TIER_STYLES.Low
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-sm font-semibold whitespace-nowrap ${style.bg} ${style.text}`}
    >
      <span aria-hidden="true">{style.symbol}</span>
      {tier}
    </span>
  )
}
