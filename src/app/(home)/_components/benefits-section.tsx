import { ReactNode } from "react";
import {
  IoLeafOutline,
  IoRestaurantOutline,
  IoScaleOutline,
  IoRibbonOutline,
} from "react-icons/io5";

const BENEFITS = [
  {
    title: "Sạch",
    description: "Đảm bảo an toàn 100%",
    icon: <IoLeafOutline className='text-primary/80 text-xl md:text-4xl'  />,
  },
  {
    title: "Ngon",
    description: "Hương vị thơm ngon",
    icon: <IoRestaurantOutline className='text-primary/80 text-xl md:text-4xl'  />,
  },
  {
    title: "Dinh dưỡng",
    description: "Dinh dưỡng dồi dào",
    icon: <IoScaleOutline className='text-primary/80 text-xl md:text-4xl'  />,
  },
  {
    title: "Chất lượng",
    description: "Đảm bảo uy tín",
    icon: <IoRibbonOutline className='text-primary/80 text-xl md:text-4xl'  />,
  },
];
const BenefitsSection = () => {
  return (
    <div className='grid grid-cols-2 gap-x-2 gap-y-4 md:flex md:items-center md:justify-between'>
      {BENEFITS.map((benefit) => (
        <BenefitItem
          title={benefit.title}
          description={benefit.description}
          icon={benefit.icon}
          key={benefit.title}
        />
      ))}
    </div>
  );
};

export default BenefitsSection;

interface BenefitItemProps {
  icon: ReactNode;
  title: string;
  description: string;
}
function BenefitItem({ icon, title, description }: BenefitItemProps) {
  return (
    <div className='flex-center flex-col gap-2'>
      <div className='h-10 w-10 bg-primary/20 rounded-full flex-center md:h-16 md:w-16'>
        {icon}
      </div>
      <p className='font-bold'>{title}</p>
      <p className='mt-1 text-center text-sm md:text-base md:mt-2'>{description}</p>
    </div>
  );
}
