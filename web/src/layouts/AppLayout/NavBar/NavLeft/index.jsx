import { ListGroup } from "react-bootstrap";

import NavSearch from "./NavSearch";

export default function NavLeft() {
  return (
    <ListGroup as="ul" bsPrefix=" " className="navbar-nav me-auto">
      <ListGroup.Item as="li" bsPrefix=" " className="nav-item">
        <NavSearch />
      </ListGroup.Item>
    </ListGroup>
  )
}
