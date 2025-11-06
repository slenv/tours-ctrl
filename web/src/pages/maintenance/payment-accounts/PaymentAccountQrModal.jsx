import { useCallback, useState } from "react";
import { Modal, Button, ButtonGroup } from "react-bootstrap";
import { toast } from "sonner";
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

import { useModalStore } from "@/store/modal.store";
import { useDynamicRefs } from "@/hooks/useDynamicRefs";
import { deletePaymentAccountQr, uploadPaymentAccountQr } from "@/services/payment-account.services";
import { useAction } from "@/hooks/useAction";
import { useToast } from "@/hooks/useToast";

export default function PaymentAccountQrModal({ modalKey = 'payment-account-qr-modal', onSuccess }) {
  const { getModalStatus, getModalData, closeModal } = useModalStore();
  const { getRef } = useDynamicRefs();
  const { showPromise, showConfirmPromise } = useToast();

  const isOpen = getModalStatus(modalKey);
  const paymentAccount = getModalData(modalKey);

  const [editingImage, setEditingImage] = useState(null);

  const { loading: uploading, handleAction: handleUpload, successCount: uploadedCount } = useAction(uploadPaymentAccountQr, {
    onSuccess: (data) => {
      paymentAccount.qr_url = data.data?.qr_url;
      setEditingImage(null);
    }
  });
  const { loading: deleting, handleAction: handleDelete, successCount: deletedCount } = useAction(deletePaymentAccountQr, {
    onSuccess: () => {
      paymentAccount.qr_url = null;
    }
  });

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      return toast.error('Por favor selecciona una imagen válida');
    }
    if (file.size > 2 * 1024 * 1024) {
      return toast.error('La imagen no debe superar los 2MB');
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setEditingImage({
        file,
        preview: reader.result,
        crop: { unit: '%', width: 90 },
        completedCrop: null
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  }

  const getCroppedFile = useCallback(() => {
    return new Promise((resolve) => {
      const { completedCrop, file, preview } = editingImage;
      if (!completedCrop) return resolve(file);

      const image = getRef('image_ref').current;
      if (!image) return resolve(file);

      const canvas = document.createElement('canvas');
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;

      canvas.width = completedCrop.width;
      canvas.height = completedCrop.height;
      const ctx = canvas.getContext('2d');

      ctx.drawImage(
        image,
        completedCrop.x * scaleX,
        completedCrop.y * scaleY,
        completedCrop.width * scaleX,
        completedCrop.height * scaleY,
        0, 0,
        completedCrop.width,
        completedCrop.height
      );

      canvas.toBlob((blob) => {
        if (!blob) return resolve(file);
        resolve(new File([blob], file.name, { type: file.type }));
      }, file.type);
    });
  }, [editingImage, getRef]);

  const handleUploadQr = async () => {
    const fileToUpload = await getCroppedFile();
    if (!fileToUpload) return toast.error('Error al procesar la imagen');

    showPromise(() => handleUpload(paymentAccount.id, fileToUpload), {
      loadingText: 'Subiendo QR...'
    });
  }

  const handleDeleteQr = () => {
    showConfirmPromise('¿Estás seguro de eliminar el código QR?', {
      onConfirm: () => handleDelete(paymentAccount.id),
      loadingText: 'Eliminando...'
    });
  }

  const handleCloseModal = () => {
    setEditingImage(null);
    if (uploadedCount > 0 || deletedCount > 0) onSuccess?.();
    closeModal(modalKey);
  }

  const displayImage = editingImage?.preview || paymentAccount?.qr_url;
  const loading = uploading || deleting;

  return (
    <Modal centered show={isOpen} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title className="fs-6 fw-medium">
          <i className="feather icon-image me-2"></i>
          Código QR / {paymentAccount?.description}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="text-center">
          {displayImage ? (
            <div className="mb-3">
              {editingImage ? (
                <ReactCrop
                  crop={editingImage.crop}
                  onChange={(c) => setEditingImage({ ...editingImage, crop: c })}
                  onComplete={(c) => setEditingImage({ ...editingImage, completedCrop: c })}
                >
                  <img
                    ref={getRef('image_ref')}
                    src={editingImage.preview}
                    alt="Preview"
                    style={{ maxWidth: '100%', maxHeight: '500px' }}
                  />
                </ReactCrop>
              ) : (
                <img
                  src={displayImage}
                  alt="Código QR"
                  className="img-fluid rounded border"
                  style={{ maxHeight: '400px', objectFit: 'contain' }}
                />
              )}
            </div>
          ) : (
            <div className="mb-3 p-5 border border-dashed rounded bg-light">
              <i className="feather icon-image display-3" style={{ color: '#dadada' }}></i>
              <p className="text-muted mt-2 mb-0">No hay código QR disponible</p>
            </div>
          )}

          <input
            ref={getRef('file_input')}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="d-none"
          />

          <ButtonGroup size="sm" className="gap-2">
            {!editingImage && (
              <Button variant="primary" onClick={() => getRef('file_input').current?.click()} disabled={loading}>
                <i className="feather icon-upload me-2"></i>
                {paymentAccount?.qr_url ? 'Cambiar QR' : 'Subir QR'}
              </Button>
            )}

            {editingImage && (
              <>
                <Button onClick={handleUploadQr} disabled={loading}>
                  <i className="feather icon-check me-2"></i>
                  Confirmar
                </Button>
                <Button variant="secondary" onClick={() => setEditingImage(null)} disabled={loading}>
                  <i className="feather icon-x me-2"></i>
                  Cancelar
                </Button>
              </>
            )}

            {paymentAccount?.qr_url && !editingImage && (
              <Button variant="danger" onClick={handleDeleteQr} disabled={loading}>
                <i className="feather icon-trash me-2"></i>
                Eliminar QR
              </Button>
            )}
          </ButtonGroup>
        </div>
      </Modal.Body>
    </Modal>
  )
}
