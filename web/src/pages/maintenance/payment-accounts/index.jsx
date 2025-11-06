import { lazy, Suspense } from "react";

import PageTitle from "@/components/Common/PageTitle";
import Loader from "@/components/Loader/Loader";

const PaymentAccountsList = lazy(() => import('./PaymentAccountsList'));

export default function PaymentAccounts() {
  return (
    <>
      <PageTitle title="Cuentas de Pago" />
      <Suspense fallback={<Loader />}>
        <PaymentAccountsList />
      </Suspense>
    </>
  )
}