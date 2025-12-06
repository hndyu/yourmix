import { getAuth } from "@/lib/auth";

export const GET = (request: Request) => {
	return getAuth().handler(request);
};

export const POST = (request: Request) => {
	return getAuth().handler(request);
};
