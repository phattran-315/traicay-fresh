import { Button } from '@/components/ui/button'
import { useEffect } from 'react'
import { useFormStatus } from 'react-dom'


interface SubmitProductReviewBtnProps{
  selectedRating:number,
  isPending?:boolean
  onSetIsSubmittingTheForm:()=>void
}
const SubmitProductReviewBtn = ({ onSetIsSubmittingTheForm,selectedRating}:SubmitProductReviewBtnProps) => {
  const {pending}=useFormStatus()
 
  return <Button  onClick={()=>{
    onSetIsSubmittingTheForm()
  }} type='submit' disabled={pending||!selectedRating} className='w-full mt-6'>
  {pending ? "Đang gửi đánh giá..." : "Gửi đánh giá"}
</Button>
  
}

export default SubmitProductReviewBtn