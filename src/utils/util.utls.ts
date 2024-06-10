import { ORDER_ID_LENGTH } from "../constants/configs.constant";
import type {
  Customer,
  CustomerPhoneNumber,
  Media,
} from "../payload/payload-types";

export function formatPriceToVND(price: number) {
  const formatter = new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  });
  return formatter.format(price);
}

export const getImgUrlMedia = (img: string | Media) => {
  return typeof img === "string" ? img : img.url;
};

export const sliceOrderId = (id: string) => {
  return `#${id.slice(-ORDER_ID_LENGTH)}`;
};
export const validateNumericInput = (value: string) => {
  // Regular expression to match only numeric characters
  const numericRegex = /^[0-9]*$/;
  return numericRegex.test(value);
};
export const isEmailUser = (
  user: Customer | CustomerPhoneNumber
): user is Customer => {
  if ("email" in user) return true;
  return false;
};
export const sortIsDefaultFirst = <
  T extends { isDefault?: boolean | undefined | null }
>(
  value: T[] | string
) => {
  if (Array.isArray(value))
    return value?.slice().sort((a, b) => {
      const isADefault = a.isDefault ?? false; // If isDefault is undefined, consider it false
      const isBDefault = b.isDefault ?? false; // If isDefault is undefined, consider it false
      if (isADefault && !isBDefault) {
        return -1;
      } else if (!isADefault && isBDefault) {
        return 1;
      } else {
        return 0;
      }
    }) as T[];
};

export const  sortArrayById=<T extends {id?:string|undefined|null}>(
  array: T[],
  currentId: string
) =>{
 return array.slice().sort(function (a, b) {
    if (a.id === currentId) {
      return -1; // `a` comes first
    } else if (b.id === currentId) {
      return 1; // `b` comes first
    } else {
      return 0; // Maintain the original order
    }
  }) as T[];
}
export const formUserAddress = (address: {
  street: string;
  ward: string;
  district: string;
}) => {
  return `${address.street} , ${address.ward} , ${address.district}`;
};



export const  stringify=(obj:Record<string,any>) =>{
  const replacer = [];
  for (const key in obj) {
      replacer.push(key);
  }
  return JSON.stringify(obj, replacer);
}


