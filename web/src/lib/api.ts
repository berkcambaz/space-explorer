import type { IAPOD } from "@/types/apod";
import type { IEPIC } from "@/types/epic";

const apiKey = import.meta.env.VITE_NASA_API_KEY;

/**
 * Fetches the Picture of the Day data from the NASA API.
 * @param isoDate Date in ISO 8601 format (ex. YYYY-MM-DD).
 * @returns Picture of the Day data.
 */
async function pictureOfTheDay(isoDate: string) {
  const result = await fetch(`https://api.nasa.gov/planetary/apod?date=${isoDate}&api_key=${apiKey}`);
  const json = await result.json() as IAPOD;
  return json;
}

/**
 * Fetches the Earth Enhanced data from the NASA API.
 * @param isoDate Date in ISO 8601 format (ex. YYYY-MM-DD). If not supplied, current date is used.
 * @returns Earth Enhanced data.
 */
async function earthEnhanced(isoDate?: string) {
  let url = "";
  if (isoDate) url = `https://api.nasa.gov/EPIC/api/enhanced/date/${isoDate}?api_key=${apiKey}`;
  else url = `https://api.nasa.gov/EPIC/api/enhanced?api_key=${apiKey}`;

  const result = await fetch(url);
  const json = await result.json() as IEPIC[];
  return json;
}

/**
 * Returns the NASA Earth Enhanced image 'src' for 'img' elements. 
 * @param isoDate Date in ISO 8601 format (ex. YYYY-MM-DD).
 * @param image 'image' property from the result of the 'earthEnhanced' function.
 * @returns 'src' property for 'img' elements.
 */
function earthEnhancedSrc(isoDate: string, image: string) {
  return `https://api.nasa.gov/EPIC/archive/enhanced/${isoDate}/jpg/${image}.jpg?api_key=${apiKey}`;
}

/**
 * Returns the NASA Earth image 'src' for 'img' elements. 
 * @param lon Longitude data from geolocation API.
 * @param lat Latitude data from geolocation API.
 * @returns 'src' property for 'img' elements.
 */
function youOnEarthSrc(lon: number, lat: number) {
  return `https://api.nasa.gov/planetary/earth/imagery?lon=${lon}&lat=${lat}&api_key=${apiKey}`
}

export const api = {
  pictureOfTheDay,
  earthEnhanced,

  earthEnhancedSrc,
  youOnEarthSrc,
}