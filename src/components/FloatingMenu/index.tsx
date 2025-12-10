import React from "react";
import { useState } from "react";
import menu_svg from "@/assets/images/icon/svg/floating/menu.svg";
import close_svg from "@/assets/images/icon/svg/floating/close.svg";
import map_svg from "@/assets/images/icon/svg/floating/maps.svg";
import call_svg from "@/assets/images/icon/svg/floating/call-chat.svg";
import photos_svg from "@/assets/images/icon/svg/floating/photos.svg";
import message_svg from "@/assets/images/icon/svg/floating/message.svg";
import music_svg from "@/assets/images/icon/svg/floating/music.svg";
import mute_svg from "@/assets/images/icon/svg/floating/mute.svg";
import { MY_ROUTERS } from "@/types/enums";
import { useLocation, useNavigate } from "react-router-dom";
import { useRecoilState } from "recoil";
import { audioAtom } from "@/stores/audio";
export default function FloatingMenu() {
	const [open, setOpen] = useState(true);
	const navigate = useNavigate();
	const location = useLocation();
	const [playing, setPlaying] = useRecoilState(audioAtom);

	const items = [
		{ icon: playing ? music_svg : mute_svg, path: "#" },
		{ icon: call_svg, path: `/shares${MY_ROUTERS.CONTACT}` },
		{ icon: photos_svg, path: `/shares${MY_ROUTERS.PHOTO}` },
		{ icon: message_svg, path: MY_ROUTERS.MESSAGE },
	];

	const handleClick = (path: string) => {
		if (path === "#") {
			setPlaying(!playing);
			setOpen(false);
			return;
		} else {
			navigate(path);
			setOpen(false);
		}
	};

	return (
		<div className="fixed bottom-14 right-3 z-50">
			{/* LIST */}
			<div
				className={`
        flex flex-col items-center gap-3 absolute bottom-12  
        transition-all duration-300
        ${open ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}
        `}
			>
				{items.map((item, i) => (
					<button
						key={i}
						onClick={() => handleClick(item.path)}
						className={`
            w-10 h-10 rounded-full bg-[#fcf7e3] shadow-[0_0_30px_rgba(255,120,120,0.55)]
            flex items-center justify-center active:scale-85
			${location.pathname === item.path ? "ring-2 ring-[#ff7878] bg-[#fec1c1]" : ""}
            `}
					>
						<img src={item?.icon} className="w-5 h-5" />
					</button>
				))}
			</div>

			{/* MAIN */}
			<button
				onClick={() => {
					setOpen(!open);
					setPlaying(true);
				}}
				className="w-10 h-10 rounded-full bg-[#ff7878] shadow-[0_0_30px_rgba(255,120,120,5)] 
                flex items-center justify-center active:scale-95 transition-all"
			>
				{!open ? <img src={menu_svg} className="w-5 h-5" /> : <img src={close_svg} className="w-5 h-5" />}
			</button>
		</div>
	);
}
