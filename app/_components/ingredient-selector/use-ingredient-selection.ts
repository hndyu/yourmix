import type { Ingredient } from "@/app/types/cocktail";
import { useCallback, useMemo } from "react";

type UseIngredientSelectionProps = {
	allIngredients: Ingredient[];
	selectedIngredientIds: number[];
	selectedIngredientNames: string[];
	onIngredientsChange: (ids: number[], names: string[]) => void;
	maxSelectionCount?: number;
};

type SelectionResult =
	| { success: true; message?: string }
	| { success: false; reason: "LIMIT_REACHED" };

export function useIngredientSelection({
	allIngredients,
	selectedIngredientIds,
	selectedIngredientNames,
	onIngredientsChange,
	maxSelectionCount = 5,
}: UseIngredientSelectionProps) {
	// 選択された材料の論理的な数を計算
	const currentTotalCount = useMemo(() => {
		let count = 0;
		for (const ingredient of allIngredients) {
			const detailNames = ingredient.actualNames || [];

			// グループ名が選択リストに含まれているか
			// 注意: グループ名と詳細名が重複する場合（例: "ライム"）、
			// グループとして選択されているのか、詳細として選択されているのかを判別する必要がある。
			// ここでは、単純化のために「グループ名が含まれていればグループ選択」とみなすか、
			// IDの包含関係で判定することも可能だが、現状の仕様に合わせて名前ベースで判定する。
			const isGroupSelected = selectedIngredientNames.includes(ingredient.name);

			// グループ内の詳細材料で選択されているもの
			const selectedDetails = selectedIngredientNames.filter((n) =>
				detailNames.includes(n),
			);

			if (isGroupSelected) {
				// グループ選択されている場合は1カウント
				// ただし、グループ名 == 詳細名 の場合、詳細としてカウントされないように制御が必要
				count += 1;
			} else {
				// グループ選択されていない場合、選択されている詳細の数を加算
				count += selectedDetails.length;
			}
		}
		return count;
	}, [allIngredients, selectedIngredientNames]);

	const toggleGroup = useCallback(
		(group: Ingredient): SelectionResult => {
			const isGroupSelected = selectedIngredientNames.includes(group.name);

			if (isGroupSelected) {
				// 解除: グループ名と、グループに含まれる全ての詳細名を削除
				const namesToRemove = [group.name, ...(group.actualNames || [])];
				const idsToRemove = group.actualIds || [group.id];

				const newNames = selectedIngredientNames.filter(
					(n) => !namesToRemove.includes(n),
				);
				const newIds = selectedIngredientIds.filter(
					(id) => !idsToRemove.includes(id),
				);

				onIngredientsChange(newIds, newNames);
				return { success: true };
			}

			// 追加: 制限チェック
			if (currentTotalCount >= maxSelectionCount) {
				return { success: false, reason: "LIMIT_REACHED" };
			}

			// 既にこのグループの詳細が選択されていた場合、それらは「グループ選択」に統合されるため
			// カウントは増えない（むしろ減る可能性がある）ので、制限チェックはパスするはずだが、
			// 他のグループが選択されている場合も考慮して上記チェックを行う。
			// ただし、詳細→グループへの昇格は常に許可すべき（カウントは増えないため）。

			// 詳細が選択されているか確認
			const detailNames = group.actualNames || [];
			const selectedDetailsInGroup = selectedIngredientNames.filter((n) =>
				detailNames.includes(n),
			);

			// もし詳細が選択されていなくて、かつ制限に達していたらエラー
			if (
				selectedDetailsInGroup.length === 0 &&
				currentTotalCount >= maxSelectionCount
			) {
				return { success: false, reason: "LIMIT_REACHED" };
			}

			// 追加処理
			// 1. 既存の詳細選択をクリア（グループ選択で上書き）
			// 2. グループ名を追加
			// 3. グループの全IDを追加

			let newNames = selectedIngredientNames.filter(
				(n) => !detailNames.includes(n),
			);
			newNames = [...newNames, group.name];

			// IDの更新: 現在のIDからグループ内のIDを一度除外し、改めて全IDを追加
			const groupAllIds = group.actualIds || [group.id];
			const newIds = selectedIngredientIds.filter(
				(id) => !groupAllIds.includes(id),
			);
			// 重複を避けて結合
			const finalIds = Array.from(new Set([...newIds, ...groupAllIds]));

			onIngredientsChange(finalIds, newNames);
			return { success: true, message: `${group.name}を追加しました` };
		},
		[
			selectedIngredientNames,
			selectedIngredientIds,
			currentTotalCount,
			maxSelectionCount,
			onIngredientsChange,
		],
	);

	const toggleDetail = useCallback(
		(group: Ingredient, detailName: string): SelectionResult => {
			const groupAllIds = group.actualIds || [group.id];
			// Check if the group is fully selected (all IDs present)
			// If IDs list is empty (shouldn't happen for valid group), default to false
			const isGroupFullySelected =
				groupAllIds.length > 0 &&
				groupAllIds.every((id) => selectedIngredientIds.includes(id));

			const isDetailSelected =
				selectedIngredientNames.includes(detailName) && !isGroupFullySelected;

			const detailId =
				group.actualDetails?.find((d) => d.name === detailName)?.id || group.id;

			if (isDetailSelected) {
				// 詳細の解除
				const newNames = selectedIngredientNames.filter(
					(n) => n !== detailName,
				);
				const newIds = selectedIngredientIds.filter((id) => id !== detailId);
				onIngredientsChange(newIds, newNames);
				return { success: true };
			}

			// 詳細の追加
			// グループが選択されている場合 -> 詳細選択への切り替え（ドリルダウン）
			// グループが選択されていない場合 -> 新規追加

			// 注意: isGroupFullySelectedがTrueの場合、グループ名がselectedIngredientNamesに含まれているはずだが
			// 詳細名と同じ場合もあるので、名前ベースのフィルタリングは慎重に行う

			// 制限チェック
			// グループからの切り替えならカウントは増えない（1->1）
			// 既に同じグループの別の詳細が選択されている場合は増える (1->2)

			// isGroupSelectedByName was causing issues when groupName == detailName.
			// Rely solely on isGroupFullySelected (ID check) to detect if we are in Group Mode.
			if (!isGroupFullySelected && currentTotalCount >= maxSelectionCount) {
				return { success: false, reason: "LIMIT_REACHED" };
			}

			let newNames = [...selectedIngredientNames];
			let newIds = [...selectedIngredientIds];

			if (isGroupFullySelected) {
				// グループ選択を解除し、詳細選択モードへ移行
				// グループ名を除外
				newNames = newNames.filter((n) => n !== group.name);
				// グループの全IDを除外
				newIds = newIds.filter((id) => !groupAllIds.includes(id));
			}

			newNames.push(detailName);
			newIds.push(detailId);

			// IDの重複排除（念のため）
			newIds = Array.from(new Set(newIds));

			onIngredientsChange(newIds, newNames);
			return { success: true, message: `${detailName}を追加しました` };
		},
		[
			selectedIngredientNames,
			selectedIngredientIds,
			currentTotalCount,
			maxSelectionCount,
			onIngredientsChange,
		],
	);

	return {
		currentTotalCount,
		toggleGroup,
		toggleDetail,
	};
}
