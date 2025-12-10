import React, { FC } from "react";
import { useRoutes, Navigate } from "react-router-dom";

import DefaultLayout from "@/components/layout/default";

import _ from "lodash";

import { MY_ROUTERS_FULL } from "@/types/contants";
import HomePage from "pages/home";
import useAuth from "@/hooks/useAuth";
import Form from "@/pages/form";

import Profile from "@/pages/profile";
import TnC from "@/pages/message";
import Logout from "@/pages/logout";
import AuthRoute from "../middleware/auth-route";
import WeddingPage from "@/pages/wedding";
import TimelinePage from "@/pages/timeline";
import AlbumPage from "@/pages/album";
import PhotoPage from "@/pages/photo";
import MainLayout from "../layout/main";
import MesagePage from "@/pages/message";
import CreateMesagePage from "@/pages/message/create";
import ContactPage from "@/pages/contact";

export const RouterCustom: FC = () => {
	const { user } = useAuth();

	const routes = useRoutes([
		{
			path: "/",
			element: <DefaultLayout />,
			children: [
				{ path: MY_ROUTERS_FULL.HOME.NAME, element: <HomePage /> },
				{ path: MY_ROUTERS_FULL.WEDDING.NAME, element: <WeddingPage /> },
				// { path: MY_ROUTERS_FULL.WEDDING_TIMELINE.NAME, element: <TimelinePage /> },
				{ path: MY_ROUTERS_FULL.LOGOUT.NAME, element: <Logout /> },
				{ path: MY_ROUTERS_FULL.ALBUM.NAME, element: <AlbumPage /> },
				{ path: MY_ROUTERS_FULL.PHOTO.NAME, element: <PhotoPage /> },
				{ path: MY_ROUTERS_FULL.CREATE_MESSAGE.NAME, element: <CreateMesagePage /> },
				{ path: MY_ROUTERS_FULL.TNC.NAME, element: <TnC /> },
			],
		},
		{
			path: MY_ROUTERS_FULL.WEDDING_TIMELINE.NAME,
			element: <MainLayout />,
			children: [{ path: "", element: <TimelinePage /> }],
		},

		{
			path: "/shares/",
			element: <MainLayout />,
			children: [
				{ path: MY_ROUTERS_FULL.ALBUM.NAME, element: <AlbumPage /> },
				{ path: MY_ROUTERS_FULL.PHOTO.NAME, element: <PhotoPage /> },
				{ path: MY_ROUTERS_FULL.CONTACT.NAME, element: <ContactPage /> },
			],
		},

		{
			path: MY_ROUTERS_FULL.MESSAGE.NAME,
			element: <MainLayout />,
			children: [{ path: "", element: <MesagePage /> }],
		},

		// { path: "/login", element: <TnC /> }, // No layout
		// Nếu route không tồn tại, chuyển về Home
		{ path: "*", element: <Navigate to="/" replace /> },
	]);
	return routes;
};
