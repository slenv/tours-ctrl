import { Row, Col, Alert, Button, InputGroup } from "react-bootstrap";
import * as Yup from "yup";
import { Formik } from "formik";

import { loginAction } from "@/actions/auth.actions";
import { useAuthStore } from "@/store/auth.store";

const initialValues = {
  username: '',
  password: ''
};

const validationSchema = Yup.object().shape({
  username: Yup.string().max(255).required('Ingrese usuario'),
  password: Yup.string().max(255).required('Ingrese contraseña'),
});

const JWTLogin = () => {
  const { loading, error } = useAuthStore();

  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={values => loginAction(values)}
    >
      {({ errors, handleBlur, handleChange, handleSubmit, touched, values }) => (
        <form noValidate onSubmit={handleSubmit}>
          <div className="form-group mb-3">
            <InputGroup>
              <InputGroup.Text>
                <i className="feather icon-user"></i>
              </InputGroup.Text>
              <input
                autoFocus
                className="form-control"
                name="username"
                type="text"
                autoCorrect="off"
                autoComplete="off"
                placeholder="Usuario"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.username}
              />
            </InputGroup>
            {touched.username && errors.username && <small className="text-danger form-text">{errors.username}</small>}
          </div>
          <div className="form-group mb-4">
            <InputGroup>
              <InputGroup.Text>
                <i className="feather icon-lock"></i>
              </InputGroup.Text>
              <input
                className="form-control"
                name="password"
                type="password"
                placeholder="Contraseña"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.password}
              />
            </InputGroup>
            {touched.password && errors.password && <small className="text-danger form-text">{errors.password}</small>}
          </div>

          {error && (
            <Col sm={12}>
              <Alert variant="danger">{error}</Alert>
            </Col>
          )}

          <Row>
            <Col mt={2}>
              <Button
                className="btn-block mb-4"
                size="large"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Iniciando Sesión...' : 'Iniciar Sesión'}
              </Button>
            </Col>
          </Row>
        </form>
      )}
    </Formik>
  )
}

export default JWTLogin;
