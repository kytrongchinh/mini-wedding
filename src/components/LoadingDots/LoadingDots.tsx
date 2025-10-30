import React, { FC } from "react";
import "./styles.scss";

interface LoadingDotsProps {
    text?: string;
    className?: string;
    size?: "small" | "medium" | "large";
}

const LoadingDots: FC<LoadingDotsProps> = ({
    text = "Đang tải dữ liệu...",
    className = "",
    size = "medium"
}) => {
    return (
        <div className={`loading-dots ${className} loading-dots--${size}`}>
            <div className="loading-dots-inner">
                <div className="loading-dots-icon">
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                    <div className="loading-dot"></div>
                </div>
                {text && (
                    <div className="loading-dots-text">
                        {text}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoadingDots;