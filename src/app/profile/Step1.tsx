import {
  Box,
  Button,
  MenuItem,
  OutlinedInput,
  Select,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { selectStyle, typographyColabsButton } from "./profileStyles";
import StepProgress from "./StepProgress";
import Step2 from "./Step2";

interface ColabsData {
  status: string;
  name: string;
  user: string;
  password: string;
  jobs: string[];
}

const Step1 = () => {
  const [colabsData, setColabsData] = useState<ColabsData>({
    status: " ",
    name: "",
    user: "",
    password: "",
    jobs: [],
  });
  const [step, setStep] = useState(0);

  const inputOnChange = (field: string, value: string) => {
    setColabsData({ ...colabsData, [field]: value });
  };

  const handleSelectChange = (event: any) => {
    setColabsData({ ...colabsData, status: event.target.value });
  };

  const handleCheckboxChange = (job: string) => {
    const isChecked = colabsData.jobs.includes(job);
    if (isChecked) {
      setColabsData((prevState) => ({
        ...prevState,
        jobs: prevState.jobs.filter((item) => item !== job),
      }));
    } else {
      setColabsData((prevState) => ({
        ...prevState,
        jobs: [...prevState.jobs, job],
      }));
    }
  };

  return (
    <>
      {step === 0 ? (
        <Box sx={{ display: "flex", flexDirection: "column" }}>
          <OutlinedInput
            placeholder='Nombre'
            value={colabsData["name"]}
            onChange={(e) => {
              inputOnChange("name", e.target.value);
            }}
            type='text'
            sx={{
              marginBottom: "1rem",
              height: "44.9px",
              borderRadius: "0.625rem",
              background: "#2C3248",
              boxShadow:
                "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
            style={{ color: "#FFF" }}
          />
          <OutlinedInput
            placeholder='Correo/Usuario'
            value={colabsData["user"]}
            onChange={(e) => {
              inputOnChange("user", e.target.value);
            }}
            type='text'
            sx={{
              marginBottom: "1rem",
              height: "44.9px",
              borderRadius: "0.625rem",
              background: "#2C3248",
              boxShadow:
                "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
            style={{ color: "#FFF" }}
          />
          <Select
            style={{
              color: "#FFF",
            }}
            sx={selectStyle}
            value={colabsData["status"]}
            onChange={handleSelectChange}
          >
            <MenuItem value=' '>Status</MenuItem>
            <MenuItem value='admin'>Administrador</MenuItem>
            <MenuItem value='salesman'>Vendedor</MenuItem>
            <MenuItem value='editor'>Editor Inventario</MenuItem>
          </Select>
          <OutlinedInput
            placeholder='Contraseña'
            value={colabsData["password"]}
            onChange={(e) => {
              inputOnChange("password", e.target.value);
            }}
            type='password'
            sx={{
              height: "44.9px",
              borderRadius: "0.625rem",
              background: "#2C3248",
              boxShadow:
                "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
            style={{ color: "#FFF" }}
          />
          <Button
            onClick={() => setStep(step + 1)}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "end",
              marginTop: "12px",
              "&:hover": {
                backgroundColor:
                  "linear-gradient(127deg, rgba(6, 11, 38, 0.74) 28.26%, rgba(24, 24, 42, 0.93) 61.61%, #1F1D2B 91.2%)",
              },
            }}
          >
            <Typography sx={{ ...typographyColabsButton, fontSize: "1rem" }}>
              SIGUIENTE
            </Typography>
            <Box component={"img"} src={"/images/arrow.svg"} />
          </Button>
        </Box>
      ) : (
        <Step2
          step={step}
          setStep={setStep}
          handleCheckboxChange={handleCheckboxChange}
        />
      )}

      <Box sx={{ width: { lg: "100%" }, marginTop: "1rem" }}>
        <StepProgress step={step} />
      </Box>
    </>
  );
};

export default Step1;
