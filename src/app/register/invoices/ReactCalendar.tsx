import { Button, Typography } from "@mui/material";
import * as React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CalendarCustom.css"; 

export default function ReactCalendar({
  setSearchTerm,
  handleClose,
  setSelectedDate,
}: {
  setSearchTerm: any;
  handleClose: any;
  setSelectedDate: any;
}) {
  const [dateTabs, setDateTabs] = React.useState<any>(null);
  const [selectedDates, setSelectedDates] = React.useState<any>(null);
  const [buttonOn, setButtonOn] = React.useState<boolean>(false);

  const handleOk = () => {
    setSelectedDates(formatearFechas(dateTabs));
    setButtonOn(true);
  };

  const handleAcceptDate = () => {
    if (selectedDates) {
      setSearchTerm(selectedDates);
      setSelectedDate(selectedDates);
      handleClose();
      setButtonOn(false);
    }
  };

  function formatearFechas(dates: any) {
    return dates?.map((date: any) => {
      const fecha = new Date(date);
      const year = fecha.getFullYear();
      const month = String(fecha.getMonth() + 1).padStart(2, "0");
      const day = String(fecha.getDate()).padStart(2, "0");

      return `${year}-${month}-${day}`;
    });
  }

  return (
    <div>
      <Calendar
        onChange={setDateTabs}
        value={dateTabs}
        maxDate={new Date()}
        selectRange={true}
      />
      {buttonOn ? (
        <Button
          onClick={handleAcceptDate}
          sx={{
            marginTop: "10px",
            width: "8.75rem",
            height: "1.5625rem",
            borderRadius: "0.625rem",
            background: "#69eae2ab",
            boxShadow:
              "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            "&:hover": { backgroundColor: "#69EAE2" },
          }}
        >
          <Typography
            sx={{
              color: "#1F1D2B",
              textAlign: "center",
              fontFamily: "Nunito",
              fontSize: "0.875rem",
              fontWeight: 800,
            }}
          >
            CONFIRMAR
          </Typography>
        </Button>
      ) : (
        <Button
          disabled={dateTabs === null}
          onClick={handleOk}
          sx={{
            marginTop: "10px",
            width: "8.75rem",
            height: "1.5625rem",
            borderRadius: "0.625rem",
            background: dateTabs === null ? "gray" : "#69EAE2",
            boxShadow:
              "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            "&:hover": { backgroundColor: "#69EAE2" },
          }}
        >
          <Typography
            sx={{
              color: "#1F1D2B",
              textAlign: "center",
              fontFamily: "Nunito",
              fontSize: "0.875rem",
              fontWeight: 800,
            }}
          >
            ACEPTAR
          </Typography>
        </Button>
      )}
    </div>
  );
}
