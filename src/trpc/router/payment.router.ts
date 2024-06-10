import path from "path";
import dotenv from "dotenv";
import { z } from "zod";
import moment from "moment";
import querystring from "qs";
import { router, USER_TYPE } from "../trpc";
import { getPayloadClient } from "../../payload/get-client-payload";
import { isEmailUser } from "../../utils/util.utls";
import {
  Customer,
  CustomerPhoneNumber,
  Product,
} from "../../payload/payload-types";
import { throwTrpcInternalServer } from "../../utils/server/error-server.util";
import { APP_PARAMS, APP_URL } from "../../constants/navigation.constant";
import {
  CHECKOUT_MESSAGE,
  PRODUCT_MESSAGE,
} from "../../constants/api-messages.constant";
import getUserProcedure from "../middlewares/get-user-procedure";
import { TRPCError } from "@trpc/server";
import { DEFAULT_SHIPPING_FREE, FREESHIP_BY_CASH_FROM, FREESHIP_FROM } from "../../constants/configs.constant";
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });

// TODO: freeship for orders meet condition

const calculateUserAmountAndCreateOrderItems = async (
  user: Customer | CustomerPhoneNumber
) => {
  const payload = await getPayloadClient();
  const userCart = (
    await payload.findByID({
      collection: isEmailUser(user) ? "customers" : "customer-phone-number",
      id: user.id,
      depth: 2,
    })!
  ).cart?.items;

  // return total + item.quantity! * (item.priceAfterDiscount! || item.originalPrice!),

  if (!userCart) return;
  const cartTotalPrice = userCart.reduce((total, item) => {
    const product = item.product as Product;
    return (
      total +
      item.quantity! * (product.priceAfterDiscount! || product.originalPrice!)
    );
  }, 0);
  // let price
  let totalAfterCoupon = 0;
  let amount = cartTotalPrice;
  // check if having coupon and still valid
  const coupon = userCart.find((item) => item.coupon)?.coupon;
  if (coupon) {
    // check if the coupon still valid
    const couponInDb = await payload.find({
      collection: "coupons",
      where: { coupon: { equals: coupon } },
    });
    if (!couponInDb) {
      amount = cartTotalPrice;
      return;
    }
    const salePrice = userCart.reduce((total, item) => {
      const product = item.product as Product;
      if (item.discountAmount) {
        return (
          total +
          (item.discountAmount *
            item.quantity! *
            (product.priceAfterDiscount || product.originalPrice)) /
            100
        );
      }
      return total;
    }, 0);
    const priceAfterDiscount = cartTotalPrice - salePrice;
    amount = priceAfterDiscount;
    totalAfterCoupon = priceAfterDiscount;
  }
  // create order
  const orderItems = userCart.map((item) => {
    const product = item.product as Product;
    return {
      product: product.id,
      price: product.priceAfterDiscount || product.originalPrice,
      originalPrice: product.originalPrice,
      quantity: item.quantity!,
    };
  });
  return {
    amount,
    totalAfterCoupon,
    orderItems,
    userCart,
    provisional: cartTotalPrice,
  };
};

const CheckoutInfoSchema = z.object({
  orderNotes: z.string().optional(),
  shippingAddress: z.object({
    address: z.string(),
    userName: z.string(),
    userPhoneNumber: z.string(),
  }),
  // deliveryInfo: z.object({
  //   deliveryAddress: z.string(),
  //   deliveryFee: z.string(),
  //   quantity: z.string(),
  // }),
  // items: z.array(
  //   z.object({
  //     id: z.string(),
  //     imageUrl: z.string(),
  //     currency: z.literal("VND"),
  //     quantity: z.number(),
  //     // totalAmount: z.number(),
  //   })
  // ),
});

