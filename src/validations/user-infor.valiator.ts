import { z } from "zod";
import { SignUpCredentialSchema } from "./auth.validation";
import {
  INVALID_PHONE_NUMBER_TYPE,
  INVALID_STREET_TYPE,
  REQUIRED_DISTRICT,
  REQUIRED_WARD,
} from "../constants/validation-message.constant";

// export const PhoneValidationSchema = z.object({
//   phoneNumber: z
//     .string()
//     .regex(
//      new RegExp("^(84|\\+84)?(3[2-9]|5[6-9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$"),
//       // /(84[3|5|7|8|9])+([0-9]{8})\b/g,
//       "Vui lòng nhập đúng định dạng số điện thoại di ban"
//     )
//     .trim(),
// });
export const PhoneValidationSchema = z.object({
  phoneNumber: z.string().refine(
    (value) =>
      // the regexp of zod seems not working
      /^(0|84|\+84)?(3[2-9]|5[6-9]|7[0|6-9]|8[1-9]|9[0-9])[0-9]{7}$/.test(
        value
      ),
    INVALID_PHONE_NUMBER_TYPE
  ),
});
export const AddressValidationSchema = z
  .object({
    district: z.string().min(5, REQUIRED_DISTRICT).trim(),

    ward: z.string().min(5, REQUIRED_WARD).trim(),
    street: z
      .string()
      .regex(
        new RegExp(/^[0-9]+(\/[0-9]+)?(\s+[A-Za-zÀ-ỹ\s\d-]+)+$/),
        INVALID_STREET_TYPE
      )
      .trim(),
  })
  .merge(PhoneValidationSchema)
  .merge(SignUpCredentialSchema.pick({ name: true }));

export type IAddressValidation = z.infer<typeof AddressValidationSchema>;
export type IPhoneNumberValidation = z.infer<typeof PhoneValidationSchema>;
