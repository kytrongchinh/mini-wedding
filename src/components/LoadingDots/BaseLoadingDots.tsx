import React, { FC } from "react";
import "./styles.scss";
import { Backdrop } from "@mui/material";
interface LoadingDotsProps {
	open?: boolean;
	text?: string;
	className?: string;
	size?: "small" | "medium" | "large" | "";
}

const BaseLoadingDots: FC<LoadingDotsProps> = ({ open = false, text = "Đang tải dữ liệu...", className = "", size = "medium" }) => {
	return (
		<Backdrop
			open={open}
			sx={{
				zIndex: 1300,
				color: "#fff",
				backgroundColor: "rgba(0, 0, 0, 0.7)", // màu tối để che
				backdropFilter: "blur(2px)",
			}}
			invisible={false}
		>
			<div className={`loading-dots ${className} loading-dots--${size}`}>
				<div className="loading-dots-inner">
					<div className="loading-container">
						<div className="loading-continue"></div>
					</div>
					{text && <div className="loading-dots-text" dangerouslySetInnerHTML={{ __html: text }} />}
				</div>
			</div>
		</Backdrop>
	);
};

export default BaseLoadingDots;
