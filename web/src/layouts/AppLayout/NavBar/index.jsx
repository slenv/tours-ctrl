import { useContext, useState } from "react";
import { Link } from "react-router-dom";

import { ConfigContext } from "@/contexts/ConfigContext";
import { VITE_APP_NAME } from "@/config/env";
import * as actionType from "@/config/layout-actions";
import NavLeft from "./NavLeft";
import NavRight from "./NavRight";

export default function NavBar() {
  const [moreToggle, setMoreToggle] = useState(false);
  const configContext = useContext(ConfigContext);
  const { collapseMenu, layout } = configContext.state;
  const { dispatch } = configContext;

  let headerClass = ['navbar', 'pcoded-header', 'navbar-expand-lg', 'header-blue', 'headerpos-fixed'];
  if (layout === 'vertical') {
    headerClass = [...headerClass, 'headerpos-fixed'];
  }

  let toggleClass = ['mobile-menu'];
  if (collapseMenu) {
    toggleClass = [...toggleClass, 'on'];
  }

  const navToggleHandler = () => {
    dispatch({ type: actionType.COLLAPSE_MENU });
  }

  let moreClass = ['mob-toggler'];
  let collapseClass = ['collapse navbar-collapse'];

  if (moreToggle) {
    moreClass = [...moreClass, 'on'];
    collapseClass = [...collapseClass, 'd-block'];
  }

  let navBar = (
    <>
      <div className="m-header">
        <Link to="#" className={toggleClass.join(' ')} id="mobile-collapse" onClick={navToggleHandler}>
          <span />
        </Link>
        <Link to="#" className="b-brand">
          <span className="b-title fw-medium">{VITE_APP_NAME}</span>
        </Link>
        <Link to="#" className={moreClass.join(' ')} onClick={() => setMoreToggle(!moreToggle)}>
          <i className="feather icon-more-vertical" />
        </Link>
      </div>
      <div style={{ justifyContent: 'end' }} className={collapseClass.join(' ')}>
        <NavLeft />
        <NavRight />
      </div>
    </>
  )

  return (
    <header className={headerClass.join(' ')} style={{ zIndex: 1009 }}>
      {navBar}
    </header>
  )
}
