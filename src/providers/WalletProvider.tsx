"use client";

import React from "react";
import {
  getDefaultConfig,
  RainbowKitProvider,
  darkTheme,
} from "@rainbow-me/rainbowkit";
import { WagmiProvider } from "wagmi";
import { mainnet, polygon, base, arbitrum, optimism } from "wagmi/chains";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID!;
if (!projectId) {
  // helpful during dev so it fails loudly if the env var is missing
  // (you can remove this after everything works)
  throw new Error("Missing NEXT_PUBLIC_WC_PROJECT_ID in .env.local");
}

const wagmiConfig = getDefaultConfig({
  appName: "GoMining Network",
  projectId,
  chains: [polygon, base, arbitrum, optimism, mainnet],
  ssr: true,
});

const queryClient = new QueryClient();

export default function WalletProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider
          theme={darkTheme({
            accentColor: "#6c5cff", // your purple
          })}
        >
          {children}
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
