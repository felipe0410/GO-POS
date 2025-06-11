"use client";

import React from "react";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Box, Chip, Button, Typography, Paper } from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InvoiceDialog from "./InvoiceDialog";

const InvoiceTable = ({ data, isDarkMode = true }: { data: any[]; isDarkMode?: boolean }) => {
  const [selectedClient, setSelectedClient] = React.useState<any | null>(null);

  const totalFacturas = data.length;
  const facturasPagadas = data.filter((item) => item.estado_facturas?.toLowerCase() === "pagadas").length;
  const facturasPendientes = totalFacturas - facturasPagadas;
  const valorRecaudado = data.reduce((sum, item) => sum + (item.estado_facturas?.toLowerCase() === "pagadas" ? parseFloat(item.precio_plan || 0) : 0), 0);
  const valorPorRecaudar = data.reduce((sum, item) => sum + (item.estado_facturas?.toLowerCase() !== "pagadas" ? parseFloat(item.precio_plan || 0) : 0), 0);

  const columns: GridColDef[] = [
    {
      field: "index",
      headerName: "#",
      width: 60,
      valueGetter: (_, row) => row.index + 1,
      headerClassName: "custom-header",
    },
    {
      field: "nombre",
      headerName: "Cliente",
      flex: 1,
      minWidth: 150,
      headerClassName: "custom-header",
    },
    {
      field: "telefono",
      headerName: "Teléfono",
      flex: 1,
      minWidth: 130,
      headerClassName: "custom-header",
    },
    {
      field: "estado",
      headerName: "Estado",
      flex: 1,
      minWidth: 100,
      headerClassName: "custom-header",
    },
    {
      field: "plan",
      headerName: "Plan",
      flex: 1,
      minWidth: 150,
      valueGetter: (value, row) => row.plan_internet?.nombre || "-",
      headerClassName: "custom-header",
    },
    {
      field: "precio_plan",
      headerName: "Precio del Plan",
      flex: 1,
      minWidth: 150,
      valueGetter: (value, row) => `$${parseFloat(row.precio_plan || 0).toLocaleString()}`,
      headerClassName: "custom-header",
    },
    {
      field: "estado_facturas",
      headerName: "Estado Factura",
      flex: 1,
      minWidth: 140,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value?.toLowerCase() === "pagadas" ? "success" : "error"}
          size="small"
        />
      ),
      headerClassName: "custom-header",
    },
    {
      field: "acciones",
      headerName: "Acciones",
      flex: 1,
      minWidth: 140,
      sortable: false,
      renderCell: (params) => (
        <Button
          variant="text"
          startIcon={<VisibilityIcon />}
          sx={{ color: isDarkMode ? "#69EAE2" : "#1E88E5" }}
          onClick={() => setSelectedClient(params.row)}
        >
          Ver más
        </Button>
      ),
      headerClassName: "custom-header",
    },
  ];

  const rows = data.map((item, index) => ({ ...item, index }));

  const cardStyles = (backgroundColor: string, borderColor: string) => ({
    padding: "20px",
    flex: "1 1 calc(20% - 15px)",
    background: backgroundColor,
    color: "#FFF",
    textAlign: "center",
    borderRadius: "12px",
    border: `2px solid ${borderColor}`,
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
    transition: "transform 0.2s, box-shadow 0.2s",
    "&:hover": {
      transform: "scale(1.05)",
      boxShadow: "0 6px 12px rgba(0, 0, 0, 0.3)",
    },
  });

  const titleStyles = {
    fontSize: "1rem",
    fontWeight: 500,
    textTransform: "uppercase",
    color: "#BDBDBD",
  };

  const numberStyles = {
    fontSize: "2.5rem",
    fontWeight: 700,
    color: "#FFF",
  };

  return (
    <Box
      sx={{
        backgroundColor: isDarkMode ? "#1F1D2B" : "#FFFFFF",
        padding: 2,
        borderRadius: 2,
        marginLeft:{xs:'auto',lg:'-25px'},
        marginRight:{xs:'auto', lg: '30px'}
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "20px",
          flexWrap: "wrap",
          gap: "15px",
        }}
      >
        <Paper sx={cardStyles("#212121", "#69EAE2")}>
          <Typography variant="h6" sx={titleStyles}>
            Total Facturas
          </Typography>
          <Typography variant="h3" sx={numberStyles}>
            {totalFacturas}
          </Typography>
        </Paper>
        <Paper sx={cardStyles("#2C1E1E", "#4CAF50")}>
          <Typography variant="h6" sx={titleStyles}>
            Facturas Pagadas
          </Typography>
          <Typography variant="h3" sx={numberStyles}>
            {facturasPagadas}
          </Typography>
        </Paper>
        <Paper sx={cardStyles("#2E2720", "#D32F2F")}>
          <Typography variant="h6" sx={titleStyles}>
            Pendientes
          </Typography>
          <Typography variant="h3" sx={numberStyles}>
            {facturasPendientes}
          </Typography>
        </Paper>
        <Paper sx={cardStyles("#1C2C1E", "#81C784")}>
          <Typography variant="h6" sx={titleStyles}>
            Valor Recaudado
          </Typography>
          <Typography variant="h3" sx={numberStyles}>
            ${valorRecaudado.toLocaleString()}
          </Typography>
        </Paper>
        <Paper sx={cardStyles("#1C1E2C", "#FFB74D")}>
          <Typography variant="h6" sx={titleStyles}>
            Por Recaudar
          </Typography>
          <Typography variant="h3" sx={numberStyles}>
            ${valorPorRecaudar.toLocaleString()}
          </Typography>
        </Paper>
      </Box>

      <Box
        sx={{
          height: 600,
          width: "100%",
          "& .custom-header": {
            backgroundColor: isDarkMode ? "#333333" : "#F5F5F5",
            color: isDarkMode ? "#69EAE2" : "#000000",
            fontWeight: "bold",
          },
        }}
      >
        <DataGrid
          rows={rows}
          columns={columns}
          getRowId={(row) => row.id_servicio || row.cedula || row.index}
          pageSizeOptions={[50,100 ,150]}
          initialState={{ pagination: { paginationModel: { page: 0, pageSize: 10 } } }}
          sx={{
            border: 0,
            color: isDarkMode ? "#FFFFFF" : "#000000",
            "& .MuiDataGrid-toolbarContainer, & .MuiDataGrid-footerContainer": {
              backgroundColor: isDarkMode ? "#1F1D2B" : "#FFF",
              color: isDarkMode ? "#FFFFFF" : "#000000",
            },
            "& .MuiSelect-select, & .MuiInputBase-input": {
              color: isDarkMode ? "#FFFFFF" : "#000000",
            },
            "& .MuiSvgIcon-root": {
              color: isDarkMode ? "#FFFFFF" : "#000000",
            },
            "& .MuiTablePagination-displayedRows, & .MuiTablePagination-selectLabel": {
              color: isDarkMode ? "#FFFFFF" : "#000000",
            },
            "& .MuiDataGrid-columnSeparator": {
              display: "none",
            },
          }}
        />

        {selectedClient && (
          <InvoiceDialog
            open={!!selectedClient}
            client={selectedClient}
            onClose={() => setSelectedClient(null)}
          />
        )}
      </Box>
    </Box>
  );
};

export default InvoiceTable;
