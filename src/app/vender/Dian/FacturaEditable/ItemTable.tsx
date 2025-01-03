import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Box,
  TableContainer,
  Typography,
  Menu,
  MenuItem,
  TextField,
} from "@mui/material";
import {
  Add,
  Delete,
  ExpandLess,
  ExpandMore,
  MoreVert,
} from "@mui/icons-material";
import { NumericFormat } from "react-number-format";

const ItemTable = ({
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
  const [isExpanded, setIsExpanded] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);

  const toggleExpand = () => {
    setIsExpanded((prev) => !prev);
  };

  const handleMenuOpen = (
    event: React.MouseEvent<HTMLElement>,
    rowIndex: number
  ) => {
    setAnchorEl(event.currentTarget);
    setSelectedRow(rowIndex);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedRow(null);
  };

  const applyTransformation = (type: string) => {
    if (selectedRow === null) return;
    const currentValue = items[selectedRow].detalle || "";
    let transformedValue = currentValue;

    if (type === "uppercase") {
      transformedValue = currentValue.toUpperCase();
    } else if (type === "lowercase") {
      transformedValue = currentValue.toLowerCase();
    } else if (type === "capitalize") {
      transformedValue = currentValue
        .split(" ")
        .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ");
    }

    handleItemChange(selectedRow, "detalle", transformedValue);
    handleMenuClose();
  };

  const isInvalid = (value: number) => isNaN(value) || value <= 0;

  return (
    <Box
      sx={{
        maxHeight: isExpanded ? "90vh" : "500px",
        overflowY: "auto",
        borderRadius: "8px",
        transition: "max-height 0.3s ease",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 1,
        }}
      >
        <Typography variant="h6">Items</Typography>
        <IconButton onClick={handleAddRow} color="primary">
          <Add />
        </IconButton>
        <IconButton onClick={toggleExpand} color="primary">
          {isExpanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>
      <TableContainer
        sx={{ maxHeight: isExpanded ? "85vh" : "30vh", overflowY: "auto" }}
      >
        <Table stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: "5%" }}>#</TableCell>
              <TableCell style={{ width: "15%" }}>Código</TableCell>
              <TableCell style={{ width: "40%" }}>Detalle</TableCell>
              <TableCell style={{ width: "10%" }}>Cantidad</TableCell>
              <TableCell style={{ width: "15%" }}>Precio</TableCell>
              <TableCell style={{ width: "15%" }}>Total</TableCell>
              <TableCell style={{ width: "5%" }} align="center">
                Acciones
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item: any, index: number) => (
              <TableRow key={index}>
                <TableCell>{index + 1}</TableCell>
                <TableCell>
                  <TextField
                    value={editingValues[`${index}-codigo`] ?? item.codigo}
                    onChange={(e) =>
                      handleItemEdit(index, "codigo", e.target.value)
                    }
                    onBlur={() => handleItemBlur(index, "codigo")}
                    fullWidth
                    variant="outlined"
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  <Box sx={{ display: "flex", alignItems: "center" }}>
                    <TextField
                      value={item.detalle}
                      onChange={(e) =>
                        handleItemChange(index, "detalle", e.target.value)
                      }
                      fullWidth
                      variant="outlined"
                      size="small"
                    />
                    <IconButton
                      onClick={(e) => handleMenuOpen(e, index)}
                      size="small"
                      sx={{ ml: 1 }}
                    >
                      <MoreVert />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell>
                  <TextField
                    value={item.cantidad}
                    onChange={(e) =>
                      handleItemChange(index, "cantidad", +e.target.value)
                    }
                    type="number"
                    fullWidth
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderColor: isInvalid(item.cantidad) ? "red" : "inherit",
                      },
                    }}
                    error={isInvalid(item.cantidad)}
                  />
                </TableCell>
                <TableCell>
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
                      "& .MuiOutlinedInput-root": {
                        borderColor: isInvalid(item.precio) ? "red" : "inherit",
                      },
                    }}
                    error={isInvalid(item.precio)}
                  />
                </TableCell>
                <TableCell>${item.total.toLocaleString()}</TableCell>
                <TableCell align="center">
                  <IconButton
                    onClick={() => handleDeleteRow(index)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
      >
        <MenuItem onClick={() => applyTransformation("uppercase")}>
          Pasar a Mayúsculas
        </MenuItem>
        <MenuItem onClick={() => applyTransformation("lowercase")}>
          Pasar a Minúsculas
        </MenuItem>
        <MenuItem onClick={() => applyTransformation("capitalize")}>
          Capitalizar
        </MenuItem>
      </Menu>
    </Box>
  );
};

export default ItemTable;
