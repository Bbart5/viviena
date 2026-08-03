import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { withAccelerate } from '@prisma/extension-accelerate';
import bcrypt from 'bcrypt';

const databaseUrl = process.env.DATABASE_URL ?? '';

// Accelerate URLs (prisma:// / prisma+postgres://) go over HTTP and must not be
// passed to the pg driver adapter; direct postgres:// URLs are the reverse.
const isAccelerate = /^prisma(\+postgres)?:\/\//.test(databaseUrl);

const prisma = isAccelerate
	? (new PrismaClient({ accelerateUrl: databaseUrl }).$extends(
			withAccelerate()
		) as unknown as PrismaClient)
	: new PrismaClient({ adapter: new PrismaPg({ connectionString: databaseUrl }) });

async function main() {
	if (!process.env.SEED_USERS) {
		throw new Error(
			'SEED_USERS is not set - generate it with `npm run encode-users -- <users.json>` (see .env.example).'
		);
	}

	const json = Buffer.from(process.env.SEED_USERS, 'base64').toString('utf8');
	const users = JSON.parse(json) as { username: string; password: string }[];

	await Promise.all(
		users.map(async ({ username, password }) => {
			const passwordHash = await bcrypt.hash(password, 10);

			await prisma.user.upsert({
				where: {
					username
				},
				update: {
					passwordHash
				},
				create: {
					username,
					passwordHash
				}
			});
		})
	);

	await prisma.hero.create({
		data: {
			title: 'Stowarzyszenie VIVIENA',
			header1: 'Edukacja finansowa',
			header2: 'w praktyce',
			header3: 'dla młodych',
			description:
				'VIVIENA działa na rzecz młodych ludzi, edukacji i rozwoju. Pokazujemy finanse w prosty i praktyczny sposób, łącząc wiedzę z realnymi decyzjami, które podejmujemy każdego dnia.'
		}
	});

	await prisma.about.create({
		data: {
			title: 'Kierunek działań',
			header: 'Kim jesteśmy',
			paragraph1:
				'Najmocniej rozwijamy edukację finansową, jednocześnie pokazując jej praktyczne połączenia z bezpieczeństwem cyfrowym, inwestowaniem i codziennym zarządzaniem budżetem.',
			paragraph2:
				'Tworzymy wydarzenia i materiały, które pomagają młodym ludziom lepiej rozumieć pieniądze, inwestowanie, bezpieczeństwo finansowe i codzienne decyzje ekonomiczne. Pokazujemy finanse w praktyczny, przystępny i ciekawy sposób.',
			paragraph3:
				'Przybliżamy podstawy inwestowania, działanie rynku kapitałowego oraz różnice między bezpiecznymi i ryzykownymi instrumentami finansowymi. Chcemy, żeby młodzi ludzie podejmowali decyzje świadomie, a nie pod wpływem przypadkowych treści z internetu.',
			card1Title: 'Uważnie obserwujemy potrzeby',
			card1Description: 'Tworzymy działania odpowiadające na realne wyzwania młodych ludzi.',
			card2Title: 'Uczymy praktycznie',
			card2Description:
				'Przekładamy teorię na konkret: decyzje, nawyki i codzienne wybory finansowe.',
			card3Title: 'Budujemy świadome postawy',
			card3Description: 'Pokazujemy finanse i bezpieczeństwo bez uproszczeń oraz bez straszenia.',
			card4Title: 'Budujemy współpracę',
			card4Description:
				'Łączymy młodzież, ekspertów, uczelnie i instytucje wokół edukacji finansowej.'
		}
	});

	await prisma.areas.create({
		data: {
			title: 'Kierunek działań',
			header1: 'Obszary działań',
			header2: 'Edukacja finansowa',
			header3: 'Rynek kapitałowy i inwestycje',
			header4: 'Cyberbezpieczeństwo',
			header5: 'Oszczędzanie i budżet',
			paragraph1:
				'Najmocniej rozwijamy edukację finansową, jednocześnie pokazując jej praktyczne połączenia z bezpieczeństwem cyfrowym, inwestowaniem i codziennym zarządzaniem budżetem.',
			paragraph2:
				'Tworzymy wydarzenia i materiały, które pomagają młodym ludziom lepiej rozumieć pieniądze, inwestowanie, bezpieczeństwo finansowe i codzienne decyzje ekonomiczne. Pokazujemy finanse w praktyczny, przystępny i ciekawy sposób.',
			paragraph3:
				'Przybliżamy podstawy inwestowania, działanie rynku kapitałowego oraz różnice między bezpiecznymi i ryzykownymi instrumentami finansowymi. Chcemy, żeby młodzi ludzie podejmowali decyzje świadomie, a nie pod wpływem przypadkowych treści z internetu.',
			paragraph4:
				'Edukujemy o bezpieczeństwie w sieci, ochronie danych i zagrożeniach cyfrowych, szczególnie w kontekście finansów, bankowości, płatności online i oszustw internetowych.',
			paragraph5:
				'Pokazujemy, jak planować wydatki, budować dobre nawyki finansowe, rozumieć budżet osobisty i podejmować codzienne decyzje, które mają realny wpływ na przyszłość.'
		}
	});

	await prisma.action.create({
		data: {
			title: 'Finance Academy, VII edycja, 2026',
			date: '22-24 kwietnia 2026',
			tag: 'Zakończone',
			tagColor: 'green',
			showCta: false,
			ctaLabel: 'Zobacz relację',
			description:
				'Finance Academy to konferencja edukacyjna dla licealistów i studentów, której celem jest pokazanie finansów w praktyczny, ciekawy i przystępny sposób. Wydarzenie łączy konferencję stacjonarną z webinarami online i odpowiada na realny problem: młodzi ludzie często znają ryzykowne aktywa z internetu, ale brakuje im rzetelnych podstaw dotyczących oszczędzania, inwestowania i bezpieczeństwa finansowego.',
			relation:
				'Wydarzenie było odpowiedzią na wyniki ankiety: młodzież częściej deklarowała znajomość ryzykownych aktywów (krypto, CFD, Forex) niż podstaw takich jak ETF-y, obligacje, oszczędzanie i bezpieczeństwo finansowe.',
			details: [
				'Organizatorzy: Stowarzyszenie VIVIENA we współpracy z SKN Inwestor',
				'Format: wydarzenie hybrydowe (konferencja stacjonarna + webinary online)',
				'22 kwietnia: konferencja dla uczniów szkół średnich',
				'23-24 kwietnia: webinary online, bardziej skierowane do studentów'
			],
			people: [
				'Prof. Joanna Senyszyn',
				'Emil Łobodziński',
				'Hubert Świerczewski (Pankracy)',
				'dr hab. prof. UŁ Artur Sajnóg',
				'Agata Kobylińska',
				'Jakub Petera (@k.b.a_p.t.r)',
				'Mikołaj Światowy (@mikolaj_swiatowy)',
				'Natalia Śliwka (@natalia.sliwka.180)',
				'Młodzieżowa Rada Miasta',
				'Młodzieżowy Sejmik Województwa Łódzkiego'
			],
			partners: [
				'PwC',
				'PKO BP',
				'MRM',
				'Politechnika Łódzka',
				'Uniwersytet Łódzki',
				'inni partnerzy'
			]
		}
	});

	await prisma.teamMember.createMany({
		data: [
			{
				name: 'Aleksander Karol Sęk',
				role: 'Prezes Zarządu (od 11 grudnia 2025 r.)',
				group: 'BOARD'
			},
			{
				name: 'Bartosz Tomasz Błaszczyk',
				role: 'Wiceprezes Zarządu (od 11 grudnia 2025 r.)',
				group: 'BOARD'
			},
			{ name: 'Szymon Piotr Rudecki', role: 'Skarbnik (od 11 grudnia 2025 r.)', group: 'BOARD' },
			{ name: 'Wiktor Trześniowski', role: 'Sekretarz (od 11 grudnia 2025 r.)', group: 'BOARD' },
			{
				name: 'Filip Paweł Rolczak',
				role: 'Komisja Rewizyjna (od 11 grudnia 2025 r.)',
				group: 'REVISION'
			},
			{
				name: 'Maciej Grzegorz Maj',
				role: 'Komisja Rewizyjna (od 11 grudnia 2025 r.)',
				group: 'REVISION'
			},
			{
				name: 'Sebastian Waldemar Matusiak',
				role: 'Komisja Rewizyjna (od 11 grudnia 2025 r.)',
				group: 'REVISION'
			}
		]
	});
}

main()
	.catch((error) => {
		console.error(error);
		process.exitCode = 1;
	})
	.finally(async () => {
		await prisma.$disconnect();
	});
