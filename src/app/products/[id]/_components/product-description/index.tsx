import PageSubTitle from "@/components/ui/page-subTitle";
import { Product } from "@/payload/payload-types";
import { getImgUrlMedia } from "@/utils/util.utls";
import Image from "next/image";
import React from "react";

const ProductDescription = ({
  benefitImg,
  description,
}: {
  benefitImg: Product["benefitImg"];
  description: string;
}) => {
  const imgSrc = getImgUrlMedia(benefitImg!)!;
  return (
    <div className='mt-12 md:mt-16'>
      <PageSubTitle>Mô tả sản phẩm</PageSubTitle>
      <div className='md:grid md:grid-cols-[4fr_6fr] md:gap-x-6'>
        <p className='mb-3'>{description}</p>
        <div className='border border-gray-800 w-full h-[200px] md:h-[300px] relative'>
          <Image src={imgSrc} alt='Benefit of fruits' fill className="object-fill object-center"/>
        </div>
      </div>
    </div>
  );
};

export default ProductDescription;
