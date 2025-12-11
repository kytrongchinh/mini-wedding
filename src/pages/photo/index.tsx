import useSeo from "@/hooks/useSeo";
import { CommonFields, CommonForm, CommonProps, CommonState } from "@/types/interface";
import React, { FC, useEffect, useReducer, useState } from "react";
import { stagger, useAnimate } from "framer-motion";
import "./style.scss";
import _ from "lodash";
import myapi from "@/services/myapi";
import { useRecoilState, useRecoilValue } from "recoil";
import { loadingAtom } from "@/stores";
import { convertPage } from "@/utils/base";
import Pagination from "@/components/Pagination/Pagination";
import { FieldErrors, useForm } from "react-hook-form";
import { campaignAtom } from "@/stores/campaign";
import { modalAtom } from "@/stores/modal";
import { BUTTON_NAME, MODAL_NAME } from "@/types/enums";

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
const PhotoPage: FC<CommonProps> = () => {
	const [scope, animate] = useAnimate();
	const [, setLoading] = useRecoilState(loadingAtom);
	const [myKeyword, setMykeyword] = useState("");
	const campaignInfo = useRecoilValue(campaignAtom);
	useSeo({ title: `${campaignInfo?.wedding?.groom || "Ky Chin"} 囍 ${campaignInfo?.wedding?.bride || "Mi Mie"}`, description: "Welcome to the Home Page of My App!" });
	const [com_modal, setComModal] = useRecoilState(modalAtom);
	const {
		register,
		handleSubmit,
		formState,
		formState: { errors },
		setError,
		setValue,
		clearErrors,
		getValues,
	} = useForm({ shouldFocusError: true });
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

	useEffect(() => {
		document.body.scrollTo({
			top: 0,
			behavior: "smooth",
		});
	}, [pageNum]);

	const loadAlbums = async () => {
		try {
			setLoading(true);
			dispatch({ type: "FETCH_REQUEST" });
			const result = await myapi.getPhotos();
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
		const result = await myapi.getPhotos(myKeyword, selected + 1);
		dispatch({
			type: "FETCH_SUCCESS",
			payload: result?.data,
		});
		setLoading(false);
	};

	const onSubmit = async (data: CommonForm) => {
		try {
			setLoading(true);
			dispatch({ type: "FETCH_REQUEST" });
			const result = await myapi.getPhotos(data?.keyword);
			setMykeyword(data?.keyword);
			dispatch({
				type: "FETCH_SUCCESS",
				payload: result?.data,
			});
			setLoading(false);
		} catch (error) {}
	};
	const onError = (e: FieldErrors) => {
		console.log(`==>`, e);
	};

	const handleViewImg = (item: CommonFields) => {
		setComModal((prevState) => ({
			...prevState,
			name: MODAL_NAME.VIEW_IMAGE,
			open: true,
			content: `https://drive.google.com/thumbnail?id=${item?.id_image}&sz=s1200`,
			buttonName: BUTTON_NAME.CLOSE,
		}));
	};
	return (
		<div className="page-content timeline" ref={scope}>
			<div className="container animUp ">
				<div className="mtitle relative">
					<h2 className="timeline-title  tracking-wide mb-9 text-center">WEDDING</h2>
					<h2 className="mtitle-timeline timeline-title  tracking-wide mb-4 text-center">Photos</h2>
				</div>

				<div className="relative flex justify-center items-center text-sm md:text-base text-center w-full gap-2 px-6">
					<div className="w-2/3">
						<input
							type="text"
							{...register("keyword", {
								required: false,
								maxLength: 50,
								pattern: /[a-zA-Z0-9]/,
							})}
							maxLength={50}
							className="input-custom w-full px-4 py-2 border border-gray-300 !rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
							placeholder="Nhập tên của bạn"
						/>
					</div>
					<div className="w-1/3 ">
						<button onClick={handleSubmit(onSubmit, onError)} className="w-full text-center bg-orange-300 px-0 py-2 m-auto rounded-lg">
							Kiếm Ảnh
						</button>
					</div>
				</div>
				{errors.keyword && <div className="px-6 error text-sm text-red-500 italic">Vui lòng nhập tên cần tìm</div>}

				<div className="p-4">
					<div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-4 gap-4">
						{list?.items?.length > 0 &&
							list?.items.map((item: CommonState, index: number) => (
								<div key={index} className="relative cursor-pointer shadow shadow-rose-300">
									<img
										onClick={() => handleViewImg(item)}
										src={`https://drive.google.com/thumbnail?id=${item?.id_image}&sz=s600`}
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
					{list?.items?.length < 1 && <p>Không tìm thấy ảnh!</p>}
				</div>
				{list?.total > list?.limit && convertPage(list?.total, list?.limit) > 0 && (
					<div className="mx-6 my-2">
						<Pagination page={list?.page - 1} totalPage={convertPage(list?.total, list?.limit)} onPageChange={(event: any) => handleChangePage(event)} />
					</div>
				)}

				<div className="timeline-name m-2 opacity-35">
					<div className="text-[20px] text-center">
						{campaignInfo?.wedding?.groom || "Ky Chin"} & {campaignInfo?.wedding?.bride || "Mi Mie"}
					</div>
				</div>
			</div>
		</div>
	);
};

export default PhotoPage;
