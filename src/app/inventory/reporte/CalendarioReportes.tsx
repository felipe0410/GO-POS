"use client";

import { OutlinedInput, InputAdornment, IconButton } from "@mui/material";
import React, { useEffect, useState, forwardRef } from "react";
import DatePicker from "react-datepicker";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import "react-datepicker/dist/react-datepicker.css";

type Props = {
  onRangeChange: (range: { start: Date | null; end: Date | null }) => void;
};

function startOfMonth(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0);
}

function endOfMonth(d: Date) {
  // último día del mes, 23:59:59.999
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999);
}

const CalendarioReportes: React.FC<Props> = ({ onRangeChange }) => {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate]     = useState<Date | null>(null);

  const CustomInput = forwardRef<HTMLInputElement, any>((props, ref) => (
    <OutlinedInput
      inputRef={ref}
      startAdornment={
        <InputAdornment position="start">
          <IconButton sx={{ p: 0 }}>
            <CalendarMonthIcon sx={{ color: "#69EAE2" }} />
          </IconButton>
        </InputAdornment>
      }
      style={{ color: "#FFF" }}
      sx={{
        ml: "2em",
        mt: "1.85em",
        width: "70%",
        height: "44.9px",
        borderRadius: "0.625rem",
        background: "#2C3248",
        boxShadow:
          "0px 4px 4px rgba(0,0,0,0.25), 0px 4px 4px rgba(0,0,0,0.25)",
      }}
      {...props}
    />
  ));
  CustomInput.displayName = "CustomInput";

  const onChange = (dates: [Date | null, Date | null]) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  useEffect(() => {
    // Normalizamos a inicio/fin de mes para reportes mensuales
    const start = startDate ? startOfMonth(startDate) : null;
    const end   = endDate   ? endOfMonth(endDate)     : null;
    onRangeChange({ start, end });
  }, [startDate, endDate, onRangeChange]);

  return (
    <DatePicker
      selectsRange
      startDate={startDate}
      endDate={endDate}
      maxDate={new Date()}
      onChange={onChange}
      showMonthYearPicker
      dateFormat="yyyy-MM"
      customInput={<CustomInput />}
      placeholderText="Selecciona rango de meses"
      isClearable
    />
  );
};

export default CalendarioReportes;
