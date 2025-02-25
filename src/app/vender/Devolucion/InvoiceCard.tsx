import React from "react";
import { Box, Typography, Card, CardContent, Chip } from "@mui/material";

interface InvoiceCardProps {
  invoice: any;
  onSelect: (id: string) => void;
  isSelected: boolean;
}

const InvoiceCard: React.FC<InvoiceCardProps> = ({
  invoice,
  onSelect,
  isSelected,
}) => {
  return (
    <Card
      onClick={() => onSelect(invoice.uid)}
      sx={{
        mb: 2,
        cursor: "pointer",
        backgroundColor: isSelected ? "#3b3b3b" : "#252836",
        color: "#fff",
        borderRadius: "10px",
        border: isSelected ? "2px solid #69EAE2" : "none",
        width: "100%",
      }}
    >
      <CardContent>
        <Box display="flex" alignItems="center" gap={2}>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              <Chip
                label={invoice?.cliente?.name || ""}
                sx={{
                  backgroundColor: "#69EAE2",
                  textTransform: "uppercase",
                  display: invoice?.cliente?.name ? "auto" : "none",
                  position: "absolute",
                  right: "15px",
                  top: "9px",
                  borderRadius: "0 15px",
                }}
              />
              {invoice.invoice}
            </Typography>
            <Typography variant="body2" color="gray">
              {invoice.date}
            </Typography>
            <Typography variant="body1">
              {invoice.typeInvoice || "Factura"}
            </Typography>
          </Box>
        </Box>
        <Box mt={1} display="flex" justifyContent="space-between">
          <Typography variant="subtitle1">Total: ${invoice.total}</Typography>
          <Typography variant="subtitle2" color="error">
            <Chip
              sx={{
                position: "absolute",
                right: "15px",
                bottom: "25px",
                borderRadius: "15px 0",
                background:
                  invoice.status == "CANCELADO" ? "#0d5f0d" : "#720000",
                color: "aliceblue",
                fontWeight: "bold",
              }}
              label={invoice.status}
            />
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default InvoiceCard;
