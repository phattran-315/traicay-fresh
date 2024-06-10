
import z from "zod";
export const MAX_FILE_SIZE = 1024 * 1024 * 5;
const ACCEPTED_IMAGE_MIME_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];
const ACCEPTED_IMAGE_TYPES = ["jpeg", "jpg", "png", "webp"];
export const imageSchema = z.object({
  img: z
    .any()
    .refine((file) => {
       return file?.size <= MAX_FILE_SIZE;
    }, `Vui lòng gửi ảnh có dung lượng dưới  5MB.`)
    .refine(
      (file) => ACCEPTED_IMAGE_MIME_TYPES.includes(file?.type),
      "Chỉ có file với .jpg, .jpeg, .png and .webp được hỗ trợ"
    ),
});

export const imagesSchema = z.object({
  imgs: z
    .array(z.any())
    .refine((files:File[]) => {
       return files.every((file)=> file.size <= MAX_FILE_SIZE)
    }, `Vui lòng gửi ảnh có dung lượng dưới  5MB.`)
    .refine(
      (files:File[]) => files.every((file)=>ACCEPTED_IMAGE_MIME_TYPES.includes(file?.type)),
      "Chỉ có file với .jpg, .jpeg, .png and .webp được hỗ trợ"
    ).optional()
})
 export type IImageSchema = z.infer<typeof imageSchema>;
 export type IImagesSchema = z.infer<typeof imagesSchema>;