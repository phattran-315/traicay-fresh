import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const OrderSpecificSkeleton = () => {
  return (
    <>
      <div className='flex flex-col gap-4'>
        <Skeleton className='w-full h-20' />
        <Skeleton className='w-full h-24' />
        <Skeleton className='w-full h-20' />
        <Skeleton className='w-full h-28' />
        <Skeleton className='w-full h-44' />
      </div>
      <div className='flex flex-col gap-2'>
        <Skeleton className='w-full h-10' />
        <Skeleton className='w-full h-10' />
      </div>
    </>
  );
};

export default OrderSpecificSkeleton;
