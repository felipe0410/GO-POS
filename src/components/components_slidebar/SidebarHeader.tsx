// SidebarHeader.tsx
"use client";
import React from "react";
import IconButton from "@mui/material/IconButton";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { Box, Typography } from "@mui/material";

interface SidebarHeaderProps {
  open: boolean;
  onClose: () => void;
  onOpen: () => void;
}

const SidebarHeader: React.FC<SidebarHeaderProps> = ({ open, onClose, onOpen }) => {
  return (
    <Box
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
        padding: (theme) => theme.spacing(0, 1),
        ...((theme) => theme.mixins.toolbar),
      }}
    >
      <Box>
        <Typography
          align="center"
          sx={{
            animation: "myAnim 2s ease 0s 1 normal forwards",
            color: "#FFF",
            textShadow: "0px 0px 20px #69EAE2",
            fontFamily: "Nunito",
            fontSize: open ? "3rem" : "2rem",
            fontStyle: "normal",
            fontWeight: 800,
            lineHeight: "normal",
          }}
        >
          GO
        </Typography>
      </Box>
      {open ? (
        <IconButton onClick={onClose}>
          <ChevronLeftIcon sx={{ color: "#69EAE2", fontSize: "24px", ml: "10px" }} />
        </IconButton>
      ) : (
        <IconButton onClick={onOpen}>
          <ChevronRightIcon sx={{ color: "#69EAE2", fontSize: "24px", ml: "10px" }} />
        </IconButton>
      )}
    </Box>
  );
};

export default SidebarHeader;
