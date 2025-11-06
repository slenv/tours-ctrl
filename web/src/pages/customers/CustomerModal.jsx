import { useEffect } from "react";
import { Button, Col, FloatingLabel, FormControl, FormSelect, Modal, Row } from "react-bootstrap";
import * as Yup from "yup";
import { Formik } from "formik";
import { toast } from "sonner";

import { useModalStore } from "@/store/modal.store";
import { DOC_TYPE, DOC_TYPE_ABBREVIATION, DOC_TYPE_SIZE, DOC_TYPE_LABEL } from "@/constants/doc-type";
import { useDynamicRefs } from "@/hooks/useDynamicRefs";
import { saveCustomer } from "@/services/customer.services";
import { byCe, byDni, byRuc } from "@/services/identity.services";

const validationSchema = Yup.object().shape({
  doc_number: Yup.string()
    .when('doc_type_code', (doc_type_code, schema) => {
      if (String(doc_type_code) === DOC_TYPE.NONE) return schema.notRequired();
      const length = DOC_TYPE_SIZE[doc_type_code];
      return schema.length(length, `Debe tener ${length} dígitos`)
        .required('Ingrese No. Documento');
    }),
  firstname: Yup.string()
    .when('doc_type_code', (doc_type_code, schema) => {
      if (String(doc_type_code) === DOC_TYPE.RUC) return schema.notRequired();
      return schema.required('Ingrese Nombres');
    }),
  lastname: Yup.string()
    .when('doc_type_code', (doc_type_code, schema) => {
      if (String(doc_type_code) === DOC_TYPE.RUC) return schema.notRequired();
      return schema.required('Ingrese Apellidos');
    }),
  business_name: Yup.string()
    .when('doc_type_code', (doc_type_code, schema) => {
      if (String(doc_type_code) !== DOC_TYPE.RUC) return schema.notRequired();
      return schema.required('Ingrese Razón Social');
    }),
  phone: Yup.string().nullable(),
  email: Yup.string().email('Ingrese un correo válido').nullable(),
  address: Yup.string().nullable()
});

