import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    availableReports: [
      { id: "balance-sheet", name: "Balance Sheet" },
      { id: "profit-loss", name: "Profit and Loss" },
      { id: "trial-balance", name: "Trial Balance" }
    ],
    message: "Report generation endpoints are under development."
  })
}
