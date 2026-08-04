// Generates all raster favicons/app icons in static/ from static/favicon.svg.
// Run after changing the brand mark: node scripts/generate-icons.mjs
import { Resvg } from '@resvg/resvg-js';
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const staticDir = join(dirname(fileURLToPath(import.meta.url)), '..', 'static');
const mark = readFileSync(join(staticDir, 'favicon.svg'), 'utf8');

const markSize = { width: 38.355, height: 43.509 };

// Centers the mark on a square canvas at the given scale (fraction of the
// canvas the mark's height occupies). background: CSS color or null (transparent).
function squareSvg(size, scale, background) {
	const height = size * scale;
	const width = height * (markSize.width / markSize.height);
	const x = (size - width) / 2;
	const y = (size - height) / 2;
	const inner = mark.replace(
		/^<svg xmlns="http:\/\/www\.w3\.org\/2000\/svg" width="[^"]*" height="[^"]*"/,
		`<svg xmlns="http://www.w3.org/2000/svg" x="${x}" y="${y}" width="${width}" height="${height}" viewBox="0 0 ${markSize.width} ${markSize.height}"`
	);
	const rect = background ? `<rect width="${size}" height="${size}" fill="${background}"/>` : '';
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">${rect}${inner}</svg>`;
}

function png(size, scale, background) {
	const svg = squareSvg(size, scale, background);
	return new Resvg(svg, { fitTo: { mode: 'width', value: size } }).render().asPng();
}

// A valid .ico can wrap PNG-compressed images (supported since Windows Vista
// and by every browser/crawler that matters, including Googlebot).
function ico(pngs) {
	const header = Buffer.alloc(6);
	header.writeUInt16LE(0, 0); // reserved
	header.writeUInt16LE(1, 2); // type: icon
	header.writeUInt16LE(pngs.length, 4);

	let offset = 6 + 16 * pngs.length;
	const entries = [];
	for (const { size, data } of pngs) {
		const entry = Buffer.alloc(16);
		entry.writeUInt8(size >= 256 ? 0 : size, 0); // width
		entry.writeUInt8(size >= 256 ? 0 : size, 1); // height
		entry.writeUInt8(0, 2); // palette
		entry.writeUInt8(0, 3); // reserved
		entry.writeUInt16LE(1, 4); // color planes
		entry.writeUInt16LE(32, 6); // bits per pixel
		entry.writeUInt32LE(data.length, 8);
		entry.writeUInt32LE(offset, 12);
		entries.push(entry);
		offset += data.length;
	}

	return Buffer.concat([header, ...entries, ...pngs.map(({ data }) => data)]);
}

// Browser-tab favicons: transparent, small padding.
writeFileSync(join(staticDir, 'favicon-16x16.png'), png(16, 0.94, null));
writeFileSync(join(staticDir, 'favicon-32x32.png'), png(32, 0.94, null));

// Legacy/Google favicon.ico with 16/32/48 variants.
writeFileSync(
	join(staticDir, 'favicon.ico'),
	ico(
		[16, 32, 48].map((size) => ({
			size,
			data: png(size, 0.94, null)
		}))
	)
);

// iOS home-screen icon: opaque background, comfortable padding.
writeFileSync(join(staticDir, 'apple-touch-icon.png'), png(180, 0.62, '#ffffff'));

// Web app manifest icons.
writeFileSync(join(staticDir, 'icon-192.png'), png(192, 0.66, '#ffffff'));
writeFileSync(join(staticDir, 'icon-512.png'), png(512, 0.66, '#ffffff'));

console.log('icons written to', staticDir);
