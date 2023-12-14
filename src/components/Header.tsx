import { Divider, Typography } from "@mui/material";
import React from "react";

const Header = ({ title }: { title: string }) => {
  return (
    <>
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
        {title}
      </Typography>
      <Divider sx={{ background: "#69EAE2", width: "95%" }} />
    </>
  );
};

export default Header;
