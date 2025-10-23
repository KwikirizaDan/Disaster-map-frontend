import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const location = searchParams.get("location");

  if (!location) {
    return NextResponse.json({ error: "Location is required" }, { status: 400 });
  }

  // Mock data
  const forecast = {
    location,
    temperature: `${Math.floor(Math.random() * 20) + 10}°C`,
    description: "Sunny with a chance of clouds",
    humidity: `${Math.floor(Math.random() * 50) + 50}%`,
    wind: `${Math.floor(Math.random() * 10) + 5} km/h`,
  };

  return NextResponse.json(forecast);
}
