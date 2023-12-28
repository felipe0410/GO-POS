import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Box } from "@mui/material";
import Sidebar from "@/components/Sidebar";
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
import { NextResponse } from 'next/server';
const inter = Inter({ subsets: ["latin"] });
import { redirect } from 'next/navigation'

export const metadata: Metadata = {
  title: "GO-POS",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const route: any =
    (children as React.ReactElement)?.props?.childPropSegment ?? null;
  const validationRoutes = ["sign_up", "sign_in", "__DEFAULT__"].includes(
    route
  );
  const cookieStore = cookies()
  const theme = cookieStore?.get('user') ?? { value: "" }

  if (theme?.value.length === 0 && !validationRoutes) {
    console.log('entro aqui');
    redirect('/sign_in');
  }
  if (theme?.value.length > 0 && validationRoutes) {
    console.log('entro aqui2');
    redirect('/');
  }
  return (
    <html lang='en' style={{ height: '100%' }}>
      <body
        style={{
          height: "100%",
          margin: "0",
          background: "#252836",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
        }}
      >
        {validationRoutes
          ? <>
            {children}
          </>
          : <>
            <Box
              id='Container Sidebar'
              sx={{
                zIndex: '10',
                position: "fixed",
                top: 0,
                left: 0,
                height: "100%",
              }}
            >
              <Sidebar />
            </Box>
            <Box
              id='container children layout'
              sx={{
                height: "100%",
                marginTop: "64px",
                marginLeft: { xs: '20px', sm: "244px" },
              }}
            >
              {children}
            </Box>
          </>}
      </body>
    </html>
  );
}
