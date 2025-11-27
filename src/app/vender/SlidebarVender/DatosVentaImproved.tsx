"use client";
import { dataInputs } from "@/data/inputs";
import {
  Button,
  Divider,
  FormControl,
  IconButton,
  MenuItem,
  OutlinedInput,
  Select,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {
  createClient,
  createInvoice,
  getAllClientsData,
  getInvoiceData,
  updateInvoice,
} from "@/firebase";
import LinearBuffer from "../../../components/progress";
import Box from "@mui/material/Box";
import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Slider from "../../../components/slider/Slider";
import { v4 as uuidv4 } from "uuid";
import { SnackbarProvider } from "notistack";
import { useCookies } from "react-cookie";

// Hooks mejorados
import { useCartInventoryIntegration } from "@/hooks/useInventoryUpdates";
import { useNotification } from "@/hooks/useNotification";
import { useAsyncOperation } from "@/hooks/useAsyncOperation";
import { performanceLogger } from "@/utils/performanceLogger";
import { quickSaleCache } from "@/utils/quickSaleCache";
// import { useOfflineIntegration } from "@/hooks/useOfflineSales"; // DESHABILITADO: Sistema offline para revisión posterior

interface UserData {
  name: string;
  direccion: string;
  email: string;
  identificacion: string;
  celular: string;
  [key: string]: any;
}

const metodosDePago = ["Efectivo", "Transferencia", "Datáfono", 'Mixto'];

const DatosVentaImproved = (props: any) => {
  const [data, setData] = useState<UserData>({
    name: "",
    direccion: "",
    email: "",
    identificacion: "",
    celular: "",
  });
  
  const {
    total,
    selectedItems,
    subtotal,
    descuento,
    loading,
    setLoading,
    setReciboPago,
    numeroFactura,
    handleVenderClick,
    propsNota,
    typeInvoice,
  } = props;

  // Hooks mejorados
  const { processSaleWithInventoryUpdate, loading: inventoryLoading } = useCartInventoryIntegration();
  const { success, error: notifyError } = useNotification();
  // const { processSaleWithOfflineSupport, isOnline } = useOfflineIntegration(); // DESHABILITADO: Sistema offline
  const isOnline = true; // Forzar modo online

  const [options, setOptions] = useState([""]);
  const [valueClient, setValueClient] = React.useState<string | null>(options[0]);
  const [vrMixta, setVrMixta] = useState({
    efectivo: 0,
    transferencia: 0,
  });
  const [inputValue, setInputValue] = React.useState("");
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [valorRecibido, setValorRecibido] = useState<number | null>(null);
  const [mostrarValorDevolver, setMostrarValorDevolver] = useState(true);
  const [datosGuardados, setDatosGuardados] = useState(false);
  const [clientsData, setClientsData] = useState([]);
  const themee = useTheme();
  const matches = useMediaQuery(themee.breakpoints.up("sm"));

  const [factura, setFactura] = useState({
    invoice: "",
    date: "",
    status: "CANCELADO",
    vendedor: "xxx",
    cliente: {
      name: "",
      direccion: "",
      email: "",
      identificacion: "",
      celular: "",
    },
    compra: [],
    subtotal: 0,
    descuento: 0,
    total: 0,
    cambio: 0,
    createBy: "",
    nota: propsNota ?? "",
    closeInvoice: false,
    paymentMethod: "Efectivo",
  });
  const [cookies, setCookie] = useCookies(["invoice_token"]);

  // Operación asíncrona para procesar venta (online) - PARALELIZADA
  const processOnlineSale = async (saleData: any) => {
    const operationId = `sale-${Date.now()}`;
    performanceLogger.start(operationId, 'Proceso Completo de Venta (Paralelo)', {
      items: selectedItems.length,
      total: saleData.total,
      typeInvoice
    });

    try {
      // 1. Obtener ID del establecimiento
      performanceLogger.checkpoint(operationId, 'Inicio - Obtener datos usuario');
      const userData = localStorage.getItem("dataUser");
      if (!userData) {
        throw new Error("No se encontró información del usuario");
      }

      const parsedData = JSON.parse(userData);
      const establishmentId = decodeBase64(parsedData.uid);
      performanceLogger.checkpoint(operationId, 'Usuario obtenido', { establishmentId });

      // 2. PARALELIZACIÓN: Ejecutar factura e inventario simultáneamente
      performanceLogger.checkpoint(operationId, '🚀 Iniciando procesos en paralelo');
      const parallelStartTime = performance.now();

      // Preparar datos de factura
      const valueUuid = uuidv4();
      const bloques = valueUuid.split("-");
      const result = bloques.slice(0, 2).join("-");
      const invoiceId = `${saleData.invoice}-${result}`;
      localStorage.setItem("uidInvoice", invoiceId);

      // Ejecutar en paralelo con Promise.allSettled
      const [invoiceResult, inventoryResult] = await Promise.allSettled([
        // Proceso 1: Crear factura (PRIORITARIO)
        (async () => {
          performanceLogger.checkpoint(operationId, '📄 Iniciando creación de factura');
          const invoiceStartTime = performance.now();
          
          if (saleData.descuento > 0) {
            await createInvoice(invoiceId, saleData);
          } else if (typeInvoice === "quickSale") {
            await handleQuickSaleFinal(saleData.compra);
          } else {
            await createInvoice(invoiceId, { ...saleData, vrMixta });
          }

          const invoiceDuration = performance.now() - invoiceStartTime;
          performanceLogger.checkpoint(operationId, '✅ Factura creada', { 
            duration: invoiceDuration.toFixed(2) + 'ms',
            invoiceId 
          });

          return { invoiceId, duration: invoiceDuration };
        })(),

        // Proceso 2: Actualizar inventario (EN BACKGROUND)
        (async () => {
          performanceLogger.checkpoint(operationId, '📦 Iniciando actualización de inventario (background)');
          const inventoryStartTime = performance.now();
          
          const inventoryUpdated = await processSaleWithInventoryUpdate(
            establishmentId,
            selectedItems
          );
          
          const inventoryDuration = performance.now() - inventoryStartTime;
          performanceLogger.checkpoint(operationId, inventoryUpdated ? '✅ Inventario actualizado' : '⚠️ Inventario con errores', { 
            duration: inventoryDuration.toFixed(2) + 'ms',
            success: inventoryUpdated 
          });

          if (!inventoryUpdated) {
            console.warn("⚠️ Hubo problemas actualizando el inventario, pero la venta se completó");
          }

          return { inventoryUpdated, duration: inventoryDuration };
        })()
      ]);

      const parallelDuration = performance.now() - parallelStartTime;

      // Analizar resultados
      const invoiceSuccess = invoiceResult.status === 'fulfilled';
      const inventorySuccess = inventoryResult.status === 'fulfilled';

      const invoiceData = invoiceSuccess ? invoiceResult.value : null;
      const inventoryData = inventorySuccess ? inventoryResult.value : null;

      performanceLogger.checkpoint(operationId, '🏁 Procesos paralelos completados', {
        parallelDuration: parallelDuration.toFixed(2) + 'ms',
        invoiceSuccess,
        inventorySuccess,
        invoiceTime: invoiceData?.duration.toFixed(2) + 'ms',
        inventoryTime: inventoryData?.duration.toFixed(2) + 'ms'
      });

      // La factura es crítica, si falla lanzamos error
      if (!invoiceSuccess) {
        throw new Error('Error crítico creando factura: ' + (invoiceResult.reason?.message || 'Unknown error'));
      }

      // El inventario no es crítico, solo advertimos
      if (!inventorySuccess) {
        console.error('⚠️ Error actualizando inventario (no crítico):', inventoryResult.reason);
        // TODO: Agregar a cola de retry
      }

      performanceLogger.end(operationId, { 
        invoiceId: invoiceData?.invoiceId, 
        inventoryUpdated: inventoryData?.inventoryUpdated || false,
        parallelTime: parallelDuration.toFixed(2) + 'ms',
        invoiceTime: invoiceData?.duration.toFixed(2) + 'ms',
        inventoryTime: inventoryData?.duration.toFixed(2) + 'ms',
        strategy: 'parallel'
      });

      return { 
        invoiceId: invoiceData?.invoiceId, 
        inventoryUpdated: inventoryData?.inventoryUpdated || false 
      };
    } catch (error) {
      performanceLogger.end(operationId, { 
        error: error instanceof Error ? error.message : 'Unknown error',
        strategy: 'parallel'
      });
      throw error;
    }
  };

  // Operación asíncrona para procesar venta (con soporte offline)
  const { execute: processSale, loading: processingSale } = useAsyncOperation(
    async (saleData: any) => {
      const userData = localStorage.getItem("dataUser");
      if (!userData) {
        throw new Error("No se encontró información del usuario");
      }

      const parsedData = JSON.parse(userData);
      const establishmentId = decodeBase64(parsedData.uid);

      // SISTEMA OFFLINE DESHABILITADO - Solo procesamiento online normal
      await processOnlineSale(saleData);
      
      /* 
      TODO: REVISAR SISTEMA OFFLINE
      // Procesar venta con sistema inteligente online/offline
      if (isOnline) {
        try {
          // Intentar procesamiento online primero
          await processOnlineSale(saleData);
        } catch (onlineError) {
          console.warn('⚠️ Error en procesamiento online, pero no por conectividad:', onlineError);
          // Si el error no es de conectividad, no usar offline como fallback
          throw onlineError;
        }
      } else {
        // Solo usar offline si realmente no hay conexión
        console.log('🔄 Sin conexión detectada, procesando venta offline');
        const success = await processSaleWithOfflineSupport(
          saleData,
          selectedItems,
          establishmentId,
          async () => {
            await processOnlineSale(saleData);
          }
        );

        if (!success) {
          throw new Error("Error procesando la venta offline");
        }
      }
      */

      return { success };
    }
  );

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    const hours = String(now.getHours()).padStart(2, "0");
    const minutes = String(now.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day} ${hours}:${minutes}`;
  };

  const vender = async () => {
    try {
      setLoading(true);
      
      // Usar la nueva función que incluye actualización de inventario (PARALELA)
      await processSale(factura);
      
      setLoading(false);
      setReciboPago(true);
      setDatosGuardados(false);
      handleVenderClick();
      
      // Mensaje de éxito - la venta siempre se completa
      success("✅ Venta completada exitosamente");
      
    } catch (error) {
      console.error("Error procesando venta:", error);
      setLoading(false);
      notifyError(error instanceof Error ? error.message : "Error procesando la venta");
    }
  };

  const datosGuardadosLocalStorage = () => {
    const dataWithDefaults = {
      name: data.name || "XXXX",
      direccion: data.direccion || "XXXX",
      email: data.email || "XXXX",
      identificacion: data.identificacion || "XXXX",
      celular: data.celular || "XXXX",
    };

    const datosCliente = JSON.stringify(dataWithDefaults);
    localStorage.setItem("cliente", datosCliente);
    localStorage.setItem("invoice", numeroFactura);
    setDatosGuardados(true);
    
    const userData = localStorage.getItem("dataUser");
    if (userData) {
      try {
        const parsedData = JSON.parse(userData);
        const decodedUid = decodeBase64(parsedData.uid);
        setFactura({
          ...factura,
          createBy: decodedUid,
          invoice: numeroFactura,
          total,
          subtotal,
          date: getCurrentDateTime(),
          descuento,
          cliente: dataWithDefaults,
          compra: selectedItems.map((item: any) => ({
            productName: item.productName,
            cantidad: item.cantidad,
            acc: item.acc,
            barCode: item.barCode,
          })),
        });
      } catch (error) {
        console.error("❌ Error al parsear `dataUser`:", error);
      }
    }
  };

  const inputOnChange = (field: string, value: string) => {
    setData({ ...data, [field]: value });
  };

  const handleChangeRecibido = (value: string) => {
    const numericValue = parseFloat(value.replace(/[^\d.]/g, ""));
    setValorRecibido(isNaN(numericValue) ? null : numericValue);
  };

  const calcularValorADevolver = () => {
    const cambio = valorRecibido !== null ? Math.max(valorRecibido - total, 0) : 0;
    return cambio;
  };

  const calcularValorADevolverOnblur = () => {
    const cambio = valorRecibido !== null ? Math.max(valorRecibido - total, 0) : 0;
    setFactura({ ...factura, cambio: cambio });
  };

  const handleQuickSaleFinal = async (newItems: any[]) => {
    const quickSaleOperationId = `quick-sale-${Date.now()}`;
    performanceLogger.start(quickSaleOperationId, 'Quick Sale Final', {
      itemCount: newItems.length,
      paymentMethod: metodoPago
    });

    try {
      performanceLogger.checkpoint(quickSaleOperationId, 'Generando ID de factura rápida');
      const quickSaleId = `${metodoPago?.toUpperCase() === "MIXTO"
        ? "vr-mixta"
        : metodoPago?.toUpperCase() === "TRANSFERENCIA"
          ? "vr-transferencia"
          : "venta-rapida"
        }-${new Date().toLocaleDateString("en-GB").replace(/\//g, "-")}`;
      
      performanceLogger.checkpoint(quickSaleOperationId, 'Obteniendo factura existente (con caché)', { quickSaleId });
      const getInvoiceStart = performance.now();
      
      // Usar caché para obtener la factura
      const existingInvoice = await quickSaleCache.getOrFetch(
        quickSaleId,
        () => getInvoiceData(quickSaleId)
      );
      
      const getInvoiceDuration = performance.now() - getInvoiceStart;
      performanceLogger.checkpoint(quickSaleOperationId, 'Factura obtenida', { 
        duration: getInvoiceDuration.toFixed(2) + 'ms',
        exists: !!existingInvoice,
        fromCache: getInvoiceDuration < 10 // Si es < 10ms, probablemente vino del caché
      });
      
      let updatedItems = [...newItems];
      let newTotal = 0;
      
      if (existingInvoice) {
        performanceLogger.checkpoint(quickSaleOperationId, 'Procesando factura existente - merge de items');
        const mergeStart = performance.now();
        
        updatedItems = existingInvoice.compra.map(
          (item: { barCode: any; cantidad: any; acc: any }) => {
            const foundItem = newItems.find(
              (newItem) => newItem.barCode === item.barCode
            );
            if (foundItem) {
              item.cantidad += foundItem.cantidad;
              item.acc += foundItem.acc;
              return item;
            }
            return item;
          }
        );

        newItems.forEach((newItem) => {
          const existingProduct = existingInvoice.compra.find(
            (item: { barCode: any }) => item.barCode === newItem.barCode
          );

          if (!existingProduct) {
            updatedItems.push(newItem);
          }
        });

        const updatedVrMixta = existingInvoice.vrMixta
          ? {
            efectivo: (existingInvoice.vrMixta.efectivo || 0) + vrMixta.efectivo,
            transferencia: (existingInvoice.vrMixta.transferencia || 0) + vrMixta.transferencia,
          }
          : vrMixta;

        newTotal = updatedItems.reduce((total, item) => total + item.acc, 0);
        
        const mergeDuration = performance.now() - mergeStart;
        performanceLogger.checkpoint(quickSaleOperationId, 'Items mergeados', {
          duration: mergeDuration.toFixed(2) + 'ms',
          totalItems: updatedItems.length
        });
        
        performanceLogger.checkpoint(quickSaleOperationId, 'Actualizando factura existente');
        const updateStart = performance.now();
        
        const updatedInvoiceData = {
          compra: updatedItems,
          subtotal: newTotal,
          total: newTotal,
          date: getCurrentDateTime(),
          vrMixta: updatedVrMixta
        };
        
        await updateInvoice(quickSaleId, updatedInvoiceData);
        
        // Actualizar caché con los nuevos datos
        quickSaleCache.update(quickSaleId, {
          ...existingInvoice,
          ...updatedInvoiceData
        });
        
        const updateDuration = performance.now() - updateStart;
        performanceLogger.checkpoint(quickSaleOperationId, 'Factura actualizada y caché sincronizado', {
          duration: updateDuration.toFixed(2) + 'ms'
        });
      } else {
        performanceLogger.checkpoint(quickSaleOperationId, 'Creando nueva factura rápida');
        const createStart = performance.now();
        
        const now = new Date();
        const colombiaDate = new Intl.DateTimeFormat("es-CO", {
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
          timeZone: "America/Bogota",
        }).format(now);
        const formattedDate = colombiaDate.replace(
          /(\d+)\/(\d+)\/(\d+), (\d+):(\d+)/,
          "$3-$2-$1 $4:$5"
        );
        newTotal = newItems.reduce((total, item) => total + item.acc, 0);
        
        const newInvoiceData = {
          typeInvoice: "VENTA RAPIDA",
          compra: newItems,
          subtotal: newTotal,
          total: newTotal,
          date: formattedDate,
          invoice: quickSaleId,
          status: "CANCELADO",
          paymentMethod: metodoPago,
          vrMixta
        };
        
        await createInvoice(quickSaleId, newInvoiceData);
        
        // Guardar en caché la nueva factura
        quickSaleCache.update(quickSaleId, newInvoiceData);
        
        const createDuration = performance.now() - createStart;
        performanceLogger.checkpoint(quickSaleOperationId, 'Factura creada y guardada en caché', {
          duration: createDuration.toFixed(2) + 'ms'
        });
      }

      performanceLogger.end(quickSaleOperationId, {
        success: true,
        quickSaleId,
        total: newTotal
      });
    } catch (error) {
      performanceLogger.end(quickSaleOperationId, {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      throw error;
    }
  };

  useEffect(() => {
    if (typeInvoice === "quickSale") {
      datosGuardadosLocalStorage();
      setDatosGuardados(true);
    } else {
      getAllClientsData(setClientsData);
    }
  }, [typeInvoice]);

  useEffect(() => {
    if (clientsData.length > 0) {
      const array: any = [];
      clientsData.map((e: any) => {
        array.push(e.name);
      });
      setOptions(array);
    }
  }, [clientsData]);

  const decodeBase64 = (encodedString: string): string => {
    try {
      return atob(encodedString);
    } catch (error) {
      console.error("❌ Error al decodificar UID:", error);
      return "";
    }
  };

  const isLoading = loading || processingSale || inventoryLoading;

  return isLoading ? (
    <Box sx={{ textAlign: 'center', py: 4 }}>
      <LinearBuffer />
      <Typography sx={{ color: '#69EAE2', mt: 2, fontFamily: 'Nunito' }}>
        {inventoryLoading ? 'Actualizando inventario...' : 'Procesando venta...'}
      </Typography>
    </Box>
  ) : (
    <>
      <SnackbarProvider />
      <Typography
        sx={{
          color: "#69EAE2",
          fontFamily: "Nunito",
          fontSize: { xs: "20px", sm: "1.25rem" },
          fontStyle: "normal",
          fontWeight: 800,
          lineHeight: "140%",
          marginTop: "1rem",
          textAlign: "center",
          display: typeInvoice === "quickSale" ? "none" : "block",
        }}
      >
        DATOS DEL CLIENTE
      </Typography>
      <Divider sx={{ background: "#69EAE2", width: "100%" }} />

      <Box sx={{ display: typeInvoice === "quickSale" ? "none" : "block" }}>
        {datosGuardados ? (
          <>
            <IconButton
              sx={{ paddingLeft: 0 }}
              onClick={() => setDatosGuardados(false)}
            >
              <ChevronLeftIcon sx={{ color: "#69EAE2" }} />
              <Typography
                sx={{
                  color: "#69EAE2",
                  fontFamily: "Nunito",
                  fontSize: "0.875rem",
                  fontStyle: "normal",
                  fontWeight: 500,
                  lineHeight: "140%",
                }}
              >
                Editar Datos
              </Typography>
            </IconButton>
            <Box sx={{ textAlign: "center", marginTop: "2rem" }}>
              <Box component={"img"} src={"/images/exito.svg"} />
              <Typography
                sx={{
                  color: "#69EAE2",
                  fontFamily: "Nunito",
                  fontSize: "0.875rem",
                  fontStyle: "normal",
                  fontWeight: 600,
                  lineHeight: "140%",
                  marginTop: "5px",
                }}
              >
                DATOS GUARDADOS CON EXITO
              </Typography>
            </Box>
          </>
        ) : (
          <>
            <Box>
              <Autocomplete
                sx={{
                  height: { xs: "35px", sm: "auto" },
                }}
                style={{
                  marginTop: "20px",
                  color: "#FFF",
                  borderRadius: "0.5rem",
                  background: "#2C3248",
                  boxShadow:
                    "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                  width: "100%",
                }}
                value={valueClient}
                onChange={(event: any, newValue: string | null) => {
                  setValueClient(newValue);
                  const clients: any =
                    clientsData?.find((e: any) => e.name === newValue) ?? [];
                  Object.values(clients).length > 0
                    ? setData(clients)
                    : setData({
                      name: "",
                      direccion: "",
                      email: "",
                      identificacion: "",
                      celular: "",
                    });
                }}
                inputValue={inputValue}
                onInputChange={(event, newInputValue) => {
                  setInputValue(newInputValue);
                }}
                options={options}
                renderInput={(params) => (
                  <TextField
                    placeholder="  clientes registrados"
                    variant="standard"
                    sx={{ filter: "invert(1)", paddingLeft: "15px" }}
                    style={{ color: "red", filter: "invert(1)" }}
                    {...params}
                  />
                )}
              />
            </Box>
            {dataInputs.map((input, index) => {
              const style = {
                width: input.width,
                marginTop: { xs: "15px", sm: "27px" },
                marginLeft: {
                  sm:
                    input.width === "45%" && [4].includes(index) ? "10%" : "0",
                },
              };
              return (
                <React.Fragment key={index}>
                  <FormControl sx={style} variant="outlined">
                    <OutlinedInput
                      value={data[input.field]}
                      onChange={(e) =>
                        inputOnChange(input.field, e.target.value)
                      }
                      placeholder={input.name}
                      type={input.type}
                      sx={{ height: { xs: "30px", sm: "2.5rem" } }}
                      style={{
                        color: "#FFF",
                        borderRadius: "0.5rem",
                        background: "#2C3248",
                        boxShadow:
                          "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                      }}
                    />
                  </FormControl>
                </React.Fragment>
              );
            })}
          </>
        )}
        <Box
          sx={{
            textAlign: "center",
            display: datosGuardados ? "none" : "flex",
            justifyContent: "space-between",
          }}
        >
          <Button
            onClick={datosGuardadosLocalStorage}
            sx={{
              borderRadius: "0.5rem",
              background: "#69EAE2",
              marginTop: "1.5rem",
              width: "45%",
            }}
          >
            <Typography
              sx={{
                color: "#1F1D2B",
                fontFamily: "Nunito",
                fontSize: "0.875rem",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "140%",
              }}
            >
              Continuar
            </Typography>
          </Button>
          <Button
            disabled={Object.values(data).some((e) => e.length === 0)}
            onClick={() => {
              createClient(data.identificacion, data);
              datosGuardadosLocalStorage();
            }}
            sx={{
              borderRadius: "0.5rem",
              background: Object.values(data).some((e) => e.length === 0)
                ? "gray"
                : "#69EAE2",
              marginTop: "1.5rem",
              width: "45%",
            }}
          >
            <Typography
              sx={{
                color: "#1F1D2B",
                fontFamily: "Nunito",
                fontSize: "0.875rem",
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "140%",
              }}
            >
              Guardar
            </Typography>
          </Button>
        </Box>
      </Box>

      <Typography
        sx={{
          color: "#69EAE2",
          fontFamily: "Nunito",
          fontSize: { xs: "20px", sm: "1.25rem" },
          fontStyle: "normal",
          fontWeight: 800,
          lineHeight: "140%",
          marginTop: "1rem",
          textAlign: "center",
        }}
      >
        DATOS DE FACTURACIÓN
      </Typography>
      <Divider sx={{ background: "#69EAE2", width: "100%" }} />
      
      <Select
        onChange={(e: any) => {
          setMetodoPago(e.target.value);
          setFactura({ ...factura, paymentMethod: e.target.value });
          setMostrarValorDevolver(!(e.target.value === 'Mixto'))
        }}
        value={metodoPago}
        displayEmpty
        style={{
          color: metodoPago === "" ? "var(--text-light, #ABBBC2)" : "#69EAE2",
        }}
        sx={{
          marginTop: "1.5rem",
          ".MuiSelect-icon": { color: "#69EAE2" },
          width: "100%",
          height: "2.5rem",
          borderRadius: "0.5rem",
          background: "#2C3248",
          boxShadow:
            "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
        }}
      >
        {metodosDePago.map((metodo) => (
          <MenuItem key={metodo} value={metodo}>
            {metodo}
          </MenuItem>
        ))}
      </Select>

      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          marginTop: "1.5rem",
        }}
      >
        <Typography
          sx={{
            color: "#69EAE2",
            fontFamily: "Nunito",
            fontSize:
              typeInvoice === "quickSale"
                ? { xs: "18px", sm: "1.5rem" }
                : { xs: "16px", sm: "1rem" },
            fontStyle: "normal",
            fontWeight: 800,
            lineHeight: "140%",
          }}
        >
          Total a pagar
        </Typography>
        <Typography
          sx={{
            color: "#69EAE2",
            fontFamily: "Nunito",
            fontSize:
              typeInvoice === "quickSale"
                ? { xs: "18px", sm: "1.5rem" }
                : { xs: "16px", sm: "1rem" },
            fontStyle: "normal",
            fontWeight: 800,
            lineHeight: "140%",
          }}
        >
          {`$ ${total.toLocaleString("en-US")}`}
        </Typography>
      </Box>

      <Box
        sx={{
          width: "100%",
          marginTop: "0.8rem",
        }}
      >
        <FormControl sx={{ width: "100%" }} variant="outlined">
          <Typography
            sx={{
              color: "#69EAE2",
              fontFamily: "Nunito",
              display: !mostrarValorDevolver ? 'none' : 'auto',
              fontSize:
                typeInvoice === "quickSale"
                  ? { xs: "18px", sm: "1.5rem" }
                  : { xs: "16px", sm: "1rem" },
              fontStyle: "normal",
              fontWeight: 300,
              lineHeight: "140%",
            }}
          >
            Valor Recibido
          </Typography>
          
          {metodoPago === "Mixto" && (
            <Box sx={{ mt: 2 }}>
              <Typography sx={{ color: "#69EAE2", fontWeight: 600 }}>
                Valor en efectivo
              </Typography>
              <NumericFormat
                value={vrMixta.efectivo}
                onValueChange={(values) => {
                  const efectivo = values.floatValue || 0;
                  const transferencia = Math.max(total - efectivo, 0);
                  setVrMixta({ efectivo, transferencia });
                }}
                prefix="$ "
                thousandSeparator
                customInput={OutlinedInput}
                sx={{
                  width: "100%",
                  borderRadius: "0.5rem",
                  background: "#2C3248",
                  color: "#FFF",
                  mt: 1,
                }}
              />

              <Typography sx={{ color: "#69EAE2", fontWeight: 600, mt: 2 }}>
                Valor en transferencia
              </Typography>
              <NumericFormat
                value={vrMixta.transferencia}
                onValueChange={(values) => {
                  const transferencia = values.floatValue || 0;
                  const efectivo = Math.max(total - transferencia, 0);
                  setVrMixta({ efectivo, transferencia });
                }}
                prefix="$ "
                thousandSeparator
                customInput={OutlinedInput}
                sx={{
                  width: "100%",
                  borderRadius: "0.5rem",
                  background: "#2C3248",
                  color: "#FFF",
                  mt: 1,
                }}
              />
            </Box>
          )}

          <NumericFormat
            onBlur={(e) => {
              calcularValorADevolverOnblur();
            }}
            onChange={(e) => handleChangeRecibido(e.target.value)}
            value={valorRecibido !== null ? `$ ${valorRecibido}` : ""}
            prefix="$ "
            thousandSeparator
            customInput={OutlinedInput}
            sx={{
              display: !mostrarValorDevolver ? 'none' : 'auto',
              height: { xs: "30px", sm: "2.5rem" },
              fontSize:
                typeInvoice === "quickSale"
                  ? { xs: "18px", sm: "1.5rem" }
                  : { xs: "16px", sm: "1rem" },
              width: "100%",
              color: "#FFF",
              borderRadius: "0.5rem",
              background: "#2C3248",
              boxShadow:
                "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
          />
        </FormControl>
        
        {mostrarValorDevolver && (
          <FormControl
            sx={{ 
              width: "100%", 
              marginTop: "0.8rem", 
              display: metodoPago === "mixto" ? 'none' : 'block',
            }}
            variant="outlined"
          >
            <Typography
              sx={{
                color: "#69EAE2",
                fontFamily: "Nunito",
                fontSize:
                  typeInvoice === "quickSale"
                    ? { xs: "18px", sm: "1.5rem" }
                    : { xs: "16px", sm: "1rem" },
                fontStyle: "normal",
                fontWeight: 300,
                lineHeight: "140%",
              }}
            >
              Valor A Devolver
            </Typography>
            <Box
              sx={{
                background: "#2C3248",
                borderRadius: "8px",
                paddingY: { xs: "0", sm: "10px" },
                paddingLeft: "13px",
                color: "#FFF",
                boxShadow: "0px 4px 4px 0px #00000040",
              }}
            >
              <NumericFormat
                displayType="text"
                value={calcularValorADevolver()}
                prefix="$ "
                thousandSeparator
                customInput={OutlinedInput}
                style={{
                  fontSize:
                    typeInvoice === "quickSale"
                      ? matches
                        ? "1.5rem"
                        : "18px"
                      : matches
                        ? "1rem"
                        : "16px",
                }}
                sx={{
                  height: { xs: "30px", sm: "2.5rem" },
                  width: "100%",
                  color: "#FFF",
                  borderRadius: "0.5rem",
                  background: "#2C3248",
                  boxShadow:
                    "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                }}
              />
            </Box>
          </FormControl>
        )}
        
        <Box sx={{ marginTop: "16px", textAlign: "-webkit-center" }}>
          <Slider setFactura={setFactura} factura={factura} />
        </Box>
      </Box>
      
      <Box sx={{ textAlign: "center" }}>
        <Button
          disabled={datosGuardados ? false : !(typeInvoice === "quickSale")}
          onClick={vender}
          sx={{
            borderRadius: "0.5rem",
            background: datosGuardados
              ? "#69EAE2"
              : typeInvoice === "quickSale"
                ? "#69EAE2"
                : "gray",
            marginTop: "1.5rem",
            width: "8rem",
            "&:hover": { background: "#69eae240" },
          }}
        >
          <Typography
            sx={{
              color: "#1F1D2B",
              fontFamily: "Nunito",
              fontSize: "0.875rem",
              fontStyle: "normal",
              fontWeight: 600,
              lineHeight: "140%",
            }}
          >
            VENDER
          </Typography>
        </Button>
      </Box>
    </>
  );
};

export default DatosVentaImproved;