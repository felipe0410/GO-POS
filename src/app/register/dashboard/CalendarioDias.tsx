import React, { useState } from "react";
import DatePicker from "react-datepicker";

const CalendarioDias = () => {
  const [startDate, setStartDate] = useState<any>();
  const [endDate, setEndDate] = useState<any>(null);

  function formatearFechas(date: any) {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const nuevoArray = [];
  if (startDate) {
    const formatedStartDate = formatearFechas(startDate);
    nuevoArray.push(formatedStartDate);
  }
  if (endDate) {
    const formatedEndDate = formatearFechas(endDate);
    nuevoArray.push(formatedEndDate);
  }

  const onChange = (dates: any) => {
    const [start, end] = dates;
    setStartDate(start);
    setEndDate(end);
  };

  return (
    <DatePicker
      maxDate={new Date()}
      showIcon
      selectsRange={true}
      startDate={startDate}
      endDate={endDate}
      onChange={onChange}
      isClearable={true}
      dateFormat='yyyy-MM-dd'
    />
  );
};

export default CalendarioDias;
