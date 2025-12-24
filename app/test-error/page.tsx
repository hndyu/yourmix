"use client";

import { Button } from "@/app/_components/ui/button";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

export default function TestErrorPage() {
	// 本番環境ではこのページを表示しない（404を返す）
	// ただし、E2Eテスト環境（NEXT_PUBLIC_IS_E2E_TEST=true）の場合は表示する
	if (
		process.env.NODE_ENV === "production" &&
		process.env.NEXT_PUBLIC_IS_E2E_TEST !== "true"
	) {
		notFound();
	}

	const [shouldThrow, setShouldThrow] = useState(false);

	useEffect(() => {
		if (shouldThrow) {
			throw new Error("This is a test error.");
		}
	}, [shouldThrow]);

	return (
		<div>
			<h1>Test Error Page</h1>
			<Button onClick={() => setShouldThrow(true)}>Click to throw error</Button>
		</div>
	);
}
