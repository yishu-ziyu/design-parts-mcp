import { createFileRoute } from "@tanstack/react-router";
import { PartsPreview } from "@/components/parts-preview";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return <PartsPreview />;
}
