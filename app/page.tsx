import CocktailMixer from "./_components/cocktail-mixer";
import Footer from "./_components/footer";
import Header from "./_components/header";

export default function Home() {
	return (
		<>
			<Header />
			<main>
				{/* カクテルミキサー（日替わりおすすめ機能を含む） */}
				<CocktailMixer />
			</main>
			<Footer />
		</>
	);
}
