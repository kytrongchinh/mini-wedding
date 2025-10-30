import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export function ScrollToTop() {
	const { pathname } = useLocation();
	// console.log("ScrollToTop", pathname);
	useEffect(() => {
		document.body.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	}, [pathname]);

	return null; // Không render gì cả
}
