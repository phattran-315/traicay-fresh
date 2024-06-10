"use client";
import { IUser } from "@/types/common-types";
import { useState } from "react";
import AddAdjustPhoneNumber from "../add-adjust-phone-number";
import UserPhoneNumberList from "./user-phone-number-list";
import { isEmailUser } from "@/utils/util.utls";

export interface UserPhoneNumberProps extends IUser {}
const UserPhoneNumber = ({ user }: UserPhoneNumberProps) => {
  const phoneNumbers = user?.phoneNumbers;
  const [expandedIndex, setExpandedIndex] = useState(-1);
  const handleExpand = (index: number) => {
    setExpandedIndex(index);
  };

  const handleExpandIndex = (index: number) => setExpandedIndex(index);
  const userPhoneNumber = !isEmailUser(user!) && (
    <p className='font-bold'>{user!.phoneNumber}</p>
  );
  if (userPhoneNumber && !phoneNumbers?.length) {
    return (
      <div>
        <div className='flex gap'>
          <p className='min-w-[50px]'>SĐT</p>
          <div data-cy='user-phone-number-detail' className='flex flex-col gap'>
            {userPhoneNumber}
            <span className='font-bold text-xs'>(Mặc định)</span>
          </div>
        </div>
        <AddAdjustPhoneNumber
          user={user}
          key={expandedIndex}
          index={phoneNumbers?.length || 0}
          isExpanded={phoneNumbers?.length === expandedIndex}
          onExpand={handleExpand}
          phoneCount={phoneNumbers?.length || 0}
          type='add-new'
        />
      </div>
    );
  }
  return (
    <div>
      {(phoneNumbers?.length || 0) > 0 ? (
        <>
          <div className='flex gap'>
            <p className='min-w-[50px]'>SĐT</p>
            {Array.isArray(phoneNumbers) && (
              <UserPhoneNumberList
                user={user}
                phoneNumbers={phoneNumbers}
                expandedIndex={expandedIndex}
                onExpand={handleExpandIndex}
              />
            )}
          </div>
          {Array.isArray(phoneNumbers) && (
            <AddAdjustPhoneNumber
              user={user}
              key={expandedIndex}
              index={phoneNumbers?.length || 0}
              isExpanded={phoneNumbers?.length === expandedIndex}
              onExpand={handleExpand}
              phoneCount={phoneNumbers?.length || 0}
              type='add-new'
            />
          )}
        </>
      ) : Array.isArray(phoneNumbers) ? (
        <div className='flex w-full flex-col gap-2 items-start mt-2'>
          <p data-cy='no-phone-number-added-my-profile'>
            Bạn chưa thêm số điện thoại{" "}
          </p>
          <AddAdjustPhoneNumber
            user={user}
            index={0}
            isExpanded={0 === expandedIndex}
            onExpand={handleExpand}
            phoneCount={0}
            type='add-new'
          />
        </div>
      ) : null}
    </div>
  );
};

export default UserPhoneNumber;
