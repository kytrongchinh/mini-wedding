import useSeo from "@/hooks/useSeo";
import { CommonForm, CommonProps, CommonState } from "@/types/interface";
import React, { FC, useEffect, useReducer, useState } from "react";
import { stagger, useAnimate } from "framer-motion";
import _ from "lodash";
import myapi from "@/services/myapi";
import { useRecoilState, useRecoilValue } from "recoil";
import { loadingAtom } from "@/stores";
import { convertPage } from "@/utils/base";
import Pagination from "@/components/Pagination/Pagination";
import { FieldErrors, useForm } from "react-hook-form";
import "./styles.scss";
import { useNavigate } from "react-router-dom";
import { MY_ROUTERS } from "@/types/enums";
import ButtonDefault from "@/components/ButtonDefault/ButtonDefault";
import { inviteeAtom } from "@/stores/invitee";
import Select from "react-select";
const options = [
	{ value: "nguoi-than-co-dau", label: "Người thân cô dâu" },
	{ value: "nguoi-than-chu-re", label: "Người thân chú rể" },
	{ value: "ban-co-dau", label: "Bạn cô dâu" },
	{ value: "ban-chu-re", label: "Bạn chú rể" },
];

const CreateMesagePage: FC<CommonProps> = () => {
	useSeo({ title: "Trọng Chính 囍 Trường Mi", description: "Welcome to the Home Page of My App!" });
	const navigate = useNavigate();
	const [scope, animate] = useAnimate();
	const [, setLoading] = useRecoilState(loadingAtom);
	const [myKeyword, setMykeyword] = useState("");
	const invitee = useRecoilValue(inviteeAtom);

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

				<div className="form animUp p-6 bg-slate-300 m-3">
					<form onSubmit={handleSubmit(onSubmit, onError)} className="">
						{!invitee && (
							<>
								<div className="form-groups">
									<div className="form-groups-w">
										<label htmlFor="">Tên người gửi</label>
										<input
											type="text"
											{...register("name", {
												required: false,
												maxLength: 30,
												pattern: /[a-zA-Z0-9]/,
											})}
											maxLength={30}
											placeholder=""
											className="text-red-500 text-[1.2rem] !rounded-lg"
										/>
									</div>
									{errors.name && <div className="error text-sm text-red-500 italic">Vui lòng quét mã code</div>}
								</div>
								<div className="form-groups mt-2">
									<div className="form-groups-w">
										<label htmlFor="">Gửi từ</label>
										<Select onChange={handleSelect} options={options} className="react-select-container" classNamePrefix="react-select" placeholder="" />
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
								<label htmlFor="">Những lời yêu thương</label>
								<textarea
									{...register("content", {
										required: true,
										maxLength: 300,
										minLength: 1,
										pattern: /[a-zA-Z0-9]/,
									})}
									maxLength={300}
									placeholder=""
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
					<div className="text-[20px] text-center">Trọng Chính & Trường Mi</div>
				</div>
			</div>
		</div>
	);
};

export default CreateMesagePage;
