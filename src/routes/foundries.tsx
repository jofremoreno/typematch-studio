import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/foundries")({
  beforeLoad: () => {
    throw redirect({ to: "/catalogue", search: { view: "sources" } });
  },
  component: () => null,
});
