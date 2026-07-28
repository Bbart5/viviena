import { PrismaClient } from '../generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import bcrypt from 'bcrypt';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
	const json = Buffer.from(process.env.SEED_USERS!, 'base64').toString('utf8');
	const users = JSON.parse(json) as { username: string; password: string }[];

	await Promise.all(
		users.map(async ({ username, password }) => {
			const passwordHash = await bcrypt.hash(password, 10);

			await prisma.user.create({
				data: {
					username,
					passwordHash
				}
			});
		})
	);

	await prisma.hero.upsert({
		where: {
			id: 1
		},
		update: {},
		create: {
			id: 1,
			title: 'Stowarzyszenie VIVIENA',
			header1: 'Edukacja finansowa',
			header2: 'w praktyce',
			header3: 'dla młodych',
			description:
				'VIVIENA działa na rzecz młodych ludzi, edukacji i rozwoju. Pokazujemy finanse w prosty i praktyczny sposób, łącząc wiedzę z realnymi decyzjami, które podejmujemy każdego dnia.'
		}
	});

	await prisma.about.upsert({
		where: {
			id: 1
		},
		update: {},
		create: {
			id: 1,
			title: 'Kierunek działań',
			header: 'Kim jesteśmy',

			paragraph1:
				'Najmocniej rozwijamy edukację finansową, jednocześnie pokazując jej praktyczne połączenia z bezpieczeństwem cyfrowym, inwestowaniem i codziennym zarządzaniem budżetem.',

			paragraph2:
				'Tworzymy wydarzenia i materiały, które pomagają młodym ludziom lepiej rozumieć pieniądze, inwestowanie, bezpieczeństwo finansowe i codzienne decyzje ekonomiczne. Pokazujemy finanse w praktyczny, przystępny i ciekawy sposób.',

			paragraph3:
				'Przybliżamy podstawy inwestowania, działanie rynku kapitałowego oraz różnice między bezpiecznymi i ryzykownymi instrumentami finansowymi. Chcemy, żeby młodzi ludzie podejmowali decyzje świadomie, a nie pod wpływem przypadkowych treści z internetu.',

			card1Title: 'Uważnie obserwujemy potrzeby',
			card1Description:
				'Tworzymy działania odpowiadające na realne wyzwania młodych ludzi.',

			card2Title: 'Uczymy praktycznie',
			card2Description:
				'Przekładamy teorię na konkret: decyzje, nawyki i codzienne wybory finansowe.',

			card3Title: 'Budujemy świadome postawy',
			card3Description:
				'Pokazujemy finanse i bezpieczeństwo bez uproszczeń oraz bez straszenia.',

			card4Title: 'Budujemy współpracę',
			card4Description:
				'Łączymy młodzież, ekspertów, uczelnie i instytucje wokół edukacji finansowej.'
		}
	});

	await prisma.areas.upsert({
		where: {
			id: 1
		},
		update: {},
		create: {
			id: 1,

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

	console.log('dupa');
}

main()
	.catch(console.error)
	.finally(async () => {
		await prisma.$disconnect();
	});