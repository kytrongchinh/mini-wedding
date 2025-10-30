import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import storage from "@/utils/storage";

import { adtimaAtom } from "@/stores/adtima";
import { userAtom } from "@/stores/user";
import { zaloAtom } from "@/stores/zalo";
import { authorizeAtom } from "@/stores/authorize";
import { useRecoilState } from "recoil";
import myapi from "@/services/myapi";
import adtimabox from "@/services/adtimabox";
import { CommonData } from "@/types/interface";
const useLoadProfile = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const [user, setUser] = useRecoilState(userAtom);
	const [, setZalo] = useRecoilState(zaloAtom);
	const [adtima, setAdtima] = useRecoilState(adtimaAtom);
	const [, setAuthorize] = useRecoilState(authorizeAtom);

	useEffect(() => {
		const loadProfile = async () => {
			if (adtima && user) {
				let my_user: CommonData | null = null;
				if (import.meta.env.VITE_APP_USE_API_FROM == "my-api") {
					my_user = await myapi.getUser(adtima?.accessToken);
				} else {
					my_user = await adtimabox.getMe(adtima?.accessToken);
				}
				if (!my_user) {
					await storage.removeStorage("zaloInfo");
					setZalo(null);
					await storage.removeStorage("adtimaInfo");
					setAdtima(null);
					await storage.removeStorage("userInfo");
					setUser(null);
					await storage.removeStorage("authorizeInfo");
					setAuthorize(null);
					return navigate("/", { replace: true });
				}

				await storage.setStorage("userInfo", my_user?.data);
				setUser(my_user?.data);
			}
		};
		loadProfile();
	}, []);
	// chỉ chạy lần đầu
};

export default useLoadProfile;
