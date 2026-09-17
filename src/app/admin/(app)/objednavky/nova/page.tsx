"use client";

import { Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { OrderForm } from "@/components/admin/OrderForm";
import { PageHead } from "@/components/admin/ui";
import type { Order } from "@/lib/admin/types";

function NovaObjednavka() {
  const router = useRouter();
  const params = useSearchParams();

  const prefill: Partial<Order> = {};
  const date = params.get("date");
  const price = params.get("price");
  const description = params.get("description");
  if (date && /^\d{4}-\d{2}-\d{2}$/.test(date)) prefill.date = date;
  if (price && Number.isFinite(Number(price))) prefill.price = Number(price);
  if (description) prefill.description = description;

  return (
    <>
      <PageHead title="Nová objednávka" sub="Stačí jméno, telefon, termín a co má v kytici být. Zbytek se dá doplnit později." />
      <OrderForm prefill={prefill} onSaved={(o) => router.push(`/admin/objednavky/${o.id}`)} />
    </>
  );
}

export default function NovaObjednavkaPage() {
  return (
    <Suspense fallback={null}>
      <NovaObjednavka />
    </Suspense>
  );
}
