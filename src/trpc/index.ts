import { publicProcedure, router } from "./trpc";
import AuthRouter from "./router/auth.router";
import UserRouter from "./router/user.router";
import ProductRouter from "./router/products.router";
import CustomerPhoneNumberRouter from "./router/customer-phone-number.router";
import CouponRouter from "./router/coupons.router";
import PaymentRouter from "./router/payment.router";
import AddressRouter from "./router/address.router";
import FeedbackRouter from "./router/feedback.router";
import OrderRouter from "./router/order.router";
import ReviewRouter from "./router/reviews.router";
// import { productRouter } from "./routes/product-router";
// import { PaymentRouter } from "./routes/payment-router";

export const appRouter = router({
  auth: AuthRouter,
  user: UserRouter,
  products: ProductRouter,
  customerPhoneNumber: CustomerPhoneNumberRouter,
  coupon: CouponRouter,
  address: AddressRouter,
  //   products: productRouter,
  payment: PaymentRouter,
  feedback: FeedbackRouter,
  order: OrderRouter,
  review:ReviewRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
