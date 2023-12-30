'use client'
import Sidebar from "@/components/Sidebar"
import { useContext } from "react";
import { GlobalContext } from "./globalContex";

const ContainerSidebar = () => {
    const { isOpen, setIsOpen } = useContext(GlobalContext) || {};
    return (
        <>
            <Sidebar open={isOpen} setOpen={setIsOpen} />
        </>
    )
}

export default ContainerSidebar

