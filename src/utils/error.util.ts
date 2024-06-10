import { toast } from "sonner";
import { ZodError } from "zod";
import { GENERAL_ERROR_MESSAGE } from "@/constants/app-message.constant";
import type { TRPCClientErrorLike } from "@trpc/client";
import { AnyTRPCClientTypes, TRPCError } from "@trpc/server";
export const handleTrpcErrors = (
  error: TRPCClientErrorLike<AnyTRPCClientTypes>
) => {
  console.error(error);
  
  if (
    error.data?.code === "CONFLICT" ||
    error.data?.code === "BAD_REQUEST" ||
    error.data?.code === "NOT_FOUND"
  ) {
    toast.error(error.message);

    return;
  }
  if (error instanceof ZodError) {
    toast.error(error.issues[0].message);
    return;
  }
  if (error.message) {
    toast.error(error.message);
    return;
  }

  toast.error(GENERAL_ERROR_MESSAGE);
};
