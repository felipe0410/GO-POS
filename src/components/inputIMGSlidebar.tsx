"use client";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { RefObject, useEffect, useRef, useState } from "react";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { storage } from "@/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { enqueueSnackbar } from "notistack";
import LinearBuffer from "./progress";


const ImgInputSlidebar = ({ data, setData, folderSaved, fiel = "img", imageBase64, setImageBase64 }: { data: any, setData: any, folderSaved: string, fiel?: string, imageBase64: any, setImageBase64: any }) => {
    const [loading, setLoading] = useState(false);
    const [upload2, setupload2] = useState(false)
    const [upload, setUpload] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);
    const [productExist, setProductExist] = useState(false);

    const uploadImage = (fileRef: RefObject<HTMLInputElement>) => {
        if (fileRef.current?.files?.length) {
            const file = fileRef.current.files[0];
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64String: any = event?.target?.result;
                if (base64String) setImageBase64(base64String);
            };
            reader.readAsDataURL(file);
        } else {
            console.error("No file selected");
        }
    };
    const uploadImageToFirebase = (imgRef: any, file: any) => {
        const imgUpload = uploadBytesResumable(imgRef, file);
        imgUpload.on(
            "state_changed",
            ({ state }) => {
                switch (state) {
                    case "paused":
                        console.log("Upload is paused");
                        break;
                    case "running":
                        console.log("Upload is running");
                        break;
                    default:
                        break;
                }
            },
            (err) => {
                console.error(err);
            },
            async () => {
                const url = await getDownloadURL(imgUpload.snapshot.ref);
                setupload2(false)
                setData((prevState: any) => ({
                    ...prevState,
                    [fiel]: url,
                }));
            }
        );
    };

    const handleAcceptImage = (fileRef: any) => {
        setLoading(true);
        setupload2(true)
        if (fileRef.current?.files?.length) {
            const file = fileRef.current.files[0];
            const fileName = Date.now() + "_" + file.name;
            const imgRef = ref(storage, `${folderSaved}/` + fileName);
            uploadImageToFirebase(imgRef, file);
            setLoading(false);
            setProductExist(true)
        } else {
            enqueueSnackbar("No ha seleccionado ninguna imagen", {
                variant: "error",
                anchorOrigin: {
                    vertical: "bottom",
                    horizontal: "right",
                },
            });
            setLoading(false);
        }
    };
    const handleCancel = () => {
        setImageBase64("");
        setUpload(false);
        setData((prevState: any) => ({
            ...prevState,
            [fiel]: "",
        }));
    };

    useEffect(() => {
        if (data[fiel] === "default") {
            setData({ ...data, [fiel]: "" })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (imageBase64.length === 0) { setUpload(false) } else {
            setUpload(true)
        }
    }, [imageBase64])
    return (
        <>
            <Box
                sx={{
                    // padding: '10px',
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                    width: "100%",
                    height: "100%",
                    borderRadius: "0.625rem",
                    background: "#2C3248",
                    display: upload ? "none" : "flex",
                    boxShadow:
                        "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                }}
            >
                <Button
                    component='label'
                    sx={{
                        
                        width: "80%",
                        height: "80%",
                    }}
                >
                    <AddOutlinedIcon
                        sx={{
                            border: "dashed 5px #ffffff47 ",
                            color: "#FFF",
                            fontSize: "30px",
                        }}
                    />
                    <input
                        style={{
                            overflow: "hidden",
                            clip: "rect(0 0 0 0)",
                            clipPath: "inset(50%)",
                            height: 1,
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            whiteSpace: "nowrap",
                            width: 1,
                        }}
                        accept='image/*'
                        ref={fileRef}
                        onChange={() => {
                            setUpload(true);
                            setProductExist(false);
                            uploadImage(fileRef);
                        }}
                        type='file'
                    />
                </Button>
            </Box>

            {imageBase64 && (
                <Box
                    id='contianer_img'
                    sx={{
                        justifyContent: "center",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        width: "100%",
                        maxHeight: '30vh',
                        height: '100%'
                    }}
                >
                    <img
                        style={{ width: "100%", height: '80%' }}
                        src={imageBase64}
                        alt='Preview'
                    />
                    <Box sx={{ display: upload2 ? 'block' : 'none', width: '100%', marginTop: '10px' }}>
                        <LinearBuffer />
                    </Box>
                    <Box
                        sx={{
                            width: "90%",
                            justifyContent: "space-evenly",
                            marginY: "10px",
                        }}
                        display={
                            data?.img?.length > 0 && !productExist
                                ? "none"
                                : "flex"
                        }
                    >
                        {/* <Button
                            sx={{
                                display: productExist ? "none" : "block",
                                borderRadius: "0.625rem",
                                boxShadow:
                                    "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                                background: "#69EAE2",
                                width: '45%'
                            }}
                            onClick={() => {
                                handleAcceptImage(fileRef);
                            }}
                        >
                            <Typography
                                sx={{
                                    color: "#1F1D2B",
                                    textAlign: "center",
                                    fontFamily: "Nunito",
                                    fontSize: "0.7rem",
                                    fontStyle: "normal",
                                    fontWeight: 700,
                                    lineHeight: "normal",
                                }}
                            >
                                {
                                    loading
                                        ? <CircularProgress />
                                        : "CARGAR"
                                }

                            </Typography>
                        </Button> */}
                        <Button
                            sx={{
                                display: productExist ? "none" : "block",
                                borderRadius: "0.625rem",
                                boxShadow:
                                    "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                                background: "#69EAE2",
                                width: '100%'
                            }}
                            onClick={() => handleCancel()}
                        >
                            <Typography
                                sx={{
                                    color: "#1F1D2B",
                                    textAlign: "center",
                                    fontFamily: "Nunito",
                                    fontSize: "10px",
                                    fontStyle: "normal",
                                    fontWeight: 900,
                                    lineHeight: "normal",
                                }}
                            >
                                {
                                    loading
                                        ? <CircularProgress />
                                        : "BORRAR"
                                }
                            </Typography>
                        </Button>
                    </Box>
                </Box>
            )}
        </>
    );
}

export default ImgInputSlidebar