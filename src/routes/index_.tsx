import { createFileRoute, redirect } from "@tanstack/react-router";

// Some static hosts/Appwrite previews open `/index` instead of `/`.
// Keep that URL from showing TanStack's 404 page.
export const Route = createFileRoute("/index_")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});