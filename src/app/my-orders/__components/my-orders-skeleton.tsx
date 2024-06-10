import { Skeleton } from '@/components/ui/skeleton'
import React from 'react'

const MyOrdersSkeleton = () => {
  return (
    <div className='grid grid-cols-[200px_1fr] h-screen gap-12'>
        <Skeleton className='h-full'/>
        <Skeleton className='h-full' />
    </div>
  )
}

export default MyOrdersSkeleton