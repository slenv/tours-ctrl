import { Link } from "react-router-dom";
import { ListGroup, Dropdown } from "react-bootstrap";

import { useAuthStore } from "@/store/auth.store";
import { BASE_ROUTE, ROUTE } from "@/config/routes";
import { logoutAction } from "@/actions/auth.actions";

export default function NavRight() {
  const { user } = useAuthStore();

  return (
    <ListGroup as="ul" bsPrefix=" " className="navbar-nav ml-auto">
      <ListGroup.Item as="li" bsPrefix=" ">
        <Dropdown align="end" className="drp-user">
          <Dropdown.Toggle as={Link} variant="link" to="#" id="dropdown-basic">
            <img src={user?.avatar_url} className="img-radius wid-35" alt="Avatar" />
          </Dropdown.Toggle>
          <Dropdown.Menu align="end" className="profile-notification">
            <div className="pro-head">
              <img src={user?.avatar_url} className="img-radius" alt="Avatar" />
              <span>{user?.shortname}</span>
              <Link to="#" onClick={logoutAction} className="dud-logout" title="Cerrar Sesión">
                <i className="feather icon-log-out" />
              </Link>
            </div>
            <ListGroup as="ul" bsPrefix=" " variant="flush" className="pro-body">
              <ListGroup.Item as="li" bsPrefix=" ">
                <Link to={`/${BASE_ROUTE.APP}/${ROUTE.PROFILE}`} className="dropdown-item">
                  <i className="feather icon-user" />
                  Mi Perfil
                </Link>
              </ListGroup.Item>
              <ListGroup.Item as="li" bsPrefix=" ">
                <Link to="#" className="dropdown-item">
                  <i className="feather icon-lock" />
                  Cambiar Contraseña
                </Link>
              </ListGroup.Item>
              <ListGroup.Item as="li" bsPrefix=" ">
                <Link to="#" onClick={logoutAction} className="dropdown-item">
                  <i className="feather icon-log-out" />
                  Cerrar Sesión
                </Link>
              </ListGroup.Item>
            </ListGroup>
          </Dropdown.Menu>
        </Dropdown>
      </ListGroup.Item>
    </ListGroup>
  )
}
