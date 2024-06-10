import NotFoundComponent from '@/components/molecules/not-found-component'
import { Metadata } from 'next'
import React from 'react'
export const metadata:Metadata={
  title:"Không tìm thấy đơn hàng"
}
const NotFoundPage = () => {
  return (
   <NotFoundComponent msg='Không thể tìm thấy đơn hàng nào với id này'/>
  )
}

export default NotFoundPage