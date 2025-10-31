import useSeo from "@/hooks/useSeo";
import { CommonProps } from "@/types/interface";
import React, { FC, useEffect } from "react";
import { stagger, useAnimate } from "framer-motion";
import "./style.scss";
import _ from "lodash";
import couple from "@/assets/images/mi-mie/couple.png";
import chande from "@/assets/images/mi-mie/chande.png";

const WeddingPage: FC<CommonProps> = () => {
	useSeo({ title: "Trọng Chính 囍 Trường Mi", description: "Welcome to the Home Page of My App!" });
	const [scope, animate] = useAnimate();

	useEffect(() => {
		const animUp = document.querySelectorAll(".animUp");
		animate(animUp, { y: [20, 0], opacity: [0, 1] }, { type: "spring", delay: stagger(0.15) });
	}, []);

	return (
		<div className="page-content wedding" ref={scope}>
			<div className="container animUp w-full max-w-md mx-auto">
				<h2 className="wedding-title  tracking-wide mb-4 text-center">LỄ VU QUY</h2>

				<div className="flex justify-between text-sm md:text-base text-center">
					<div className="w-1/2">
						<h3 className="text-[#8B0000] font-bold text-lg">NHÀ GÁI</h3>
						<p className="font-semibold">
							Ông (Chú): <span className="uppercase">Trần Văn Bảy</span>
							<br />
							Bà (Dì): <span className="uppercase">Lê Thị Đồng</span>
						</p>
						<p className="text-sm mt-1">07 Hoàng Quốc Việt, Đức Lập, Lâm Đồng</p>
					</div>

					<div className="w-1/2">
						<h3 className="text-[#8B0000] font-bold text-lg">NHÀ TRAI</h3>
						<p className="font-semibold">
							Ông: <span className="uppercase">Kỷ Trọng Văn</span>
							<br />
							Bà: <span className="uppercase">Huỳnh Thị Hiệp</span>
						</p>
						<p className="text-sm mt-1">Đội 5, Trà Thung, Phù Mỹ Bắc, Gia Lai</p>
					</div>
				</div>
				<div className="relative flex justify-center items-center mt-6">
					<img src={chande} alt="chande" className="absolute translate-x-[30%] w-2/3 -bottom-5  left-0  object-contain z-0 opacity-90" />
					<div className="relative z-10 w-1/2 mx-auto">
						<img src={couple} alt="Cô dâu chú rể" className="w-full h-auto object-contain animUp" />
					</div>
				</div>

				<div className="wedding-name m-6">
					<div className="text-[30px] text-center">Trọng Chính & Trường Mi</div>
				</div>
				<div className="text-center text-[#8B0000] font-sans mt-6">
					{/* --- Đường viền trên --- */}
					<div className="flex items-center justify-center mb-2 border-none">
						<div className="w-[100px] border-t-[1px] border-[#8B0000]"></div>
						<div className="w-[80px]"></div>
						<div className="w-[100px] border-t-[1px] border-[#8B0000]"></div>
					</div>

					{/* --- Phần ngày tháng năm --- */}
					<div className="flex justify-center items-center gap-3">
						{/* Ngày */}
						<div className="text-3xl md:text-4xl font-bold">21</div>

						{/* Tháng */}
						<div className="bg-[#8B0000] text-white rounded-full w-16 h-16 flex flex-col justify-center items-center border border-[#8B0000]">
							<span className="text-[10px] font-semibold tracking-wide leading-none">THÁNG</span>
							<span className="text-xl font-bold leading-none">12</span>
						</div>

						{/* Năm */}
						<div className="text-3xl md:text-4xl font-bold">2025</div>
					</div>

					{/* --- Đường viền dưới --- */}
					<div className="flex items-center justify-center mt-2">
						<div className="w-[100px] border-t border-[#8B0000]"></div>
						<div className="w-[80px]"></div>
						<div className="w-[100px] border-t border-[#8B0000]"></div>
					</div>

					{/* Giờ */}
					<div className="text-lg md:text-xl font-semibold tracking-wide mb-1">
						9:00 <span className="text-sm font-normal">SÁNG</span>
					</div>

					{/* Dòng phụ */}
					<div className="text-sm text-[#9b3030] italic">Nhằm ngày 02.11 Năm Ất Tỵ</div>
				</div>
			</div>
		</div>
	);
};

export default WeddingPage;
