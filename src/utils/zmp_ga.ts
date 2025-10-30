import { AdaptiveAnalytics } from "zmp-ga4";

let GA: AdaptiveAnalytics | null = null;
const trackingId: string = import.meta.env.VITE_GOOGLE_ANALYTICS;

export const initGA = (): void => {
	GA = new AdaptiveAnalytics(
		trackingId, // measurement id
		"duEGzRreSOaUjZ9bR984PA", // measurement protocol api secrets
		{
			useMeasurementProtocolWhen() {
				return true;
			},
			gtagConfig: {
				send_page_view: false,
			},
		}
	);
};

export const GAevent = (eventName: keyof typeof ACTIONS): void => {
	if (GA) {
		const params = loadEvent(eventName);
		GA.trackEvent(eventName, params);
	}
};

export const ACTIONS = {
	click_btn_tham_gia_ngay: "click_btn_tham_gia_ngay",
	click_btn_hoan_tat: "click_btn_hoan_tat",
	click_btn_bat_dau_choi: "click_btn_bat_dau_choi",
	display_thong_bao_trung_thuong_giai_dac_biet: "display_thong_bao_trung_thuong_giai_dac_biet",
	display_thong_bao_trung_thuong_giai_nhat: "display_thong_bao_trung_thuong_giai_nhat",
	display_thong_bao_trung_thuong_20k: "display_thong_bao_trung_thuong_20k",
	display_thong_bao_khong_trung_thuong: "display_thong_bao_khong_trung_thuong",
} as const;

type EventParams = {
	label: string;
	category: string;
	description: string;
};

const loadEvent = (eventName: keyof typeof ACTIONS): EventParams => {
	let params: EventParams = {
		label: eventName,
		category: eventName,
		description: "",
	};

	switch (eventName) {
		//--------------------------------------------
		case "click_btn_tham_gia_ngay":
			params = {
				category: "Trang Homepage",
				label: "Tham gia ngay",
				description: "Nút Tham gia ngay trong trang chủ",
			};
			break;
		//--------------------------------------------
		case "click_btn_hoan_tat":
			params = {
				category: "Nhập mã, điền thông tin",
				label: "Hoàn tất",
				description: "Nút Hoàn tất trong điền thông tin",
			};
			break;
		//--------------------------------------------
		case "click_btn_bat_dau_choi":
			params = {
				category: "Trang tham gia",
				label: "Bắt đầu chơi",
				description: "Nút Bắt đầu chơi trong game",
			};
			break;
		//--------------------------------------------
		case "display_thong_bao_trung_thuong_giai_dac_biet":
			params = {
				category: "Pop_up thông báo kết quả",
				label: "Trúng thưởng giải đặc biệt",
				description: "Khi hiển thị pop_up thông báo kết quả Trúng thưởng giải đăc biệt",
			};
			break;
		//--------------------------------------------
		case "display_thong_bao_trung_thuong_giai_nhat":
			params = {
				category: "Pop_up thông báo kết quả",
				label: "Trúng thưởng giải nhất",
				description: "Khi hiển thị pop_up thông báo kết quả Trúng thưởng giải nhất",
			};
			break;
		//--------------------------------------------
		case "display_thong_bao_trung_thuong_20k":
			params = {
				category: "Pop_up thông báo kết quả",
				label: "Trúng thưởng 20k",
				description: "Khi hiển thị pop_up thông báo kết quả Trúng thưởng 20k",
			};
			break;
		//--------------------------------------------
		case "display_thong_bao_khong_trung_thuong":
			params = {
				category: "Pop_up thông báo kết quả",
				label: "Không trúng thưởng",
				description: "Khi hiển thị pop_up thông báo kết quả Không trúng thưởng",
			};
			break;
	}

	return params;
};
