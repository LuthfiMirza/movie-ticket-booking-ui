"use client";

import { useEffect, useMemo, useState } from "react";
import { cinemas, getCinemasByCity } from "@/lib/data";

const LOCATION_STORAGE_KEY = "cinebook:location";

interface StoredLocation {
  city: string;
  cinemaId: string;
}

function getDefaultLocation(): StoredLocation {
  const firstCinema = cinemas[0];

  return {
    city: firstCinema.city,
    cinemaId: firstCinema.id,
  };
}

function getStoredLocation(): StoredLocation {
  if (typeof window === "undefined") return getDefaultLocation();

  const storedLocation = window.localStorage.getItem(LOCATION_STORAGE_KEY);
  if (!storedLocation) return getDefaultLocation();

  try {
    const parsedLocation = JSON.parse(storedLocation) as StoredLocation;
    const matchingCinema = cinemas.find(
      (cinema) =>
        cinema.id === parsedLocation.cinemaId && cinema.city === parsedLocation.city
    );

    return matchingCinema ? parsedLocation : getDefaultLocation();
  } catch {
    return getDefaultLocation();
  }
}

function saveLocation(location: StoredLocation): void {
  window.localStorage.setItem(LOCATION_STORAGE_KEY, JSON.stringify(location));
}

export default function LocationPicker() {
  const cities = useMemo(
    () => Array.from(new Set(cinemas.map((cinema) => cinema.city))).sort(),
    []
  );
  const [selectedLocation, setSelectedLocation] = useState(getDefaultLocation);

  const cityCinemas = getCinemasByCity(selectedLocation.city);

  useEffect(() => {
    const storedLocation = getStoredLocation();
    setSelectedLocation(storedLocation);
    saveLocation(storedLocation);
  }, []);

  function handleCityChange(city: string) {
    const firstCinemaInCity = getCinemasByCity(city)[0];
    if (!firstCinemaInCity) return;

    const nextLocation = { city, cinemaId: firstCinemaInCity.id };
    setSelectedLocation(nextLocation);
    saveLocation(nextLocation);
  }

  function handleCinemaChange(cinemaId: string) {
    const nextLocation = { ...selectedLocation, cinemaId };
    setSelectedLocation(nextLocation);
    saveLocation(nextLocation);
  }

  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-white/60 bg-white/50 p-3 shadow-sm backdrop-blur-xl sm:flex-row sm:items-center">
      <label className="flex flex-col gap-1 text-xs font-medium uppercase tracking-widest text-neutral-500">
        City
        <select
          value={selectedLocation.city}
          onChange={(event) => handleCityChange(event.target.value)}
          className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm font-medium normal-case tracking-normal text-neutral-800 outline-none transition-colors focus:border-brand"
        >
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </label>

      <label className="flex flex-col gap-1 text-xs font-medium uppercase tracking-widest text-neutral-500">
        Cinema
        <select
          value={selectedLocation.cinemaId}
          onChange={(event) => handleCinemaChange(event.target.value)}
          className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm font-medium normal-case tracking-normal text-neutral-800 outline-none transition-colors focus:border-brand"
        >
          {cityCinemas.map((cinema) => (
            <option key={cinema.id} value={cinema.id}>
              {cinema.name}
            </option>
          ))}
        </select>
      </label>
    </div>
  );
}

export { LOCATION_STORAGE_KEY, getStoredLocation };
export type { StoredLocation };
