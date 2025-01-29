import React from "react";
import { Box, Typography, Card, CardContent, Avatar } from "@mui/material";
import NiceAvatar from "react-nice-avatar";

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
          <Avatar>
            {/* <NiceAvatar
              style={{ width: 40, height: 40 }}
              {...(invoice?.cliente
                ? { name: invoice?.cliente?.name }
                : { seed: invoice.invoice })}
            /> */}
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
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
            {invoice.status}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default InvoiceCard;
