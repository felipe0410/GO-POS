"use client";
import { Box, Typography, Checkbox, FormControlLabel } from "@mui/material";
import React, { useState } from "react";
import { StylesSlider } from "@/components/slider/sliderStyles";
import SearchIcon from '@mui/icons-material/Search';
const Slider = ({ checked, setChecked }: { checked: any, setChecked: any }) => {
    // const [checked, setChecked] = useState<boolean>(false);
    const handleChange = (e: any) => {
        e.preventDefault();
        setChecked(!checked);
    };
    return (
        <Box
            id='container slider'
            sx={{
                height: '80%'
            }}
        >
            <Box sx={{
                backgroundColor: "#1F1D2B",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "Nunito",
                borderRadius: "30px",
                width: '60px',
                height: '100%'
            }}>
                <Box
                    sx={{
                        borderRadius: "30px",
                        overflow: "hidden",
                        width: "100%",
                        textAlign: "center",
                        fontSize: "18px",
                        letterSpacing: "1px",
                        position: "relative",
                        color: !checked ? "#69EAE2" : "#1F1D2B",
                    }}
                >
                    <Box sx={{
                        position: "absolute",
                        top: 0,
                        bottom: 0,
                        right: 0,
                        width: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 3,
                        pointerEvents: "none",
                    }}>
                        <SearchIcon sx={{ color: checked ? '#1F1D2B' : "#69EAE2", fontSize: '20px' }} />
                    </Box>
                    <Checkbox
                        checked={checked}
                        onChange={handleChange}
                        sx={{
                            cursor: "pointer",
                            position: "absolute",
                            top: 0,
                            left: 0,
                            bottom: 0,
                            width: "100%",
                            height: "100%",
                            opacity: 0,
                            zIndex: 2,
                        }}
                        id='switch-button-checkbox'
                    />
                    <Box sx={{
                        position: "relative",
                        // padding: "15px 0",
                        display: "block",
                        userSelect: "none",
                        pointerEvents: "none",
                    }}>
                        <Box
                            sx={{
                                position: "absolute",
                                content: '""',
                                background: "#69EAE2",
                                height: "20px",
                                width: "55%",
                                marginTop: '5px',
                                borderRadius: "30px",
                                transition: "transform 300ms",
                                transform: `translateX(${checked ? "26px" : "0"})`,
                            }}
                        />
                        <FormControlLabel
                            control={<span />}
                            htmlFor='switch-button-checkbox'
                            label={
                                <Box sx={{ height: '13px', filter: checked ? "grayscale(-1)" : "brightness(0)" }} component={"img"} src={"/images/scan.svg"} />
                            }
                        />
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default Slider;
