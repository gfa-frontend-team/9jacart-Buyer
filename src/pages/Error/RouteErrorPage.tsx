import React, { useEffect } from "react";
import { isRouteErrorResponse, useRouteError } from "react-router-dom";
import { ErrorState } from "@/components/UI/ErrorState";

/** Router `errorElement`: replaces React Router's default developer error screen. */
const RouteErrorPage: React.FC = () => {
  const error = useRouteError();

  useEffect(() => {
    console.error("Route error:", error);
  }, [error]);

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <ErrorState kind="notfound" />;
  }

  return <ErrorState error={error} />;
};

export default RouteErrorPage;
