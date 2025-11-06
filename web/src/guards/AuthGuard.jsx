import { Navigate } from "react-router-dom";

import { useAuthStore } from "@/store/auth.store";
import { BASE_ROUTE, ROUTE } from "@/config/routes";
import { bootstrapUserAction } from "@/actions/auth.actions";
import Loader from "@/components/Loader/Loader";

bootstrapUserAction();

export default function AuthGuard({ children }) {
  const { user, loading } = useAuthStore();

  if (loading) return <Loader />;

  return !user?.id
    ? <Navigate to={`/${BASE_ROUTE.AUTH}/${ROUTE.SIGNIN}`} />
    : children;
}
