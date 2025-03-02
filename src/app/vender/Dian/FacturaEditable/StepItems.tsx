import React, { useState, useEffect, useContext } from "react";
import {
  Typography,
  Box,
  Divider,
  Button,
  useMediaQuery,
  useTheme,
  IconButton,
} from "@mui/material";
import ProductSidebar from "./ProductSidebar";
import ItemTable from "./ItemTable";
import { FacturaProviderContext } from "../context";
import InvoicesView from "./InvoicesView";
import { getInvoicesDian, getInvoicesDraft } from "@/firebase/dian";
import EmailIcon from "@mui/icons-material/Email";
import PersonIcon from "@mui/icons-material/Person";
import BadgeIcon from "@mui/icons-material/Badge";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import ReplyIcon from "@mui/icons-material/Reply";
import ResponsiveTable from "./ResponsiveTable";
import InvoicesCardView from "./InvoicesCardView";
import { ExpandLess, ExpandMore } from "@mui/icons-material";

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
  const [isExpanded, setIsExpanded] = useState(true);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
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

  const handleAddRow = () => {
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
    const updatedItems = [newItem, ...localData.items];
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
    const parsedPrice = parseFloat(product.price.replace(/[^\d.-]/g, ""));

    const existingItem = localData.items.find(
      (item: { codigo: any }) => item.codigo === product.barCode
    );

    const updatedItems = existingItem
      ? localData.items.map((item: { codigo: any; cantidad: number }) =>
          item.codigo === product.barCode
            ? {
                ...item,
                cantidad: item.cantidad + 1,
                total: (item.cantidad + 1) * parsedPrice,
              }
            : item
        )
      : [
          ...localData.items,
          {
            codigo: product.barCode,
            detalle: product.productName,
            cantidad: 1,
            precio: parsedPrice,
            total: parsedPrice,
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

  useEffect(() => {
    if (localData.items.length === 0) {
      handleAddRow();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [localData]);

  if (!localData) return <Typography>Cargando datos...</Typography>;

  return (
    <>
      <Box textAlign="right" mb={2}>
        <Button
          sx={{
            position: isSmallScreen ? "fixed" : "block",
            left: "0",
            zIndex: "20",
          }}
          variant="contained"
          onClick={() =>
            setViewMode((prev) => (prev === "edit" ? "invoices" : "edit"))
          }
        >
          {viewMode === "edit" ? (
            isSmallScreen ? (
              <AttachFileIcon />
            ) : (
              "Importar Factura"
            )
          ) : isSmallScreen ? (
            <ReplyIcon />
          ) : (
            "Volver a la Edición"
          )}
        </Button>
      </Box>

      {viewMode === "edit" ? (
        <Box>
          <Box textAlign="center" mb={4}>
            <Typography
              sx={{ textTransform: "uppercase" }}
              variant={isSmallScreen ? "body2" : "h4"}
            >
              {dataEstablishmentData?.nameEstablishment ?? "sin datos"}
            </Typography>
            <Typography variant={isSmallScreen ? "subtitle2" : "subtitle1"}>
              N.I.T:{" "}
              {dataEstablishmentData?.NIT_CC ?? "sin datos, display:'flex'"}
            </Typography>
            <Divider sx={{ my: 2 }} />
          </Box>
          <Box mb={4}>
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="h6" sx={{ color: "#fff" }}>
                Información del Cliente
              </Typography>
              <IconButton
                onClick={() => setIsExpanded((prev) => !prev)}
                color="primary"
              >
                {isExpanded ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </Box>
            {isExpanded && (
              <Box
                sx={{
                  background: "#4d4d4d",
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
                  <Typography
                    variant={isSmallScreen ? "subtitle2" : "subtitle1"}
                    sx={{ color: "#bbb", display: "flex" }}
                  >
                    <strong style={{ color: "#fff" }}>
                      {isSmallScreen ? <PersonIcon /> : "Nombre:"}
                    </strong>{" "}
                    {localData?.cliente?.name || "Consumidor final"}
                  </Typography>
                  <Typography
                    variant={isSmallScreen ? "subtitle2" : "subtitle1"}
                    sx={{ color: "#bbb", display: "flex" }}
                  >
                    <strong style={{ color: "#fff" }}>
                      {isSmallScreen ? <BadgeIcon /> : "Identificación:"}
                    </strong>{" "}
                    {localData?.cliente?.tipoDocumento || ""}:{" "}
                    {localData?.cliente?.identificacion || "Consumidor final"}
                  </Typography>
                  <Typography
                    variant={isSmallScreen ? "subtitle2" : "subtitle1"}
                    sx={{ color: "#bbb", display: "flex" }}
                  >
                    <strong style={{ color: "#fff" }}>
                      {isSmallScreen ? <EmailIcon /> : "Correo:"}
                    </strong>{" "}
                    {localData?.cliente?.correo || "Consumidor final"}
                  </Typography>
                </Box>
              </Box>
            )}
          </Box>

          <Box sx={{ background: "#4d4d4d", borderRadius: "10px" }}>
            <Box display={{ lg: "none", xs: "block" }}>
              <ResponsiveTable
                items={localData.items}
                editingValues={editingValues}
                handleItemEdit={handleItemEdit}
                handleItemBlur={handleItemBlur}
                handleItemChange={handleItemChange}
                handleDeleteRow={handleDeleteRow}
                handleAddRow={handleAddRow}
              />
            </Box>
            <Box display={{ xs: "none", lg: "block" }}>
              <ItemTable
                items={localData?.items}
                editingValues={editingValues}
                handleItemEdit={handleItemEdit}
                handleItemBlur={handleItemBlur}
                handleItemChange={handleItemChange}
                handleDeleteRow={handleDeleteRow}
                handleAddRow={handleAddRow}
              />
            </Box>
            <Typography variant="h5" textAlign="right" mt={2} marginRight={1}>
              Total: ${localData.total.toLocaleString()}
            </Typography>
          </Box>
          <ProductSidebar
            items={localData?.items}
            onAddProduct={handleAddProduct}
          />
        </Box>
      ) : (
        <Box>
          <Box display={{ xs: "none", lg: "block" }}>
            <InvoicesView
              drafts={drafts}
              sentInvoices={sentInvoices}
              onImportInvoice={handleImportInvoice}
            />
          </Box>
          <Box display={{ lg: "none", xs: "block" }}>
            <InvoicesCardView
              drafts={drafts}
              sentInvoices={sentInvoices}
              onImportInvoice={handleImportInvoice}
            />
          </Box>
        </Box>
      )}
    </>
  );
};

export default StepItems;
