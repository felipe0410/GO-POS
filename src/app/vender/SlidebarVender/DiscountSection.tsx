import React from "react";
import {
  Box,
  Typography,
  Button,
  IconButton,
  InputBase,
  InputAdornment,
  styled,
  Tooltip,
  TooltipProps,
  tooltipClasses,
} from "@mui/material";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import HelpIcon from "@mui/icons-material/Help";

interface DiscountSectionProps {
  agregarDescuento: boolean;
  setAgregarDescuento: (value: boolean) => void;
  descuentoON: boolean;
  setDescuentoON: (value: boolean) => void;
  descuento: number;
  setDescuento: (value: number) => void;
  inputValue: string;
  setInputValue: (value: string) => void;
  calcularTotal: (event: any) => void;
}
const LightTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#69EAE2",
    color: "#1F1D2B",
    boxShadow: theme.shadows[1],
    fontSize: 11,
    maxWidth: "146px",
  },
}));

const DiscountSection: React.FC<DiscountSectionProps> = ({
  agregarDescuento,
  setAgregarDescuento,
  descuentoON,
  setDescuentoON,
  descuento,
  setDescuento,
  inputValue,
  setInputValue,
  calcularTotal,
}) => (
  <Box
    id="contianer_discount"
    sx={{
      marginTop: "0.8rem",
      display: "flex",
      justifyContent: "space-between",
    }}
  >
    {agregarDescuento === false ? (
      <Button
        onClick={() => setAgregarDescuento(true)}
        sx={{
          color: "#69EAE2",
          textAlign: "center",
          fontFamily: "Nunito",
          fontSize: { xs: "14px", sm: "16px" },
          fontStyle: "normal",
          fontWeight: 500,
          lineHeight: "140%",
          textTransform: "none",
        }}
      >
        Ingresar descuento
        <ArrowDropDownIcon sx={{ color: "#69EAE2" }} />
      </Button>
    ) : (
      <>
        <Typography
          sx={{
            color: "#FFF",
            textAlign: "center",
            fontFamily: "Nunito",
            fontSize: { xs: "14px", sm: "16px" },
            fontStyle: "normal",
            fontWeight: 500,
            lineHeight: "140%",
          }}
        >
          Descuento
          <LightTooltip
            title="Puede ingresar el valor del descuento en porcentaje o pesos."
            arrow
          >
            <HelpIcon
              sx={{
                fontSize: "0.8rem",
                "&:hover": { color: "#69EAE2" },
              }}
            />
          </LightTooltip>
        </Typography>
        {descuentoON ? (
          <Typography
            sx={{
              color: "#69EAE2",
              textAlign: "center",
              fontFamily: "Nunito",
              fontSize: { xs: "14px", sm: "16px" },
              fontStyle: "normal",
              fontWeight: 500,
              lineHeight: "90%",
            }}
          >
            <IconButton
              sx={{ paddingTop: "2px", paddingRight: "2px" }}
              onClick={() => {
                setDescuento(0);
                setDescuentoON(false);
              }}
            >
              <Box
                component={"img"}
                src={"/images/edit.svg"}
                sx={{ width: "0.9rem", height: "0.9rem" }}
              />
            </IconButton>
            {`$ ${descuento.toLocaleString("en-US")}`}
          </Typography>
        ) : (
          <InputBase
            autoFocus
            startAdornment={
              <InputAdornment position="start">
                <IconButton
                  sx={{ paddingRight: "0px" }}
                  onClick={calcularTotal}
                >
                  <Typography
                    sx={{
                      color: "#69EAE2",
                      textAlign: "center",
                      fontFamily: "Nunito",
                      fontSize: "16px",
                      fontStyle: "normal",
                      fontWeight: 500,
                      lineHeight: "140%",
                    }}
                  >
                    APLICAR
                  </Typography>
                </IconButton>
              </InputAdornment>
            }
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            sx={{ width: "9.75rem", height: "2.25rem" }}
            style={{
              borderRadius: "0.375rem",
              border: "1px solid #69EAE2",
              background: "#1F1D2B",
              color: "#FFF",
            }}
          />
        )}
      </>
    )}
  </Box>
);

export default DiscountSection;
