// audioState.ts
import { atom } from "recoil";

export const audioAtom = atom<boolean>({
	key: "audioPlayingState",
	default: false,
});
