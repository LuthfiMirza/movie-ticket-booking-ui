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
    <div className="flex gap-2">
      <label className="relative flex min-w-0 flex-1 items-center gap-2 rounded-full border border-brand/30 bg-white/[0.05] px-3 py-2 backdrop-blur-xl">
        <span className="sr-only">City</span>
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          className="shrink-0 text-brand-light"
        >
          <path
            d="M12 22s7-7.58 7-12.5A7 7 0 0 0 5 9.5C5 14.42 12 22 12 22Z"
            stroke="currentColor"
            strokeWidth="1.8"
          />
          <circle cx="12" cy="9.5" r="2.4" stroke="currentColor" strokeWidth="1.8" />
        </svg>
        <select
          value={selectedLocation.city}
          onChange={(event) => handleCityChange(event.target.value)}
          className="min-w-0 flex-1 truncate bg-transparent pr-4 text-xs font-semibold text-neutral-50 outline-none [appearance:none]"
        >
          {cities.map((city) => (
            <option key={city} value={city} className="bg-neutral-900 text-neutral-100">
              {city}
            </option>
          ))}
        </select>
        <svg
          width="9"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          className="pointer-events-none absolute right-3 text-neutral-400"
        >
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </label>

      <label className="relative flex min-w-0 flex-1 items-center gap-2 rounded-full border border-brand/30 bg-white/[0.05] px-3 py-2 backdrop-blur-xl">
        <span className="sr-only">Cinema</span>
        <svg
          width="13"
          height="13"
          viewBox="0 0 24 24"
          fill="none"
          className="shrink-0 text-brand-light"
        >
          <rect x="3" y="7" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.8" />
          <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="1.8" />
        </svg>
        <select
          value={selectedLocation.cinemaId}
          onChange={(event) => handleCinemaChange(event.target.value)}
          className="min-w-0 flex-1 truncate bg-transparent pr-4 text-xs font-semibold text-neutral-50 outline-none [appearance:none]"
        >
          {cityCinemas.map((cinema) => (
            <option key={cinema.id} value={cinema.id} className="bg-neutral-900 text-neutral-100">
              {cinema.name}
            </option>
          ))}
        </select>
        <svg
          width="9"
          height="6"
          viewBox="0 0 10 6"
          fill="none"
          className="pointer-events-none absolute right-3 text-neutral-400"
        >
          <path d="M1 1l4 4 4-4" stroke="currentColor" strokeWidth="1.6" />
        </svg>
      </label>
    </div>
  );
}

export { LOCATION_STORAGE_KEY, getStoredLocation };
export type { StoredLocation };
