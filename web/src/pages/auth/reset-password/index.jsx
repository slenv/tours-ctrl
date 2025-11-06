import { NavLink } from "react-router-dom";
import { Card, Row, Col } from "react-bootstrap";

export default function ResetPassword() {
  return (
    <>
      <div className="auth-wrapper">
        <div className="auth-content text-center">
          <Card className="borderless">
            <Row className="align-items-center text-center">
              <Col>
                <Card.Body className="card-body">
                  <h4 className="mb-3 f-w-400">Reset your password</h4>
                  <div className="input-group mb-4">
                    <input type="email" className="form-control" placeholder="Email address" />
                  </div>
                  <button className="btn btn-block btn-primary mb-4">Reset password</button>
                  <p className="mb-0 text-muted">
                    Don’t have an account?{' '}
                    <NavLink to="/auth/signup-1" className="f-w-400">
                      Signup
                    </NavLink>
                  </p>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        </div>
      </div>
    </>
  )
}
