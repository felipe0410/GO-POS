import { Box } from "@mui/material";
import { SidebarProvider } from "./context";

export default function LogginLayout({ children }: { children: React.ReactNode }) {
    return (
        <section style={{ height: '100%' }}>
            <SidebarProvider>
                <Box sx={{
                    height: '100%',
                }}>
                    {children}
                </Box>
            </SidebarProvider>
        </section >
    )
}