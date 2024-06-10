import { Product } from "@/payload/payload-types";
import { CartProductDetails } from "@/store/cart.store";

export type UserCart=({product:Product}& CartProductDetails)[]
