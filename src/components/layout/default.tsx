import React, { FC, useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import HeaderSection from "./header";
import { Helmet } from "react-helmet-async";
import clsx from "clsx";

import { useRecoilValue, useRecoilState } from "recoil";
import { seoAtom } from "@/stores/seo";
import useCheckExpiredTime from "@/hooks/useCheckExpiredTime";
import useLoadProfile from "@/hooks/useLoadProfile";
import useLoadParams from "@/hooks/useLoadParams";
import useCampaign from "@/hooks/useCampaign";
import useCheckSystem from "@/hooks/useCheckSystem";
// import CommonModal from "../modals/common";
import { useNavigate } from "react-router-dom";
import { modalAtom } from "@/stores/modal";
import { MODAL_NAME } from "@/types/enums";
import zaloApi from "@/services/miniapp/zalo";
import { adtimaAtom } from "@/stores/adtima";
import storage from "@/utils/storage";
import userApi from "@/services/miniapp/user";
import { userAtom } from "@/stores/user";
import _ from "lodash";
import { MY_ROUTERS } from "@/types/enums";
import { zaloAtom } from "@/stores/zalo";
import Menu from "./menu";

import Loading from "../base/Loading";
import myapi from "@/services/myapi";
import { events, EventName } from "zmp-sdk/apis";
import { paramsAtom } from "@/stores/params";
import { initGA } from "@/utils/zmp_ga";
import CommonModal from "../modals/common";
import adtimabox from "@/services/adtimabox";
import { campaignAtom } from "@/stores/campaign";
import Music from "./music";
import FallingHearts from "../FallingHearts";
interface MParams {
	[key: string]: any;
}
const DefaultLayout: FC = () => {
	const navigate = useNavigate();
	const seo = useRecoilValue(seoAtom);
	useCheckSystem();
	useLoadParams();
	useCheckExpiredTime();
	useLoadProfile();
	useCampaign();
	const [com_modal, setComModal] = useRecoilState(modalAtom);
	const adtima = useRecoilValue(adtimaAtom);
	const [user, setUser] = useRecoilState(userAtom);
	const zalo = useRecoilValue(zaloAtom);
	const [mparams, setMParams] = useRecoilState<MParams>(paramsAtom);
	useEffect(() => {
		console.log("Load Layout");
		initGA();
	}, []);
	const [isPause, setIsPause] = useState(false);

	events.on(EventName.AppPaused, () => {
		console.log("App paused");
		setIsPause(true);
	});
	events.on(EventName.AppResumed, async () => {
		console.log("App AppResumed");
		// check user
		if (isPause) {
			setIsPause(false);
			if (user) {
				if (import.meta.env.VITE_APP_USE_API_FROM == "my-api") {
					if (user?.user_is_follower == true) {
						const my_user = await myapi.getUser(adtima?.accessToken);
						if (_.isObject(my_user?.data)) {
							await storage.setStorage("userInfo", my_user?.data);
							setUser(my_user?.data);
						}
					}
				} else {
					if (user && user?.isFollow) {
						const upuser = await adtimabox.getMe(adtima?.accessToken);
						if (upuser?.statusCode == 200 && upuser?.data) {
							await storage.setStorage("userInfo", upuser?.data);
							setUser(upuser?.data);
						}
					}
				}
			}
		}
	});

	events.on(EventName.OpenApp, async (data) => {
		console.log("App OpenApp");
		// check user
		console.log("Callback data:", data);
		let my_path = data?.path; //"/?env=DEVELOPMENT&version=zdev-57fde76a&redirect=input-code&qrcode=NH3PP2SNF";
		navigate(my_path || MY_ROUTERS.HOME);
	});

	const hanldeCloseModalCommon = async () => {
		if (com_modal?.name == MODAL_NAME.FOLLOW) {
			setComModal((prevState) => ({ ...prevState, name: MODAL_NAME.DEFAULT, open: false, modalOA: false, content: ``, imageUrl: ``, noted: ``, buttonName: `` }));
		} else if (com_modal?.name == MODAL_NAME.UPDATE_ZALO) {
			setComModal((prevState) => ({ ...prevState, name: MODAL_NAME.DEFAULT, open: false, modalOA: false, content: ``, imageUrl: ``, noted: ``, buttonName: `` }));
			await zaloApi.requestUpdateZalo();
		} else {
			setComModal((prevState) => ({ ...prevState, name: MODAL_NAME.DEFAULT, open: false, modalOA: false, content: ``, imageUrl: ``, noted: ``, buttonName: `` }));
		}
	};

	const handleModalActionClick = async () => {
		if (com_modal?.name == MODAL_NAME.FOLLOW) {
			let follow = await zaloApi.followOA();
			if (import.meta.env.MODE == "development") {
				follow = true;
			}
			if (follow) {
				if (import.meta.env.VITE_APP_USE_API_FROM == "my-api") {
					const up_user = await myapi.follow(adtima?.accessToken, { user_is_follower: true });
					if (_.isObject(up_user)) {
						await storage.setStorage("userInfo", up_user?.data);
						setUser(up_user?.data);
					}
				} else {
					const check_follow = await adtimabox.checkFollow(adtima?.accessToken);
					if (check_follow?.statusCode == 200 && check_follow?.data) {
						const upuser = await adtimabox.getMe(adtima?.accessToken);
						if (upuser?.statusCode == 200 && upuser?.data) {
							await storage.setStorage("userInfo", upuser?.data);
							setUser(upuser?.data);
							console.log(`mparams==>`, mparams);
							if (mparams?.qrcode) {
								navigate(`${MY_ROUTERS.HOME}`, { replace: true });
							} else if (mparams?.redirect) {
								navigate(`${mparams?.redirect}`, { replace: true });
							}
						}
					}
				}
			} else {
				navigate(MY_ROUTERS.HOME, { replace: true });
			}
			setComModal((prevState) => ({ ...prevState, name: MODAL_NAME.DEFAULT, open: false, modalOA: false, content: ``, imageUrl: ``, noted: ``, buttonName: `` }));
		} else if (com_modal?.name == MODAL_NAME.PHONE_PERMISSION) {
			const phone_token = await userApi.getPhoneNumber();
			const tokenFromMiniapp = zalo || (await userApi.getAccessToken());

			if (import.meta.env.MODE == "development") {
				const phoneData = await myapi.myPhoneMiniAPP(adtima?.accessToken, { access_token: tokenFromMiniapp, code: phone_token?.token });
				if (phoneData?.data) {
					await storage.setStorage("userInfo", phoneData?.data);
					setUser(phoneData?.data);
				}
			} else {
				if (phone_token?.token) {
					// call server get phone
					const phoneData = await myapi.myPhoneMiniAPP(adtima?.accessToken, { access_token: tokenFromMiniapp, code: phone_token?.token });
					if (phoneData?.data) {
						await storage.setStorage("userInfo", phoneData?.data);
						setUser(phoneData?.data);
					}
				} else {
					navigate(MY_ROUTERS.HOME, { replace: true });
				}
			}
			setComModal((prevState) => ({ ...prevState, name: MODAL_NAME.DEFAULT, open: false, modalOA: false, content: ``, imageUrl: ``, noted: ``, buttonName: `` }));
		} else if (com_modal?.name == MODAL_NAME.UPDATE_ZALO) {
			setComModal((prevState) => ({ ...prevState, name: MODAL_NAME.DEFAULT, open: false, modalOA: false, content: ``, imageUrl: ``, noted: ``, buttonName: `` }));
			await zaloApi.requestUpdateZalo();
		} else if (com_modal?.name == MODAL_NAME.CONFIRMED_EXIT) {
			setComModal((prevState) => ({ ...prevState, name: MODAL_NAME.DEFAULT, open: false, modalOA: false, content: ``, imageUrl: ``, noted: ``, buttonName: `` }));
			navigate(MY_ROUTERS.HOME);
		} else if (com_modal?.name == MODAL_NAME.RETAIL_CHAINS) {
			setComModal((prevState) => ({ ...prevState, name: MODAL_NAME.DEFAULT, open: false, modalOA: false, content: ``, imageUrl: ``, noted: ``, buttonName: `` }));
		} else {
			setComModal((prevState) => ({ ...prevState, name: MODAL_NAME.DEFAULT, open: false, modalOA: false, content: ``, imageUrl: ``, noted: ``, buttonName: `` }));
		}
	};

	return (
		<>
			<HeaderSection title={seo?.title || "ADTIMA"} />
			<Helmet>
				<meta charSet="utf-8" />
				<title>{seo?.title ? `${seo?.title.toUpperCase()}` : "ADTIMA"}</title>

				<meta name="description" content={seo?.description || "ADTIMA"}></meta>

				<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0" viewport-fit="cover"></meta>

				<meta property="og:title" content={seo?.title ? `${seo?.title.toUpperCase()}` : "ADTIMA"} />
				<meta property="og:description" content={seo?.description || "ADTIMA"} />

				<meta property="og:image" content={seo?.thumb} />
				<meta property="og:image:alt" content={seo?.thumb} />
				<meta property="og:type" content={seo?.type} />
			</Helmet>
			<CommonModal
				modalIsOpen={com_modal.open}
				name={com_modal?.name}
				onClose={hanldeCloseModalCommon}
				handleModalActionClick={handleModalActionClick}
				content={com_modal?.content}
				noted={com_modal?.noted}
				buttonName={com_modal?.buttonName}
			/>
			<Loading />
			<FallingHearts />

			<div className={clsx("container", location.pathname === "/" && "")}>
				<Outlet />
			</div>
			{/* <Menu /> */}
		</>
	);
};

export default DefaultLayout;
