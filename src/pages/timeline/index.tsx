import useSeo from "@/hooks/useSeo";
import { CommonProps, CommonState } from "@/types/interface";
import React, { FC, useEffect, useState } from "react";
import { stagger, useAnimate } from "framer-motion";
import "./style.scss";
import _ from "lodash";

import ring from "@/assets/images/mi-mie/rings.png";
import heart from "@/assets/images/mi-mie/heart.png";
import bride from "@/assets/images/mi-mie/bride.png";
import perid from "@/assets/images/mi-mie/perid.png";
import groom from "@/assets/images/mi-mie/groom.png";
import chuhy from "@/assets/images/mi-mie/chu-hy.png";
import { useRecoilValue } from "recoil";
import { inviteeAtom } from "@/stores/invitee";
import myapi from "@/services/myapi";
import { campaignAtom } from "@/stores/campaign";

const TimelinePage: FC<CommonProps> = () => {
	const [scope, animate] = useAnimate();

	const invitee = useRecoilValue(inviteeAtom);
	const [timline, setTimeline] = useState<CommonState>({});
	useEffect(() => {
		const animUp = document.querySelectorAll(".animUp");
		animate(animUp, { y: [20, 0], opacity: [0, 1] }, { type: "spring", delay: stagger(0.15) });
		loadTimelineInfo();
	}, []);

	const campaignInfo = useRecoilValue(campaignAtom);
	useSeo({ title: `${campaignInfo?.wedding?.groom || "Ky Chin"} 囍 ${campaignInfo?.wedding?.bride || "Mi Mie"}`, description: "Welcome to the Home Page of My App!" });

	const loadTimelineInfo = async () => {
		try {
			const myData = await myapi.getTimeline();
			if (myData?.status == 200 && myData?.result?.data) {
				setTimeline(myData?.result?.data);
			}
		} catch (error) {}
	};

	return (
		<div className="page-content timeline" ref={scope}>
			<div className="container animUp ">
				<div className="mtitle relative">
					<h2 className="timeline-title  tracking-wide mb-9 text-center">WEDDING</h2>
					<h2 className="mtitle-timeline timeline-title  tracking-wide mb-4 text-center">Timline</h2>
				</div>

				<div className="relative flex justify-center items-start text-sm md:text-base text-center w-full gap-3">
					<div className="img-hide absolute w-[65%] m-auto top-10  z-10 opacity-[4%]">
						<img src={chuhy} alt="date" className="w-full m-auto" />
					</div>
					<div className="w-full">
						<div className="m-auto">
							<div className="img animUp w-2/3 m-auto">
								<img src={bride} alt="" />
							</div>
						</div>
						<div className="section mt-10">
							<p className="text-base !text-[14px]">{timline?.bride?.party?.time || "11:00 21.12.2025"} </p>
							<h3 className="text-[#8B0000] font-bold text-lg">{timline?.bride?.party?.name || "TIỆC RƯỢU"}</h3>
							{/* <p className="font-semibold">TIỆC RƯỢU</p> */}
							<p className="text-sm mt-1 italic">{timline?.bride?.party?.at || "Nhà hàng Tuấn Thảo"} </p>
						</div>

						<div className="section mt-40">
							<p className="text-base !text-[14px]">{timline?.groom?.ancestral_ceremony?.time || "10:00 25.12.2025"}</p>
							<h3 className="text-[#8B0000] font-bold text-lg">{timline?.groom?.ancestral_ceremony?.name || "LỄ GIA TIÊN"}</h3>
							<p className="font-semibold">{timline?.groom?.ancestral_ceremony?.at || "Tư gia nhà trai"}</p>
							<p className="text-sm mt-1 italic">{timline?.groom?.ancestral_ceremony?.address || "Đội 5, Trà Thung, Phù Mỹ Bắc, Gia Lai "}</p>
						</div>
					</div>

					<div className="items-end flex flex-col">
						<div className="m-auto">
							<img src={perid} alt="" className="w-full" />
						</div>
					</div>

					<div className="w-full">
						<div className="section">
							<p className="text-base !text-[14px]">{timline?.bride?.ancestral_ceremony?.time || "9:00 21.12.2025"} </p>
							<h3 className="text-[#8B0000] font-bold text-lg">{timline?.bride?.ancestral_ceremony?.name || "LỄ GIA TIÊN"}</h3>
							<p className="font-semibold">{timline?.bride?.ancestral_ceremony?.at || "Tư gia nhà gái"}</p>
							<p className="text-sm mt-1 italic">{timline?.bride?.ancestral_ceremony?.address || "07 Hoàng Quốc Việt, Đức Lập, Lâm Đồng "}</p>
						</div>

						<div className="m-auto mt-10">
							<div className="img animUp w-2/3 m-auto">
								<img src={groom} alt="" />
							</div>
						</div>

						<div className="section mt-40">
							<p className="text-base !text-[14px]">{timline?.groom?.party?.time || "11:30 25.12.2025 "}</p>
							<h3 className="text-[#8B0000] font-bold text-lg">{timline?.groom?.party?.time || "TIỆC RƯỢU"}</h3>
							<p className="text-sm mt-1 italic">{timline?.groom?.party?.time || "Nhà hàng Thanh Hường "}</p>
						</div>
					</div>
				</div>

				<div className="text-center text-[#8B0000] font-sans mt-6">
					<div className="w-[30%] m-auto">
						<div className="img animUp">
							<img src={ring} alt="" />
						</div>
					</div>

					<div className="section mt-5">
						<h3 className="text-[#8B0000] font-bold text-lg underline">{timline?.wedding_party?.name || "TIỆC BÁO HỶ"}</h3>
						<p className="text-base !text-[14px]">{timline?.wedding_party?.time || "19h 08.01.2026 "}</p>

						<p className="font-semibold">{timline?.wedding_party?.at || "Én Restaurant & Event Space"}</p>
						<p className="text-sm mt-1 italic">{timline?.wedding_party?.address || "Robot Tower, 308C Điện Biên Phủ, Phường 4, Quận 3, Thành phố Hồ Chí Minh"}</p>
					</div>

					<div className="text-sm relative mt-5">
						<div className="animUp absolute right-[-5px] top-[-40px]">
							<img src={heart} alt="" className="w-[50%] opacity-80" />
						</div>
						Sự hiện hiện của{" "}
						{invitee?.name && (
							<span className="text-sm font-bold italic underline decoration-dotted">
								{invitee?.title} {invitee?.name}
							</span>
						)}
						{!invitee?.name && <span className="text-sm font-bold italic ">Quý khách</span>}
					</div>
					<div className="text-sm">là niềm vinh hạnh của gia đình.</div>
				</div>
				<div className="timeline-name m-2 opacity-35">
					<div className="text-[20px] text-center">
						{campaignInfo?.wedding?.groom || "Ky Chin"} & {campaignInfo?.wedding?.bride || "Mi Mie"}
					</div>
				</div>
			</div>
		</div>
	);
};

export default TimelinePage;
