import type { Metadata } from "next";
import "./globals.css";
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
import { GlobalContextProvider } from "./globalContex";
import ContainerChildren from "./ContainerChildren";

export const metadata: Metadata = {
  title: "GO-POS",
  description: "System POS",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const route: any = (children as React.ReactElement)?.props?.childPropSegment ?? null;
  const validationRoutes = ["sign_up", "sign_in","catalog", "__DEFAULT__"].includes(route);

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
              <ContainerChildren childrenn={children} validationRoutes={validationRoutes} />
            </>
          }
        </body>
      </GlobalContextProvider>
    </html>
  );
}
