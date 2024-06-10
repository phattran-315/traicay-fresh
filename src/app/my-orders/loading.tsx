import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const MyOrderPageLoading = () => {
  return (
    <div className='flex flex-col gap-6'>
      {/* <Skeleton className='w-[250px] h-4 mb-6' />
      <Skeleton className='w-[250px] h-4 mb-6' /> */}

      <Skeleton className='w-full h-[250px]' />
      <Skeleton className='w-full h-[250px]' />
      <Skeleton className='w-full h-[250px]' />
    </div>
  );
};

export default MyOrderPageLoading;
