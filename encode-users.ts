/**
 * Encodes admin users for the SEED_USERS env var (see .env.example).
 *
 * Usage: npm run encode-users -- users.json
 * where users.json (gitignored) contains: [{ "username": "...", "password": "..." }]
 */
import { readFileSync } from 'node:fs';

const path = process.argv[2];

if (!path) {
	console.error('Usage: npm run encode-users -- <users.json>');
	process.exit(1);
}

const users: unknown = JSON.parse(readFileSync(path, 'utf8'));

const valid =
	Array.isArray(users) &&
	users.length > 0 &&
	users.every(
		(user) =>
			typeof user === 'object' &&
			user !== null &&
			typeof (user as { username?: unknown }).username === 'string' &&
			typeof (user as { password?: unknown }).password === 'string'
	);

if (!valid) {
	console.error(`${path} must contain a non-empty array of { username, password } objects.`);
	process.exit(1);
}

console.log(Buffer.from(JSON.stringify(users)).toString('base64'));
