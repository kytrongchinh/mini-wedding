import { CommonState } from "@/types/interface";
import { atom } from "recoil";

export const paramsAtom = atom<CommonState>({
	key: "defaultParams",
	default: {},
});
