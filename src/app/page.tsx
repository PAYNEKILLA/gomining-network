"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useEffect, useState } from "react";

export default function Page() {
  const { address, isConnected } = useAccount();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  // Auto-check status when the wallet connects
  useEffect(() => {
    let abort = false;

    async function checkValidationStatus() {
      if (!address) return;
      try {
        const res = await fetch(`/api/validate?address=${address}`);
        if (!res.ok) throw new Error("Failed to fetch validation status");
        const data = await res.json();
        if (abort) return;

        if (data.status === "already_validated") {
          setResult("✅ Wallet already validated. Bonus already claimed.");
        } else if (data.status === "not_validated") {
          setResult(null);
        }
      } catch (err) {
        console.error(err);
      }
    }

    checkValidationStatus();
    return () => { abort = true; };
  }, [address]);

  // Manual validate button
  async function validate() {
    if (!address) return;
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch("/api/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Validation failed");

      if (data.status === "validated") {
        setResult("✅ Wallet validated. Bonus unlocked.");
      } else if (data.status === "already_validated") {
        setResult("🟡 Wallet already validated. Bonus already claimed.");
      }
    } catch (err: any) {
      setResult(`❌ ${err.message ?? "Unexpected error"}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-8 max-w-3xl mx-auto text-white">
      <h1 className="text-5xl font-bold">
        GoMining Network <span className="text-emerald-400">Wallet Validation</span>
      </h1>

      <div className="mt-8">
        <ConnectButton />
      </div>

      <div className="mt-6">
        <button
          onClick={validate}
          disabled={!isConnected || loading}
          className="rounded-md bg-green-500 px-5 py-2 font-medium disabled:opacity-50"
        >
          {loading ? "Validating..." : "Validate"}
        </button>
      </div>

      {address && (
        <p className="mt-3 text-sm opacity-70">
          Connected: {address.slice(0, 6)}…{address.slice(-4)}
        </p>
      )}

      {result && <p className="mt-6">{result}</p>}
    </main>
  );
}
