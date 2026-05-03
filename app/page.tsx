import CocktailMixer from "./_components/cocktail-mixer";
import { getIngredientsMasterData } from "./lib/ingredients";

export const dynamic = "force-dynamic";

export default async function Home() {
	// サーバーサイドで材料マスターデータを取得
	const { ingredients, categories } = await getIngredientsMasterData();

	return (
		<>
			{/* カクテルミキサー（日替わりおすすめ機能を含む） */}
			<CocktailMixer
				initialIngredients={ingredients}
				initialCategories={categories}
			/>
		</>
	);
}
