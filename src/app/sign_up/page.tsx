"use client";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Paper,
  Select,
  TextField,
  Button,
  Modal,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { styleSign_up } from "./style";
import { creteUser, saveDataUser } from "@/firebase";

const Sing_up = () => {
  const adminPassword = "Nazly1972";
  const [admin, setAdmin] = useState("");
  const [data, setData] = useState<any>({
    rol: "",
    name: "",
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const router = useRouter();
  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  const [open, setOpen] = useState(false);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const inputs = [
    {
      type: "text",
      label: "Nombre",
      placeHolder: "nombre + apellido",
      validation: () => data.name.length > 4 || data.name.length < 2,
      msgErrror: "Ingresa un nombre valido",
      field: "name",
      value: data.name,
    },
    {
      type: "email",
      label: "Usuario (Correo electronico)",
      placeHolder: "ejemplo@gmail.com",
      validation: () =>
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email) || data.email.length < 2,
      msgErrror: "Ingrese un correo valido",
      field: "email",
      value: data.email,
    },
    {
      type: "password",
      label: "Contraseña",
      placeHolder: "xxxxxxxxxx",
      validation: () =>
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
          data.password
        ) || data.password.length < 2,
      msgErrror:
        'La contraseña debe contener una letra mayuscula, una minuscula , un simbolo "%$&..." y debe tener una longitud de 8 caracteres',
      field: "password",
      value: data.password,
    },
  ];
  const validarInputs = () => {
    for (const input of inputs) {
      if (!input.validation()) {
        return false;
      }
    }
    return true;
  };
  const validateLength = () => {
    const arrayValue = Object.values(data);
    const validation = arrayValue.some((valor: any) => valor.length < 2);
    if (validation) {
      return true;
    }
    const validation2 = validarInputs();
    if (!validation2) {
      return true;
    }
    return false;
  };

  const password = () => {
    return (
      <FormControl fullWidth variant='outlined'>
        <OutlinedInput
          id='outlined-adornment-password'
          type={showPassword ? "text" : "password"}
          endAdornment={
            <InputAdornment position='end'>
              <IconButton
                aria-label='toggle password visibility'
                onClick={handleClickShowPassword}
                onMouseDown={handleMouseDownPassword}
                edge='end'
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          }
          fullWidth
          sx={{
            borderRadius: "10px",
            background: "rgba(255, 255, 255, 0.77)",
            boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
          }}
          onChange={(e) => setData({ ...data, password: e.target.value })}
          placeholder='xxxxxxxx'
        />
      </FormControl>
    );
  };

  const createUser = async () => {
    if (admin !== adminPassword) {
      enqueueSnackbar("Contraseña admin invalida", {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
      return null;
    }
    if (!validateLength()) {
      const creation: any = await creteUser(data.email, data.password);
      saveDataUser(creation.uid, data);
      if (creation?.errorCode === "auth/email-already-in-use") {
        console.log("entro aqui");
        enqueueSnackbar("El correo ya esta en uso", {
          variant: "error",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
      } else {
        enqueueSnackbar("Usuario creado con exito", {
          variant: "success",
          anchorOrigin: {
            vertical: "bottom",
            horizontal: "right",
          },
        });
        setTimeout(() => {
          router.push("/sign_in");
        }, 3000);
      }
    } else {
      enqueueSnackbar("Completa los campos", {
        variant: "error",
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "right",
        },
      });
    }
  };

  const modal = (
    <>
      <Button
        onClick={handleOpen}
        sx={{
          padding: "5px 20px",
          borderRadius: "40px",
          background: validateLength() ? "#b4bac2" : "#5C68D4",
          boxShadow:
            "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
          color: "#FFF",
          fontFamily: "Nunito",
          fontSize: { xs: "20px", md: "28px" },
          fontStyle: "normal",
          fontWeight: 800,
          lineHeight: "normal",
          marginTop: "20px",
        }}
      >
        CREAR USUARIO
      </Button>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby='parent-modal-title'
        aria-describedby='parent-modal-description'
        sx={{
          position: "absolute" as "absolute",
          top: "50%",
          left: "50%",
          p: 4,
          transform: "translate(-50%, -50%)",
          background: "transparent",
          height: "100%",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            height: "min-content",
            borderRadius: "40px",
            background: "#eff0fefa",
            boxShadow:
              "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            width: "fit-content",
            padding: "20px",
            textAlign: "center",
          }}
        >
          <>
            <Typography
              sx={{
                color: "#0A0F37",
                fontFamily: "Nunito",
                fontSize: { xs: "18px", md: "25px" },
                fontStyle: "normal",
                fontWeight: 800,
                lineHeight: "normal",
                marginY: { xs: "7px", md: "15px" },
              }}
            >
              {"Contraseña de administrador"}
            </Typography>
            <TextField
              fullWidth
              sx={{
                borderRadius: "10px",
                background: "rgba(255, 255, 255, 0.77)",
                boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
              }}
              id={"contraseña admin"}
              type={"password"}
              placeholder={"*******"}
              value={admin}
              onChange={(e) => setAdmin(e.target.value)}
            />
          </>
          <Button
            onClick={createUser}
            sx={{
              padding: "5px 20px",
              borderRadius: "40px",
              background:
                "linear-gradient(180deg, #FF4A11 136.16%, rgba(244, 66, 9, 0.00) 136.17%)",
              boxShadow:
                "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
              color: "#FFF",
              fontFamily: "Nunito",
              fontSize: { xs: "20px", md: "28px" },
              fontStyle: "normal",
              fontWeight: 800,
              lineHeight: "normal",
              marginTop: "20px",
            }}
          >
            CREAR USUARIO
          </Button>
        </Box>
      </Modal>
    </>
  );
  return (
    <>
      <SnackbarProvider />
      <Box sx={{ textAlignLast: "center" }}>
        <Typography sx={{ ...styleSign_up.tile }}>
          PAPELERIA NUEVO MILENIO
        </Typography>
        <Typography sx={{ ...styleSign_up.title2 }}>
          Bienvenido a nuestro portal
        </Typography>
        <Box>
          <Box
            sx={{ maxWidth: "295px" }}
            width={"50%"}
            component={"img"}
            src='Loggin/logoInter.png'
          />
        </Box>
      </Box>
      <Box>
        <Paper
          sx={{
            borderRadius: "40px",
            background: "#9BA2E5",
            boxShadow:
              "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            width: { xs: "80%", md: "30%" },
            margin: "0 auto",
            padding: "2% 4%",
          }}
          elevation={0}
        >
          <Button
            onClick={() => router.push("/sign_in")}
            sx={{
              background: "rgba(255, 255, 255, 0.77)",
              minWidth: "auto",
              borderRadius: "20PX",
            }}
          >
            <ArrowBackIcon
              sx={{ color: "#0A0F37", fontSize: { xs: "small", md: "auto" } }}
            />
          </Button>
          <Typography
            sx={{
              color: "#FFF",
              fontFamily: "Nunito",
              fontSize: { xs: "23px", md: "35px" },
              fontStyle: "normal",
              fontWeight: 800,
              lineHeight: "normal",
              textAlignLast: "center",
            }}
          >
            REGISTRATE
          </Typography>
          <Typography
            sx={{
              color: "#0A0F37",
              fontFamily: "Nunito",
              fontSize: { xs: "18px", md: "25px" },
              fontStyle: "normal",
              fontWeight: 800,
              lineHeight: "normal",
              marginY: { xs: "7px", md: "15px" },
            }}
          >
            Tipo de usuario
          </Typography>
          <FormControl id='form-control' fullWidth>
            <Select
              sx={{
                background: "#FFFFFFC4",
                borderRadius: "10px",
                boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                color: data.rol.length === 0 ? "#808080b3" : "#000",
              }}
              id='demo-simple-select'
              value={
                data.rol.length === 0 ? "seleccionar tipo de usuario" : data.rol
              }
              onChange={(e) => setData({ ...data, rol: e.target.value })}
              placeholder='seleccionar tipo de usuario'
            >
              <MenuItem
                sx={{ display: "none" }}
                value={"seleccionar tipo de usuario"}
              >
                seleccionar tipo de usuario
              </MenuItem>
              <MenuItem value={"Administrador"}>Administrador</MenuItem>
              <MenuItem value={"Mensajero"}>Mensajero</MenuItem>
            </Select>
          </FormControl>
          <Box>
            {inputs.map((input, index) => {
              return (
                <Box key={index*98}>
                  <Typography
                    sx={{
                      color: "#0A0F37",
                      fontFamily: "Nunito",
                      fontSize: { xs: "18px", md: "25px" },
                      fontStyle: "normal",
                      fontWeight: 800,
                      lineHeight: "normal",
                      marginY: { xs: "7px", md: "15px" },
                    }}
                  >
                    {input.label}
                  </Typography>
                  {input.type === "password" ? (
                    password()
                  ) : (
                    <>
                      <TextField
                        fullWidth
                        sx={{
                          borderRadius: "10px",
                          background: "rgba(255, 255, 255, 0.77)",
                          boxShadow: "0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                        }}
                        id={input.label}
                        type={input.type}
                        placeholder={input.placeHolder}
                        value={input.value}
                        onChange={(e) =>
                          setData({ ...data, [input.field]: e.target.value })
                        }
                      />
                    </>
                  )}
                  <Typography
                    display={input.validation() ? "none" : "block"}
                    color='error'
                  >
                    {input.msgErrror}
                  </Typography>
                </Box>
              );
            })}
          </Box>
          <Box sx={{ textAlignLast: "center" }}>{modal}</Box>
        </Paper>
      </Box>
    </>
  );
};

export default Sing_up;
