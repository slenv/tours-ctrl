import { useEffect, useState } from "react";
import { Button, Col, FloatingLabel, FormCheck, FormControl, Modal, Row } from "react-bootstrap";
import * as Yup from "yup";
import { Formik } from "formik";
import { toast } from "sonner";

import { useModalStore } from "@/store/modal.store";
import { useDynamicRefs } from "@/hooks/useDynamicRefs";
import { saveVehicle } from "@/services/vehicle.services";

export default function VehicleModal({ modalKey = 'vehicle-modal', onSuccess }) {
  const { getModalStatus, getModalData, closeModal } = useModalStore();
  const { getRef } = useDynamicRefs();

  const isOpen = getModalStatus(modalKey);
  const vehicle = getModalData(modalKey);

  const [ownerChecked, setOwnerChecked] = useState(vehicle?.owner ? false : true);

  const validationSchema = Yup.object().shape({
    plate: Yup.string().length(6, 'Debe tener 6 dígitos').required('Ingrese No. Placa'),
    color: Yup.string().max(100).required('Ingrese Color'),
    seats: Yup.number().integer('Debe ser un número entero').required('Ingrese No. Asientos'),
    brand: Yup.string().max(150).required('Ingrese Marca'),
    model: Yup.string().max(150).required('Ingrese Modelo'),
    owner: Yup.string()
      .max(255)
      .nullable()
      .when([], {
        is: () => !ownerChecked,
        then: (schema) => schema.required('Ingrese Propietario'),
        otherwise: (schema) => schema.nullable(),
      }),
  });

  const initialValues = {
    id: vehicle?.id || null,
    plate: vehicle?.plate || '',
    color: vehicle?.color || '',
    seats: vehicle?.seats || '',
    brand: vehicle?.brand || '',
    model: vehicle?.model || '',
    owner: vehicle?.owner || '',
  };

  useEffect(() => {
    if (isOpen) getRef('plate').current?.focus();
  }, [isOpen]);

  const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
    setSubmitting(true);
    try {
      await saveVehicle({ ...values, owner: !ownerChecked ? values.owner : null });
      toast.success('Vehículo guardado correctamente');
      resetForm();
      closeModal(modalKey);
      onSuccess && onSuccess();
    } catch (error) {
      setErrors(error.response?.data?.errors);
    } finally {
      setSubmitting(false);
    }
  };

  const handleOwnerCheck = () => {
    setOwnerChecked(prev => !prev);
    setTimeout(() => getRef('owner').current?.focus(), 50)
  };

  const handleCloseModal = () => {
    closeModal(modalKey);
  };

  return (
    <Modal centered show={isOpen} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title className="fs-6 fw-medium">
          {vehicle?.id ? <i className="feather icon-edit me-2"></i> : <i className="feather icon-plus-circle me-2"></i>}
          {vehicle?.id ? 'Editar vehículo' : 'Nuevo vehículo'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, touched, values, isSubmitting }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Row className="g-3">
                <Col xs={4}>
                  <FloatingLabel label="No. Placa">
                    <FormControl
                      size="sm"
                      type="text"
                      className="text-uppercase"
                      placeholder="No. Placa"
                      autoCorrect="off"
                      autoComplete="off"
                      name="plate"
                      value={values.plate}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      maxLength={6}
                      isInvalid={touched.plate && errors.plate}
                      ref={getRef('plate')}
                    />
                    <FormControl.Feedback type="invalid">{errors.plate}</FormControl.Feedback>
                  </FloatingLabel>
                </Col>
                <Col xs={4}>
                  <FloatingLabel label="No. Asientos">
                    <FormControl
                      size="sm"
                      type="number"
                      placeholder="No. Asientos"
                      autoCorrect="off"
                      autoComplete="off"
                      name="seats"
                      value={values.seats}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      min={1}
                      maxLength={6}
                      isInvalid={touched.seats && errors.seats}
                    />
                    <FormControl.Feedback type="invalid">{errors.seats}</FormControl.Feedback>
                  </FloatingLabel>
                </Col>
                <Col xs={4}>
                  <FloatingLabel label="Color">
                    <FormControl
                      size="sm"
                      type="text"
                      placeholder="Color"
                      autoCorrect="off"
                      autoComplete="off"
                      name="color"
                      value={values.color}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.color && errors.color}
                    />
                    <FormControl.Feedback type="invalid">{errors.color}</FormControl.Feedback>
                  </FloatingLabel>
                </Col>
                <Col xs={6}>
                  <FloatingLabel label="Marca">
                    <FormControl
                      size="sm"
                      type="text"
                      placeholder="Marca"
                      autoCorrect="off"
                      autoComplete="off"
                      name="brand"
                      value={values.brand}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.brand && errors.brand}
                    />
                    <FormControl.Feedback type="invalid">{errors.brand}</FormControl.Feedback>
                  </FloatingLabel>
                </Col>
                <Col xs={6}>
                  <FloatingLabel label="Modelo">
                    <FormControl
                      size="sm"
                      type="text"
                      placeholder="Modelo"
                      autoCorrect="off"
                      autoComplete="off"
                      name="model"
                      value={values.model}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.model && errors.model}
                    />
                    <FormControl.Feedback type="invalid">{errors.model}</FormControl.Feedback>
                  </FloatingLabel>
                </Col>
                <Col xs={12}>
                  <div className="d-flex align-items-center gap-3 mb-1 mt-1">
                    <label className="m-0">¿El vehículo le pertenece a la empresa?</label>
                    <FormCheck
                      type="switch"
                      label={ownerChecked ? 'Sí' : 'No'}
                      checked={ownerChecked}
                      onChange={handleOwnerCheck}
                    />
                  </div>
                  {ownerChecked ? (
                    <div className="border rounded-2 p-3 text-center bg-white text-muted">
                      Propiedad de la empresa
                    </div>
                  ) : (
                    <FloatingLabel label="Propietario">
                      <FormControl
                        size="sm"
                        type="text"
                        placeholder="Propietario"
                        autoCorrect="off"
                        autoComplete="off"
                        name="owner"
                        value={values.owner}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.owner && errors.owner}
                        ref={getRef('owner')}
                      />
                      <FormControl.Feedback type="invalid">{errors.owner}</FormControl.Feedback>
                    </FloatingLabel>
                  )}
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
