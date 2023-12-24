import { Box } from "@mui/material";

export default function LogginLayout({ children }: { children: React.ReactNode }) {
    return (
        <section style={{ height: '100%' }}>
            <Box sx={{
                height: '100%',
                backgroundImage: { xs: 'url("images/loggin_responsive.png")', lg: 'url("images/loggin.png")' },
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                backgroundPosition: "center"
            }}>
                {children}
            </Box>
        </section >
    )
}