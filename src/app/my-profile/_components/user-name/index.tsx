import { IUser } from "@/types/common-types";
import UserNameDetail from "./user-name-detail";

interface UserNameProps extends IUser {}
const UserName = ({ user }: UserNameProps) => {
  return (
    <div>
      <UserNameDetail user={user} />
    </div>
  );
};

export default UserName;
