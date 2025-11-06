import { VITE_APP_DESCRIPTION, VITE_APP_NAME } from "@/config/env";

export default function PageTitle({ title, children }) {
  return (
    <>
      <title>{`${title} | ${VITE_APP_NAME} | ${VITE_APP_DESCRIPTION}`}</title>
      {children}
    </>
  )
}