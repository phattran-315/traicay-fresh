import { ReactNode } from 'react'
import BreadCrumbLinks from '@/components/molecules/breadcrumbLinks'
import { APP_URL } from '@/constants/navigation.constant'
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: "Về chúng tôi ",
};
const AboutUsLayout = ({children}:{children:ReactNode}) => {
  return (
    <section>
        <BreadCrumbLinks links={[{label:"Về chúng tôi",href:APP_URL.aboutUs}]} />
        {children}
    </section>
  )
}

export default AboutUsLayout