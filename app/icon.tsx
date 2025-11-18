import { ImageResponse } from "next/og";

// Image metadata
export const size = {
	width: 32,
	height: 32,
};
export const contentType = "image/png";

// Image generation
export default function Icon() {
	return new ImageResponse(
		// ImageResponse JSX element
		// biome-ignore lint/a11y/noSvgWithoutTitle: <explanation>
		<svg
			width="32"
			height="32"
			viewBox="0 0 32 32"
			fill="none"
			xmlns="http://www.w3.org/2000/svg"
			style={{
				backgroundColor: "transparent",
			}}
		>
			<defs>
				<linearGradient id="liquidGradient" x1="0%" y1="0%" x2="100%" y2="100%">
					<stop offset="0%" stopColor="#FBBF24" />
					<stop offset="100%" stopColor="#F472B6" />
				</linearGradient>
			</defs>
			{/* グラスの液体部分 */}
			<path
				d="M6 12C6 10.8954 6.89543 10 8 10H24C25.1046 10 26 10.8954 26 12V14C20 18 12 18 6 14V12Z"
				fill="url(#liquidGradient)"
			/>
			{/* グラスの輪郭 */}
			<path
				d="M4 6H28L17.4286 18.2857C16.8571 19.1429 15.1429 19.1429 14.5714 18.2857L4 6Z"
				stroke="#4B5563"
				strokeWidth="2"
			/>
			{/* グラスの脚 */}
			<path d="M16 19V26" stroke="#4B5563" strokeWidth="2" />
			<path d="M12 26H20" stroke="#4B5563" strokeWidth="2" />
		</svg>,
		// ImageResponse options
		{
			// For convenience, we can re-use the exported icons size metadata
			...size,
		},
	);
}
