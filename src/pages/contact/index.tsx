import useSeo from "@/hooks/useSeo";
import { CommonProps, CommonState } from "@/types/interface";
import React, { FC, useEffect, useState } from "react";
import { stagger, useAnimate } from "framer-motion";
import "./style.scss";
import _ from "lodash";
import { useRecoilState, useRecoilValue } from "recoil";
import { loadingAtom } from "@/stores";
import { campaignAtom } from "@/stores/campaign";
import myapi from "@/services/myapi";
import routing from "@/services/miniapp/routing";
import { Icon } from "zmp-ui";
import couple from "@/assets/images/couple.png";

const ContactPage: FC<CommonProps> = () => {
	const [scope, animate] = useAnimate();
	const [, setLoading] = useRecoilState(loadingAtom);
	const campaignInfo = useRecoilValue(campaignAtom);
	const [contact, setContact] = useState<CommonState>({});
	useSeo({ title: `${campaignInfo?.wedding?.groom || "Ky Chin"} 囍 ${campaignInfo?.wedding?.bride || "Mi Mie"}`, description: "Welcome to the Home Page of My App!" });

	useEffect(() => {
		const animUp = document.querySelectorAll(".animUp");
		animate(animUp, { y: [20, 0], opacity: [0, 1] }, { type: "spring", delay: stagger(0.15) });
		loadContact();
	}, []);

	const loadContact = async () => {
		try {
			const myData = await myapi.getContact();
			if (myData?.status == 200 && myData?.result?.data) {
				setContact(myData?.result?.data);
			}
		} catch (error) {}
	};

	const viewMap = (link: string) => {
		if (!_.isEmpty(link)) {
			routing.openWebview(link);
		}
	};

	return (
		<div className="page-content contact" ref={scope}>
			<div className="container animUp ">
				<div className="mtitle relative">
					<h2 className="timeline-title  tracking-wide mb-9 text-center">WEDDING</h2>
					<h2 className="mtitle-timeline timeline-title  tracking-wide mb-4 text-center">Contact</h2>
				</div>

				<div className="relative flex justify-center items-start text-sm md:text-base text-center w-full gap-3"></div>
				<div className="p-4">
					<div className="grid grid-cols-1 gap-4">
						<div className="!border-2 !border-dashed !border-orange-500 rounded-md p-4 groom ">
							{contact?.groom?.name && (
								<>
									<p>Chú rể </p>
									{/* <div className="img w-1/2 mx-auto">
										<img src={groom} />
									</div> */}
									<p className="!text-[20px]">
										<strong>{contact?.groom?.name || "Ky Chin"}</strong>
									</p>
								</>
							)}
							{contact?.groom?.phone && (
								<>
									<p>Số điện thoại </p>
									<p>
										<Icon icon="zi-call" />{" "}
										<strong>
											<a href={`tel:0972569049`}>{contact?.groom?.phone || "0123456789"}</a>
										</strong>
									</p>
								</>
							)}
							{contact?.groom?.zalo_qr && (
								<>
									<p>Zalo </p>
									<div className="img w-1/3 mx-auto pb-2">
										<img src={contact?.groom?.zalo_qr} alt="Zalo QR" />
									</div>
								</>
							)}

							{contact?.groom?.bank && (
								<>
									<p>Bank </p>
									<div className="img w-2/3 mx-auto pb-2">
										<img src={contact?.groom?.bank} alt="Bank" />
									</div>
								</>
							)}

							{contact?.groom?.restaurance && (
								<>
									<p className="!text-[20px] uppercase !font-bold underline">Tiệc nhà trai </p>
									<p>Nhà hàng</p>
									<p className="!text-[18px]">
										<strong>{contact?.groom?.restaurance}</strong>
									</p>
								</>
							)}
							{contact?.groom?.address && (
								<>
									<p>Địa chỉ </p>
									<p>
										<Icon icon="zi-location" /> <strong>{contact?.groom?.address}</strong>
									</p>
								</>
							)}
							{contact?.groom?.time && (
								<>
									<p>Thời gian </p>
									<p>
										<Icon icon="zi-clock-1" />
										<strong>{contact?.groom?.time}</strong>
									</p>
								</>
							)}
							{contact?.groom?.map && (
								<>
									<p>Map </p>
									<p className="underline" onClick={() => viewMap(contact?.groom?.map)}>
										<Icon icon="zi-unhide" />
										<strong>Xem</strong>
									</p>
								</>
							)}
						</div>
						<div className="!border-2 !border-dashed !border-orange-500 rounded-md p-4 bride">
							{contact?.bride?.name && (
								<>
									<p>Cô dâu </p>
									{/* <div className="img">
										<img src={bride} />
									</div> */}
									<p className="!text-[20px]">
										<strong>{contact?.bride?.name || "Ky Chin"}</strong>
									</p>
								</>
							)}
							{contact?.bride?.phone && (
								<>
									<p>Số điện thoại </p>
									<p>
										<Icon icon="zi-call" /> <strong>{contact?.bride?.phone || "0123456789"}</strong>
									</p>
								</>
							)}
							{contact?.bride?.zalo_qr && (
								<>
									<p>Zalo </p>
									<div className="img w-1/3 mx-auto pb-2">
										<img src={contact?.bride?.zalo_qr} alt="Zalo QR" />
									</div>
								</>
							)}
							{contact?.bride?.bank && (
								<>
									<p>Bank </p>
									<div className="img w-2/3 mx-auto pb-2">
										<img src={contact?.bride?.bank} alt="Bank" />
									</div>
								</>
							)}

							{contact?.bride?.restaurance && (
								<>
									<p className="!text-[20px] uppercase !font-bold underline">Tiệc nhà gái </p>
									<p>Nhà hàng</p>
									<p className="!text-[18px]">
										<strong>{contact?.bride?.restaurance}</strong>
									</p>
								</>
							)}
							{contact?.bride?.address && (
								<>
									<p>Địa chỉ </p>
									<p>
										<Icon icon="zi-location" /> <strong>{contact?.bride?.address}</strong>
									</p>
								</>
							)}
							{contact?.bride?.time && (
								<>
									<p>Thời gian </p>
									<p>
										<Icon icon="zi-clock-1" />
										<strong>{contact?.bride?.time}</strong>
									</p>
								</>
							)}
							{contact?.bride?.map && (
								<>
									<p>Map </p>
									<p className="underline" onClick={() => viewMap(contact?.bride?.map)}>
										<Icon icon="zi-unhide" />
										<strong>Xem</strong>
									</p>
								</>
							)}
						</div>

						<div className="!border-2 !border-dashed !border-orange-500 rounded-md p-4 wedding_party-details">
							{contact?.wedding_party?.name && (
								<>
									<p className="underline !text-[25px]">
										<strong>{contact?.wedding_party?.name}</strong>
									</p>
									<p>Nhà hàng</p>
									<p className="!text-[18px]">
										<strong>{contact?.wedding_party?.restaurance}</strong>
									</p>
								</>
							)}
							{contact?.wedding_party?.address && (
								<>
									<p>Địa chỉ </p>
									<p>
										<Icon icon="zi-location" /><strong>{contact?.wedding_party?.address}</strong>
									</p>
								</>
							)}
							{contact?.wedding_party?.time && (
								<>
									<p>Thời gian </p>
									<p>
										<Icon icon="zi-clock-1" /><strong>{contact?.wedding_party?.time}</strong>
									</p>
								</>
							)}
							{contact?.wedding_party?.map && (
								<>
									<p>Map </p>
									<p className="underline" onClick={() => viewMap(contact?.wedding_party?.map)}>
										<Icon icon="zi-unhide" />
										<strong>Xem</strong>
									</p>
								</>
							)}
						</div>
					</div>
				</div>

				<div className="img w-2/3 mx-auto">
					<img src={couple} alt="" />
				</div>
				<div className="timeline-name pb-14 opacity-35">
					<div className="text-[20px] text-center">
						{campaignInfo?.wedding?.groom || "Ky Chin"} & {campaignInfo?.wedding?.bride || "Mi Mie"}
					</div>
				</div>
			</div>
		</div>
	);
};

export default ContactPage;
