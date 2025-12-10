// AudioPlayer.tsx
import React from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { useRef, useEffect } from "react";
import { audioAtom } from "@/stores/audio";
import { campaignAtom } from "@/stores/campaign";

export const AudioPlayer = () => {
	const [isPlaying, setIsPlaying] = useRecoilState(audioAtom);
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const campaignInfo = useRecoilValue(campaignAtom);

	useEffect(() => {
		const audio = audioRef.current;
		console.log("AudioPlayer: isPlaying changed to", isPlaying);
		console.log("AudioPlayer: ", audio);

		if (!audio) return;

		if (isPlaying) {
			audio.play().catch((e) => {
				console.log("Audio playback failed:", e);
			});
		} else {
			audio.pause();
		}
	}, [isPlaying]);

	return <audio loop={true} ref={audioRef} src={campaignInfo?.music?.[Math.floor(Math.random() * campaignInfo?.music.length) || 0]} hidden={true} />;
};
