import { CollectionConfig } from "payload/types";
import { isAdmins } from "../access/isAdmin";

export const Feedback: CollectionConfig = {
  slug: "feedback",
  access: {
    read: isAdmins,
    update: isAdmins,
    delete: isAdmins,
    create: isAdmins,
  },
  hooks: {},

  fields: [
    {
      name: "feedback",
      type: "textarea",
      required: false,
    },
    {
      name: "feedbackOptions",
      label: "FeedBack Options",
      type: 'array',
      fields: [
        {
          type: 'radio',
          name: 'options',
          label: 'Options',
          options: [
            {label:"Delivery Faster",value:'delivery-faster'},{label:"Need better serve attitude",value:'better-serve-attitude'}
          ],
        },
      ],
      // type:'select',
      //   options:[{label:"Delivery Faster",value:'delivery-faster'},{label:"Need better serve attitude",value:'better-serve-attitude'}]
    },
    {
      name: "user",
      label: "User",
      type: "relationship",
      relationTo: ["customers", "customer-phone-number"],
      hasMany: false,
      required: true,
    },
  ],
};
