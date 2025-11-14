export interface Ingredient {
	id: number;
	name: string; // グループ化された材料の表示名
	amount?: string;
	categoryName?: string | null;
	actualNames?: string[]; // グループ化された材料の実際の名称リスト
	sortOrder?: number | null;
	description?: string | null;
	option_group?: number;
}

export interface Category {
	id: number;
	name: string;
	sortOrder: number;
	icon: string | null;
	description: string | null;
}

export interface Cocktail {
	id: string;
	slug: string;
	name: string;
	description: string;
	ingredients: Ingredient[];
	instructions: string[];
	garnish?: string;
	tags?: string[];
}
