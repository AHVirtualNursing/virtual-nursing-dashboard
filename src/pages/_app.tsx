import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { SessionProvider } from "next-auth/react";
import { ProtectedLayout } from "@/components/layouts/protectedLayout";

type AppPropsWithAuth = AppProps & {
  Component: {
    requireAuth?: boolean;
  };
};

export default function App({ Component, pageProps }: AppPropsWithAuth) {
  return (
    <SessionProvider session={pageProps.session}>
      {Component.requireAuth ? (
        <ProtectedLayout>
          <Component {...pageProps} />
        </ProtectedLayout>
      ) : (
        <Component {...pageProps} />
      )}
    </SessionProvider>
  );
}
