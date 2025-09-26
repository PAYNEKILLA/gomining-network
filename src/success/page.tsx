'use client';

import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount } from 'wagmi';
import { useState } from 'react';

export default function Page() {
  const { address, isConnected } = useAccount();
  const [validated, setValidated] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleValidation = async () => {
    if (!address || loading) return;
    setLoading(true);
    try {
      const res = await fetch('/api/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ address }),
      });
      const data = await res.json();
      if (data?.ok) setValidated(true);
      else alert(data?.error ?? 'Validation failed');
    } catch (e: any) {
      alert(e?.message ?? 'Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-6">
      <h1 className="text-2xl font-bold">GoMining Network</h1>

      <ConnectButton />

      {isConnected && !validated && (
        <button
          onClick={handleValidation}
          disabled={loading}
          className="bg-blue-500 hover:bg-blue-600 disabled:opacity-60 px-6 py-2 rounded font-semibold"
        >
          {loading ? 'Submitting…' : 'Validate Wallet'}
        </button>
      )}

      {validated && (
        <div className="text-center">
          <p className="text-green-400 font-semibold">Validation received!</p>
          <p>You will be credited soon.</p>
        </div>
      )}
    </main>
  );
}
