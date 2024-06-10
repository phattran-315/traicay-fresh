import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import "./globals.css";
import Header from "@/layout/header";
import MaxWidthWrapper from "@/components/molecules/max-width-wrapper";
import Provider from "@/layout/provider";
import Footer from "@/layout/footer";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ["latin",'vietnamese'] ,display:'swap'});
export const metadata: Metadata = {
  title: {
    template:`%s | TraicayFresh`,
    default:"Trai Cay Fresh"
  },
  description: "Thỏa sức mua sắm trái cây sạch mà không lo về giá cả ,chất lượng và dinh dưỡng",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html className='scroll-smooth' lang='en'>
      <body className={cn("antialiased font-sans h-full", inter.className)}>
        <Provider>
          <Header />
          <main className='pt-4 pb-14 sm:px-4  md:py-6 md:px-0 min-h-[50vh]'>
            <MaxWidthWrapper>{children}</MaxWidthWrapper>
          </main>
          <Footer />
        </Provider>
        <Toaster
          position='top-center'
          richColors
          toastOptions={{
            duration: 2500,
            classNames: {
              title: "text-center",
            },
          }}
        />
      </body>
    </html>
  );
}
