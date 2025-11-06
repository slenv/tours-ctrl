import { Navigate, NavLink } from "react-router-dom";
import { Card } from "react-bootstrap";

import { useAuthStore } from "@/store/auth.store";
import { BASE_ROUTE, ROUTE } from "@/config/routes";
import AuthLogin from "./JWTLogin";
import PageTitle from "@/components/Common/PageTitle";

export default function Signin() {
  const auth = useAuthStore();

  if (auth.user?.id) {
    return <Navigate to={`/${BASE_ROUTE.APP}/${ROUTE.DASHBOARD}`} replace />
  }

  return (
    <>
      <PageTitle title="Inicio de Sesión" />
      <div className="auth-wrapper">
        <div className="auth-content">
          <div className="auth-bg">
            <span className="r" />
            <span className="r s" />
            <span className="r s" />
            <span className="r" />
          </div>
          <Card className="borderless text-center">
            <Card.Body>
              <h4 className="mb-3 f-w-400">Iniciar Sesión</h4>
              <AuthLogin />
              <p className="mb-2 text-muted">
                ¿Olvidaste tu contraseña?
                <NavLink to={`/${BASE_ROUTE.AUTH}/${ROUTE.RESET_PASSWORD}`} className="f-w-400 ms-1">
                  Restablecer
                </NavLink>
              </p>
            </Card.Body>
          </Card>
        </div>
      </div>
    </>
  )
}
