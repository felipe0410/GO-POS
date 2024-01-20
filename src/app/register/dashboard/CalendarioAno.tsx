"use client";
import { IconButton, InputAdornment, OutlinedInput } from "@mui/material";
import React, { useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

const CalendarioAno = ({
  setDateSearchTerm,
  setSelectedDate,
}: {
  setDateSearchTerm: any;
  setSelectedDate: any;
}) => {
  const [startDate, setStartDate] = useState<any>();
  const [endDate, setEndDate] = useState<any>(null);

  const CustomTimeInput = ({ ...restProps }) => (
    <OutlinedInput
      startAdornment={
        <InputAdornment position='start'>
          <IconButton sx={{ padding: "0px" }}>
            <CalendarMonthIcon sx={{ color: "#69EAE2" }} />
          </IconButton>
        </InputAdornment>
      }
      style={{ color: "#FFF" }}
      sx={{
        marginLeft: "2em",
        marginTop: "1.85em",
        width: "55%",
        height: "44.9px",
        borderRadius: "0.625rem",
        background: "#2C3248",
        boxShadow:
          "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
      }}
      {...restProps}
    />
  );

  const formatearFechas = (date: Date | null) => {
    if (date) {
      const year = date.getFullYear().toString();
      return year;
    }
    return null;
  };

  const onChange = (dates: any) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  useEffect(() => {
    const onBlurHandler = () => {
      const nuevoArray = [];

      if (startDate) {
        const formatedStartDate = formatearFechas(startDate);
        nuevoArray.push(formatedStartDate);
      }
      if (endDate) {
        const formatedEndDate = formatearFechas(endDate);
        nuevoArray.push(formatedEndDate);
      }

      setDateSearchTerm(nuevoArray);
      setSelectedDate(nuevoArray);
    };
    onBlurHandler();
  }, [startDate, endDate, setDateSearchTerm, setSelectedDate]);

  return (
    <DatePicker
      selectsRange={true}
      startDate={startDate}
      endDate={endDate}
      maxDate={new Date()}
      onChange={onChange}
      showYearPicker
      dateFormat='yyyy'
      customInput={<CustomTimeInput />}
    />
  );
};

export default CalendarioAno;
