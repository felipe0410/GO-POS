"use client";
import React, { useState } from "react";
import DatePicker from "react-datepicker";

const CalendarioAno = () => {
  const [selectedYear, setSelectedYear] = useState<string | null>(null);

  const formatearFechas = (date: Date | null) => {
    if (date) {
      const year = date.getFullYear().toString();
      return year;
    }
    return null;
  };

  return (
    <DatePicker
      maxDate={new Date()}
      showIcon
      onChange={(update: Date | null) => {
        setSelectedYear(formatearFechas(update));
      }}
      selected={selectedYear ? new Date(Number(selectedYear), 0, 1) : null}
      showYearPicker
      dateFormat='yyyy'
    />
  );
};

export default CalendarioAno;
