import { CollectionConfig } from "payload/types";
import { isAdmins } from "../access/isAdmin";




export const Otp: CollectionConfig = {
  slug: "otp",
  access: {
    read: isAdmins,
    update: isAdmins,
    delete: isAdmins,
    create: isAdmins
  },
  hooks: {
  },

  fields: [
    {
      name: "otp",
      type: "text",
    },
    {
      name: "phoneNumber",
      type: "text",
    },
  ],
};