export default function CustomerModal({ modalKey = 'customer-modal', onSuccess }) {
  const { getModalStatus, getModalData, closeModal } = useModalStore();
  const { getRef } = useDynamicRefs();

  const isOpen = getModalStatus(modalKey);
  const customer = getModalData(modalKey);
  const initialValues = {
    id: customer?.id || null,
    doc_type_code: customer?.doc_type_code || DOC_TYPE.DNI,
    doc_number: customer?.doc_number || '',
    firstname: customer?.firstname || '',
    lastname: customer?.lastname || '',
    business_name: customer?.business_name || '',
    phone: customer?.phone || '',
    email: customer?.email || '',
    address: customer?.address || '',
  };

  useEffect(() => {
    if (isOpen) {
      getRef('doc_type_code').current?.focus();
      getRef('doc_type_code').current?.click();
    }
  }, [isOpen]);

  const handleSearchClick = async ({ values, setFieldValue, setFieldTouched, setStatus }) => {
    setStatus({ searching: true });
    let data = null;
    try {
      if (values.doc_type_code === DOC_TYPE.DNI) {
        data = await byDni(values.doc_number);
      } else if (values.doc_type_code === DOC_TYPE.CE) {
        data = await byCe(values.doc_number);
      } else if (values.doc_type_code === DOC_TYPE.RUC) {
        data = await byRuc(values.doc_number);
      }

      if (!data) return;
      for (const key in data) {
        setFieldValue(key, data[key] || '');
        setFieldTouched(key, false);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error buscando');
    } finally {
      setStatus({ searching: false });
    }
  }

  const onSubmit = async (values, { setSubmitting, setErrors, resetForm }) => {
    setSubmitting(true);
    try {
      await saveCustomer(values);
      toast.success('Cliente guardado correctamente');
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
          {customer?.id ? <i className="feather icon-edit me-2"></i> : <i className="feather icon-user-plus me-2"></i>}
          {customer?.id ? 'Editar cliente' : 'Nuevo cliente'}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ errors, handleBlur, handleChange, handleSubmit, isSubmitting, touched, values, setFieldValue, setFieldTouched, setStatus, status }) => (
            <form noValidate onSubmit={handleSubmit}>
              <Row className="g-3">
                <Col xs={12}>
                  <FloatingLabel label="Tipo Documento">
                    <FormSelect
                      size="sm"
                      className="border bg-white"
                      name="doc_type_code"
                      value={values.doc_type_code}
                      onChange={e => {
                        handleChange(e);
                        setFieldValue('doc_number', '');
                        setFieldValue('firstname', '');
                        setFieldValue('lastname', '');
                        setFieldValue('business_name', '');
                        setFieldValue('address', '');
                        setFieldTouched('doc_number', false);
                      }}
                      onClick={e => {
                        if (e.target.value === DOC_TYPE.NONE) {
                          getRef('firstname').current.focus();
                        } else {
                          getRef('doc_number').current.focus();
                        }
                      }}
                      ref={getRef('doc_type_code')}
                    >
                      {Object.values(DOC_TYPE).map(v => (
                        <option key={v} value={v}>
                          {DOC_TYPE_ABBREVIATION[v]} - {DOC_TYPE_LABEL[v]}
                        </option>
                      ))}
                    </FormSelect>
                  </FloatingLabel>
                </Col>
                <Col xs={8}>
                  <FloatingLabel label="No. Documento">
                    <FormControl
                      size="sm"
                      type="text"
                      className="text-uppercase"
                      placeholder="No. Documento"
                      autoCorrect="off"
                      autoComplete="off"
                      name="doc_number"
                      value={values.doc_number}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          getRef('person_by_doc_number').current.click();
                        }
                      }}
                      maxLength={DOC_TYPE_SIZE[values.doc_type_code]}
                      isInvalid={touched.doc_number && errors.doc_number}
                      disabled={values.doc_type_code === DOC_TYPE.NONE}
                      ref={getRef('doc_number')}
                    />
                    <FormControl.Feedback type="invalid">{errors.doc_number}</FormControl.Feedback>
                  </FloatingLabel>
                </Col>
                <Col xs={4}>
                  <Button
                    variant="dark"
                    className="w-100 py-3"
                    type="button"
                    disabled={values.doc_type_code === DOC_TYPE.NONE
                      || values.doc_number.length !== DOC_TYPE_SIZE[values.doc_type_code]
                      || status?.searching
                      || isSubmitting
                    }
                    onClick={() => handleSearchClick({ values, setFieldValue, setFieldTouched, setStatus })}
                    ref={getRef('person_by_doc_number')}
                  >
                    <i className="feather icon-search fs-6 me-2"></i>
                    {status?.searching ? 'Buscando...' : 'Buscar'}
                  </Button>
                </Col>
                {values.doc_type_code === DOC_TYPE.RUC ? (
                  <Col xs={12}>
                    <FloatingLabel label="Razón Social">
                      <FormControl
                        size="sm"
                        type="text"
                        className="text-uppercase"
                        placeholder="Razón Social"
                        autoCorrect="off"
                        autoComplete="off"
                        maxLength="255"
                        name="business_name"
                        value={values.business_name}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isInvalid={touched.business_name && errors.business_name}
                        ref={getRef('business_name')}
                      />
                      <FormControl.Feedback type="invalid">{errors.business_name}</FormControl.Feedback>
                    </FloatingLabel>
                  </Col>
                ) : (
                  <>
                    <Col lg={6}>
                      <FloatingLabel label="Nombres">
                        <FormControl
                          size="sm"
                          type="text"
                          className="text-uppercase"
                          placeholder="Nombres"
                          autoCorrect="off"
                          autoComplete="off"
                          maxLength="255"
                          name="firstname"
                          value={values.firstname}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.firstname && errors.firstname}
                          ref={getRef('firstname')}
                        />
                        <FormControl.Feedback type="invalid">{errors.firstname}</FormControl.Feedback>
                      </FloatingLabel>
                    </Col>
                    <Col lg={6}>
                      <FloatingLabel label="Apellidos">
                        <FormControl
                          size="sm"
                          type="text"
                          className="text-uppercase"
                          placeholder="Apellidos"
                          autoCorrect="off"
                          autoComplete="off"
                          maxLength="255"
                          name="lastname"
                          value={values.lastname}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isInvalid={touched.lastname && errors.lastname}
                        />
                        <FormControl.Feedback type="invalid">{errors.lastname}</FormControl.Feedback>
                      </FloatingLabel>
                    </Col>
                  </>
                )}
                <Col xs={12}>
                  <FloatingLabel label="Dirección">
                    <FormControl
                      size="sm"
                      type="text"
                      placeholder="Dirección"
                      autoCorrect="off"
                      autoComplete="off"
                      maxLength="255"
                      name="address"
                      value={values.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.address && errors.address}
                    />
                    <FormControl.Feedback type="invalid">{errors.address}</FormControl.Feedback>
                  </FloatingLabel>
                </Col>
                <Col xs={6}>
                  <FloatingLabel label="Celular">
                    <FormControl
                      size="sm"
                      type="text"
                      placeholder="Celular"
                      autoCorrect="off"
                      autoComplete="off"
                      maxLength="255"
                      name="phone"
                      value={values.phone}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.phone && errors.phone}
                    />
                    <FormControl.Feedback type="invalid">{errors.phone}</FormControl.Feedback>
                  </FloatingLabel>
                </Col>
                <Col xs={6}>
                  <FloatingLabel label="Correo Electrónico">
                    <FormControl
                      size="sm"
                      type="text"
                      placeholder="Correo Electrónico"
                      autoCorrect="off"
                      autoComplete="off"
                      maxLength="255"
                      name="email"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isInvalid={touched.email && errors.email}
                      disabled={isSubmitting}
                    />
                    <FormControl.Feedback type="invalid">{errors.email}</FormControl.Feedback>
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
