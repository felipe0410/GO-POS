"use client";
import { dataInputs } from "@/data/inputs";
import {
  Box,
  Button,
  Divider,
  FormControl,
  IconButton,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { NumericFormat } from "react-number-format";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { createInvoice, updateProductDataCantidad } from "@/firebase";
import LinearBuffer from "./progress";

interface UserData {
  name: string;
  direccion: string;
  email: string;
  identificacion: string;
  celular: string;
  [key: string]: any;
}

const metodosDePago = ["Efectivo", "Transferencia", "Datáfono"];

const DatosVenta = (props: any) => {
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
  } = props;

  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [valorRecibido, setValorRecibido] = useState<number | null>(null);
  const [mostrarValorDevolver, setMostrarValorDevolver] = useState(false);
  const [datosGuardados, setDatosGuardados] = useState(false);
  const [factura, setFactura] = useState({
    invoice: "",
    date: "",
    vendedor: "santiago",
    cliente: {
      name: "tan",
      direccion: "tan",
      email: "tan",
      identificacion: "tan",
      celular: "tan",
    },
    compra: [],
    subtotal: 0,
    descuento: 0,
    total: 0,
  });

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
      handleVenderClick();
      setLoading(true);
      await createInvoice(factura.invoice, {
        ...factura,
      });
      setLoading(false);
      setReciboPago(true);
      setDatosGuardados(false);
    } catch (error) {
      console.error("falló el primer intento", error);
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
    selectedItems.map((e: any) => updateProductDataCantidad(e.barCode, e))
    localStorage.setItem("cliente", datosCliente);
    localStorage.setItem("invoice", numeroFactura());
    setDatosGuardados(true);
    setFactura({
      ...factura,
      invoice: numeroFactura(),
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
  };

  const isNotEmpty = (fields: any) => {
    for (const value in fields) {
      if (
        fields.hasOwnProperty(value) &&
        typeof fields[value] === "string" &&
        fields[value].trim() === ""
      ) {
        return false;
      }
    }
    return true;
  };

  const inputOnChange = (field: string, value: string) => {
    setData({ ...data, [field]: value });
  };

  const handleChangeRecibido = (value: string) => {
    const numericValue = parseFloat(value.replace(/[^\d.]/g, ""));
    setValorRecibido(isNaN(numericValue) ? null : numericValue);
  };

  const calcularValorADevolver = () => {
    return valorRecibido !== null ? Math.max(valorRecibido - total, 0) : 0;
  };

  return loading ? (
    <LinearBuffer />
  ) : (
    <>
      <Typography
        sx={{
          color: "#69EAE2",
          fontFamily: "Nunito",
          fontSize: "1.25rem",
          fontStyle: "normal",
          fontWeight: 800,
          lineHeight: "140%",
          marginTop: "1rem",
          textAlign: "center",
        }}
      >
        DATOS DEL CLIENTE
      </Typography>
      <Divider sx={{ background: "#69EAE2", width: "100%" }} />
      <Box padding={2}>
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
            {dataInputs.map((input, index) => {
              const style = {
                width: input.width,
                marginTop: "27px",
                marginLeft: {
                  sm:
                    input.width === "45%" && [4].includes(index) ? "10%" : "0",
                },
              };
              return (
                <React.Fragment key={index}>
                  <FormControl sx={style} variant='outlined'>
                    <OutlinedInput
                      value={data[input.field]}
                      onChange={(e) =>
                        inputOnChange(input.field, e.target.value)
                      }
                      placeholder={input.name}
                      type={input.type}
                      sx={{ height: "2.5rem" }}
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
            <Box sx={{ textAlign: "center" }}>
              <Button
                onClick={datosGuardadosLocalStorage}
                sx={{
                  borderRadius: "0.5rem",
                  background: "#69EAE2",
                  marginTop: "1.5rem",
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
                  GUARDAR DATOS
                </Typography>
              </Button>
            </Box>
          </>
        )}
      </Box>
      <Typography
        sx={{
          color: "#69EAE2",
          fontFamily: "Nunito",
          fontSize: "1.25rem",
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
        onChange={(e: any) => setMetodoPago(e.target.value)}
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
            fontSize: "1rem",
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
            fontSize: "1rem",
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
          display: metodoPago === "" ? "none" : "block",
          width: "100%",
          marginTop: "0.8rem",
        }}
      >
        <FormControl sx={{ width: "100%" }} variant='outlined'>
          <Typography
            sx={{
              color: "#69EAE2",
              fontFamily: "Nunito",
              fontSize: "1rem",
              fontStyle: "normal",
              fontWeight: 300,
              lineHeight: "140%",
            }}
          >
            Valor Recibido
          </Typography>
          <NumericFormat
            onBlur={() => setMostrarValorDevolver(true)}
            onChange={(e) => handleChangeRecibido(e.target.value)}
            value={valorRecibido !== null ? `$ ${valorRecibido}` : ""}
            prefix='$ '
            thousandSeparator
            customInput={OutlinedInput}
            sx={{
              height: "2.5rem",
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
            sx={{ width: "100%", marginTop: "0.8rem" }}
            variant='outlined'
          >
            <Typography
              sx={{
                color: "#69EAE2",
                fontFamily: "Nunito",
                fontSize: "1rem",
                fontStyle: "normal",
                fontWeight: 300,
                lineHeight: "140%",
              }}
            >
              Valor A Devolver
            </Typography>
            <NumericFormat
              value={calcularValorADevolver()}
              prefix='$ '
              thousandSeparator
              customInput={OutlinedInput}
              sx={{
                height: "2.5rem",
                width: "100%",
                color: "#FFF",
                borderRadius: "0.5rem",
                background: "#2C3248",
                boxShadow:
                  "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
              }}
            />
          </FormControl>
        )}
      </Box>
      <Box sx={{ textAlign: "center" }}>
        <Button
          disabled={
            datosGuardados && valorRecibido !== null && valorRecibido >= total
              ? false
              : true
          }
          onClick={() => vender()}
          sx={{
            borderRadius: "0.5rem",
            background:
              datosGuardados && valorRecibido !== null && valorRecibido >= total
                ? "#69EAE2"
                : "gray",

            marginTop: "1.5rem",
            width: "8rem",
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

export default DatosVenta;
