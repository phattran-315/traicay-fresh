import { CollectionConfig } from "payload/types";
import { isAdmins } from "../../access/isAdmin";
import {
  updateProductReviewRatingQuantityAfterChange,
  updateProductReviewRatingQuantityAfterDelete,
} from "./hooks/update-product-review-rating-quantity";

export const Reviews: CollectionConfig = {
  slug: "reviews",
  access: {
    delete: isAdmins,
    update: isAdmins,
    read: isAdmins,
    create: isAdmins,
  },
  hooks: {
    afterChange: [updateProductReviewRatingQuantityAfterChange],
    afterDelete: [updateProductReviewRatingQuantityAfterDelete],
  },
  fields: [
    {
      name: "reviewText",
      label: "Review",
      type: "text",
    },
    {
      name: "rating",
      label: "Rating",
      type: "number",
      required: true,
      min: 1,
      max: 5,
    },
    {
      name: "reviewImgs",
      label: "Review's Images",
      type: "array",
      fields: [
        {
          name: "reviewImg",
          type: "relationship",
          relationTo: "media",
        },
      ],
      maxRows: 3,
    },
   
    {
      name: "product",
      label: "Review's of Product",
      type: "relationship",
      relationTo: "products",
      required: true,
      hasMany: false,
    },
    {
      name: "user",
      label: "Review's of User",
      type: "relationship",
      relationTo: ["customer-phone-number", "customers"],
      hasMany: false,
      required: true,
    },
  ],
};
