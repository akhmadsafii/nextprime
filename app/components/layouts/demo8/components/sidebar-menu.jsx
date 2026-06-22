"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BarChart2, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

export function SidebarMenu() {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-2.5 grow kt-scrollable-y-auto max-h-[calc(100vh-5rem)] lg:max-h-[calc(100vh-6rem)]">
      <Link
        aria-label="Dashboard"
        aria-current={pathname === "/" ? "page" : undefined}
        href="/"
        className={cn(
          "flex flex-col items-center justify-center w-[62px] h-[60px] gap-1 p-2 rounded-lg",
          "text-xs font-medium text-muted-foreground bg-transparent",
          "hover:text-primary hover:bg-background hover:border-border",
          "aria-[current=page]:text-primary aria-[current=page]:bg-background aria-[current=page]:border-border",
        )}
      >
        <BarChart2 className="size-5!" />
        Boards
      </Link>
      <Link
        aria-label="Panel Sales"
        aria-current={pathname === "/panel/sales" ? "page" : undefined}
        href="/panel/sales"
        className={cn(
          "flex flex-col items-center justify-center w-[62px] h-[60px] gap-1 p-2 rounded-lg",
          "text-xs font-medium text-muted-foreground bg-transparent",
          "hover:text-primary hover:bg-background hover:border-border",
          "aria-[current=page]:text-primary aria-[current=page]:bg-background aria-[current=page]:border-border",
        )}
      >
        <ShoppingCart className="size-5!" />
        Sales
      </Link>
    </div>
  );
}
