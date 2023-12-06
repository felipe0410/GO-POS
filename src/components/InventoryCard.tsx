"use client";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";

export default function InventoryCard() {
  const StyledCardContent = styled(CardContent)(({ theme }) => ({
    "&:last-child": {
      paddingBottom: "12px",
    },
  }));
  return (
    <Card
      sx={{
        width: "12rem",
        borderRadius: "0.32rem",
        background: "#2C3248",
        overflow: "visible",
        textAlign: "-webkit-center",
      }}
    >
      <Box
        sx={{
          position: "relative",
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "-6%",
          marginRight: "3%",
          zIndex: 4,
        }}
      >
        <CardActions disableSpacing sx={{ padding: 0 }}>
          <IconButton sx={{ padding: "8px 3px" }}>
            <Box
              component={"img"}
              src={"/images/edit.svg"}
              sx={{ width: "0.8rem", height: "0.8rem" }}
            />
          </IconButton>
          <IconButton sx={{ padding: "8px 3px" }}>
            <Box
              component={"img"}
              src={"/images/delete.svg"}
              sx={{ width: "0.8rem", height: "0.8rem" }}
            />
          </IconButton>
        </CardActions>
      </Box>
      <Box
        sx={{
          position: "relative",
          height: "8rem",
          marginTop: "-25%",
          overflow: "visible",
        }}
      >
        <Box
          component={"img"}
          src={"/images/imageVinilo.png"}
          alt='Vinilo Image'
          sx={{
            width: "7.5rem",
            height: "7.5rem",
            position: "absolute",
            left: "50%",
            transform: "translateX(-50%)",
          }}
        />
      </Box>
      <StyledCardContent
        sx={{
          padding: 0,
          width: "9rem",
        }}
      >
        <Typography
          sx={{
            color: "#69EAE2",
            textAlign: "center",
            fontFamily: "Nunito",
            fontSize: "0.875rem",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "130%",
          }}
        >
          Pintura acrilica verde Payasito
        </Typography>
        <Typography
          sx={{
            marginTop: "1px",
            color: "var(--text-light, #ABBBC2)",
            textAlign: "center",
            fontFamily: "Nunito",
            fontSize: "0.7rem",
            fontStyle: "normal",
            fontWeight: 200,
            lineHeight: "140%",
          }}
        >
          5449851326
        </Typography>
        <Typography
          sx={{
            marginTop: "2px",
            color: "var(--White, #FFF)",
            textAlign: "center",
            fontFamily: "Nunito",
            fontSize: "0.875rem",
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "140%",
          }}
        >
          $ 4.500
        </Typography>
        <Typography
          sx={{
            marginTop: "1px",
            color: "var(--text-light, #ABBBC2)",
            textAlign: "center",
            fontFamily: "Nunito",
            fontSize: "0.736rem",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "140%",
          }}
        >
          100 Unidades disponibles
        </Typography>
        <Typography
          sx={{
            color: "#ABBBC2",
            textAlign: "center",
            fontFamily: "Nunito",
            fontSize: "0.865rem",
            fontStyle: "normal",
            fontWeight: 400,
            lineHeight: "140%",
          }}
        >
          Arte
        </Typography>
      </StyledCardContent>
    </Card>
  );
}
