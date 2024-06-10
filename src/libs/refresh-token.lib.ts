import "server-only";
import { NextRequest, NextResponse } from "next/server";

import {
    COOKIE_USER_PHONE_NUMBER_TOKEN
} from "../constants/configs.constant";
import { decodeJwt } from "jose";
export const refreshUserToken = async (req:NextRequest) => {
  const res = NextResponse.next();
      try {
       
        const userToken = req.cookies.get(COOKIE_USER_PHONE_NUMBER_TOKEN)?.value;
        if (!userToken) return;
        const jwtPayload = decodeJwt(userToken);
        const userId = jwtPayload?.userId;
        const refreshTokenResponse=await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL!}/api/refresh-token`,{
            method:"POST",
            headers:{
                "Content-Type":'application/json',
            },
            body:JSON.stringify({userId})
        })
        const data=await refreshTokenResponse.json()
        if(data.ok&& data?.token && data?.expires){
         res.cookies.set({
          name:COOKIE_USER_PHONE_NUMBER_TOKEN,value:data.token,
          secure:true,
          httpOnly:true,
          // expires:data?.expires
         })
        return res;

        }
        if(!data.ok){throw new Error()}
      } catch (error) {
        res.cookies.delete(COOKIE_USER_PHONE_NUMBER_TOKEN);
      } finally {
        return res;
      }
    };