"use client";
import * as React from "react";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import { Box } from "@mui/material";
import DeleteModal from "./DeleteModal";
import EditModal from "./EditModal";
import { v4 as uuidv4 } from "uuid";

export default function InventoryCard({
  filteredData,
  wholesale = false,
}: {
  filteredData: any;
  wholesale?: boolean;
}) {
  const StyledCardContent = styled(CardContent)(({ theme }) => ({
    "&:last-child": {
      paddingBottom: "12px",
    },
  }));

  const dataUser = JSON.parse(localStorage?.getItem("dataUser") ?? "{}");
  const display =
    (dataUser?.jobs ?? []).includes("Inventario") ||
    dataUser?.status === "admin";

  return filteredData?.map((product: any) => {
    return (
      <Card
        id="card"
        key={uuidv4()}
        sx={{
          width: "11rem",
          maxHeight: "17.52rem",
          borderRadius: "0.32rem",
          background: "#2C3248",
          overflow: "visible",
          textAlign: "-webkit-center",
          marginBottom: "65px",
          "&:hover": {
            border: "1px solid #69EAE2",
          },
        }}
      >
        <Box
          sx={{
            position: "relative",
            display: display ? "flex" : "none",
            justifyContent: "flex-end",
            marginBottom: "-6%",
            marginRight: "3%",
            zIndex: 4,
          }}
        >
          <CardActions
            disableSpacing
            sx={{ padding: 0, display: wholesale ? "none" : "auto" }}
          >
            <EditModal key={uuidv4()} data={product} />
            <DeleteModal key={uuidv4()} data={product} />
          </CardActions>
        </Box>
        <Box
          id="contianer img"
          sx={{
            position: "relative",
            height: "8rem",
            marginTop: "-25%",
            overflow: "visible",
          }}
        >
          <Box
            component={"img"}
            src={
              product?.image?.length > 0
                ? product?.image === "images/noImage.svg"
                  ? `/${product?.image}`
                  : product?.image
                : "/images/noImage.svg"
            }
            alt={`imagen del producto ${product.productName}`}
            sx={{
              width: "50%",
              height: { xs: "130px", sm: "130px" },
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
              "&:hover": {
                transform: "scale(1.7)",
                left: "25%",
              },
            }}
            loading="lazy"
          />
        </Box>
        <StyledCardContent
          sx={{
            padding: 0,
          }}
        >
          <Typography
            sx={{
              color: "#69EAE2",
              textAlign: "center",
              fontFamily: "Nunito",
              fontSize: { xs: "10px", sm: "14px" },
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "130%",
            }}
          >
            {product.productName}
          </Typography>
          <Typography
            sx={{
              marginTop: "1px",
              color: "var(--text-light, #ABBBC2)",
              textAlign: "center",
              fontSize: { xs: "10px", sm: "14px" },
              fontStyle: "normal",
              fontWeight: 200,
              lineHeight: "140%",
            }}
          >
            {product.barCode}
          </Typography>
          <Typography
            sx={{
              marginTop: "2px",
              color: "var(--White, #FFF)",
              textAlign: "center",
              fontFamily: "Nunito",
              fontSize: { xs: "10px", sm: "14px" },
              fontStyle: "normal",
              fontWeight: 700,
              lineHeight: "140%",
            }}
          >
            {wholesale ? product?.wholesalePrice ?? "0" : product.price}
          </Typography>
          <Typography
            sx={{
              marginTop: "1px",
              color: "var(--text-light, #ABBBC2)",
              textAlign: "center",
              fontFamily: "Nunito",
              fontSize: { xs: "10px", sm: "14px" },
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "140%",
              display: wholesale ? "none" : "block",
            }}
          >
            Existencias:{" "}
            <span style={{ color: "#fff", fontSize: "700" }}>
              {product.cantidad}
            </span>
          </Typography>
          <Typography
            sx={{
              color: "#ABBBC2",
              textAlign: "center",
              fontFamily: "Nunito",
              fontSize: { xs: "10px", sm: "14px" },
              fontStyle: "normal",
              fontWeight: 400,
              lineHeight: "140%",
            }}
          >
            {product.category}
          </Typography>
        </StyledCardContent>
      </Card>
    );
  });
}
