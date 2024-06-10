import express from "express";
import { getPayloadClient } from "../../payload/get-client-payload";
import { verifyToken } from "../../utils/auth.util";
import { signToken } from "../../utils/server/auth.util";
const router = express.Router();

router.post("/refresh-token", async (req, res) => {
  try {
    const payload = await getPayloadClient();
    const { userId } = req.body;
    const refreshToken = (
      await payload.findByID({
        collection: "customer-phone-number",
        id: (userId as string) || "",
      })
    )?.refreshToken;
    const isVerified = await verifyToken(refreshToken || "");
    if ("code" in isVerified) {
      throw new Error();
    }

    if ("userId" in isVerified) {
      const newToken = await signToken(isVerified.userId);
      const expires = new Date(+(isVerified.exp as number) * 1000);

      return res.status(200).json({ok:true, token: newToken, expires });
    }
  } catch (error) {
    // not able to go in caches ???
    return res.status(400).json({ok:false})
  }
});
export default router