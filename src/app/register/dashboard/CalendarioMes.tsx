"use client";
import React, { useState } from "react";
import DatePicker from "react-datepicker";

const CalendarioMes = () => {
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

  return (
    <DatePicker
      maxDate={new Date()}
      showIcon
      onChange={(update: Date | [Date, Date] | null) => {
        if (update instanceof Date) {
          const year = update.getFullYear();
          const month = (update.getMonth() + 1).toString().padStart(2, "0");

          setSelectedMonth(`${year}-${month}`);
        } else {
          setSelectedMonth(null);
        }
      }}
      selected={selectedMonth ? new Date(`${selectedMonth}-01T00:00:00`) : null}
      showMonthYearPicker
      dateFormat='yyyy-MM'
    />
  );
};

export default CalendarioMes;
