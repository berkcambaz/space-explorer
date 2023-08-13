function getLocation(): Promise<GeolocationPosition | undefined> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(undefined);

    navigator.geolocation.getCurrentPosition(
      (pos) => { resolve(pos) },
      (_err) => { resolve(undefined) }
    )
  })
}

function formatDate(date: Date) {
  return Intl.DateTimeFormat("en", { dateStyle: "medium", }).format(date);
}

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