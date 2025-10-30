import { FC, useEffect } from "react";

import useAuth from "@/hooks/useAuth";
import { MY_ROUTERS } from "@/types/enums";
import { useNavigate } from "react-router-dom";
const Logout: FC = () => {
	const { user, handleLogout } = useAuth();
	const navigate = useNavigate();
	useEffect(() => {
		handleLogout();
		navigate(MY_ROUTERS.HOME, { replace: true });
	}, []);

	return null;
};

export default Logout;
