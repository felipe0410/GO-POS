import { ToggleButton } from "@mui/material";

export const StyledToggleButton = ({
  value,
  selected,
  children,
}: {
  value: string;
  selected: boolean;
  children: React.ReactNode;
}) => (
  <ToggleButton
    value={value}
    style={{
      color: selected ? "#fff" : "#B0BEC5",
    }}
    sx={{
      color: selected ? "#1F1D2B" : "#B0BEC5",
      backgroundColor: selected ? "#69EAE2" : "#2C3248",
      fontWeight: 600,
      borderRadius: "10px",
      px: 3,
      py: 1,
      boxShadow: selected
        ? "0 0 8px rgba(105, 234, 226, 0.6)"
        : "inset 0 0 0 1px #2C3248",
      transition: "all 0.2s ease-in-out",
      "&:hover": {
        backgroundColor: selected ? "#58cfc9" : "#374151",
        color: "#FFF",
      },
    }}
  >
    {children}
  </ToggleButton>
);
