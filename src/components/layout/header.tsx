import React, { FC, useEffect, useState } from "react";
import { Icon } from "zmp-ui";
import { useLocation, useNavigate } from "react-router-dom";

import { LIST_ROUTER_DISABLE, LIST_ROUTER_GO_BACK, LIST_ROUTER_TO_HOME, LIST_ROUTER_TO_ROUTER } from "@/types/contants";
import { modalAtom } from "@/stores/modal";

import { useRecoilState } from "recoil";
import { MESSAGE_TEMPLATES } from "@/types/messages";
import { HeaderSectionProps } from "@/types/interface";
import { isRouteMatch } from "@/utils/base";
import { MODAL_NAME, MY_ROUTERS, BUTTON_NAME } from "@/types/enums";
import logo from "@/assets/images/logo.png";

const HeaderSection: FC<HeaderSectionProps> = (props) => {
	const { title = "" } = props;
	const location = useLocation();
	const navigate = useNavigate();
	const [head, setHead] = useState("");
	const [, setComModal] = useRecoilState(modalAtom);

	const handleBack = () => {
		try {
			const listRouterGoback: string[] = LIST_ROUTER_GO_BACK;
			const listDisabledRouter: string[] = LIST_ROUTER_DISABLE;
			const listRouterTo: string[] = LIST_ROUTER_TO_ROUTER;
			if (isRouteMatch(location.pathname, listRouterGoback)) {
				if (location.pathname == MY_ROUTERS.FORM_FILL_INFO) {
					navigate(MY_ROUTERS.HOME, { replace: true });
				} else {
					navigate(-1);
				}
				return;
			}
			if (isRouteMatch(location.pathname, listRouterTo)) {
				navigate(MY_ROUTERS.HOME, { replace: true }); // Pass state properly
				return;
			} else if (isRouteMatch(location.pathname, listDisabledRouter)) {
				setHead("");
			}

			return navigate(MY_ROUTERS.HOME);
		} catch (error) {
			return navigate(MY_ROUTERS.HOME);
		}
	};
	const handleHome = () => {
		try {
			const listRouter: string[] = LIST_ROUTER_TO_HOME;
			// if (listRouter.includes(location.pathname)) {
			if (isRouteMatch(location.pathname, listRouter)) {
				setComModal((prevState) => ({
					...prevState,
					name: MODAL_NAME.CONFIRMED_EXIT,
					open: true,
					modalOA: false,
					content: MESSAGE_TEMPLATES.BACK_TO_HOME,
					noted: ``,
					buttonName: BUTTON_NAME.DONG_Y,
				}));
			} else {
				return navigate(MY_ROUTERS.HOME, { replace: true });
			}
		} catch (error) {
			return navigate(MY_ROUTERS.HOME, { replace: true });
		}
	};

	useEffect(() => {
		const listRouterTo: string[] = LIST_ROUTER_TO_ROUTER;
		const listDisabledRouter: string[] = LIST_ROUTER_DISABLE;
		const listRouterGoback: string[] = LIST_ROUTER_GO_BACK;

		if (isRouteMatch(location.pathname, listRouterTo)) {
			setHead("back"); // back header for upload and detail-shirt pages
		} else if (isRouteMatch(location.pathname, listDisabledRouter)) {
			setHead("");
		} else if (isRouteMatch(location.pathname, listRouterGoback)) {
			setHead("back");
		} else {
			setHead("home"); // default home header for other pages other than template and detail-shirt
		}
	}, [location.pathname]);

	return (
		<>
			<div className="my-header">
				{head == "back" && (
					<div className="my-header-back" onClick={handleBack}>
						<div className="my-header-back-btn my-btn" id="left-buttons">
							<Icon icon="zi-chevron-left-header" />
						</div>
					</div>
				)}
				{head == "home" && (
					<div className="my-header-back" onClick={handleHome}>
						<div className="my-header-back-btn my-btn" id="left-buttons">
							<Icon icon="zi-home" />
						</div>
					</div>
				)}
				<div className="my-header-title uppercase">{title}</div>
				{/* <div className="logo">
					<div className="img">
						<img src={logo} />
					</div>
				</div> */}
			</div>
		</>
	);
};

export default HeaderSection;
