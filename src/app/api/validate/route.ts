import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

// ---- Supabase client (reads from .env.local) ----
const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(url, anon);

// ---- GET /api/validate[?address=0x...] ----
// - No address: { status: "ok" } (health check)
// - With address: already/not validated
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const address = searchParams.get("address");

    if (!address) {
      return NextResponse.json({ status: "ok" });
    }

    const { data, error } = await supabase
      .from("validations")
      .select("validated_at")
      .eq("address", address)
      .maybeSingle();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    if (data) {
      return NextResponse.json({
        status: "already_validated",
        validated_at: data.validated_at,
      });
    }

    return NextResponse.json({ status: "not_validated" });
  } catch (e: any) {
    return NextResponse.json({ error: e.message ?? "Unknown error" }, { status: 500 });
  }
}

// ---- POST /api/validate  (body: { address }) ----
// Inserts once; returns "validated" or "already_validated"
export async function POST(req: Request) {
  try {
    const { address } = await req.json();

    if (!address) {
      return NextResponse.json({ error: "Missing wallet address" }, { status: 400 });
    }

    // check if already exists
    const { data: existing, error: selErr } = await supabase
      .from("validations")
      .select("validated_at")
      .eq("address", address)
      .maybeSingle();

    if (selErr) {
      return NextResponse.json({ error: selErr.message }, { status: 500 });
    }

    if (existing) {
      return NextResponse.json({
        status: "already_validated",
        validated_at: existing.validated_at,
      });
    }

    const { error: insErr } = await supabase
      .from("validations")
      .insert({ address });

    if (insErr) {
      return NextResponse.json({ error: insErr.message }, { status: 500 });
    }

    return NextResponse.json({
      status: "validated",
      address,
      validated_at: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ error: err?.message ?? "Unknown error" }, { status: 500 });
  }
}