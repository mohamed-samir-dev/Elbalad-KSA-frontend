import { NextResponse } from "next/server";
import { getBackend } from "../admin/_lib";

export async function GET() {
  const res = await fetch(`${getBackend()}/api/admin/company`);
  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
