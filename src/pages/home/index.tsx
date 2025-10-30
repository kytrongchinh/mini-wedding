import useSeo from "@/hooks/useSeo";
import { CommonProps } from "@/types/interface";
import React, { FC, useEffect } from "react";
import { stagger, useAnimate } from "framer-motion";
import ButtonDefault from "@/components/ButtonDefault/ButtonDefault";
import "./style.scss";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import _ from "lodash";

import logo from "@/assets/images/logo.png";
import { MY_ROUTERS } from "@/types/enums";

const HomePage: FC<CommonProps> = () => {
	useSeo({ title: "Trang chủ", description: "Welcome to the Home Page of My App!" });
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
			<div className="banner">
				<div className="logo">
					<div className="img animUp">
						<img src={logo} alt="" />
					</div>
				</div>
				<div className="title bold mb-12 animUp">CAMPAIGN ADTIMA</div>
				<p className="animUp">
					Lorem ipsum dolor sit, amet consectetur adipisicing elit. Obcaecati qui dignissimos cumque aliquam dolor veniam corporis debitis quisquam sint consectetur,
					alias vero nam minima! Quam enim aut error tempora blanditiis.
				</p>
				<div className="p-5 animUp">
					{!user && <ButtonDefault text="Tham Gia Ngay" buttonType="secondary" align="center" onClick={() => handleLogin(MY_ROUTERS.SCAN)} />}
					{user && <ButtonDefault text="Tham Gia Ngay" buttonType="secondary" align="center" onClick={() => navigate(MY_ROUTERS.SCAN)} />}
				</div>
			</div>
		</div>
	);
};

export default HomePage;
