import {
  AuthCredentialSchema,
  SignUpCredentialSchema,
} from "../../validations/auth.validation";
import dotenv from "dotenv";
import { Resend } from "resend";
import { privateProcedure, publicProcedure, router } from "../trpc";
import { TRPCError } from "@trpc/server";
import { getPayloadClient } from "../../payload/get-client-payload";
import { z } from "zod";
import { AUTH_MESSAGE } from "../../constants/api-messages.constant";
import { throwTrpcInternalServer } from "../../utils/server/error-server.util";
import path from "path";
import { APP_URL } from "../../constants/navigation.constant";

dotenv.config({ path: path.resolve(__dirname, "../../../.env") });
const resend = new Resend(process.env.RESEND_API_KEY!);

// PREVENT LOGIN TOO MUCH
const AuthRouter = router({
  signUp: publicProcedure
    .input(SignUpCredentialSchema)
    .mutation(async ({ input }) => {
      const { email, password, passwordConfirm, name } = input;
      try {
        if (password !== passwordConfirm) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Mật khẩu và xác nhận mật khẩu không giống nhau",
          });
        }
        const payload = await getPayloadClient();
        const { docs: customers } = await payload.find({
          collection: "customers",
          where: {
            email: {
              equals: email,
            },
          },
        });
        if (customers.length) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Email này đã đăng kí rồi. Thử đăng nhập lại nhé.",
          });
        }
        const user = await payload.create({
          collection: "customers",
          showHiddenFields: true,
          data: {
            email,
            password,
            name,
          },
        });
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/${APP_URL.verifyEmail}?token=${user._verificationToken}`;

        const emailResult = await resend.emails.send({
          from: process.env.RESEND_API_EMAIL_FROM!,
          to: email,
          subject: "Đăng kí tài khoản tại TraiCayFresh",
          html: `
      <!DOCTYPE html>
      <html>
        <body>
          <h2>Xin chào ${user.name},</h2>
          <p>Cảm ơn bạn đã đăng kí tài khoản tại TraiCayFresh. Vui lòng xác thực tài khoản của bạn bằng cách nhấp vào link liên kết bên dưới.</p>
          <a href="${url}" style="background-color: #22C55E; color: black; padding: 14px 20px; text-align: center; text-decoration: none; display: inline-block;">Xác thực Email</a>
          <p>Nếu bạn không thực hiện hành động này, bạn có thể bỏ qua email này.</p>
          <p>Xin cảm ơn,</p>
          <p>TraiCayFresh</p>
        </body>
      </html>
    `,
        });
        console.log(emailResult);
        return { success: true, emailSentTo: email };
      } catch (error) {
        console.log(error);
        throw error;
      }
    }),
  login: publicProcedure
    .input(AuthCredentialSchema)
    .mutation(async ({ input, ctx }) => {
      const { email, password } = input;
      const { res } = ctx;

      const payload = await getPayloadClient();
      const { docs } = await payload.find({
        collection: "customers",
        where: {
          email: {
            equals: email,
          },
          _verified: {
            equals: false,
          },
        },
      });
      if (docs.length) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Vui lòng xác nhận email.",
        });
      }
      try {
        await payload.login({
          collection: "customers",
          data: {
            email,
            password,
          },
          res,
        });
        return { success: true, message: "Đăng nhập thành công" };
      } catch (err) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Tài khoản hoặc mật khẩu sai.",
        });
      }
    }),
  verifyEmail: publicProcedure
    .input(z.object({ token: z.string() }))
    .query(async ({ input }) => {
      const { token } = input;
      if (!token) return;
      try {
        const payload = await getPayloadClient();

        const isVerified = await payload.verifyEmail({
          collection: "customers",
          token,
        });

        if (!isVerified)
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: AUTH_MESSAGE.INVALID_EMAIL_TOKEN,
          });
        return { success: true };
      } catch (error) {
        throw error;
      }
    }),
  forgotPassword: publicProcedure
    .input(z.object({ email: z.string().email() }))
    .mutation(async ({ input }) => {
      const { email } = input;

      try {
        const payload = await getPayloadClient();
        const result = await payload.forgotPassword({
          collection: "customers",
          data: { email },
        });
        const url = `${process.env.NEXT_PUBLIC_SERVER_URL}/${APP_URL.resetPassword}?token=${result}`;

        await resend.emails.send({
          from: process.env.RESEND_API_EMAIL_FROM!,
          to: email,
          subject: "Đặt lại mật khẩu TraiCayFresh",
          html: `
          <!DOCTYPE html>
          <html>
            <body>
              <h2>Xin chào ${email},</h2>
              <p>Vui lòng nhấp vào link bên dưới để đổi lại mật khấu</p>
              <a href="${url}" style="background-color: #22C55E; color: black; padding: 14px 20px; text-align: center; text-decoration: none; display: inline-block;">Đặt lai mật khẩu</a>
  
              <p>Xin Cảm ơn,</p>
              <p>TraiCayFresh</p>
            </body>
          </html>
            `,
        });
        return {
          success: true,
          message: AUTH_MESSAGE.SUCCESS_SEND_RESET_PASSWORD,
        };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Link yêu cầu đổi mật khẩu có thể hết hạn hoặc không đúng vui lòng kiểm tra lại email hoặc yêu cầu gửi lại mã xác nhận",
        });
      }
    }),
  resetPassword: publicProcedure
    .input(
      SignUpCredentialSchema.pick({
        password: true,
        passwordConfirm: true,
      }).extend({ token: z.string() })
    )
    .mutation(async ({ input }) => {
      const { password, passwordConfirm, token } = input;
      if (password !== passwordConfirm) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Mật khẩu và xác nhận mật khẩu không giống nhau",
        });
      }
      try {
        const payload = await getPayloadClient();
        await payload.resetPassword({
          collection: "customers",
          data: { password, token },
          overrideAccess: true,
        });
        return { success: true, message: "Thay đổi mật khẩu thành công" };
      } catch (error) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message:
            "Link yêu cầu đổi mật khẩu có thể hết hạn hoặc không đúng vui lòng kiểm tra lại email hoặc yêu cầu gửi lại mã xác nhận",
        });
      }
    }),

  // TODO: ask Nguyen
  checkIfEmailExist: publicProcedure
    .input(AuthCredentialSchema.pick({ email: true }))
    .mutation(async ({ input }) => {
      const { email } = input;

      try {
        const payload = await getPayloadClient();
        const { docs } = await payload.find({
          collection: "customers",
          where: {
            email: {
              equals: email,
            },
          },
        });
        if (!docs.length)
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Email chưa được đăng kí. Đăng kí ngay nhé",
          });
        return { success: true, email };
      } catch (error) {
        throwTrpcInternalServer(error);
      }
    }),
});

export default AuthRouter;
