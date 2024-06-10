import NotFoundComponent from '@/components/molecules/not-found-component'
import { Metadata } from 'next'
export const metadata:Metadata={
  title:"Không tìm thấy sản phẩm "
}
const NotFound = () => {
  return (
   <NotFoundComponent msg='Không thể tìm thấy sản phẩm nào với id này'/>
  )
}

export default NotFound