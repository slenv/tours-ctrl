import { useEffect } from "react";
import { Button, Col, FloatingLabel, FormControl, Modal, Row } from "react-bootstrap";
import * as Yup from "yup";
import { Formik } from "formik";
import { toast } from "sonner";

import { useDynamicRefs } from "@/hooks/useDynamicRefs";
import { useModalStore } from "@/store/modal.store";
import { savePaymentAccount } from "@/services/payment-account.services";

const validationSchema = Yup.object().shape({
  description: Yup.string().max(255).required('Ingrese Descripción'),
  reference: Yup.string().max(255).required('Ingrese No. Referencia'),
  holder_name: Yup.string().max(255).required('Ingrese Titular'),
});

export default function PaymentAccountModal({ modalKey = 'payment-account-modal', onSuccess }) {
  const { getModalStatus, getModalData, closeModal } = useModalStore();
  const { getRef } = useDynamicRefs();

  const isOpen = getModalStatus(modalKey);
  const paymentAccount = getModalData(modalKey);
  const initialValues = {
    id: paymentAccount?.id || null,
    holder_name: paymentAccount?.holder_name || '',
    description: paymentAccount?.description || '',
    reference: paymentAccount?.reference || ''
  }

  useEffect(() => {
    if (isOpen) getRef('description').current?.focus();
  }, [isOpen]);

  const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
    setSubmitting(true);
    try {
      await savePaymentAccount(values);
      toast.success('Cuenta de pago guardada correctamente');
      resetForm();
      closeModal(modalKey);
      onSuccess && onSuccess();
    } catch (error) {
      setSubmitting(false);
      setErrors(error.response?.data?.errors);
    } finally {
      setSubmitting(false);
    }
  }

  const handleCloseModal = () => {
    closeModal(modalKey);
  }

  return (
    <Modal centered show={isOpen} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title className="fs-6 fw-medium">
          {paymentAccount?.id ? <i className="feather icon-edit me-2"></i> : <i className="feather icon-plus-circle me-2"></i>}
          {paymentAccount?.id ? 'Editar cuenta de pago' : 'Nueva cuenta de pago'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, touched, values, isSubmitting }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Row className="g-3">
                <Col xs={6}>
                  <FloatingLabel label="Descripción">
                    <FormControl
                      size="sm"
                      type="text"
                      placeholder="Descripción"
                      autoCorrect="off"
                      autoComplete="off"
                      name="description"
                      value={values.description}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={255}
                      isInvalid={touched.description && errors.description}
                      ref={getRef('description')}
                    />
                    <FormControl.Feedback type="invalid">{errors.description}</FormControl.Feedback>
                  </FloatingLabel>
                </Col>
                <Col xs={6}>
                  <FloatingLabel label="No. Referencia">
                    <FormControl
                      size="sm"
                      type="text"
                      placeholder="No. Referencia"
                      autoCorrect="off"
                      autoComplete="off"
                      name="reference"
                      value={values.reference}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={255}
                      isInvalid={touched.reference && errors.reference}
                    />
                    <FormControl.Feedback type="invalid">{errors.reference}</FormControl.Feedback>
                  </FloatingLabel>
                </Col>
                <Col xs={12}>
                  <FloatingLabel label="Titular">
                    <FormControl
                      size="sm"
                      type="text"
                      placeholder="Titular"
                      autoCorrect="off"
                      autoComplete="off"
                      name="holder_name"
                      value={values.holder_name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={255}
                      isInvalid={touched.holder_name && errors.holder_name}
                    />
                    <FormControl.Feedback type="invalid">{errors.holder_name}</FormControl.Feedback>
                  </FloatingLabel>
                </Col>
                <Col xs={12}>
                  <Button
                    type="submit"
                    className="w-100 py-2"
                  >
                    <i className="feather icon-save fs-6 me-2"></i>
                    {isSubmitting ? 'Guardando...' : 'Guardar'}
                  </Button>
                </Col>
              </Row>
            </form>
          )}
        </Formik>
      </Modal.Body>
    </Modal>
  )
}
