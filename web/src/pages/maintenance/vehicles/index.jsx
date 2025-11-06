import { lazy, Suspense } from "react";

import PageTitle from "@/components/Common/PageTitle";
import Loader from "@/components/Loader/Loader";

const VehiclesList = lazy(() => import('./VehiclesList'));

export default function Vehicles() {
  return (
    <>
      <PageTitle title="Vehículos" />
      <Suspense fallback={<Loader />}>
        <VehiclesList />
      </Suspense>
    </>
  )
}