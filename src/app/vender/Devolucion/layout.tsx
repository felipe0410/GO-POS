import { Box } from "@mui/material";
import { DevolucionProvider } from "./context";

export default function LogginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section style={{ height: "100%" }}>
      <DevolucionProvider>
        <Box>{children}</Box>
      </DevolucionProvider>
    </section>
  );
}
