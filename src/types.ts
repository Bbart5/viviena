export interface Member {
	name: string;
	role: string;
	description: string;
	img: string;
}

export interface OurDocument {
	title: string;
	description: string;
	buttonLabel: string;
	icon: string;
}

export interface Action {
	title: string;
	date: string;
	tag: string;
	tagColor: string;
	description: string;
	details: string[];
}

export interface Area {
	title: string;
	description: string;
	icon: string;
	span: number;
	accentColor: string;
}

export interface HowWeWorkCard {
	title: string;
	description: string;
	icon: string;
}
