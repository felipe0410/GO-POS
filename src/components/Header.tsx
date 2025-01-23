import { Box, Divider, Typography } from "@mui/material";
import React, { ReactNode } from "react";

interface HeaderProps {
  title: string;
  txt?: any;
}

const Header: React.FC<HeaderProps> = ({ title, txt }) => {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            color: "#69EAE2",
            fontFamily: "Nunito",
            fontSize: { xs: "24px", sm: "40px" },
            fontStyle: "normal",
            fontWeight: 700,
            lineHeight: "normal",
          }}
        >
          <Box display={"flex"}>
            {title}
            {txt && <Box>{txt}</Box>}
          </Box>
        </Typography>
      </Box>
      <Divider sx={{ background: "#69EAE2", width: "95%" }} />
    </Box>
  );
};

export default Header;
