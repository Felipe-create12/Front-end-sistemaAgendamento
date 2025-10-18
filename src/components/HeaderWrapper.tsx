"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";

export default function HeaderWrapper() {
  const pathname = usePathname();


  const hideHeaderOn = ["/login", "/"];
  const showHeader = !hideHeaderOn.includes(pathname);

  return <>{showHeader && <Header />}</>;
}
