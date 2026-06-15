import { Navigate } from "react-router-dom";

import { useSelector } from "react-redux";

function ProtectedRoute({
  children,
  allowedRoles,
}) {

  const {
    isAuthenticated,
    role,
  } = useSelector(
    (state) => state.auth
  );

  // Not Logged In
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // Unauthorized
  if (
    allowedRoles &&
    !allowedRoles.includes(role)
  ) {
    return (
      <Navigate to="/unauthorized" />
    );
  }

  return children;
}

export default ProtectedRoute;