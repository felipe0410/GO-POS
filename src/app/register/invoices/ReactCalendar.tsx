import { Box, Button, IconButton, Typography } from "@mui/material";
import * as React from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./CalendarCustom.css";
import ClearIcon from "@mui/icons-material/Clear";
import { useEffect } from "react";

export default function ReactCalendar({
  setSearchTerm,
  handleClose,
  setSelectedDate,
  selectedDate,
}: {
  setSearchTerm: any;
  handleClose: any;
  setSelectedDate: any;
  selectedDate: any;
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

  useEffect(() => {
    if (selectedDate?.length > 0) {
      setDateTabs(selectedDate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <Calendar
        onChange={setDateTabs}
        value={dateTabs}
        maxDate={new Date()}
        selectRange={true}
      />
      <Box sx={{ display: "flex", justifyContent: "space-evenly" }}>
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
        <Button
          disabled={!(selectedDate?.length > 0)}
          sx={{
            marginTop: "10px",
            width: "8.75rem",
            height: "1.5625rem",
            borderRadius: "0.625rem",
            background: selectedDate?.length > 0 ? "#69EAE2" : "gray",
            boxShadow:
              "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            "&:hover": { backgroundColor: "#69EAE2" },
            color: "#1F1D2B",
            textAlign: "center",
            fontFamily: "Nunito",
            fontSize: "0.875rem",
            fontWeight: 800,
          }}
          onClick={() => setSelectedDate(null)}
        >
          LIMPIAR
          <IconButton disabled={selectedDate !== null}>
            <ClearIcon />
          </IconButton>
        </Button>
      </Box>
    </div>
  );
}
