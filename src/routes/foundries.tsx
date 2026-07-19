import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/foundries")({
  beforeLoad: ({ location }) => {
    if (location.pathname.replace(/\/$/, "") === "/foundries") {
      throw redirect({ to: "/", hash: "catalogue", search: { view: "sources" } });
    }
  },
  component: Outlet,
});
