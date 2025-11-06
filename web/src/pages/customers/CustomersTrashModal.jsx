import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import DataTable from "react-data-table-component";

import { useModalStore } from "@/store/modal.store";
import { useFetchData } from "@/hooks/useFetchData";
import { fetchTrashedCustomers, restoreCustomers } from "@/services/customer.services";
import { useAction } from "@/hooks/useAction";
import { useToast } from "@/hooks/useToast";
import { DOC_TYPE } from "@/constants/doc-type";

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
    width: "140px",
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
    width: "300px",
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

export default function CustomersTrashModal({ modalKey = 'customers-trash-modal', onSuccess }) {
  const { getModalStatus, closeModal } = useModalStore();
  const { data, initialLoading, error, refetch } = useFetchData(fetchTrashedCustomers);

  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleClear, setToggleClear] = useState(false);

  const handleRefetch = () => {
    setToggleClear(prev => !prev);
    refetch();
  }

  const { loading, handleAction, successCount } = useAction(restoreCustomers, { onSuccess: handleRefetch });
  const { showConfirmPromise } = useToast();

  const handleRestoreCustomers = () => {
    const confirmMessage = selectedRows.length === 1
      ? '¿Está seguro de restaurar al cliente?'
      : `¿Está seguro de restaurar a los ${selectedRows.length} clientes?`;
    const ids = selectedRows.map(r => r.id);

    showConfirmPromise(confirmMessage, {
      onConfirm: () => handleAction(ids),
      loadingText: 'Restaurando...'
    });
  }

  const handleCloseModal = () => {
    if (successCount > 0 && onSuccess) onSuccess();
    closeModal(modalKey);
  }

  const ContextComponent = () => (
    <div className="d-flex w-100 align-items-center justify-content-between">
      <span>Opciones</span>
      <Button
        variant="secondary"
        size="sm"
        onClick={handleRestoreCustomers}
        disabled={loading}
      >
        <i className="feather icon-rotate-ccw me-2"></i>
        Restaurar
      </Button>
    </div>
  )

  return (
    <Modal centered size="lg" show={getModalStatus(modalKey)} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title className="fs-6 fw-medium">
          <i className="feather icon-trash-2 me-2"></i>
          Clientes eliminados
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
          className="border"
          title="Papelera"
          customStyles={{
            header: { style: { fontSize: 'medium' } },
            contextMenu: { style: { fontSize: 'medium' } },
            cells: { style: { paddingTop: "10px", paddingBottom: "10px" } }
          }}
          progressComponent={<div className="py-5 text-center">Cargando papelera...</div>}
          noDataComponent={<div className="py-5 text-center">La papelera está vacía</div>}
          contextComponent={<ContextComponent />}
          clearSelectedRows={toggleClear}
          onSelectedRowsChange={({ selectedRows }) => setSelectedRows(selectedRows)}
          progressPending={initialLoading}
          columns={columns}
          data={data}
        />
      </Modal.Body>
    </Modal>
  )
}
