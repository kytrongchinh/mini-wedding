import useSeo from "@/hooks/useSeo";
import { CommonProps } from "@/types/interface";
import React, { FC, useEffect, useRef } from "react";
import { stagger, useAnimate } from "framer-motion";
import ButtonDefault from "@/components/ButtonDefault/ButtonDefault";
import "./style.scss";
import useAuth from "@/hooks/useAuth";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import _ from "lodash";

import cunghy from "@/assets/images/mi-mie/cung-hy.png";
import corner from "@/assets/images/mi-mie/frame-1.png";
import flower from "@/assets/images/mi-mie/flower.png";
import { MY_ROUTERS } from "@/types/enums";
import { useRecoilState, useRecoilValue } from "recoil";
import { paramsAtom } from "@/stores/params";
import myapi from "@/services/myapi";
import { inviteeAtom } from "@/stores/invitee";
import storage from "@/utils/storage";
import { campaignAtom } from "@/stores/campaign";

const HomePage: FC<CommonProps> = () => {
	const navigate = useNavigate();
	const [scope, animate] = useAnimate();
	const params = useParams();
	const [mparams, setMParams] = useRecoilState(paramsAtom);
	const [searchParams] = useSearchParams();
	const name = searchParams.get("name") || params?.name || mparams?.name;
	const [invitee, setInvitee] = useRecoilState(inviteeAtom);
	const campaignInfo = useRecoilValue(campaignAtom);
	useSeo({ title: `${campaignInfo?.wedding?.groom || "Ky Chin"} 囍 ${campaignInfo?.wedding?.bride || "Mi Mie"}`, description: "Welcome to the Home Page of My App!" });
	useEffect(() => {
		const animUp = document.querySelectorAll(".animUp");
		animate(animUp, { y: [20, 0], opacity: [0, 1] }, { type: "spring", delay: stagger(0.15) });

		// handleLogout();
		loadInvite();
	}, []);

	const loadInvite = async () => {
		try {
			if (name) {
				const myData = await myapi.getInvite(name);
				if (myData?.status == 200 && myData?.result?.data) {
					setInvitee(myData?.result?.data?.item);
					await storage.setStorage("inviteeInfo", myData?.result?.data?.item);
				}
			}
		} catch (error) {}
	};

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

					<div
						className="relative z-10 text-center px-6 py-10"
						onClick={() => {
							navigate(MY_ROUTERS.WEDDING);
						}}
					>
						<div className="w-1/3 m-auto">
							<div className="img animUp">
								<img src={cunghy} alt="" />
							</div>
						</div>

						<p className="text-sm tracking-wider !mt-4">SAVE THE DATE</p>
						<div className="wedding-name m-6">
							<div className="text-[40px] font-bold relative z-10 -left-8">{campaignInfo?.wedding?.groom || "Ky Chin"}</div>
							<div className="absolute left-5 -bottom-4 -translate-x-[60%] -translate-y-[30%] text-[60px] leading-none font-bold italic select-none z-0 opacity-30">
								&
							</div>
							<div className="text-[40px] font-bold relative z-10 mt-4 -right-8">{campaignInfo?.wedding?.bride || "Mi Mie"}</div>
						</div>
						{/* <div className="text-3xl my-10">💐</div> */}
						<div className="w-1/3 m-auto">
							<div className="img animUp">
								<img src={flower} alt="" />
							</div>
						</div>
						<p className="text-xs !mt-5">TRÂN TRỌNG KÍNH MỜI</p>
						{invitee?.name && (
							<h3 className="text-lg font-semibold mt-2 underline decoration-dotted">
								{invitee?.title} {invitee?.name}
							</h3>
						)}
						<div className="p-5 animUp z-10 w-full">
							<ButtonDefault text="Xem thiệp" buttonType="secondary z-10" align="center" onClick={() => navigate(MY_ROUTERS.WEDDING)} />
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default HomePage;
