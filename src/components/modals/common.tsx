import React, { FC } from "react";
import Modal from "react-modal";
// -- Components --
import _ from "lodash";
import { CommonProps } from "@/types/interface";
import "./modals.scss";

import { MODAL_NAME } from "@/types/enums";
import { useNavigate } from "react-router-dom";
import { MY_ROUTERS, BUTTON_NAME } from "@/types/enums";
import { MESSAGE_TEMPLATES } from "@/types/messages";
import { extractCodeFromText } from "@/utils/base";
import { useRecoilState } from "recoil";
import { modalAtom } from "@/stores/modal";
import { motion } from "framer-motion";

import close from "@/assets/images/close.png";
import ButtonDefault from "../ButtonDefault/ButtonDefault";
import device from "@/services/miniapp/device";
import zalo from "@/services/miniapp/zalo";
import useAuth from "@/hooks/useAuth";

const CommonModal: FC<CommonProps> = (props) => {
	const navigate = useNavigate();
	const { modalIsOpen, onClose, content, name, buttonName = "Về OA", handleModalActionClick, noted = "" } = props;
	const [_, setComModal] = useRecoilState(modalAtom);

	const { handleLogin } = useAuth();

	const renderContent = () => {
		let button: string | null | React.ReactElement = <ButtonDefault text={buttonName} buttonType="button-style flex justify-center mt-5" onClick={handleModalActionClick} />;

		if (name == MODAL_NAME.BLOCK_USER_ALL) {
			button = (
				<div className="mt-5">
					<div className="mb-3">
						<ButtonDefault text={BUTTON_NAME.XEM_THE_LE} buttonType="button-style" onClick={() => handelClickButton(BUTTON_NAME.XEM_THE_LE)} />
					</div>
					<ButtonDefault text={BUTTON_NAME.LIEN_HE_ZALO} buttonType="button-style" onClick={() => handelClickButton(BUTTON_NAME.LIEN_HE_ZALO)} />
				</div>
			);
		}
		if (name == MODAL_NAME.BLOCK_USER) {
			button = (
				<div className="mt-5">
					<div className="mb-3">
						<ButtonDefault text={BUTTON_NAME.XEM_THE_LE} buttonType="button-style" onClick={() => handelClickButton(BUTTON_NAME.XEM_THE_LE)} />
					</div>
				</div>
			);
		}

		if (name == MODAL_NAME.PHONE_PERMISSION) {
			button = (
				<div className="mt-5">
					<div className="mb-3">
						<ButtonDefault text={BUTTON_NAME.TIEP_TUC} buttonType="button-style" onClick={() => handelClickButton(MODAL_NAME.PHONE_PERMISSION)} />
					</div>
				</div>
			);
		}
		if (name == MODAL_NAME.NOTI_AUTH) {
			button = (
				<div className="mt-5">
					<div className="mb-3">
						<ButtonDefault text={BUTTON_NAME.TIEP_TUC} buttonType="button-style" onClick={() => handelClickButton(MODAL_NAME.NOTI_AUTH)} />
					</div>
				</div>
			);
		}

		if (name == MODAL_NAME.VIEW_IMAGE) {
			return (
				<div className="content">
					<img src={content} alt={`Gallery ${content}`} className="rounded-lg shadow-lg w-full h-full object-cover" />
					<div className="mt-5">
						<div className="mb-3">
							<ButtonDefault text={BUTTON_NAME.CLOSE} buttonType="button-style" onClick={() => handelClickButton(BUTTON_NAME.CLOSE)} />
						</div>
					</div>
				</div>
			);
		} else {
			return (
				<div className="content">
					<div dangerouslySetInnerHTML={{ __html: content }} />
					{button}
				</div>
			);
		}
	};

	const handelClickButton = async (buttonName: string) => {
		onClose();
		if (buttonName == BUTTON_NAME.CAP_NHAT_NGAY) {
		} else if (buttonName == BUTTON_NAME.NHAP_LAI_MA) {
			navigate(MY_ROUTERS.HOME);
			setTimeout(async () => {
				const scan = await device.scanQRCode();
				if (scan?.content) {
					const code = extractCodeFromText(scan?.content);
					if (code) {
						return navigate(`${MY_ROUTERS.SCAN}/${code}`);
					} else {
						setComModal((prevState) => ({
							...prevState,
							name: "confirmed-exit",
							open: true,
							modalOA: false,
							content: MESSAGE_TEMPLATES.QR_INVALID,
							imageUrl: "",
							noted: ``,
							buttonName: BUTTON_NAME.CLOSE,
						}));
					}
				}
			}, 500);
			return;
		} else if (buttonName == BUTTON_NAME.LIEN_HE_ZALO) {
			navigate(MY_ROUTERS.HOME);
			setTimeout(() => {
				zalo.openProfile("oa", import.meta.env.VITE_ZALO_OA_ID);
			}, 500);
			return;
		} else if (buttonName == BUTTON_NAME.XEM_THE_LE) {
			navigate(MY_ROUTERS.TNC);

			return;
		} else if (buttonName == BUTTON_NAME.VE_TRANG_CHU) {
			navigate(MY_ROUTERS.HOME);
			return;
		} else if (buttonName == BUTTON_NAME.VE_TRANG_CA_NHAN) {
			navigate(MY_ROUTERS.PROFILE);
			return;
		} else if (buttonName == MODAL_NAME.PHONE_PERMISSION) {
			// handleLogin();
			setComModal((prevState) => ({
				...prevState,
				name: MODAL_NAME.PHONE_PERMISSION,
				open: false,
				modalOA: false,
				content: "",
				imageUrl: "",
				noted: `click`,
				buttonName: BUTTON_NAME.CLOSE,
			}));
			return;
		} else {
			onClose();
		}
	};

	return (
		<Modal isOpen={modalIsOpen} contentLabel="Example Modal" ariaHideApp={!modalIsOpen}>
			<div className="modal secondary mt-5" style={{ marginTop: "80px" }}>
				<div className="close-md" onClick={onClose}>
					<motion.div
						whileTap={{
							scale: 0.9,
						}}
						className="img"
					>
						<img src={close} />
					</motion.div>
				</div>
				<div className="md-content box">
					<div className="body">
						<div className="text-center">{renderContent()}</div>
					</div>
				</div>
			</div>
		</Modal>
	);
};
export default CommonModal;
