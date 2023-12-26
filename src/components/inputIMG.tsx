"use client";
import { Box, Button, Typography } from "@mui/material";
import { RefObject, useEffect, useRef, useState } from "react";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import { storage } from "@/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { enqueueSnackbar } from "notistack";


const ImgInput = ({ data, setData }: { data: any, setData: any }) => {
    console.log(data)
    const [loading, setLoading] = useState(false);
    const [upload, setUpload] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);
    const [productExist, setProductExist] = useState(false);
    const [imageBase64, setImageBase64] = useState("");

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
        console.log("entro a upload");
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
                setData((prevState: any) => ({
                    ...prevState,
                    image: url,
                }));
            }
        );
    };

    const handleAcceptImage = (fileRef: any) => {
        setLoading(true);
        if (fileRef.current?.files?.length) {
            const file = fileRef.current.files[0];
            const fileName = Date.now() + "_" + file.name;
            const imgRef = ref(storage, "images/" + fileName);
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
            img: "",
        }));
    };

    useEffect(() => {
        if (data?.img === "default") {
            console.log('entro aqui')
            setData({ ...data, img: "" })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <Box
                sx={{
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
                        marginTop: "12px",
                        border: "dashed #ffffff47",
                        width: "80%",
                        height: "80%",
                    }}
                >
                    <AddOutlinedIcon
                        sx={{
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
                    }}
                >
                    <img
                        style={{ width: "100%", height: '100%' }}
                        src={imageBase64}
                        alt='Preview'
                    />
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
                        <Button
                            sx={{
                                display: productExist ? "none" : "block",
                                borderRadius: "0.625rem",
                                boxShadow:
                                    "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                                background: "#69EAE2",
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
                                CARGAR
                            </Typography>
                        </Button>
                        <Button
                            sx={{
                                borderRadius: "0.625rem",
                                boxShadow:
                                    "0px 4px 4px 0px rgba(0, 0, 0, 0.25), 0px 4px 4px 0px rgba(0, 0, 0, 0.25)",
                                background: "#69EAE2",
                            }}
                            onClick={() => handleCancel()}
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
                                CANCELAR
                            </Typography>
                        </Button>
                    </Box>
                </Box>
            )}
        </>
    );
}

export default ImgInput