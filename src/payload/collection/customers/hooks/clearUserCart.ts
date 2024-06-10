import type { AfterChangeHook } from "payload/dist/collections/config/types";

import { Order } from "@/payload/payload-types";

export const clearUserCart: AfterChangeHook<Order> = async ({
  doc,
  req,
  operation,
}) => {
  const { payload } = req;

  if (operation === "create" && doc.orderBy) {
    const orderById =typeof doc.orderBy.value==='object'?doc.orderBy.value.id:doc.orderBy.value
      
    if (
      doc.orderBy.relationTo === "customers" &&
      typeof orderById === "string"
    ) {
      const user = await payload.findByID({
        collection: "customers",
        id: orderById,
      });

      if (user) {
        await payload.update({
          collection: "customers",
          id: orderById,
          data: {
            cart: {
              items: [],
            },
          },
        });
      }
      return;
    }
    if (typeof orderById === "string") {
      const user = await payload.findByID({
        collection: "customer-phone-number",
        id: orderById,
      });

      if (user) {
        await payload.update({
          collection: "customer-phone-number",
          id: orderById,
          data: {
            cart: {
              items: [],
            },
          },
        });
      }
    }
  }

  return;
};
