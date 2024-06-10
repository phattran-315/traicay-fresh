import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

const Loading = () => {
  return (
    <>
      <div className='flex justify-center mb-6 gap-4'>
        <Skeleton className='w-5 h-5' />
        <Skeleton className='w-10 h-5' />
      </div>
      <Skeleton className='w-full h-6 mb-8' />
      <Skeleton className='w-full h-80 mb-8' />
      <Skeleton className='w-full h-16 mb-4' />
      <Skeleton className='w-12 h-10' />
    </>
  );
};

export default Loading;
