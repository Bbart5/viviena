import { replaceState } from '$app/navigation';

export function scrollToSection(href: string) {
	document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' });
}

/**
 * Mirrors the section currently in view into the URL hash.
 * Returns a cleanup function - call from onMount.
 */
export function observeSectionHashes(): () => void {
	const sections = document.querySelectorAll('[id]');

	const observer = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					const id = entry.target.getAttribute('id');

					if (id) {
						// eslint-disable-next-line svelte/no-navigation-without-resolve
						replaceState(`#${id}`, {});
					}
				}
			});
		},
		{
			threshold: 0.3
		}
	);

	sections.forEach((section) => observer.observe(section));

	return () => {
		sections.forEach((section) => observer.unobserve(section));
	};
}
