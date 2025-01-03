import { Box } from "@mui/material";
import { FacturaProvider } from "./context";

export default function LogginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section style={{ height: "100%" }}>
      <FacturaProvider>
        <Box
          sx={{
            height: "100%",
          }}
        >
          {children}
        </Box>
      </FacturaProvider>
    </section>
  );
}
