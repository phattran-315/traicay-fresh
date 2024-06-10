"use client";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
interface CheckoutNoteProps{
  notes:string
  onSetCheckoutNotes:(notes:string)=>void
}
const CheckoutNote = ({notes,onSetCheckoutNotes}:CheckoutNoteProps) => {
  return <div data-cy='note-box-checkout' className="mb-6 mt-6">
    <Textarea maxLength={450} value={notes} onChange={(e)=>onSetCheckoutNotes(e.target.value)}  placeholder='Thời gian nhận hàng mong muốn (...) hoặc những yêu cầu khác.' />
  </div>
};

export default CheckoutNote;
