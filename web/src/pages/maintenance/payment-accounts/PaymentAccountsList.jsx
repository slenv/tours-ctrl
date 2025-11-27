import { useState } from "react";
import DataTable from "react-data-table-component";
import { Button, ButtonGroup } from "react-bootstrap";

import { useFetchData } from "@/hooks/useFetchData";
import { deletePaymentAccount, fetchAllPaymentAccounts, togglePaymentAccountStatus } from "@/services/payment-account.services";
import { useModalStore } from "@/store/modal.store";
import { useAction } from "@/hooks/useAction";
import { useToast } from "@/hooks/useToast";
import { isInactive } from "@/constants/payment-account-status";
import PaymentAccountModal from "./PaymentAccountModal";
import PaymentAccountsTrashModal from "./PaymentAccountsTrashModal";
import PaymentAccountQrModal from "./PaymentAccountQrModal";

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
      },
      {
        when: (row) => isInactive(row.status),
        style: { color: "red" },
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
      },
      {
        when: (row) => isInactive(row.status),
        style: { color: "red" },
      }
    ]
  },
  {
    name: "Código QR",
    selector: row => row.qr_url,
    cell: row => {
      return (
        <div>
          {row.qr_url ? (
            <img
              src={row.qr_url}
              style={{ objectFit: "contain", maxWidth: "85px" }}
              alt="Código QR"
            />
          ) : (
            <i className="feather icon-image display-5" style={{ color: '#dadada' }}></i>
          )}
        </div>
      )
    },
    width: "130px"
  },
  {
    name: "Estado",
    selector: row => row.status_label,
    sortable: true,
    width: "130px",
    conditionalCellStyles: [
      {
        when: (row) => isInactive(row.status),
        style: { color: "red" },
      }
    ]
  }
];

export default function PaymentAccountsList() {
  const { data, initialLoading, error, refetch } = useFetchData(fetchAllPaymentAccounts);
  const { getModalStatus, openModal } = useModalStore();

  const [selectedRows, setSelectedRows] = useState([]);
  const [toggleClear, setToggleClear] = useState(false);

  const handleRefetch = () => {
    setToggleClear(prev => !prev);
    refetch();
  }

  const { loading: updatingStatus, handleAction: handleUpdateStatus } = useAction(togglePaymentAccountStatus, { onSuccess: handleRefetch });
  const { loading: deleting, handleAction: handleDelete } = useAction(deletePaymentAccount, { onSuccess: handleRefetch });
  const { showConfirmPromise } = useToast();

  const handleDeletePaymentAccount = () => {
    showConfirmPromise('¿Seguro/a que desea eliminar la cuenta de pago?', {
      onConfirm: () => handleDelete([selectedRows[0]?.id])
    });
  }

  const handleUpdatePaymentAccountStatus = () => {
    const confirmMessage = `¿Seguro/a que desea ${isInactive(selectedRows[0]?.status) ? "activar" : "desactivar"} la cuenta de pago?`;
    showConfirmPromise(confirmMessage, {
      onConfirm: () => handleUpdateStatus(selectedRows[0]?.id)
    });
  }

  const ContextComponent = () => (
    <div className="d-flex w-100 align-items-center justify-content-between">
      <span className="fs-5">Opciones</span>
      <ButtonGroup size="sm" className="gap-2">
        <Button
          title="Editar cuenta de pago"
          onClick={() => openModal('payment-account-modal', selectedRows[0])}
          disabled={deleting || updatingStatus}
        >
          <i className="feather icon-edit"></i>
        </Button>
        <Button
          variant="danger"
          title="Eliminar cuenta de pago"
          onClick={handleDeletePaymentAccount}
          disabled={deleting || updatingStatus}
        >
          <i className="feather icon-trash"></i>
        </Button>
        <Button
          variant="dark"
          title={selectedRows[0]?.qr_url ? "Cambiar código QR" : "Subir código QR"}
          onClick={() => openModal('payment-account-qr-modal', selectedRows[0])}
          disabled={deleting || updatingStatus}
        >
          Código QR
        </Button>
        <Button
          variant={isInactive(selectedRows[0]?.status) ? "warning" : "secondary"}
          title={isInactive(selectedRows[0]?.status) ? "Activar cuenta de pago" : "Desactivar cuenta de pago"}
          onClick={handleUpdatePaymentAccountStatus}
          disabled={deleting || updatingStatus}
        >
          {isInactive(selectedRows[0]?.status) ? "Activar" : "Desactivar"}
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
        progressComponent={<div className="py-5 text-center">Cargando cuentas de pago...</div>}
        noDataComponent={<div className="py-5 text-center">No se encontraron cuentas de pago</div>}
        className="border mb-3"
        title={
          <div className="d-flex align-items-center gap-3">
            <span>Cuentas de pago</span>
            <Button
              variant="link"
              size="sm"
              className="text-decoration-none text-danger p-0"
              title="Ver cuentas de pago eliminadas"
              onClick={() => openModal('payment-accounts-trash-modal')}
            >
              <i className="feather icon-trash-2 me-2"></i>
              Papelera
            </Button>
          </div>
        }
        actions={
          <ButtonGroup size="sm" className="gap-2 py-2 m-0">
            <Button
              title="Agregar nueva cuenta de pago"
              onClick={() => openModal("payment-account-modal")}
            >
              <i className="feather icon-plus-circle me-2"></i>
              Nueva Cuenta
            </Button>
          </ButtonGroup>
        }
        contextComponent={<ContextComponent />}
        clearSelectedRows={toggleClear}
        onSelectedRowsChange={({ selectedRows }) => setSelectedRows(selectedRows)}
        progressPending={initialLoading}
        columns={columns}
        data={data}
      />

      {getModalStatus('payment-account-modal') && <PaymentAccountModal onSuccess={handleRefetch} />}
      {getModalStatus('payment-accounts-trash-modal') && <PaymentAccountsTrashModal onSuccess={handleRefetch} />}
      {getModalStatus('payment-account-qr-modal') && <PaymentAccountQrModal onSuccess={handleRefetch} />}
    </>
  )
}
