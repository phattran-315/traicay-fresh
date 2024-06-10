"use client";

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { buttonVariants } from "@/components/ui/button";
import { APP_URL } from "@/constants/navigation.constant";
import Link from "next/link";
import {
  IoMailOutline,
  IoCloseCircleOutline,
  IoFingerPrint,
  IoCheckmarkCircleSharp,
} from "react-icons/io5";
import { trpc } from "@/trpc/trpc-client";
import { useEffect } from "react";
import BreadCrumbLinks from "@/components/molecules/breadcrumbLinks";
import { usePathname, useSearchParams } from "next/navigation";

interface VerifyEmailPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const VerifyEmailPage = ({ searchParams }: VerifyEmailPageProps) => {
  const token = (searchParams?.token as string) || "";
  const emailTo = (searchParams?.toEmail as string) || "";
  const { refetch, data, isLoading, isError } = trpc.auth.verifyEmail.useQuery(
    {
      token,
    },
    { enabled: false }
  );
  useEffect(() => {
    if (token) {
      refetch();
    }
  }, [token, refetch]);

  const href=!token?`/verify-email?emailTo=${emailTo}`:`/verify-email?emailTo=${emailTo}&token=${token}`
  let content = (
    <>
      <BreadCrumbLinks
        links={[
          {
            label: "Xác thực tài khoản",
            href,
          },
        ]}
      />
      <div className='flex flex-col gap-4 items-center'>
        <h2 className='text-2xl text-center max-w-64 font-bold mt-10 text-gray-800'>
          Kiểm tra email của bạn
        </h2>
        <IoMailOutline
          data-cy='email-icon-verify-email'
          className='block w-44 h-44'
        />
        <p className='text-center'>
          Link xác thực tài khoản đã được gửi đến email của bạn{" "}
          <span className='font-bold'>{emailTo ? emailTo : null}</span>{" "}
        </p>
        <p className='text-muted-foreground text-center'>
          Nhanh chóng xác thực tài khoản và mua hàng nào
        </p>
        <Link
          href={APP_URL.home}
          className={buttonVariants({ variant: "link" })}
        >
          Trở lại trang chủ
        </Link>
      </div>
    </>
  );
  if (!token) return content;

  if (isError) {
    content = (
      <div className='flex flex-col items-center gap-2'>
        <IoCloseCircleOutline className='h-8 w-8 text-red-600' />
        <h3 className='font-semibold text-xl'>
          Có lỗi xảy ra vui lòng thử lại
        </h3>
        <p className='text-muted-foreground text-sm'>
          Link xác thực có thể hết hạn hoặc không đúng. Vui lòng kiểm tra lại
        </p>
      </div>
    );
  }
  if (data?.success) {
    content = (
      <div className='flex h-full flex-col items-center justify-center'>
        <div className='relative mb-4 text-muted-foreground'>
          <IoCheckmarkCircleSharp className='w-8 h-8 text-primary' />
        </div>

        <h3 className='font-semibold text-2xl'>Xong! Mọi thứ đã hoàn tất</h3>
        <p className='text-muted-foreground text-center mt-1'>
          Cảm ơn bạn đã xác thực tài khoản. Mua sắm thôi
        </p>
        <Link className={buttonVariants({ className: "mt-4" })} href='/login'>
          Đăng nhập
        </Link>
      </div>
    );
  }

  if (isLoading) {
    content = (
      <div className='flex flex-col items-center gap-2'>
        <IoFingerPrint className='animate-ping h-8 w-8 text-zinc-300' />
        <h3 className='font-semibold text-xl'>Đang xác thực</h3>
        <p className='text-muted-foreground text-sm'>Sẽ rất nhanh</p>
      </div>
    );
  }
  return <div className='mt-6'>{content}</div>;
};

export default VerifyEmailPage;
