import { USER_ORDERS_SHOW_LIMIT } from "@/constants/configs.constant";
import { Order } from "@/payload/payload-types";
import { trpc } from "@/trpc/trpc-client";
import { useEffect, useState } from "react";
import { IoCaretDownOutline } from "react-icons/io5";
import { LuLoader2 } from "react-icons/lu";
interface LoaderOderBtnProps {
  currentOrders: Order[];
  onSetOrder: (order: Order[]) => void;
}
const LOAD_FROM_PAGE = 1;
const LoadOrderBtn = ({ currentOrders, onSetOrder }: LoaderOderBtnProps) => {
  // get from page 2
  const [page, setPage] = useState(LOAD_FROM_PAGE);
  const {
    data: result,
    isPending,
    isLoading,
    refetch,
  } = trpc.order.getOrders.useQuery({ page }, { enabled: false });
  useEffect(() => {
    if (result?.orders) {
      onSetOrder(result.orders);
    }
  }, [result?.orders, onSetOrder]);
  useEffect(() => {
    if (page > LOAD_FROM_PAGE) {
      refetch();
    }
  }, [page, refetch]);
  if (!currentOrders.length) return null;
  if (isLoading && !result)
    return (
      <span className='text-primary flex items-center gap-2'>
        <LuLoader2 className='animate-spin' />
        Đang tải thêm...
      </span>
    );
  const totalDocs = result?.totalDocs;
  const pagingCounter = result?.pagingCounter;
  const hasNextPage = result?.hasNextPage || page === LOAD_FROM_PAGE;
  const totalPages = result?.totalPages;
  let seeMoreCount = USER_ORDERS_SHOW_LIMIT;
  // if last page show the reaming items
  if (totalPages && totalPages - page === 1) {
    seeMoreCount = totalDocs! - (pagingCounter! + USER_ORDERS_SHOW_LIMIT-1);
  }
  if (!hasNextPage) return null;

  return (
    <button
      disabled={isLoading}
      onClick={() => {
        setPage((prev) => ++prev);
      }}
      className='text-primary flex items-center gap-2'
    >
      Xem thêm {seeMoreCount} đơn hàng <IoCaretDownOutline />{" "}
    </button>
  );
};

export default LoadOrderBtn;
