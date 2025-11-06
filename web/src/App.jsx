import { BrowserRouter } from "react-router-dom";

import renderRoutes, { routes } from "@/router";

export default function App() {
  return (
    <BrowserRouter basename="/">
      {renderRoutes(routes)}
    </BrowserRouter>
  )
}