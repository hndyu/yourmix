"use client";

import { useEffect, useState } from "react";
import Button from "@mui/material/Button";

export default function TestErrorPage() {
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
