import { createFileRoute, redirect } from "@tanstack/react-router";
import { z } from "zod";

const searchSchema = z.object({
  view: z.enum(["typefaces", "sources"]).optional(),
});

export const Route = createFileRoute("/catalogue")({
  validateSearch: searchSchema,
  beforeLoad: ({ search }) => {
    throw redirect({
      to: "/",
      hash: "catalogue",
      search: { view: search.view ?? "typefaces" },
    });
  },
  component: () => null,
});
