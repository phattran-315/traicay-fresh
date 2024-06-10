import dotenv from "dotenv";
import path from "path";
import { s3Adapter } from "@payloadcms/plugin-cloud-storage/s3";
import { webpackBundler } from "@payloadcms/bundler-webpack";
import { mongooseAdapter } from "@payloadcms/db-mongodb";
// import nestedDocs from '@payloadcms/plugin-nested-docs'
// import redirects from '@payloadcms/plugin-redirects'
// import seo from '@payloadcms/plugin-seo'
// import type { GenerateTitle } from '@payloadcms/plugin-seo/types'
import { slateEditor } from "@payloadcms/richtext-slate";

import { buildConfig } from "payload/config";
import { Admins } from "./collection/admins.collection";
import { Customers } from "./collection/customers/customers.collection";
import { Products } from "./collection/products.collection";
import { Media } from "./collection/media.collection";
import { Reviews } from "./collection/review/reviews.collection";
import { Orders } from "./collection/orders.collection";
import { Otp } from "./collection/otp.collection";
import { CustomerPhoneNumber } from "./collection/customer-phone-number.collection";
import { Coupons } from "./collection/coupon.collection";
import { Feedback } from "./collection/feedback.collection";
import { cloudStorage } from "@payloadcms/plugin-cloud-storage";

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

const storageAdapter = s3Adapter({
  config: {
    credentials: {
      accessKeyId: process.env.AWS_S3_ACCESS_KEY!,
      secretAccessKey: process.env.AWS_S3_SECRET_KEY!,
    },
    region: process.env.AWS_S3_REGION!,
  },
  bucket: process.env.AWS_S3_BUCKET_NAME!,
});

export default buildConfig({
  routes: {
    admin: "/admins",
  },
  admin: {
    user: Admins.slug,
    autoLogin: true
      ? {
          email: "phatminh900@gmail.com",
          password: "Ch@vameo5",
          prefillOnly: true,
        }
      : false,
    bundler: webpackBundler(),

    meta: {
      titleSuffix: "- TraiCayFresh",
      favicon: "/favicon.ico",
      ogImage: "/thumbnail.jpg",
    },
  },

  rateLimit: {
    max: 3000,
  },
  editor: slateEditor({}),
  db: mongooseAdapter({
    url: process.env.DATABASE_URI!,
  }),
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  collections: [
    Admins,
    Products,
    Orders,
    Reviews,
    Customers,
    Media,
    Otp,
    CustomerPhoneNumber,
    Coupons,
    Feedback,
  ],
  upload: {
    limits: {
      fileSize: 5000000, // 5MB, written in bytes
    },
  },
  typescript: {
    outputFile: path.resolve(__dirname, "payload-types.ts"),
  },
  csrf: [
    "https://trai-cay-fresh.up.railway.app",
    // whitelist of domains to allow cookie auth from
    process.env.NEXT_PUBLIC_SERVER_URL!,
  ],

  plugins: [
    cloudStorage({
      collections: {
        media: {
          adapter: storageAdapter,
        },
      },
    }),
  ],
});
