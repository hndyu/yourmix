"use client";

import * as React from "react";

export default function CocktailDisplaySkeleton() {
	return (
		<div className="w-full max-w-5xl mx-auto px-4 py-8">
			<div className="bg-card border border-border rounded-[32px] overflow-hidden shadow-2xl">
				{/* Image Hero Skeleton */}
				<div className="w-full aspect-[2/1] md:aspect-[3/1] bg-muted animate-pulse" />

				<div className="p-6 md:p-10">
					{/* Header Skeleton */}
					<div className="flex flex-col gap-4 mb-8 border-b border-border pb-8">
						<div className="h-12 w-3/4 md:w-1/2 bg-muted rounded animate-pulse" />
						<div className="h-6 w-full md:w-2/3 bg-muted rounded animate-pulse" />
						<div className="flex gap-2 mt-2">
							<div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
							<div className="h-6 w-20 bg-muted rounded-full animate-pulse" />
						</div>
					</div>

					{/* Content Grid Skeleton */}
					<div className="grid md:grid-cols-2 gap-12">
						{/* Ingredients */}
						<div>
							<div className="h-8 w-24 bg-muted rounded mb-6 animate-pulse" />
							<div className="space-y-4">
								{[1, 2, 3, 4].map((id) => (
									<div
										key={id}
										className="h-16 bg-muted/50 rounded-xl animate-pulse"
									/>
								))}
							</div>
						</div>

						{/* Instructions */}
						<div>
							<div className="h-8 w-24 bg-muted rounded mb-6 animate-pulse" />
							<div className="space-y-6">
								{[1, 2, 3, 4].map((id) => (
									<div key={id} className="flex gap-4">
										<div className="w-8 h-8 rounded-full bg-muted shrink-0 animate-pulse" />
										<div className="flex-1 h-20 bg-muted/50 rounded animate-pulse" />
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
