import MyCmp from "@/components/cmp/my-cmp";
import useCMPData from "@/hooks/useCMPData";
import useSeo from "@/hooks/useSeo";
import { userAtom } from "@/stores/user";
import { CmpDataResponse, CommonForm, CommonState } from "@/types/interface";
import React, { FC, useEffect, useState } from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { FieldErrors, useForm } from "react-hook-form";
import Image from "@/components/Image";
import imageRe from "@/assets/images/refresh.png";

import { Box } from "zmp-ui";
import myapi from "@/services/myapi";
import { adtimaAtom } from "@/stores/adtima";
import { useNavigate, useParams } from "react-router-dom";

import { paramsAtom } from "@/stores/params";
import storage from "@/utils/storage";
import { modalAtom } from "@/stores/modal";
import { BUTTON_NAME, MODAL_NAME, MY_ROUTERS } from "@/types/enums";
import useInterval from "@/hooks/useInterval";
import { MESSAGE_TEMPLATES } from "@/types/messages";
import { loadingAtom } from "@/stores";
import _ from "lodash";
import { zaloAtom } from "@/stores/zalo";
import zaloApi from "@/services/miniapp/zalo";
import { ACTIONS, GAevent } from "@/utils/zmp_ga";
import ButtonDefault from "@/components/ButtonDefault/ButtonDefault";
import { useAnimate } from "framer-motion";
const Form: FC = () => {
	const navigate = useNavigate();
	const params = useParams();
	useSeo({ title: "Quét mã" });
	const { loadCMPData, postConsents } = useCMPData();
	const [cmpData, setCmpData] = useState<CmpDataResponse | null>(null);
	const [captcha, setCaptcha] = useState<CommonState>({});
	const [captchaStatus, setCaptchaStatus] = useState<CommonState>({});
	const [isProcessing, setIsProcessing] = useState(false);
	const [loading, setLoading] = useRecoilState(loadingAtom);
	const [user, setUser] = useRecoilState(userAtom);
	const adtima = useRecoilValue(adtimaAtom);
	const [mparams, setMParams] = useRecoilState(paramsAtom);
	const [com_modal, setComModal] = useRecoilState(modalAtom);
	const zalo = useRecoilValue(zaloAtom);
	const user_id = user?._id;
	const { startInterval, stopInterval } = useInterval(checkGift, 400, 2000);
	const [flag, setFlag] = useState(0);
	const code = params?.code || mparams?.qrcode;
	const [scope, animate] = useAnimate();
	useEffect(() => {
		if (_.isEmpty(code)) {
			// navigate(MY_ROUTERS.HOME, { replace: true });
		}
		const fetchData = async () => {
			if (!user_id) return;
			setLoading(true);
			const data = await loadCMPData(user_id);
			setCmpData(data);
			setLoading(false);
		};
		if (user?.is_fill_form != true) {
			fetchData();
		}
		loadCaptchaStatus();
		loadCaptcha();
	}, [user_id]);

	const setLoadProcess = (stateValue: boolean) => {
		setLoading(stateValue);
		setIsProcessing(stateValue);
	};

	const loadCaptcha = async () => {
		try {
			const cap = await myapi.recaptcha(adtima?.accessToken);
			if (cap?.data) {
				setCaptcha(cap.data);
				setValue("captcha", "");
			}
		} catch (error) {
			console.log("Error loadCaptcha  :>> ", error);
		}
	};

	const loadCaptchaStatus = async () => {
		try {
			const cap = await myapi.captchaStatus();
			if (cap?.data) {
				setCaptchaStatus(cap.data);
			}
		} catch (error) {
			console.log("Error loadCaptcha  :>> ", error);
		}
	};
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

	const onSubmit = async (data: CommonForm) => {
		if (isProcessing) return;
		try {
			setLoadProcess(true);
			GAevent(ACTIONS.click_btn_hoan_tat);
			if (user?.is_fill_form) {
				await handleSubmitCode(data);
			} else {
				if (!cmpData) return;
				const data_conss = {
					...cmpData?.requestData,
					extend_uid: user_id,
					term_id: cmpData.requestData.term_id,
					property_last_data: JSON.stringify(data),
					mapping_key: cmpData.mappingKey,
					last_platform: cmpData?.requestData?.platform,
					last_browser: cmpData?.requestData?.browser,
				};
				const success = await postConsents(data_conss);
				if (success) {
					console.log("Consent submitted successfully!");
					const data_update = {
						// phone: "0972569049",
						cmp_info: {
							success: success || {},
							cmpKey: cmpData.mappingKey || "",
						},
						consent_info: {
							adult: "Tôi xác nhận tôi đủ 18 tuổi*",
							rule: "Tôi đã đọc, hiểu và đồng ý với Thể lệ và điều khoản Chương trình",
							oa: "Tôi đồng ý với theo dõi Zalo OA của Budweiser trên Zalo",
						},
						mparams: mparams,
					};
					if (import.meta.env.MODE == "development") {
						// data_update["phone"] = "0972569049";
					}

					const up_user = await myapi.updateUser(adtima?.accessToken, data_update);
					setLoadProcess(false);
					if (up_user?.status == 200) {
						console.log("Consent submitted successfully!", up_user?.result?.data);
						await storage.setStorage("userInfo", up_user?.result?.data);
						setUser(up_user?.result?.data);
						await handleSubmitCode(data);
					} else {
						throw new Error("Update user not successful!");
						// if (up_user?.result?.error == -119) {
						// 	setError("phone", { type: "custom", message: "-102" });
						// 	const input = document.getElementById("phone");
						// } else if (up_user?.message?.error == -20) {
						// 	navigate(MY_ROUTERS.HOME, { replace: true });
						// } else {
						// 	navigate(MY_ROUTERS.HOME, { replace: true });
						// }
						// alert("Failed to submit consent.");
						// console.log(up_user);
					}
				} else {
					// alert("Failed to submit consent.");
					throw "Lỗi hệ thống CMP";
				}
			}
		} catch (error) {
			navigate(MY_ROUTERS.HOME, { replace: true });
		}
	};
	const onError = (e: FieldErrors) => {
		console.log(`==>`, e);
	};

	const handleSubmitCode = async (data: CommonForm) => {
		try {
			const data_code = {
				code: code,
				captcha: data?.captcha.toUpperCase(),
				mparams: mparams,
			};
			const sendCode = await myapi.sendCode(adtima?.accessToken, data_code);
			setMParams({});
			loadCaptcha();
			if (sendCode?.status === 200) {
				const data_code = sendCode?.result?.data;
				const log_id = data_code?.log_id;
				const data_check_code = data_code?.data_check_code;
				if (data_check_code?.error == 0) {
					// loadCaptcha();
					startInterval(log_id);
				} else {
					if (data_check_code?.error == 4) {
						setComModal((prevState) => ({
							...prevState,
							name: MODAL_NAME.DEFAULT,
							open: true,
							content: MESSAGE_TEMPLATES.CODE_INVALID,
							buttonName: BUTTON_NAME.TIEP_TUC_QUET_MA,
						}));
					} else if (data_check_code?.error == 2) {
						setComModal((prevState) => ({
							...prevState,
							name: MODAL_NAME.DEFAULT,
							open: true,
							content: MESSAGE_TEMPLATES.CODE_USED,
							buttonName: BUTTON_NAME.TIEP_TUC_QUET_MA,
						}));
					} else if (data_check_code?.error == 3) {
						setComModal((prevState) => ({
							...prevState,
							name: MODAL_NAME.DEFAULT,
							open: true,
							content: MESSAGE_TEMPLATES.CODE_WRONG,
							buttonName: BUTTON_NAME.TIEP_TUC_QUET_MA,
						}));
					} else {
						setComModal((prevState) => ({
							...prevState,
							name: MODAL_NAME.DEFAULT,
							open: true,
							content: MESSAGE_TEMPLATES.CODE_WRONG,
							buttonName: BUTTON_NAME.TIEP_TUC_QUET_MA,
						}));
					}
				}
				setLoadProcess(false);
			} else {
				setLoadProcess(false);
				if (sendCode?.result?.error === -134) {
					setError("captcha", { type: "custom", message: "-107" });
					setValue("captcha", "");
					// loadCaptcha();
				} else if (sendCode?.result?.error === -110) {
					const data_error = sendCode?.result.data;
					const data_user = data_error?.user;
					if (data_user && data_user?.is_block === true) {
						setComModal((prevState) => ({
							...prevState,
							open: true,
							name: MODAL_NAME.BLOCK_USER,
							content:
								data_user?.type_block === "level-1"
									? MESSAGE_TEMPLATES.BLOCK_USER_LEVEL_1
									: data_user?.type_block === "level-2"
										? MESSAGE_TEMPLATES.BLOCK_USER_LEVEL_2
										: MESSAGE_TEMPLATES.BLOCK_USER_LEVEL_3,
							buttonName: BUTTON_NAME.VE_OA,
						}));
					} else {
						setComModal((prevState) => ({
							...prevState,
							name: MODAL_NAME.BLOCK_USER,
							open: true,
							content: MESSAGE_TEMPLATES.BLOCK_USER,
							buttonName: BUTTON_NAME.VE_OA,
						}));
					}
					navigate(MY_ROUTERS.HOME, { replace: true });
				} else {
					navigate(MY_ROUTERS.HOME, { replace: true });
				}
			}
		} catch (error) {}
	};

	async function checkGift(log_id: string) {
		setFlag((prev) => prev + 1);
		const my_gift = await myapi.openGift(adtima?.accessToken, { log_id: log_id });
		if (my_gift?.data) {
			stopInterval();
			if (my_gift?.data?.is_win == false) {
				setComModal((prevState) => ({ ...prevState, name: MODAL_NAME.NOTI_ERROR, open: true, content: MESSAGE_TEMPLATES.UNLUCKY, buttonName: BUTTON_NAME.TIEP_TUC_QUET }));
			} else {
				// setIsLoading(false);
				const gift = my_gift?.data?.gift;
				if (gift) {
					if (gift?.slug_name == "topup-20k") {
						GAevent(ACTIONS.display_thong_bao_trung_thuong_20k);
					}
					if (gift?.slug_name == "mot-nam-uong-bia-budweiser-mien-phi") {
						GAevent(ACTIONS.display_thong_bao_trung_thuong_giai_nhat);
					}
					if (gift?.slug_name == "ve-tham-du-fifa-world-cup-tai-my") {
						GAevent(ACTIONS.display_thong_bao_trung_thuong_giai_dac_biet);
					}
					// return navigate(`${MY_ROUTERS.PRIZE}/${gift?.win_id}`, { replace: true, state: { gift: gift } });
				} else {
					GAevent(ACTIONS.display_thong_bao_khong_trung_thuong);
					setComModal((prevState) => ({
						...prevState,
						name: MODAL_NAME.NOTI_ERROR,
						open: true,
						content: MESSAGE_TEMPLATES.UNLUCKY,
						buttonName: BUTTON_NAME.TIEP_TUC_QUET,
					}));
				}
			}
		} else {
			if (flag > 35) {
				stopInterval();
			}
		}
	}

	const handleClickLink = async (e: any) => {
		e.preventDefault();

		const is_check = e.target.checked;

		if (is_check == true) {
			let follow = await zaloApi.followOA();
			console.log(follow, "follow");
			if (import.meta.env.MODE == "development") {
				follow = true;
			}
			if (follow) {
				const up_user = await myapi.follow(adtima?.accessToken, { user_is_follower: true });
				if (_.isObject(up_user)) {
					await storage.setStorage("userInfo", up_user?.data);
					setUser(up_user?.data);
					e.target.checked = true;
				}
			}
		}
	};

	return (
		<div className="page-content form-page" ref={scope}>
			<div className="content animUp">
				<div className="form animUp">
					<form onSubmit={handleSubmit(onSubmit, onError)} className="">
						<h2 className="txt-title">Mã tham gia của bạn</h2>
						<div className="mb-4 mt-4 code-bg">
							<input
								type="text"
								{...register("code", {
									required: true,
									maxLength: 70,
									minLength: 1,
									pattern: /[a-zA-Z0-9]/,
								})}
								// style={{ pointerEvents: "none" }}
								defaultValue={code}
								maxLength={70}
								placeholder="Mã tham gia"
								className="input-custom input-code"
								// disabled={true}
							/>
							{errors.code && <div className="error text-sm text-red-500 italic">Vui lòng quét mã code</div>}
						</div>
						{captchaStatus && captchaStatus?.set_captcha !== "off" && (
							<div className="mb-2 grid grid-cols-5 gap-4 align-center">
								<div className="col-span-3">
									<label className="block text-white font-medium mb-2">Nhập mã bảo mật</label>
									<input
										type="text"
										{...register("captcha", {
											required: true,
											maxLength: 5,
											minLength: 1,
											pattern: /[a-zA-Z0-9]/,
										})}
										defaultValue={user?.captcha || ""}
										maxLength={5}
										className="input-custom"
										placeholder="Mã bảo mật"
										style={{ textTransform: "uppercase" }}
									/>
									{errors.captcha && errors.captcha?.message != "-107" && <div className="error text-sm text-red-500 italic">Vui lòng nhập mã bảo mật</div>}
									{errors.captcha && errors.captcha?.message == "-107" && (
										<div className="error text-sm text-red-500 italic">Vui lòng nhập chính xác mã bảo mật</div>
									)}
								</div>
								<div className="col-span-2">
									<img src={imageRe} alt="code" className="image-refresh" onClick={loadCaptcha} />
									<div dangerouslySetInnerHTML={{ __html: captcha?.code }} className="image-code" />
								</div>
							</div>
						)}
						{user?.is_fill_form != true && <MyCmp cmpData={cmpData} register={register} errors={errors} setValue={setValue} clearErrors={clearErrors} />}
						{user?.is_fill_form == true && user?.user_is_follower !== true && (
							<div className="form-groups checkbox py-1">
								<div className="form-groups-w">
									<input {...register("follow", { required: true })} type="checkbox" onClick={(e) => handleClickLink(e)} />
									<label htmlFor={"follow"} className="">
										<span></span>
										<span className="px-2 text-wrap">Tôi đồng ý với theo dõi Zalo OA của Budweiser trên Zalo</span>
									</label>
									{errors.follow && <div className="error text-sm text-red-500 italic">Vui lòng đồng ý theo dõi OA</div>}
								</div>
							</div>
						)}

						<div className="bl-button flex  mt-20 justify-center">
							<ButtonDefault text="Hoàn thành" customClass="button-style" buttonType="sub" onClick={handleSubmit(onSubmit, onError)} />
						</div>
					</form>
				</div>
			</div>
		</div>
	);
};

export default Form;
