import { lazy, useContext, useEffect, useRef } from "react";
import { Toaster } from "sonner";

import useWindowSize from "@/hooks/useWindowSize";
import useOutsideClick from "@/hooks/useOutsideClick";
import { ConfigContext, ConfigProvider } from "@/contexts/ConfigContext";
import * as actionType from "@/config/layout-actions";

const Navigation = lazy(() => import('./Navigation'));
const NavBar = lazy(() => import('./NavBar'));


const Layout = ({ children }) => {
  const windowSize = useWindowSize();
  const ref = useRef();
  const configContext = useContext(ConfigContext);

  const { collapseMenu, layout } = configContext.state;
  const { dispatch } = configContext;

  useOutsideClick(ref, () => {
    if (collapseMenu) {
      dispatch({ type: actionType.COLLAPSE_MENU });
    }
  })

  useEffect(() => {
    if (windowSize.width > 992 && windowSize.width <= 1024) {
      dispatch({ type: actionType.COLLAPSE_MENU });
    }

    if (windowSize.width < 992) {
      dispatch({ type: actionType.CHANGE_LAYOUT, layout: 'vertical' });
    }
  }, [dispatch, layout, windowSize])

  const mobileOutClickHandler = () => {
    if (windowSize.width < 992 && collapseMenu) {
      dispatch({ type: actionType.COLLAPSE_MENU });
    }
  }

  let mainClass = ['pcoded-wrapper'];

  let common = (
    <>
      <Navigation />
      <NavBar />
    </>
  )

  if (windowSize.width < 992) {
    let outSideClass = ['nav-outside'];
    if (collapseMenu) {
      outSideClass = [...outSideClass, 'mob-backdrop'];
    }
    outSideClass = [...outSideClass, 'mob-fixed'];

    common = (
      <div className={outSideClass.join(' ')} ref={ref}>
        {common}
      </div>
    )
  }

  return (
    <>
      {common}
      <div className="pcoded-main-container" onClick={() => mobileOutClickHandler} onKeyDown={() => mobileOutClickHandler}>
        <div className={mainClass.join(' ')}>
          <div className="pcoded-content">
            <div className="pcoded-inner-content">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default function AppLayout({ children }) {
  return (
    <>
      <Toaster closeButton richColors position="top-center" />
      <ConfigProvider>
        <Layout>
          {children}
        </Layout>
      </ConfigProvider>
    </>
  )
}
