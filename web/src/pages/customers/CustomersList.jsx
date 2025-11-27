import DataTable from "react-data-table-component";
import { Button, ButtonGroup, InputGroup, FormControl } from "react-bootstrap";

import { DOC_TYPE } from "@/constants/doc-type";
import { useModalStore } from "@/store/modal.store";
import { deleteCustomer, paginateCustomers } from "@/services/customer.services";
import { usePagination } from "@/hooks/usePagination";
import { useState } from "react";
import { useToast } from "@/hooks/useToast";
import { useAction } from "@/hooks/useAction";
import CustomerModal from "./CustomerModal";
import CustomersTrashModal from "./CustomersTrashModal";

const columns = [
  {
    name: "No. Documento",
    selector: row => row.doc_number,
    cell: row => (
      <div>
        <div>{row.doc_type_abbrev}</div>
        <div>{row.doc_number}</div>
      </div>
    ),
    width: "160px",
  },
  {
    name: "Nombre o Razón Social",
    selector: row => (row.doc_type_code === DOC_TYPE.RUC ? row.business_name : row.fullname),
    cell: row => (
      <div>
        <div>{row.doc_type_code === DOC_TYPE.RUC ? row.business_name : row.fullname}</div>
        {row.address && <div className="text-muted">{row.address}</div>}
      </div>
    ),
    width: "360px",
  },
  {
    name: "Celular",
    selector: row => row.phone || '-',
  },
  {
    name: "Correo",
    selector: row => row.email || '-',
  },
];

export default function CustomersList() {
  const { data, initialLoading, totalRows, perPage, searchInput, error, handlePageChange, handlePerRowsChange, handleSearch, handleClearSearch, refetch } = usePagination(paginateCustomers);
  const { getModalStatus, openModal } = useModalStore();

  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleClear, setToggleClear] = useState(false);

  const handleRefetch = () => {
    setToggleClear(prev => !prev);
    refetch();
  }

  const { loading: deleting, handleAction: handleDelete } = useAction(deleteCustomer, { onSuccess: handleRefetch });
  const { showConfirmPromise } = useToast();

  const handleDeleteCustomer = () => {
    showConfirmPromise('¿Seguro/a que desea eliminar al cliente?', {
      onConfirm: () => handleDelete(selectedRows[0]?.id)
    });
  }

  const ContextComponent = () => (
    <div className="d-flex w-100 align-items-center justify-content-between">
      <span className="fs-5">Opciones</span>
      <ButtonGroup size="sm" className="gap-2">
        <Button
          title="Editar cliente"
          onClick={() => openModal('customer-modal', selectedRows[0])}
          disabled={deleting}
        >
          <i className="feather icon-edit"></i>
        </Button>
        <Button
          variant="danger"
          title="Eliminar cliente"
          onClick={handleDeleteCustomer}
          disabled={deleting}
        >
          <i className="feather icon-trash"></i>
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
        selectableRows
        selectableRowsSingle
        pagination
        paginationServer
        selectableRowsHighlight
        clearSelectedRows={toggleClear}
        onSelectedRowsChange={({ selectedRows }) => setSelectedRows(selectedRows)}
        contextComponent={<ContextComponent />}
        paginationTotalRows={totalRows}
        paginationPerPage={perPage}
        paginationRowsPerPageOptions={[10, 20, 50, 100]}
        onChangePage={handlePageChange}
        onChangeRowsPerPage={handlePerRowsChange}
        className="border mb-3"
        customStyles={{ cells: { style: { paddingTop: "5px", paddingBottom: "5px" } } }}
        noDataComponent={
          <div className="py-5 text-center">
            {searchInput
              ? `No se encontraron clientes que coincidan con "${searchInput}"`
              : "No se encontraron clientes"}
          </div>
        }
        progressComponent={<div className="py-5 text-center">Cargando clientes...</div>}
        title={
          <div className="d-flex align-items-center gap-3">
            <span>Lista de clientes</span>
            <Button
              variant="link"
              size="sm"
              className="text-decoration-none text-danger p-0"
              title="Ver clientes eliminados"
              onClick={() => openModal('customers-trash-modal')}
            >
              <i className="feather icon-trash-2 me-2"></i>
              Papelera
            </Button>
          </div>
        }
        progressPending={initialLoading}
        columns={columns}
        data={data}
        actions={
          <InputGroup size="sm" style={{ width: "440px", zIndex: 1 }} className="gap-2 py-2 m-0">
            <Button
              title="Agregar cliente"
              onClick={() => openModal("customer-modal")}
            >
              <i className="feather icon-user-plus me-2"></i>
              Nuevo Cliente
            </Button>
            <FormControl
              title="Buscar por: No. Documento, Nombre o Razón Social"
              placeholder="No. Doc., Nombre o Razón Social"
              value={searchInput}
              onChange={(e) => handleSearch(e.target.value)}
            />
            {searchInput && (
              <Button variant="secondary" onClick={handleClearSearch} size="sm">
                <i className="feather icon-x"></i>
              </Button>
            )}
          </InputGroup>
        }
        paginationComponentOptions={{
          noRowsPerPage: false,
          rowsPerPageText: "Filas por página:",
          rangeSeparatorText: "de",
        }}
      />

      {getModalStatus('customer-modal') && <CustomerModal onSuccess={handleRefetch} />}
      {getModalStatus('customers-trash-modal') && <CustomersTrashModal onSuccess={handleRefetch} />}
    </>
  )
}
