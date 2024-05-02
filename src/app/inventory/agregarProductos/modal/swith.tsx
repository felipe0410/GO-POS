import * as React from "react";
import { styled } from "@mui/material/styles";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Typography from "@mui/material/Typography";
import { Padding } from "@mui/icons-material";

const IOSSwitch = styled((props) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 62, // Ajustado para dar espacio al texto en el thumb
  height: 26,
  padding: 0,
  margin: "0px",
  "& .MuiSwitch-switchBase": {
    padding: 0,
    margin: 2,
    transitionDuration: "300ms",
    "&.Mui-checked": {
      transform: "translateX(30px)", // Ajustado para centrar el texto dentro del thumb al activarse
      color: "#fff",
      "& + .MuiSwitch-track": {
        backgroundColor: "#1F1D2B",
        color: "#69EAE2", // Fondo de todo el switch
        opacity: 1,
        border: 0,
      },
      "& .MuiSwitch-thumb": {
        backgroundColor: "#69EAE2", // Color del thumb cuando está activo
        "&::after": {
          content: '"$"', // Valor cuando está activo
          position: "absolute",
          color: "#1F1D2B", // Color del texto en el thumb
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          fontSize: "0.875rem", // Tamaño de fuente del símbolo $
        },
      },
    },
    "&:not(.Mui-checked) .MuiSwitch-thumb": {
      backgroundColor: "#69EAE2", // Mismo color para el thumb en estado inactivo
      "&::before": {
        content: '"%"', // Valor cuando está inactivo
        position: "absolute",
        color: "#1F1D2B",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        fontSize: "0.875rem", // Tamaño de fuente del símbolo %
      },
    },
  },
  "& .MuiSwitch-thumb": {
    boxSizing: "border-box",
    width: 27,
    height: 20,
    borderRadius: "10px",
    marginTop:'1px'
  },
  "& .MuiSwitch-track": {
    borderRadius: 13,
    backgroundColor: "#1F1D2B", // Fondo predeterminado del track
    opacity: 1,
    transition: theme.transitions.create(["background-color"], {
      duration: 500,
    }),
  },
}));

export default function CustomizedSwitches() {
  const [isActive, setIsActive] = React.useState(false);
  const handleChange = (
    event: any,
    checked: boolean | ((prevState: boolean) => boolean)
  ) => {
    setIsActive(checked); // Actualizar el estado usando el segundo parámetro
  };
  console.log("isActive:::>", isActive);
  return (
    <FormGroup sx={{ margin: 0, padding: "0" }}>
      <FormControlLabel
        checked={isActive} // Vincular el estado del switch con el estado de React
        onChange={handleChange}
        sx={{ margin: "0" }}
        control={<IOSSwitch />}
        label=""
      />
      <Typography
        sx={{
          position: "absolute",
          right: isActive ? "auto" : 30,
          marginLeft: "10px",
          transitionDuration: "300ms",
          transform: isActive ? "translateX(2px)" : "translateX(0px)", // Ajustado para centrar el texto dentro del thumb al activarse
        }}
      >
        {" "}
        {isActive ? "%" : "$"}{" "}
      </Typography>
    </FormGroup>
  );
}
