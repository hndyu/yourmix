import {
	BottleWine,
	CupSoda,
	HelpCircle,
	Martini,
	Utensils,
	Wine,
} from "lucide-react";

// DBのiconカラムの値とLucideアイコンコンポーネントをマッピング
export const iconMap: Record<
	string,
	React.ComponentType<{ size?: number | string; className?: string }>
> = {
	WineBar: Wine,
	Liquor: BottleWine,
	LocalBar: Martini,
	LocalDrink: CupSoda,
	Restaurant: Utensils,
};

// マッピングにない場合に表示するデフォルトアイコン
export const DefaultIcon = HelpCircle;
