import { NextResponse } from "next/server";
import { drizzle } from "drizzle-orm/d1";
import { ingredients } from "@/schema";
import type { D1Database } from "@cloudflare/workers-types";

interface Env {
  DB: D1Database;
}

export async function GET(request: Request, env: Env) {
	try {
		if (!env.DB) {
			throw new Error("D1 database binding not found");
		}
		const db = drizzle(env.DB);
		const allIngredients = await db.select().from(ingredients).all();
		return NextResponse.json(allIngredients);
	} catch (error) {
		console.error("Error fetching ingredients:", error);
		const errorMessage =
			error instanceof Error ? error.message : "Failed to fetch ingredients";
		return NextResponse.json({ error: errorMessage }, { status: 500 });
	}
}
