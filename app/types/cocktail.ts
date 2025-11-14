// 材料の型定義
export interface Ingredient {
	name: string;
	amount: string;
	option_group?: number;
}

// カクテルの型定義
export interface Cocktail {
	id: string;
	name: string;
	slug: string;
	description: string;
	ingredients: Ingredient[];
	instructions: string[];
	garnish?: string;
	tags?: string[];
}
