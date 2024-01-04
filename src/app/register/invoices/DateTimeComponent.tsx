import * as React from "react";
import dayjs from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { StaticDateTimePicker } from "@mui/x-date-pickers/StaticDateTimePicker";
import {
  DateTimePickerTabs,
  DateTimePickerTabsProps,
} from "@mui/x-date-pickers/DateTimePicker";
import DateRangeIcon from "@mui/icons-material/DateRange";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

function CustomTabs(props: DateTimePickerTabsProps) {
  return (
    <React.Fragment>
      <DateTimePickerTabs {...props} />
    </React.Fragment>
  );
}

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
      const [date, hora] = dateTabs.split(" ");
      setSearchTerm(date);
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
      <StaticDateTimePicker
        onAccept={handleAcceptDate}
        onChange={(newValue) => {
          if (newValue) {
            setDateTabs(dayjs(newValue).format("YYYY-MM-DD HH:mm"));
          }
        }}
        defaultValue={dayjs(getCurrentDateTime())}
        slots={{
          tabs: CustomTabs,
        }}
        slotProps={{
          actionBar: {
            actions: ["accept"],
          },
          tabs: {
            hidden: false,
            dateIcon: <DateRangeIcon />,
            timeIcon: <AccessTimeIcon />,
          },
        }}
      />
    </LocalizationProvider>
  );
}
