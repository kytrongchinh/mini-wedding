import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useRecoilState } from "recoil";
import { userAtom } from "@/stores/user";
import storage from "@/utils/storage";
import { formatTime } from "@/utils/time";
import {
	ROUTRERS_BLOCK_NOT_ACCESS,
	ROUTRERS_LIMIT,
	ROUTRERS_NEED_AUTH,
	ROUTRERS_NEED_FOLLOW_OA,
	ROUTRERS_USER_CANNOT_ACCESS_AFTER_CAMPAIGN_END,
	ROUTRERS_USER_CANNOT_ACCESS_BEFORE_CAMPAIGN_START,
} from "@/types/contants";
import { campaignAtom } from "@/stores/campaign";
import { paramsAtom } from "@/stores/params";
import { modalAtom } from "@/stores/modal";
import { MODAL_NAME, MY_ROUTERS, BUTTON_NAME } from "@/types/enums";
import { loadMyMessage, MESSAGE_TEMPLATES } from "@/types/messages";
import myapi from "@/services/myapi";
import { isRouteMatch } from "@/utils/base";
// import adtimabox from "@/services/adtimabox";
import { showToast } from "zmp-sdk/apis";
const useCampaign = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [user, setUser] = useRecoilState(userAtom);

	const [campaign, setCampaign] = useRecoilState(campaignAtom);
	const [, setComModal] = useRecoilState(modalAtom);
	const [, setMParams] = useRecoilState(paramsAtom);

	useEffect(() => {
		const initialCampaign = async () => {
			if (!campaign) {
				const m_campaign = await myapi.info();
				// const m_campaign = await adtimabox.getCampaignDetail();
				console.log(`==> m_campaign`, m_campaign);
				let campaignInfo: any = {};
				if (m_campaign?.data) {
					campaignInfo = m_campaign?.data;
					await storage.setStorage("campaignInfo", campaignInfo);
					setCampaign(campaignInfo);
					checkCampaign(campaignInfo);
				}
			} else {
				checkCampaign(campaign);
			}
		};

		const checkCampaign = async (campaign: any) => {
			if (campaign) {
				const startDate = campaign?.startDateTimestamp || formatTime(campaign?.startDate || "2025-07-20", "x");
				const endDate = campaign?.endDateTimestamp || formatTime(campaign?.endDate || "2025-02-28", "x");
				const current = formatTime(Date.now(), "x");
				if (isRouteMatch(location.pathname as MY_ROUTERS, ROUTRERS_USER_CANNOT_ACCESS_BEFORE_CAMPAIGN_START)) {
					if (current < startDate) {
						setComModal((prevState) => ({
							...prevState,
							open: true,
							name: MODAL_NAME.NOTI_START,
							content: loadMyMessage(MESSAGE_TEMPLATES.START_CAMPAIGN, {
								startDate: formatTime(campaign?.startDate || "2025-02-02", "DD/MM/YYYY"),
								endDate: formatTime(campaign?.endDate || "2025-02-02", "DD/MM/YYYY"),
							}),
							buttonName: BUTTON_NAME.CLOSE,
						}));
						await storage.removeStorage("campaignInfo");
						setCampaign(null);
						return navigate(MY_ROUTERS.TNC, { replace: true });
					}
				}
				if (isRouteMatch(location.pathname as MY_ROUTERS, ROUTRERS_USER_CANNOT_ACCESS_AFTER_CAMPAIGN_END)) {
					if (current > endDate) {
						// console.log(`==>22222`);
						setComModal((prevState) => ({
							...prevState,
							open: true,
							name: MODAL_NAME.NOTI_END,
							content: loadMyMessage(MESSAGE_TEMPLATES.END_CAMPAIGN, {
								startDate: formatTime(campaign?.startDate || "2025-02-02", "DD/MM/YYYY"),
								endDate: formatTime(campaign?.endDate || "2025-02-02", "DD/MM/YYYY"),
							}),
							buttonName: BUTTON_NAME.CLOSE,
						}));
						return navigate(MY_ROUTERS.TNC, { replace: true });
					}
				}

				if (isRouteMatch(location.pathname as MY_ROUTERS, ROUTRERS_NEED_AUTH)) {
					if (!user) {
						setMParams((preParams) => ({
							...preParams,
							redirect: location.pathname,
						}));
						showToast({
							message: "Vui lòng chọn Tham gia ngay để tiếp tục!",
						});
						return navigate(MY_ROUTERS.HOME, { replace: true });
					}
				}

				if (isRouteMatch(location.pathname as MY_ROUTERS, ROUTRERS_NEED_FOLLOW_OA)) {
					if (user && user?.doneForm === 1) {
						if (!user?.uId || !user?.isFollow) {
							setComModal((prevState) => ({
								...prevState,
								open: true,
								name: MODAL_NAME.FOLLOW,
								content: MESSAGE_TEMPLATES.FOLLOW_OA,
								buttonName: BUTTON_NAME.TIEP_TUC,
							}));
							return navigate(MY_ROUTERS.HOME);
						}
					}
				}

				if (isRouteMatch(location.pathname as MY_ROUTERS, ROUTRERS_LIMIT)) {
					if (user && user?.status === -1) {
						setComModal((prevState) => ({
							...prevState,
							open: true,
							name: MODAL_NAME.CAN_NOT_JOIN,
							content: MESSAGE_TEMPLATES.CAN_NOT_JOIN_CAMPAIGN,
							buttonName: BUTTON_NAME.VE_TRANG_CHU,
						}));
						return navigate(MY_ROUTERS.HOME);
					}
				}
				if (isRouteMatch(location.pathname as MY_ROUTERS, ROUTRERS_BLOCK_NOT_ACCESS)) {
					if (user?.isCheat && user?.levelBlock !== 0) {
						setComModal((prevState) => ({
							...prevState,
							open: true,
							name: MODAL_NAME.BLOCK_USER_ALL,
							content: user?.levelBlock === 1 ? MESSAGE_TEMPLATES.BLOCK_USER : user?.type_block === 2 ? MESSAGE_TEMPLATES.BLOCK_USER : MESSAGE_TEMPLATES.BLOCK_USER,
							buttonName: BUTTON_NAME.XEM_THE_LE,
						}));
						return navigate(MY_ROUTERS.TNC, { replace: true });
					}
				}
			} else {
				setCampaign(null);
				return navigate(MY_ROUTERS.HOME, { replace: true });
			}
		};

		initialCampaign();
	}, [location.pathname]);
};

export default useCampaign;
