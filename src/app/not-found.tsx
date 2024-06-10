import NotFoundComponent from "@/components/molecules/not-found-component";
import { Metadata } from "next";
export const metadata:Metadata={
  title:"Không tìm thấy trang yêu cầu"
}
const PageNotFound = () => {
  return <NotFoundComponent />;
};

export default PageNotFound;
