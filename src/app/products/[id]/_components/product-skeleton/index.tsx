import { Skeleton } from "@/components/ui/skeleton";

const ProductSkeleton = () => {
  return (
    <div>
      <Skeleton className='w-60 h-8 mb-2' />
      <Skeleton className='w-64 h-6 mb-6' />
      <Skeleton className='w-full h-[250px] mb-2' />
      <div className='flex justify-center'>
        <Skeleton className='w-2.5 h-2 mb-4' />
      </div>
      <div className='grid grid-cols-3 gap-3 mb-6'>
        <Skeleton className='h-10 w-full' />
        <Skeleton className='h-10 w-full' />
        <Skeleton className='h-10 w-full' />
        <Skeleton className='h-10 w-full' />
        <Skeleton className='h-10 w-full' />
        <Skeleton className='h-10 w-full' />
        <Skeleton className='h-10 w-full' />
        <Skeleton className='h-10 w-full' />
      </div>
      <Skeleton className='w-12 h-6 mb-4' />
      <Skeleton className='w-full h-12 mb-8' />
      <Skeleton className='w-8 h-2 mb-2' />
      <Skeleton className='w-52 h-5' />
      <Skeleton className='w-24 h-6 mb-12' />
      <Skeleton className='w-full h-10' />
    </div>
  );
};

export default ProductSkeleton;
