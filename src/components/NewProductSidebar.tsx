"use client";
import { useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Divider,
  Grid,
  CardHeader,
  Card,
  TextField,
  IconButton,
  Tooltip,
  CardActions,
  CircularProgress,
} from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import Alert from "@mui/material/Alert";
import CancelIcon from "@mui/icons-material/Cancel";
import DeleteIcon from "@mui/icons-material/Delete";
import ClearIcon from "@mui/icons-material/Clear";
//import { CompleteTags } from './Interface';
import Badge from "@mui/material/Badge";
import { styled } from "@mui/material/styles";
//import uniqid from 'uniqid';

const StyledBadge = styled(Badge)(
  ({ theme }) => `
        .MuiBadge-badge {
            margin-top: 10px;
            margin-right: 12px;
        }
    `
);

function NewProductSidebar(props: any) {
  //   const { t }: { t: any } = useTranslation();
  //   const restName = localStorage.getItem("restName") ?? ""
  //   const [category, setCategory] = useState<string>('')
  //   const [measure, setMeasure] = useState<string>('');
  //   const [categoryOld, setCategoryOld] = useState<string>('')
  //   const [measureOld, setMeasureOld] = useState<string>('');
  //   const [editCategory, setEditCategory] = useState<boolean>(false)
  //   const [editMeasure, setEditMeasure] = useState<boolean>(false)
  //   const [saving, setSaving] = useState<string>('')
  //   const [deleteChip, setDeleteChip] = useState<string>('')
  //   const [deleteElement, setDeleteElement] = useState<CompleteTags>()
  //   const [error, setError] = useState<string>('');

  //   const handleDeleteCard = async (document: string, tag: CompleteTags) => {
  //     setDeleteChip(document)
  //     setDeleteElement(tag)
  //     if(document === 'categories') {
  //         setEditCategory(false)
  //         setCategory('')
  //         setCategoryOld('')
  //     } else {
  //         setEditMeasure(false)
  //         setMeasure('')
  //         setMeasureOld('')
  //     }
  //   }

  //   const handleDeleteElement = async () => {
  //     try {
  //         let deleteField = deleteChip === "categories" ? props.categoryArray : props.measureArray
  //         let deleteFieldTags = deleteChip === "categories" ? props.categoryTags : props.unitsTags
  //         deleteFieldTags = deleteFieldTags.filter((tag) => tag.id !== deleteElement.id )
  //         if(deleteChip === "categories") {
  //             props.setCategoryTags(deleteFieldTags)
  //         } else {
  //             props.setUnitsTags(deleteFieldTags)
  //         }
  //         delete deleteField[deleteElement.id]
  //         await deleteKeyDocument(`${restName}/inventory/config`, deleteChip, `data.${deleteElement.id}`)
  //         await deleteKeyDocument(`${restName}/inventory/config`, deleteChip, deleteElement.id)
  //     } catch (e) {
  //         console.error(e)
  //     }
  //     setDeleteChip('')
  //   }

  //   const handleEditCard = (document: string, label: string, editing: boolean) => {
  //     setDeleteChip('')
  //     if(document === 'categories') {
  //         setEditCategory(editing)
  //         setCategory(label)
  //         setCategoryOld(label)
  //     } else {
  //         setEditMeasure(editing)
  //         setMeasure(label)
  //         setMeasureOld(label)
  //     }
  //   }

  //   const saveElement = async (arrayElement: any, document: string, newElement: string) => {
  //       try {
  //         let exist: boolean = false
  //         Object.entries(arrayElement).forEach(([id, value]) => {
  //             if(value.toString().toLowerCase() === newElement.toLowerCase()) { exist = true }
  //         })
  //         if(!exist && restName) {
  //             setSaving(document)
  //             const id = uniqid()
  //             arrayElement[id] = newElement
  //             await saveDoc(`${restName}/inventory/config`, document, { data: arrayElement, [id]: 0 } )
  //             if(document === 'categories') {
  //                 let categoriesArray = props.categoryTags
  //                 categoriesArray.push({ id: id, label: newElement, products: 0 })
  //             } else if (document === 'measureUnits') {
  //                 let unitsArray = props.unitsTags
  //                 unitsArray.push({ id: id, label: newElement, products: 0  })
  //             }
  //             handleEditCard(document, '', false)
  //             setSaving('')
  //         }
  //       } catch (e) {
  //           console.error(e)
  //           handleEditCard(document, '', false)
  //           setSaving('')
  //       }
  //   }

  //   const editElement = async (arrayElement: any[], tags: any[], document: string, newElement: string, oldElement: string) => {
  //     try {
  //         if(restName && newElement !== oldElement) {
  //             setSaving(document)
  //             Object.keys(arrayElement).forEach((id) => {
  //                 if(arrayElement[id] === oldElement) {
  //                     arrayElement[id] = newElement
  //                     tags.forEach((tag, idx) => {
  //                         if(tag.id === id) {
  //                             tags[idx].label = newElement
  //                         }
  //                     });
  //                 }
  //             })
  //             await saveDoc(`${restName}/inventory/config`, document, { data: arrayElement } )
  //             setSaving('')
  //             setCategoryOld('')
  //             setMeasureOld('')
  //         }
  //         handleEditCard(document, '', false)
  //     } catch (e) {
  //         console.error(e)
  //         handleEditCard(document, '', false)
  //         setSaving('')
  //     }
  //   }

  //   const setErrorState = (document: string) => {
  //     setError(document)
  //     if(document) {
  //         setTimeout(() => {
  //             setError('')
  //         }, 3000);
  //     }
  //   }

  //   const handleSave = async (document: string) => {
  //       if(document === 'categories') { //when click save of category component
  //         if(category) { //Exist value to category
  //             setErrorState('')
  //             if(editCategory) { //Editing category
  //                 await editElement(props.categoryArray, props.categoryTags, document, category, categoryOld)
  //             } else { // save new category
  //                 await saveElement(props.categoryArray, document, category)
  //             }
  //         } else { //no value for input category
  //             setErrorState(document)
  //         }
  //       } else if(document === 'measureUnits') { //when click save of measure units component
  //         if(measure) { //Exist value to measure units
  //             setErrorState('')
  //             if(editMeasure) { //Editing measure units
  //                 await editElement(props.measureArray, props.unitsTags, document, measure, measureOld)
  //             } else { // save new measure units
  //                 await saveElement(props.measureArray, document, measure)
  //             }
  //         } else { //no value for input measure units
  //             setErrorState(document)
  //         }
  //       }
  //   }

  const tagsMedidas = ["litros", "sobres", "kilos", "prueba"];
  const tagsCategoria = ["Arte", "Cuaderno", "Prueba", "prueba"];

  const cardContent = (cardTitle: string, document: string, data: any) => {
    return (
      <Card
        sx={{
          marginLeft: "2.2rem",
          marginBottom: "3rem",
          borderRadius: "0.625rem",
          background: "#1F1D2B",
          boxShadow: "0px 1px 100px -50px #69EAE2",
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
        <Divider />
        <Box p={2}>
          {/* {deleteChip === document && (
            <Alert
              icon={false}
              severity='warning'
              variant='filled'
              action={
                <>
                  <Tooltip arrow title={t("Delete")}>
                    <IconButton
                      style={{ color: "white" }}
                      onClick={() => handleDeleteElement()}
                    >
                      <DeleteIcon fontSize='small' style={{ color: "white" }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip arrow title={t("Cancel")}>
                    <IconButton
                      style={{ color: "white" }}
                      onClick={() => setDeleteChip("")}
                    >
                      <ClearIcon fontSize='small' style={{ color: "white" }} />
                    </IconButton>
                  </Tooltip>
                </>
              }
            >
              {t("Do you want to delete ")}
              <b>{deleteElement.label}</b>
              {"?"}
            </Alert>
          )} */}
          {data &&
            data.map((tag: any, i: any) => {
              return (
                <StyledBadge
                  badgeContent={tag.products}
                  color='primary'
                  key={i * 9}
                >
                  <Chip
                    sx={{ m: 1 }}
                    key={i}
                    variant='outlined'
                    label={tag.label}
                    // onClick={
                    //   tag.products === 0
                    //     ? () => handleEditCard(document, tag.label, true)
                    //     : null
                    // }
                    // onDelete={
                    //   tag.products === 0
                    //     ? () => handleDeleteCard(document, tag)
                    //     : null
                    // }
                    // disabled={saving === document ? true : false}
                  />
                </StyledBadge>
              );
            })}
          {data && data.length === 0 && (
            <Typography sx={{ py: 2 }} variant='subtitle2' textAlign='center'>
              {document === "categories"
                ? "There are no categories"
                : "There are no measurement units"}
            </Typography>
          )}
          <Divider style={{ margin: "8px 0px" }} />
          <CardActions>
            <Grid container spacing={3}>
              <Grid item xs={8}>
                <TextField
                  fullWidth
                  //   error={error === document ? true : false}
                  //   value={document === "categories" ? category : measure}
                  //   onChange={(e) =>
                  //     document === "categories"
                  //       ? setCategory(e.target.value)
                  //       : setMeasure(e.target.value)
                  //   }
                  name={"input"}
                  variant='standard'
                  placeholder={
                    document === "categories"
                      ? "Agregar nueva categoría"
                      : "Agregar nueva unidad de medida"
                  }
                  //   disabled={saving === document ? true : false}
                />
              </Grid>
              <Grid item xs={2}>
                <Tooltip arrow title={"Save"}>
                  <IconButton
                    // disabled={saving === document ? true : false}
                    color='primary'
                    // onClick={() => handleSave(document)}
                  >
                    {/* {saving === document ? (
                      <CircularProgress size='1.3rem' color='primary' />
                    ) : (
                      <SaveIcon fontSize='small' color='primary' />
                    )} */}
                  </IconButton>
                </Tooltip>
              </Grid>
              <Grid item xs={2}>
                <Tooltip arrow title={"Cancel"}>
                  <IconButton
                    // disabled={saving === document ? true : false}
                    color='secondary'
                    // onClick={() => handleEditCard(document, "", false)}
                  >
                    <Box component={"img"} src={"/images/okay.svg"} />
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </CardActions>
        </Box>
      </Card>
    );
  };

  return (
    <Box>
      {cardContent("CATEGORIAS", "categories", tagsCategoria)}
      {cardContent("UNIDADES DE MEDIDA", "measurements", tagsMedidas)}
    </Box>
  );
}

export default NewProductSidebar;
