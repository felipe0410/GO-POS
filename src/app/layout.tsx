import type { Metadata } from "next";
import "./globals.css";
import { Box } from "@mui/material";
import "@fontsource/nunito/200.css";
import "@fontsource/nunito/300.css";
import "@fontsource/nunito/400.css";
import "@fontsource/nunito/500.css";
import "@fontsource/nunito/600.css";
import "@fontsource/nunito/700.css";
import "@fontsource/nunito/800.css";
import "@fontsource/nunito/900.css";
import "@fontsource/nunito-sans/200.css";
import "@fontsource/nunito-sans/300.css";
import "@fontsource/nunito-sans/400.css";
import "@fontsource/nunito-sans/500.css";
import "@fontsource/nunito-sans/600.css";
import "@fontsource/nunito-sans/700.css";
import "@fontsource/nunito-sans/800.css";
import "@fontsource/nunito-sans/900.css";
import { cookies } from 'next/headers'
import { GlobalContextProvider } from "./globalContex";
import ContainerSidebar from "./ContainerSidebar";
import ContainerChildren from "./ContainerChildren";

export const metadata: Metadata = {
  title: "GO-POS",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const route: any = (children as React.ReactElement)?.props?.childPropSegment ?? null;
  const validationRoutes = ["sign_up", "sign_in", "__DEFAULT__"].includes(route);
  const cookieStore = cookies()
  return (
    <html lang='en' style={{ height: '100%' }}>
      <GlobalContextProvider>
        <body
          style={{
            height: "100%",
            margin: "0",
            background: "#252836",
            backgroundRepeat: "no-repeat",
            backgroundSize: "contain",
          }}
        >
          {
            <>
              <Box
                id='Container Sidebar'
                sx={{
                  display: validationRoutes ? "none" : 'block',
                  zIndex: validationRoutes ? "" : '10',
                  position: validationRoutes ? "" : "fixed",
                  top: 0,
                  left: 0,
                  height: "100%",
                }}
              >
                <ContainerSidebar />
              </Box>
              <>
                <ContainerChildren childrenn={children} validationRoutes={validationRoutes} />
              </>
            </>}
        </body>
      </GlobalContextProvider>
    </html>
  );
}
