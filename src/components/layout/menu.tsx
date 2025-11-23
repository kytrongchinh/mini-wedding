import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { MY_ROUTERS, BUTTON_NAME } from "@/types/enums";

import clsx from "clsx";
import useAuth from "@/hooks/useAuth";
import { extractCodeFromText } from "@/utils/base";
import QRScanner from "../scan/qr-scan";
import device from "@/services/miniapp/device";
import { useRecoilState, useRecoilValue } from "recoil";
import { modalAtom } from "@/stores/modal";
import { MESSAGE_TEMPLATES } from "@/types/messages";
import { campaignAtom } from "@/stores/campaign";

import { MenuItem } from "@/types/interface";
import { SVG } from "../Image";
//prettier-ignore
const list: MenuItem[] = [
	{
		id: 1,
		name: "Thiệp",
		img: "HOME",
		img_active: "HOME_ACTIVE",
		path: MY_ROUTERS.HOME,
		activePaths:[MY_ROUTERS.HOME]
	},
	{
		id: 2,
		name: "Ảnh cưới",
		img: "SCAN",
		img_active: "SCAN_ACTIVE",
		path: `/shares${MY_ROUTERS.ALBUM}`,
		activePaths:[`/shares${MY_ROUTERS.ALBUM}`]
	},
		
	{
		id: 3,
		name: "Ảnh tiệc",
		img: "DOC",
		img_active: "DOC_ACTIVE",
		path: `/shares${MY_ROUTERS.PHOTO}`,
		activePaths:[`/shares${MY_ROUTERS.PHOTO}`]
	},
	{
		id: 4,
		name: "Lời chúc",
		img: "DOC",
		img_active: "DOC_ACTIVE",
		path: MY_ROUTERS.MESSAGE,
		activePaths:[MY_ROUTERS.MESSAGE]
	},
	
];

const Menu = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const [, setComModal] = useRecoilState(modalAtom);
	const campaign = useRecoilValue(campaignAtom);
	const { user, handleLogin } = useAuth();
	const isActive = (activePaths: string[]) => {
		// Kiểm tra xem current path có trong activePaths không
		if (activePaths.includes(location.pathname)) {
			return true;
		}

		// Kiểm tra cho các route có parameter (như ROUTERS.SCAN_ID)
		// const listRouterTo: string[] = [ROUTERS.POLICY];
		// if (activePaths.includes("#") && isRouteMatch(location.pathname, listRouterTo)) {
		// 	return true;
		// }

		return false;
	};
	const [activeItem, setActiveItem] = useState(2);
	const [isScanning, setIsScanning] = useState(false);

	const handleGoto = async (item: MenuItem) => {
		setActiveItem(item?.id);
		try {
			if (user) {
				// Kiểm tra nếu path là "#" thì scan QR
				if (item?.path === "#") {
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
									noted: ``,
									buttonName: BUTTON_NAME.CLOSE,
								}));
							}
						}
					}, 500);
					return;
				} else {
					return navigate(item?.path, { replace: true });
				}
			} else {
				if (item?.path == MY_ROUTERS.PROFILE) {
					// handleLogin(item?.path);
					return navigate(item?.path, { replace: true });
				} else if (item?.path === "#") {
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
									noted: ``,
									buttonName: BUTTON_NAME.CLOSE,
								}));
							}
						}
					}, 500);
					return;
				} else {
					return navigate(item?.path, { replace: true });
				}
			}
		} catch (error) {
			console.log("handleGoto error :>> ", error);
			navigate(MY_ROUTERS.HOME, { replace: true });
		}
	};

	return (
		<>
			{isScanning && <QRScanner scanning={isScanning} setScanning={() => setIsScanning(!isScanning)} />}
			<div className="menu">
				<div className="flex justify-around items-center w-full">
					{list.map((item) => (
						<button key={item.id} onClick={() => handleGoto(item)} className={clsx({ active: isActive(item.activePaths) }, "menu__item ")}>
							{/* <img src={isActive(item.activePaths) ? item?.img_active : item?.img} /> */}
							<SVG type={isActive(item.activePaths) ? item?.img_active : item?.img} />
							<span className="text-sm uppercase">{item.name}</span>
						</button>
					))}
				</div>
			</div>
		</>
	);
};

export default Menu;
