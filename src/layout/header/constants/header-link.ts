import { APP_URL } from "@/constants/navigation.constant";

export interface ILink {
  label: string;
  href: string;
}
export const HEADER_LINKS: ILink[] = [
  {
    label: "Trang chủ",
    href: APP_URL.home,
  },

  {
    label: "Tất cả sản phẩm",
    href: APP_URL.products,
  },
  {
    label: "Về chúng tôi",
    href: APP_URL.aboutUs,
  },
  {
    label: "Liên hệ",
    href: APP_URL.contact
  },
];

export const HEADER_LINKS_DESKTOP: ILink[] = [
  // {
  //   label: "Hot Combo",
  //   href: APP_URL.home + "#hot-combos",
  // },
  {
    label: "Tất cả sản phẩm",
    href: APP_URL.products,
  },
  {
    label: "Về chúng tôi",
    href: APP_URL.aboutUs,

  },
  {
    label: "Liên hệ",
    href: APP_URL.contact
  },
];
