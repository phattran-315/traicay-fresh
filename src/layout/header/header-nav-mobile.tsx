"use client";
import Link from "next/link";
import { IoMenuOutline, IoCloseOutline } from "react-icons/io5";
import { APP_URL } from "@/constants/navigation.constant";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { IUser } from "@/types/common-types";
import { HEADER_LINKS,ILink } from "./constants/header-link";



interface HeaderNavMobileProps extends IUser {}

const HeaderNavMobile = ({ user }: HeaderNavMobileProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOpenState = () => setIsOpen((prev) => !prev);
  return (
    <div className="md:hidden">
      <button
        disabled={isOpen}
        data-cy='nav-mobile-open-btn'
        onClick={toggleOpenState}
        className={cn({ invisible: isOpen })}
      >
        <IoMenuOutline className='w-7 h-7 text-gray-900 hover:text-gray-800' />
      </button>
      {/* Nav bar  */}
      <nav
        data-cy='nav-mobile'
        className={cn(
          "w-screen-h-screen inset-0 flex justify-center z-50 bg-white/90 backdrop-blur-sm fixed inset-y-0 translate-x-full duration-500",
          {
            "translate-x-0": isOpen,
          }
        )}
      >
        <button
          className='z-50'
          disabled={!isOpen}
          data-cy='nav-mobile-close-btn'
          onClick={toggleOpenState}
        >
          <IoCloseOutline className='absolute w-7 h-7 top-3 right-6 hover:text-red-600 ' />
        </button>
        <ul className='flex flex-col gap-5 mt-20'>
          {HEADER_LINKS.map((link) => (
            <NavItem onClose={toggleOpenState} key={link.label} {...link} />
          ))}
          {!user ? (
            <>
              <NavItem
                onClose={toggleOpenState}
                label='Đăng nhập'
                href={APP_URL.login}
              />
              <NavItem
                onClose={toggleOpenState}
                label='Đăng kí'
                href={APP_URL.signUp}
              />
            </>
          ) : (
            <NavItem
              onClose={toggleOpenState}
              label='Quản lý tài khoản'
              href={APP_URL.myProfile}
            />
          )}
        </ul>
      </nav>
    </div>
  );
};

export default HeaderNavMobile;

interface NavItemProps extends ILink {
  onClose: () => void;
}
const NavItem = ({ onClose, href, label }: NavItemProps) => {
  const pathName = usePathname();

  return (
    <li
      data-cy='nav-item-mobile'
      className='text-2xl font-semibold text-center'
    >
      <Link
        className={cn({ "text-primary": pathName === href })}
        onClick={onClose}
        href={href}
      >
        {label}
      </Link>
    </li>
  );
};
