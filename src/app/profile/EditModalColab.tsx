import * as React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { styled, css } from "@mui/system";
import { Modal as BaseModal } from "@mui/base/Modal";
import {
  Box,
  Checkbox,
  IconButton,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
} from "@mui/material";
import { storage, updateColabData, user } from "@/firebase";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { ColorRing } from "react-loader-spinner";
import CloseIcon from "@mui/icons-material/Close";
import CreateTwoToneIcon from "@mui/icons-material/CreateTwoTone";
import {
  colabsList,
  selectStyle,
  typographyButtonsEdit,
  typographyColab,
} from "./profileStyles";
import { SnackbarProvider, enqueueSnackbar } from "notistack";

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
    height: 30rem;
  `
);

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

export default function EditModalColab(props: any) {
  const { data, setColabData } = props;
  console.log(data);
  const [open, setOpen] = React.useState(false);
  const [upload, setUpload] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [imageBase64, setImageBase64] = React.useState("");
  const [productExist, setProductExist] = React.useState(false);
  const fileRef = React.useRef<HTMLInputElement>(null);

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
      previousImageUrlRef.current = data.img;
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
            console.log("deleteObject(previousImageRef);:::>");
            const previousImageRef = ref(storage, previousImageUrlRef.current);
            console.log("previousImageRef:::>", previousImageRef);
          }
          setColabData((prevState: any) => ({
            ...prevState,
            img: url,
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
    setColabData({ ...data, [field]: value });
  };

  const handleSelectChange = (event: any) => {
    setColabData({ ...data, status: event.target.value });
  };

  const handleUpdateProduct = async (uid: string, newData: any) => {
    try {
      await updateColabData(uid, newData);
      enqueueSnackbar("Colaborador actualizado", {
        variant: "success",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
        onExited: handleClose,
      });
    } catch (error) {
      console.error("no se pudo actualizar el producto", error);
    }
  };

  const handleChange = (event: any) => {
    const { value } = event.target;
    setColabData({
      ...data,
      jobs: typeof value === "string" ? value.split(",") : (value as string[]),
    });
  };

  const handleClose = () => {
    setOpen(false);
  };

  const listJobs = ["Ventas", "Caja", "Inventario"];

  return (
    <Box>
      <SnackbarProvider />
      <IconButton
        sx={{ padding: "8px 3px" }}
        onClick={() => {
          setOpen(true);
        }}
      >
        <Box
          component={"img"}
          src={"/images/edit.svg"}
          sx={{ width: "1rem", height: "1rem" }}
        />
      </IconButton>

      <Modal id='modal' open={open} onClose={handleClose}>
        <ModalContent
          sx={{
            boxShadow:
              "0px 1px 100px -50px #69EAE2, 0px 4px 250px -50px #69EAE2",
          }}
        >
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
              <CloseIcon sx={{ color: "#FFF", fontSize: "20px" }} />
            </IconButton>
          </Box>
          <Box>
            <Typography sx={typographyColab}>EDITAR COLABORADOR</Typography>
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
                width: "30%",
                alignSelf: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                height: "55%",
                marginRight: "30px",
                borderRadius: "10px",
                alignItems: "center",
              }}
            >
              {imageBase64 && (
                <Box
                  id='contianer_img'
                  sx={{
                    justifyContent: "center",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "80%",
                    height: "100%",
                  }}
                >
                  <img
                    src={imageBase64}
                    alt='Preview'
                    style={{
                      width: "80%",
                      borderRadius: "50%",
                    }}
                  />
                  <Box
                    sx={{
                      width: "100%",
                      justifyContent: "space-evenly",
                      marginY: "10px",
                    }}
                    display={data.img && !productExist ? "none" : "flex"}
                  >
                    <Button
                      sx={{
                        display: "block",
                        borderRadius: "0.625rem",
                        boxShadow:
                          "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                        background: "#69EAE2",
                        "&:hover": { backgroundColor: "#69EAE2" },
                      }}
                      onClick={() => {
                        handleAcceptImage(fileRef);
                      }}
                    >
                      <Typography sx={typographyButtonsEdit}>CARGAR</Typography>
                    </Button>
                    <Button
                      sx={{
                        display: "block",
                        borderRadius: "0.625rem",
                        boxShadow:
                          "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                        background: "#69EAE2",
                        "&:hover": { backgroundColor: "#69EAE2" },
                      }}
                      onClick={() => handleCancel()}
                    >
                      <Typography sx={typographyButtonsEdit}>
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
                  {data.img ? (
                    <img
                      alt={`img from colab ${data.name}`}
                      src={data.img}
                      style={{
                        width: "150px",
                        height: "150px",
                        borderRadius: "50%",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "150px",
                        height: "150px",
                        borderRadius: "50%",
                        backgroundColor: "#2C3248",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <img
                        alt={`img from colab ${data.name}`}
                        src='/images/noPerson.png'
                        style={{ width: "50px", height: "50px" }}
                      />
                    </div>
                  )}
                </Box>
              )}
              <Button component='label' sx={{ padding: 0 }}>
                <CreateTwoToneIcon
                  fontSize={"medium"}
                  sx={{
                    color: "#69EAE2",
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
            </Box>
            <Box
              id='container-inputs'
              sx={{
                width: { sm: "60%" },
              }}
            >
              <Typography
                sx={{ ...colabsList.typographyButtonList, marginTop: "1rem" }}
              >
                Nombre
              </Typography>
              <OutlinedInput
                value={data["name"]}
                onChange={(e) => {
                  inputOnChange("name", e.target.value);
                }}
                type={"text"}
                sx={{
                  marginBottom: "1rem",
                  width: "90%",
                  height: "44.9px",
                  borderRadius: "0.625rem",
                  background: "#2C3248",
                  boxShadow:
                    "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                }}
                style={{ color: "#FFF" }}
              />
              <Typography sx={colabsList.typographyButtonList}>
                Correo
              </Typography>
              <OutlinedInput
                value={data["mail"]}
                onChange={(e) => {
                  inputOnChange("mail", e.target.value);
                }}
                type={"text"}
                sx={{
                  marginBottom: "1rem",
                  width: "90%",
                  height: "44.9px",
                  borderRadius: "0.625rem",
                  background: "#2C3248",
                  boxShadow:
                    "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                }}
                style={{ color: "#FFF" }}
              />
              <Typography sx={colabsList.typographyButtonList}>
                Status
              </Typography>
              <Select
                style={{
                  color: "#FFF",
                }}
                sx={{ ...selectStyle, width: "90%" }}
                value={data["status"]}
                onChange={handleSelectChange}
              >
                <MenuItem value='admin'>Administrador</MenuItem>
                <MenuItem value='salesman'>Vendedor</MenuItem>
                <MenuItem value='editor'>Editor Inventario</MenuItem>
              </Select>
              <Typography sx={colabsList.typographyButtonList}>
                Tareas/Secciones Autorizadas
              </Typography>
              <Select
                sx={{ ...selectStyle, width: "90%" }}
                style={{ color: "#FFF" }}
                multiple
                value={data["jobs"]}
                onChange={handleChange}
                input={<OutlinedInput />}
                renderValue={(selected) => selected.join(", ")}
                MenuProps={MenuProps}
              >
                {listJobs.map((job: any) => (
                  <MenuItem key={job} value={job}>
                    <Checkbox checked={data.jobs.indexOf(job) > -1} />
                    <ListItemText primary={job} />
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: { xs: "center", sm: "space-between" },
              width: { sm: "53%" },
              marginLeft: { xs: "0", sm: "auto" },
            }}
          >
            <Button
              onClick={() => handleUpdateProduct(data.uid, data)}
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
                ACEPTAR
              </Typography>
            </Button>
          </Box>
        </ModalContent>
      </Modal>
    </Box>
  );
}
