import * as React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { styled, css } from "@mui/system";
import { Modal as BaseModal } from "@mui/base/Modal";
import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
} from "@mui/material";
import {
  db,
  getAllCategoriesData,
  getAllMeasurementsDataa,
  storage,
  updateProductData,
  user,
} from "@/firebase";
import { inputsEdit } from "@/data/inputs";
import { NumericFormat } from "react-number-format";
import { Input as BaseInput, InputProps } from "@mui/base/Input";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { ColorRing } from "react-loader-spinner";
import CloseIcon from "@mui/icons-material/Close";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import { addDoc, collection, doc, Timestamp } from "firebase/firestore";
import { getHoraColombia } from "./Hooks/hooks";
import HistorialProducto from "@/app/inventory/productos/HistorialProducto";

const Input = React.forwardRef(function CustomInput(
  props: InputProps,
  ref: React.ForwardedRef<HTMLDivElement>
) {
  return (
    <BaseInput
      slots={{
        root: RootDiv,
        input: "input",
        textarea: TextareaElement,
      }}
      {...props}
      ref={ref}
    />
  );
});

const RootDiv = styled("div")`
  display: flex;
  max-width: 100%;
`;

const TextareaElement = styled("textarea", {
  shouldForwardProp: (prop) =>
    !["ownerState", "minRows", "maxRows"].includes(prop.toString()),
})(
  ({ theme }) => `
  width: 100%;
  font-family: 'Nunito';
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  padding: 8px 12px;
  border-radius: 0.625rem;
  background: #FFF;
  box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.25);
  border: 0;
  color:#000;
`
);

