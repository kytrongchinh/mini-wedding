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
const MAX_SIZE = 1024 * 1024 * 5;
interface UploadComponentProps {
	icon?: string;
	text?: string;
	onFileSelect?: (file: File) => void;
	className?: string;
	accept?: string;
	multiple?: boolean;
	handleImageData?: (data: string) => void;
	isReset?: boolean;
	from?: string;
	dataImage?: string;
}

const UploadComponent: FC<UploadComponentProps> = ({
	icon,
	text = "Vui lòng giữ lại hóa đơn vật lý để kiểm chứng trong trường hợp trúng giải",
	onFileSelect,
	className = "",
	accept = "image/*",
	multiple = false,
	handleImageData,
	isReset = false,
	from = "upload-bill",
	dataImage = "",
}) => {
	const [selectedFile, setSelectedFile] = useState<File | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const [, setComModal] = useRecoilState(modalAtom);
	const { user } = useAuth();
	useEffect(() => {
		console.log(isReset, "isReset");
		if (isReset) {
			handleUploadAnother();
		}
	}, [isReset]);

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
				setSelectedFile(file);
				onFileSelect?.(file);
				setPreviewUrl(base64);
				handleImageData?.(base64);
			}
		} catch (err) {
			console.error("Lỗi khi chụp ảnh:", err);
		}
	};

	const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file) {
			setSelectedFile(file);
			// Tạo preview URL
			const reader = new FileReader();
			reader.onload = (e) => {
				const size = e?.total;
				if (size > MAX_SIZE) {
					setComModal((prevState) => ({
						...prevState,
						open: true,
						name: MODAL_NAME.DEFAULT,
						content: MESSAGE_TEMPLATES.LIMIT_SIZE_FILE_UPLOAD,
						buttonName: BUTTON_NAME.CLOSE,
					}));
					console.log("File size must be less than 5 MB.");
					// handleUploadAnother();
					if (!dataImage) {
						setSelectedFile(null);
					}
					// setPreviewUrl(null);
					// handleImageData?.("");
					return;
				}
				onFileSelect?.(file);
				setPreviewUrl(e.target?.result as string);
				handleImageData?.(e.target?.result as string);
			};
			reader.readAsDataURL(file);
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
		// if (from != "upload-bill") {
		// 	fileInputRef.current?.click();
		// } else {
		// 	handleChooseImage();
		// }
	};

	const handleUploadAnother = () => {
		// setSelectedFile(null);
		// setPreviewUrl(null);
		handleChooseImage();
		// if (from != "upload-bill") {
		// 	if (fileInputRef.current) {
		// 		fileInputRef.current.value = "";
		// 		fileInputRef.current?.click();
		// 	}
		// } else {
		// 	handleChooseImage();
		// }
	};

	return (
		<div className={`upload-component ${className}`}>
			{/* {from != "upload-bill" && <input ref={fileInputRef} type="file" accept={accept} multiple={multiple} onChange={handleFileChange} style={{ display: "none" }} />} */}

			{!selectedFile ? (
				<div className="upload-area !pt-8 !pb-8" onClick={handleUploadClick}>
					{icon && (
						<div className="upload-icon">
							{/* <img src={icon} alt="upload icon" /> */}
							<Image image={icon} />
						</div>
					)}
					{from == "upload-image" && (
						<div className="upload-text text-white italic !text-[11px] p-1">
							<p>Đăng tải ảnh chụp màn hình bài đăng của bạn. Cần đảm bảo ảnh chụp màn hình và link bài đăng khớp nhau.</p>
							<br />
							<p>Lưu ý: Vui lòng kiểm tra thông tin thật kĩ trước khi gửi, thử thách đã gửi không thể xem lại và chỉnh sửa.</p>
							<br />
							<p>Dung lượng tối đa 5Mbs</p>
						</div>
					)}
					{from == "upload-bill" && <div className="upload-text text-white">{text}</div>}
				</div>
			) : (
				<div className="preview-container">
					<div className="preview-area">
						<div className={from == "upload-bill" ? "preview-bill" : "preview-image"}>
							<img src={previewUrl || dataImage} alt="preview" />
						</div>
					</div>
					<div className="preview-actions">
						<button className="button-style-red " onClick={handleUploadAnother}>
							Ảnh khác
						</button>
						{/* <ButtonDefault text="Ảnh khác" customClass={`button-style-red `} onClick={handleUploadAnother} /> */}
					</div>
				</div>
			)}
		</div>
	);
};

export default UploadComponent;
