import { Box, Chip, Divider, Typography, styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import { colabsList } from "./profileStyles";
import EditModalColab from "./EditModalColab";
import DeleteModalColab from "./DeleteModalColab";

const StyledChip = styled(Chip)(
  ({ theme }) => `
          .MuiChip-label {
            color: #FFF;
            font-family: Nunito;
            font-size: 12px;
            font-style: normal;
            font-weight: 700;
            line-height: normal;
          }
      `
);

const StyledChipStatus = styled(Chip)(
  ({ theme }) => `
          .MuiChip-label {
            color:  #252836;
            font-family: Nunito;
            font-size: 16px;
            font-style: normal;
            font-weight: 700;
            line-height: normal;
          }
      `
);

const ColabsList = ({ data }: { data: any }) => {
  console.log(data);

  const [colabData, setColabData] = useState({
    uid: "",
    name: "",
    jobs: [],
    password: "",
    img: "",
    uidEstablishments: "",
    mail: "",
    status: "",
  });

  useEffect(() => {
    setColabData(data);
  }, [data]);

  function getStatusLabel(status: string) {
    switch (status) {
      case "salesman":
        return "VENDEDOR";
      case "admin":
        return "ADMINISTRADOR";
      case "editor":
        return "INVENTARIO";
      default:
        return "INVITADO";
    }
  }

  return (
    <Box
      sx={{
        marginTop: "1.5rem",
        display: "flex",
        flexDirection: "row",
      }}
    >
      <Box sx={{ width: "20%" }}>
        {colabData.img ? (
          <img
            alt={`img from colab ${colabData.name}`}
            src={colabData.img}
            style={{ width: "100px", height: "100px", borderRadius: "50%" }}
          />
        ) : (
          <div
            style={{
              width: "100px",
              height: "100px",
              borderRadius: "50%",
              backgroundColor: "#2C3248",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              alt={`img from colab ${colabData.name}`}
              src='/images/noPerson.png'
              style={{ width: "50px", height: "50px" }}
            />
          </div>
        )}
      </Box>

      <Box sx={{ width: "70%", textAlign: "start" }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Typography sx={{ ...colabsList.typographyName, marginTop: "1rem" }}>
            {colabData.name.toUpperCase()}
          </Typography>
          <StyledChipStatus
            sx={{
              m: 1,
              borderRadius: "0.625rem",
              background: " #D9D9D9",
              boxShadow:
                "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
            }}
            variant='outlined'
            label={getStatusLabel(colabData.status)}
          />
        </Box>
        {colabData.jobs.map((job: any, index: any) => (
          <StyledChip
            sx={{
              m: 1,
              borderRadius: "0.625rem",
              background: "#DB661A",
              height: "20px",
            }}
            key={index * 123}
            variant='outlined'
            label={job.toUpperCase()}
          />
        ))}
        <Divider
          sx={{
            background: "#69EAE2",
            width: "100%",
            marginY: "10px",
          }}
        />
      </Box>
      <Box
        sx={{
          width: "10%",
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-evenly",
          marginTop: "0.5rem",
        }}
      >
        <EditModalColab data={colabData} setColabData={setColabData} />
        <DeleteModalColab data={colabData} />
      </Box>
    </Box>
  );
};

export default ColabsList;
