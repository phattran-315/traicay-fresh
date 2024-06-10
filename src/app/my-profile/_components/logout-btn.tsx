"use client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { logOutUser } from "@/services/auth.service";
import { toast } from "sonner";
import { trpc } from "@/trpc/trpc-client";
import { IUser } from "@/types/common-types";
import { GENERAL_ERROR_MESSAGE } from "@/constants/app-message.constant";
import { isEmailUser } from "@/utils/util.utls";
import useDisableClicking from "@/hooks/use-disable-clicking";
import { useEffect } from "react";

interface LogoutProps extends IUser {}
const Logout = ({ user }: LogoutProps) => {
  const {handleSetMutatingState}=useDisableClicking()
  const router = useRouter();
  function notifyUserLogoutSuccessfully() {
    setTimeout(() => {
      toast.success("Đăng xuất tài khoản thành công");
      router.refresh();
    }, 200);
  }
  const { mutateAsync: logOutUserPhoneNumber, isPending } =
    trpc.customerPhoneNumber.logOut.useMutation();

  const logout = async () => {
    // if user has email ==> payload user ==> signup by email
    if (user && isEmailUser(user!)) {
      await logOutUser().catch((err) => toast.error(GENERAL_ERROR_MESSAGE));
      notifyUserLogoutSuccessfully();
    }
    if (user && !(isEmailUser(user!))) {
      await logOutUserPhoneNumber().catch(() =>
        toast.error(GENERAL_ERROR_MESSAGE)
      );
      notifyUserLogoutSuccessfully();
    }
  };
  useEffect(() => {
    if (isPending) {
      handleSetMutatingState(true);
    }
    if (!isPending) {
      handleSetMutatingState(false);
    }
  }, [isPending, handleSetMutatingState]);
  return (
    <Button disabled={isPending} onClick={logout} variant='ghost'>
      Đăng xuất
    </Button>
  );
};

export default Logout;
