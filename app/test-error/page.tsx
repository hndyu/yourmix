"use client";

import Button from "@mui/material/Button";
import { notFound } from "next/navigation";
import { useEffect, useState } from "react";

export default function TestErrorPage() {
	// 本番環境ではこのページを表示しない（404を返す）
	if (process.env.NODE_ENV === "production") {
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
