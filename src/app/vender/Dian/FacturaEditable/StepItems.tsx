import React, { useState, useEffect, useContext } from "react";
import { Typography, Box, Divider, Button } from "@mui/material";
import ProductSidebar from "./ProductSidebar";
import ItemTable from "./ItemTable";
import { FacturaProviderContext } from "../context";
import InvoicesView from "./InvoicesView";
import { getInvoicesDian, getInvoicesDraft } from "@/firebase/dian";
const StepItems = ({ data, setData }: { data: any; setData: Function }) => {
  const {
    editingValues,
    setEditingValues,
    localData,
    setLocalData,
    dataEstablishmentData,
  } = useContext(FacturaProviderContext) || {};
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [drafts, setDrafts] = useState<any>([]);
  const [sentInvoices, setSentInvoices] = useState<any>([]);
  const [viewMode, setViewMode] = useState<"edit" | "invoices">("edit");

  useEffect(() => {
    if (viewMode === "invoices") {
      loadInvoices();
    }
  }, [viewMode]);

  const loadInvoices = async () => {
    const draftsData = await getInvoicesDraft();
    const sentData = await getInvoicesDian();
    setDrafts(draftsData || []);
    setSentInvoices(sentData || []);
  };

  const handleImportInvoice = (invoice: any) => {
    setLocalData(invoice);
    setViewMode("edit"); // Cambiar de vuelta a la vista de edición
  };

  const handleAddRow = (event: React.MouseEvent<HTMLButtonElement>) => {
    const generateUniqueCode = () => {
      let newCode;
      const existingCodes = localData.items.map(
        (item: { codigo: any }) => item.codigo
      );
      do {
        newCode = Math.floor(1000 + Math.random() * 9000).toString();
      } while (existingCodes.includes(newCode));

      return newCode;
    };
    const newItem = {
      codigo: generateUniqueCode(),
      detalle: "",
      cantidad: 0,
      precio: 0,
      total: 0,
    };
    const updatedItems = [...localData.items, newItem];
    setLocalData((prev: any) => ({ ...prev, items: updatedItems }));
  };

  const calculateTotal = (items: any[]) => {
    return items.reduce((acc, item) => acc + (item.total || 0), 0);
  };

  const updateLocalData = (updatedItems: any[]) => {
    const updatedTotal = calculateTotal(updatedItems);
    setLocalData((prev: any) => ({
      ...prev,
      items: updatedItems,
      total: updatedTotal,
    }));
    setData((prev: any) => ({
      ...prev,
      items: updatedItems,
      total: updatedTotal,
    }));
  };

  const handleItemEdit = (
    index: number,
    field: string,
    value: string | number
  ) => {
    setEditingValues((prev: any) => ({
      ...prev,
      [`${index}-${field}`]: value,
    }));
  };

  const handleItemBlur = (index: number, field: string) => {
    const value =
      editingValues[`${index}-${field}`] || localData.items[index][field];
    handleItemChange(index, field, value);
  };

  const handleItemChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updatedItems = [...localData.items];
    const item = updatedItems[index];
    updatedItems[index] = { ...item, [field]: value };

    if (field === "cantidad" || field === "precio") {
      updatedItems[index].total =
        (updatedItems[index].cantidad || 0) * (updatedItems[index].precio || 0);
    }

    updateLocalData(updatedItems);
  };

  const handleAddProduct = (product: any) => {
    const existingItem = localData.items.find(
      (item: { codigo: any }) => item.codigo === product.barCode
    );

    const updatedItems = existingItem
      ? localData.items.map((item: { codigo: any; cantidad: number }) =>
          item.codigo === product.barCode
            ? {
                ...item,
                cantidad: item.cantidad + 1,
                total: (item.cantidad + 1) * parseFloat(product.acc),
              }
            : item
        )
      : [
          ...localData.items,
          {
            codigo: product.barCode,
            detalle: product.productName,
            cantidad: 1,
            precio: parseFloat(product.acc),
            total: parseFloat(product.acc),
          },
        ];

    updateLocalData(updatedItems);
    setSidebarOpen(false);
  };

  const handleDeleteRow = (index: number) => {
    const updatedItems = localData.items.filter(
      (_: any, i: number) => i !== index
    );

    updateLocalData(updatedItems);

    setEditingValues((prev: any) => {
      const updatedEditingValues = { ...prev };
      Object.keys(updatedEditingValues).forEach((key) => {
        const [rowIndex] = key.split("-");
        if (parseInt(rowIndex, 10) === index) {
          delete updatedEditingValues[key];
        }
      });
      return updatedEditingValues;
    });
  };

  if (!localData) return <Typography>Cargando datos...</Typography>;
  return (
    <>
      <Box textAlign="right" mb={2}>
        <Button
          variant="contained"
          onClick={() =>
            setViewMode((prev) => (prev === "edit" ? "invoices" : "edit"))
          }
        >
          {viewMode === "edit" ? "Importar Factura" : "Volver a la Edición"}
        </Button>
      </Box>
      {viewMode === "edit" ? (
        <Box>
          <Box textAlign="center" mb={4}>
            <Typography sx={{ textTransform: "uppercase" }} variant="h4">
              {dataEstablishmentData?.nameEstablishment ?? "sin datos"}
            </Typography>
            <Typography variant="subtitle1">
              N.I.T: {dataEstablishmentData?.NIT_CC ?? "sin datos"}
            </Typography>
            <Divider sx={{ my: 2 }} />
          </Box>
          <Box
            mb={4}
            sx={{
              background: "#4d4d4d;",
              borderRadius: "10px",
              border: "1px solid #444",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
              padding: "16px",
            }}
          >
            <Box
              display="grid"
              gridTemplateColumns="repeat(auto-fit, minmax(200px, 1fr))"
              gap={2}
            >
              <Typography sx={{ color: "#bbb" }}>
                <strong style={{ color: "#fff" }}>Nombre:</strong>{" "}
                {localData?.cliente?.name || "Sin información"}
              </Typography>
              <Typography sx={{ color: "#bbb" }}>
                <strong style={{ color: "#fff" }}>Identificación:</strong>{" "}
                {localData?.cliente?.tipoDocumento || ""}:{" "}
                {localData?.cliente?.identificacion || "Sin información"}
              </Typography>
              <Typography sx={{ color: "#bbb" }}>
                <strong style={{ color: "#fff" }}>Correo:</strong>{" "}
                {localData?.cliente?.correo || "Sin información"}
              </Typography>
            </Box>
          </Box>

          <Box sx={{ background: "#4d4d4d", borderRadius: "10px" }}>
            <ItemTable
              items={localData.items}
              editingValues={editingValues}
              handleItemEdit={handleItemEdit}
              handleItemBlur={handleItemBlur}
              handleItemChange={handleItemChange}
              handleDeleteRow={handleDeleteRow}
              handleAddRow={handleAddRow}
            />
            <Typography variant="h5" textAlign="right" mt={2} marginRight={1}>
              Total: ${localData.total.toLocaleString()}
            </Typography>
          </Box>
          <ProductSidebar onAddProduct={handleAddProduct} />
        </Box>
      ) : (
        <InvoicesView
          drafts={drafts}
          sentInvoices={sentInvoices}
          onImportInvoice={handleImportInvoice}
        />
      )}
    </>
  );
};

export default StepItems;
