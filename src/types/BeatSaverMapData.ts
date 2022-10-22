export type BeatSaverMapData = {
	id: string;
	name: string;
	description: string;
	uploader: {
		id: string;
		name: string;
		hash: string;
		avatar: string;
		type: string;
		admin: boolean;
		curator: boolean;
		verifiedMapper: boolean;
	};
	metadata: {
		bpm: number;
		duration: number;
		songName: string;
		songSubName: string;
		songAuthorName: string;
		levelAuthorName: string;
	};
	stats: {
		plays: number;
		downloads: number;
		upvotes: number;
		downvotes: number;
		score: number;
	};
	uploaded: string;
	automapper: boolean;
	ranked: boolean;
	qualified: boolean;
	versions: Array<Version>;
	curator: Curator;
	curatedAt: string;
	createdAt: string;
	updatedAt: string;
	lastPublishedAt: string;
	tags: Array<string>;
};

export type Version = {
	hash: string;
	state: string;
	createdAt: string;
	sageScore: number;
	diffs: Array<Difficulty>;
	downloadURL: string;
	coverURL: string;
	previewURL: string;
};

export type Difficulty = {
	njs: number;
	offset: number;
	notes: number;
	bombs: number;
	obstacles: number;
	nps: number;
	length: number;
	characteristic: string;
	difficulty: DifficultyType;
	events: number;
	chroma: boolean;
	me: boolean;
	ne: boolean;
	cinema: boolean;
	seconds: number;
	paritySummary: ParitySummary;
	stars: number;
	maxScore: number;
};

export type DifficultyType = ["Easy", "Normal", "Hard", "Expert", "ExpertPlus"];

export type ParitySummary = {
	errors: number;
	warns: number;
	resets: number;
};

export type Curator = {
	id: number;
	name: string;
	hash: string;
	avatar: string;
	type: string;
	admin: boolean;
	curator: boolean;
};
