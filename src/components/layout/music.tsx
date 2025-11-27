import { campaignAtom } from "@/stores/campaign";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";

const Music = React.forwardRef<HTMLAudioElement, {}>((props, ref) => {
	const campaignInfo = useRecoilValue(campaignAtom);

	return (
		<audio ref={ref} className="hidden" preload="auto" id="music-audio">
			<source src={campaignInfo?.music?.[Math.floor(Math.random() * campaignInfo?.music.length) || 0]} type="audio/mpeg" />
			Your browser does not support the audio element.
		</audio>
	);
});

export default Music;
