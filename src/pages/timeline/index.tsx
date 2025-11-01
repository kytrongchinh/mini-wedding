import useSeo from "@/hooks/useSeo";
import { CommonProps } from "@/types/interface";
import React, { FC, useEffect } from "react";
import { stagger, useAnimate } from "framer-motion";
import "./style.scss";
import _ from "lodash";

import ring from "@/assets/images/mi-mie/rings.png";
import heart from "@/assets/images/mi-mie/heart.png";
import bride from "@/assets/images/mi-mie/bride.png";
import perid from "@/assets/images/mi-mie/perid.png";
import groom from "@/assets/images/mi-mie/groom.png";
import chuhy from "@/assets/images/mi-mie/chu-hy.png";

const TimelinePage: FC<CommonProps> = () => {
	useSeo({ title: "Trọng Chính 囍 Trường Mi", description: "Welcome to the Home Page of My App!" });
	const [scope, animate] = useAnimate();

	useEffect(() => {
		const animUp = document.querySelectorAll(".animUp");
		animate(animUp, { y: [20, 0], opacity: [0, 1] }, { type: "spring", delay: stagger(0.15) });
	}, []);

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
							<p className="text-base !text-[14px]">11:00 21.12.2025 </p>
							<h3 className="text-[#8B0000] font-bold text-lg">NHÀ GÁI</h3>
							<p className="font-semibold">TIỆC RƯỢU</p>
							<p className="text-sm mt-1 italic">Nhà hàng Tuấn Thảo </p>
						</div>

						<div className="section mt-40">
							<p className="text-base !text-[14px]">10:00 25.12.2025</p>
							<h3 className="text-[#8B0000] font-bold text-lg">LỄ GIA TIÊN</h3>
							<p className="font-semibold">Tư gia nhà trai</p>
							<p className="text-sm mt-1 italic">Đội 5, Trà Thung, Phù Mỹ Bắc, Gia Lai </p>
						</div>
					</div>

					<div className="items-end flex flex-col">
						<div className="m-auto">
							<img src={perid} alt="" className="w-full" />
						</div>
					</div>

					<div className="w-full">
						<div className="section">
							<p className="text-base !text-[14px]">9:00 21.12.2025 </p>
							<h3 className="text-[#8B0000] font-bold text-lg">LỄ GIA TIÊN</h3>
							<p className="font-semibold">Tư gia nhà gái</p>
							<p className="text-sm mt-1 italic">07 Hoàng Quốc Việt, Đức Lập, Lâm Đồng </p>
						</div>

						<div className="m-auto mt-10">
							<div className="img animUp w-2/3 m-auto">
								<img src={groom} alt="" />
							</div>
						</div>

						<div className="section mt-40">
							<p className="text-base !text-[14px]">11:30 25.12.2025 </p>
							<h3 className="text-[#8B0000] font-bold text-lg">TIỆC RƯỢU</h3>
							<p className="text-sm mt-1 italic">Nhà hàng Thanh Hường </p>
						</div>
					</div>
				</div>

				<div className="text-center text-[#8B0000] font-sans mt-6">
					<div className="w-[30%] m-auto">
						<div className="img animUp">
							<img src={ring} alt="" />
						</div>
					</div>

					<div className="text-sm relative mt-5">
						<div className="animUp absolute right-[-5px] top-[-40px]">
							<img src={heart} alt="" className="w-[50%] opacity-80" />
						</div>
						Sự hiện hiện của<span className="text-sm font-bold italic "> XXX</span>
					</div>
					<div className="text-sm">là niềm vinh hạnh của gia đình.</div>
				</div>
				<div className="timeline-name m-2 opacity-35">
					<div className="text-[20px] text-center">Trọng Chính & Trường Mi</div>
				</div>
			</div>
		</div>
	);
};

export default TimelinePage;
