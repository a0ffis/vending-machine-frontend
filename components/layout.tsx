"use client";
import { useCashInInventory, useMasCash } from "@/hooks/admin-service";
import CashInInventory from "./ui/CashInInventory";

type Props = {};

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { data: cashInInventoryData = [] } = useCashInInventory();
  const { data: masCashData = [] } = useMasCash();

  return (
    <div className="min-h-screen max-h-screen py-[5vh] relative">
      <div className="container mx-auto min-h-[inherit]">{children}</div>
      <CashInInventory cashInInventoryData={cashInInventoryData} />
    </div>
  );
}
