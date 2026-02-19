// 材料の型定義
export interface Ingredient {
	id: number;
	name: string; // グループ化された材料の表示名
	category: string;
	amount?: string;
	categoryName?: string | null;
	actualNames?: string[]; // グループ化された材料の実際の名称リスト
	actualIds?: number[]; // グループ化された材料の実際のIDリスト
	actualDetails?: { id: number; name: string }[]; // 名前とIDのペア
	sortOrder?: number | null;
	description?: string | null;
	option_group?: number;
	assetKey?: string | null;
}

export interface Category {
	id: number;
	name: string;
	sortOrder: number;
	assetKey: string | null;
	description: string | null;
}

// 材料一覧APIで返されるグループ化された材料の型定義
export interface GroupedIngredient {
	id: number;
	name: string;
	categoryName: string | null;
	actualNames: string[];
	actualIds: number[];
	actualDetails: { id: number; name: string }[];
	sortOrder: number | null;
	description: string | null;
	assetKey: string | null;
}

// タグの型定義
export interface Tag {
	name: string;
	description?: string | null;
}

// AI生成カクテルの材料型
export interface GeneratedIngredient {
	name: string;
	amount: string;
	description?: string | null;
	option_group?: number;
}

// AI生成カクテルの型定義
export interface GeneratedCocktail {
	name: string;
	description: string;
	ingredients: GeneratedIngredient[];
	instructions: string[];
	garnish?: string;
	tags?: Tag[];
	imageUrl?: string;
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
