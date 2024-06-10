import { AppRouterInstance } from "next/dist/shared/lib/app-router-context.shared-runtime";
import { toast } from "sonner";

export const handleTrpcSuccess = (
  router: AppRouterInstance,
  message?: string
) => {
  router.refresh();
  toast.success(message);
};
