import { NextResponse } from "next/server";
import { getBackend } from "../_lib";

export async function GET() {
  try {
    const res = await fetch(`${getBackend()}/api/checkout`);
    if (!res.ok) {
      return NextResponse.json({ error: `Backend returned ${res.status}` }, { status: res.status });
    }
    const data = await res.json();
    return NextResponse.json(data);
  } catch (e: any) {
    console.error("GET /api/admin/orders failed:", e.message);
    return NextResponse.json({ error: e.message }, { status: 502 });
  }
}
