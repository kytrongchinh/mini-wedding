import React, { useEffect } from "react";

import { App, SnackbarProvider, useLocation } from "zmp-ui";
import { RecoilRoot } from "recoil";

import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ScrollToTop } from "./ScrollTop/ScrollTop";
import { RouterCustom } from "./Router/router-custom";
const MyApp = () => {
	if (import.meta.env.MODE == "development") {
		return (
			<RecoilRoot>
				<HelmetProvider>
					<BrowserRouter>
						<App>
							<SnackbarProvider>
								<ScrollToTop />
								<RouterCustom />
							</SnackbarProvider>
						</App>
					</BrowserRouter>
				</HelmetProvider>
			</RecoilRoot>
		);
	} else {
		return (
			<RecoilRoot>
				<HelmetProvider>
					<BrowserRouter basename="/zapps/3609069121316606950">
						<App>
							<SnackbarProvider>
								<ScrollToTop />
								<RouterCustom />
							</SnackbarProvider>
						</App>
					</BrowserRouter>
				</HelmetProvider>
			</RecoilRoot>
		);
	}
};
export default MyApp;
