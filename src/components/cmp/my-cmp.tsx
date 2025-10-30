import React, { FC } from "react";
// -- Other --
import _ from "lodash";
import { useRecoilState } from "recoil";
import { userAtom } from "@/stores/user";
import { adtimaAtom } from "@/stores/adtima";
import { MODAL_NAME, MY_ROUTERS, BUTTON_NAME } from "@/types/enums";
import { CommonFields, CommonProps } from "@/types/interface";
import zalo from "@/services/miniapp/zalo";
import adtimabox from "@/services/adtimabox";
import { loadImage } from "@/utils/base";
import basic from "@/services/miniapp/basic";
import routing from "@/services/miniapp/routing";
import { useNavigate } from "react-router-dom";

import { modalAtom } from "@/stores/modal";
import { MESSAGE_TEMPLATES } from "@/types/messages";
const filePolicy = loadImage("/public/frontend/2025-warrior/file/THE-LE-CHUONG-TRINH-NAP-WARRIOR-NHAN-VE-CONCERT-EM-XINH.pdf");

const MyCmp: FC<CommonProps> = (props) => {
	const { cmpData, register, errors, type } = props;
	const [user, setUser] = useRecoilState(userAtom);
	const [adtima, setAdtima] = useRecoilState(adtimaAtom);
	const navigate = useNavigate();
	const [, setComModal] = useRecoilState(modalAtom);
	if (!_.isArray(cmpData?.termList)) return;

	const handlePolicy = async () => {
		try {
			// navigate(ROUTERS.TNC);
			// console.log(`filePolicy==>`, filePolicy);
			const appInfo: CommonFields | boolean = await basic.getSystemInfo();
			if (appInfo && appInfo?.platform === "android") {
				// const open = await basic.openOutApp(filePolicy);
				navigate(MY_ROUTERS.TNC);
			} else {
				navigate(MY_ROUTERS.TNC);

				// const open = await routing.openWebview(filePolicy);
			}
		} catch (error) {}
	};

	const renderError = (term: CommonFields) => {
		let error = "";
		switch (term?.name) {
			case "Đủ 18 tuổi":
				error = `Vui lòng xác nhận đã đủ 18 tuổi`;
				break;
			case "Theo dõi OA":
				error = `Vui lòng đồng ý theo dõi OA`;
				break;
			case "Chính sách quyền riêng tư":
				error = `Vui lòng đồng ý điều khoản chương trình`;
				break;
			default:
				error = `Vui lòng đồng ý `;
				break;
		}
		return error;
	};
	const renderLabel = (name: string) => {
		if (name == "Đủ 18 tuổi") {
			return <div className="text">Tôi xác nhận đủ hoặc trên 15 tuổi</div>;
		} else if (name == "Theo dõi OA") {
			return <div className="text">Quan tâm OA Coca-Cola Chai Nhựa Tái Sinh để nhận thêm thông tin</div>;
		} else if (name == "Chính sách quyền riêng tư") {
			return (
				<div className="text">
					Tôi đã đọc và đồng ý{" "}
					<a href="#" onClick={handlePolicy}>
						thể lệ và điều khoản chương trình
					</a>
				</div>
			);
		} else {
			return <span className="px-2 text-wrap">{name}</span>;
		}
	};

	const handleClickLink = async (e: any, label: string, name: string) => {
		if (label == "Theo dõi OA" || label == "Đồng ý theo dõi OA") {
			e.preventDefault();
			const is_check = e.target.checked;

			if (is_check == true) {
				let follow = await zalo.followOA();
				// console.log(follow, "follow");
				if (import.meta.env.MODE == "development") {
					follow = true;
					setTimeout(() => {
						e.target.checked = true;
					}, 1000);
				}

				if (follow) {
					const up_user = await adtimabox.checkFollow(adtima?.accessToken);
					if (up_user?.data) {
						// await storage.setStorage("userInfo", up_user?.data);
						// setUser(up_user?.data);
						e.target.checked = true;
					}
				} else {
					// GAevent(ACTIONS.OA_FOLLOW_REJECT);

					setComModal((prevState) => ({
						...prevState,
						open: true,
						name: MODAL_NAME.DEFAULT,
						content: MESSAGE_TEMPLATES.FOLLOW_OA,
						buttonName: BUTTON_NAME.TIEP_TUC,
					}));
				}
			} else {
				if (user?.isFollow == true) {
					props.clearErrors(name);
					props.setValue(name, true);
				}
			}
		}
	};

	const renderTermCusstom = () => {
		return cmpData.termList.map(({ values }) => {
			const term = values[0];
			const nameCheckbox = "checkbox_" + term?._id;
			const label = term?.name;
			const link = term?.link;

			return (
				<div className="form-groups checkbox" key={term._id}>
					<div className="form-groups-w">
						<label htmlFor={`cb-${term._id}`}>
							<input
								{...register(nameCheckbox, { required: true })}
								// className="w-[20px] mt-1"
								type="checkbox"
								id={`cb-${term._id}`}
								onClick={(e) => handleClickLink(e, label, nameCheckbox)}
							/>
							<div className="cbox">
								<span></span>
							</div>

							{renderLabel(label)}
						</label>
					</div>
					{errors?.["checkbox_" + term._id] && <div className="error" dangerouslySetInnerHTML={{ __html: renderError(term) }}></div>}
				</div>
			);
		});
	};

	return <>{renderTermCusstom()}</>;
};

export default MyCmp;
