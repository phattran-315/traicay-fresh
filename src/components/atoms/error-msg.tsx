import { cn } from "@/lib/utils";
import { IAuthCredential } from "@/validations/auth.validation";
interface ErrorMsgProps {
  field?: keyof IAuthCredential;
  msg?: string;
  className?: string;
}

const ErrorMsg = ({className, msg, field }: ErrorMsgProps) => {
  return (
    <p
      data-cy='form-error-msg'
      className={cn(
        "text-sm font-semi-bold text-red-500 mt-2",
        className
      )}
    >
      {msg === "Required" ? `Vui lòng nhập ${field}` : msg}
    </p>
  );
};
export default ErrorMsg;
