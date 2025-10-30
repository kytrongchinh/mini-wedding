import React, { FC, useState, useEffect } from "react";
import "./styles.scss";

interface CountdownTimerProps {
    targetTime: Date; // Thời gian đích để đếm lùi
    className?: string;
    onTimeUp?: () => void; // Callback khi hết thời gian
    onTimeChange?: (isTimeUp: boolean) => void; // Callback để báo trạng thái thời gian
}

const CountdownTimer: FC<CountdownTimerProps> = ({
    targetTime,
    className = "",
    onTimeUp,
    onTimeChange
}) => {
    const [timeLeft, setTimeLeft] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0
    });
    const [isTimeUp, setIsTimeUp] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const now = new Date().getTime();
            const target = new Date(targetTime).getTime();
            const difference = target - now;

            if (difference > 0) {
                const hours = Math.floor(difference / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                setTimeLeft({ hours, minutes, seconds });
                
                // Báo cho parent biết thời gian vẫn còn
                if (isTimeUp) {
                    setIsTimeUp(false);
                    onTimeChange?.(false);
                }
            } else {
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
                
                // Báo cho parent biết đã hết thời gian
                if (!isTimeUp) {
                    setIsTimeUp(true);
                    onTimeChange?.(true);
                    onTimeUp?.();
                }
            }
        };

        // Tính toán thời gian ban đầu
        calculateTimeLeft();

        // Cập nhật mỗi giây
        const timer = setInterval(calculateTimeLeft, 1000);

        return () => clearInterval(timer);
    }, [targetTime, onTimeUp, onTimeChange, isTimeUp]);

    const formatNumber = (num: number): string => {
        return num.toString().padStart(2, '0');
    };

    return (
        <div className={`countdown-timer ${className}`}>
            <div className="timer-display">
                <div className="time-block">
                    <div className="time-value">{formatNumber(timeLeft.hours)}</div>
                    <div className="time-label">Giờ</div>
                </div>
                <div className="time-separator">:</div>
                <div className="time-block">
                    <div className="time-value">{formatNumber(timeLeft.minutes)}</div>
                    <div className="time-label">Phút</div>
                </div>
                <div className="time-separator">:</div>
                <div className="time-block">
                    <div className="time-value">{formatNumber(timeLeft.seconds)}</div>
                    <div className="time-label">Giây</div>
                </div>
            </div>
        </div>
    );
};

export default CountdownTimer;