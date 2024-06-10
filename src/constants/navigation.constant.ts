export const APP_URL = {
  home: "/",
  cart: "/cart",
  products: "/products",
  signUp: "/sign-up",
  login: "/login",
  myProfile: "/my-profile",
  myOrders: "/my-orders",
  checkout:'/checkout',
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  orderStatus:'/order-status',
  contact:'/contact',
  aboutUs:'/about-us',
  verifyEmail:'/verify-email'
} as const;

export const APP_PARAMS = {
    // TODO: adjust consistency
  token: "token=",
  toEmail: "toEmail=",
  origin:'origin',
  currentQuantityOption: "currentQuantityOption",
  isOpenOtp:'isOpenOtp',
  cartOrderId:'cartOrderId',
  checkoutFlow:'checkoutFlow',
  productId:'productId'
} as const;
