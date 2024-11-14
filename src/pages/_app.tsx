import React from "react";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import "../styles/globalStyles.scss";
import "antd/dist/reset.css";
import "aos/dist/aos.css";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import NextNProgress from "nextjs-progressbar";
import { AppProvider } from "@/components/ContextApi/AppContext";
import { ConfigProvider } from "antd";

function App({ Component, pageProps }: AppProps<{ session: Session }>) {
  return (
    <>
      <AppProvider>
        <SessionProvider session={pageProps.session}>
          <ConfigProvider>
            <NextNProgress />
            <Component {...pageProps} />
          </ConfigProvider>
        </SessionProvider>
      </AppProvider>
    </>
  );
}
export default App;
