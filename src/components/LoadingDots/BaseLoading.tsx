import React, { FC } from "react";
import "./baseloading.scss";
import { Backdrop } from "@mui/material";
interface LoadingDotsProps {
	open?: boolean;
	text?: string;
	className?: string;
	size?: "small" | "medium" | "large" | "";
}
import text_loading from "@/assets/images/sayhi/loading/loading-text.png";

const BaseLoading: FC<LoadingDotsProps> = ({ open = false, text = "Đang tải dữ liệu...", className = "", size = "medium" }) => {
	return (
		<Backdrop
			open={open}
			sx={{
				zIndex: 1300,
				color: "#fff",
				backgroundColor: "rgba(0, 0, 0, 0.7)", // màu tối để che
				backdropFilter: "blur(5px)",
			}}
			invisible={false}
		>
			<div className={`loading-base ${className} loading-base--${size}`}>
				<div className="loading-base-inner">
					<div className="loading-container">
						<div className="loading-item"></div>
						<div className="loading-item"></div>
						<div className="loading-item"></div>
						<div className="loading-item"></div>
						<div className="loading-item"></div>
						<div className="loading-item"></div>
						<div className="loading-item"></div>
						<div className="loading-item"></div>
					</div>
					<div className="text-loading">
						<img src={text_loading} />
					</div>
					<div className="loading-base-text" dangerouslySetInnerHTML={{ __html: text }} />
				</div>
			</div>
		</Backdrop>
	);
};

export default BaseLoading;
