import { lazy, Suspense } from "react";

import Loader from "@/components/Loader/Loader";
import PageTitle from "@/components/Common/PageTitle";

const CustomersList = lazy(() => import('./CustomersList'));

export default function Customers() {
  return (
    <>
      <PageTitle title="Clientes" />
      <Suspense fallback={<Loader />}>
        <CustomersList />
      </Suspense>
    </>
  )
}
