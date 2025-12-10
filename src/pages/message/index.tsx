import useSeo from "@/hooks/useSeo";
import { CommonProps, CommonState } from "@/types/interface";
import React, { FC, useEffect, useReducer, useState } from "react";
import { stagger, useAnimate } from "framer-motion";
import _ from "lodash";
import myapi from "@/services/myapi";
import { useRecoilState, useRecoilValue } from "recoil";
import { loadingAtom } from "@/stores";
import { convertPage } from "@/utils/base";
import Pagination from "@/components/Pagination/Pagination";
import "./styles.scss";
import { useNavigate } from "react-router-dom";
import { MY_ROUTERS } from "@/types/enums";
import { campaignAtom } from "@/stores/campaign";
import ButtonDefault from "@/components/ButtonDefault/ButtonDefault";

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
const MesagePage: FC<CommonProps> = () => {
	const navigate = useNavigate();
	const [scope, animate] = useAnimate();
	const [, setLoading] = useRecoilState(loadingAtom);
	const campaignInfo = useRecoilValue(campaignAtom);
	useSeo({ title: `${campaignInfo?.wedding?.groom || "Ky Chin"} 囍 ${campaignInfo?.wedding?.bride || "Mi Mie"}`, description: "Welcome to the Home Page of My App!" });
	useEffect(() => {
		const animUp = document.querySelectorAll(".animUp");
		animate(animUp, { y: [20, 0], opacity: [0, 1] }, { type: "spring", delay: stagger(0.15) });

		loadAlbums();
	}, []);

	const [pageNum, setPageNum] = useState(0);
	const [{ loading, error, list }, dispatch] = useReducer(reducer, {
		loading: false,
		list: [],
		error: "",
	});

	const loadAlbums = async () => {
		try {
			setLoading(true);
			dispatch({ type: "FETCH_REQUEST" });
			const result = await myapi.getMessages();
			dispatch({
				type: "FETCH_SUCCESS",
				payload: result?.data,
			});
			setLoading(false);
		} catch (err) {
			setLoading(false);
		}
	};
	const handleChangePage = async (event: any) => {
		const { selected } = event;
		let newPage = selected;
		setPageNum(newPage);
		dispatch({ type: "FETCH_REQUEST" });
		setLoading(true);
		const result = await myapi.getMessages(selected + 1);
		dispatch({
			type: "FETCH_SUCCESS",
			payload: result?.data,
		});
		setLoading(false);
	};

	return (
		<div className="page-content timeline" ref={scope}>
			<div className="container animUp ">
				<div className="mtitle relative">
					<h2 className="timeline-title  tracking-wide mb-9 text-center">WEDDING</h2>
					<h2 className="mtitle-timeline timeline-title  tracking-wide mb-4 text-center">Messages</h2>
				</div>
				<div className="relative flex justify-center items-center text-sm md:text-base text-center w-full gap-2">
					<div className="w-full">
						<button onClick={() => navigate(MY_ROUTERS.CREATE_MESSAGE)} className="w-full text-center underline px-0 pt-5 m-auto rounded-lg">
							💌💌💌 Gửi lời chúc tới dâu rể
						</button>
					</div>
				</div>
				<div className="p-4">
					<div className="grid grid-cols-1">
						{list?.items?.length > 0 &&
							list?.items.map((item: CommonState, index: number) => (
								<div key={index} className="relative cursor-pointer p-2">
									<div className="flex flex-col relative">
										<div className={` timeline-name mb-[3px] ${index % 2 === 0 ? "self-end text-right" : "self-start text-left"}`}>
											<span className="underline">❤️❤️❤️ {item?.from}:</span>
											<span className="underline decoration-dotted"> {item?.name}</span>
										</div>
										<div className={`bg-[#f5f1df] p-3 ${index % 2 === 0 ? "rounded-lg rounded-tr-none" : "rounded-lg rounded-tl-none"}  shadow-sm text-center`}>
											{item?.content}
										</div>
									</div>
								</div>
							))}
					</div>
					{list?.items?.length < 1 && <p>Không tìm thấy ảnh!</p>}
				</div>
				{list?.total > list?.limit && convertPage(list?.total, list?.limit) > 0 && (
					<div className="mx-6 my-2">
						<Pagination page={list?.page - 1} totalPage={convertPage(list?.total, list?.limit)} onPageChange={(event: any) => handleChangePage(event)} />
					</div>
				)}
				<div className="bl-button flex  mt-20 justify-center">
					<ButtonDefault text="✍️ Gửi lời chúc" align="center" buttonType="secondary z-10" href={MY_ROUTERS.CREATE_MESSAGE} />
				</div>

				<div className="timeline-name m-2 opacity-35">
					<div className="text-[20px] text-center">
						{campaignInfo?.wedding?.groom || "Ky Chin"} & {campaignInfo?.wedding?.bride || "Mi Mie"}
					</div>
				</div>
			</div>
		</div>
	);
};

export default MesagePage;
