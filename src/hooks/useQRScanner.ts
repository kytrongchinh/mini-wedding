import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ROUTERS } from "@/types/contants";
import { extractCodeFromText } from "@/utils/base";
import zalo from "@/services/miniapp/zalo";

export function useQRScanner() {
	const [scanning, setScanning] = useState(false);
	const navigate = useNavigate();

	const handleScan = useCallback(
		(data: string | null) => {
			if (data) {
				// console.log(`Scanned: ${data}`);
				setScanning(false);
				const code = extractCodeFromText(data);
				if (code) {
					navigate(`${ROUTERS.SCAN}/${code}`);
				}
			}
		},
		[navigate]
	);

	const handleError = useCallback((err: any) => {
		console.error("QR Scanner Error:", err);
	}, []);

	return { scanning, setScanning, handleScan, handleError };
}
