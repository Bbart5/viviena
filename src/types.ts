export interface Member {
	name: string;
	role: string;
	img: string;
}

export interface OurDocument {
	title: string;
	description: string;
	href: string;
	icon: string;
}

export interface Action {
	title: string;
	date: string;
	tag: string;
	tagColor: string;
	ctaLabel: string;
	showCta: boolean;
	image: string;
	description: string;
	details: string[];
	relation: string;
	people: string[];
	partners: string[];
}

export interface Area {
	title: string;
	description: string;
	icon: string;
	span: number;
}

export interface HowWeWorkCard {
	title: string;
	description: string;
	icon: string;
}
