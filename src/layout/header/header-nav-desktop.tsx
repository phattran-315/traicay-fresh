"use client";
import { cn } from "@/lib/utils";
import { IUser } from "@/types/common-types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HEADER_LINKS_DESKTOP, ILink } from "./constants/header-link";

interface HeaderNavDesktopProps extends IUser {}

const HeaderNavDesktop = ({ user }: HeaderNavDesktopProps) => {
  return (
    <div className="hidden md:block">
    
      {/* Nav bar  */}
      <nav
        data-cy='nav-desktop'
      
      >
     
        <ul className='flex gap-5'>
          {HEADER_LINKS_DESKTOP.map((link) => (
            <NavItem  key={link.label} {...link} />
          ))}
          {/* {!user ? (
            <>
              <NavItem
                label='Đăng nhập'
                href={APP_URL.login}
              />
              <NavItem
                label='Đăng kí'
                href={APP_URL.signUp}
              />
            </>
          ) : (
            <NavItem
              label='Quản lý tài khoản'
              href={APP_URL.myProfile}
            />
          )} */}
        </ul>
      </nav>
    </div>
  );
};

export default HeaderNavDesktop;

interface NavItemProps extends ILink {
}
const NavItem = ({  href, label }: NavItemProps) => {
  const pathName = usePathname();

  return (
    <li
      data-cy='nav-item-mobile'
      className='text-lg font-semibold text-center'
    >
      <Link
        className={cn({ "text-primary": pathName === href })}
        href={href}
      >
        {label}
      </Link>
    </li>
  );
};
