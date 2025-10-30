import { HTTP_METHOD, HTTP_STATUS_CODE } from "types/enums";
import { CommonData, MyApiResponse } from "types/interface";
import { ParamsAxios } from "types/types";
import CallApi from "@/utils/call-api";

class SocialZalo extends CallApi {
	private app_url: string;
	private app_api: string;
	private app_secret_key: string;
	constructor() {
		super();
		this.app_api = import.meta.env.VITE_APP_ID;
		this.app_url = "https://oauth.zaloapp.com/v4";
		this.app_secret_key = import.meta.env.VITE_APP_SECRET;
	}
	async getZaloAccessTokenByOauthCode(oauth_code: string) {
		try {
			const url = `${this.app_url}/access_token`;
			const params: ParamsAxios = {
				url,
				headers: { secret_key: this.app_secret_key, "Content-type": "application/x-www-form-urlencoded" },
				method: HTTP_METHOD.POST,
				data: {
					code: oauth_code,
					app_id: this.app_api,
					grant_type: "authorization_code",
				},
			};
			const result = await this.http_request<MyApiResponse<CommonData>>(params);
			return result;
			// return {
			// 	statusCode: HTTP_STATUS_CODE.OK,
			// 	data: result,
			// 	message: "OK",
			// };
		} catch (error) {
			console.log("Error getZaloAccessTokenByOauthCode :>> ", error);
			return {
				statusCode: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
				data: {},
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
}
export default new SocialZalo();
