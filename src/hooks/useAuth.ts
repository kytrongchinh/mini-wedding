import { useCallback, useState, useMemo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userAtom } from "@/stores/user";
import { zaloAtom } from "@/stores/zalo";
import { adtimaAtom } from "@/stores/adtima";
import { paramsAtom } from "@/stores/params";
import storage from "@/utils/storage";
import auth from "@/services/auth";
import _ from "lodash";
import { checkListUrlRedirect, checkListUrlRedirectCustom, sleepTime } from "@/utils/base";
import { MY_ROUTERS } from "@/types/enums";
import userMini from "@/services/miniapp/user";
import myapi from "@/services/myapi";
import { modalAtom } from "@/stores/modal";

import { CommonFields } from "@/types/interface";
import adtimabox from "@/services/adtimabox";
import zaloSocial from "@/services/social/zalo";
interface MParams {
	[key: string]: any;
}

const useAuth = () => {
	const navigate = useNavigate();
	const [user, setUser] = useRecoilState(userAtom);
	const [zalo, setZalo] = useRecoilState(zaloAtom);
	const [adtima, setAdtima] = useRecoilState(adtimaAtom);
	const [mparams, setMParams] = useRecoilState<MParams>(paramsAtom);
	const [isProcessing, setIsProcessing] = useState(false);
	const [, setComModal] = useRecoilState(modalAtom);
	const [searchParams] = useSearchParams();

	const location = useLocation();

	let my_path = ``;
	if (location.state?.from?.pathname) {
		my_path = `${location.state?.from?.pathname}${location.state?.from?.search}`;
	}

	/** Memoized function to update processing state */
	const setLoadProcess = useCallback((stateValue = false) => {
		setIsProcessing(stateValue);
	}, []);

	const handlePhone = async (userAuth: CommonFields) => {
		try {
			if (_.isEmpty(userAuth.infor?.phone)) {
				// console.log(`userAuth==>`, userAuth);
				// console.log(`==>Call phone`);
				const phone_token = await userMini.getPhoneNumber();
				const tokenFromMiniapp = userAuth.zmpToken || (await userMini.getAccessToken());
				const accessToken = userAuth.token?.accessToken || adtima?.accessToken;

				if (import.meta.env.MODE == "development") {
					if (phone_token?.token) {
						if (import.meta.env.VITE_APP_USE_API_FROM == "my-api") {
							const phoneData = await myapi.myPhoneMiniAPP(accessToken, { access_token: tokenFromMiniapp, code: phone_token?.token });
							if (phoneData?.data) {
								await storage.setStorage("userInfo", phoneData?.data);
								setUser(phoneData?.data);
							}
						} else {
							const phoneData = await adtimabox.myPhoneMiniAPP(accessToken, tokenFromMiniapp, phone_token?.token);
							console.log(`==>phoneData==>`, phoneData);
							if (phoneData?.data) {
								const zaloPhone = phoneData?.data?.number;
								const user_data = { ...userAuth.infor, zaloPhone: zaloPhone };
								await storage.setStorage("userInfo", user_data);
								setUser(user_data);
							}
						}
					}
				} else {
					if (phone_token?.token) {
						if (import.meta.env.VITE_APP_USE_API_FROM == "my-api") {
							const phoneData = await myapi.myPhoneMiniAPP(accessToken, { access_token: tokenFromMiniapp, code: phone_token?.token });
							if (phoneData?.data) {
								await storage.setStorage("userInfo", phoneData?.data);
								setUser(phoneData?.data);
							}
						} else {
							// call server get phone
							const phoneData = await adtimabox.myPhoneMiniAPP(accessToken, tokenFromMiniapp, phone_token?.token);
							if (phoneData?.data) {
								const zaloPhone = phoneData?.data?.number;
								const user_data = { ...userAuth.infor, zaloPhone: zaloPhone };
								console.log(user_data, "user_data");
								await storage.setStorage("userInfo", user_data);
								setUser(user_data);
							}
						}
					} else {
						console.log("Cant get phone");
					}
				}
			}
		} catch (error) {
			console.log("Cant get phone by handlePhone");
		}
	};

	/** Memoized user authentication handler */
	const handleLogin = useCallback(
		async (to: string = "") => {
			if (isProcessing) return;
			try {
				setLoadProcess(true);

				const dataFromStorage = await storage.getStorage("adtimaInfo");
				let userAuth = await auth.getAuthenticationInfo(dataFromStorage || null);

				if (import.meta.env.MODE == "development") {
					const code = searchParams.get("code");
					if (code && !userAuth?.token) {
						const token: CommonFields = await zaloSocial.getZaloAccessTokenByOauthCode(code);
						if (token && token?.access_token) {
							let time = 5000;
							if (import.meta.env.VITE_APP_USE_API_FROM == "my-api") {
								time = 1000;
							}
							await sleepTime(time);
							userAuth = await auth.getAuthenticationInfo("", 0, token?.access_token);
						}
					} else {
						window.open(import.meta.env.VITE_APP_ZALO_AUTH_URL);
						return;
					}
				}

				if (!userAuth || !userAuth?.infor || !userAuth?.token) throw new Error("Authentication failed");
				// Store authentication tokens
				setAdtima(userAuth.token);
				setUser(userAuth.infor);
				setZalo(userAuth.zmpToken);
				await storage.setStorage("adtimaInfo", userAuth.token);
				await storage.setStorage("userInfo", userAuth.infor);
				// console.log(`my_path==>`, my_path);
				await handlePhone(userAuth);
				if (my_path) {
					return navigate(my_path, { replace: true });
				}
				// Determine the redirect route
				let redirectTo = to || MY_ROUTERS.HOME; // Default redirect
				console.log(`mparams==>`, mparams);
				if (mparams?.redirect) {
					if (checkListUrlRedirectCustom(mparams.redirect)) {
						// setMParams((prev) => ({ ...prev, redirect: null }));
						redirectTo = mparams.redirect;
					} else if (checkListUrlRedirect(mparams.redirect)) {
						redirectTo = `/${mparams.redirect}`;
					}
					// console.log(`redirectTo1==>`, redirectTo);
				} else {
					if (!redirectTo) {
						redirectTo = auth.getRouteByUserInfo(userAuth.infor);
						// console.log(`redirectT2==>`, redirectTo);
					}
				}
				// console.log(`redirectTo==>`, redirectTo);

				navigate(redirectTo, { replace: true });
			} catch (error) {
				console.error("handleLogin error:", error);
				// setComModal((prevState) => ({
				// 	...prevState,
				// 	open: true,
				// 	name: MODAL_NAME.NOTI_AUTH,
				// 	content: MESSAGE_TEMPLATES.AUTHENTICATION,
				// 	noted: ``,
				// 	buttonName: BUTTON_NAME.TIEP_TUC,
				// }));
				// Reset authentication states
				setAdtima(null);
				setUser(null);
				setZalo(null);
				await storage.removeStorage("adtimaInfo");
				await storage.removeStorage("userInfo");
				await storage.clearAll();
			} finally {
				setLoadProcess(false);
			}
		},
		[isProcessing, setUser, setAdtima, setZalo, setMParams, navigate]
	);

	/** Memoized logout handler */
	const handleLogout = useCallback(async () => {
		try {
			setAdtima(null);
			setUser(null);
			setZalo(null);

			await storage.removeStorage("adtimaInfo");
			await storage.removeStorage("userInfo");
			await storage.clearAll();

			return navigate(MY_ROUTERS.HOME, { replace: true });
		} catch (error) {
			console.error("handleLogout error:", error);
		}
	}, [setAdtima, setUser, setZalo, navigate]);

	/** Memoize the user data to prevent unnecessary re-renders */
	const memoizedUser = useMemo(() => user, [user]);

	return { handleLogin, handleLogout, isProcessing, user: memoizedUser };
};

export default useAuth;
