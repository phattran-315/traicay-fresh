import PageTitle from "@/components/ui/page-title";
import {
  HOST_ADDRESS,
  HOST_EMAIL,
  HOST_PHONE_NUMBER,
  ZALO_NUMBER,
} from "@/constants/configs.constant";
import React from "react";

const ContactPage = () => {
  return (
    <div>
      <PageTitle>Thông tin liên hệ</PageTitle>
      <h3 className='text-lg font-semibold mb-6'>
        Cảm ơn quý khách đã ghé thăm{" "}
        <span className='text-primary'>TraiCayFresh</span>{" "}
      </h3>
      <div className='space-y-4'>
        <div className='flex items-center gap-2'>
          <p className='whitespace-nowrap'>Địa chỉ: </p>{" "}
          <a
            target='_blank'
            href='https://www.google.com/maps/place/42+%C4%90.+S%E1%BB%91+8,+Linh+T%C3%A2y,+Th%E1%BB%A7+%C4%90%E1%BB%A9c,+Th%C3%A0nh+ph%E1%BB%91+H%E1%BB%93+Ch%C3%AD+Minh,+Vietnam/@10.8586633,106.7538669,17z/data=!3m1!4b1!4m6!3m5!1s0x31752790e447e321:0x40849b701606844b!8m2!3d10.8586633!4d106.7564418!16s%2Fg%2F11knkgw8mq?entry=ttu'
          >
            {HOST_ADDRESS}
          </a>{" "}
        </div>
        <div className='flex items-center gap-2'>
          <p>Số điện thoại: </p>{" "}
          <a data-cy='tel-order-status' href={`tel:${HOST_PHONE_NUMBER}`}>
            {HOST_PHONE_NUMBER}
          </a>
        </div>
        <div className='flex items-center gap-2'>
          <p>Email: </p>{" "}
          <a data-cy='tel-order-status' href={`mailto:${HOST_EMAIL}`}>
            {HOST_EMAIL}
          </a>
        </div>
        <div className='flex items-center gap-2'>
          <p>Zalo: </p>{" "}
          <a href={`https://zalo.me/${ZALO_NUMBER}`} target='_blank'>
            {ZALO_NUMBER}
          </a>
        </div>
      </div>
      <div className="mt-8">
      <h3 className='text-lg font-semibold'>
    Rất mong có cơ hội được làm việc với quý khách. Xin cảm ơn
      
      </h3>
      </div>
    </div>
  );
};

export default ContactPage;
