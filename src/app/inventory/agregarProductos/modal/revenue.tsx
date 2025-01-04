import * as React from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import { styled, css } from "@mui/system";
import { Modal as BaseModal } from "@mui/base/Modal";
import { Box, Paper, IconButton, InputBase } from "@mui/material";
import { saveSettings } from "@/firebase";
import SettingsIcon from "@mui/icons-material/Settings";
import CloseIcon from "@mui/icons-material/Close";
import { useEffect } from "react";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import CustomizedSwitches from "./swith";
import { NumericFormat } from "react-number-format";

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
    gap: ${!theme.breakpoints.down("sm") ? "8px" : "0"};
    overflow: hidden;
    background-color: #1f1d2b;
    border-radius: 0.625rem;
    padding: ${!theme.breakpoints.down("sm") ? "35px" : "25px"};
    width: ${!theme.breakpoints.down("sm") ? "52.125rem" : "22rem"};
    height: 20rem;
  `
);

export default function Revenue() {
  const [open, setOpen] = React.useState(false);
  const [revenue, setRevenue] = React.useState({
    prefix: "",
    value: "",
  });
  const [num, setNum] = React.useState(8);
  const [isActive, setIsActive] = React.useState(false);
  const handleClose = () => setOpen(false);

  const handleCancel = () => {
    handleClose();
  };

  const handleOnChangePrice = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRevenue(() => {
      const cleanString = event.target.value.replace(/[\$,\s%]/g, "");
      const numberValue = parseFloat(cleanString);
      const prefix = !isActive ? "%" : "$";
      return {
        prefix,
        value: `${numberValue}`,
      };
    });
  };

  useEffect(() => {
    const settingsData = localStorage.getItem("settingsData");
    if (settingsData) {
      const settings = JSON.parse(settingsData);
      if (settings.revenue) {
        setIsActive(settings?.revenue?.prefix === "%");
        setRevenue({
          prefix: settings?.revenue?.prefix ?? "",
          value: `${settings?.revenue?.value ?? ""}`,
        });
      }
    }
  }, []);

  useEffect(() => {
    setRevenue({ ...revenue, prefix: !isActive ? "%" : "$" });
  }, [isActive]);

  return (
    <Box>
      <Button
        onClick={() => setOpen(true)}
        sx={{
          width: "100%",
          height: "2.5rem",
          borderRadius: "0.625rem",
          boxShadow:
            "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
          background: "#69EAE2",
          marginTop: "10px",
        }}
      >
        <Typography
          sx={{
            color: "#1F1D2B",
            textAlign: "center",
            fontFamily: "Nunito",
            fontSize: { xs: "0.58rem", sm: "0.875rem" },
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "normal",
          }}
        >
          CALCULAR GANANCIA
        </Typography>
      </Button>
      <Modal open={open} onClose={handleClose}>
        <ModalContent
          sx={{
            boxShadow:
              "0px 1px 100px -50px #69EAE2, 0px 4px 250px -50px #69EAE2",
          }}
        >
          <SnackbarProvider />
          <Box sx={{ textAlign: "center" }}>
            <Box
              sx={{
                position: "absolute",
                right: 0,
                top: "5px",
              }}
            >
              <Button onClick={() => handleCancel()}>
                <CloseIcon sx={{ color: "#fff" }} />
              </Button>
            </Box>
            <Typography
              sx={{
                color: "#69EAE2",
                textAlign: "center",
                fontFamily: "Nunito",
                fontSize: { xs: "18px", sm: "24px" },
                fontStyle: "normal",
                fontWeight: 600,
                lineHeight: "32.74px",
              }}
            >
              ¿Cual quieres que sea tu ganancia?
            </Typography>
            <Typography
              sx={{
                fontFamily: "Nunito",
                fontSize: { xs: "12px", sm: "16px" },
                fontWeight: 400,
                lineHeight: "15px",
                textAlign: "center",
                color: "#FFFFFF",
                marginY: { xs: "12px", sm: "20px" },
              }}
            >
              Define el porcentaje o valor en pesos de tu ganancia.
            </Typography>
          </Box>
          <>
            <NumericFormat
              onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                handleOnChangePrice(event)
              }
              endAdornment={
                <CustomizedSwitches
                  setIsActive={setIsActive}
                  isActive={isActive}
                />
              }
              value={revenue.value ?? 0}
              prefix={!isActive ? "% " : "$ "}
              placeholder="Precio..."
              thousandSeparator={isActive}
              customInput={InputBase}
              style={{
                background: "#2C3248",
                borderRadius: "10px",
                color: "#fff",
                boxShadow: "0px 4px 4px 0px #00000040",
                padding: "5px 20px",
                width: "80%",
                margin: "10px auto",
                textAlignLast: "center",
              }}
            />
          </>
          <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
            <Button
              onClick={() => {
                try {
                  saveSettings({ revenue });
                  const existingSettings = JSON.parse(
                    localStorage.getItem("settingsData") || "{}"
                  );
                  const updatedSettings = {
                    ...existingSettings,
                    ...{ revenue },
                  };
                  localStorage.setItem(
                    "settingsData",
                    JSON.stringify(updatedSettings)
                  );
                  enqueueSnackbar("valor guardado con exito", {
                    variant: "success",
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "right",
                    },
                  });
                  setTimeout(() => {
                    handleCancel();
                  }, 2000);
                } catch (error) {
                  enqueueSnackbar("error al guardar los valores", {
                    variant: "success",
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "right",
                    },
                  });
                }
              }}
              sx={{
                width: "40%",
                height: "1.5625rem",
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
