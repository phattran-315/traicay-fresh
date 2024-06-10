import { IUser } from "@/types/common-types";
import { isEmailUser } from "@/utils/util.utls";
import React from "react";
interface UserEmail extends IUser {}
const UserEmail = ({ user }: UserEmail) => {
  return (
    <div
      data-cy='email-my-profile'
      className='min-w-[200px] max-w-[250px] md:max-w-[350px] whitespace-nowrap overflow-hidden text-ellipsis'
    >
      {user && isEmailUser(user) && (
        <>
          Email: <span className='font-bold'>{user!.email}</span>
        </>
      )}
    </div>
  );
};

export default UserEmail;
