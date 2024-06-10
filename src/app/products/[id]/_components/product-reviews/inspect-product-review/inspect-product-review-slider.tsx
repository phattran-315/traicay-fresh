import { ISelectedImg } from "@/components/molecules/product-modify-review";
import { cn } from "@/lib/utils";
import { Review } from "@/payload/payload-types";
import Image from "next/image";
import { useRef, useState } from "react";
import Slider from "react-slick";
import { useMediaQuery } from "usehooks-ts";

const settings = {
  dots: false,
  // dotsClass: 'slick-dots !&>li>button]:before:text-2xl',
  // infinite: true,
  arrows: false,
  infinite: false,
  speed: 500,
  slidesToShow: 1,
  // appendDots:
  slidesToScroll: 1,
};

interface InspectProductReviewSliderProps {
  openImgIndex: number;
  imgs: Review["reviewImgs"];
}
const InspectProductReviewSlider = ({
  openImgIndex,
  imgs,
}: InspectProductReviewSliderProps) => {
  const [activeIndex, setActiveIndex] = useState(openImgIndex);
  const sliderRef = useRef<Slider | null>(null);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const handleGotoSlide = (index: number) => {
    setActiveIndex(index);
    sliderRef.current?.slickGoTo(index);
  };
  const handleUpdateActiveSlide = (index: number) => {
    setActiveIndex(index);
  };
  return (
   [ <Slider
   key='slider'
    initialSlide={activeIndex}
    beforeChange={(_, next) => {
      handleUpdateActiveSlide(next);
    }}
    ref={sliderRef}
    {...settings}
    className='w-full'
    {...settings}
  >
    {imgs?.map((img) => {
      const imgSrc =
        typeof img.reviewImg === "object"
          ? img?.reviewImg?.url
          : img.reviewImg;
      return (
        <div key={img.id} className={cn('w-full relative h-[500px]',{
          'h-[300px]':!isDesktop
        })}>
          <Image
            fill
            className='object-cover object-center'
            alt='Image product'
            src={imgSrc || ""}
          />
        </div>
      );
    })}
  </Slider>,<ImgsNavigation key='imgs-navigation' reviewImgs={imgs} activeIndex={activeIndex} onGoto={handleGotoSlide}/>]
  );
};

export default InspectProductReviewSlider;

const ImgsNavigation = ({
    reviewImgs,
    activeIndex,
    onGoto,
  }: {
    activeIndex: number;
    onGoto: (index: number) => void;
  
    reviewImgs: Review["reviewImgs"];
  }) => {
  const isDesktop = useMediaQuery("(min-width: 768px)");

    return (
      <ul className='gap-2 flex items-center'>
        {reviewImgs?.map((img, i) => {
          const imgSrc =
            typeof img.reviewImg === "object"
              ? img?.reviewImg?.url
              : img.reviewImg;
          return (
            <li key={img.id}>
              <div
                onClick={() => onGoto(i)}
                className={cn(
                  "cursor-pointer h-[100px] w-[100px] rounded-sm relative overflow-hidden",
                  {
                    "border-secondary border": activeIndex === i && !isDesktop,
                    "border-primary border-4": activeIndex === i && isDesktop,

                  }
                )}
              >
                <Image
                  src={imgSrc || ""}
                  fill
                  // style={{
                  //   width: 'auto',
                  //   height: 'auto',
                  // }}
                  className='object-cover object-center'
                  alt='review-img-navigator'
                />
              </div>
            </li>
          );
        })}
      </ul>
    );
  };
  

