"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { trpc } from "@/trpc/trpc-client";
import { handleTrpcErrors } from "@/utils/error.util";
import { SignUpCredentialSchema } from "@/validations/auth.validation";
import { zodResolver } from "@hookform/resolvers/zod";


import ErrorMsg from "@/app/(auth)/_component/error-msg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { IUser } from "@/types/common-types";
import { handleTrpcSuccess } from "@/utils/success.util";
import { isEmailUser } from "@/utils/util.utls";
import { useEffect } from "react";
import useDisableClicking from "@/hooks/use-disable-clicking";
interface UserNameFormProps extends IUser {
  onExpand: (state: boolean) => void;
  type?:'adjust'|'add-new'
}
const UserNameForm = ({type='add-new', user, onExpand }: UserNameFormProps) => {
  const {handleSetMutatingState}=useDisableClicking()
  const router = useRouter();
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<{ name: string }>({
    defaultValues: { name: user?.name || "" },
    resolver: zodResolver(SignUpCredentialSchema.pick({ name: true })),
  });

  const { isPending: isChangingUserName, mutateAsync: changeUserName } =
    trpc.user.changeUserName.useMutation({
     
      onSuccess: (data) => {
        handleTrpcSuccess(router,data?.message)
      },
    });

  const {
    isPending: isAddingUserName,
    mutateAsync: changeUserNamePhoneNumber,
  } = trpc.customerPhoneNumber.changeUserName.useMutation({
    onSuccess(data) {
      router.refresh();
      toast.success(data?.message);
    },
  });
  const handleChangeUserName = handleSubmit(async ({ name }) => {
    if (name === user?.name) return;
    if (!user) return;
    // normal login by email
    if (isEmailUser(user)) {
      await changeUserName({ name }).catch(err=>handleTrpcErrors(err));
      onExpand(false);
    }
    if (!(isEmailUser(user))) {
      await changeUserNamePhoneNumber({ name }).catch(err=>handleTrpcErrors(err));
      onExpand(false);
    }
  });

  const handleAddUserName = handleSubmit(async ({ name }) => {
    if (!name) return;
    if (name === user?.name) return;
    await changeUserNamePhoneNumber({ name }).catch(err=>handleTrpcErrors(err));;
    onExpand(false);
    router.refresh();
  });
  const isMutating=isChangingUserName||isAddingUserName
  useEffect(() => {
    if (isMutating) {
      handleSetMutatingState(true);
    }
    if (!isMutating) {
      handleSetMutatingState(false);
    }
  }, [isMutating, handleSetMutatingState]);
  return (
    <form
      data-cy='user-name-form-my-profile'
      onSubmit={!user?.name ? handleAddUserName : handleChangeUserName}
      className='my-4 w-full fade-in-15'
    >
      <Input
      className={cn({
        'bg-slate-200':type==='adjust'
      })}
       error={errors.name}
        {...register("name")}
      />
      {errors.name && <ErrorMsg msg={errors.name.message} />}
      <div className='mt-4 flex gap-3'>
        <Button
          disabled={isChangingUserName || isAddingUserName}
          className='flex-1'
        >
          {isChangingUserName ? "Đang thay đổi..." : "Xác nhận"}
        </Button>
        <Button
          onClick={() => onExpand(false)}
          disabled={isChangingUserName || isAddingUserName}
          type='button'
          className='flex-1'
          variant='destructive'
        >
          Hủy
        </Button>
      </div>
    </form>
  );
};

export default UserNameForm;
