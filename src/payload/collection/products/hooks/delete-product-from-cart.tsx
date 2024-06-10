import { Product } from "@/payload/payload-types";
import type { AfterDeleteHook } from "payload/dist/collections/config/types";

export const deleteProductFromCarts: AfterDeleteHook<Product> = async ({
  req,
  id,
}) => {
  const usersPhoneNumberWithProductInCart = await req.payload.find({
    collection: "customer-phone-number",
    overrideAccess: true,
    where: {
      "cart.items.product": {
        equals: id,
      },
    },
  });

  if (usersPhoneNumberWithProductInCart.totalDocs > 0) {
    await Promise.all(
      usersPhoneNumberWithProductInCart.docs.map(async (user) => {
        const cart = user.cart;
        const itemsWithoutProduct = cart?.items?.filter(
          (item) => item.product !== id
        );
        const cartWithoutProduct = {
          ...cart,
          items: itemsWithoutProduct,
        };

        return req.payload.update({
          collection: "customer-phone-number",
          id: user.id,
          data: {
            cart: cartWithoutProduct,
          },
        });
      })
    );
  }

  const usersWithProductInCart = await req.payload.find({
    collection: "customers",

    overrideAccess: true,
    where: {
      "cart.items.product": {
        equals: id,
      },
    },
  });

  if (usersWithProductInCart.totalDocs > 0) {
    await Promise.all(
      usersWithProductInCart.docs.map(async (user) => {
        const cart = user.cart;
        const itemsWithoutProduct = cart?.items?.filter(
          (item) => item.product !== id
        );
        const cartWithoutProduct = {
          ...cart,
          items: itemsWithoutProduct,
        };

        return req.payload.update({
          collection: "customers",
          id: user.id,
          data: {
            cart: cartWithoutProduct,
          },
        });
      })
    );
  }
};
