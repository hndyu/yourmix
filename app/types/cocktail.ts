// 材料の型定義
export interface Ingredient {
	id: number;
	name: string; // グループ化された材料の表示名
	category: string;
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

// 材料一覧APIで返されるグループ化された材料の型定義
export interface GroupedIngredient {
	id: number;
	name: string;
	categoryName: string | null;
	actualNames: string[];
	sortOrder: number | null;
	description: string | null;
}

// タグの型定義
export interface Tag {
	name: string;
	description?: string | null;
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
	tags?: Tag[];
	imageUrl?: string;
	deliciousCount?: number;
	isLiked?: boolean;
}
