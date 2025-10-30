import { CommonFields } from "./interface";

export enum MESSAGE_TEMPLATES {
	START_CAMPAIGN = `<p>Chương trình <strong class="color-primary">Khuyến mãi</strong> bắt đầu từ ngày {{startDate}} đến {{endDate}}</p>`,
	END_CAMPAIGN = `<p>Chương trình <strong class="color-primary">Khuyến mãi</strong> bắt đầu từ ngày {{startDate}} đến {{endDate}}</p>`,
	GENERAL = `<p>Chương trình chưa diễn ra.</p>`,

	BACK_TO_HOME = `<p>Bạn có chắc chắn muốn về trang chủ?</p>`,
	NOT_SUPPORT_ZALO_VERSION = `<p>Phiên bản Zalo hiện tại chưa hỗ trợ tính năng nạp tiền điện thoại của chương trình này. Dành 1 phút để nâng cấp lên phiên bản Zalo mới nhất</p>`,

	UNLUCKY = `<p>Chúc bạn may mắn lần sau!</p>`,
	CODE_WRONG = `<p>Mã dự thưởng không hợp lệ. Vui lòng kiểm tra lại hoặc liên hệ <strong class="color-primary">Zalo OA</strong> để kiểm tra thông tin nhé!</p>`,
	CODE_USED = `<p>Mã dự thưởng không hợp lệ. Vui lòng kiểm tra lại hoặc liên hệ <strong class="color-primary">Zalo OA</strong> để kiểm tra thông tin nhé!</p>`,
	CODE_INVALID = `<p>Mã dự thưởng không hợp lệ. Vui lòng kiểm tra lại hoặc liên hệ <strong class="color-primary">Zalo OA</strong> để kiểm tra thông tin nhé!</p>`,
	CONFIRM_SUCCESS = `<p>Bạn đã điền thông tin thành công!</p>`,

	AUTHENTICATION = `<h4 class="title-modal">Số điện thoại là thông tin bắt buộc<bR>để tham gia chương trình</h4>
				<p>Vui lòng bấm <b>Tiếp tục</b> và bấm <b>Cho phép</b> để chia sẻ số điện thoại cho chương trình.</p>
				<p>Số điện thoại của bạn cần là số định danh tài khoản Zalo để BTC có thể tiến hành liên hệ và trao thưởng</p>`,

	BLOCK_USER = `<p>Tài khoản của bạn hiện đã bị khóa do nhập sai mã dự thưởng nhiều lần liên tiếp! Vui lòng liên hệ <strong class="color-primary">Zalo OA</strong> để kiểm tra thông tin nhé!</p>`,
	BLOCK_USER_GIFT = `<p>Tài khoản của bạn bị khóa và không thể thực hiện được chức năng này. Vui lòng thử lại sau khi hết thời gian bị khóa theo quy định.</p>`,
	BLOCK_USER_LEVEL_1 = `<p>Bạn đã nhập sai mã dự thưởng 5 lần liên tục.<br /> Vui lòng tiếp tục tham gia chương trình sau 24 tiếng.</p>`,
	BLOCK_USER_LEVEL_2 = `<p>Bạn đã nhập sai mã dự thưởng 5 lần liên tục.<br /> Vui lòng tiếp tục tham gia chương trình sau 24 tiếng.</p>`,
	BLOCK_USER_LEVEL_3 = `<p>Bạn đã nhập sai mã dự thưởng 5 lần liên tục.<br /> Vui lòng tiếp tục tham gia chương trình sau 24 tiếng.</p>`,

	ERRROR_SYSTEM = `<h4 class="title-modal">RẤT TIẾC!</h4><p>Đã có lỗi xảy ra, vui lòng thử lại!</p>`,

	QR_INVALID = `<p>QR của bạn có mã tham gia không hợp lệ. Vui lòng thử lại QR khác!</p>`,
	CAMERA_PERMISSION = `<p>Bạn vui lòng cung cấp quyền truy cập camera để thực hiện tính năng này!</p>`,
	PHONE_PERMISSION = `<p>Bạn vui lòng cung cấp số điện thoại để thực hiện tính năng này!</p>`,
	FAIL_UPLOAD = `<p>Upload hình ảnh không thành công!</p>`,
	DOWN_UPLOAD_SUCCESS = `<p>Tải hình ảnh thành công!</p>`,
	FOLLOW_OA = `<h4 class="title-modal">Quan tâm OA để nhận tin nhắn từ chương trình</h4><p>Vui lòng bấm Tiếp tục và bấm <b>Quan tâm</b> để nhận tin nhắn của chương trình</p>`,
	USER_NOT_PG = `<h4 class="bold">Không thành công!</h4><p>Số điện thoại đăng kí không phải dành cho PG. Vui lòng kiểm tra lại</p>`,
	LIMIT_SIZE_FILE_UPLOAD = `<p>Hình ảnh bạn chọn phải có dung dượng nhỏ hơn 5MB!</p>`,
	CAN_NOT_JOIN_CAMPAIGN = `<p>Tài khoản của bạn không thể tham gia thực hiện các chức năng của chương trình! Vui lòng liên hệ với ban quản trị để biết thêm chi tiết.</p>`,
}

export const loadMyMessage = (template: MESSAGE_TEMPLATES, params: CommonFields): string => {
	let message: string = template;
	if (params) {
		Object.entries(params).forEach(([key, value]) => {
			message = message.replace(`{{${key}}}`, value || "");
		});
	}
	return message;
};
