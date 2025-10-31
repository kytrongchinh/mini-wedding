import useSeo from "@/hooks/useSeo";
import { CommonProps } from "@/types/interface";
import React, { FC, useEffect } from "react";
import { stagger, useAnimate } from "framer-motion";
import ButtonDefault from "@/components/ButtonDefault/ButtonDefault";
import "./style.scss";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import _ from "lodash";

import cunghy from "@/assets/images/mi-mie/cung-hy.png";
import corner from "@/assets/images/mi-mie/frame-1.png";
import flower from "@/assets/images/mi-mie/flower.png";
import { MY_ROUTERS } from "@/types/enums";

const HomePage: FC<CommonProps> = () => {
	useSeo({ title: "Trọng Chính 囍 Trường Mi", description: "Welcome to the Home Page of My App!" });
	const { user, handleLogin, handleLogout } = useAuth();
	const navigate = useNavigate();
	const [scope, animate] = useAnimate();

	useEffect(() => {
		const animUp = document.querySelectorAll(".animUp");
		animate(animUp, { y: [20, 0], opacity: [0, 1] }, { type: "spring", delay: stagger(0.15) });

		// handleLogout();
	}, []);

	return (
		<div className="page-content homepage" ref={scope}>
			<div className="container">
				<div className="relative bg-[#a40000] text-[#fcf7e3] w-full max-w-[400px] aspect-auto flex flex-col items-center justify-center overflow-hidden">
					<svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 480" preserveAspectRatio="none">
						<line x1="45" y1="0.5" x2="275" y2="0.5" stroke="rgb(252,247,227)" strokeWidth="1" />
						<line x1="45" y1="479.5" x2="275" y2="479.5" stroke="rgb(252,247,227)" strokeWidth="1" />
						<line x1="0.5" y1="45" x2="0.5" y2="435" stroke="rgb(252,247,227)" strokeWidth="1" />
						<line x1="319.5" y1="45" x2="319.5" y2="435" stroke="rgb(252,247,227)" strokeWidth="1" />
					</svg>

					<img src={corner} className="absolute top-0 left-0 w-12 h-12" alt="corner top left" />
					<img src={corner} className="absolute top-0 right-0 w-12 h-12 scale-x-[-1]" alt="corner top right" />
					<img src={corner} className="absolute bottom-0 left-0 w-12 h-12 scale-y-[-1]" alt="corner bottom left" />
					<img src={corner} className="absolute bottom-0 right-0 w-12 h-12 scale-[-1]" alt="corner bottom right" />

					<div className="relative z-10 text-center px-6 py-10">
						<div className="w-1/3 m-auto">
							<div className="img animUp">
								<img src={cunghy} alt="" />
							</div>
						</div>

						<p className="text-sm tracking-wider !mt-4">SAVE THE DATE</p>
						<div className="wedding-name m-6">
							<div className="text-[40px] font-bold relative z-10 -left-8">Trọng Chính</div>
							<div className="absolute left-5 -bottom-4 -translate-x-[60%] -translate-y-[30%] text-[60px] leading-none font-bold italic select-none z-0 opacity-30">
								&
							</div>
							<div className="text-[40px] font-bold relative z-10 mt-4 -right-8">Trường Mi</div>
						</div>
						{/* <div className="text-3xl my-10">💐</div> */}
						<div className="w-1/3 m-auto">
							<div className="img animUp">
								<img src={flower} alt="" />
							</div>
						</div>
						<p className="text-xs !mt-5">TRÂN TRỌNG KÍNH MỜI</p>
						{/* <h3 className="text-lg font-semibold mt-2">Gia đình Dì Xuân</h3> */}
						<div className="p-5 animUp">
							<ButtonDefault text="Tham Gia Ngay" buttonType="secondary" align="center" onClick={() => navigate(MY_ROUTERS.WEDDING)} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
