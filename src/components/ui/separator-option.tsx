import { cn } from "@/lib/utils";

interface SeparatorOption{
  className?:string
}
const SeparatorOption = ({className}:SeparatorOption) => {
  return (
    <div className={cn('relative flex-center mt-3 mb-8',className)}>
      <span className='absolute inset-0 border border-t-gray-300' />
      <p className='flex-center'>
        <span className='absolute block px-2 bg-background text-xs'>Hoặc</span>
      </p>
    </div>
  );
};

export default SeparatorOption;
