"use client";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { Media, Product } from "@/payload/payload-types";
import { getImgUrlMedia } from "@/utils/util.utls";
const settings = {
  dots: false,
  // dotsClass: 'slick-dots !&>li>button]:before:text-2xl',
  // infinite: true,
  arrows: false,
  speed: 500,
  slidesToShow: 1,
  // appendDots:
  slidesToScroll: 1,
};
const ProductSlider = ({ imgs }: { imgs: Product["productImgs"] }) => {

  const [activeIndex, setActiveIndex] = useState(0);

  const sliderRef = useRef<Slider | null>(null);

  const handleGotoSlide = (index: number) => {
    setActiveIndex(index);
    sliderRef.current?.slickGoTo(index);
  };
  const handleUpdateActiveSlide = (index: number) => {
    setActiveIndex(index);
  };
  return (
    <div className='relative cursor-pointer w-full h-[250px] border md:w-[340px] md:h-[300px] md:border-none lg:w-[500px]'>
      <Slider
        beforeChange={(_, next) => {
          handleUpdateActiveSlide(next);
        }}
        ref={sliderRef}
        {...settings}
      >
        {imgs.map((img) => {
          const imgUrl = getImgUrlMedia(img);
          return (
            <div key={imgUrl} className='relative h-[250px] md:h-[300px]'>
              <Image
              priority
                fill
                className='object-cover object-center'
                alt='Image product'
                src={imgUrl || ""}
              />
            </div>
          );
        })}
      </Slider>
      {/* custom dots */}
      <Dots
        length={imgs.length}
        activeIndex={activeIndex}
        onGoto={handleGotoSlide}
      />
    </div>
  );
};

export default ProductSlider;

const Dots = ({
  activeIndex,
  onGoto,
  length,
}: {
  length: number;
  activeIndex: number;
  onGoto: (index: number) => void;
}) => {
  return (
    <ul className='mt-2 flex justify-center gap-2 items-center'>
      {Array.from({ length }).map((_, i) => (
        <li key={i}>
          <button
            onClick={() => onGoto(i)}
            className={cn("block w-2 h-2 rounded-full bg-gray-200", {
              "bg-gray-600": activeIndex === i,
            })}
          >
            &nbsp;
          </button>
        </li>
      ))}
    </ul>
  );
};
