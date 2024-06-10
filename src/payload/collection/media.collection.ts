import dotenv from "dotenv";
import path from "path";

import { CollectionConfig } from "payload/types";
import { isAdmins } from "../access/isAdmin";

dotenv.config({
  path: path.resolve(__dirname, "../../../.env"),
});
export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: () => true,
    update: isAdmins,
    delete: isAdmins,
    create: ()=>true,
  },
  hooks: {
   
  },
  upload: {
    staticURL: '/media',
    staticDir: 'media',
    disableLocalStorage: true,
    
    imageSizes: [
      {
        name: 'thumbnail',
        width: 400,
        height: 300,
        crop: 'center'
      },
      {
        name: 'card',
        width: 768,
        height: 1024,
        crop: 'center'
      },
      {
        name: 'tablet',
        width: 1024,
        height: undefined,
        crop: 'center'
      }
    ],
    
    adminThumbnail: ({ doc }) =>{
      return   `https://my-app-buckets.s3.ap-southeast-2.amazonaws.com/${doc.filename}`
    }
    ,
  
    mimeTypes: ["image/*"],
  },
  
  fields: [
    { 
      name: "alt",
      label: "Alt",
      type: "text",
      required: true,
    },
    {
      name: 'url',
      type: 'text',
      access: {
        create: () => false,
      },
     
      hooks: {
        afterRead: [
          ({ data: doc }) =>{
            if(doc){
           
            return `${process.env.NEXT_PUBLIC_AWS_S3_ENDPOINT}/${doc.filename}`
            
            }
          }
        ],
      },
    },
  ],

};
