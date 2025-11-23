import useSeo from "@/hooks/useSeo";
import { CommonProps, CommonState } from "@/types/interface";
import React, { FC, useEffect, useReducer, useState } from "react";
import { stagger, useAnimate } from "framer-motion";
import "./style.scss";
import _ from "lodash";
import myapi from "@/services/myapi";
import { useRecoilState } from "recoil";
import { loadingAtom } from "@/stores";
import { convertPage } from "@/utils/base";
import Pagination from "@/components/Pagination/Pagination";

const images = [
	"https://images.unsplash.com/photo-1601758123927-4c34c0f37c63?auto=format&fit=crop&w=400&q=80",
	"https://images.unsplash.com/photo-1503023345310-bd7c1de61c7d?auto=format&fit=crop&w=400&q=80",
	"https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?auto=format&fit=crop&w=400&q=80",
	"https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=400&q=80",
	"https://images.unsplash.com/photo-1504198458649-3128b932f49b?auto=format&fit=crop&w=400&q=80",
];

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
const AlbumPage: FC<CommonProps> = () => {
	useSeo({ title: "Trọng Chính 囍 Trường Mi", description: "Welcome to the Home Page of My App!" });
	const [scope, animate] = useAnimate();
	const [, setLoading] = useRecoilState(loadingAtom);
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
			const result = await myapi.getAlbums();
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
		const result = await myapi.getAlbums(selected + 1);
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
					<h2 className="mtitle-timeline timeline-title  tracking-wide mb-4 text-center">Album</h2>
				</div>

				<div className="relative flex justify-center items-start text-sm md:text-base text-center w-full gap-3"></div>
				<div className="p-4">
					<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
						{list?.items?.length > 0 &&
							list?.items.map((item: CommonState, index: number) => (
								<div key={index} className="relative cursor-pointer">
									<img
										loading="lazy"
										src={`https://drive.google.com/thumbnail?id=${item?.id_image}&sz=s500`}
										alt={`Gallery ${index}`}
										className="rounded-lg shadow-lg hover:scale-105 transition-transform w-full h-full object-cover"
									/>
									{/* Watermark góc trái */}
									<div className="absolute top-3 left-1 pointer-events-none rotate-[-30deg] watermark">
										<span className="text-sm select-none">Chin&Mie</span>
									</div>
								</div>
							))}
					</div>
				</div>
				{list?.total > list?.limit && convertPage(list?.total, list?.limit) > 0 && (
					<div className="mx-6 my-2">
						<Pagination page={list?.page - 1} totalPage={convertPage(list?.total, list?.limit)} onPageChange={(event: any) => handleChangePage(event)} />
					</div>
				)}

				<div className="timeline-name m-2 opacity-35">
					<div className="text-[20px] text-center">Trọng Chính & Trường Mi</div>
				</div>
			</div>
		</div>
	);
};

export default AlbumPage;
