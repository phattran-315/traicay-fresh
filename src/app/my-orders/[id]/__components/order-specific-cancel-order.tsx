'use client'
import CancelOrderRequest from '@/components/molecules/cancel-order-request'
import { useState } from 'react'
import { useMediaQuery } from 'usehooks-ts'
interface OrderSpecificCancelOrderProps{
    orderId:string
}
const OrderSpecificCancelOrder = ({orderId}:OrderSpecificCancelOrderProps) => {
    const [isOpenCancelOrderRequest,setIsOpenCancelOrderRequest]=useState(false)
  const isDesktop = useMediaQuery("(min-width: 768px)");
   
    const handleToggleOpenState=()=>{
      setIsOpenCancelOrderRequest(prev=>!prev)
    }
  return (
    <>
    <CancelOrderRequest btnTitle='Hủy đơn hàng' btnClassName='my-4 w-full md:w-1/2' btnVariant={{variant:!isDesktop?'destructive':'text-destructive'}}    orderId={orderId} isOpen={isOpenCancelOrderRequest} onToggleOpenCancelRequest={handleToggleOpenState} />
    </>
  )
}

export default OrderSpecificCancelOrder