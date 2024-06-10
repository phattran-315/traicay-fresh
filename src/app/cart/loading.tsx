import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return (
    <>
      <div className='flex flex-col gap-6 mb-8'>
        <Skeleton className='w-full h-[110px]' />
        <Skeleton className='w-full h-[110px]' />
        <Skeleton className='w-full h-[110px]' />
      </div>
      <Skeleton className='w-12 h-6 mb-4' />
      <Skeleton className='w-14 h-6 mb-6' />
      <Skeleton className='w-[150px] h-10' />
    </>
  );
};

export default Loading;
