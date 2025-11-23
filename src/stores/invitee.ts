import { atom, selector } from "recoil";
import storage from "@/utils/storage";
async function initializeAdtimaAtom() {
	const inviteeInfo = (await storage.getStorage("inviteeInfo")) || null;
	return inviteeInfo;
}

const inviteeAtom = atom({
	key: storage.getKey("inviteeInfo"),
	default: initializeAdtimaAtom(),
});

export { inviteeAtom };
