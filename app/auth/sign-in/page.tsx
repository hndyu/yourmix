import { Suspense } from "react";
import SignInForm from "./_components/sign-in-form";

export default function SignInPage() {
	return (
		<Suspense
			fallback={
				<div className="flex justify-center items-center min-h-[60vh]">
					<div className="w-8 h-8 border-4 border-stone-800 border-t-primary rounded-full animate-spin" />
				</div>
			}
		>
			<SignInForm />
		</Suspense>
	);
}
