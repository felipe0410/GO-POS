import * as React from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";

export default function DateTimeComponent({
  setSearchTerm,
  handleClose,
}: {
  setSearchTerm: any;
  handleClose: any;
}) {
  const [dateTabs, setDateTabs] = React.useState<string | null>(null);

  const handleAcceptDate = () => {
    if (dateTabs) {
      setSearchTerm(dateTabs);
      handleClose();
    }
  };

  const getCurrentDateTime = () => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <StaticDatePicker
        sx={{ width: "10px", display: "block" }}
        onAccept={handleAcceptDate}
        onChange={(newValue) => {
          if (newValue) {
            setDateTabs(dayjs(newValue).format("YYYY-MM-DD"));
          }
        }}
        defaultValue={dayjs(getCurrentDateTime())}
        slotProps={{
          actionBar: {
            actions: ["accept"],
          },
        }}
      />
    </LocalizationProvider>
  );
}
