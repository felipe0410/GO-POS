import React, { useEffect, useState } from "react";
import Slider from "react-slick";
import { Box, Typography, Paper } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { getAllCategoriesData } from "@/firebase";

interface CarouselCategoriasProps {
  onCategorySelect: (category: string) => void;
  selectedCategory: string | null;
}

const CarouselCategorias: React.FC<CarouselCategoriasProps> = ({
  onCategorySelect,
  selectedCategory,
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
          slidesToShow: 2,
          slidesToScroll: 2,
        },
      },
    ],
  };

  return (
    <Box
      sx={{
        width: "90%",
        margin: "0 auto",
        padding: { xs: "10px", sm: "20px 0" },
        backgroundColor: "#1F1D2B",
        borderRadius: "10px",
      }}
    >
      <Typography
        sx={{
          textAlign: "center",
          color: "#69EAE2",
          fontFamily: "Nunito",
          fontSize: { xs: "14px", sm: "1.25rem" },
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
                  padding: {xs:'0px',sm:"8px"},
                  textAlign: "center",
                  backgroundColor:
                    selectedCategory === category ? "#69EAE2" : "#1F1D2B",
                  color: selectedCategory === category ? "#1F1D2B" : "#fff",
                  borderRadius: "5px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 10px",
                  cursor: "pointer",
                  "&:hover": {
                    backgroundColor: !(selectedCategory === category)
                      ? "#69EAE2"
                      : "#69eae247",
                    color: !(selectedCategory === category)
                      ? "#1F1D2B"
                      : "#fff",
                    opacity: "80%",
                  },
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "Nunito",
                    fontSize: { xs: "12px", sm: "1rem" },
                    fontWeight: 800,
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
