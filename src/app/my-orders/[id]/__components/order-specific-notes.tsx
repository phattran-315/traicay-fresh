import React from 'react'
import { IoCreateOutline } from "react-icons/io5";
import OrderSpecificSectionWrapper from './order-specific-section-wrapper'

interface OrderSpecificNotesProps{
    notes:string
}
const OrderSpecificNotes = ({notes}:OrderSpecificNotesProps) => {
  return (
   <OrderSpecificSectionWrapper>
    <IoCreateOutline size={35} />
            <div data-cy="order-note-box"  className='flex flex-col gap-2'>
              <p data-cy='title-box' className='font-bold sm:text-lg'>Ghi chú</p>
                <p data-cy="order-notes">{notes}</p>
            </div>
   </OrderSpecificSectionWrapper>
  )
}

export default OrderSpecificNotes