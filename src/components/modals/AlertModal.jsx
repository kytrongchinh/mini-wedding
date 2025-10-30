import Modal from "react-modal";

import "./modals.scss";
import close from "@/assets/images/close.png";
import { motion } from "framer-motion";
import ButtonDefault from "../ButtonDefault/ButtonDefault";
export default function AlertModal(props) {
	const { visible, title, description, ctaText, customClickCloseModal, customClickCTAButton, onCloseModal } = props;

	return (
		<Modal isOpen={visible} contentLabel="Example Modal">
			<div className="modal alert mt-5">
				<motion.div
					whileTap={{
						scale: 0.9,
					}}
					className="md-icon"
					onClick={() => {
						onCloseModal();
					}}
				>
					<div className="img">
						<img src={close} alt="" />
					</div>
				</motion.div>
				<div className="md-content box">
					<div className="body">
						<div className="content">
							<p>
								Tài khoản của bạn hiện đã bị khóa do nhập sai mã dự thưởng nhiều lần liên tiếp! Vui lòng liên hệ{" "}
								<strong className="color-primary">Zalo OA Oishi Vietnam</strong> để kiểm tra thông tin nhé!
							</p>
							<div className="mt-5">
								<div className="mb-3">
									<ButtonDefault text="xem thể lệ" buttonType="" />
								</div>
								<ButtonDefault text="LIÊN HỆ ZALO OA OISHI VIETNAM" buttonType="" />
							</div>
						</div>
					</div>
				</div>
			</div>
		</Modal>
	);
}
