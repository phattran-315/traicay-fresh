import { CollectionConfig } from "payload/types";
import { isAdmins } from "../access/isAdmin";

export const Coupons: CollectionConfig = {
  slug: "coupons",
  access: {
    read: isAdmins,
    update: isAdmins,
    create: isAdmins,
    delete: isAdmins,
  },
  fields: [
    {
      name: "coupon",
      label: "Coupon",
      type: "text",
    },
    { name: "discount", label: "Discount", type: "number" ,required:true},
    { name: "expiryDate", label: "Expiry Date", type: "date",required:true },
    { name: "usageCount", label: "Usage Count", type: "number" ,defaultValue:0},
    { name: "usageLimit", label: "Usage Limit", type: "number" },
  ],
};
