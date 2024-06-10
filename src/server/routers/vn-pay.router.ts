import crypto from "crypto";
import path from "path";
import express from "express";
import dotenv from "dotenv";
import querystring from "qs";

import { getPayloadClient } from "../../payload/get-client-payload";
import { GENERAL_ERROR_MESSAGE } from "../../constants/app-message.constant";
const router = express.Router();
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

router.get("/vnpay_return", async (req, res, next) => {
  let vnp_Params = req.query;

  let secureHash = vnp_Params["vnp_SecureHash"];
  let orderIdResponse = vnp_Params["vnp_TxnRef"];
  let amount = vnp_Params["vnp_Amount"];
  const orderId =
    orderIdResponse && typeof orderIdResponse === "string"
      ? orderIdResponse
      : "";
  delete vnp_Params["vnp_SecureHash"];
  delete vnp_Params["vnp_SecureHashType"];

  vnp_Params = sortObject(vnp_Params);
  let tmnCode = process.env.VN_PAY_TMN_CODE!;
  let secretKey = process.env.VN_PAY_SECRET_KEY!;
  console.log("------------ vnp Params");
  console.log(vnp_Params);
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

  if (secureHash === signed) {
    res.render("success", { code: vnp_Params["vnp_ResponseCode"] });
  } else {
    res.render("success", { code: "97" });
  }
});

router.get("/vnpay_ipn", async (req, res, next) => {
  try {
    let vnp_Params = req.query;
    let secureHash = vnp_Params["vnp_SecureHash"];

    let orderIdResponse = vnp_Params["vnp_TxnRef"];
    let rspCode = vnp_Params["vnp_ResponseCode"];
    let amount = vnp_Params["vnp_Amount"];
    delete vnp_Params["vnp_SecureHash"];
    delete vnp_Params["vnp_SecureHashType"];

    vnp_Params = sortObject(vnp_Params);
    const orderId =
      orderIdResponse && typeof orderIdResponse === "string"
        ? orderIdResponse
        : "";

    let tmnCode = process.env.VN_PAY_TMN_CODE!;
    let secretKey = process.env.VN_PAY_SECRET_KEY!;
    console.log("000---");
    console.log("ipn url");

    let signData = querystring.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");

    let paymentStatus = "0"; // Giả sử '0' là trạng thái khởi tạo giao dịch, chưa có IPN. Trạng thái này được lưu khi yêu cầu thanh toán chuyển hướng sang Cổng thanh toán VNPAY tại đầu khởi tạo đơn hàng.
    //let paymentStatus = '1'; // Giả sử '1' là trạng thái thành công bạn cập nhật sau IPN được gọi và trả kết quả về nó
    //let paymentStatus = '2'; // Giả sử '2' là trạng thái thất bại bạn cập nhật sau IPN được gọi và trả kết quả về nó
    const payload = await getPayloadClient();
    const order = await payload.findByID({
      collection: "orders",
      id: orderId,
    });
    let checkOrderId = Boolean(order); // Mã đơn hàng "giá trị của vnp_TxnRef" VNPAY phản hồi tồn tại trong CSDL của bạn
    let checkAmount = order
      ? (order.totalAfterCoupon || order.total) / 100 ===
        (amount && (typeof amount === "string" || typeof amount === "number")
          ? +amount
          : 0)
      : false; // Kiểm tra số tiền "giá trị của vnp_Amout/100" trùng khớp với số tiền của đơn hàng trong CSDL của bạn
    if (secureHash === signed) {
      //kiểm tra checksum
      if (checkOrderId) {
        if (checkAmount) {
          if (paymentStatus == "0") {
            //kiểm tra tình trạng giao dịch trước khi cập nhật tình trạng thanh toán
            if (rspCode == "00") {
              //thanh cong
              //paymentStatus = '1'
              // Ở đây cập nhật trạng thái giao dịch thanh toán thành công vào CSDL của bạn
              await payload.update({
                collection: "orders",
                data: { _isPaid: true, status: "confirmed" },
                id: orderId,
              });
              res.status(200).json({ RspCode: "00", Message: "Success" });
            } else {
              //that bai
              //paymentStatus = '2'
              // Ở đây cập nhật trạng thái giao dịch thanh toán thất bại vào CSDL của bạn
              await payload.update({
                collection: "orders",
                data: { _isPaid: false, status: "failed" },
                id: orderId,
              });

              res.status(200).json({ RspCode: "00", Message: "Success" });
            }
          } else {
            res.status(200).json({
              RspCode: "02",
              Message: "This order has been updated to the payment status",
            });
          }
        } else {
          res.status(200).json({ RspCode: "04", Message: "Amount invalid" });
        }
      } else {
        res.status(200).json({ RspCode: "01", Message: "Order not found" });
      }
    } else {
      res.status(200).json({ RspCode: "97", Message: "Checksum failed" });
    }
  } catch (error) {
    console.log(error);
    throw new Error(GENERAL_ERROR_MESSAGE);
  }
});
function sortObject(obj: any) {
  let sorted = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    // @ts-ignore
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}
export default router