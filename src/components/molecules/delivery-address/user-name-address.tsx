import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { DeliveryAddressProps } from ".";
import { FieldError } from "react-hook-form";
interface UserNameAddressProps extends Pick<DeliveryAddressProps, "onSetName"> {
  defaultValue?: string;
  error?: FieldError;
}
let init = true;
const UserNameAddress = ({
  error,
  defaultValue,
  onSetName,
}: UserNameAddressProps) => {
  const [name, setName] = useState(defaultValue || "");
  useEffect(() => {
    if (defaultValue && init) {
      init = false;
      onSetName(defaultValue);
    }
  }, [defaultValue, onSetName]);
  return (
    <div className='flex-1'>
      <Input
        data-cy='user-name-address-input'
        placeholder='Họ và tên'
        error={error}
        id='name'
        value={name}
        onChange={(e) => {
          const value = e.target.value;
          setName(value);
          onSetName(value);
        }}
      />
    </div>
  );
};

export default UserNameAddress;
