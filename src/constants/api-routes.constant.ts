const BASE_API = "/api";

export const API_ROUTES = {
  me: BASE_API + "/customers/me?depth=1",
  userPhoneNumberMe:BASE_API+'',
  forgotPassword: BASE_API + "/customers/forgot-password",
  logOut: BASE_API + "/customers/logout",
  product: BASE_API + "/products",
  createReview:BASE_API+'/reviews'
} as const;
