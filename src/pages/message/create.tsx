import useSeo from "@/hooks/useSeo";
import { CommonForm, CommonProps } from "@/types/interface";
import React, { FC, useEffect, useState } from "react";
import { stagger, useAnimate } from "framer-motion";
import _ from "lodash";
import myapi from "@/services/myapi";
import { useRecoilState, useRecoilValue } from "recoil";
import { loadingAtom } from "@/stores";

import { FieldErrors, useForm } from "react-hook-form";
import "./styles.scss";
import { useNavigate } from "react-router-dom";
import { BUTTON_NAME, MODAL_NAME, MY_ROUTERS } from "@/types/enums";
import ButtonDefault from "@/components/ButtonDefault/ButtonDefault";
import { inviteeAtom } from "@/stores/invitee";
import Select from "react-select";
import { modalAtom } from "@/stores/modal";
import { MESSAGE_TEMPLATES } from "@/types/messages";
import { campaignAtom } from "@/stores/campaign";
const options = [
	{ value: "Bạn", label: "Bạn" },
	{ value: "Em", label: "Em" },
	{ value: "Anh", label: "Anh" },
	{ value: "Chị", label: "Chị" },
	{ value: "Người thân", label: "Người thân" },
];

const CreateMesagePage: FC<CommonProps> = () => {
	const navigate = useNavigate();
	const [scope, animate] = useAnimate();
	const [, setLoading] = useRecoilState(loadingAtom);
	const invitee = useRecoilValue(inviteeAtom);
	const [com_modal, setComModal] = useRecoilState(modalAtom);
	const campaignInfo = useRecoilValue(campaignAtom);
	useSeo({ title: `${campaignInfo?.wedding?.groom || "Ky Chin"} 囍 ${campaignInfo?.wedding?.bride || "Mi Mie"}`, description: "Welcome to the Home Page of My App!" });

	const {
		register,
		handleSubmit,
		formState,
		formState: { errors },
		setError,
		setValue,
		clearErrors,
		getValues,
	} = useForm({ shouldFocusError: true });
	useEffect(() => {
		const animUp = document.querySelectorAll(".animUp");
		animate(animUp, { y: [20, 0], opacity: [0, 1] }, { type: "spring", delay: stagger(0.15) });
		console.log("invitee", invitee);
	}, []);

	const onSubmit = async (data: CommonForm) => {
		try {
			setLoading(true);
			const dataSend = {
				content: data?.content,
				name: data?.name || invitee?.name || "Ẩn danh",
				from: data?.from || invitee?.title,
				invitee: invitee?._id,
			};
			const createData = await myapi.sendMessage(dataSend);
			if (createData?.status == 200 && createData?.result) {
				setComModal((prevState) => ({
					...prevState,
					name: MODAL_NAME.DEFAULT,
					open: true,
					content: MESSAGE_TEMPLATES.THANKYOU,
					buttonName: BUTTON_NAME.CLOSE,
				}));
				navigate(MY_ROUTERS.MESSAGE, { replace: true });
			}

			setLoading(false);
		} catch (error) {}
	};
	const onError = (e: FieldErrors) => {
		console.log(`==>`, e);
	};

	const handleSelect = (e: any) => {
		setValue("from", e?.value);
		clearErrors("from");
	};

	return (
		<div className="page-content timeline" ref={scope}>
			<div className="container animUp ">
				<div className="mtitle relative">
					<h2 className="timeline-title  tracking-wide mb-9 text-center">WEDDING</h2>
					<h2 className="mtitle-timeline timeline-title  tracking-wide mb-4 text-center">Messages</h2>
				</div>

				<div className="form animUp p-6 bg-[#dfdbc3] m-3 rounded-md">
					<form onSubmit={handleSubmit(onSubmit, onError)} className="">
						{!invitee && (
							<>
								<div className="form-groups">
									<div className="form-groups-w">
										<label htmlFor="" className="uppercase">
											Tên người gửi
										</label>
										<input
											type="text"
											{...register("name", {
												required: false,
												maxLength: 30,
												pattern: /[a-zA-Z0-9]/,
											})}
											maxLength={30}
											placeholder="Tên người gửi"
											className="!text-red-500 text-[1.2rem] !rounded-lg"
										/>
									</div>
									{errors.name && <div className="error text-sm text-red-500 italic">Vui lòng quét mã code</div>}
								</div>
								<div className="form-groups mt-2">
									<div className="form-groups-w">
										<label htmlFor="" className="uppercase">
											Gửi từ
										</label>
										<Select
											onChange={handleSelect}
											options={options}
											className="react-select-container"
											classNamePrefix="react-select"
											placeholder="Bạn là..."
										/>
										<input
											type="hidden"
											{...register("from", {
												required: true,
											})}
										/>
									</div>
									{errors.from && <div className="error text-sm text-red-500 italic">Bạn là gì với dâu rể</div>}
								</div>
							</>
						)}
						<div className="form-groups mt-2">
							<div className="form-groups-w">
								<label htmlFor="" className="uppercase">
									Những lời yêu thương
								</label>
								<textarea
									{...register("content", {
										required: true,
										maxLength: 300,
										minLength: 1,
										pattern: /[a-zA-Z0-9]/,
									})}
									maxLength={300}
									placeholder="Lời yêu thương"
									className="text-red-500 w-full p-2 text-[1.2rem] rounded-lg"
									rows={5}
								/>
							</div>
							{errors.content && <div className="error text-sm text-red-500 italic">Mình gửi lời yêu thương nhé</div>}
						</div>

						<div className="bl-button flex  mt-20 justify-center">
							<ButtonDefault text="Hoàn thành" align="center" buttonType="secondary z-10" onClick={handleSubmit(onSubmit, onError)} />
						</div>
					</form>
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

export default CreateMesagePage;
