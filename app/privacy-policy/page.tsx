export default function PrivacyPolicyPage() {
	return (
		<div className="container mx-auto max-w-4xl py-12 px-4">
			<div className="rounded-xl border bg-card text-card-foreground shadow-sm">
				<div className="p-6 md:p-10">
					<h1 className="text-3xl font-bold tracking-tight mb-2">
						プライバシーポリシー
					</h1>

					<p className="text-sm text-muted-foreground mb-8">
						最終更新日: 2025年12月13日
					</p>

					<h2 className="text-xl font-semibold tracking-tight mt-8 mb-4">
						1. はじめに
					</h2>
					<p className="leading-7 mb-4">
						YourMix（以下「当サービス」といいます）は、ユーザーの個人情報の保護を最も重要な責務の一つと考えています。このプライバシーポリシーでは、当サービスが収集する情報、その利用方法、そしてユーザーの権利について説明します。
					</p>

					<h2 className="text-xl font-semibold tracking-tight mt-8 mb-4">
						2. 収集する情報
					</h2>
					<p className="leading-7 mb-4">
						当サービスは、ユーザーがアカウントを作成する際に、以下の情報を収集します。
					</p>
					<ul className="my-6 ml-6 list-disc [&>li]:mt-2">
						<li>氏名</li>
						<li>メールアドレス</li>
						<li>パスワード（暗号化されます）</li>
					</ul>
					<p className="leading-7 mb-4">
						また、サービスの利用状況に関する情報（例：作成したカクテル、いいねしたカクテルなど）も収集します。
					</p>

					<h2 className="text-xl font-semibold tracking-tight mt-8 mb-4">
						3. 情報の利用目的
					</h2>
					<p className="leading-7 mb-4">
						収集した情報は、以下の目的で利用します。
					</p>
					<ul className="my-6 ml-6 list-disc [&>li]:mt-2">
						<li>サービスの提供と運営のため</li>
						<li>ユーザーサポートのため</li>
						<li>利用規約に違反する行為への対応のため</li>
						<li>新機能やアップデートに関する情報提供のため</li>
					</ul>

					<h2 className="text-xl font-semibold tracking-tight mt-8 mb-4">
						4. 第三者への情報提供
					</h2>
					<p className="leading-7 mb-4">
						当サービスは、法令で定められている場合を除き、ユーザーの同意なく個人情報を第三者に提供することはありません。
					</p>
				</div>
			</div>
		</div>
	);
}
