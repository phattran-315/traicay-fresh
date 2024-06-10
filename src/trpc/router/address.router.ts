import path from "path";

import { z } from "zod";
import dotenv from "dotenv";
import { throwTrpcInternalServer } from "../../utils/server/error-server.util";
import { IDistrict, IWard } from "../../types/service.type";
import { publicProcedure, router } from "../trpc";
dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
const AddressRouter = router({
  getHcmDistricts: publicProcedure.query(async () => {
    try {
      const response = await fetch(
        `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/district`,
        {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            Token: process.env.GHN_TOKEN!,
          },
          body: JSON.stringify({ province_id: 202 }),
        }
      );
      if (!response.ok) {
        throw Error();
      }
      const result: { message: string; data: IDistrict[] } =
        await response.json();

      return { success: true, districts: result.data };
    } catch (error) {
      throwTrpcInternalServer(error);
    }
  }),
  getHcmWards: publicProcedure
    .input(z.object({ districtId: z.number() }))
    .query(async ({ input }) => {
      const { districtId } = input;
      try {
        const response = await fetch(
          `https://dev-online-gateway.ghn.vn/shiip/public-api/master-data/ward`,
          {
            method: "POST",
            headers: {
              "Content-type": "application/json",
              Token: process.env.GHN_TOKEN!,
            },
            cache: "no-store",
            body: JSON.stringify({ district_id: districtId }),
          }
        );
        if (!response.ok) {
          throw Error();
        }
        const result: { message: string; data: IWard[] } =
          await response.json();
        return { success: true, wards: result.data };
      } catch (error) {
        throwTrpcInternalServer(error);
      }
    }),
});
export default AddressRouter;
