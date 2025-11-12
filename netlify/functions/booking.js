export async function handler() {
  const url = "https://railway.gov.tm/railway-api/bookings/QUAPWZ";

  const response = await fetch(url, {
    headers: {
      Accept: "application/json, text/plain, */*",
      "X-Device-Id": "a77b5c929d9403811356e4dcf959973f",
    },
  });

  const data = await response.json();

  return {
    statusCode: 200,
    body: JSON.stringify(data),
  };
}
