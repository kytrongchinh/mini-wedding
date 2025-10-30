import { CommonState } from "@/types/interface";
import { atom } from "recoil";

export const ticketAtom = atom<CommonState>({
	key: "ticket-today",
	default: {},
});

export const pointAtom = atom<CommonState>({
	key: "point-today",
	default: {},
});
