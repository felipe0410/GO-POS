import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Box, Typography, Paper, IconButton } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getAllCategoriesData } from "@/firebase";

interface CarouselCategoriasProps {
  onCategorySelect: (category: string) => void;
}

const CarouselCategorias: React.FC<CarouselCategoriasProps> = ({
  onCategorySelect,
}) => {
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = getAllCategoriesData(setCategories);
    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const settings = {
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 5,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 1,
          infinite: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <Box
      sx={{
        width: "90%",
        margin: "0 auto",
        padding: "20px 0",
        backgroundColor: "#1F1D2B",
        borderRadius: "10px",
      }}
    >
      <Typography
        sx={{
          textAlign: "center",
          color: "#69EAE2",
          fontFamily: "Nunito",
          fontSize: "1.25rem",
          fontWeight: 800,
          paddingBottom: "10px",
        }}
      >
        CATEGORIAS
      </Typography>
      <Box>
        <Slider {...settings}>
          {categories.map((category, index) => (
            <Box key={index}>
              <Paper
                onClick={() => onCategorySelect(category)}
                sx={{
                  padding: "8px",
                  textAlign: "center",
                  backgroundColor: "#69EAE2",
                  color: "#1F1D2B",
                  border: "1px solid #69EAE2",
                  borderRadius: "5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 10px",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: "#69EAE2",
                    color: "#1F1D2B",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontSize: "1rem",
                    fontWeight: 700,
                  }}
                >
                  {category}
                </Typography>
              </Paper>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  );
};

export default CarouselCategorias;
