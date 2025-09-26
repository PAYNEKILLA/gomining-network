// src/app/layout.tsx
import type { Metadata } from 'next';
import './globals.css';

// 👇 import the provider you just created
// ✅ Correct:
import WalletProvider from '../providers/WalletProvider';

export const metadata: Metadata = {
  title: 'GoMining Network',
  description: 'Wallet connect demo with RainbowKit + wagmi',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* 👇 Wrap the whole app */}
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
