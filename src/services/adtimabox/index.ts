import { HTTP_METHOD, HTTP_STATUS_CODE } from "types/enums";
import { ApiResponse, AxiosData, CommonData, MyApiResponse } from "types/interface";
import { ParamsAxios } from "types/types";
import CallApi from "@/utils/call-api";

class AdtimaBoxApi extends CallApi {
	private url_api_addresss: string;
	private url_api: string;
	private campaign_id: string;
	private campaign_secret_key: string;
	private challengeId: string;
	private warriorId: string;
	constructor() {
		super();
		this.url_api_addresss = "https://campaign-public-api-v2-stg.adtimabox.vn/digital-api";
		this.url_api = import.meta.env.VITE_API_URL || "";
		this.campaign_id = import.meta.env.VITE_CAMPAIGN_ID || "";
		this.campaign_secret_key = import.meta.env.VITE_CAMPAIGN_SECRET_KEY || "";
		this.challengeId = import.meta.env.VITE_CHALLENGE_ID || "";
		this.warriorId = import.meta.env.VITE_WARRIOR_ID || "";
	}
	// *********************************** Authen **********************************
	async getTokenMini(userToken: string) {
		try {
			const url = this.url_api + "/digital-user-auth/getTokenDigitalMiniApp";
			const params: ParamsAxios = {
				url,
				method: HTTP_METHOD.POST,
				data: { campaignId: this.campaign_id, tokenUser: userToken },
			};
			const result = await this.http_request<ApiResponse<CommonData>>(params);

			if (result?.status !== HTTP_STATUS_CODE.OK && !result?.data) {
				throw new Error(`Failed with status code ${result?.status}, data: ${JSON.stringify(result?.data)}, message: ${result?.message}`);
			}
			return result;
		} catch (error) {
			console.log("Error getToken :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async myPhoneMiniAPP(token: string, tokenFromMiniapp: string, phone_token: string) {
		try {
			const url = `${this.url_api}/digital-user/myPhoneMiniAPP?userAccessToken=${tokenFromMiniapp}&code=${phone_token}`;
			const authorization = `Bearer ${token}`;
			const params: ParamsAxios = { url, headers: { authorization }, method: HTTP_METHOD.GET };

			const result = await this.http_request_my_api<MyApiResponse<CommonData>>(params);
			if (result?.success && result?.data) {
				return result?.data;
			}
			return result?.errors;
		} catch (error) {
			console.log("Error giftDetail :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	// *********************************** Captcha **********************************
	async getCaptcha(token: string, length = 4, charsetType = "alphabet", width = 200, height = 50) {
		try {
			const url = `${this.url_api}/digital-user-auth/getCaptcha?length=${length}&charsetType=${charsetType}&width=${width}&height=${height}`;
			const authorization = `Bearer ${token}`;
			const params: ParamsAxios = { url, headers: { authorization }, method: HTTP_METHOD.GET };
			const result = await this.http_request<ApiResponse<CommonData>>(params);
			if (result?.status !== HTTP_STATUS_CODE.OK && !result?.data) {
				throw new Error(`Failed with status code ${result?.status}, data: ${JSON.stringify(result?.data)}, message: ${result?.message}`);
			}
			return result;
		} catch (error) {
			console.log("Error getCaptcha :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	// *********************************** get user profile **********************************
	async getMe(token: string) {
		try {
			const url = this.url_api + "/digital-user/me";
			const authorization = `Bearer ${token}`;
			const params: ParamsAxios = { url, headers: { authorization }, method: HTTP_METHOD.GET };
			const result = await this.http_request<ApiResponse<CommonData>>(params);
			if (result?.status !== HTTP_STATUS_CODE.OK && !result?.data) {
				throw new Error(`Failed with status code ${result?.status}, data: ${JSON.stringify(result?.data)}, message: ${result?.message}`);
			}
			return result;
		} catch (error) {
			console.log("Error getMe :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async updateProfile(token: string, data: any) {
		try {
			const url = `${this.url_api}/digital-user`;
			const authorization = `Bearer ${token}`;

			const params = { url, headers: { authorization }, method: HTTP_METHOD.PUT, data: data };
			const result = await this.http_request_my_api<MyApiResponse<CommonData>>(params);
			if (result?.success && result?.data) {
				return result?.data;
			}
			return result?.errors;
		} catch (error) {
			console.log("Error getMe :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}
	// *********************************** checkFollow **********************************
	async checkFollow(token: string) {
		try {
			const url = this.url_api + "/digital-user/check-follow";
			const authorization = `Bearer ${token}`;
			const params: ParamsAxios = { url, headers: { authorization }, method: HTTP_METHOD.GET };
			const result = await this.http_request<ApiResponse<CommonData>>(params);
			if (result?.status !== HTTP_STATUS_CODE.OK && !result?.data) {
				throw new Error(`Failed with status code ${result?.status}, data: ${JSON.stringify(result?.data)}, message: ${result?.message}`);
			}
			return result;
		} catch (error) {
			console.log("Error checkFollow :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	// *********************************** myPoint **********************************
	async myPoint(token: string) {
		try {
			const url = this.url_api + "/digital-user/myPoint";
			const authorization = `Bearer ${token}`;
			const params: ParamsAxios = { url, headers: { authorization }, method: HTTP_METHOD.GET };
			const result = await this.http_request<ApiResponse<CommonData>>(params);
			if (result?.status !== HTTP_STATUS_CODE.OK && !result?.data) {
				throw new Error(`Failed with status code ${result?.status}, data: ${JSON.stringify(result?.data)}, message: ${result?.message}`);
			}
			return result;
		} catch (error) {
			console.log("Error myPoint :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	// *********************************** myGift **********************************
	// async myGift1(token: string, page = 0, limit = 6) {
	// 	try {
	// 		const url = `${this.url_api}/digital-user/myGift?limit=${limit}&page=${page}`;
	// 		const authorization = `Bearer ${token}`;
	// 		const params: ParamsAxios = { url, headers: { authorization }, method: HTTP_METHOD.GET };
	// 		const result = await this.http_request<ApiResponse<CommonData>>(params);
	// 		if (result?.status !== HTTP_STATUS_CODE.OK && !result?.data) {
	// 			throw new Error(`Failed with status code ${result?.status}, data: ${JSON.stringify(result?.data)}, message: ${result?.message}`);
	// 		}
	// 		return result;
	// 	} catch (error) {
	// 		console.log("Error myGift :>> ", error);
	// 		return {
	// 			statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
	// 			data: null,
	// 			message: "Failed",
	// 		};
	// 	}
	// }

	// // *********************************** myGiftDetail **********************************
	// async myGiftDetail(token: string, gift_id: string) {
	// 	try {
	// 		const url = `${this.url_api}/digital-user/myGift/${gift_id}`;
	// 		const authorization = `Bearer ${token}`;
	// 		const params: ParamsAxios = { url, headers: { authorization }, method: HTTP_METHOD.GET };
	// 		const result = await this.http_request<ApiResponse<CommonData>>(params);
	// 		if (result?.status !== HTTP_STATUS_CODE.OK && !result?.data) {
	// 			throw new Error(`Failed with status code ${result?.status}, data: ${JSON.stringify(result?.data)}, message: ${result?.message}`);
	// 		}
	// 		return result;
	// 	} catch (error) {
	// 		console.log("Error myGiftDetail :>> ", error);
	// 		return {
	// 			statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
	// 			data: null,
	// 			message: "Failed",
	// 		};
	// 	}
	// }

	async redemption(token: string, page = 0, limit = 10) {
		try {
			const url = `${this.url_api}/digital-campaign-gifts/redemption?limit=${limit}&page=${page}`;
			const authorization = `Bearer ${token}`;
			const params: ParamsAxios = { url, headers: { authorization }, method: HTTP_METHOD.GET };
			const result = await this.http_request<ApiResponse<CommonData>>(params);
			if (result?.status !== HTTP_STATUS_CODE.OK && !result?.data) {
				throw new Error(`Failed with status code ${result?.status}, data: ${JSON.stringify(result?.data)}, message: ${result?.message}`);
			}
			return result;
		} catch (error) {
			console.log("Error redemption :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async listGift(token: string, page = 0, limit = 100) {
		try {
			const url = `${this.url_api}/digital-campaign-gifts/listGift?limit=${limit}&page=${page}`;
			const authorization = `Bearer ${token}`;
			const params = { url, headers: { authorization }, method: HTTP_METHOD.GET };
			const result = await this.http_request_my_api<MyApiResponse<CommonData>>(params);
			if (result?.success && result?.data) {
				return result?.data;
			}
			return result?.errors;
		} catch (error) {
			console.log("Error redemption :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	// *********************************** getCampaignDetail **********************************
	async getCampaignDetail() {
		try {
			const url = `${this.url_api}/digital-campaign/detail/${this.campaign_id}`;
			const params: ParamsAxios = { url, method: HTTP_METHOD.GET };
			const result = await this.http_request<ApiResponse<CommonData>>(params);
			if (result?.status !== HTTP_STATUS_CODE.OK && !result?.data) {
				throw new Error(`Failed with status code ${result?.status}, data: ${JSON.stringify(result?.data)}, message: ${result?.message}`);
			}
			return result;
		} catch (error) {
			console.log("Error getCampaignDetail :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	// *********************************** getCampaignDetail **********************************
	async getProvinces(token: string, provinceCode: number | string = "") {
		try {
			const url = `${this.url_api_addresss}/address/vnLocations?limit=200&page=0&provinceCode=${provinceCode}`;
			const authorization = `Bearer ${token}`;
			const params: ParamsAxios = { url, headers: { authorization }, method: HTTP_METHOD.GET };
			const result = await this.http_request<ApiResponse<CommonData>>(params);
			if (result?.status !== HTTP_STATUS_CODE.OK && !result?.data) {
				throw new Error(`Failed with status code ${result?.status}, data: ${JSON.stringify(result?.data)}, message: ${result?.message}`);
			}
			return result;
		} catch (error) {
			console.log("Error getProvinces :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async myLocationPhone(token: string, minitoken: string, code: string) {
		try {
			const url = `${this.url_api}/digital-user/myLocationPhone?userAccessToken=${minitoken}&code=${code}`;
			const authorization = `Bearer ${token}`;

			const params = { url, headers: { authorization }, method: HTTP_METHOD.GET };
			const result = await this.http_request<ApiResponse<CommonData>>(params);
			if (result?.status !== HTTP_STATUS_CODE.OK && !result?.data) {
				throw new Error(`Failed with status code ${result?.status}, data: ${JSON.stringify(result?.data)}, message: ${result?.message}`);
			}
			return result;
		} catch (error) {
			console.log("Error myLocationPhone :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async checkCodeAddTurnDraw(token: string, data: AxiosData) {
		try {
			const url = `${this.url_api}/digital-campaign-utc-codes/checkCodeAddTurnDraw`;
			const authorization = `Bearer ${token}`;
			const params = { url, headers: { authorization }, method: HTTP_METHOD.POST, data: data };
			const result = await this.http_request_my_api<MyApiResponse<CommonData>>(params);
			if (result?.success && result?.data) {
				return result?.data;
			}
			return result?.errors;
		} catch (error) {
			console.log("Error checkCodeAddTurnDraw :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async resultDrawScanCodeQueue(token: string, data: AxiosData) {
		try {
			const url = `${this.url_api}/digital-campaign-lucky-draws/resultDrawScanCodeQueue`;
			const authorization = `Bearer ${token}`;
			const params = { url, headers: { authorization }, method: HTTP_METHOD.POST, data: data };
			const result = await this.http_request_my_api<MyApiResponse<CommonData>>(params);
			if (result?.success && result?.data) {
				return result?.data;
			}
			return result?.errors;
		} catch (error) {
			console.log("Error resultDrawScanCodeQueue :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async checkResultScanCodeQueue(token: string, data: AxiosData) {
		try {
			const url = `${this.url_api}/digital-campaign-lucky-draws/checkResultScanCodeQueue`;
			const authorization = `Bearer ${token}`;
			const params = { url, headers: { authorization }, method: HTTP_METHOD.POST, data: data };
			const result = await this.http_request_my_api<MyApiResponse<CommonData>>(params);
			if (result?.success && result?.data) {
				return result?.data;
			}
			return result?.errors;
		} catch (error) {
			console.log("Error checkResultScanCodeQueue :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async listUserHaveGift(token: string, giftId: string, page = 0, limit = 10) {
		try {
			const url = `${this.url_api}/digital-campaign-gifts/listUserHaveGift?limit=${limit}&page=${page}&giftId=${giftId}&isPhone=1`;
			const authorization = `Bearer ${token}`;
			const params = { url, headers: { authorization }, method: HTTP_METHOD.GET };
			const result = await this.http_request_my_api<MyApiResponse<CommonData>>(params);
			if (result?.success && result?.data) {
				return result?.data;
			}
			return result?.errors;
		} catch (error) {
			console.log("Error listUserHaveGift :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async getCodesHistory(token: string, page = 0, limit = 10) {
		try {
			const url = `${this.url_api}/digital-campaign-utc-codes/getCodesHistory?limit=${limit}&page=${page}`;
			const authorization = `Bearer ${token}`;
			const params = { url, headers: { authorization }, method: HTTP_METHOD.GET };
			const result = await this.http_request_my_api<MyApiResponse<CommonData>>(params);
			if (result?.success && result?.data) {
				return result?.data;
			}
			return result?.errors;
		} catch (error) {
			console.log("Error getCodesHistory :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}
	async myRedemption(token: string, page = 0, limit = 10) {
		try {
			const url = `${this.url_api}/digital-user-redemption-gift/myRedemption?limit=${limit}&page=${page}&groupRecord=0`;
			const authorization = `Bearer ${token}`;
			const params = { url, headers: { authorization }, method: HTTP_METHOD.GET };
			const result = await this.http_request_my_api<MyApiResponse<CommonData>>(params);
			if (result?.success && result?.data) {
				return result?.data;
			}
			return result?.errors;
		} catch (error) {
			console.log("Error myRedemption :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async myRedemptionDetail(token: string, id: string) {
		try {
			const url = `${this.url_api}/digital-user-redemption-gift/myRedemption/${id}`;
			const authorization = `Bearer ${token}`;
			const params = { url, headers: { authorization }, method: HTTP_METHOD.GET };
			const result = await this.http_request_my_api<MyApiResponse<CommonData>>(params);
			if (result?.success && result?.data) {
				return result?.data;
			}
			return result?.errors;
		} catch (error) {
			console.log("Error myRedemptionDetail :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async myGift(token: string, page = 0, limit = 10) {
		try {
			const url = `${this.url_api}/digital-user/myGift?limit=${limit}&page=${page}&isPhone=0`;
			const authorization = `Bearer ${token}`;
			const params = { url, headers: { authorization }, method: HTTP_METHOD.GET };
			const result = await this.http_request_my_api<MyApiResponse<CommonData>>(params);
			if (result?.success && result?.data) {
				return result?.data;
			}
			return result?.errors;
		} catch (error) {
			console.log("Error myGift :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}
	async myGiftDetail(token: string, id: string) {
		try {
			const url = `${this.url_api}/digital-user/myGift/${id}`;
			const authorization = `Bearer ${token}`;
			const params = { url, headers: { authorization }, method: HTTP_METHOD.GET };
			const result = await this.http_request_my_api<MyApiResponse<CommonData>>(params);
			if (result?.success && result?.data) {
				return result?.data;
			}
			return result?.errors;
		} catch (error) {
			console.log("Error myGift :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}
	async myCollectionGift(token: string, page = 0, limit = 10) {
		try {
			const url = `${this.url_api}/digital-user/myCollectionGift?limit=${limit}&page=${page}`;
			const authorization = `Bearer ${token}`;
			const params = { url, headers: { authorization }, method: HTTP_METHOD.GET };
			const result = await this.http_request_my_api<MyApiResponse<CommonData>>(params);
			if (result?.success && result?.data) {
				return result?.data;
			}
			return result?.errors;
		} catch (error) {
			console.log("Error myCollectionGift :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async updateDeliveryRedemption(token: string, id: string, data: AxiosData) {
		try {
			const url = `${this.url_api}/digital-campaign-gifts/updateDeliveryRedemption/${id}`;
			const authorization = `Bearer ${token}`;
			const params = { url, headers: { authorization }, method: HTTP_METHOD.PUT, data: data };
			const result = await this.http_request_my_api<MyApiResponse<CommonData>>(params);
			if (result?.success && result?.data) {
				return result?.data;
			}
			return result?.errors;
		} catch (error) {
			console.log("Error updateDeliveryRedemption :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async exchangeGift(token: string, data: AxiosData) {
		try {
			const url = `${this.url_api}/digital-user-redemption-gift/v2/exchangeGift`;
			const authorization = `Bearer ${token}`;
			const params = { url, headers: { authorization }, method: HTTP_METHOD.POST, data: data };
			const result = await this.http_request_my_api<MyApiResponse<CommonData>>(params);
			if (result?.success && result?.data) {
				return result?.data;
			}
			return result?.errors;
		} catch (error) {
			console.log("Error exchangeGift :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async scanBillHistory(token: string, isToDay = false, page = 0, limit = 10) {
		try {
			const url = `${this.url_api}/digital-campaign-ai-logs?limit=${limit}&page=${page}&isToDay=${isToDay}&status=1`;
			const authorization = `Bearer ${token}`;
			const params = { url, headers: { authorization }, method: HTTP_METHOD.GET };
			const result = await this.http_request_my_api<MyApiResponse<CommonData>>(params);
			if (result?.success && result?.data) {
				return result?.data;
			}
			return result?.errors;
		} catch (error) {
			console.log("Error scanBillHistory :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async billManual(token: string, data: AxiosData) {
		try {
			const url = `${this.url_api}/digital-campaign-ai-logs/billManual`;
			const authorization = `Bearer ${token}`;
			const params = { url, headers: { authorization }, method: HTTP_METHOD.POST, data: data };
			const result = await this.http_request_my_api<MyApiResponse<CommonData>>(params);
			if (result?.success && result?.data) {
				return result?.data;
			}
			return result?.errors;
		} catch (error) {
			console.log("Error billManual :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async checkStatusBill(token: string, billId: string) {
		try {
			const url = `${this.url_api}/digital-campaign-ai-logs/checkStatusBill/${billId}`;
			const authorization = `Bearer ${token}`;
			const params = { url, headers: { authorization }, method: HTTP_METHOD.POST };
			const result = await this.http_request_my_api<MyApiResponse<CommonData>>(params);
			if (result?.success && result?.data) {
				return result?.data;
			}
			return result?.errors;
		} catch (error) {
			console.log("Error checkStatusBill :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async pointChallenge(token: string) {
		try {
			const url = `${this.url_api}/digital-campaign-challenge/pointChallenge`;
			const authorization = `Bearer ${token}`;
			const params = { url, headers: { authorization }, method: HTTP_METHOD.GET };
			const result = await this.http_request_my_api<MyApiResponse<CommonData>>(params);
			if (result?.success && result?.data) {
				return result?.data;
			}
			return result?.errors;
		} catch (error) {
			console.log("Error pointChallenge :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async listChallengeForm(token: string, page = 0, limit = 100) {
		try {
			const url = `${this.url_api}/digital-campaign-challenge/listChallengeForm?limit=${limit}&page=${page}`;
			const authorization = `Bearer ${token}`;
			const params = { url, headers: { authorization }, method: HTTP_METHOD.GET };
			const result = await this.http_request_my_api<MyApiResponse<CommonData>>(params);
			if (result?.success && result?.data) {
				return result?.data;
			}
			return result?.errors;
		} catch (error) {
			console.log("Error listChallengeForm :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async myChallengeForm(token: string, isToDay = false, page = 0, limit = 100) {
		try {
			const url = `${this.url_api}/digital-campaign-challenge/myChallengeForm?limit=${limit}&page=${page}&isToDay=${isToDay}`;
			const authorization = `Bearer ${token}`;
			const params = { url, headers: { authorization }, method: HTTP_METHOD.GET };
			const result = await this.http_request_my_api<MyApiResponse<CommonData>>(params);
			if (result?.success && result?.data) {
				return result?.data;
			}
			return result?.errors;
		} catch (error) {
			console.log("Error myChallengeForm :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async myChallengeAction(token: string, page = 0, limit = 10) {
		try {
			const url = `${this.url_api}/digital-campaign-challenge/myChallengeAction?challengeId=${this.warriorId}&limit=${limit}&page=${page}&isToDay=false`;
			const authorization = `Bearer ${token}`;
			const params = { url, headers: { authorization }, method: HTTP_METHOD.GET };
			const result = await this.http_request_my_api<MyApiResponse<CommonData>>(params);
			if (result?.success && result?.data) {
				return result?.data;
			}
			return result?.errors;
		} catch (error) {
			console.log("Error myChallengeAction :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async leadForm(token: string, data: AxiosData) {
		try {
			const url = `${this.url_api}/digital-campaign-challenge/leadForm`;
			const authorization = `Bearer ${token}`;
			const params = { url, headers: { authorization }, method: HTTP_METHOD.POST, data: data };
			const result = await this.http_request_my_api<MyApiResponse<CommonData>>(params);
			if (result?.success && result?.data) {
				return result?.data;
			}
			return result?.errors;
		} catch (error) {
			console.log("Error leadForm :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async snatch(token: string) {
		try {
			const data = {
				challengeId: this.warriorId,
			};
			const url = `${this.url_api}/digital-campaign-challenge/snatch`;
			const authorization = `Bearer ${token}`;
			const params = { url, headers: { authorization }, method: HTTP_METHOD.POST, data: data };
			const result = await this.http_request_my_api<MyApiResponse<CommonData>>(params);
			if (result?.success && result?.data) {
				return result?.data;
			}
			return result?.errors;
		} catch (error) {
			console.log("Error snatch :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async checkSnatch(token: string, joinId: string) {
		try {
			const url = `${this.url_api}/digital-campaign-challenge/checkSnatch/${joinId}`;
			const authorization = `Bearer ${token}`;
			const params = { url, headers: { authorization }, method: HTTP_METHOD.POST, data: {} };
			const result = await this.http_request_my_api<MyApiResponse<CommonData>>(params);
			if (result?.success && result?.data) {
				return result?.data;
			}
			return result?.errors;
		} catch (error) {
			console.log("Error checkSnatch :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async listWinner(token: string, search = "", page = 0, limit = 10) {
		try {
			const url = `${this.url_api}/digital-campaign-winner-rounds?limit=${limit}&page=${page}&search=${search}`;
			const authorization = `Bearer ${token}`;
			const params = { url, headers: { authorization }, method: HTTP_METHOD.GET };
			const result = await this.http_request_my_api<MyApiResponse<CommonData>>(params);
			if (result?.success && result?.data) {
				return result?.data;
			}
			return result?.errors;
		} catch (error) {
			console.log("Error listWinner :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async submitBottle(token: string, data: AxiosData) {
		try {
			const url = `${this.url_api}/digital-campaign-retailers/submitBottle`;
			const authorization = `Bearer ${token}`;
			const params = { url, headers: { authorization }, method: HTTP_METHOD.POST, data: data };
			const result = await this.http_request_my_api<MyApiResponse<CommonData>>(params);
			if (result?.success && result?.data) {
				return result?.data;
			}
			return result?.errors;
		} catch (error) {
			console.log("Error submitBottle :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async checkResultSubmitBottle(token: string, data: AxiosData) {
		try {
			const url = `${this.url_api}/digital-campaign-retailers/checkResultSubmitBottle`;
			const authorization = `Bearer ${token}`;
			const params = { url, headers: { authorization }, method: HTTP_METHOD.POST, data };
			const result = await this.http_request_my_api<MyApiResponse<CommonData>>(params);
			if (result?.success && result?.data) {
				return result?.data;
			}
			return result?.errors;
		} catch (error) {
			console.log("Error checkResultSubmitBottle :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async listRequest(token: string, page = 0, limit = 10) {
		try {
			const url = `${this.url_api}/digital-campaign-retailers/listRequest?limit=${limit}&page=${page}`;
			const authorization = `Bearer ${token}`;
			const params = { url, headers: { authorization }, method: HTTP_METHOD.GET };
			const result = await this.http_request_my_api<MyApiResponse<CommonData>>(params);
			if (result?.success && result?.data) {
				return result?.data;
			}
			return result?.errors;
		} catch (error) {
			console.log("Error listRequest :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async stores() {
		try {
			const url = `${this.url_api}/digital-campaign-anonymous/stores?campaignId=${this.campaign_id}`;
			const params = { url, method: HTTP_METHOD.GET };
			const result = await this.http_request_my_api<MyApiResponse<CommonData>>(params);
			if (result?.success && result?.data) {
				return result?.data;
			}
			return result?.errors;
		} catch (error) {
			console.log("Error stores :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}
}

export default new AdtimaBoxApi();
