import { MY_ROUTERS } from "@/types/enums";
import React, { FC, JSX, useEffect } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

interface AuthRouteProps {
	user: any;
	children: JSX.Element;
}

const AuthRoute: FC<AuthRouteProps> = ({ user, children }) => {
	const location = useLocation();
	const navigate = useNavigate();

	useEffect(() => {
		if (!user) {
			navigate(MY_ROUTERS.HOME, { state: { from: location }, replace: true });
		}
		if (user?.doneForm == 0) {
			// navigate(MY_ROUTERS.SCAN, { state: { from: location }, replace: true });
		}
	}, [location.pathname]);
	return <>{children}</>;
};

export default AuthRoute;
