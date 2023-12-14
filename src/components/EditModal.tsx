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
  deleteProduct,
  getAllCategoriesData,
  getAllMeasurementsDataa,
  getProductData,
} from "@/firebase";
import NewProduct from "./NewProduct";
import { inputsEdit } from "@/data/inputs";
import { NumericFormat } from "react-number-format";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { Input as BaseInput, InputProps } from "@mui/base/Input";

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
    /* box-shadow: 0px 1px 100px -50px #69EAE2, 0px 4px 250px -50px #69EAE2; */
    padding: 24px;
    width: 48.6875rem;
    height: 35rem;
  `
);

export default function EditModal(props: any) {
  const [selectedProduct, setSelectedProduct] = React.useState<any>(null);
  const { data } = props;
  const [open, setOpen] = React.useState(false)
  const [product, setProduct] = React.useState(data);
  const [upload, setUpload] = React.useState(false);
  const [imageBase64, setImageBase64] = React.useState("");
  const [category, setCategory] = React.useState<[]>([]);
  const [measure, setMeasure] = React.useState<[]>([]);
  const [productExist, setProductExist] = React.useState(false);
  const fileRef = React.useRef<HTMLInputElement>(null);
  console.log('%cproductt:::>', 'color:red', product);

  const inputOnChange = (field: string, value: string) => {
    setProduct({ ...product, [field]: value });
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

  return (
    <Box>
      <IconButton
        sx={{ padding: "8px 3px" }}
        onClick={() => { setOpen(true) }}
      >
        <Box
          component={"img"}
          src={"/images/edit.svg"}
          sx={{ width: "0.8rem", height: "0.8rem" }}
        />
      </IconButton>

      <Modal open={open} onClose={handleClose}>
        <ModalContent>
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
              flexDirection: "row",
              width: "100%",
              height: "100%",
            }}
          >
            <Box sx={{ width: "40%" }}>LA IMAGEN</Box>
            <Box
              id='container-inputs'
              sx={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                width: "60%",
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
                      label='selecciona una opcion'
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
                    value={data.price}
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
                    value={product["description"]}
                    onChange={(e) => inputOnChange("description", e.target.value)}
                  />
                );

                const qrBar = (
                  <OutlinedInput
                    value={product["barCode"]}
                    endAdornment={
                      <InputAdornment position='end'>
                        <IconButton sx={{ paddingRight: "0px" }}>
                          <Box component={"img"} src={"/images/scanBlack.svg"} />
                        </IconButton>
                      </InputAdornment>
                    }
                    onChange={(e) => inputOnChange("barCode", e.target.value)}
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
                      ) : (
                        <>
                          <OutlinedInput
                            value={product["productName"]}
                            onChange={(e) =>
                              inputOnChange(input.field, e.target.value)
                            }
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
          <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
            <Button
              onClick={() => handleClose()}
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
          </Box>
        </ModalContent>
      </Modal>
    </Box>
  );
}
