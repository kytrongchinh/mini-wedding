import React, { useEffect, useRef } from "react";

import { App, SnackbarProvider, useLocation } from "zmp-ui";
import { RecoilRoot } from "recoil";

import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { ScrollToTop } from "./ScrollTop/ScrollTop";
import { RouterCustom } from "./Router/router-custom";
import Music from "./layout/music";
import { AudioPlayer } from "./AudioPlayer";

const MyApp = () => {
	const audioRef = useRef<HTMLAudioElement | null>(null);
	const isPlaying = (audio: HTMLAudioElement) => !audio.paused && !audio.ended && audio.currentTime > 0;

	const playAudio = () => {
		const audio = audioRef.current;
		if (!audio) return;

		if (!isPlaying(audio)) {
			console.log(audio, "audio");
			audio.play().catch((err) => console.log(err));
		} else {
			console.log("Already playing");
		}
	};

	if (import.meta.env.MODE == "development") {
		return (
			<RecoilRoot>
				<HelmetProvider>
					<BrowserRouter>
						{/* <Music ref={audioRef} /> */}
						<App>
							<SnackbarProvider>
								<AudioPlayer />
								<ScrollToTop />
								{/* <div className="container" onClick={playAudio}> */}
								<RouterCustom />
								{/* </div> */}
							</SnackbarProvider>
						</App>
					</BrowserRouter>
				</HelmetProvider>
			</RecoilRoot>
		);
	} else {
		return (
			<RecoilRoot>
				<HelmetProvider>
					<BrowserRouter basename="/zapps/868938787760554822">
						{/* <Music ref={audioRef} /> */}
						<App>
							<SnackbarProvider>
								<AudioPlayer />
								<ScrollToTop />
								{/* <div className="container" onClick={playAudio}> */}
									<RouterCustom />
								{/* </div> */}
							</SnackbarProvider>
						</App>
					</BrowserRouter>
				</HelmetProvider>
			</RecoilRoot>
		);
	}
};
export default MyApp;
