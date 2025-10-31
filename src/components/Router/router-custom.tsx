import React, { FC } from "react";
import { useRoutes, Navigate } from "react-router-dom";

import DefaultLayout from "@/components/layout/default";

import _ from "lodash";

import { MY_ROUTERS_FULL } from "@/types/contants";
import HomePage from "pages/home";
import useAuth from "@/hooks/useAuth";
import Form from "@/pages/form";

import Profile from "@/pages/profile";
import TnC from "@/pages/tnc";
import Logout from "@/pages/logout";
import AuthRoute from "../middleware/auth-route";
import WeddingPage from "@/pages/wedding";

export const RouterCustom: FC = () => {
	const { user } = useAuth();

	const routes = useRoutes([
		{
			path: "/",
			element: <DefaultLayout />,
			children: [
				{ path: MY_ROUTERS_FULL.HOME.NAME, element: <HomePage /> },
				{ path: MY_ROUTERS_FULL.WEDDING.NAME, element: <WeddingPage /> },
				{ path: MY_ROUTERS_FULL.LOGOUT.NAME, element: <Logout /> },
				{ path: MY_ROUTERS_FULL.TNC.NAME, element: <TnC /> },

				// { path: MY_ROUTERS_FULL.FORM_FILL_INFO.NAME, element: <Form /> },
				// { path: MY_ROUTERS_FULL.PROFILE.NAME, element: <Profile /> },

				// {
				// 	path: MY_ROUTERS_FULL.SCAN_ID.NAME,
				// 	element: (
				// 		<AuthRoute user={user}>
				// 			<Form />
				// 		</AuthRoute>
				// 	),
				// },
				// {
				// 	path: MY_ROUTERS_FULL.SCAN.NAME,
				// 	element: (
				// 		<AuthRoute user={user}>
				// 			<Form />
				// 		</AuthRoute>
				// 	),
				// },
			],
		},

		// { path: "/login", element: <TnC /> }, // No layout
		// Nếu route không tồn tại, chuyển về Home
		{ path: "*", element: <Navigate to="/" replace /> },
	]);
	return routes;
};
