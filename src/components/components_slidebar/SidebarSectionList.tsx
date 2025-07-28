// SidebarSectionList.tsx
"use client";
import React from "react";
import Link from "next/link";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { Box } from "@mui/material";

interface Section {
  id: string;
  section: string;
  icon: React.ReactNode | string;
  icon2?: React.ReactNode | string;
  submenus?: { id: string; section: string }[];
}

interface SidebarSectionListProps {
  sections: Section[];
  open: boolean;
  selectedSection: string;
  pathname: string;
  onSectionClick: (sectionId: string) => void;
  slice: (rutaCompleta: string) => string;
  validation: (section: string) => boolean;
}

const SidebarSectionList: React.FC<SidebarSectionListProps> = ({
  sections,
  open,
  selectedSection,
  pathname,
  onSectionClick,
  slice,
  validation,
}) => {
  const isSelected = (id: string) => selectedSection?.includes(id);

  return (
    <Box id="container_section">
      {sections.map((section) => (
        <React.Fragment key={section.id}>
          <Box
            sx={{
              marginY: { sm: "5px" },
              background:
                selectedSection === section.id
                  ? "#252836"
                  : section?.submenus
                  ? isSelected(slice(section.id))
                    ? "#252836"
                    : "transparent"
                  : "transparent",
              marginLeft: "12px",
              padding: "8px",
              borderRadius: "12px 0 0 12px",
              "&:hover": {
                background: "#69eae214",
              },
            }}
          >
            <Link
              href={section.id}
              style={{ textDecoration: "none", color: "#1F1D2B" }}
            >
              <ListItem
                sx={{
                  width: open ? "100%" : "70%",
                  padding: "5px",
                  marginLeft: "5px",
                  borderRadius: "0.5rem",
                  background: isSelected(section.id)
                    ? "#69EAE2"
                    : "auto",
                  boxShadow: isSelected(section.id)
                    ? "0px 8px 24px 0px rgba(105, 234, 226, 0.34)"
                    : "auto",
                }}
                onClick={() => onSectionClick(section.id)}
              >
                <Box
                  sx={{
                    borderRadius: "0.5rem",
                    padding: "0px",
                    display: "flex",
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      justifyContent: "center",
                      paddingLeft: "8px",
                    }}
                  >
                    {typeof (isSelected(section.id)
                      ? section.icon2
                      : section.icon) === "string" ? (
                      <Box
                        component="img"
                        src={
                          isSelected(section.id)
                            ? (section.icon2 as string)
                            : (section.icon as string)
                        }
                        alt="icon"
                      />
                    ) : isSelected(section.id) ? (
                      section.icon2
                    ) : (
                      section.icon
                    )}
                  </ListItemIcon>
                </Box>
                <ListItemText
                  primary={section.section}
                  primaryTypographyProps={{
                    color: !isSelected(section.id) ? "#69EAE2" : "auto",
                    fontFamily: "Nunito",
                    fontSize: "14px",
                    fontStyle: "normal",
                    fontWeight: 700,
                    lineHeight: "normal",
                    marginLeft: "10px",
                  }}
                  sx={{
                    opacity: open ? 1 : 0,
                  }}
                />
              </ListItem>
            </Link>
            {open && section.submenus && isSelected(slice(section.id)) && (
              <List id="subCategory" sx={{ marginLeft: "15px" }}>
                {section.submenus.map((submenu) => (
                  <Link
                    href={submenu.id}
                    key={`submenu-${submenu.id}`}
                    style={{ textDecoration: "none", color: "#1F1D2B" }}
                  >
                    <ListItem>
                      <ListItemText
                        primary={submenu.section}
                        primaryTypographyProps={{
                          color: validation(submenu.id)
                            ? "#69EAE2"
                            : "#fff",
                          fontFamily: "Nunito",
                          fontSize: "14px",
                          fontStyle: "normal",
                          fontWeight: 700,
                          lineHeight: "normal",
                        }}
                        sx={{
                          "&:hover": {
                            opacity: "80%",
                          },
                          opacity: open ? 1 : 0,
                        }}
                      />
                    </ListItem>
                  </Link>
                ))}
              </List>
            )}
          </Box>
        </React.Fragment>
      ))}
    </Box>
  );
};

export default SidebarSectionList;
