import React from 'react'
import OrderSpecificSectionWrapper from './order-specific-section-wrapper'
import { IoLocationOutline } from 'react-icons/io5'

interface OrderSpecificShippingAddressProps{
    userName:string,
    phoneNumber:string,
    address:string
}
const OrderSpecificShippingAddress = ({userName,phoneNumber,address}:OrderSpecificShippingAddressProps) => {
  return (
   <OrderSpecificSectionWrapper>
     <IoLocationOutline size={35} />
            <div data-cy='shipping-address-info-box' className='flex flex-col gap-2'>
              <p data-cy='title-box' className='font-bold sm:text-lg'>Thông tin nhận hàng</p>
              <p data-cy='user-info-shipping-address' className='font-bold'>
                {userName} -{" "}
                {phoneNumber}
              </p>
              <p data-cy='address-shipping-address'>{address}</p>
            </div>
    </OrderSpecificSectionWrapper>
  )
}

export default OrderSpecificShippingAddress