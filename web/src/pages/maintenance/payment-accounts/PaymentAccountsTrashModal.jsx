import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import DataTable from "react-data-table-component";

import { useModalStore } from "@/store/modal.store";
import { useFetchData } from "@/hooks/useFetchData";
import { fetchTrashedPaymentAccounts, restorePaymentAccounts } from "@/services/payment-account.services";
import { useAction } from "@/hooks/useAction";
import { useToast } from "@/hooks/useToast";

const columns = [
  {
    name: "Cuenta",
    selector: row => row.reference,
    cell: row => (
      <div>
        <div>{row.description}</div>
        <div>{row.reference}</div>
      </div>
    ),
    conditionalCellStyles: [
      {
        when: () => true,
        style: { minWidth: "250px" },
      }
    ]
  },
  {
    name: "Titular",
    selector: row => row.holder_name,
    conditionalCellStyles: [
      {
        when: () => true,
        style: { minWidth: "250px" },
      }
    ]
  }
];

export default function PaymentAccountsTrashModal({ modalKey = 'payment-accounts-trash-modal', onSuccess }) {
  const { getModalStatus, closeModal } = useModalStore();
  const { data, initialLoading, error, refetch } = useFetchData(fetchTrashedPaymentAccounts);

  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleClear, setToggleClear] = useState(false);

  const handleRefetch = () => {
    setToggleClear(prev => !prev);
    refetch();
  }

  const { loading, handleAction, successCount } = useAction(restorePaymentAccounts, { onSuccess: handleRefetch });
  const { showConfirmPromise } = useToast();

  const handleRestorePaymentAccounts = () => {
    const confirmMessage = selectedRows.length === 1
      ? '¿Está seguro de restaurar la cuenta de pago?'
      : `¿Está seguro de restaurar las ${selectedRows.length} cuentas de pago?`;
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
        onClick={handleRestorePaymentAccounts}
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
          Cuentas de pago eliminadas
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
