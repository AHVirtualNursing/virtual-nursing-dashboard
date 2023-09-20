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
  const content =
    Component.requireAuth === undefined ? (
      // <ProtectedLayout>
      <Component {...pageProps} />
    ) : (
      // </ProtectedLayout>
      <Component {...pageProps} />
    );

  return (
    <SessionProvider session={pageProps.session}>{content}</SessionProvider>
  );
}
