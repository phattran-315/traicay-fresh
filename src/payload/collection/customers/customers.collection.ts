import { CollectionConfig } from "payload/types";
import { isAdmins } from "../../access/isAdmin";
import { isAdminAndCustomer } from "../../access/adminsOrLoggedIn";
import { anyone } from "../../access/anyone";
import { Customer } from "../../payload-types";

export const Customers: CollectionConfig = {
  slug: "customers",
  access: {
    read: isAdminAndCustomer,
    update: isAdminAndCustomer,
    create: anyone,
    delete: isAdmins,
  },

  auth: {
    cookies:{
      secure:true
    },
    // token expires after 30days
    tokenExpiration: 2592000000,
    maxLoginAttempts: 7,
    lockTime: 600 * 1000,
    forgotPassword: {
      generateEmailHTML: (agrs) => {
        const req = agrs?.req;
        const user = agrs?.user as Customer;
        const token = agrs?.token;
        // Use the token provided to allow your user to reset their password
        const resetPasswordURL = `${process.env.NEXT_PUBLIC_SERVER_URL}/reset-password?token=${token}`;

        return `
        <!DOCTYPE html>
        <html>
          <body>
            <h2>Xin chào ${user.email},</h2>
            <p>Vui lòng nhấp vào link bên dưới để đổi lại mật khấu</p>
            <a href="${resetPasswordURL}" style="background-color: #22C55E; color: black; padding: 14px 20px; text-align: center; text-decoration: none; display: inline-block;">Đặt lai mật khẩu</a>

            <p>Xin Cảm ơn,</p>
            <p>TraiCayFresh</p>
          </body>
        </html>
        `;
      },
    },
    verify: {
      generateEmailHTML: ({ req, token, user }) => {
        // Use the token provided to allow your user to verify their account
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/verify?token=${token}`;

        return `
          <!DOCTYPE html>
          <html>
            <body>
              <h2>Xin chào ${user.email},</h2>
              <p>Cảm ơn bạn đã đăng kí tài khoản tại TraiCayFresh. Vui lòng xác thực tài khoản của bạn bằng cách nhấp vào link liên kết bên dưới.</p>
              <a href="${url}" style="background-color: #22C55E; color: blalck; padding: 14px 20px; text-align: center; text-decoration: none; display: inline-block;">Xác thực Email</a>
              <p>Nếu bạn không thực hiện hành động này, bạn có thể bỏ qua email này.</p>
              <p>Xin cảm ơn,</p>
              <p>TraiCayFresh</p>
            </body>
          </html>
        `;
      },
    },
  },
  fields: [
    {
      name: "name",
      label: "Name",
      type: "text",
      required: true,
    },
    {
      name: "phoneNumbers",
      label: "Phone Number",
      type: "array",
      maxRows: 5,
      fields: [
        {
          name: "isDefault",
          label: "Is Default Phone Number",
          type: "checkbox",
        },
        {
          name: "phoneNumber",
          label: "Phone Number",
          type: "text",
          required: true,
        },
      ],
    },
    {
      name: "address",
      label: "Address",
      type: "array",
      maxRows: 5,
      fields: [
        {
          name: "isDefault",
          label: "Is Default Address",
          type: "checkbox",
        },
        { name: "district", label: "District", type: "text", required: true },
        { name: "ward", label: "Ward", type: "text", required: true },

        { name: "street", label: "Street", type: "text", required: true },
        { name: "name", label: "Name", type: "text", required: true },
        {
          name: "phoneNumber",
          label: "Phone Number",
          type: "text",
          required: true,
        },

        // {
        //   name: "address",
        //   label: "Address",
        //   type: "text",
        //   required: true,
        // },
      ],
    },
    {
      label: "Cart",
      name: "cart",
      type: "group",
      fields: [
        {
          name: "items",
          label: "Items",
          type: "array",
          interfaceName: "CartItems",
          fields: [
            {
              name: "product",
              type: "relationship",
              relationTo: "products",
            },
            {name:"price",type:'number'},
            {
              name: "quantity",
              type: "number",
              min: 0,
              max: 20,
              admin: {
                step: 0.5,
              },
            },
            {
              name: "isAppliedCoupon",
              type: "checkbox",
              defaultValue: false,
            },

            { name: "coupon", type: "text" },
            {
              name: "discountAmount",
              type: "number",
            },
            {
              name: "shippingCost",
              type: "number",
            },
          ],
        },
        // If you wanted to maintain a 'created on'
        // or 'last modified' date for the cart
        // you could do so here:
        // {
        //   name: 'createdOn',
        //   label: 'Created On',
        //   type: 'date',
        //   admin: {
        //     readOnly: true
        //   }
        // },
        // {
        //   name: 'lastModified',
        //   label: 'Last Modified',
        //   type: 'date',
        //   admin: {
        //     readOnly: true
        //   }
        // },
      ],
    },
    {
      name: "purchases",
      label: "Purchases",
      type: "relationship",
      relationTo: "products",
      hasMany: true,
      hooks: {
        //   beforeChange: [resolveDuplicatePurchases],
      },
    },
    {
      name: "cancelOrders",
      label: "Cancel Order Times",
      type: "number",
      max: 2,
      defaultValue: 0,
    },
    { name: "isTrusted", label: "Is Trusted", type: "checkbox" },
  ],
};
