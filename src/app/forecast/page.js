"use client";

import NonAuthHeader from "@/components/NonAuthHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export const metadata = {
  title: "Weather Forecast",
  description: "Get the weather forecast for any location.",
};

export default function ForecastPage() {
  const [location, setLocation] = useState("");
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getForecast = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/weather/forecast?location=${location}`);
      if (!response.ok) {
        throw new Error("Failed to fetch forecast");
      }
      const data = await response.json();
      setForecast(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <NonAuthHeader />
      <div className="p-8">
        <Card>
          <CardHeader>
            <CardTitle>Weather Forecast</CardTitle>
            <CardDescription>Enter a location to get the weather forecast.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={getForecast}>
              <div className="grid w-full items-center gap-4">
                <div className="flex flex-col space-y-1.5">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    placeholder="Enter a location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  {loading ? "Getting Forecast..." : "Get Forecast"}
                </Button>
              </div>
            </form>
            {error && <p className="text-red-500 mt-4">{error}</p>}
            {forecast && (
              <div className="mt-4">
                <h3 className="text-lg font-bold">{forecast.location}</h3>
                <p>Temperature: {forecast.temperature}</p>
                <p>Description: {forecast.description}</p>
                <p>Humidity: {forecast.humidity}</p>
                <p>Wind: {forecast.wind}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
}
