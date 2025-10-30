import React, { FC, useEffect, useReducer, useState } from "react";

import { stagger, useAnimate } from "framer-motion";

import useSeo from "@/hooks/useSeo";

import AvatarCard from "@/components/Avatar/Avatar";
import "./profile.scss";

import { useRecoilState, useRecoilValue } from "recoil";
import { adtimaAtom } from "@/stores/adtima";
import { formatTime } from "@/utils/time";
import { convertPage } from "@/utils/base";
import adtimabox from "@/services/adtimabox";
import { CommonFields, CommonState } from "@/types/interface";
import MQRCode from "qrcode";
type State = {
	loading: boolean;
	error: string | null;
	list: Record<string, any>; // Adjust type according to your data structure
};

type Action = { type: "FETCH_REQUEST" } | { type: "FETCH_SUCCESS"; payload: Record<string, any> } | { type: "FETCH_FAIL"; payload: string };

function reducer(state: State, action: Action) {
	switch (action.type) {
		case "FETCH_REQUEST":
			return { ...state, loading: true, error: null };
		case "FETCH_SUCCESS":
			return {
				...state,
				loading: false,
				error: null,
				list: action.payload || {}, // Ensure default empty object if payload is missing
			};
		case "FETCH_FAIL":
			return { ...state, loading: false, error: action.payload };

		default:
			return state; // Ensure default case returns state
	}
}
import QRCode from "react-qr-code";
import { modalAtom } from "@/stores/modal";
import { MODAL_NAME, BUTTON_NAME } from "@/types/enums";

import Pagination from "@/components/Pagination/Pagination";

const Profile: FC = () => {
	const [scope, animate] = useAnimate();
	useEffect(() => {
		const animUp = document.querySelectorAll(".animUp");
		animate(animUp, { y: [20, 0], opacity: [0, 1] }, { type: "spring", delay: stagger(0.15) });
	}, []);

	useSeo({ title: "Cá nhân" });
	const [modal, setComModal] = useRecoilState(modalAtom);

	const [{ loading, error, list }, dispatch] = useReducer(reducer, {
		loading: false,
		list: [],
		error: "",
	});
	const adtima = useRecoilValue(adtimaAtom);
	const [pageNum, setPageNum] = useState(0);

	useEffect(() => {}, []);
	const loadHistory = async () => {
		try {
			dispatch({ type: "FETCH_REQUEST" });
			const result = await adtimabox.listRequest(adtima?.accessToken);
			dispatch({
				type: "FETCH_SUCCESS",
				payload: result?.data,
			});
		} catch (err) {}
	};
	const handleChangePage = async (event: any) => {
		console.log(event, "event");
		const { selected } = event;
		let newPage = selected;
		setPageNum(newPage);
		dispatch({ type: "FETCH_REQUEST" });
		const result = await adtimabox.listRequest(adtima?.accessToken, selected);
		dispatch({
			type: "FETCH_SUCCESS",
			payload: result?.data,
		});
	};

	return (
		<div className="page-content profile" ref={scope}>
			{/* <HeaderV2 /> */}
			<div className="content animUp ">
				<div className="bl-box-glass animUp mt-20">
					<div className="bl-glass-inner">
						<div className=" transform -translate-y-1/2 mb-[-50px]">
							<AvatarCard />
						</div>
						<div className="content-wrapper">
							<div className="title uppercase">Lịch sử đã nhập</div>

							<div className="overflow-x-auto w-full pt-5 pb-10">
								<table className="min-w-full divide-y divide-gray-200">
									<thead className="bg-gray-50">
										<tr>
											<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Phone
											</th>
											<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												Thời gian
											</th>
											<th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
												QR
											</th>
										</tr>
									</thead>
									<tbody className="bg-white divide-y divide-gray-200"></tbody>
								</table>
							</div>

							{list?.total > list?.limit && convertPage(list?.total, list?.limit) > 0 && (
								<Pagination page={list?.page} totalPage={convertPage(list?.total, list?.limit)} onPageChange={(event: any) => handleChangePage(event)} />
							)}
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Profile;
