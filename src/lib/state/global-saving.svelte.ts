/**
 * Counter (not boolean) so overlapping operations keep the overlay up until
 * the last one settles.
 */
let count = $state(0);

export const globalSaving = {
	get active() {
		return count > 0;
	}
};

export function beginGlobalSaving() {
	count += 1;
}

export function endGlobalSaving() {
	count = Math.max(0, count - 1);
}
