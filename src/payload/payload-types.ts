/* tslint:disable */
/* eslint-disable */
/**
 * This file was automatically generated by Payload.
 * DO NOT MODIFY IT BY HAND. Instead, modify your source Payload config,
 * and re-run `payload generate:types` to regenerate this file.
 */

/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "CartItems".
 */
export type CartItems =
  | {
      product?: (string | null) | Product;
      quantity?: number | null;
      price?: number | null;
      isAppliedCoupon?: boolean | null;
      coupon?: string | null;
      discountAmount?: number | null;
      shippingCost?: number | null;
      id?: string | null;
    }[]
  | null;

export interface Config {
  collections: {
    admins: Admin;
    products: Product;
    orders: Order;
    reviews: Review;
    customers: Customer;
    media: Media;
    otp: Otp;
    'customer-phone-number': CustomerPhoneNumber;
    coupons: Coupon;
    feedback: Feedback;
    'payload-preferences': PayloadPreference;
    'payload-migrations': PayloadMigration;
  };
  globals: {};
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "admins".
 */
export interface Admin {
  id: string;
  name: string;
  role?: string | null;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "products".
 */
export interface Product {
  id: string;
  title: string;
  _inStock?: boolean | null;
  priority: boolean;
  originalPrice: number;
  priceAfterDiscount?: number | null;
  quantityOptions?:
    | {
        kg: number;
        id?: string | null;
      }[]
    | null;
  estimateQuantityFor1Kg?: string | null;
  description: string;
  thumbnailImg: string | Media;
  productImgs: (string | Media)[];
  benefitImg: string | Media;
  reviewQuantity?: number | null;
  totalRating?: number | null;
  ratingAverage?: number | null;
  relativeProducts?: (string | Product)[] | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "media".
 */
export interface Media {
  id: string;
  alt: string;
  updatedAt: string;
  createdAt: string;
  url?: string | null;
  filename?: string | null;
  mimeType?: string | null;
  filesize?: number | null;
  width?: number | null;
  height?: number | null;
  sizes?: {
    thumbnail?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
    card?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
    tablet?: {
      url?: string | null;
      width?: number | null;
      height?: number | null;
      mimeType?: string | null;
      filesize?: number | null;
      filename?: string | null;
    };
  };
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "orders".
 */
export interface Order {
  id: string;
  orderBy:
    | {
        relationTo: 'customers';
        value: string | Customer;
      }
    | {
        relationTo: 'customer-phone-number';
        value: string | CustomerPhoneNumber;
      };
  orderNotes?: string | null;
  total: number;
  provisional: number;
  shippingFee: number;
  totalAfterCoupon?: number | null;
  _isPaid?: boolean | null;
  shippingAddress: {
    userName: string;
    userPhoneNumber: string;
    address: string;
  };
  paymentMethod: 'momo' | 'cash' | 'vnpay' | 'onepay';
  status: 'pending' | 'failed' | 'canceled' | 'confirmed';
  deliveryStatus: 'pending' | 'delivering' | 'delivered' | 'canceled';
  items: {
    product: string | Product;
    price: number;
    originalPrice?: number | null;
    quantity: number;
    id?: string | null;
  }[];
  cancelReason?:
    | (
        | 'update-address-phone-number'
        | 'add-change-coupon-code'
        | 'dont-want-to-buy'
        | 'bad-service-quality'
        | 'another-reason'
      )
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "customers".
 */
export interface Customer {
  id: string;
  name: string;
  phoneNumbers?:
    | {
        isDefault?: boolean | null;
        phoneNumber: string;
        id?: string | null;
      }[]
    | null;
  address?:
    | {
        isDefault?: boolean | null;
        district: string;
        ward: string;
        street: string;
        name: string;
        phoneNumber: string;
        id?: string | null;
      }[]
    | null;
  cart?: {
    items?: CartItems;
  };
  purchases?: (string | Product)[] | null;
  cancelOrders?: number | null;
  isTrusted?: boolean | null;
  updatedAt: string;
  createdAt: string;
  email: string;
  resetPasswordToken?: string | null;
  resetPasswordExpiration?: string | null;
  salt?: string | null;
  hash?: string | null;
  _verified?: boolean | null;
  _verificationToken?: string | null;
  loginAttempts?: number | null;
  lockUntil?: string | null;
  password: string | null;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "customer-phone-number".
 */
export interface CustomerPhoneNumber {
  id: string;
  refreshToken?: string | null;
  phoneNumber: string;
  phoneNumbers?:
    | {
        isDefault?: boolean | null;
        phoneNumber: string;
        id?: string | null;
      }[]
    | null;
  name?: string | null;
  address?:
    | {
        isDefault?: boolean | null;
        district: string;
        ward: string;
        street: string;
        name: string;
        phoneNumber: string;
        id?: string | null;
      }[]
    | null;
  cart?: {
    items?: CartItems;
  };
  purchases?: (string | Product)[] | null;
  cancelOrders?: number | null;
  isTrusted?: boolean | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "reviews".
 */
export interface Review {
  id: string;
  reviewText?: string | null;
  rating: number;
  reviewImgs?:
    | {
        reviewImg?: (string | null) | Media;
        id?: string | null;
      }[]
    | null;
  product: string | Product;
  user:
    | {
        relationTo: 'customer-phone-number';
        value: string | CustomerPhoneNumber;
      }
    | {
        relationTo: 'customers';
        value: string | Customer;
      };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "otp".
 */
export interface Otp {
  id: string;
  otp?: string | null;
  phoneNumber?: string | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "coupons".
 */
export interface Coupon {
  id: string;
  coupon?: string | null;
  discount: number;
  expiryDate: string;
  usageCount?: number | null;
  usageLimit?: number | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "feedback".
 */
export interface Feedback {
  id: string;
  feedback?: string | null;
  feedbackOptions?:
    | {
        options?: ('delivery-faster' | 'better-serve-attitude') | null;
        id?: string | null;
      }[]
    | null;
  user:
    | {
        relationTo: 'customers';
        value: string | Customer;
      }
    | {
        relationTo: 'customer-phone-number';
        value: string | CustomerPhoneNumber;
      };
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-preferences".
 */
export interface PayloadPreference {
  id: string;
  user:
    | {
        relationTo: 'admins';
        value: string | Admin;
      }
    | {
        relationTo: 'customers';
        value: string | Customer;
      };
  key?: string | null;
  value?:
    | {
        [k: string]: unknown;
      }
    | unknown[]
    | string
    | number
    | boolean
    | null;
  updatedAt: string;
  createdAt: string;
}
/**
 * This interface was referenced by `Config`'s JSON-Schema
 * via the `definition` "payload-migrations".
 */
export interface PayloadMigration {
  id: string;
  name?: string | null;
  batch?: number | null;
  updatedAt: string;
  createdAt: string;
}


declare module 'payload' {
  export interface GeneratedTypes extends Config {}
}