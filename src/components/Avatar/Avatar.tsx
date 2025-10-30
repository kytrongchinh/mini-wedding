import useAuth from "@/hooks/useAuth";
import { padText } from "@/utils/base";
import React, { FC, memo } from "react";
import { Avatar } from "zmp-ui";
import Image, { IMAGE_NAME } from "../Image";

const AvatarCard: FC = () => {
	const { user, handleLogout } = useAuth();
	return (
		<div className="bl-avatar flex flex-col items-center gap-1">
			<Avatar src={user?.avatar} className="!w-[70px] !h-[70px] border border-white rounded-full shadow-lg" />
			<div className="meta flex flex-col gap-2 justify-center items-center">
				<div className="username text-lg font-bold">{user?.name}</div>
				{user?.phone && (
					<div className="userphone flex items-center gap-2 bg-white/10 rounded-full px-4 py-1 text-white">
						<Image image={IMAGE_NAME?.icon_phone} imageClass="w-[16px] h-[16px] object-contain" />
						{user?.phone ? padText(user?.phone, "X") : ""}
					</div>
				)}
				<div className="text-black-1000">
					<div className="text-white-800 underline" onClick={() => handleLogout()}>
						Thoát
					</div>
				</div>
			</div>
		</div>
	);
};

export default memo(AvatarCard);
