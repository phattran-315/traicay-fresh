import { z } from "zod";
import { getPayloadClient } from "../../payload/get-client-payload";
import { publicProcedure, router } from "../trpc";
import { throwTrpcInternalServer } from "../../utils/server/error-server.util";

const ProductRouter = router({
  getProductsPrice: publicProcedure
    .input(z.object({ ids: z.array(z.string()) }))
    .query(async ({ input }) => {
      try {
        const payload = await getPayloadClient();
        const { ids } = input;
        const { docs: products } = await payload.find({
          collection: "products",
          where: {
            id: { in: ids },
          },
        });
        return products;
      } catch (error) {
        throwTrpcInternalServer(error);
      }
    }),
  getProducts: publicProcedure.query(async () => {
    try {
      const payload = await getPayloadClient();
      const { docs: products } = await payload.find({ collection: "products" });
      return { products };
    } catch (error) {
      throwTrpcInternalServer(error);
    }
  }),
  
});
export default ProductRouter;
