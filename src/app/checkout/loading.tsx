import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const Loading = () => {
  return  <>
  <Skeleton className='w-[180px] h-10 mb-6' />
  <Skeleton className='w-[200px] h-10 mb-4' />
  <div className='gap-3 flex flex-col mb-8'>
    <div className='flex gap-2'>
      <Skeleton className='w-full h-10' />
      <Skeleton className='w-full h-10' />
    </div>
    <div className='flex gap-2'>
      <Skeleton className='w-full h-10' />
      <Skeleton className='w-full h-10' />
    </div>
    <Skeleton className='w-full h-10' />
    <Skeleton className='w-full h-10' />
  </div>
  <Skeleton className='w-12 h-4 mb-6' />
  <Skeleton className='w-full h-[110px] mb-6' />
  <Skeleton className='w-full h-20 mb-6' />
  <div className='flex mb-6 gap-2'>
    <Skeleton className='w-full h-10' />
    <Skeleton className='w-full h-10' />
  </div>
  <Skeleton className='w-12 h-4 mb-6' />
  <div className='flex flex-col gap-3'>
    <Skeleton className='w-[200px] h-10' />
    <Skeleton className='w-[200px] h-10' />
    <Skeleton className='w-[200px] h-10' />
  </div>
  <Skeleton className='w-12 h-4 mb-6' />
  <div className='flex flex-col gap-3 mb-6'>
    <div className='flex justify-between'>
      <Skeleton className='w-12 h-4' />
      <Skeleton className='w-8 h-4' />
    </div>
    <div className='flex justify-between'>
      <Skeleton className='w-12 h-4' />
      <Skeleton className='w-8 h-4' />
    </div>
    <div className='flex justify-between'>
      <Skeleton className='w-12 h-4' />
      <Skeleton className='w-8 h-4' />
    </div>
  </div>
  <Skeleton className='w-full h-10' />
</>
};

export default Loading;
