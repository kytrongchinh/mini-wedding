import UserApi from "@/services/miniapp/user";

import config from "@/configs";
import { MY_ROUTERS } from "@/types/enums";
import myapi from "../myapi";
import _ from "lodash";
import adtimabox from "../adtimabox";
import { CommonData } from "@/types/interface";

class Authentication {
	private zmpToken: string | null;
	constructor() {
		this.zmpToken = null;
	}

	async getMiniAppToken() {
		try {
			const isDevMode = config?.MODE === "development";
			// Get and check Authorize
			const getAuthorize = await UserApi.getSetting();
			if (_.isEmpty(getAuthorize)) {
				const authorizeResult = await UserApi.authorize(["scope.userInfo", "scope.userPhonenumber"]);
				if (_.isEmpty(authorizeResult) && import.meta.env.MODE != "development") return null;
			} else {
				if (!getAuthorize?.authSetting?.["scope.userInfo"] || !getAuthorize?.authSetting?.["scope.userPhonenumber"]) {
					const authorizeResult = await UserApi.authorize(["scope.userInfo", "scope.userPhonenumber"]);
					if (_.isEmpty(authorizeResult) && import.meta.env.MODE != "development") return null;
				}
			}
			// -- Get token miniapp --310438
			let tokenFromMiniapp: string | null = null;
			if (isDevMode) tokenFromMiniapp = config?.USER_TOKEN;
			else tokenFromMiniapp = await UserApi.getAccessToken();
			if (!tokenFromMiniapp) return null;
			if (typeof tokenFromMiniapp === "string") {
				this.zmpToken = tokenFromMiniapp;
			}

			return tokenFromMiniapp;
		} catch (error) {
			console.log("getMiniAppToken error :>> ", error);
			return null;
		}
	}

	async getUserToken(social_token = "") {
		try {
			let tokenFromMiniapp = await this.getMiniAppToken();
			if (social_token && config?.MODE === "development") {
				tokenFromMiniapp = social_token;
			}
			if (!tokenFromMiniapp) return null;
			// -- Get token adtimabox --
			let tokenFromAdtimaBox: any = null;
			if (import.meta.env.VITE_APP_USE_API_FROM == "my-api") {
				tokenFromAdtimaBox = await myapi.login({ miniAppAccessToken: tokenFromMiniapp });
			} else {
				tokenFromAdtimaBox = await adtimabox.getTokenMini(tokenFromMiniapp);
			}
			if (!tokenFromAdtimaBox) return null;
			// Save token to local storage
			if (tokenFromAdtimaBox?.data) {
				return tokenFromAdtimaBox.data;
			} else {
				console.log("Error getMe from adtimaBox");
				return null;
			}
		} catch (error) {
			console.log("getUserToken error :>> ", error);
			return null;
		}
	}

	async getAuthenticationInfo(adtimaBoxToken: any, retryCount = 0, social_token = "") {
		try {
			// console.log(`social_token==>`, social_token);
			let userToken = adtimaBoxToken;
			if (!userToken) {
				const data_response = await this.getUserToken(social_token);
				if (!data_response || data_response == null) return null;
				userToken = data_response;
			}
			if (!userToken) throw new Error("Missing user token");
			let userData: CommonData | null = null;
			if (import.meta.env.VITE_APP_USE_API_FROM == "my-api") {
				userData = await myapi.getUser(userToken?.accessToken);
			} else {
				userData = await adtimabox.getMe(userToken?.accessToken);
			}

			if (!userData) {
				console.log("Free cache and reset token");
				// Tránh infinite loop
				if (retryCount >= 2) {
					console.error("Reached maximum retry limit");
					return null;
				}

				if (!adtimaBoxToken) return null;

				return await this.getAuthenticationInfo(null, retryCount + 1);
			}

			if (!this.zmpToken) {
				this.zmpToken = await this.getMiniAppToken();
			}

			return {
				token: userToken,
				infor: userData?.data,
				zmpToken: this.zmpToken,
			};
		} catch (error) {
			console.log("getAuthenticationInfo error :>> ", error);
			return null;
		}
	}

	getRouteByUserInfo(userInfo: any) {
		if (!userInfo?.phone) return MY_ROUTERS.HOME;
		else if (!userInfo?.isFollow || !userInfo?.uId) return MY_ROUTERS.HOME;
		return MY_ROUTERS.HOME;
	}
}

export default new Authentication();
