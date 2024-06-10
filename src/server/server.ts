import dotenv from "dotenv";
import next from "next";
import { Express, Request, Response, NextFunction } from "express";

import * as trpcExpress from "@trpc/server/adapters/express";
import nextBuild from "next/dist/build";
import path from "path";

dotenv.config({
  path: path.resolve(__dirname, "../../.env"),
});

import express from "express";
import payload from "payload";
import { appRouter } from "../trpc";
import { createContext } from "../trpc/context";
import { GENERAL_ERROR_MESSAGE } from "../constants/api-messages.constant";
import { protect } from "./middlewares/auth.middleware";
import VnpayRouter from "./routers/vn-pay.router";
import refreshTokenRouter from "./routers/refresh-token.router";

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());
const start = async (): Promise<void> => {
  await payload.init({
    secret: process.env.PAYLOAD_SECRET || "",
    express: app,
    onInit: () => {
      payload.logger.info(`Payload Admin URL: ${payload.getAdminURL()}`);
    },
  });

  if (process.env.NEXT_BUILD) {
    app.listen(PORT, async () => {
      payload.logger.info(`Next.js is now building...`);
      // @ts-expect-error
      await nextBuild(path.join(__dirname, "../"));
      process.exit();
    });

    return;
  }

  const nextApp = next({
    dev: process.env.NODE_ENV !== "production",
  });

  const nextHandler = nextApp.getRequestHandler();
  // const limiter = rateLimit({
  //   windowMs:  30 * 1000, // 15 minutes
  //   max: 3, // limit each IP to 100 requests per window
  //   handler:(req,res)=>{
  //     res.status(429).json({
  //       message:"Too many requests try again later"
  //     })
  //   }
  // });
  // limit the rate limit for applying coupon
  // TODO: add auth for refresh token
  app.use("/api", refreshTokenRouter);
  app.use("/verify-momo-payment-success", (req, res) => {
    const transactionInfo = req.body;
    console.log("--------");
    console.log(transactionInfo);

    // TODO: Xác minh thông tin giao dịch tại đây

    // Phản hồi Momo với status code 200
    res.sendStatus(200);
  });
  // TODO: helmet xss

  app.use(VnpayRouter);

  app.use(
    "/api/trpc",
    trpcExpress.createExpressMiddleware({
      router: appRouter,
      createContext,
    })
  );

  app.use((req, res) => nextHandler(req, res));
  // app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  //   return res.status(500).json({
  //     status: "fail",
  //     message: GENERAL_ERROR_MESSAGE,
  //   });
  // });

  nextApp.prepare().then(() => {
    payload.logger.info("Starting Next.js...");

    app.listen(PORT, async () => {
      payload.logger.info(
        `Next.js App URL: ${process.env.NEXT_PUBLIC_SERVER_URL}`
      );
    });
  });
};

start();
