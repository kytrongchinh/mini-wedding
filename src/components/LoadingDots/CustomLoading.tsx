import React, { useState, useEffect } from "react";
import { Backdrop } from "@mui/material";
import { useRecoilValue } from "recoil";
import { loadingAtom } from "@/stores";

import text_loading from "@/assets/images/sayhi/loading/loading-text.png";

const CustomLoading = () => {
	const loading = useRecoilValue(loadingAtom);
	const [visibleBlocks, setVisibleBlocks] = useState(0);

	useEffect(() => {
		if (!loading) {
			setVisibleBlocks(0);
			return; // No need to start interval
		}

		setVisibleBlocks(0);

		const interval = setInterval(() => {
			setVisibleBlocks((prev) => (prev >= 7 ? 0 : prev + 1));
		}, 200);

		// Cleanup interval on unmount or when `loading` changes
		return () => clearInterval(interval);
	}, [loading]);

	const LoadingBar = () => (
		<div className="flex flex-col items-center gap-4">
			<div className="relative">
				{/* Loading Bar Container */}
				<div className="w-full h-8 bg-white border-2 border-fuchsia-500 rounded-lg relative overflow-hidden">
					{/* Progress Blocks */}
					<div className="flex h-full items-center px-0.5">
						{/* Blue-purple to red-purple gradient blocks with animation */}
						<div
							className={`w-6 h-5 bg-[#6864EC] mx-0.5 rounded-sm transition-all duration-300 ${visibleBlocks >= 1 ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
						></div>
						<div
							className={`w-6 h-5 bg-[#7260E6] mx-0.5 rounded-sm transition-all duration-300 ${visibleBlocks >= 2 ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
						></div>
						<div
							className={`w-6 h-5 bg-[#7B5CDF] mx-0.5 rounded-sm transition-all duration-300 ${visibleBlocks >= 3 ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
						></div>
						<div
							className={`w-6 h-5 bg-[#8557D9] mx-0.5 rounded-sm transition-all duration-300 ${visibleBlocks >= 4 ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
						></div>
						<div
							className={`w-6 h-5 bg-[#8F53D2] mx-0.5 rounded-sm transition-all duration-300 ${visibleBlocks >= 5 ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
						></div>
						<div
							className={`w-6 h-5 bg-[#984FCC] mx-0.5 rounded-sm transition-all duration-300 ${visibleBlocks >= 6 ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
						></div>
						<div
							className={`w-6 h-5 bg-[#A24BC5] mx-0.5 rounded-sm transition-all duration-300 ${visibleBlocks >= 7 ? "opacity-100 scale-100" : "opacity-0 scale-75"}`}
						></div>
					</div>
				</div>
			</div>
			<div className="text-loading w-[80px]">
				<img src={text_loading} />
			</div>
		</div>
	);

	return (
		<Backdrop open={loading} sx={{ zIndex: 100 }}>
			<LoadingBar />
		</Backdrop>
	);
};

export default CustomLoading;
