import { Box } from "@mui/material";
import { SidebarProvider } from "./context";
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export default function LogginLayout({ children }: { children: React.ReactNode }) {
    const route: any = (children as React.ReactElement)?.props?.childPropSegment ?? null;
    const validationRoutes = ["sign_up", "sign_in", "__DEFAULT__"].includes(route);
    const cookieStore = cookies()
    const theme = cookieStore?.get('user') ?? { value: "" }
    if (theme?.value.length > 0 && validationRoutes) {
        console.log('entro aqui2');
        redirect('/');
    }
    
    return (
        <section style={{ height: '100%' }}>
            <SidebarProvider>
                <Box sx={{
                    height: '100%',
                    backgroundImage: { xs: 'url("images/loggin_responsive.png")', lg: 'url("images/loggin.png")' },
                    backgroundRepeat: 'no-repeat',
                    backgroundSize: 'cover',
                    backgroundPosition: "center"
                }}>
                    {children}
                </Box>
            </SidebarProvider>
        </section >
    )
}