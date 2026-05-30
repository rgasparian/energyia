import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

function SlugRedirect() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const hostname = window.location.hostname;
    const slug = window.location.pathname.replace("/", "");
    if (hostname.startsWith("consultor.")) {
      window.location.replace(`/consultor/${slug}`);
    } else if (hostname.startsWith("matrix.")) {
      window.location.replace(`/matrix/${slug}`);
    }
  }, []);
  return null;
}

export const Route = createFileRoute("/$slug")({
  component: SlugRedirect,
});

import React from "react";
