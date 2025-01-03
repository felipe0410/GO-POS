import React, { useState } from "react";
import { Button } from "@mui/material";

const DateFilter = ({ onFilter }: { onFilter: (dates: string[]) => void }) => {
  const [dates, setDates] = useState<[Date | null, Date | null]>([null, null]);

  const handleFilter = () => {
    if (dates[0] && dates[1]) {
      const formatDate = (date: Date) =>
        date.toISOString().split("T")[0];
      onFilter([formatDate(dates[0]), formatDate(dates[1])]);
    }
  };

  return (
    <>
      <Button onClick={handleFilter}>Filtrar</Button>
    </>
  );
};

export default DateFilter;
