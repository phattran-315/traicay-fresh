import { create } from "zustand";
import { Product } from "@/payload/payload-types";
import { createJSONStorage, persist } from "zustand/middleware";
import { MAXIMUN_KG_CAN_BUY_THROUGH_WEB } from "@/constants/configs.constant";


export type CartProductDetails={ quantity: number,shippingCost?:number|null,discountAmount?:number|null,isAppliedCoupon?:boolean|null,coupon?:string|null }
export type CartProductItem = CartProductDetails & Pick<
  Product,
  | "id"
  | "title"
  | "thumbnailImg"
  | "originalPrice"
  | "priceAfterDiscount"
>;
export type CartItem = {
  product: CartProductItem;
};

type CartState = {
  items: CartProductItem[];
  setItem: (products: CartProductItem[]) => void;
  addItem: (product: CartProductItem) => void;
  removeItem: (id: string) => void;
  updateItem: ({
    id,
    data,
  }: {
    id: string;
    data: Partial<CartProductItem>;
  }) => void;
  clearCart: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      setItem(products) {
        return set(() => {
          const items: CartProductItem[] = products.map((product) => {
            const {
              id,
              originalPrice,
              quantity,
              thumbnailImg,
              coupon,
              title,
              priceAfterDiscount,
              discountAmount,isAppliedCoupon,shippingCost,
            } = product;
            return {
              id,
              coupon,
              originalPrice,
              discountAmount,isAppliedCoupon,shippingCost,
              quantity,
              thumbnailImg,
              title,

              priceAfterDiscount,
            };
          });
          return { items };
        });
      },
      addItem: (product) =>
        set((state) => {
          const existingProduct = state.items.find(
            (item) => item.id === product.id
          );
          if (!existingProduct) return { items: [...state.items, product] };
          const updatedItems = state.items.map((item) =>
            item.id === product.id
              ? {
                  ...existingProduct,
                  quantity: existingProduct.quantity + product.quantity>=MAXIMUN_KG_CAN_BUY_THROUGH_WEB?15:existingProduct.quantity + product.quantity,
                }
              : item
          );
          return { items: updatedItems };
        }),
      removeItem: (id) =>
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        })),
      updateItem({ id, data }) {
        return set((state) => {
          const product = state.items.find((item) => item.id === id);
          if (!product) return { items: state.items };
          return {
            items: state.items.map((item) =>
              item.id === id ? { ...product, ...data } : item
            ),
          };
        });
      },
      clearCart: () => set({ items: [] }),
    }),
    {
      name: "traicayfresh/cart-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
