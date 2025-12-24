export default function TermsOfServicePage() {
	return (
		<div className="container mx-auto max-w-4xl py-12 px-4">
			<div className="rounded-xl border bg-card text-card-foreground shadow-sm">
				<div className="p-6 md:p-10">
					<h1 className="text-3xl font-bold tracking-tight mb-2">利用規約</h1>

					<p className="text-sm text-muted-foreground mb-8">
						最終更新日: 2025年12月13日
					</p>

					<h2 className="text-xl font-semibold tracking-tight mt-8 mb-4">
						1. 適用範囲
					</h2>
					<p className="leading-7 mb-4">
						この利用規約（以下「本規約」といいます）は、YourMix（以下「当サービス」といいます）が提供するサービス（以下「本サービス」といいます）の利用に関する条件を定めるものです。本サービスをご利用いただくには、本規約に同意いただく必要があります。
					</p>

					<h2 className="text-xl font-semibold tracking-tight mt-8 mb-4">
						2. アカウント
					</h2>
					<p className="leading-7 mb-4">
						本サービスを利用するためにアカウントを登録する場合、ユーザーは正確かつ最新の情報を提供する必要があります。ユーザーは、自身のパスワードおよびアカウント情報の機密性を維持する責任を負います。
					</p>

					<h2 className="text-xl font-semibold tracking-tight mt-8 mb-4">
						3. 禁止事項
					</h2>
					<p className="leading-7 mb-4">
						ユーザーは、本サービスの利用にあたり、以下の行為を行ってはなりません。
					</p>
					<ul className="my-6 ml-6 list-disc [&>li]:mt-2">
						<li>法令または公序良俗に違反する行為</li>
						<li>犯罪行為に関連する行為</li>
						<li>
							当サービス、他のユーザー、または第三者の著作権、商標権、その他の知的財産権を侵害する行為
						</li>
						<li>
							当サービス、他のユーザー、または第三者の財産、プライバシー、名誉、信用などを侵害する行為
						</li>
						<li>本サービスの運営を妨害する行為</li>
						<li>その他、当サービスが不適切と判断する行為</li>
					</ul>

					<h2 className="text-xl font-semibold tracking-tight mt-8 mb-4">
						4. サービスの中断・停止
					</h2>
					<p className="leading-7 mb-4">
						当サービスは、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を中断または停止することができます。
					</p>
					<ul className="my-6 ml-6 list-disc [&>li]:mt-2">
						<li>
							本サービスにかかるコンピュータシステムの保守点検または更新を行う場合
						</li>
						<li>
							地震、落雷、火災、停電または天災などの不可抗力により、本サービスの運営が困難となった場合
						</li>
						<li>コンピュータまたは通信回線等が事故により停止した場合</li>
						<li>その他、当サービスが本サービスの提供が困難と判断した場合</li>
					</ul>

					<h2 className="text-xl font-semibold tracking-tight mt-8 mb-4">
						5. 免責事項
					</h2>
					<p className="leading-7 mb-4">
						当サービスは、本サービスに起因してユーザーに生じたあらゆる損害について、一切の責任を負いません。当サービスは、本サービスに関して、ユーザーと他のユーザーまたは第三者との間において生じたトラブルについても、一切の責任を負いません。
					</p>

					<h2 className="text-xl font-semibold tracking-tight mt-8 mb-4">
						6. 規約の変更
					</h2>
					<p className="leading-7 mb-4">
						当サービスは、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。変更後の利用規約は、本ウェブサイトに掲載された時点から効力を生じるものとします。
					</p>

					<h2 className="text-xl font-semibold tracking-tight mt-8 mb-4">
						7. 準拠法・裁判管轄
					</h2>
					<p className="leading-7 mb-4">
						本規約の解釈にあたっては、日本法を準拠法とします。本サービスに関して紛争が生じた場合には、当サービスの本店所在地を管轄する裁判所を専属的合意管轄とします。
					</p>
				</div>
			</div>
		</div>
	);
}
