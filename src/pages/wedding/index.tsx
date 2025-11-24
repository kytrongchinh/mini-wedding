import useSeo from "@/hooks/useSeo";
import { CommonProps, CommonState } from "@/types/interface";
import React, { FC, useEffect, useState } from "react";
import { stagger, useAnimate } from "framer-motion";
import "./style.scss";
import _ from "lodash";
import couple from "@/assets/images/mi-mie/couple.png";
import chande from "@/assets/images/mi-mie/chande.png";
import date from "@/assets/images/mi-mie/date.png";
import { useNavigate } from "react-router-dom";
import { MY_ROUTERS } from "@/types/enums";
import swiper_img from "@/assets/images/swipe.png";
import { useRecoilValue } from "recoil";
import { campaignAtom } from "@/stores/campaign";
import myapi from "@/services/myapi";

const WeddingPage: FC<CommonProps> = () => {
	const navigate = useNavigate();
	const [scope, animate] = useAnimate();
	const campaignInfo = useRecoilValue(campaignAtom);
	const [wedding, setWedding] = useState<CommonState>({});
	useSeo({ title: `${campaignInfo?.wedding?.groom || "Ky Chin"} 囍 ${campaignInfo?.wedding?.bride || "Mi Mie"}`, description: "Welcome to the Home Page of My App!" });

	useEffect(() => {
		const animUp = document.querySelectorAll(".animUp");
		animate(animUp, { y: [20, 0], opacity: [0, 1] }, { type: "spring", delay: stagger(0.15) });
		loadWeddingInfo();
	}, []);

	const loadWeddingInfo = async () => {
		try {
			const myData = await myapi.getWeddingInfo();
			if (myData?.status == 200 && myData?.result?.data) {
				setWedding(myData?.result?.data);
			}
		} catch (error) {}
	};

	return (
		<div className="page-content wedding relative" ref={scope}>
			<div className="swipper w-10 absolute top-1/2 left-1 -translate-y-1/2 swipe-left-right z-10" onClick={() => navigate(MY_ROUTERS.HOME)}>
				<img className="swipper-img w-full" src={swiper_img} />
			</div>

			<div className="swipper w-10 absolute top-1/2 right-1 -translate-y-1/2 swipe-right-left z-10" onClick={() => navigate(MY_ROUTERS.WEDDING_TIMELINE)}>
				<img className="swipper-img w-full !rotate-90" src={swiper_img} />
			</div>

			<div className="container animUp w-full max-w-md mx-auto">
				<h2 className="wedding-title  tracking-wide mb-4 text-center uppercase">{wedding?.name || "Lễ vu quy"}</h2>

				<div className="flex justify-between text-sm md:text-base text-center">
					<div className="w-1/2">
						<h3 className="text-[#8B0000] font-bold text-lg">{wedding?.groom?.name || "NHÀ TRAI"}</h3>
						<p className="font-semibold">
							{wedding?.groom?.farther?.title || "Ông"}: <span className="uppercase">{wedding?.groom?.farther?.name || "Kỷ Trọng Văn"}</span>
							<br />
							{wedding?.groom?.mother?.title || "Bà"}: <span className="uppercase">{wedding?.groom?.mother?.name || "Huỳnh Thị Hiệp"}</span>
						</p>
						<p className="text-sm mt-1">{wedding?.groom?.address || "Đội 5, Trà Thung, Phù Mỹ Bắc, Gia Lai"}</p>
					</div>

					<div className="w-1/2">
						<h3 className="text-[#8B0000] font-bold text-lg">{wedding?.bride?.name || "NHÀ GÁI"}</h3>
						<p className="font-semibold">
							{wedding?.bride?.farther?.title || "Anh"}: <span className="uppercase">{wedding?.bride?.farther?.name || "Trần Xông Pha"}</span>
							<br />
							{wedding?.bride?.mother?.title || "Bà (Dì)"}: <span className="uppercase">{wedding?.bride?.mother?.name || "Lê Thị Đồng"}</span>
						</p>
						<p className="text-sm mt-1">{wedding?.bride?.address || "07 Hoàng Quốc Việt, Đức Lập, Lâm Đồng"}</p>
					</div>
				</div>
				<div className="relative flex justify-center items-center mt-6">
					<img src={chande} alt="chande" className="absolute translate-x-[30%] w-2/3 -bottom-5  left-0  object-contain z-0 opacity-90" />
					<div className="relative z-10 w-1/2 mx-auto">
						<img src={couple} alt="Cô dâu chú rể" className="w-full h-auto object-contain animUp" />
					</div>
				</div>

				<div className="wedding-name m-6">
					<div className="text-[30px] text-center">
						{campaignInfo?.wedding?.groom || "Ky Chin"} & {campaignInfo?.wedding?.bride || "Mi Mie"}
					</div>
				</div>
				<div className="text-center text-[#8B0000] font-sans mt-6">
					<div className="w-[55%] m-auto">
						<div className="img animUp">
							<img src={date} alt="" />
						</div>
					</div>

					<div className="text-lg md:text-xl font-semibold tracking-wide mb-1">
						{wedding?.time || "9:00"} <span className="text-sm font-normal">{wedding?.at || "SÁNG"}</span>
					</div>

					{/* Dòng phụ */}
					<div className="text-sm text-[#9b3030] italic">{wedding?.lunar_date || "Nhằm ngày 02.11 Năm Ất Tỵ"}</div>
				</div>
			</div>
		</div>
	);
};

export default WeddingPage;