const Modal = styled(BaseModal)`
  position: fixed;
  z-index: 1300;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ModalContent = styled(Paper)(
  ({ theme }) => css`
    font-family: "Nunito";
    text-align: start;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;
    background-color: #1f1d2b;
    border-radius: 0.625rem;
    padding: 24px;
    width: 48.6875rem;
    height: 55rem;
  `
);


const toNumber = (v: any) => Number(String(v ?? 0).replace(/[^\d.-]/g, "")) || 0;
const round2 = (n: number) => Math.round(n * 100) / 100;
const calcPorcentaje = (venta: number, compra: number) => {
  if (compra <= 0) return 0;
  return ((venta - compra) / compra) * 100;
};
// precio de venta sugerido con base en % ganancia
const priceFromPercent = (cost: number, percent: number) => {
  return cost * (1 + (percent || 0) / 100);
};

// Redondeo al múltiplo de 500 más cercano
const roundToNearest500 = (n: number) => Math.round(n / 500) * 500;

// Locale de formateo (por defecto en-US = "80,000").
// Si prefieres puntos tipo "80.000", cambia a "es-CO".
const LOCALE = "en-US"; // o "es-CO"
const formatPrice = (n: number) => `$ ${new Intl.NumberFormat(LOCALE).format(n)}`;


export default function EditModal(props: any) {
  const { data } = props;
  const [open, setOpen] = React.useState(false);
  const [product, setProduct] = React.useState(data);
  const [useRound500, setUseRound500] = React.useState(false);
  const [upload, setUpload] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [imageBase64, setImageBase64] = React.useState("");
  const [category, setCategory] = React.useState<[]>([]);
  const [measure, setMeasure] = React.useState<[]>([]);
  const [productExist, setProductExist] = React.useState(false);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const [abrirHistorial, setAbrirHistorial] = React.useState<any>(false);
  // Inicializa tomando el guardado o calculándolo con los valores actuales
  const [porcentajeGanancia, setPorcentajeGanancia] = React.useState<number>(() => {
    const venta = toNumber(data?.price);
    const compra = toNumber(data?.purchasePrice);
    return data?.porcentajeGanancia ?? calcPorcentaje(venta, compra);
  });

  // Evita re-guardar en bucle
  const autoSavedRef = React.useRef(false);
  const previousImageUrlRef = React.useRef<string | null>(null);

  const uploadImage = (fileRef: React.RefObject<HTMLInputElement>) => {
    if (fileRef.current?.files?.length) {
      const file = fileRef.current.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64String: any = event?.target?.result;
        if (base64String) setImageBase64(base64String);
      };
      reader.readAsDataURL(file);
    } else {
      console.error("no file selected");
    }
  };

  const handleAcceptImage = (fileRef: React.RefObject<HTMLInputElement>) => {
    if (fileRef.current?.files?.length) {
      const file = fileRef.current.files[0];
      const fileName = Date.now() + "_" + file.name;
      const imgRef = ref(storage, `${user().decodedString}/` + fileName);
      previousImageUrlRef.current = product.image;
      uploadImageToFirebase(imgRef, file);
      setImageBase64("");
    }
  };

  const uploadImageToFirebase = (imgRef: any, file: File) => {
    setLoading(true);
    const imgUpload = uploadBytesResumable(imgRef, file);

    imgUpload.on(
      "state_changed",
      ({ state }) => {
        switch (state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
          default:
            break;
        }
      },
      (err) => {
        console.error("Error during upload:", err);
        setLoading(false);
      },
      async () => {
        try {
          const url = await getDownloadURL(imgUpload.snapshot.ref);
          if (previousImageUrlRef.current) {
            const previousImageRef = ref(storage, previousImageUrlRef.current);
          }
          setProduct((prevState: any) => ({
            ...prevState,
            image: url,
          }));
        } catch (error) {
          console.error("Error getting download URL:", error);
        } finally {
          setLoading(false);
          if (previousImageUrlRef.current) {
            const previousImageRef = ref(storage, previousImageUrlRef.current);
            await deleteObject(previousImageRef);
          }
        }
      }
    );
  };

  const handleCancel = () => {
    setImageBase64("");
    setUpload(false);
  };

  const inputOnChange = (field: string, value: string) => {
    setProduct({ ...product, [field]: value });
  };

  const handleUpdateProduct = async (uid: string, newData: any, oldData: any) => {
    try {
      const usuario = JSON.parse(localStorage.getItem("dataUser") || "{}")?.name || "desconocido";
      const establecimiento = oldData.user;
      const productRef = doc(db, "establecimientos", establecimiento, "productos", uid);

      const cambios = {
        cantidad: oldData.cantidad !== newData.cantidad
          ? { anterior: oldData.cantidad, nuevo: newData.cantidad }
          : null,
        purchasePrice: oldData.purchasePrice !== newData.purchasePrice
          ? { anterior: oldData.purchasePrice, nuevo: newData.purchasePrice }
          : null,
        price: oldData.price !== newData.price
          ? { anterior: oldData.price, nuevo: newData.price }
          : null,
      };

      const fecha = getHoraColombia();

      const subcolecciones = {
        cantidad: "historial_stock",
        purchasePrice: "historial_precio_compra",
        price: "historial_precio_venta",
      };

      const operacionesHistorial = Object.entries(cambios)
        .filter(([_, cambio]) => cambio !== null)
        .map(async ([campo, cambio]) => {
          const subcol = subcolecciones[campo as keyof typeof subcolecciones];
          const historialRef = collection(productRef, subcol);
          return addDoc(historialRef, {
            ...cambio!,
            fecha,
            realizado_por: usuario,
          });
        });

      if (operacionesHistorial.length > 0) {
        await Promise.all(operacionesHistorial);
      }

      await updateProductData(uid, newData);

      handleClose();
    } catch (error) {
      console.error("Error al actualizar el producto o guardar historial:", error);
    }
  };


  React.useEffect(() => {
    const categoriesData = async () => {
      try {
        await getAllCategoriesData(setCategory);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    categoriesData();
  }, []);

  React.useEffect(() => {
    const measurementsData = async () => {
      try {
        await getAllMeasurementsDataa(setMeasure);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    measurementsData();
  }, []);

  const handleClose = () => {
    setOpen(false);
  };
  React.useEffect(() => {
    if (autoSavedRef.current) return;

    const venta = toNumber(product?.price);
    const compra = toNumber(product?.purchasePrice);
    const yaExiste = product?.porcentajeGanancia !== undefined && product?.porcentajeGanancia !== null;

    if (!yaExiste && compra > 0 && venta > 0) {
      const pct = round2(calcPorcentaje(venta, compra));
      const payload = { ...product, porcentajeGanancia: pct };

      // Actualiza UI local
      setProduct(payload);
      setPorcentajeGanancia(pct);

      // Guarda automáticamente en la DB una sola vez
      updateProductData(product.uid, payload)
        .then(() => { autoSavedRef.current = true; })
        .catch((e) => { console.error("No se pudo auto-guardar porcentajeGanancia:", e); });
    }
  }, [product?.price, product?.purchasePrice, product?.porcentajeGanancia, product?.uid]);

  return (
    <Box>
      <IconButton
        sx={{ padding: "8px 3px" }}
        onClick={() => {
          setOpen(true);
        }}
      >
        <Box
          component={"img"}
          src={"/images/edit.svg"}
          sx={{ width: "0.8rem", height: "0.8rem" }}
        />
      </IconButton>

      <Modal id='modal' open={open} onClose={handleClose}>
        <ModalContent
          sx={{
            boxShadow:
              "0px 1px 100px -50px #69EAE2, 0px 4px 250px -50px #69EAE2",
          }}
        >
          <Box sx={{
            display: !abrirHistorial ? 'block' : 'none'
          }}>
            <Box
              sx={{
                position: "relative",
                display: "flex",
                justifyContent: "flex-end",
                marginBottom: "-6%",
                marginRight: "3%",
                zIndex: 4,
              }}
            >
              <IconButton
                sx={{ padding: "8px 3px" }}
                onClick={() => {
                  handleClose();
                }}
              >
                <CloseIcon sx={{ color: "#69EAE2", fontSize: "20px" }} />
              </IconButton>
            </Box>
            <Box>
              <Typography
                sx={{
                  color: "#69EAE2",
                  textAlign: "center",
                  fontFamily: "Nunito",
                  fontSize: "1.5rem",
                  fontStyle: "normal",
                  fontWeight: 700,
                  lineHeight: "normal",
                }}
              >
                EDITAR PRODUCTO
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                width: "100%",
                height: "85%",
                overflowY: "auto",
              }}
            >
              <Box
                sx={{
                  overflowY: "hidden",
                  border: "solid 11px #fff",
                  width: "50%",
                  alignSelf: "center",
                  background: {
                    xs: "linear-gradient(rgb(31 29 43 / 0%) 51%, #FFF 57%)",
                    sm: "#fff",
                  },
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  height: "85%",
                  marginRight: { sm: "47px" },
                  borderRadius: "10px",
                  alignItems: "center",
                }}
              >
                <Button component='label' sx={{ padding: 0 }}>
                  <CreateTwoToneIcon
                    fontSize={"medium"}
                    sx={{
                      color: { xs: "#fff", sm: "#1F1D2B" },
                      marginRight: "-100px",
                    }}
                  />
                  <input
                    style={{
                      overflow: "hidden",
                      clip: "rect(0 0 0 0)",
                      clipPath: "inset(50%)",
                      height: 1,
                      position: "absolute",
                      bottom: 0,
                      left: 0,
                      whiteSpace: "nowrap",
                      width: 1,
                    }}
                    accept='image/*'
                    ref={fileRef}
                    onChange={() => {
                      setUpload(true);
                      setProductExist(true);
                      uploadImage(fileRef);
                    }}
                    type='file'
                  />
                </Button>
                {imageBase64 && (
                  <Box
                    id='contianer_img'
                    sx={{
                      justifyContent: "center",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      width: "60%",
                      height: "100%",
                    }}
                  >
                    <img
                      src={imageBase64}
                      alt='Preview'
                      style={{
                        width: "80%",
                      }}
                    />
                    <Box
                      sx={{
                        width: "90%",
                        justifyContent: "space-evenly",
                        marginY: "10px",
                      }}
                      display={
                        product.image.length > 0 && !productExist
                          ? "none"
                          : "flex"
                      }
                    >
                      <Button
                        sx={{
                          display: "block",
                          borderRadius: "0.625rem",
                          boxShadow:
                            "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                          background: "#69EAE2",
                        }}
                        onClick={() => {
                          handleAcceptImage(fileRef);
                        }}
                      >
                        <Typography
                          sx={{
                            color: "#1F1D2B",
                            textAlign: "center",
                            fontFamily: "Nunito",
                            fontSize: { lg: "0.7rem", xs: "0.5rem" },
                            fontStyle: "normal",
                            fontWeight: { lg: 700, xs: 900 },
                            lineHeight: "normal",
                          }}
                        >
                          CARGAR
                        </Typography>
                      </Button>
                      <Button
                        sx={{
                          display: "block",
                          borderRadius: "0.625rem",
                          boxShadow:
                            "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                          background: "#69EAE2",
                        }}
                        onClick={() => handleCancel()}
                      >
                        <Typography
                          sx={{
                            color: "#1F1D2B",
                            textAlign: "center",
                            fontFamily: "Nunito",
                            fontSize: { lg: "0.7rem", xs: "0.5rem" },
                            fontStyle: "normal",
                            fontWeight: { lg: 700, xs: 900 },
                            lineHeight: "normal",
                          }}
                        >
                          CANCELAR
                        </Typography>
                      </Button>
                    </Box>
                  </Box>
                )}
                {loading ? (
                  <ColorRing
                    visible={true}
                    height='80'
                    width='80'
                    ariaLabel='blocks-loading'
                    wrapperStyle={{}}
                    wrapperClass='blocks-wrapper'
                    colors={[
                      "#69EAE2",
                      "#69EAE2",
                      "#69EAE2",
                      "#69EAE2",
                      "#69EAE2",
                    ]}
                  />
                ) : (
                  <Box
                    sx={{
                      height: "100%",
                      display: imageBase64 ? "none" : "flex",
                      alignItems: "center",
                    }}
                  >
                    <Box
                      component={"img"}
                      src={product?.image.length > 0 ? product?.image : "/images/noImage.svg"}
                      alt={`imagen del producto ${product.productName}`}
                      sx={{
                        display: !imageBase64 ? "block" : "none",
                        width: "100%",
                        height: "100%",
                      }}
                    />
                  </Box>
                )}
              </Box>
              <Box
                id='container-inputs'
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "space-between",
                  width: { sm: "60%" },
                }}
              >
                {inputsEdit.map((input, index) => {
                  const style = {
                    width: input.width,
                    marginTop: "10px",
                    marginLeft: {
                      sm:
                        input.width === "45%" && [3, 6].includes(index)
                          ? "10%"
                          : "0",
                    },
                  };
                  const styleTypography = {
                    display: { xs: "none", sm: "block" },
                    color: "#FFF",
                    fontFamily: "Nunito",
                    fontSize: "13px",
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "normal",
                    marginBottom: "5px",
                  };
                  const categorySelect = (
                    <Box>
                      <Select
                        onChange={(e: any) =>
                          inputOnChange("category", e.target.value)
                        }
                        value={product["category"]}
                        sx={{
                          height: "38px",
                          width: "100%",
                          borderRadius: "0.625rem",
                          background: "#FFF",
                          boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                        }}
                      >
                        {category?.map((tag) => (
                          <MenuItem key={tag} value={tag}>
                            {tag}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                  );
                  const measurementSelect = (
                    <Box>
                      <Select
                        onChange={(e: any) =>
                          inputOnChange(input.field, e.target.value)
                        }
                        label='selecciona una opcion'
                        value={product["measurement"]}
                        sx={{
                          height: "38px",
                          width: "100%",
                          borderRadius: "0.625rem",
                          background: "#FFF",
                          boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                        }}
                      >
                        {measure?.map((tag) => (
                          <MenuItem key={tag} value={tag}>
                            {tag}
                          </MenuItem>
                        ))}
                      </Select>
                    </Box>
                  );
                  const amountInput = (
                    <NumericFormat
                      onChange={(e: any) => {
                        setProduct((prevData: any) => ({
                          ...prevData,
                          price: e.target.value,
                        }));
                      }}
                      placeholder="Precio"
                      value={product.price ?? ""}
                      prefix='$ '
                      thousandSeparator
                      customInput={OutlinedInput}
                      sx={{
                        height: "38px",
                        borderRadius: "0.625rem",
                        background: "#FFF",
                        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                      }}
                    />
                  );

                  const cantidadInput = (
                    <OutlinedInput
                      value={product["cantidad"]}
                      onChange={(e) => inputOnChange("cantidad", e.target.value)}
                      type={"number"}
                      placeholder="Cantidad"
                      sx={{
                        height: "38px",
                        borderRadius: "0.625rem",
                        background: "#FFF",
                        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                      }}
                    />
                  );
                  const purchasePrice = (
                    <NumericFormat
                      onChange={(e: any) => {
                        setProduct((prevData: any) => ({
                          ...prevData,
                          purchasePrice: e.target.value,
                        }));
                      }}
                      placeholder="Precio de compra"
                      value={product.purchasePrice ?? ""}
                      prefix='$ '
                      thousandSeparator
                      customInput={OutlinedInput}
                      sx={{
                        height: "38px",
                        borderRadius: "0.625rem",
                        background: "#FFF",
                        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                      }}
                    />
                  );
                  const descriptionInput = (
                    <Input
                      multiline={true}
                      rows={1}
                      placeholder="Descripcion"
                      value={product["description"]}
                      onChange={(e) =>
                        inputOnChange("description", e.target.value)
                      }
                    />
                  );

                  const qrBar = (
                    <OutlinedInput
                      disabled
                      value={product["barCode"]}
                      endAdornment={
                        <InputAdornment position='end'>
                          <IconButton sx={{ paddingRight: "0px" }}>
                            <Box
                              component={"img"}
                              src={"/images/scanBlack.svg"}
                            />
                          </IconButton>
                        </InputAdornment>
                      }
                      type={"text"}
                      sx={{
                        height: "38px",
                        borderRadius: "0.625rem",
                        background: "#FFF",
                        boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                      }}
                    />
                  );

                  return (
                    <React.Fragment key={index * 123}>
                      <FormControl sx={style} variant='outlined'>
                        <Typography sx={styleTypography}>{input.name}</Typography>
                        {input.type === "measurement" ? (
                          measurementSelect
                        ) : input.type === "category" ? (
                          categorySelect
                        ) : input.type === "qty" ? (
                          cantidadInput
                        ) : input.type === "amount" ? (
                          amountInput
                        ) : input.type === "textarea" ? (
                          descriptionInput
                        ) : input.type === "qrbar" ? (
                          qrBar
                        ) : input.type === "purchasePrice" ? (purchasePrice) : (
                          <>
                            <OutlinedInput
                              value={product["productName"]}
                              onChange={(e) =>
                                inputOnChange(input.field, e.target.value)
                              }
                              placeholder="Producto"
                              type={input.type}
                              sx={{
                                height: "38px",
                                borderRadius: "0.625rem",
                                background: "#FFF",
                                boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                              }}
                            />
                          </>
                        )}
                      </FormControl>
                    </React.Fragment>
                  );
                })}
              </Box>
            </Box>
            <>
              <Box
                sx={{
                  width: "100%",
                  mt: 2,
                  p: 1.5,
                  borderRadius: "0.625rem",
                  background: "#FFFFFF",
                  boxShadow: "0px 4px 8px rgba(0,0,0,0.15)",
                }}
              >
                <Typography sx={{ fontFamily: "Nunito", fontWeight: 800, mb: 1, color: "#1F1D2B" }}>
                  % de ganancia y precio sugerido
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
                  {/* % de ganancia (editable por si lo quieres ajustar manualmente) */}
                  <FormControl sx={{ width: { xs: "100%", sm: "30%" } }}>
                    <Typography sx={{ fontFamily: "Nunito", fontWeight: 700, color: "#1F1D2B", mb: 0.5 }}>
                      % de ganancia
                    </Typography>
                    <NumericFormat
                      value={porcentajeGanancia}
                      decimalScale={2}
                      fixedDecimalScale
                      suffix='%'
                      allowNegative={false}
                      onValueChange={(vals) => setPorcentajeGanancia(Number(vals.value || 0))}
                      customInput={OutlinedInput}
                      sx={{ height: "38px", borderRadius: "0.625rem", background: "#FFF", boxShadow: "0px 4px 4px rgba(0,0,0,0.25)" }}
                    />
                  </FormControl>

                  {/* Precio sugerido con base en % */}
                  <FormControl sx={{ width: { xs: "100%", sm: "30%" } }}>
                    <Typography sx={{ fontFamily: "Nunito", fontWeight: 700, color: "#1F1D2B", mb: 0.5 }}>
                      Precio sugerido
                    </Typography>
                    <OutlinedInput
                      value={(() => {
                        const compra = toNumber(product?.purchasePrice);
                        if (compra <= 0) return "";
                        let sugerido = priceFromPercent(compra, porcentajeGanancia); // base
                        if (useRound500) {
                          sugerido = roundToNearest500(sugerido); // múltiplo de 500
                        } else {
                          sugerido = Math.round(sugerido);        // entero normal
                        }
                        return formatPrice(sugerido);
                      })()}
                      disabled
                      sx={{ height: "38px", borderRadius: "0.625rem", background: "#EEE", boxShadow: "0px 4px 4px rgba(0,0,0,0.25)" }}
                    />

                  </FormControl>

                  {/* Acciones */}
                  <Box sx={{ display: "flex", gap: 1, alignItems: "flex-end" }}>
                    <Button
                      variant='contained'
                      onClick={() => setUseRound500(prev => !prev)}
                      sx={{
                        height: "38px",
                        borderRadius: "0.625rem",
                        background: "#69eae2ab",
                        color: "#1F1D2B",
                        fontWeight: 800,
                        "&:hover": { backgroundColor: "#69EAE2" },
                      }}
                    >
                      {useRound500 ? "Quitar redondeo ×500" : "Redondear ×500"}
                    </Button>

                    <Button
                      variant='contained'
                      onClick={() => {
                        const compra = toNumber(product?.purchasePrice);
                        if (compra <= 0) return;
                        let sugerido = priceFromPercent(compra, porcentajeGanancia);
                        sugerido = useRound500 ? roundToNearest500(sugerido) : Math.round(sugerido);
                        setProduct((prev: any) => ({ ...prev, price: formatPrice(sugerido) }));
                      }}
                      sx={{ height: "38px", borderRadius: "0.625rem", background: "#69eae2ab", color: "#1F1D2B", fontWeight: 800, "&:hover": { backgroundColor: "#69EAE2" } }}
                    >
                      Asignar a precio de venta
                    </Button>
                  </Box>
                </Box>
              </Box>

            </>
            <Box
              sx={{
                display: "flex",
                justifyContent: { xs: "space-between", sm: "space-between" },
                width: { sm: "53%" },
                marginLeft: { xs: "0", sm: "auto" },
                marginTop: '10px'
              }}
            >
              <Button
                onClick={() => {
                  const payload: any = { ...product, porcentajeGanancia: round2(porcentajeGanancia ?? 0), };
                  const currentCost = toNumber(payload.purchasePrice);
                  const currentSale = toNumber(payload.price);
                  // Si el producto no trae gainPercent guardado, lo calculamos y guardamos
                  if (payload.gainPercent === undefined || payload.gainPercent === null) {
                    //payload.gainPercent = round2(calcGainPercent(currentSale, currentCost));
                  } else {
                    // Si el usuario lo editó, guardamos el del estado
                    //payload.gainPercent = round2(gainPercent);
                  }
                  handleUpdateProduct(product.uid, payload, data);
                }}
                sx={{
                  width: "8.75rem",
                  height: "2rem",
                  borderRadius: "0.625rem",
                  background: "#69eae2ab",
                  boxShadow:
                    "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",

                  "&:hover": { backgroundColor: "#69EAE2" },
                }}
              >
                <Typography
                  sx={{
                    color: "#1F1D2B",
                    textAlign: "center",
                    fontFamily: "Nunito",
                    fontSize: "0.875rem",
                    fontStyle: "normal",
                    fontWeight: 800,
                    lineHeight: "normal",
                  }}
                >
                  GUARDAR
                </Typography>
              </Button>

              <Button
                onClick={() => setAbrirHistorial(true)}
                sx={{
                  width: "8.75rem",
                  height: "2rem",
                  borderRadius: "0.625rem",
                  background: "#69eae2ab",
                  boxShadow:
                    "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",

                  "&:hover": { backgroundColor: "#69EAE2" },
                }}
              >
                <Typography
                  sx={{
                    color: "#1F1D2B",
                    textAlign: "center",
                    fontFamily: "Nunito",
                    fontSize: "0.875rem",
                    fontStyle: "normal",
                    fontWeight: 800,
                    lineHeight: "normal",
                  }}
                >
                  Abrir historial
                </Typography>
              </Button>

            </Box>
          </Box>
          <HistorialProducto
            visible={abrirHistorial}
            onBack={() => setAbrirHistorial(false)}
            uid={data.uid}
            establecimientoId={user().decodedString}
          />
        </ModalContent>
      </Modal>
    </Box>
  );
}
