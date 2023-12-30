"use client";
import { useContext } from "react";
import { SidebarContext } from "./context";
import Step_one from "./step1";
import Step_second from "./step2";
import Step_third from "./step3";


const Sing_up = () => {
  const { step } = useContext(SidebarContext) || {};
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
