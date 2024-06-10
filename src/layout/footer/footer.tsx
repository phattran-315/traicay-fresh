import {
  IoLocationOutline,
  IoCallOutline,
  IoMailOutline,
  IoLogoFacebook,
  IoLogoTiktok
} from "react-icons/io5";
import PageSubTitle from "@/components/ui/page-subTitle";
import MaxWidthWrapper from "@/components/molecules/max-width-wrapper";
import Link from "next/link";
import { HOST_ADDRESS, HOST_EMAIL, HOST_PHONE_NUMBER, ZALO_NUMBER } from "@/constants/configs.constant";

const Footer = () => {
  return (
     <MaxWidthWrapper >
    <footer className="py-8 border border-transparent border-t-gray-200">
     <h2>Logo</h2>
      <p className='mt-6'>
        Cam kết cung cấp trái cây sạch chất lương hương vị tươi ngon đến người
        tiêu dùng
      </p>
      <div className='mt-6'>
        <PageSubTitle>Liên hệ</PageSubTitle>
        <div className='space-y-3'>
          <div className='flex gap-2 items-center'>
            <p>

            <IoLocationOutline size={25}  />
            </p>
           <a target="_blank" href="https://www.google.com/maps/place/42+%C4%90.+S%E1%BB%91+8,+Linh+T%C3%A2y,+Th%E1%BB%A7+%C4%90%E1%BB%A9c,+Th%C3%A0nh+ph%E1%BB%91+H%E1%BB%93+Ch%C3%AD+Minh,+Vietnam/@10.8586633,106.7538669,17z/data=!3m1!4b1!4m6!3m5!1s0x31752790e447e321:0x40849b701606844b!8m2!3d10.8586633!4d106.7564418!16s%2Fg%2F11knkgw8mq?entry=ttu">
            {HOST_ADDRESS}
           </a>
          </div>
          <div className='flex gap-2 items-center'>
            <p className="min-w-[20px]">
            <IoCallOutline  size={25} />
            </p>
            <a
              data-cy='tel-order-status'
              href={`tel:${HOST_PHONE_NUMBER}`}
            >
              {HOST_PHONE_NUMBER}
            </a>
          </div>
          <div className='flex gap-2 items-center'>
            <p className="min-w-[20px]">
            <IoMailOutline   size={25} />
            </p>
            <a
              data-cy='tel-order-status'
              href={`mailto:${HOST_EMAIL}`}
            >
              {HOST_EMAIL}
            </a>
          </div>
          <div className='flex gap-2 items-center'>
            <p className="min-w-[20px] font-bold">
            Zalo
            </p>
            <a href={`https://zalo.me/${ZALO_NUMBER}`} target="_blank">{ZALO_NUMBER}</a>
          </div>
        </div>
      </div>
      <div className='mt-6'>
        <PageSubTitle>Mạng xã hội</PageSubTitle>
        <div className="flex gap-4 items-center">
            <IoLogoFacebook  size={40}/>
            <IoLogoTiktok  size={40}/>
        </div>
      </div>
      <p className="mt-6 font-semibold text-lg">
        &copy; 2024 traicayfresh.com
      </p>
    </footer>
     </MaxWidthWrapper>
  );
};

export default Footer;
