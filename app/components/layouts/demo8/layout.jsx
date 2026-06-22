"use client";

import { useEffect } from "react";
import { useBodyClass } from "@/hooks/use-body-class";
import { useIsMobile } from "@/hooks/use-mobile";
import { useSettings } from "@/providers/settings-provider";
import { Footer } from "./components/footer";
import { Header } from "./components/header";
import { Sidebar } from "./components/sidebar";
import { Toolbar, ToolbarHeading } from "./components/toolbar";

export function Demo8Layout({ children }) {
  const isMobile = useIsMobile();
  const { setOption } = useSettings();

  // Using the custom hook to set classes on the body
  useBodyClass(`
    [--header-height:60px]
    [--sidebar-width:90px]
    bg-muted!
  `);

  useEffect(() => {
    setOption("layout", "demo8");
  }, [setOption]);

  return (
    <>
      <div className="flex grow">
        {isMobile && <Header />}

        <div className="flex flex-col lg:flex-row grow pt-(--header-height) lg:pt-0">
          {!isMobile && <Sidebar />}

          <div className="flex flex-col grow rounded-xl bg-background border border-input lg:ms-(--sidebar-width) mt-0 m-4 lg:m-5">
            <div className="flex flex-col grow kt-scrollable-y-auto lg:[scrollbar-width:auto] pt-5">
              <main className="grow" role="content">
                <Toolbar>
                  <ToolbarHeading />
                </Toolbar>

                {children}
              </main>
            </div>

            <Footer />
          </div>
        </div>
      </div>
    </>
  );
}

export default Demo8Layout;
