import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { APP_URL } from "@/constants/navigation.constant";
import Link from "next/link";
import { Fragment } from "react";

interface BreadCrumbLinksProps<Deep extends 1 | 2 | 3> {
  deep?: Deep | 1;
  links: Deep extends 1
    ? [{ label: string; href: string }]
    : Deep extends 2
    ? [{ label: string; href: string }, { label: string; href: string }]
    : [
        { label: string; href: string },
        { label: string; href: string },
        { label: string; href: string }
      ];
}

const BreadCrumbLinks = <Deep extends 1 | 2 | 3>({
  deep = 1,
  links,
}: BreadCrumbLinksProps<Deep>) => {
  const deepLevel = Array.from({ length: deep }, (_, i) => i);
  return (
    <Breadcrumb>
      <BreadcrumbList data-cy='breadcrumb-list-links'>
        <BreadcrumbItem data-cy='breadcrumb-list-item'>
          <Link href={APP_URL.home}>Trang chủ</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        {deepLevel.map((level, i) => {
          if (!links[i].label) return null;
          return (
            <Fragment key={level}>
              {i + 1 === deep && (
                <BreadcrumbItem data-cy='breadcrumb-list-item'>
                  <BreadcrumbPage>
                    <Link href={links[i].href}>{links[i].label}</Link>
                  </BreadcrumbPage>
                </BreadcrumbItem>
              )}

              {i + 1 !== deep && (
                <>
                  <BreadcrumbItem data-cy='breadcrumb-list-item'>
                    <Link href={links[i].href}>{links[i].label}</Link>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </>
              )}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
};

export default BreadCrumbLinks;
