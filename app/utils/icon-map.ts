import HelpOutline from "@mui/icons-material/HelpOutline"; // デフォルトアイコン用
import Liquor from "@mui/icons-material/Liquor";
import LocalBar from "@mui/icons-material/LocalBar";
import LocalDrink from "@mui/icons-material/LocalDrink";
import Restaurant from "@mui/icons-material/Restaurant";
import WineBar from "@mui/icons-material/WineBar";

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
