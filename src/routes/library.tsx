import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/library")({
  beforeLoad: () => {
    throw redirect({ to: "/", hash: "catalogue", search: { view: "typefaces" } });
  },
  component: () => null,
});
