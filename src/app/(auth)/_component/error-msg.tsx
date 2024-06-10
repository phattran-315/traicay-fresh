import { IAuthCredential } from "@/validations/auth.validation";

const ErrorMsg = ({
  msg,
  field,
}: {
  field?: keyof IAuthCredential;
  msg?: string;
}) => {
  return (
    <p data-cy='form-error-msg' className='text-sm font-semi-bold text-red-500 mt-2'>
      {msg === "Required" ? `Vui lòng nhập ${field}` : msg}
    </p>
  );
};
export default ErrorMsg;
