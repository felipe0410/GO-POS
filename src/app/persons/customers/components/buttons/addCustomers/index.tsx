import { Button } from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import { IButtonAddCustomersProps } from "../../../utils/interfaces";

const ButtonAddCustomers = ({
  handleAddCustomer,
}: IButtonAddCustomersProps) => {
  return (
    <Button
      onClick={handleAddCustomer}
      sx={{
        padding: "8px",
        textAlign: "center",
        backgroundColor: "#69EAE2",
        color: "#1F1D2B",
        border: "1px solid #69EAE2",
        borderRadius: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: "0 10px",
        cursor: "pointer",
        fontWeight: 700,
        fontSize: { xs: "10px", sm: "12px" },
        "&:hover": {
          backgroundColor: "#69EAE2",
          color: "#1F1D2B",
          opacity: "70%",
        },
      }}
      startIcon={<AddIcon />}
    >
      AGREGAR NUEVO CLIENTE
    </Button>
  );
};

export default ButtonAddCustomers;
