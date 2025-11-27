import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, ButtonGroup, FormControl, InputGroup } from "react-bootstrap"
import DataTable from "react-data-table-component";

import { useFetchData } from "@/hooks/useFetchData";
import { fetchAllVehicles } from "@/services/vehicle.services";
import { useModalStore } from "@/store/modal.store";
import { isUnavailable } from "@/constants/vehicle-status";
import { filterSearch } from "@/utils/search.utils";
import VehicleModal from "./VehicleModal";

const columns = [
  {
    name: "No. Placa",
    selector: row => row.plate,
    width: "110px",
  },
  {
    name: "No. Asientos",
    selector: row => `${row.seats} asientos`,
    width: "120px",
  },
  {
    name: "Marca",
    selector: row => row.brand,
    width: "130px",
  },
  {
    name: "Modelo",
    selector: row => row.model,
    width: "130px",
  },
  {
    name: "Color",
    selector: row => row.color,
    width: "130px",
  },
  {
    name: "Propietario",
    selector: row => row.owner_label,
  },
  {
    name: "Estado",
    selector: row => row.status_label,
    sortable: true,
    width: "130px",
    conditionalCellStyles: [
      {
        when: (row) => isUnavailable(row.status),
        style: { color: "red" },
      }
    ]
  }
];

export default function VehiclesList() {
  const { data, initialLoading, error, refetch } = useFetchData(fetchAllVehicles);
  const { getModalStatus, openModal } = useModalStore();

  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleClear, setToggleClear] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const handleRefetch = () => {
    setToggleClear(prev => !prev);
    refetch();
  }

  const ContextComponent = () => (
    <div className="d-flex w-100 align-items-center justify-content-between">
      <span className="fs-5">Opciones</span>
      <ButtonGroup size="sm" className="gap-2">
        <Button
          title="Editar vehículo"
          onClick={() => openModal('vehicle-modal', selectedRows[0])}
        // disabled={deleting}
        >
          <i className="feather icon-edit"></i>
        </Button>
        <Button
          variant="danger"
          title="Eliminar vehículo"
        // onClick={handleDeleteCustomer}
        // disabled={deleting}
        >
          <i className="feather icon-trash"></i>
        </Button>
        <Button
          variant="dark"
          title="Gestionar asientos del vehículo"
          as={Link}
          to={selectedRows[0]?.plate}
        // onClick={handleDeleteCustomer}
        // disabled={deleting}
        >
          Asientos
        </Button>
        <Button
          variant="secondary"
          title="Estado del vehículo"
        // onClick={handleDeleteCustomer}
        // disabled={deleting}
        >
          Estado
        </Button>
      </ButtonGroup>
    </div>
  )

  return (
    <>
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <DataTable
        striped
        fixedHeader
        pagination
        selectableRows
        selectableRowsSingle
        customStyles={{ cells: { style: { paddingTop: "10px", paddingBottom: "10px" } } }}
        progressComponent={<div className="py-5 text-center">Cargando vehículos...</div>}
        noDataComponent={<div className="py-5 text-center">No se encontraron vehículos</div>}
        className="border mb-3"
        title={
          <div className="d-flex align-items-center gap-3">
            <span>Lista de vehículos</span>
            <Button
              variant="link"
              size="sm"
              className="text-decoration-none text-danger p-0"
              title="Ver vehículos eliminados"
              onClick={() => openModal('vehicles-trash-modal')}
            >
              <i className="feather icon-trash-2 me-2"></i>
              Papelera
            </Button>
          </div>
        }
        actions={
          <InputGroup size="sm" style={{ width: "440px", zIndex: 1 }} className="gap-2 py-2 m-0">
            <Button
              title="Agregar nuevo vehículo"
              onClick={() => openModal("vehicle-modal")}
            >
              <i className="feather icon-plus-circle me-2"></i>
              Nuevo Vehículo
            </Button>
            <FormControl
              title="Buscar por: No. Placa, Marca, Modelo o Color"
              placeholder="No. Placa, Marca, Modelo o Color"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
            {searchInput && (
              <Button variant="secondary" onClick={() => setSearchInput('')} size="sm">
                <i className="feather icon-x"></i>
              </Button>
            )}
          </InputGroup>
        }
        contextComponent={<ContextComponent />}
        clearSelectedRows={toggleClear}
        onSelectedRowsChange={({ selectedRows }) => setSelectedRows(selectedRows)}
        progressPending={initialLoading}
        columns={columns}
        data={filterSearch(data, searchInput, v => [v.plate, v.brand, v.model, v.color])}
      />

      {getModalStatus('vehicle-modal') && <VehicleModal modalKey="vehicle-modal" onSuccess={handleRefetch} />}
    </>
  )
}