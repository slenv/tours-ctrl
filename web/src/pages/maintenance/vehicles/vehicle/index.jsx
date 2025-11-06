import { useEffect } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { toast } from "sonner";

import { BASE_ROUTE, ROUTE } from "@/config/routes";
import { useFetchItem } from "@/hooks/useFetchItem";
import { getVehicleByPlate } from "@/services/vehicle.services";
import PageTitle from "@/components/Common/PageTitle";
import Loader from "@/components/Loader/Loader";
import VehicleSeats from "./VehicleSeats";

const backUrl = `/${BASE_ROUTE.APP}/${BASE_ROUTE.SETTINGS}/${ROUTE.VEHICLES}`;

export default function Vehicle() {
  const { plate } = useParams();
  const { loading, item: vehicle, error, fetchItem: fetchVehicle } = useFetchItem(getVehicleByPlate);

  useEffect(() => {
    fetchVehicle(plate);
  }, []);

  if (loading) return <Loader />;

  if (error) {
    toast.error(error, { id: 'vehicle-error' });
    return <Navigate to={backUrl} />;
  }

  return (
    <>
      <PageTitle title={`${vehicle?.brand} ${vehicle?.model}`} />
      <Link to={backUrl}>
        <i className="feather icon-arrow-left me-2"></i>
        Volver
      </Link>
      <div className="mt-3">
        <span className="text-muted">No. Placa: {vehicle?.plate}</span>
        <h5 className="fw-normal fs-5 fw-medium">
          {vehicle?.brand} {vehicle?.model} / {vehicle?.seats} asientos
        </h5>
      </div>
      <VehicleSeats
        vehicleId={vehicle?.id}
        maxSeats={vehicle?.seats}
        seats={vehicle?.vehicleSeats}
      />
    </>
  )
}