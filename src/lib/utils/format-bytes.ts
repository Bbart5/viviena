const UNITS = [
	{ factor: 1000 ** 3, suffix: 'GB' },
	{ factor: 1000 ** 2, suffix: 'MB' },
	{ factor: 1000, suffix: 'kB' }
] as const;

/** Decimal (SI) units, matching how the free-tier limits in `$lib/consts/storage` count bytes. */
export function formatBytes(bytes: number, maximumFractionDigits = 1): string {
	const unit = UNITS.find(({ factor }) => bytes >= factor);

	if (!unit) {
		return `${bytes} B`;
	}

	return `${(bytes / unit.factor).toLocaleString('pl-PL', { maximumFractionDigits })} ${unit.suffix}`;
}
