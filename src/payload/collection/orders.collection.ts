import { CollectionConfig } from "payload/types";
import { clearUserCart } from "./customers/hooks/clearUserCart";

export const Orders: CollectionConfig = {
  slug: "orders",
  hooks: {
    afterChange: [clearUserCart],
  },
    admin:{
      defaultColumns:['status','deliveryStatus','total','paymentMethod']
    },
    fields: [
    {
      name: "orderBy",
      label: "Order By User",
      type: "relationship",
      relationTo: ["customers", "customer-phone-number"],
      hasMany: false,
      required: true,
    },
    { name: "orderNotes", label: "Order Notes", type: "text" },
    {
      name: "total",
      label: "Total",
      type: "number",
      required: true,
      min: 1,
    },
    {
      name: "provisional",
      label: "Provisional",
      type: "number",
      required: true,
    },
    {name:'shippingFee',label:"Shipping Fee",type:'number',required:true,defaultValue:0},
    {
      name: "totalAfterCoupon",
      label: "Total After Coupon",
      type: "number",
      // required: true,
    },
    { name: "_isPaid", type: "checkbox", defaultValue: false },
    {
      name: "shippingAddress",
      label: "Shipping Address",
      type: "group",
      fields: [
        { name: "userName", label: "User Name", type: "text", required: true },
        {
          name: "userPhoneNumber",
          label: "User PhoneNumber",
          type: "text",
          required: true,
        },
        { name: "address", label: "address", type: "text", required: true },
      ],
    },
    {
      name: "paymentMethod",
      label: "Pay With",
      type: "select",
      options: [
        {
          label: "MOMO",
          value: "momo",
        },
        { label: "CASH", value: "cash" },
        { label: "VNPAY", value: "vnpay" },
        { label: "ONEPAY", value: "onepay" },
      ],
      required:true
    },
    {
      name: "status",
      label: "Order's status",
      type: "select",
      defaultValue:'pending',
      options: [
        { label: "Pending", value: "pending" },
        { label: "Pending", value: "failed" },

        // { label: "Delivering", value: "delivering" },
        { label: "Canceled", value: "canceled" },
        { label: "Confirmed", value: "confirmed" },
      ],
      required:true
    },
    {
      name: "deliveryStatus",
      label: "Delivering's status",
      type: "select",
      defaultValue: "pending",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Delivering", value: "delivering" },
        { label: "Confirmed", value: "delivered" },
        { label: "Canceled", value: "canceled" },
      ],
      required:true
    },

    {
      name: "items",
      type: "array",
      required:true,
      fields: [
        {
          name: "product",
          type: "relationship",
          relationTo: "products",
          required: true,
        },
        {
          name: "price",
          type: "number",
          min: 0,
          required:true
        },
        {
          name: "originalPrice",
          type: "number",
          min: 0,
        },
        {
          name: "quantity",
          type: "number",
          min: 0,
          max:15,
          required:true
        },
      ],
    },
    {
      name: "cancelReason",
      label: "Cancellation Reason",
      type: "select",
      options: [
        {
          label: "Update Address Phone Number",
          value: "update-address-phone-number",
        },
        { label: "Add / Change Coupon Code ", value: "add-change-coupon-code" },
        { label: "Dont want to buy ", value: "dont-want-to-buy" },
        { label: "Service Quality is not good", value: "bad-service-quality" },
        { label: "Another Reason", value: "another-reason" },
      ],
    },
  ],
};
