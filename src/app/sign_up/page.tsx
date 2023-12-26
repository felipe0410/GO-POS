"use client";
import { VisibilityOff, Visibility } from "@mui/icons-material";
import {
  Box,
  FormControl,
  IconButton,
  InputAdornment,
  OutlinedInput,
  TextField,
  Button,
} from "@mui/material";
import Typography from "@mui/material/Typography";
import { JSXElementConstructor, PromiseLikeOfReactNode, ReactElement, ReactNode, ReactPortal, useContext, useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useRouter } from "next/navigation";
import { SnackbarProvider, enqueueSnackbar } from "notistack";
import { creteUser, saveDataUser } from "@/firebase";
import { SidebarContext } from "./context";
import Step_one from "./step1";
import Step_second from "./step2";

const Sing_up = () => {
  const { step, setStep, data, setData, inputs } = useContext(SidebarContext) || {};
  return (
    <>
      {
        (step === 0) ? <Step_one /> : <Step_second />
      }
    </>
  );
};

export default Sing_up;
