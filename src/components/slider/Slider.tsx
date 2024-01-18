"use client";
import { Box, Typography, Checkbox, FormControlLabel } from "@mui/material";
import React, { useState } from "react";
import { StylesSlider } from "@/components/slider/sliderStyles";

const Slider = ({ setFactura, factura }: { factura: any; setFactura: any }) => {
  const [checked, setChecked] = useState<boolean>(false);

  const handleChange = () => {
    setChecked(!checked);
    setFactura({ ...factura, status: !checked ? "cancelado" : "pendiente" });
  };

  return (
    <Box
      id='container slider'
      sx={{
        ...StylesSlider.boxRegister2,
        width: "fit-content",
        padding: "25px 14px",
      }}
    >
      <Box sx={StylesSlider.boxRegister3}>
        <Box
          sx={{
            ...StylesSlider.boxRegister4,
            color: !checked ? "#69EAE2" : "#1F1D2B",
          }}
        >
          <Box sx={StylesSlider.boxButtonRegister}>
            <Typography sx={StylesSlider.typographyLogin}>PENDIENTE</Typography>
          </Box>
          <Checkbox
            checked={checked}
            onChange={handleChange}
            sx={StylesSlider.checkbox}
            id='switch-button-checkbox'
          />
          <Box sx={StylesSlider.boxRegister5}>
            <Box
              sx={{
                ...StylesSlider.boxButtonRegister2,
                transform: `translateX(${checked ? "132px" : "0"})`,
              }}
            />
            <FormControlLabel
              control={<span />}
              htmlFor='switch-button-checkbox'
              label={
                <Typography
                  sx={{
                    ...StylesSlider.typographyRegister,
                    color: checked ? "#69EAE2" : "#1F1D2B",
                  }}
                  component='span'
                  align='center'
                >
                  CANCELADO
                </Typography>
              }
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Slider;
