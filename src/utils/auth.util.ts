import { JWTPayload, jwtVerify } from "jose";
export enum ERROR_JWT_CODE {
  "ERR_JWS_INVALID" = "ERR_JWS_INVALID",
  "ERR_JWT_EXPIRED" = "ERR_JWT_EXPIRED",
}
interface JWTPayloadVerified extends Omit<JWTPayload, "code"> {
  // Other relevant properties...
}
export const verifyToken = async (
  token: string
): Promise<
  (JWTPayloadVerified & { userId: string }) | { code: ERROR_JWT_CODE }
> => {
  try {
    const verified = await jwtVerify(
      token,
      new TextEncoder().encode(process.env.JWT_SECRET)
    );
    const payload = verified.payload as unknown as JWTPayloadVerified & {
      userId: string;
    };
    return payload;
  } catch (error) {
    const { code } = error as { code: ERROR_JWT_CODE };
    return { code }; // Return error code
  }
};
