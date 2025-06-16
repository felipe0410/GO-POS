import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Box,
  Pagination,
  LinearProgress,
  Typography,
  IconButton,
  Chip,
} from "@mui/material";
import SettingsIcon from "@mui/icons-material/Settings";
import { updateProductData } from "@/firebase";
import OptimalQuantityDialog from "./OptimalQuantityDialog";

interface ProductsTableProps {
  columns: any[];
  paginatedData: any[];
  sortConfig: { key: string; direction: "asc" | "desc" } | null;
  onSort: (key: string) => void;
  onPageChange: (page: number) => void;
  totalPages: number;
  proveedoresData: any[];
}

const ProductsTable: React.FC<ProductsTableProps> = ({
  columns,
  paginatedData,
  sortConfig,
  onSort,
  onPageChange,
  totalPages,
  proveedoresData
}) => {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const handleOpenDialog = (product: any) => {
    setSelectedProduct(product);
    setDialogOpen(true);
  };

  const handleSaveQuantity = async (quantity: number) => {
    if (selectedProduct) {
      // Actualizar la cantidad óptima en la base de datos
      await updateProductData(selectedProduct.barCode, {
        optimice_cant: quantity,
      });
      setDialogOpen(false);
    }
  };

  const getProveedorName = (nit: string) => {
    const proveedor = proveedoresData.find((p) => p.nit === nit);
    return proveedor?.nombre || nit;
  };


  return (
    <Box>
      <TableContainer sx={{ maxHeight: "80%", background: "#1F1D2B" }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map(
                (column) =>
                  column.visible && (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                      sx={{
                        background: "#1F1D2B",
                        color: "#69EAE2",
                        fontFamily: "Nunito",
                        fontSize: "0.8rem",
                        fontWeight: 800,
                        borderColor: "#69EAE2",
                      }}
                    >
                      {column.id !== "image" ? (
                        <TableSortLabel
                          active={sortConfig?.key === column.id}
                          direction={
                            sortConfig?.key === column.id
                              ? sortConfig?.direction
                              : "asc"
                          }
                          onClick={() => onSort(column.id)}
                        >
                          {column.label}
                        </TableSortLabel>
                      ) : (
                        column.label
                      )}
                    </TableCell>
                  )
              )}
              <TableCell
                align="center"
                sx={{
                  background: "#1F1D2B",
                  color: "#69EAE2",
                  fontFamily: "Nunito",
                  fontSize: "0.8rem",
                  fontWeight: 800,
                  borderColor: "#69EAE2",
                }}
              >
                PROVEEDORES
              </TableCell>
              {/* Nueva columna: Cantidad Óptima */}
              <TableCell
                align="center"
                sx={{
                  background: "#1F1D2B",
                  color: "#69EAE2",
                  fontFamily: "Nunito",
                  fontSize: "0.8rem",
                  fontWeight: 800,
                  borderColor: "#69EAE2",
                }}
              >
                CANTIDAD ÓPTIMA
              </TableCell>
              <TableCell
                align="center"
                sx={{
                  background: "#1F1D2B",
                  color: "#69EAE2",
                  fontFamily: "Nunito",
                  fontSize: "0.8rem",
                  fontWeight: 800,
                  borderColor: "#69EAE2",
                }}
              >
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedData.map((row) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.uid}>
                {columns.map(
                  (column) =>
                    column.visible && (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        sx={{ color: "#FFF", borderColor: "#69EAE2" }}
                      >
                        {column.id === "image" ? (
                          <Box
                            component="img"
                            src={row.image}
                            alt={row.productName}
                            sx={{
                              width: "60px",
                              height: "60px",
                              borderRadius: "4px",
                            }}
                          />
                        ) : column.id === "cantidad" ? (
                          <Box>
                            <LinearProgress
                              variant="determinate"
                              value={Math.min(
                                100,
                                (row.cantidad / (row?.optimice_cant ?? 100)) *
                                100
                              )}
                              color={
                                row.cantidad === 0
                                  ? "error"
                                  : (row.cantidad /
                                    (row?.optimice_cant ?? 100)) *
                                    100 <=
                                    20
                                    ? "error"
                                    : (row.cantidad /
                                      (row?.optimice_cant ?? 100)) *
                                      100 <=
                                      70
                                      ? "warning"
                                      : "success"
                              }
                            />
                            <Typography
                              variant="caption"
                              sx={{ color: "#FFF" }}
                            >
                              {row.cantidad} unidades
                            </Typography>
                          </Box>
                        ) : (
                          row[column.id]
                        )}
                      </TableCell>
                    )
                )}
                <TableCell align="center" sx={{ color: "#FFF", borderColor: "#69EAE2" }}>
                  {row.proveedores && row.proveedores.length > 0 ? (
                    row.proveedores.map((nit: string, index: number) => (
                      <Chip
                        key={index}
                        label={getProveedorName(nit)}
                        sx={{
                          backgroundColor: "gray",
                          color: "#FFF",
                          width: '140px',
                          height: '15px'
                        }}
                      />
                    ))
                  ) : (
                    <Typography variant="caption" sx={{ color: "#FFF" }}>
                      Sin proveedor
                    </Typography>
                  )}
                </TableCell>

                {/* Mostrar la cantidad óptima */}
                <TableCell
                  align="center"
                  sx={{ color: "#FFF", borderColor: "#69EAE2" }}
                >
                  {row?.optimice_cant ? (
                    <Chip
                      label={`Cantidad: ${row.optimice_cant}`}
                      sx={{
                        backgroundColor: "#69EAE2",
                        color: "#1F1D2B",
                        fontWeight: 600,
                        borderRadius: "8px",
                        padding: "2px 8px",
                        fontSize: "0.9rem",
                      }}
                    />
                  ) : (
                    <Chip
                      label="No configurado"
                      sx={{
                        backgroundColor: "#D32F2F",
                        color: "#FFF",
                        fontWeight: 600,
                        borderRadius: "8px",
                        padding: "2px 8px",
                        fontSize: "0.9rem",
                      }}
                    />
                  )}
                </TableCell>
                <TableCell align="center" sx={{ borderColor: "#69EAE2" }}>
                  <IconButton
                    onClick={() => handleOpenDialog(row)}
                    sx={{
                      color: "#69EAE2",
                      "&:hover": {
                        color: "#FFF",
                      },
                    }}
                  >
                    <SettingsIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Box
        id="pagination"
        sx={{
          filter: "invert(1)",
          display: "flex",
          justifyContent: "center",
          marginTop: "25px",
          width: { xs: "115%", sm: "100%" },
          marginLeft: { xs: "-15px", sm: "0" },
        }}
      >
        <Pagination
          sx={{ color: "#fff" }}
          onChange={(e, page) => onPageChange(page)}
          count={totalPages}
          shape="circular"
        />
      </Box>
      {selectedProduct && (
        <OptimalQuantityDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSave={handleSaveQuantity}
          productName={selectedProduct.productName}
        />
      )}
    </Box>
  );
};

export default ProductsTable;
