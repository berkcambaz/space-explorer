/**
 * Tries to retrieve geolocation data using geolocation API.
 * @returns A promise that resolves with the geolocation data or undefined.
 */
function getLocation(): Promise<GeolocationPosition | undefined> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(undefined);

    navigator.geolocation.getCurrentPosition(
      (pos) => { resolve(pos) },
      (_err) => { resolve(undefined) }
    )
  })
}

/**
 * Convert javascript Date object to human readable date string.
 * @param date Date to be formatted.
 * @returns Date string (ex. Aug 14, 2023).
 */
function formatDate(date: Date) {
  return Intl.DateTimeFormat("en", { dateStyle: "medium", }).format(date);
}

/**
 * Converts javascript Date object to ISO date (used mainly by NASA APIs).
 * @param date Date to be formatted.
 * @returns ISO date string (ex. YYYY-MM-DD).
 */
function dateToISO(date: Date) {
  return new Date(date.getTime() - new Date().getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 10)
}

export const util = {
  getLocation,

  formatDate,
  dateToISO,
}