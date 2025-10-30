import { extractCodeFromText } from "@/utils/base";
import React, { useEffect } from "react";
import { QrReader } from "react-qr-reader";
import { useNavigate } from "react-router-dom";
import "./scan.scss";
import { useRecoilState } from "recoil";
import { modalAtom } from "@/stores/modal";
import { MESSAGE_TEMPLATES } from "@/types/messages";
import userApi from "@/services/miniapp/user";
import _ from "lodash";
import { MODAL_NAME } from "@/types/enums";
import { MY_ROUTERS, BUTTON_NAME } from "@/types/enums";
interface QRScannerProps {
	scanning: boolean;
	setScanning: (state: boolean) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ scanning, setScanning }) => {
	const navigate = useNavigate();
	const [, setComModal] = useRecoilState(modalAtom);

	const handleScan = (data: string | null) => {
		if (data) {
			console.log(`Scanned: ${data}`);
			setScanning(false);
			const code = extractCodeFromText(data);
			if (code) {
				return navigate(`${MY_ROUTERS.SCAN}/${code}`);
			} else {
				setComModal((prevState) => ({
					...prevState,
					name: "confirmed-exit",
					open: true,
					modalOA: false,
					content: MESSAGE_TEMPLATES.QR_INVALID,
					noted: ``,
					buttonName: BUTTON_NAME.CLOSE,
				}));
			}
		}
	};

	const checkCam = async () => {
		const getSetting = await userApi.getSetting();
		if (_.isEmpty(getSetting)) {
			// console.log("okoko");
		} else {
			// console.log(getSetting);
			if (!getSetting?.authSetting?.["scope.camera"]) {
				setScanning(false);
				setComModal((prevState) => ({
					...prevState,
					name: MODAL_NAME.CAMERA_PERMISSION,
					open: true,
					modalOA: false,
					content: MESSAGE_TEMPLATES.CAMERA_PERMISSION,
					noted: ``,
					buttonName: BUTTON_NAME.CLOSE,
				}));
			}
		}
	};

	const handleError = (err: any) => {
		console.error("QR Scanner Error:", err);
		if (_.isEmpty(err)) {
			checkCam();
		}
	};

	return (
		<div className={`qr-scanner-container ${scanning ? "active" : ""}`}>
			{scanning && (
				<div className="qr-scanner">
					<QrReader
						onResult={(result, error) => {
							if (result) handleScan(result.getText());
							if (error) handleError(error);
						}}
						constraints={{ facingMode: "environment" }} // Use back camera
						containerStyle={{ width: "100%", height: "100%" }}
					/>
					<button className="close-button" onClick={() => setScanning(false)}>
						ĐÓNG
					</button>
				</div>
			)}
		</div>
	);
};

export default QRScanner;
