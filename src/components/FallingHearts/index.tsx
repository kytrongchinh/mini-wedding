import React, { useEffect, useState } from "react";
import "./FallingHearts.scss";

type Heart = {
	id: number;
	left: number;
	size: number;
	icon: string;
};

import img from "@/assets/images/heart.png";

const heartIcons = [img, img, img, img, img, img];

export default function FallingHearts() {
	const [hearts, setHearts] = useState<Heart[]>([]);

	useEffect(() => {
		const interval = setInterval(() => {
			const icon = heartIcons[Math.floor(Math.random() * heartIcons.length)];

			const newHeart: Heart = {
				id: Date.now(),
				left: Math.random() * 90, // vị trí ngang %
				size: 30 + Math.random() * -20, // px
				icon,
			};

			setHearts((prev) => [...prev, newHeart]);

			setTimeout(() => {
				setHearts((prev) => prev.filter((h) => h.id !== newHeart.id));
			}, 20000); // xóa sau 5s
		}, 500);

		return () => clearInterval(interval);
	}, []);

	return (
		<div className="falling-hearts-container relative z-30">
			{hearts.map((heart) => (
				<img
					key={heart.id}
					src={heart.icon}
					alt="heart"
					className="falling-heart"
					style={{
						left: `${heart.left}%`,
						width: `${heart.size}px`,
						height: `${heart.size}px`,
					}}
				/>
			))}
		</div>
	);
}
