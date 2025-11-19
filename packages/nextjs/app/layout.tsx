import type { ReactNode } from "react";
import { Suspense } from "react";
import "@rainbow-me/rainbowkit/styles.css";
import "@scaffold-ui/components/styles.css";
import { Providers } from "~~/components/providers/Providers";
import { Footer } from "~~/components/ui/Footer";
import { Header } from "~~/components/ui/Header";
import HeaderRightSlot from "~~/components/ui/HeaderRightSlot";
import PageHeader from "~~/components/ui/PageHeader";
import SideNav from "~~/components/ui/SideNav";
import "~~/styles/globals.css";
import { getMetadata } from "~~/utils/scaffold-eth/getMetadata";

export const metadata = getMetadata({
  title: "Workflows defi App",
  description: "workflows Application",
});

const ScaffoldEthApp = ({ children }: { children: ReactNode }) => {
  return (
    <html suppressHydrationWarning>
      <body>
        <Providers>
          <div className="flex flex-col min-h-screen">
            <Header />
            <div className="flex flex-1 bg-base-200">
              <SideNav />
              <div className="flex-1 flex flex-col">
                <PageHeader
                  autoBreadcrumbs
                  className="border-b-0"
                  containerClassName="max-w-none px-6 mx-0"
                  rightSlot={
                    <Suspense fallback={null}>
                      <HeaderRightSlot />
                    </Suspense>
                  }
                />
                <main className="flex-1 overflow-y-auto px-6 py-6">{children}</main>
              </div>
            </div>
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
};

export default ScaffoldEthApp;
