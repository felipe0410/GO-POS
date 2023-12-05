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

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "GO-POS",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='en'>
      <body
        style={{
          height: "100%",
          margin: "0",
          background: "#252836",
          backgroundRepeat: "no-repeat",
          backgroundSize: "contain",
        }}
      >
        <Box
          id='Container Sidebar'
          sx={{
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
            marginLeft: "244px",
          }}
        >
          {children}
        </Box>
      </body>
    </html>
  );
}
