import { HTTP_METHOD, HTTP_STATUS_CODE } from "types/enums";
import { ApiResponse, AxiosData, CommonData, MyApiResponse } from "types/interface";
import { ParamsAxios } from "types/types";
import CallApi from "@/utils/call-api";

class MyApi extends CallApi {
	private my_url: string;
	private verify_token: string;
	constructor() {
		super();
		this.my_url = import.meta.env.VITE_MY_URL || "";
		this.verify_token = import.meta.env.MY_VERIFY_TOKEN || "sh05GbVwrIqc4wxFaMr5hbk";
	}
	async upload(token: string, data = {}) {
		try {
			const url = `${this.my_url}/upload`;
			const params: ParamsAxios = { url, headers: { token: token }, method: HTTP_METHOD.POST, data };
			const result = await this.http_request_my_api<ApiResponse<CommonData>>(params);
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

	/**
	 * Campaign information
	 * @param {*} token
	 * @param {*} data
	 * @returns
	 */

	//*********Campaign info**************/
	async info() {
		try {
			const url = `${this.my_url}/info`;
			const params: ParamsAxios = { url, headers: { verify_token: this.verify_token }, method: HTTP_METHOD.GET };

			const result = await this.http_request<MyApiResponse<CommonData>>(params);
			if (result?.status !== HTTP_STATUS_CODE.OK && !result?.result) {
				throw new Error(`Failed with status code ${result?.status}, data: ${JSON.stringify(result?.result)}, message: ${result?.message}`);
			}
			return result?.result;
		} catch (error) {
			console.log("Error info :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	//*********login**************/
	async login(data: AxiosData) {
		try {
			const url = `${this.my_url}/login`;
			const params: ParamsAxios = { url, headers: { verify_token: this.verify_token }, method: HTTP_METHOD.POST, data: data };

			const result = await this.http_request<MyApiResponse<CommonData>>(params);
			if (result?.status !== HTTP_STATUS_CODE.OK && !result?.result) {
				throw new Error(`Failed with status code ${result?.status}, data: ${JSON.stringify(result?.result)}, message: ${result?.message}`);
			}
			return result?.result;
		} catch (error) {
			console.log("Error login :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	//*********User**************/
	async getUser(token: string) {
		try {
			const url = `${this.my_url}/user`;
			const params: ParamsAxios = { url, headers: { verify_token: this.verify_token, login_token: token }, method: HTTP_METHOD.GET };

			const result = await this.http_request<MyApiResponse<CommonData>>(params);
			if (result?.status !== HTTP_STATUS_CODE.OK && !result?.result) {
				throw new Error(`Failed with status code ${result?.status}, data: ${JSON.stringify(result?.result)}, message: ${result?.message}`);
			}
			return result?.result;
		} catch (error) {
			console.log("Error getUser :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async updateUser(token: string, data: AxiosData) {
		try {
			const url = `${this.my_url}/user/update`;
			const params: ParamsAxios = { url, headers: { verify_token: this.verify_token, login_token: token }, method: HTTP_METHOD.POST, data };
			const result = await this.http_request_my_api<MyApiResponse<CommonData>>(params);
			if (result?.success && result?.data) {
				return result?.data;
			}
			return result?.errors;
		} catch (error) {
			console.log("Error updateUser :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async follow(token: string, data: AxiosData) {
		try {
			const url = `${this.my_url}/user/follow`;
			const params: ParamsAxios = { url, headers: { verify_token: this.verify_token, login_token: token }, method: HTTP_METHOD.POST, data };
			const result = await this.http_request<MyApiResponse<CommonData>>(params);
			if (result?.status !== HTTP_STATUS_CODE.OK && !result?.result) {
				throw new Error(`Failed with status code ${result?.status}, data: ${JSON.stringify(result?.result)}, message: ${result?.message}`);
			}
			return result?.result;
		} catch (error) {
			console.log("Error follow :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async myPhoneMiniAPP(token: string, data: AxiosData) {
		try {
			const url = `${this.my_url}/user/get-phone-mini`;
			const params: ParamsAxios = { url, headers: { verify_token: this.verify_token, login_token: token }, method: HTTP_METHOD.POST, data };

			const result = await this.http_request<MyApiResponse<CommonData>>(params);
			if (result?.status !== HTTP_STATUS_CODE.OK && !result?.result) {
				throw new Error(`Failed with status code ${result?.status}, data: ${JSON.stringify(result?.result)}, message: ${result?.message}`);
			}
			return result?.result;
		} catch (error) {
			console.log("Error giftDetail :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	//*********CODE**************/
	async history(token: string, page = 0, limit = 6) {
		try {
			const url = `${this.my_url}/code/history?page=${page}&limit=${limit}`;
			const params: ParamsAxios = { url, headers: { verify_token: this.verify_token, login_token: token }, method: HTTP_METHOD.GET };

			const result = await this.http_request<MyApiResponse<CommonData>>(params);
			if (result?.status !== HTTP_STATUS_CODE.OK && !result?.result) {
				throw new Error(`Failed with status code ${result?.status}, data: ${JSON.stringify(result?.result)}, message: ${result?.message}`);
			}
			return result?.result;
		} catch (error) {
			console.log("Error history :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async recaptcha(token: string, type = "") {
		try {
			const url = `${this.my_url}/code/recaptcha?type=${type}`;
			const params: ParamsAxios = { url, headers: { verify_token: this.verify_token, login_token: token }, method: HTTP_METHOD.GET };

			const result = await this.http_request<MyApiResponse<CommonData>>(params);
			if (result?.status !== HTTP_STATUS_CODE.OK && !result?.result) {
				throw new Error(`Failed with status code ${result?.status}, data: ${JSON.stringify(result?.result)}, message: ${result?.message}`);
			}
			return result?.result;
		} catch (error) {
			console.log("Error recaptcha :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async sendCode(token: string, data: AxiosData) {
		try {
			const url = `${this.my_url}/code/send`;
			const params: ParamsAxios = { url, headers: { verify_token: this.verify_token, login_token: token }, method: HTTP_METHOD.POST, data };
			// const result = await this.http_request<MyApiResponse<CommonData>>(params);
			// if (result?.status !== HTTP_STATUS_CODE.OK && !result?.result) {
			// 	throw new Error(`Failed with status code ${result?.status}, data: ${JSON.stringify(result?.result)}, message: ${result?.message}`);
			// }
			// return result?.result;
			const result = await this.http_request_my_api<MyApiResponse<CommonData>>(params);
			if (result?.success && result?.data) {
				return result?.data;
			}
			return result?.errors;
		} catch (error) {
			console.log("Error sendCode :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	//*********PUBLIC**************/
	async storeGift() {
		try {
			const url = `${this.my_url}/mini/store`;
			const params: ParamsAxios = { url, headers: { verify_token: this.verify_token }, method: HTTP_METHOD.GET };

			const result = await this.http_request<MyApiResponse<CommonData>>(params);
			if (result?.status !== HTTP_STATUS_CODE.OK && !result?.result) {
				throw new Error(`Failed with status code ${result?.status}, data: ${JSON.stringify(result?.result)}, message: ${result?.message}`);
			}
			return result?.result;
		} catch (error) {
			console.log("Error storeGift :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async captchaStatus() {
		try {
			const url = `${this.my_url}/mini/captcha-status`;
			const params: ParamsAxios = { url, headers: { verify_token: this.verify_token }, method: HTTP_METHOD.GET };

			const result = await this.http_request<MyApiResponse<CommonData>>(params);
			if (result?.status !== HTTP_STATUS_CODE.OK && !result?.result) {
				throw new Error(`Failed with status code ${result?.status}, data: ${JSON.stringify(result?.result)}, message: ${result?.message}`);
			}
			return result?.result;
		} catch (error) {
			console.log("Error captchaStatus :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	//*********GIFT**************/
	async openGift(token: string, data: AxiosData) {
		try {
			const url = `${this.my_url}/gift/open`;
			const params: ParamsAxios = { url, headers: { verify_token: this.verify_token, login_token: token }, method: HTTP_METHOD.POST, data };
			const result = await this.http_request<MyApiResponse<CommonData>>(params);
			if (result?.status !== HTTP_STATUS_CODE.OK && !result?.result) {
				throw new Error(`Failed with status code ${result?.status}, data: ${JSON.stringify(result?.result)}, message: ${result?.message}`);
			}
			return result?.result;
		} catch (error) {
			console.log("Error openGift :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}
	async confirmGift(token: string, data: AxiosData) {
		try {
			const url = `${this.my_url}/gift/confirm`;
			const params: ParamsAxios = { url, headers: { verify_token: this.verify_token, login_token: token }, method: HTTP_METHOD.POST, data };
			const result = await this.http_request_my_api<MyApiResponse<CommonData>>(params);
			if (result?.success && result?.data) {
				return result?.data;
			}
			return result?.errors;
		} catch (error) {
			console.log("Error confirmGift :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async myGift(token: string, page = 0, limit = 6) {
		try {
			const url = `${this.my_url}/gift/my-gift?page=${page}&limit=${limit}`;
			const params: ParamsAxios = { url, headers: { verify_token: this.verify_token, login_token: token }, method: HTTP_METHOD.GET };

			const result = await this.http_request<MyApiResponse<CommonData>>(params);
			if (result?.status !== HTTP_STATUS_CODE.OK && !result?.result) {
				throw new Error(`Failed with status code ${result?.status}, data: ${JSON.stringify(result?.result)}, message: ${result?.message}`);
			}
			return result?.result;
		} catch (error) {
			console.log("Error myGift :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async giftDetail(token: string, winner_id: string) {
		try {
			const url = `${this.my_url}/gift/gift-detail?winner_id=${winner_id}`;
			const params: ParamsAxios = { url, headers: { verify_token: this.verify_token, login_token: token }, method: HTTP_METHOD.GET };

			const result = await this.http_request<MyApiResponse<CommonData>>(params);
			if (result?.status !== HTTP_STATUS_CODE.OK && !result?.result) {
				throw new Error(`Failed with status code ${result?.status}, data: ${JSON.stringify(result?.result)}, message: ${result?.message}`);
			}
			return result?.result;
		} catch (error) {
			console.log("Error giftDetail :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async getAlbums(page = 0, limit = 10) {
		try {
			const url = `${this.my_url}/album?page=${page}&limit=${limit}`;
			const params: ParamsAxios = { url, headers: { verify_token: this.verify_token }, method: HTTP_METHOD.GET };

			const result = await this.http_request<MyApiResponse<CommonData>>(params);
			if (result?.status !== HTTP_STATUS_CODE.OK && !result?.result) {
				throw new Error(`Failed with status code ${result?.status}, data: ${JSON.stringify(result?.result)}, message: ${result?.message}`);
			}
			return result?.result;
		} catch (error) {
			console.log("Error getAlbums :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async getAlbumDetail(id: string) {
		try {
			const url = `${this.my_url}/album/detail?id=${id}`;
			const params: ParamsAxios = { url, headers: { verify_token: this.verify_token }, method: HTTP_METHOD.GET };

			const result = await this.http_request<MyApiResponse<CommonData>>(params);
			if (result?.status !== HTTP_STATUS_CODE.OK && !result?.result) {
				throw new Error(`Failed with status code ${result?.status}, data: ${JSON.stringify(result?.result)}, message: ${result?.message}`);
			}
			return result?.result;
		} catch (error) {
			console.log("Error getAlbumDetail :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async getPhotos(tags = "", page = 0, limit = 10) {
		try {
			const url = `${this.my_url}/photo?tags=${tags}&page=${page}&limit=${limit}`;
			const params: ParamsAxios = { url, headers: { verify_token: this.verify_token }, method: HTTP_METHOD.GET };

			const result = await this.http_request<MyApiResponse<CommonData>>(params);
			if (result?.status !== HTTP_STATUS_CODE.OK && !result?.result) {
				throw new Error(`Failed with status code ${result?.status}, data: ${JSON.stringify(result?.result)}, message: ${result?.message}`);
			}
			return result?.result;
		} catch (error) {
			console.log("Error getPhotos :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async getPhotoDetail(id: string) {
		try {
			const url = `${this.my_url}/photo/detail?id=${id}`;
			const params: ParamsAxios = { url, headers: { verify_token: this.verify_token }, method: HTTP_METHOD.GET };

			const result = await this.http_request<MyApiResponse<CommonData>>(params);
			if (result?.status !== HTTP_STATUS_CODE.OK && !result?.result) {
				throw new Error(`Failed with status code ${result?.status}, data: ${JSON.stringify(result?.result)}, message: ${result?.message}`);
			}
			return result?.result;
		} catch (error) {
			console.log("Error getPhotoDetail :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async getInvite(name: string) {
		try {
			const url = `${this.my_url}/invitee/detail?slug_name=${name}`;
			const params: ParamsAxios = { url, headers: { verify_token: this.verify_token }, method: HTTP_METHOD.GET };
			const result = await this.http_request_my_api<MyApiResponse<CommonData>>(params);
			if (result?.success && result?.data) {
				return result?.data;
			}
			return result?.errors;
		} catch (error) {
			console.log("Error getInvite :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async sendMessage(data: AxiosData) {
		try {
			const url = `${this.my_url}/message/create`;
			const params: ParamsAxios = { url, headers: { verify_token: this.verify_token }, method: HTTP_METHOD.POST, data };

			const result = await this.http_request_my_api<MyApiResponse<CommonData>>(params);
			if (result?.success && result?.data) {
				return result?.data;
			}
			return result?.errors;
		} catch (error) {
			console.log("Error sendMessage :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async getMessages(page = 0, limit = 10) {
		try {
			const url = `${this.my_url}/message?page=${page}&limit=${limit}`;
			const params: ParamsAxios = { url, headers: { verify_token: this.verify_token }, method: HTTP_METHOD.GET };

			const result = await this.http_request<MyApiResponse<CommonData>>(params);
			if (result?.status !== HTTP_STATUS_CODE.OK && !result?.result) {
				throw new Error(`Failed with status code ${result?.status}, data: ${JSON.stringify(result?.result)}, message: ${result?.message}`);
			}
			return result?.result;
		} catch (error) {
			console.log("Error getMessages :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}

	async getMessageDetail(id: string) {
		try {
			const url = `${this.my_url}/message/detail?id=${id}`;
			const params: ParamsAxios = { url, headers: { verify_token: this.verify_token }, method: HTTP_METHOD.GET };

			const result = await this.http_request<MyApiResponse<CommonData>>(params);
			if (result?.status !== HTTP_STATUS_CODE.OK && !result?.result) {
				throw new Error(`Failed with status code ${result?.status}, data: ${JSON.stringify(result?.result)}, message: ${result?.message}`);
			}
			return result?.result;
		} catch (error) {
			console.log("Error getMessageDetail :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: null,
				message: "Failed",
			};
		}
	}
}
export default new MyApi();
