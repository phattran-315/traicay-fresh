import { API_ROUTES } from "@/constants/api-routes.constant";
import { callApi } from "@/utils/service.util";




export const logOutUser = async () => {
  const data = await callApi({
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    url: API_ROUTES.logOut,
  });
  return data;
};

export const forgotPassword = async (email: string) => {

  const result = await callApi({
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: { email },
    url: API_ROUTES.forgotPassword,
  });
  
  return result;
};
// export const resetPassword = async (token: string,password) => {
//   const result = await callApi({
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     data: { token ,password},
//     url: API_ROUTES.forgotPassword,
//   });
//   return result;
// };

