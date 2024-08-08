import React from "react";
import { Box, InputBase } from "@mui/material";

interface NoteSectionProps {
  nota: string;
  setNota: (nota: string) => void;
}

const NoteSection: React.FC<NoteSectionProps> = ({ nota, setNota }) => (
  <Box
    sx={{
      width: "100%",
      marginTop: "10px",
    }}
  >
    <InputBase
      sx={{
        width: "100%",
        height: "37px",
        padding: "5px",
        fontSize: "16px",
        color: "#FFF",
        borderRadius: "0.5rem",
        border: "1px solid var(--Base-Dark-Line, #393C49)",
        background: "var(--Base-Form-BG, #2D303E)",
      }}
      placeholder="Nota de la orden..."
      value={nota}
      onChange={(event: React.ChangeEvent<HTMLInputElement>) => setNota(event.target.value)}
    />
  </Box>
);

export default NoteSection;
