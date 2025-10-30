import React, { FC } from "react";
import customClass from "clsx";

import { loadImage } from "@/utils/base";

// const PRODUCT = loadImage("/public/miniapp/assets/images/13.png");

import ICON_HOME from "@/assets/images/icon/svg/home.svg?react";
import ICON_HOME_ACTIVE from "@/assets/images/icon/svg/home_active.svg?react";
import ICON_SCAN from "@/assets/images/icon/svg/scan.svg?react";
import ICON_SCAN_ACTIVE from "@/assets/images/icon/svg/scan_active.svg?react";
import ICON_DOC from "@/assets/images/icon/svg/doc.svg?react";
import ICON_DOC_ACTIVE from "@/assets/images/icon/svg/doc_active.svg?react";
import ICON_USER from "@/assets/images/icon/svg/user.svg?react";
import ICON_USER_ACTIVE from "@/assets/images/icon/svg/user_active.svg?react";
export const IMAGE_NAME = {
	// bg_kv: "bg_kv",
};
export const imageList = {
	// bg_kv: bg_kv,
};

export const svgList = {
	// BELL: IconBell,
	HOME: ICON_HOME,
	HOME_ACTIVE: ICON_HOME_ACTIVE,
	SCAN: ICON_SCAN,
	SCAN_ACTIVE: ICON_SCAN_ACTIVE,
	DOC: ICON_DOC,
	DOC_ACTIVE: ICON_DOC_ACTIVE,
	USER: ICON_USER,
	USER_ACTIVE: ICON_USER_ACTIVE,
} as const;

type SVGProps = {
	type: keyof typeof svgList | string;
	[key: string]: any;
};

export const SVG: FC<SVGProps> = ({ type, ...rest }) => {
	const MySvg = svgList[type as keyof typeof svgList];
	return <MySvg {...rest} />;
};

type ImageProps = {
	image: string;
	customFunction?: () => void;
	customWrapperClass?: string;
	imageClass?: string;
	noWrapper?: boolean;
	imageSrc?: string;
};

const Image: FC<ImageProps> = ({ image, imageSrc, customFunction, customWrapperClass = "", imageClass = "", noWrapper = true, ...rest }) => {
	const wrapperClass = customClass({
		[customWrapperClass]: true,
	});

	const imageElClass = customClass({
		[imageClass]: true,
	});

	if (noWrapper) return <img onClick={customFunction} src={imageSrc ? imageSrc : imageList[image]} className={imageElClass} alt={imageList[image]} />;

	return (
		<div className={wrapperClass} onClick={customFunction} {...rest}>
			<img src={imageSrc ? imageSrc : imageList[image]} className={imageElClass} alt="" />
		</div>
	);
};

export default Image;
