import { Card, CardContent, Container, Typography } from "@mui/material";

export default function TermsOfServicePage() {
	return (
		<Container maxWidth="lg" className="my-8">
			<Card>
				<CardContent>
					<Typography variant="h4" component="h1" gutterBottom>
						利用規約
					</Typography>

					<Typography variant="body1" component="p">
						最終更新日: 2025年12月13日
					</Typography>

					<Typography variant="h6" component="h2" gutterBottom>
						1. 適用範囲
					</Typography>
					<Typography variant="body1" component="p">
						この利用規約（以下「本規約」といいます）は、YourMix（以下「当サービス」といいます）が提供するサービス（以下「本サービス」といいます）の利用に関する条件を定めるものです。本サービスをご利用いただくには、本規約に同意いただく必要があります。
					</Typography>

					<Typography variant="h6" component="h2" gutterBottom>
						2. アカウント
					</Typography>
					<Typography variant="body1" component="p">
						本サービスを利用するためにアカウントを登録する場合、ユーザーは正確かつ最新の情報を提供する必要があります。ユーザーは、自身のパスワードおよびアカウント情報の機密性を維持する責任を負います。
					</Typography>

					<Typography variant="h6" component="h2" gutterBottom>
						3. 禁止事項
					</Typography>
					<Typography variant="body1" component="p">
						ユーザーは、本サービスの利用にあたり、以下の行為を行ってはなりません。
					</Typography>
					<ul>
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

					<Typography variant="h6" component="h2" gutterBottom>
						4. サービスの中断・停止
					</Typography>
					<Typography variant="body1" component="p">
						当サービスは、以下のいずれかの事由があると判断した場合、ユーザーに事前に通知することなく本サービスの全部または一部の提供を中断または停止することができます。
					</Typography>
					<ul>
						<li>
							本サービスにかかるコンピュータシステムの保守点検または更新を行う場合
						</li>
						<li>
							地震、落雷、火災、停電または天災などの不可抗力により、本サービスの運営が困難となった場合
						</li>
						<li>コンピュータまたは通信回線等が事故により停止した場合</li>
						<li>その他、当サービスが本サービスの提供が困難と判断した場合</li>
					</ul>

					<Typography variant="h6" component="h2" gutterBottom>
						5. 免責事項
					</Typography>
					<Typography variant="body1" component="p">
						当サービスは、本サービスに起因してユーザーに生じたあらゆる損害について、一切の責任を負いません。当サービスは、本サービスに関して、ユーザーと他のユーザーまたは第三者との間において生じたトラブルについても、一切の責任を負いません。
					</Typography>

					<Typography variant="h6" component="h2" gutterBottom>
						6. 規約の変更
					</Typography>
					<Typography variant="body1" component="p">
						当サービスは、必要と判断した場合には、ユーザーに通知することなくいつでも本規約を変更することができるものとします。変更後の利用規約は、本ウェブサイトに掲載された時点から効力を生じるものとします。
					</Typography>

					<Typography variant="h6" component="h2" gutterBottom>
						7. 準拠法・裁判管轄
					</Typography>
					<Typography variant="body1" component="p">
						本規約の解釈にあたっては、日本法を準拠法とします。本サービスに関して紛争が生じた場合には、当サービスの本店所在地を管轄する裁判所を専属的合意管轄とします。
					</Typography>
				</CardContent>
			</Card>
		</Container>
	);
}
