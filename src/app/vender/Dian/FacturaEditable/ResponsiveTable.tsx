import React, { useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  IconButton,
  TextField,
  Collapse,
  Chip,
} from "@mui/material";
import { Delete, ExpandMore, ExpandLess, Add } from "@mui/icons-material";
import { NumericFormat } from "react-number-format";

const ResponsiveTableMobile = ({
  items,
  editingValues,
  handleItemEdit,
  handleItemBlur,
  handleItemChange,
  handleDeleteRow,
  handleAddRow,
}: {
  items: any[];
  editingValues: any;
  handleItemEdit: Function;
  handleItemBlur: Function;
  handleItemChange: Function;
  handleDeleteRow: Function;
  handleAddRow: any;
}) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  const isInvalid = (value: any) =>
    value === "" || value === null || value === 0;

  return (
    <>
      <Box>
        <IconButton onClick={handleAddRow} color="primary">
          <Add />
        </IconButton>
      </Box>
      <Grid container spacing={2}>
        {items.map((item, index) => (
          <Grid item xs={12} key={index}>
            <Card
              sx={{
                backgroundColor: "#1E1E1E",
                color: "#fff",
                borderRadius: 2,
                border: isInvalid(item.detalle) ? "2px solid red" : "none",
              }}
            >
              <CardContent>
                <Box
                  display="flex"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
                    Item #{index + 1}
                    <Chip
                      sx={{ marginLeft: "10px" }}
                      label={item.cantidad}
                      color={item.cantidad > 0 ? "success" : "warning"}
                      variant="outlined"
                    />
                  </Typography>
                  <IconButton onClick={() => toggleExpand(index)} size="small">
                    {expandedIndex === index ? (
                      <ExpandLess sx={{ color: "#69EAE2" }} />
                    ) : (
                      <ExpandMore sx={{ color: "#69EAE2" }} />
                    )}
                  </IconButton>
                </Box>

                {/* Detalle resumido */}
                <Box mt={1}>
                  <Typography variant="body2" color="text.secondary">
                    Detalle:
                  </Typography>
                  <TextField
                    value={item.detalle}
                    onChange={(e) =>
                      handleItemChange(index, "detalle", e.target.value)
                    }
                    fullWidth
                    variant="outlined"
                    size="small"
                    sx={{
                      mt: 1,
                      "& .MuiOutlinedInput-root": {
                        borderColor: isInvalid(item.detalle) ? "red" : "inherit",
                      },
                    }}
                    error={isInvalid(item.detalle)}
                  />
                </Box>

                {/* Sección Expandible */}
                <Collapse in={expandedIndex === index}>
                  <Box mt={2}>
                    <Typography variant="body2" color="text.secondary">
                      Código:
                    </Typography>
                    <TextField
                      value={editingValues[`${index}-codigo`] ?? item.codigo}
                      onChange={(e) =>
                        handleItemEdit(index, "codigo", e.target.value)
                      }
                      onBlur={() => handleItemBlur(index, "codigo")}
                      fullWidth
                      variant="outlined"
                      size="small"
                      sx={{
                        mt: 1,
                        "& .MuiOutlinedInput-root": {
                          borderColor: isInvalid(item.codigo) ? "red" : "inherit",
                        },
                      }}
                      error={isInvalid(item.codigo)}
                    />
                  </Box>

                  <Grid container spacing={1} mt={1}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Cantidad:
                      </Typography>
                      <TextField
                        value={item.cantidad === 0 ? "" : item.cantidad} // Permite mostrar vacío en lugar de 0
                        onChange={(e) => {
                          const value = e.target.value;
                          handleItemChange(
                            index,
                            "cantidad",
                            value === "" ? "" : +value
                          );
                        }}
                        type="number"
                        fullWidth
                        variant="outlined"
                        size="small"
                        sx={{
                          mt: 1,
                          "& .MuiOutlinedInput-root": {
                            borderColor: isInvalid(item.cantidad) ? "red" : "inherit",
                          },
                        }}
                        error={isInvalid(item.cantidad)}
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Precio:
                      </Typography>
                      <NumericFormat
                        value={item.precio}
                        thousandSeparator
                        prefix="$ "
                        decimalSeparator="."
                        allowNegative={false}
                        onValueChange={(values) =>
                          handleItemChange(index, "precio", +values.value)
                        }
                        customInput={TextField}
                        fullWidth
                        variant="outlined"
                        size="small"
                        sx={{
                          mt: 1,
                          "& .MuiOutlinedInput-root": {
                            borderColor: isInvalid(item.precio) ? "red" : "inherit",
                          },
                        }}
                        error={isInvalid(item.precio)}
                      />
                    </Grid>
                  </Grid>
                </Collapse>

                <Box display="flex" justifyContent="space-between" mt={2}>
                  <IconButton
                    onClick={() => handleDeleteRow(index)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                  <Box mt={2} textAlign="right">
                    <Typography variant="body1" color="text.secondary">
                      Total: <strong>${item.total.toLocaleString()}</strong>
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default ResponsiveTableMobile;
