import { createFileRoute } from "@tanstack/react-router";
import { useEffect } from "react";

function SlugRedirect() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    const slug = window.location.pathname.replace(/^\//, "");
    if (!slug) return;
    // Com basepath ativo, navega para /$slug que o router resolve
    // O basepath já cuida do prefixo correto
    window.history.replaceState(null, "", window.location.href);
  }, []);
  return null;
}

export const Route = createFileRoute("/$slug")({
  component: SlugRedirect,
});

import React from "react";
