import React, { FC, useState, useRef, useEffect } from "react";
import "./styles.scss";
import useAuth from "@/hooks/useAuth";
import { useRecoilState } from "recoil";
import { modalAtom } from "@/stores/modal";
import { MODAL_NAME, BUTTON_NAME } from "@/types/enums";
import { MESSAGE_TEMPLATES } from "@/types/messages";
import Image from "../Image";
import media, { DataConfig } from "@/services/miniapp/media";
import slugify from "slugify";
import ButtonDefault from "../ButtonDefault/ButtonDefault";
const MAX_SIZE = 1024 * 1024 * 5;
interface UploadButtonProps {
	icon?: string;
	text?: string;
	className?: string;
	accept?: string;
	multiple?: boolean;
	handleImageData?: (data: string) => void;
	isReset?: boolean;
	from?: string;
	dataImage?: string;
}

const UploadButton: FC<UploadButtonProps> = ({
	icon,
	text = "Vui lòng giữ lại hóa đơn vật lý để kiểm chứng trong trường hợp trúng giải",
	className = "",
	accept = "image/*",
	multiple = false,
	handleImageData,
	isReset = false,
	from = "upload",
	dataImage = "",
}) => {
	const [, setComModal] = useRecoilState(modalAtom);
	const { user } = useAuth();

	const handleChooseImage = async () => {
		try {
			let fileConfig: DataConfig = {
				sourceType: ["camera"],
				cameraType: "back",
				count: 1,
			};
			if (from != "upload-bill") {
				fileConfig = {
					sourceType: ["camera", "album"],
					cameraType: "back",
					count: 1,
				};
			}

			if (import.meta.env.VITE_MODE != "production") {
				fileConfig = {
					sourceType: ["camera", "album"],
					cameraType: "back",
					count: 1,
				};
			}
			const fileData = await media.chooseImage(fileConfig);

			if (fileData && fileData?.filePaths) {
				const filePath = fileData.filePaths?.[0];
				const size = fileData?.tempFiles?.[0]?.size;
				if (size > MAX_SIZE) {
					setComModal((prevState) => ({
						...prevState,
						open: true,
						name: MODAL_NAME.DEFAULT,
						content: MESSAGE_TEMPLATES.LIMIT_SIZE_FILE_UPLOAD,
						buttonName: BUTTON_NAME.CLOSE,
					}));
					console.log("File size must be less than 5 MB.");
					return;
				}
				const response = await fetch(filePath);
				if (!response.ok) {
					throw new Error("Failed to fetch blob from URL");
				}
				const blob = await response.blob();
				// Step 2: Convert the Blob into a File
				const name = slugify(`${user?.name}-uploaded-${from}-${Date.now()}`, {
					replacement: "-", // replace spaces with replacement character, defaults to `-`
					remove: undefined, // remove characters that match regex, defaults to `undefined`
					lower: true, // convert to lower case, defaults to `false`
					strict: true, // strip special characters except replacement, defaults to `false`
					locale: "vi", // language code of the locale to use
					trim: true, // trim leading and trailing replacement chars, defaults to `true`
				});
				const file = new File([blob], `${name}.jpg`, { type: blob.type });

				const base64 = await blobToBase64(blob);
				handleImageData?.(base64);
			}
		} catch (err) {
			console.error("Lỗi khi chụp ảnh:", err);
		}
	};

	const blobToBase64 = (blob: Blob): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.onloadend = () => resolve(reader.result as string); // base64 data URL
			reader.onerror = reject;
			reader.readAsDataURL(blob);
		});
	};

	const handleUploadClick = () => {
		handleChooseImage();
	};

	return (
		<div className={`upload-component ${className}`}>
			<ButtonDefault text="Chụp ảnh" align="center" buttonType="sub" onClick={handleUploadClick} />
		</div>
	);
};

export default UploadButton;
