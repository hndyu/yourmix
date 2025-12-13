import { Card, CardContent, Container, Typography } from "@mui/material";

export default function PrivacyPolicyPage() {
	return (
		<Container maxWidth="lg" className="my-8">
			<Card>
				<CardContent>
					<Typography variant="h4" component="h1" gutterBottom>
						プライバシーポリシー
					</Typography>

					<Typography variant="body1" component="p">
						最終更新日: 2025年12月13日
					</Typography>

					<Typography variant="h6" component="h2" gutterBottom>
						1. はじめに
					</Typography>
					<Typography variant="body1" component="p">
						YourMix（以下「当サービス」といいます）は、ユーザーの個人情報の保護を最も重要な責務の一つと考えています。このプライバシーポリシーでは、当サービスが収集する情報、その利用方法、そしてユーザーの権利について説明します。
					</Typography>

					<Typography variant="h6" component="h2" gutterBottom>
						2. 収集する情報
					</Typography>
					<Typography variant="body1" component="p">
						当サービスは、ユーザーがアカウントを作成する際に、以下の情報を収集します。
					</Typography>
					<ul>
						<li>氏名</li>
						<li>メールアドレス</li>
						<li>パスワード（暗号化されます）</li>
					</ul>
					<Typography variant="body1" component="p">
						また、サービスの利用状況に関する情報（例：作成したカクテル、いいねしたカクテルなど）も収集します。
					</Typography>

					<Typography variant="h6" component="h2" gutterBottom>
						3. 情報の利用目的
					</Typography>
					<Typography variant="body1" component="p">
						収集した情報は、以下の目的で利用します。
						<ul>
							<li>サービスの提供と運営のため</li>
							<li>ユーザーサポートのため</li>
							<li>利用規約に違反する行為への対応のため</li>
							<li>新機能やアップデートに関する情報提供のため</li>
						</ul>
					</Typography>

					<Typography variant="h6" component="h2" gutterBottom>
						4. 第三者への情報提供
					</Typography>
					<Typography variant="body1" component="p">
						当サービスは、法令で定められている場合を除き、ユーザーの同意なく個人情報を第三者に提供することはありません。
					</Typography>
				</CardContent>
			</Card>
		</Container>
	);
}
