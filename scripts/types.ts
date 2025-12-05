export interface IngredientData {
	name: string;
	amount: string;
	option_group?: number;
	category: string;
}

export interface CocktailData {
	name: string;
	description: string;
	ingredients: IngredientData[];
	instructions: string[];
	garnish: string;
	tags: string[];
	imageUrl: string;
}

export interface IngredientGroupData {
	displayName: string;
	order: number;
	description: string;
}

export interface SeedDataOverrides {
	unforgettables?: CocktailData[];
	newEra?: CocktailData[];
	contemporaryClassics?: CocktailData[];
	ingredientGroupsData?: IngredientGroupData[];
	ingredientDetails?: Record<string, { group: string; description: string }>;
}
