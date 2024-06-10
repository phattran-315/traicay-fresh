import type { Access, AccessArgs } from "payload/config";

import type { Customer } from "../payload-types";

export const isAdminAndCustomer: Access = ({ req }: AccessArgs<Customer>) => {
  const user = req.user;
  if (!user) return false;
  if (user?.role || user.role === "admin") return true;
  return {
    id: {
      equals: user.id,
    },
  };
};
