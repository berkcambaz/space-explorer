import type { IAPOD } from "@/types/apod";
import type { IEPIC } from "@/types/epic";

const apiKey = import.meta.env.VITE_NASA_API_KEY;

async function pictureOfTheDay(isoDate: string) {
  const result = await fetch(`https://api.nasa.gov/planetary/apod?date=${isoDate}&api_key=${apiKey}`);
  const json = await result.json() as IAPOD;
  return json;
}

async function earthEnhanced(isoDate?: string) {
  let url = "";
  if (isoDate) url = `https://api.nasa.gov/EPIC/api/enhanced/date/${isoDate}?api_key=${apiKey}`;
  else url = `https://api.nasa.gov/EPIC/api/enhanced?api_key=${apiKey}`;

  const result = await fetch(url);
  const json = await result.json() as IEPIC[];
  return json;
}

function earthEnhancedSrc(isoDate: string, image: string) {
  return `https://api.nasa.gov/EPIC/archive/enhanced/${isoDate}/jpg/${image}.jpg?api_key=${apiKey}`;
}

function youOnEarthSrc(lon: number, lat: number) {
  return `https://api.nasa.gov/planetary/earth/imagery?lon=${lon}&lat=${lat}&api_key=${apiKey}`
}

export const api = {
  pictureOfTheDay,
  earthEnhanced,

  earthEnhancedSrc,
  youOnEarthSrc,
}