"use client";
import { useContext, useEffect } from "react";
import { SidebarContext } from "./context";
import Step_one from "./step1";
import Step_second from "./step2";
import Step_third from "./step3";
import { rediret } from "@/firebase";


const Sing_up = () => {
  const { step } = useContext(SidebarContext) || {};
  useEffect(() => {
    rediret("/sign_in")
  }, [])
  return (
    <>
      {
        (step === 0)
          ? <Step_one />
          : (step === 1)
            ? <Step_second />
            : <Step_third />
      }
    </>
  );
};

export default Sing_up;
