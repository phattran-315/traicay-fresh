"use client";
import { useState } from "react";
import { cn } from "@/lib/utils"
import { IoCreateOutline } from "react-icons/io5"
import UserNameForm from "./user-name-form"
import { IUser } from "@/types/common-types";

interface UserNameDetailProps extends IUser{
        
}
const UserNameDetail = ({user}:UserNameDetailProps) => {
  const userName=user?.name
  const [isExpanded, setIsExpanded] = useState(false);
  const isOpenAdjustName=Boolean(userName)
  const handleToggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };
  const handleOpenAdjustName=()=>{

  }
  return (
    <div className='flex gap'>
    <p data-cy='user-name-my-profile' className='min-w-[50px]'>Tên:</p>
    <div className='flex flex-col flex-1'>
      <div className="flex">
      <p
        data-cy='user-name-my-profile'
        className={cn(
          "font-bold whitespace-nowrap overflow-hidden text-ellipsis max-w-[150px] block",
          {
            "min-w-[150px]": userName,
          }
        )}
      >
        {userName}
      </p>
    
      <button
        data-cy='adjust-user-name-my-profile'
        onClick={handleToggleExpand}
        className='flex items-center gap-2'
      >
        <IoCreateOutline className='text-primary' />{" "}
        <span className='text-primary'>
          {!userName ? "Thêm tên của bạn" : "Sửa"}
        </span>{" "}
      </button>
      </div>
      <div className='flex gap-4'>
        {/* <div className='min-w-[50px]'>&nbsp;</div> */}
        {isExpanded && (
        <UserNameForm type={isOpenAdjustName?'adjust':'add-new'} user={user} onExpand={(state)=>setIsExpanded(state)}/>
        )}
      </div>
    </div>
  </div>
  )
}

export default UserNameDetail