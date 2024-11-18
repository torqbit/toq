import React, { useEffect } from "react";
import type { AppProps } from "next/app";
import "../styles/globals.css";
import "../styles/globalStyles.scss";
import "antd/dist/reset.css";
import "aos/dist/aos.css";
import { SessionProvider } from "next-auth/react";
import { Session } from "next-auth";
import NextNProgress from "nextjs-progressbar";
import { AppProvider } from "@/components/ContextApi/AppContext";

function App({ Component, pageProps }: AppProps<{ session: Session }>) {
  return (
    <>
      <AppProvider>
        <SessionProvider session={pageProps.session}>
          <NextNProgress color="var(--btn-primary)" />
          <Component {...pageProps} />
        </SessionProvider>
      </AppProvider>
    </>
  );
}
export default App;
