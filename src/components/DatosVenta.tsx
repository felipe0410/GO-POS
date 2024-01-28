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
} from "@mui/material";
import { useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {
  createClient,
  createInvoice,
  getAllClientsData,
  updateProductDataCantidad,
} from "@/firebase";
import LinearBuffer from "./progress";
import Box from "@mui/material/Box";
import React from "react";
import Autocomplete from "@mui/material/Autocomplete";
import Slider from "./slider/Slider";
import { v4 as uuidv4 } from 'uuid';

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
    nota: ""
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
    propsNota
  } = props;
  const [options, setOptions] = useState([""]);
  const [valueClient, setValueClient] = React.useState<string | null>(
    options[0]
  );
  const [inputValue, setInputValue] = React.useState("");
  const [metodoPago, setMetodoPago] = useState("Efectivo");
  const [valorRecibido, setValorRecibido] = useState<number | null>(null);
  const [mostrarValorDevolver, setMostrarValorDevolver] = useState(false);
  const [datosGuardados, setDatosGuardados] = useState(false);
  const [clientsData, setClientsData] = useState([]);
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
    nota: propsNota ?? "",
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
      const valueUuid = uuidv4();
      const bloques = valueUuid.split('-');
      const result = bloques.slice(0, 2).join('-');
      localStorage.setItem('uidInvoice', `${factura.invoice}-${result}`)
      await createInvoice(`${factura.invoice}-${result}`, {
        ...factura,
      });
      setLoading(false);
      setReciboPago(true);
      setDatosGuardados(false);
    } catch (error) {
      console.error("falló el primer intento", error);
    }
  };

  console.log(factura);
  const datosGuardadosLocalStorage = () => {
    const dataWithDefaults = {
      name: data.name || "XXXX",
      direccion: data.direccion || "XXXX",
      email: data.email || "XXXX",
      identificacion: data.identificacion || "XXXX",
      celular: data.celular || "XXXX",
    };

    const datosCliente = JSON.stringify(dataWithDefaults);
    selectedItems.map((e: any) => updateProductDataCantidad(e.barCode, e));
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

  const inputOnChange = (field: string, value: string) => {
    setData({ ...data, [field]: value });
  };

  const handleChangeRecibido = (value: string) => {
    const numericValue = parseFloat(value.replace(/[^\d.]/g, ""));
    setValorRecibido(isNaN(numericValue) ? null : numericValue);
  };

  const calcularValorADevolver = () => {
    const cambio = valorRecibido !== null ? Math.max(valorRecibido - total, 0) : 0
    //  setFactura({ ...factura, cambio: cambio })
    return cambio;
  };
  const calcularValorADevolverOnblur = () => {
    const cambio = valorRecibido !== null ? Math.max(valorRecibido - total, 0) : 0
    setFactura({ ...factura, cambio: cambio })
  };

  useEffect(() => {
    getAllClientsData(setClientsData);
  }, []);
  useEffect(() => {
    if (clientsData.length > 0) {
      const array: any = [];
      clientsData.map((e: any) => {
        array.push(e.name);
      });
      setOptions(array);
    }
  }, [clientsData]);

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

      <Box>
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
                placeholder='Clientes registrados'
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
                    placeholder='  clientes registrados'
                    variant='standard'
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
            onBlur={(e) => { setMostrarValorDevolver(true); calcularValorADevolverOnblur() }}
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
        <Box sx={{ marginTop: "16px", textAlign: "-webkit-center" }}>
          <Slider setFactura={setFactura} factura={factura} />
        </Box>
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
