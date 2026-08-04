import { read } from '$app/server';
import { Resvg } from '@resvg/resvg-js';
import satori, { type SatoriOptions } from 'satori';
import interRegularUrl from './fonts/Inter-Regular.ttf';
import interSemiBoldUrl from './fonts/Inter-SemiBold.ttf';
import manropeExtraBoldUrl from './fonts/Manrope-ExtraBold.ttf';
import logoUrl from './logo.svg';

export interface OgCardContent {
	/** Small uppercase label above the headline. */
	kicker: string;
	/** Headline lines rendered one under another (max 3 are shown). */
	headline: string[];
	description: string;
}

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

// Satori element factory - satori consumes React-shaped plain objects.
type OgElement = { type: string; props: Record<string, unknown> };

function el(
	type: string,
	style: Record<string, unknown>,
	children?: OgElement | OgElement[] | string,
	extra?: Record<string, unknown>
): OgElement {
	return { type, props: { style, children, ...extra } };
}

let assetsPromise: Promise<{ fonts: SatoriOptions['fonts']; logoDataUri: string }> | null = null;

async function loadAssets() {
	assetsPromise ??= (async () => {
		const [interRegular, interSemiBold, manropeExtraBold, logoSvg] = await Promise.all([
			read(interRegularUrl).arrayBuffer(),
			read(interSemiBoldUrl).arrayBuffer(),
			read(manropeExtraBoldUrl).arrayBuffer(),
			read(logoUrl).text()
		]);

		return {
			fonts: [
				{ name: 'Inter', data: interRegular, weight: 400, style: 'normal' },
				{ name: 'Inter', data: interSemiBold, weight: 600, style: 'normal' },
				{ name: 'Manrope', data: manropeExtraBold, weight: 800, style: 'normal' }
			] satisfies SatoriOptions['fonts'],
			logoDataUri: `data:image/svg+xml;base64,${Buffer.from(logoSvg).toString('base64')}`
		};
	})();

	return assetsPromise;
}

function truncate(text: string, maxLength: number): string {
	const trimmed = text.trim();
	if (trimmed.length <= maxLength) {
		return trimmed;
	}

	const cut = trimmed.slice(0, maxLength - 1);
	const lastSpace = cut.lastIndexOf(' ');
	return `${(lastSpace > maxLength * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

function card(content: OgCardContent, logoDataUri: string): OgElement {
	const headlineLines = content.headline.filter((line) => line.trim().length > 0).slice(0, 3);
	const longestLine = Math.max(...headlineLines.map((line) => line.length), 1);
	const sizeByLength = longestLine > 24 ? 56 : longestLine > 16 ? 68 : 80;
	const sizeByCount = headlineLines.length > 2 ? 58 : headlineLines.length > 1 ? 72 : 84;
	const headlineSize = Math.min(sizeByLength, sizeByCount);
	// ~55 chars fit per description line; keep it to two lines even under a 3-line headline.
	const descriptionLimit = headlineLines.length > 2 ? 100 : 140;

	return el(
		'div',
		{
			width: '100%',
			height: '100%',
			display: 'flex',
			flexDirection: 'column',
			position: 'relative',
			padding: '64px 72px 56px',
			backgroundColor: '#ffffff',
			backgroundImage: 'linear-gradient(135deg, #ffffff 55%, #edf3ff 100%)',
			fontFamily: 'Inter'
		},
		[
			// Decorative brand circles
			el('div', {
				position: 'absolute',
				top: -220,
				right: -160,
				width: 560,
				height: 560,
				borderRadius: 9999,
				backgroundImage: 'linear-gradient(135deg, rgba(95,140,255,0.28), rgba(31,87,214,0.08))'
			}),
			el('div', {
				position: 'absolute',
				bottom: -260,
				right: 140,
				width: 380,
				height: 380,
				borderRadius: 9999,
				backgroundImage: 'linear-gradient(135deg, rgba(25,168,111,0.16), rgba(25,168,111,0.02))'
			}),
			// Bottom accent bar
			el('div', {
				position: 'absolute',
				bottom: 0,
				left: 0,
				width: OG_WIDTH,
				height: 14,
				backgroundImage: 'linear-gradient(90deg, #1f57d6, #5f8cff 60%, #19a86f)'
			}),
			el('img', { width: 245, height: 80 }, undefined, {
				src: logoDataUri,
				width: 245,
				height: 80
			}),
			el('div', { display: 'flex', flexGrow: 1 }),
			el(
				'div',
				{
					display: 'flex',
					color: '#1f57d6',
					fontSize: 26,
					fontWeight: 600,
					letterSpacing: 5,
					textTransform: 'uppercase',
					marginBottom: 18
				},
				truncate(content.kicker, 60)
			),
			el(
				'div',
				{ display: 'flex', flexDirection: 'column', maxWidth: 980 },
				headlineLines.map((line, index) =>
					el(
						'div',
						{
							display: 'flex',
							fontFamily: 'Manrope',
							fontWeight: 800,
							fontSize: headlineSize,
							lineHeight: 1.12,
							color: index === headlineLines.length - 1 ? '#1f57d6' : '#122b55'
						},
						truncate(line, 40)
					)
				)
			),
			el(
				'div',
				{
					display: 'flex',
					marginTop: 26,
					maxWidth: 900,
					fontSize: 29,
					lineHeight: 1.45,
					color: '#5f7398'
				},
				truncate(content.description, descriptionLimit)
			),
			el('div', { display: 'flex', flexGrow: 1 })
		]
	);
}

/** Renders a 1200x630 Open Graph card to a PNG buffer. */
export async function renderOgImage(content: OgCardContent): Promise<Buffer> {
	const { fonts, logoDataUri } = await loadAssets();

	const svg = await satori(card(content, logoDataUri) as never, {
		width: OG_WIDTH,
		height: OG_HEIGHT,
		fonts
	});

	return new Resvg(svg, { fitTo: { mode: 'width', value: OG_WIDTH } }).render().asPng();
}
