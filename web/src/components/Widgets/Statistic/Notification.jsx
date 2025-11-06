import { useContext } from "react";
import { Alert } from "react-bootstrap";
import AlertLink from "react-bootstrap/AlertLink";

import { ConfigContext } from "@/contexts/ConfigContext";

export default function Notification(props) {
  const configContext = useContext(ConfigContext);
  const { layoutType } = configContext.state;

  return (
    <Alert variant="warning">
      {props.message}
      <AlertLink href={props.link} target="_blank" className="float-end" style={{ color: layoutType === 'dark' ? 'black' : 'initial' }}>
        Demo & Documentation
      </AlertLink>
    </Alert>
  )
}
