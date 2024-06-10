import { useCallback, useState } from "react";

const useCheckPasswordAndPasswordConfirm = () => {
  const [
    isPasswordAndPasswordConfirmSame,
    setIsPasswordAndPasswordConfirmSame,
  ] = useState(true);

  const comparePasswordAndPasswordConfirm = useCallback(
    ({
      password,
      passwordConfirm,
    }: {
      password: string;
      passwordConfirm: string;
    }) => {
      
      password === passwordConfirm
        ? setIsPasswordAndPasswordConfirmSame(true)
        : setIsPasswordAndPasswordConfirmSame(false);
    },
    []
  );
  return {
    comparePasswordAndPasswordConfirm,
    isPasswordAndPasswordConfirmSame,
  };
};

export default useCheckPasswordAndPasswordConfirm;
