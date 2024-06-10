import { SignJWT } from "jose";
import { v4 as uuidv4 } from "uuid";

export const signToken = async (userId: string) => {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setJti(uuidv4())
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_EXPIRATION_TIME!)
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));
  return token;
};


export const signRefreshToken = async (userId: string) => {
  const token = await new SignJWT({ userId })
    .setProtectedHeader({ alg: "HS256" })
    .setJti(uuidv4())
    .setIssuedAt()
    .setExpirationTime(process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME!)
    .sign(new TextEncoder().encode(process.env.JWT_SECRET));
  return token;
};
