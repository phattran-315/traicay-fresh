export const GENERAL_ERROR_MESSAGE="Có lỗi xảy ra vui lòng thử lại sau"
export const EXCESS_QUANTITY_OPTION_MESSAGE="Nếu bạn muốn mua > 15kg vui lòng liên hệ qua Zalo"

// Phone number
export const PHONE_NUMBER_MESSAGE={
    SUCCESS:"Thêm số điện thoại thành công",
    CONFLICT:"Bạn đã thêm số điện thoại này trước rồi!",
    UPDATE_SUCCESSFULLY:"Cập nhật số điện thoại thành công",
    CANT_SET_DEFAULT:"Không thể đặt làm mặc định vui lòng thử lại sau.",
    SET_DEFAULT_SUCCESSFULLY:"Đổi số điện thoại mặc định thành công",
    CANT_DELETE:"Không thể xóa số điện thoại này vui lòng thử lại sau.",
    CANT_UPDATE:"Không thể cập nhật số điện thoại này vui lòng thử lại sau.",
    DELETE_SUCCESSFULLY:"Xóa số điện thoại thành công",

} as const

export const NAME_MESSAGE={
    // CONFLICT:"Bạn đã thêm số điện thoại này trước rồi!",
    UPDATE_SUCCESSFULLY:"Thay đổi tên thành công",

} as const

export const USER_MESSAGE={
    NOT_FOUND:"Không có người dùng nào với tài khoản này"
}
export const AUTH_MESSAGE={
    EXPIRED:"Mã OTP đã hết hạn",
    INVALID_OTP:"Mã OTP không đúng",
    INVALID_EMAIL_TOKEN:"Xác thực không thành công",
    SUCCESS_SEND_RESET_PASSWORD:"Link đổi mật khẩu đã được gửi qua email"

}
export const OTP_MESSAGE={
    SUCCESS: "Mã xác nhận đã được gửi đến số điện thoại của bạn và có hiệu lực trong 5 phút",
    SUCCESS_SENT_OTP_AGAIN:"OTP đã được gửi lại vào số điện thoại của bạn",
    VERIFY_SUCCESSFULLY:"Xác thực thành công"
}
export const ADDRESS_MESSAGE={
    SUCCESS:"Thêm địa chỉ thành công",
    CONFLICT:"Bạn đã thêm  địa chỉ này trước rồi!",
    UPDATE_SUCCESSFULLY:"Cập nhật địa chỉ thành công",
    CANT_SET_DEFAULT:"Không thể đặt làm mặc định vui lòng thử lại sau.",
    SET_DEFAULT_SUCCESSFULLY:"Đổi địa chỉ mặc định thành công",
    CANT_DELETE:"Không thể xóa số điện thoại này vui lòng thử lại sau.",
    CANT_UPDATE:"Không thể cập nhật địa chỉ này vui lòng thử lại sau.",
    DELETE_SUCCESSFULLY:"Xóa địa chỉ thành công",
    

} as const


export const COUPON_MESSAGE={
    SUCCESS:"Đã áp dụng mã giảm giá",
    INVALID:'Mã giảm giá không đúng vui lòng thử lại.',
    EXPIRED:'Mã giảm giá đã hết hạn',
    ALREADY_APPLIED:"Mã giảm giá đã được áp dụng cho tất cả sản phẩm trong giỏ hàng của bạn"
}

export const CHECKOUT_MESSAGE={

   ERROR:"Không thể đặt hàng ngay bây giờ vui lòng thử lại sau."
}
export const ORDER_MESSAGE={
    NOT_FOUND:"Đơn hàng không được tìm thấy vui lòng thử lại",
    SUCCESS_CANCEL_ORDER:"Đã hủy đơn hàng thành công",
    BAD_REQUEST:"Không thể hủy đơn hàng"

}

export const FEED_BACK_MESSAGE={
    SUCCESS:"Cảm ơn bạn đã gửi góp ý cho chúng tôi."
}

export const REVIEW_MESSAGE={
    SUCCESS:"Cảm ơn bạn đã đánh giá",
    BAD_REQUEST:"Không thể đánh giá khi bạn chưa mua hàng",
    DELETE_SUCCESSFULLY:"Xóa đánh giá thành công"
}


export const PRODUCT_MESSAGE={
    NOT_FOUND:" Không thể tìm sản phẩm này vui lòng thử lại sau"
}