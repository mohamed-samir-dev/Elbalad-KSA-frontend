"use client";
import { usePathname } from "next/navigation";
import { Navbar } from "./navbar";
import WhatsappButton from "./WhatsappButton";

export default function ClientLayout({ children, footer }: { children: React.ReactNode; footer: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/admin") || pathname.startsWith("/invoice");

  return (
    <>
      {!isAdmin && <Navbar />}
      {children}
      {!isAdmin && footer}
      {!isAdmin && <WhatsappButton />}
    </>
  );
}
