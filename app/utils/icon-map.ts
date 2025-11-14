import {
	HelpOutline, // デフォルトアイコン用
	Liquor,
	LocalBar,
	LocalDrink,
	Restaurant,
	WineBar,
} from "@mui/icons-material";

// DBのiconカラムの値とMUIアイコンコンポーネントをマッピング
export const iconMap: Record<string, React.ComponentType> = {
	WineBar,
	Liquor,
	LocalBar,
	LocalDrink,
	Restaurant,
};

// マッピングにない場合に表示するデフォルトアイコン
export const DefaultIcon = HelpOutline;
