import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
interface NotFoundComponentProps {
  msg?: string;
  className?: string;
}
const NotFoundComponent = ({ msg, className }: NotFoundComponentProps) => {
  return (
    <div
      className={cn(
        "mt-12 flex justify-center items-center flex-col gap-8",
        className
      )}
    >
      <Image
        width={300}
        height={300}
        src='/images/404-page.svg'
        alt='404 page img'
      />
      <h2 className='font-bold text-2xl'>
        {msg ? msg : "Không tìm thấy trang bạn cần"}
      </h2>
      <Link className={buttonVariants({ variant: "default" })} href={"/"}>
        Trở về trang chủ
      </Link>
    </div>
  );
};

export default NotFoundComponent;
