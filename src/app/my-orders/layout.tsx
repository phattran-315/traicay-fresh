import { APP_URL } from "@/constants/navigation.constant";
import { getUserOrders } from "@/services/server/payload/orders.service";
import { getUserServer } from "@/services/server/payload/users.service";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ReactNode } from "react";
export const metadata:Metadata={
  title:'Đơn hàng của tôi'
}
const MyOrderLayout = async ({ children }: { children: ReactNode }) => {
  const cookie = cookies();
  const user = await getUserServer(cookie)!;
  if (!user) redirect(APP_URL.login);
  await getUserOrders({ userId: user!.id });
  return (
    <section>
      {children}
    </section>
  );
};

export default MyOrderLayout;
