function getLocation(): Promise<GeolocationPosition | undefined> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) return resolve(undefined);

    navigator.geolocation.getCurrentPosition(
      (pos) => { resolve(pos) },
      (_err) => { resolve(undefined) }
    )
  })
}

function formatDate(date: number) {
  return Intl.DateTimeFormat("en", { dateStyle: "medium" }).format(date);
}

export const util = {
  getLocation,
  formatDate,
}