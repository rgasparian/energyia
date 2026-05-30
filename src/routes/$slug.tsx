import { createFileRoute, redirect } from "@tanstack/react-router";
import { ConsultorPage } from "./consultor.$slug";
import { MatrixSlugPage } from "./matrix.$slug";

function SlugComponent() {
  if (typeof window === "undefined") return null;
  const hostname = window.location.hostname;
  if (hostname.startsWith("matrix.")) return <MatrixSlugPage />;
  if (hostname.startsWith("consultor.")) return <ConsultorPage />;
  return null;
}

export const Route = createFileRoute("/$slug")({
  beforeLoad: ({ params }) => {
    if (typeof window === "undefined") return;
    const hostname = window.location.hostname;
    if (hostname.startsWith("consultor.") || hostname.startsWith("matrix.")) return;
    throw redirect({
      to: "/consultor/$slug",
      params: { slug: params.slug },
      replace: true,
    });
  },
  component: SlugComponent,
});

import React from "react";
