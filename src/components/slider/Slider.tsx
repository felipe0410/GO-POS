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
    <Box sx={StylesSlider.boxRegister2}>
      <Box sx={StylesSlider.boxRegister3}>
        <Box
          sx={{
            ...StylesSlider.boxRegister4,
            color: !checked ? "#FFF" : "#000",
          }}
        >
          <Box sx={StylesSlider.boxButtonRegister}>
            <Typography sx={StylesSlider.typographyLogin}>CANCELADO</Typography>
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
                    color: checked ? "#FFF" : "#000",
                  }}
                  component='span'
                  align='center'
                >
                  PENDIENTE
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