const PaymentRouter = router({
  payWithCash: getUserProcedure
    .input(CheckoutInfoSchema)
    .mutation(async ({ ctx, input }) => {
      const { orderNotes, shippingAddress } = input;
      const { user } = ctx;
      try {
        const payload = await getPayloadClient();
        // new order
        const resultCalculateAndOrderItems =
          await calculateUserAmountAndCreateOrderItems(user);
        if (!resultCalculateAndOrderItems) return;
        const { amount, orderItems, totalAfterCoupon, userCart, provisional } =
          resultCalculateAndOrderItems;
        const shippingFee = amount>=FREESHIP_BY_CASH_FROM?0:DEFAULT_SHIPPING_FREE;
        const newOrder = await payload.create({
          collection: "orders",
          data: {
            deliveryStatus: "pending",
            paymentMethod: "cash",
            provisional,
            orderBy: {
              value: user.id,
              relationTo: isEmailUser(user)
                ? "customers"
                : "customer-phone-number",
            },
            total: amount + shippingFee,

            items: orderItems,
            orderNotes,
            _isPaid: false,
            shippingFee,
            totalAfterCoupon,
            shippingAddress: shippingAddress,
            status: "pending",
          },
        });
        return {
          success: true,
          url: `${process.env.NEXT_PUBLIC_SERVER_URL}${APP_URL.orderStatus}?${APP_PARAMS.cartOrderId}=${newOrder.id}`,
        };
      } catch (error) {
        throwTrpcInternalServer(error);
      }
    }),
  payWithCashBuyNow: getUserProcedure
    .input(
      z
        .object({
          productId: z.string(),
          quantity: z.number(),
          couponCode: z.string().optional(),
        })
        .merge(CheckoutInfoSchema)
    )
    .mutation(async ({ ctx, input }) => {
      const { orderNotes, shippingAddress, quantity, productId, couponCode } =
        input;
      const { user } = ctx;
      try {
        const payload = await getPayloadClient();
        const product = await payload.findByID({
          collection: "products",
          id: productId,
        });
        if (!product)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: PRODUCT_MESSAGE.NOT_FOUND,
          });
        // new order
        const provisional =
          (product.priceAfterDiscount || product.originalPrice) * quantity;
        let totalAfterCoupon = provisional;
        if (couponCode) {
          const { docs: coupons } = await payload.find({
            collection: "coupons",
            where: { coupon: { equals: couponCode } },
          });
          const couponInDb = coupons[0];
          if (couponInDb) {
            totalAfterCoupon =
              provisional - (provisional * couponInDb.discount) / 100;
          }
        }
        const amount = totalAfterCoupon;
        const orderItems = [
          {
            product: productId,
            price: product.priceAfterDiscount || product.originalPrice,
            originalPrice: product.originalPrice,
            quantity,
          },
        ];

        const shippingFee = amount>=FREESHIP_BY_CASH_FROM?0:DEFAULT_SHIPPING_FREE;

        const newOrder = await payload.create({
          collection: "orders",
          data: {
            deliveryStatus: "pending",
            paymentMethod: "cash",
            provisional,
            orderBy: {
              value: user.id,
              relationTo: isEmailUser(user)
                ? "customers"
                : "customer-phone-number",
            },
            total: amount + shippingFee,
            items: orderItems,
            orderNotes,
            _isPaid: false,
            shippingFee,
            totalAfterCoupon,
            shippingAddress: shippingAddress,
            status: "pending",
          },
        });
        return {
          success: true,
          url: `${process.env.NEXT_PUBLIC_SERVER_URL}${APP_URL.orderStatus}?${APP_PARAMS.cartOrderId}=${newOrder.id}`,
        };
      } catch (error) {
        throwTrpcInternalServer(error);
      }
    }),
  payWithMomo: getUserProcedure
    .input(CheckoutInfoSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const payload = await getPayloadClient();
        //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
        const { orderNotes, shippingAddress } = input;
        const { user } = ctx;
        // if no user already handle in the previous middleware
        const resultCalculateAndOrderItems =
          await calculateUserAmountAndCreateOrderItems(user);
        if (!resultCalculateAndOrderItems) return;
        const { amount, orderItems, totalAfterCoupon, userCart, provisional } =
          resultCalculateAndOrderItems;

        // create order

        //parameters
        const partnerCode = process.env.MOMO_PARTNER_CODE!;
        const accessKey = process.env.MOMO_ACCESS_KEY!;
        const secretkey = process.env.MOMO_SECRET_KEY!;
        const requestId = partnerCode + new Date().getTime() + user.id;
        const orderId = requestId;
        const orderDetails = userCart.reduce((acc, item) => {
          const product = item.product as Product;
          return `${acc}${acc ? "," : ""} ${item.quantity}KG ${product.title}`;
        }, "");
        const orderInfo = `Thanh toán ${orderDetails}`;
        const shippingFee = amount>=FREESHIP_FROM?0:DEFAULT_SHIPPING_FREE;

        // create new order in db
        const newOrder = await payload.create({
          collection: "orders",
          data: {
            deliveryStatus: "pending",
            provisional,
            paymentMethod: "momo",
            orderBy: {
              value: user.id,
              relationTo: isEmailUser(user)
                ? "customers"
                : "customer-phone-number",
            },
            total: amount + shippingFee,
            items: orderItems,
            orderNotes,
            shippingFee: 0,
            _isPaid: false,
            totalAfterCoupon,
            shippingAddress: shippingAddress,
            status: "pending",
          },
        });

        const redirectUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}${APP_URL.orderStatus}?${APP_PARAMS.cartOrderId}=${newOrder.id}`;
        const ipnUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}/verify-momo-payment-success`;
        console.log("------------------");
        console.log(ipnUrl);
        // const ipnUrl = redirectUrl = "https://webhook.site/454e7b77-f177-4ece-8236-ddf1c26ba7f8";
        const requestType = "payWithATM";
        const extraData = ""; //pass empty value if your merchant does not have stores

        //before sign HMAC SHA256 with format
        //accessKey=$accessKey&amount=$amount&extraData=$extraData&ipnUrl=$ipnUrl&orderId=$orderId&orderInfo=$orderInfo&partnerCode=$partnerCode&redirectUrl=$redirectUrl&requestId=$requestId&requestType=$requestType
        const rawSignature =
          "accessKey=" +
          accessKey +
          "&amount=" +
          amount +
          "&extraData=" +
          extraData +
          "&ipnUrl=" +
          ipnUrl +
          "&orderId=" +
          orderId +
          "&orderInfo=" +
          orderInfo +
          "&partnerCode=" +
          partnerCode +
          "&redirectUrl=" +
          redirectUrl +
          "&requestId=" +
          requestId +
          "&requestType=" +
          requestType;

        //puts raw signature
        //signature
        const crypto = require("crypto");
        const signature = crypto
          .createHmac("sha256", secretkey)
          .update(rawSignature)
          .digest("hex");

        //json object send to MoMo endpoint
        const requestBody = JSON.stringify({
          partnerCode: partnerCode,
          accessKey: accessKey,
          requestId: requestId,
          amount: amount,
          orderId: orderId,
          orderInfo: orderInfo,
          redirectUrl: redirectUrl,
          ipnUrl: ipnUrl,
          notifyUrl: ipnUrl,
          extraData: extraData,
          requestType: requestType,
          signature: signature,
          lang: "vi",
          // items: {
          //   id: "204727",
          //   name: "YOMOST Bac Ha&Viet Quat 170ml",
          //   description: "YOMOST Sua Chua Uong Bac Ha&Viet Quat 170ml/1 Hop",
          //   category: "beverage",
          //   imageUrl: "https://momo.vn/uploads/product1.jpg",
          //   manufacturer: "Vinamilk",
          //   price: 11000,
          //   quantity: 5,
          //   unit: "hộp",
          //   totalPrice: 55000,
          //   taxAmount: "200",
          // },
        });
        //Create the HTTPS objects
        const https = require("https");
        return new Promise((resolve, reject) => {
          const options = {
            hostname: "test-payment.momo.vn",
            port: 443,
            path: "/v2/gateway/api/create",
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Content-Length": Buffer.byteLength(requestBody),
            },
          };

          const req = https.request(options, (res: any) => {
            res.setEncoding("utf8");
            res.on("data", (body: any) => {
              const payUrl = JSON.parse(body).payUrl;
              if (payUrl) {
                // create order

                resolve({ success: true, url: payUrl });
              }
            });
            res.on("end", () => {
              console.log("No more data in response.");
            });
          });

          req.on("error", (error: any) => {
            console.error(`Problem with request: ${error.message}`);
            reject({
              message: "Không thể thanh toán bằng momo vui lòng thử lại",
              code: 500,
            });
            // reject(error);
          });

          req.write(requestBody);
          req.end();
        });
      } catch (error) {
        throw new Error(CHECKOUT_MESSAGE.ERROR);
      }
    }),

  verifyMomoPaymentSuccessStatus: getUserProcedure.mutation(({ ctx }) => {
    const { res, req } = ctx;
    const transactionInfo = req.body;
    console.log(transactionInfo);

    // TODO: Xác minh thông tin giao dịch tại đây

    // Phản hồi Momo với status code 200
    res.sendStatus(200);
  }),
  payWithVnPay: getUserProcedure
    .input(CheckoutInfoSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const payload = await getPayloadClient();
        //https://developers.momo.vn/#/docs/en/aiov2/?id=payment-method
        const { orderNotes, shippingAddress } = input;
        const { user, req } = ctx;
        const resultCalculateAndOrderItems =
          await calculateUserAmountAndCreateOrderItems(user);
        if (!resultCalculateAndOrderItems) return;
        const { amount, orderItems, totalAfterCoupon, userCart, provisional } =
          resultCalculateAndOrderItems;
        // if no user already handle in the previous middleware

        //parameters
        console.log("----amount");
        console.log(amount);
        const shippingFee = amount>=FREESHIP_FROM?0:DEFAULT_SHIPPING_FREE;

        // create new order in db
        const newOrder = await payload.create({
          collection: "orders",
          data: {
            deliveryStatus: "pending",
            paymentMethod: "vnpay",
            orderBy: {
              value: user.id,
              relationTo: isEmailUser(user)
                ? "customers"
                : "customer-phone-number",
            },
            total: amount + shippingFee,
            provisional,
            items: orderItems,
            orderNotes,
            shippingFee,
            _isPaid: false,
            totalAfterCoupon,
            shippingAddress: shippingAddress,
            status: "pending",
          },
        });

        let date = new Date();
        let createDate = moment(date).format("YYYYMMDDHHmmss");

        let ipAddr =
          req.headers["x-forwarded-for"] ||
          req.connection.remoteAddress ||
          req.socket.remoteAddress ||
          // @ts-ignore
          req.connection.socket.remoteAddress;

        let tmnCode = process.env.VN_PAY_TMN_CODE;
        let secretKey = process.env.VN_PAY_SECRET_KEY;
        let vnpUrl = process.env.VN_PAY_URL;
        let returnUrl = `${process.env.NEXT_PUBLIC_SERVER_URL}${APP_URL.orderStatus}?${APP_PARAMS.cartOrderId}=${newOrder.id}`;
        let orderId = newOrder.id;
        const orderDetails = userCart.reduce((acc, item) => {
          const product = item.product as Product;
          return `${acc}${acc ? "," : ""} ${item.quantity}KG ${product.title}`;
        }, "");
        // normalize vietnamese
        const orderInfo = `Thanh toán ${orderDetails}`
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "");

        let bankCode;

        let locale = "vn";
        if (locale === null || locale === "") {
          locale = "vn";
        }
        let currCode = "VND";
        let vnp_Params: any = {};
        vnp_Params["vnp_Version"] = "2.1.0";
        vnp_Params["vnp_Command"] = "pay";
        vnp_Params["vnp_TmnCode"] = tmnCode;
        vnp_Params["vnp_Locale"] = locale;
        vnp_Params["vnp_CurrCode"] = currCode;
        vnp_Params["vnp_TxnRef"] = orderId;
        vnp_Params["vnp_OrderInfo"] = orderInfo;
        vnp_Params["vnp_OrderType"] = "other";
        vnp_Params["vnp_Amount"] = amount * 100;
        vnp_Params["vnp_ReturnUrl"] = returnUrl;
        vnp_Params["vnp_IpAddr"] = ipAddr;
        vnp_Params["vnp_CreateDate"] = createDate;
        // if (bankCode !== null && bankCode !== "") {
        //   vnp_Params["vnp_BankCode"] = bankCode;
        // }

        vnp_Params = sortObject(vnp_Params);

        let signData = querystring.stringify(vnp_Params, { encode: false });
        let crypto = require("crypto");
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(Buffer.from(signData, "utf-8")).digest("hex");
        vnp_Params["vnp_SecureHash"] = signed;
        vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });
        return { success: true, url: vnpUrl };
        // res.redirect(vnpUrl);
      } catch (error) {
        throw new Error(CHECKOUT_MESSAGE.ERROR);
      }
    }),
});

export default PaymentRouter;

function sortObject(obj: any) {
  let sorted: any = {};
  let str = [];
  let key;
  for (key in obj) {
    if (obj.hasOwnProperty(key)) {
      str.push(encodeURIComponent(key));
    }
  }
  str.sort();
  for (key = 0; key < str.length; key++) {
    sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
  }
  return sorted;
}
