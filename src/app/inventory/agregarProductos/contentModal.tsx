"use client";
import { useEffect, useState } from "react";
import {
    Box,
    Typography,
    Chip,
    Grid,
    CardHeader,
    Card,
    IconButton,
    CardActions,
    OutlinedInput,
    Button,
} from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
import {
    addCategory,
    addMeasurements,
    getAllCategoriesData,
    getAllMeasurementsDataa,
    removeCategory,
    removeMeasurements,
} from "@/firebase";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
import CloseIcon from '@mui/icons-material/Close';
import DeleteModal from "./deleteModal";

const StyledBadge = styled(Badge)(
    ({ theme }) => `
        .MuiBadge-badge {
            margin-top: 10px;
            margin-right: 12px;
            padding: 0px;
            background-color: #FFF;
            width: 0.6em;
            height: 1em;
        }
    `
);

const StyledChip = styled(Chip)(
    ({ theme }) => `
        .MuiChip-label {
          color: #000;
          font-family: Nunito;
          font-size: 0.875rem;
          font-style: normal;
          font-weight: 500;
          line-height: normal;
        }
    `
);

function NewProductSidebar({ OpenCategory, setOpen }: { OpenCategory: any, setOpen: any }) {
    const [category, setCategory] = useState<[]>([]);
    const [measure, setMeasure] = useState<[]>([]);
    const [newCategory, setNewCategory] = useState<string>("");
    const [newMeasure, setNewMeasure] = useState<string>("");

    useEffect(() => {
        const categoriesData = async () => {
            try {
                await getAllCategoriesData(setCategory);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        categoriesData();
    }, []);

    useEffect(() => {
        const measurementsData = async () => {
            try {
                await getAllMeasurementsDataa(setMeasure);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        measurementsData();
    }, []);

    const handleDelete = async (document: string, tag: string) => {
        if (document === "categories") {
            if (tag) {
                await removeCategory(tag);
            } else {
                enqueueSnackbar("Error al eliminar la categoria", {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "right",
                    },
                });
            }
        } else if (document === "measurements") {
            if (tag) {
                await removeMeasurements(tag);
            } else {
                enqueueSnackbar("Error al eliminar la unidad de medida", {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "right",
                    },
                });
            }
        }
    };

    const handleSave = async (document: string) => {
        if (document === "categories") {
            if (newCategory) {
                await addCategory(newCategory);
            } else {
                enqueueSnackbar("Error al guardar la categoria", {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "right",
                    },
                });
            }
            setNewCategory("");
        } else if (document === "measurements") {
            if (newMeasure) {
                await addMeasurements(newMeasure);
                setNewMeasure("");
            } else {
                enqueueSnackbar("Error al guardar la unidad de medida", {
                    variant: "error",
                    anchorOrigin: {
                        vertical: "bottom",
                        horizontal: "right",
                    },
                });
            }
        }
    };

    const cardContent = (cardTitle: string, document: string, data: any) => {
        return (
            <Card
                sx={{
                    borderRadius: "10px",
                    background: "#1F1D2B",
                    boxShadow: "0px 1px 100px -50px #69EAE2, 0px 4px 250px -50px #69EAE2",
                }}
            >
                <CardHeader
                    title={cardTitle}
                    sx={{
                        color: "#69EAE2",
                        fontFamily: "Nunito",
                        fontSize: "1.5rem",
                        fontStyle: "normal",
                        fontWeight: 500,
                        lineHeight: "normal",
                    }}
                />
                <Box sx={{
                    padding: "0px 16px 16px 16px",
                    maxHeight: "400px",
                    overflowY: "auto",
                }}
                >
                    {data &&
                        data.map((tag: any, i: any) => {
                            return (
                                <StyledBadge
                                    badgeContent={
                                        <DeleteModal document={document} tag={tag} category={tag} />
                                    }
                                    key={i * 9}
                                >
                                    <StyledChip
                                        sx={{
                                            m: 1,
                                            borderRadius: "0.625rem",
                                            background: "#69EAE2",
                                            boxShadow:
                                                "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                                        }}
                                        key={i}
                                        variant='outlined'
                                        label={tag}
                                    />
                                </StyledBadge>
                            );
                        })}
                    {data && data.length === 0 && (
                        <Typography
                            sx={{ py: 2, color: "#FFF" }}
                            variant='subtitle2'
                            textAlign='center'
                        >
                            {document === "categories"
                                ? "No hay categorías para mostrar"
                                : "No hay unidades de medida para mostrar"}
                        </Typography>
                    )}
                </Box>
                <CardActions>
                    <Grid container spacing={3}>
                        <Grid item xs={8}>
                            <OutlinedInput
                                value={document === "categories" ? newCategory : newMeasure}
                                onChange={(e) =>
                                    document === "categories"
                                        ? setNewCategory(e.target.value)
                                        : setNewMeasure(e.target.value)
                                }
                                placeholder={
                                    document === "categories"
                                        ? "Agregar nueva categoría"
                                        : "Agregar unidad de medida"
                                }
                                type='text'
                                sx={{
                                    height: "44.9px",
                                    width: "300px",
                                    borderRadius: "0.625rem",
                                    background: "#2C3248",
                                    boxShadow:
                                        "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                                }}
                                style={{ color: "#FFF" }}
                            />
                        </Grid>
                        <Grid item>
                            <IconButton
                                color='secondary'
                                onClick={() => handleSave(document)}
                            >
                                <Box component={"img"} src={"/images/okay.svg"} />
                            </IconButton>
                        </Grid>
                    </Grid>
                </CardActions>
            </Card>
        );
    };
    return (
        <>
            <SnackbarProvider />
            <Box>
                <Button onClick={() => setOpen(false)}>
                    <CloseIcon />
                </Button>
                <Box display={OpenCategory ? 'block' : 'none'}>
                    {cardContent("CATEGORIAS", "categories", category)}
                </Box>
                <Box display={!OpenCategory ? 'block' : 'none'}>
                    {cardContent("UNIDADES DE MEDIDA", "measurements", measure)}
                </Box>
            </Box>
        </>
    );
}
export default NewProductSidebar;
