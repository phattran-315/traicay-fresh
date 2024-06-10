"use client";
import { PropsWithChildren, useState } from "react";
import dotenv from "dotenv";
import path from "path";
import { trpc } from "@/trpc/trpc-client";
import { httpBatchLink } from "@trpc/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });


const Provider = ({ children }: PropsWithChildren) => {
  const queryClient=new QueryClient()
  const [trpcClient]=  useState(()=>trpc.createClient({
    links: [
      httpBatchLink({
        url: `${process.env.NEXT_PUBLIC_SERVER_URL}/api/trpc`,
        fetch: (url, options) => {
          return fetch(url, { ...options, credentials: "include" });
        },
      }),
    ],
  }))
  return (
    <trpc.Provider queryClient={queryClient} client={trpcClient}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </trpc.Provider>
  );
};

export default Provider;
