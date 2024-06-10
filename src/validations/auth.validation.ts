import {
  INVALID_EMAIL_TYPE,
  INVALID_NAME,
  INVALID_PASSWORD_CONFIRM_TYPE,
  REQUIRED_EMAIL,
  REQUIRED_NAME,
  REQUIRED_PASSWORD,
  REQUIRED_PASSWORD_CONFIRM,
} from "../constants/validation-message.constant";
import { z } from "zod";

export const AuthCredentialSchema = z.object({
  email: z.string().email(INVALID_EMAIL_TYPE).min(1, REQUIRED_EMAIL).trim(),
  password: z
    .string()
    .min(6, { message: REQUIRED_PASSWORD })
    .regex(
      new RegExp(/^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/),
      INVALID_PASSWORD_CONFIRM_TYPE
    ),
});

export const SignUpCredentialSchema = AuthCredentialSchema.extend({
  name: z
    .string()
    .min(2, INVALID_NAME)
    .trim()
    .regex(new RegExp(/^[a-zA-ZÀ-ỹ]+(?:[\s-][a-zA-ZÀ-ỹ]+)*$/), REQUIRED_NAME),
  passwordConfirm: z
    .string()
    .min(6, { message: REQUIRED_PASSWORD_CONFIRM })
    .regex(
      new RegExp(/^(?=.*\d)(?=.*[a-zA-Z]).{6,}$/),
      INVALID_PASSWORD_CONFIRM_TYPE
    ),
});
export type IAuthCredential = z.infer<typeof AuthCredentialSchema>;
export type ISignUpCredential = z.infer<typeof SignUpCredentialSchema>;
