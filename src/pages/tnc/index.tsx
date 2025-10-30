import React, { FC, useEffect, useState } from "react";
import useAuth from "@/hooks/useAuth";
import { stagger, useAnimate } from "framer-motion";
import useSeo from "@/hooks/useSeo";
import { useRecoilState } from "recoil";
import { loadingAtom } from "@/stores";

import mammoth from "mammoth";
import { loadImageAsync } from "@/utils/base";
import "./styles.scss";
const TnC: FC = () => {
	const [scope, animate] = useAnimate();
	useEffect(() => {
		const animUp = document.querySelectorAll(".animUp");
		animate(animUp, { y: [20, 0], opacity: [0, 1] }, { type: "spring", delay: stagger(0.15) });
	}, []);
	const { user, handleLogin } = useAuth();
	useSeo({ title: "Thể lệ chương trình" });
	const [, setLoading] = useRecoilState(loadingAtom);
	const [content, setContent] = useState<string | null>(null);

	useEffect(() => {
		const fetchDocx = async () => {
			try {
				setLoading(true);
				const docxPDF = await loadImageAsync("public/frontend/bud25/doc/tnc.docx");
				const response = await fetch(docxPDF);
				const arrayBuffer = await response.arrayBuffer();
				const result = await mammoth.convertToHtml({ arrayBuffer });
				// setContent(result.value.replace(/(tại đây)/g, '<span class="highlight-link">$1</span>'));
				let html = result.value.replace(/(tại đây)/g, '<span class="highlight-link">$1</span>');

				// Wrap all tables with a div.table-wrapper
				html = html.replace(/<table/g, '<div class="table-wrapper"><table');
				html = html.replace(/<\/table>/g, "</table></div>");

				setContent(html);
				setLoading(false);
			} catch (error) {
				console.error("Error fetching or processing the document:", error);
			} finally {
				setLoading(false);
			}
		};

		fetchDocx();
	}, []);

	return (
		<div className="page-content tnc" ref={scope}>
			<div className="animUp">
				<div className="text-center font-bold animUp">THỂ LỆ CHƯƠNG TRÌNH</div>
				<div className="animUp p-4 pb-[6rem]">
					<div className="flex flex-col items-center justify-center text-sm bg-white rounded-lg text-center pt-3 pb-3">
						<div className="content">{content && <div className="my-tnc" dangerouslySetInnerHTML={{ __html: content }}></div>}</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TnC;
